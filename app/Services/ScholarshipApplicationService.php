<?php

namespace App\Services;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipNotification;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class ScholarshipApplicationService
{
    protected ScholarshipEligibilityService $eligibilityService;

    public function __construct(
        ScholarshipEligibilityService $eligibilityService,
        private readonly ScholarshipWorkflowService $workflowService
    ) {
        $this->eligibilityService = $eligibilityService;
    }

    /**
     * Submit a new scholarship application with enhanced eligibility checking
     */
    public function submit(StudentProfile $student, Scholarship $scholarship, array $data, array $documents): ScholarshipApplication
    {
        $student->loadMissing('user');

        return $this->workflowService->submitApplication($scholarship, $student->user, [
            ...$data,
            'documents' => $documents,
        ]);
    }

    /**
     * Update document for an application
     */
    public function updateDocument(ScholarshipApplication $application, string $documentType, $file): bool
    {
        if (
            $application->status === ScholarshipApplication::STATUS_APPROVED ||
            $application->status === ScholarshipApplication::STATUS_REJECTED ||
            $application->status === ScholarshipApplication::STATUS_END
        ) {
            throw new InvalidArgumentException('Cannot update documents for a finalized application.');
        }

        $documents = $application->uploaded_documents ?? [];

        // Store new document
        $path = $file->store('scholarship-documents/'.$application->user_id, 'public');

        // Delete old file if it exists
        if (isset($documents[$documentType]['path'])) {
            Storage::disk('public')->delete($documents[$documentType]['path']);
        }

        // Update documents array
        $documents[$documentType] = [
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'uploaded_at' => now()->toDateTimeString(),
        ];

        return $application->update([
            'uploaded_documents' => $documents,
            'status' => ScholarshipApplication::STATUS_UNDER_VERIFICATION,
        ]);
    }

    /**
     * Schedule an interview for an application
     */
    public function scheduleInterview(ScholarshipApplication $application, \DateTime $scheduleDate): bool
    {
        if (! in_array($application->status, [ScholarshipApplication::STATUS_VERIFIED, ScholarshipApplication::STATUS_UNDER_EVALUATION])) {
            throw new InvalidArgumentException('Application is not ready for interview scheduling.');
        }

        $application->interview_schedule = $scheduleDate;
        $application->save();
        $this->workflowService->markInterviewScheduled($application);

        // Notify student
        ScholarshipNotification::create([
            'user_id' => $application->user_id, // Fixed: use user_id directly
            'title' => 'Interview Scheduled',
            'message' => "Your scholarship interview has been scheduled for {$scheduleDate->format('F j, Y g:i A')}",
            'type' => ScholarshipNotification::TYPE_INTERVIEW_SCHEDULE,
            'data' => [
                'application_id' => $application->id,
                'interview_date' => $scheduleDate->format('Y-m-d H:i:s'),
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);

        return true;
    }

    /**
     * Record stipend disbursement
     */
    public function recordStipendDisbursement(ScholarshipApplication $application, float $amount): bool
    {
        if ($application->status !== ScholarshipApplication::STATUS_APPROVED) {
            throw new InvalidArgumentException('Cannot disburse stipend for non-approved application.');
        }

        $application->amount_received += $amount;
        $application->last_stipend_date = now();
        $application->stipend_status = 'released';
        $application->save();

        // Notify student
        ScholarshipNotification::create([
            'user_id' => $application->user_id, // Fixed: use user_id directly
            'title' => 'Stipend Released',
            'message' => 'A stipend of PHP '.number_format($amount, 2).' has been released for your scholarship.',
            'type' => ScholarshipNotification::TYPE_STIPEND_RELEASE,
            'data' => [
                'application_id' => $application->id,
                'amount' => $amount,
                'date' => now()->toDateTimeString(),
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);

        return true;
    }

    /**
     * Create a new scholarship application.
     */
    public function createApplication(StudentProfile $student, Scholarship $scholarship, array $data): ScholarshipApplication
    {
        $student->loadMissing('user');

        return $this->workflowService->submitApplication($scholarship, $student->user, $data);
    }

    /**
     * Validate student's eligibility for a scholarship.
     *
     * @throws InvalidArgumentException
     */
    protected function validateEligibility(StudentProfile $student, Scholarship $scholarship): void
    {
        // Check if student already has an active scholarship
        if ($this->hasActiveScholarship($student)) {
            throw new InvalidArgumentException('Student already has an active scholarship');
        }

        // Check if student has a regular load
        if (! $this->hasRegularLoad($student)) {
            throw new InvalidArgumentException('Student must have a regular load');
        }

        // Check GWA requirements based on scholarship type
        $this->validateGWARequirement($student, $scholarship);

        // Check specific scholarship type requirements
        $this->validateTypeSpecificRequirements($student, $scholarship);
    }

    /**
     * Check if student has regular load.
     */
    protected function hasRegularLoad(StudentProfile $student): bool
    {
        return $student->units >= 18;
    }

    /**
     * Check if student has an active scholarship.
     */
    protected function hasActiveScholarship(StudentProfile $student): bool
    {
        return $student
            ->scholarshipApplications()
            ->whereIn('status', [
                ScholarshipApplication::STATUS_APPROVED,
                ScholarshipApplication::STATUS_UNDER_EVALUATION,
                ScholarshipApplication::STATUS_VERIFIED,
            ])
            ->exists();
    }

    /**
     * Validate GWA requirements for scholarship.
     *
     * @throws InvalidArgumentException
     */
    protected function validateGWARequirement(StudentProfile $student, Scholarship $scholarship): void
    {
        $gwaRequirement = $scholarship->getGwaRequirement();
        if (! $gwaRequirement) {
            return;
        }

        $studentGwa = $student->current_gwa;

        if (isset($gwaRequirement['min']) && $studentGwa < $gwaRequirement['min']) {
            throw new InvalidArgumentException('GWA is below the minimum requirement');
        }

        if (isset($gwaRequirement['max']) && $studentGwa > $gwaRequirement['max']) {
            throw new InvalidArgumentException('GWA exceeds the maximum requirement');
        }
    }

    /**
     * Validate scholarship type specific requirements.
     *
     * @throws InvalidArgumentException
     */
    protected function validateTypeSpecificRequirements(StudentProfile $student, Scholarship $scholarship): void
    {
        switch ($scholarship->type) {
            case 'student_assistantship':
                if ($student->units > 21) {
                    throw new InvalidArgumentException('Units exceed maximum allowed for Student Assistantship');
                }
                break;

            case 'performing_arts_full':
            case 'performing_arts_partial':
                $membershipDuration = $this->verifyPerformingArtsMembership($student);
                $isFullScholarship = $scholarship->type === 'performing_arts_full';

                if ($isFullScholarship && $membershipDuration < 12) {
                    throw new InvalidArgumentException('Requires at least 1 year of active membership');
                } elseif (! $isFullScholarship && $membershipDuration < 4) {
                    throw new InvalidArgumentException('Requires at least 1 semester of active membership');
                }
                break;

            case 'economic_assistance':
                if (! $this->hasValidIndigencyCertificate($student)) {
                    throw new InvalidArgumentException('Valid MSWDO Indigency Certificate required');
                }
                break;
        }
    }

    /**
     * Verify performing arts group membership duration.
     *
     * @return int Duration in months
     */
    protected function verifyPerformingArtsMembership(StudentProfile $student): int
    {
        // Implement membership verification logic
        // This should query a membership records table or related service
        return 0; // Placeholder
    }

    /**
     * Check for valid indigency certificate.
     */
    protected function hasValidIndigencyCertificate(StudentProfile $student): bool
    {
        // Implement indigency certificate validation logic
        // This should check the uploaded documents and their validity
        return false; // Placeholder
    }
}
