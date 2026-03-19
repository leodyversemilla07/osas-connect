<?php

namespace App\Services;

use App\Events\ScholarshipApplicationStatusChanged;
use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipNotification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ScholarshipWorkflowService
{
    public function __construct(
        private readonly ScholarshipEligibilityService $eligibilityService
    ) {}

    public function submitApplication(Scholarship $scholarship, User $user, array $data): ScholarshipApplication
    {
        $user->loadMissing('studentProfile');
        $studentProfile = $user->studentProfile;

        if (! $studentProfile) {
            throw new InvalidArgumentException('Student profile not found.');
        }

        if (! $scholarship->isAcceptingApplications()) {
            throw new InvalidArgumentException('This scholarship is not accepting applications at this time.');
        }

        $eligibility = $this->eligibilityService->checkEligibility($studentProfile, $scholarship);
        if (! $eligibility['eligible']) {
            throw new InvalidArgumentException('User is not eligible for this scholarship');
        }

        $existingApplication = ScholarshipApplication::query()
            ->where('scholarship_id', $scholarship->id)
            ->where('user_id', $user->id)
            ->whereNotIn('status', [ScholarshipApplication::STATUS_REJECTED, ScholarshipApplication::STATUS_END])
            ->exists();

        if ($existingApplication) {
            throw new InvalidArgumentException('User already has an application for this scholarship');
        }

        return DB::transaction(function () use ($scholarship, $user, $studentProfile, $data) {
            $documents = $this->processDocuments($data['documents'] ?? []);
            $requiredDocumentKeys = array_keys($scholarship->getRequiredDocuments());
            $missingDocuments = array_diff($requiredDocumentKeys, array_keys($documents));

            if ($missingDocuments !== []) {
                throw new InvalidArgumentException('Please upload all required documents before submitting your application.');
            }

            $applicationData = $this->sanitizeApplicationData($data);
            $application = new ScholarshipApplication([
                'scholarship_id' => $scholarship->id,
                'user_id' => $user->id,
                'application_data' => $applicationData,
                'purpose_letter' => $applicationData['personal_statement'] ?? null,
                'status' => ScholarshipApplication::STATUS_SUBMITTED,
                'current_step' => 'document_submission',
                'applied_at' => now(),
                'uploaded_documents' => $documents,
            ]);

            $application->setRelation('studentProfile', $studentProfile);
            $application->setRelation('scholarship', $scholarship);
            $application->save();

            $this->notifySubmitted($application);

            return $application;
        });
    }

    public function transitionApplicationStatus(
        ScholarshipApplication $application,
        string $targetStatus,
        ?User $actor = null,
        ?string $feedback = null
    ): ScholarshipApplication {
        if ($application->status === $targetStatus) {
            if ($feedback) {
                $application->update(['verifier_comments' => $feedback]);
            }

            return $application->fresh();
        }

        if (! $application->canTransitionTo($targetStatus)) {
            throw new InvalidArgumentException("Cannot transition from {$application->status} to {$targetStatus}");
        }

        DB::transaction(function () use ($application, $targetStatus, $actor, $feedback): void {
            $application->updateStatus($targetStatus, $feedback, $actor?->id);
            $application->update([
                'current_step' => $this->resolveCurrentStep($targetStatus),
            ]);
        });

        $application = $application->fresh();
        $this->notifyStatusChanged($application);

        return $application;
    }

    public function synchronizeAfterDocumentReview(ScholarshipApplication $application): ScholarshipApplication
    {
        $requiredDocumentTypes = array_keys(DocumentVerificationService::REQUIRED_DOCUMENTS[$application->scholarship->type] ?? []);

        if ($requiredDocumentTypes === []) {
            return $application->fresh();
        }

        $documents = $application->documents()
            ->whereIn('type', $requiredDocumentTypes)
            ->get()
            ->keyBy('type');

        $allRequiredUploaded = collect($requiredDocumentTypes)
            ->every(fn (string $documentType) => $documents->has($documentType));

        if (! $allRequiredUploaded) {
            return $application->fresh();
        }

        $hasRejectedDocument = $documents->contains(
            fn (Document $document) => $document->status === Document::STATUS_REJECTED
        );

        if ($hasRejectedDocument && $application->status === ScholarshipApplication::STATUS_UNDER_VERIFICATION) {
            return $this->transitionApplicationStatus($application, ScholarshipApplication::STATUS_INCOMPLETE);
        }

        $allVerified = $documents->every(
            fn (Document $document) => $document->status === Document::STATUS_VERIFIED
        );

        if ($allVerified && $application->status === ScholarshipApplication::STATUS_UNDER_VERIFICATION) {
            return $this->transitionApplicationStatus($application, ScholarshipApplication::STATUS_VERIFIED);
        }

        return $application->fresh();
    }

    public function markInterviewScheduled(ScholarshipApplication $application): ScholarshipApplication
    {
        if ($application->status === ScholarshipApplication::STATUS_UNDER_EVALUATION) {
            return $application->fresh();
        }

        return $this->transitionApplicationStatus($application, ScholarshipApplication::STATUS_UNDER_EVALUATION);
    }

    public function applyInterviewRecommendation(
        ScholarshipApplication $application,
        string $recommendation
    ): ScholarshipApplication {
        return match ($recommendation) {
            'approved' => $this->transitionApplicationStatus($application, ScholarshipApplication::STATUS_APPROVED),
            'rejected' => $this->transitionApplicationStatus($application, ScholarshipApplication::STATUS_REJECTED),
            'pending' => $this->markInterviewScheduled($application),
            default => throw new InvalidArgumentException("Unsupported interview recommendation: {$recommendation}"),
        };
    }

    public function resetAfterInterviewCancellation(ScholarshipApplication $application): ScholarshipApplication
    {
        if ($application->status === ScholarshipApplication::STATUS_VERIFIED) {
            return $application->fresh();
        }

        return $this->transitionApplicationStatus($application, ScholarshipApplication::STATUS_VERIFIED);
    }

    private function processDocuments(array $documents): array
    {
        $processed = [];

        foreach ($documents as $type => $file) {
            if (! $file) {
                continue;
            }

            $path = $file->store('scholarship-documents', 'private');
            $processed[$type] = [
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'uploaded_at' => now(),
                'verified' => false,
            ];
        }

        return $processed;
    }

    private function sanitizeApplicationData(array $data): array
    {
        $applicationData = [
            'personal_statement' => $data['personal_statement'] ?? $data['purpose_letter'] ?? '',
            'academic_goals' => $data['academic_goals'] ?? '',
            'financial_need_statement' => $data['financial_need_statement'] ?? '',
            'additional_comments' => $data['additional_comments'] ?? '',
            'academic_year' => $data['academic_year'] ?? date('Y'),
            'semester' => $data['semester'] ?? '1st',
        ];

        if (isset($data['application_data']) && is_array($data['application_data'])) {
            $applicationData = array_merge($applicationData, $data['application_data']);
        }

        return array_filter($applicationData, static fn ($value) => $value !== null);
    }

    private function notifySubmitted(ScholarshipApplication $application): void
    {
        ScholarshipNotification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Submitted Successfully',
            'message' => "Your application for {$application->scholarship->name} has been submitted and is awaiting verification.",
            'type' => ScholarshipNotification::TYPE_APPLICATION_STATUS,
            'data' => [
                'application_id' => $application->id,
                'scholarship_name' => $application->scholarship->name,
                'status' => $application->status,
                'submitted_at' => $application->applied_at,
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);

        event(new ScholarshipApplicationStatusChanged($application, ScholarshipApplication::STATUS_DRAFT));
    }

    private function notifyStatusChanged(ScholarshipApplication $application): void
    {
        $messages = [
            ScholarshipApplication::STATUS_SUBMITTED => 'Your scholarship application has been submitted successfully.',
            ScholarshipApplication::STATUS_UNDER_VERIFICATION => 'Your scholarship application is currently under verification.',
            ScholarshipApplication::STATUS_INCOMPLETE => 'Your scholarship application needs additional or corrected documents.',
            ScholarshipApplication::STATUS_VERIFIED => 'Your documents have been verified successfully.',
            ScholarshipApplication::STATUS_UNDER_EVALUATION => 'Your scholarship application is now under evaluation.',
            ScholarshipApplication::STATUS_APPROVED => 'Congratulations! Your scholarship application has been approved.',
            ScholarshipApplication::STATUS_REJECTED => 'Your scholarship application was not approved at this time.',
            ScholarshipApplication::STATUS_END => 'Your scholarship application has completed processing.',
        ];

        ScholarshipNotification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Status Update',
            'message' => $messages[$application->status] ?? 'Your scholarship application status has been updated.',
            'type' => ScholarshipNotification::TYPE_APPLICATION_STATUS,
            'data' => [
                'application_id' => $application->id,
                'scholarship_name' => $application->scholarship->name,
                'status' => $application->status,
                'updated_at' => $application->updated_at,
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);
    }

    private function resolveCurrentStep(string $status): string
    {
        return match ($status) {
            ScholarshipApplication::STATUS_DRAFT,
            ScholarshipApplication::STATUS_SUBMITTED,
            ScholarshipApplication::STATUS_INCOMPLETE => 'document_submission',
            ScholarshipApplication::STATUS_UNDER_VERIFICATION => 'document_verification',
            ScholarshipApplication::STATUS_VERIFIED => 'evaluation',
            ScholarshipApplication::STATUS_UNDER_EVALUATION => 'interview',
            ScholarshipApplication::STATUS_APPROVED,
            ScholarshipApplication::STATUS_REJECTED,
            ScholarshipApplication::STATUS_END => 'final_review',
            default => 'document_submission',
        };
    }
}
