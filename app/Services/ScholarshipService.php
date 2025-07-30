<?php

namespace App\Services;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class ScholarshipService
{
    public function createApplication(int $scholarshipId, int $userId, array $data): ScholarshipApplication
    {
        return DB::transaction(function () use ($scholarshipId, $userId, $data) {
            $scholarship = Scholarship::findOrFail($scholarshipId);
            $user = User::with('studentProfile')->findOrFail($userId);

            // Process documents
            $documents = $this->processDocuments($data['documents'] ?? []);

            // Create application (not yet final, for eligibility check)
            $application = new ScholarshipApplication([
                'scholarship_id' => $scholarshipId,
                'user_id' => $userId,
                'application_data' => $this->sanitizeApplicationData($data),
                'status' => 'submitted',
                'applied_at' => now(),
                'uploaded_documents' => $documents,
            ]);
            $application->setRelation('studentProfile', $user->studentProfile);
            $application->setRelation('scholarship', $scholarship);

            // Validate eligibility using model logic
            $issues = $application->getEligibilityIssues();
            if (count($issues) > 0) {
                throw new InvalidArgumentException(implode("\n", $issues));
            }

            // Save application
            $application->save();

            // Trigger notifications
            $this->notifyApplicationSubmitted($application);

            return $application;
        });
    }

    public function updateApplicationStatus(
        ScholarshipApplication $application,
        string $status,
        ?string $notes = null,
        ?int $reviewerId = null
    ): bool {
        if (! $application->canTransitionTo($status)) {
            throw new InvalidArgumentException("Cannot transition from {$application->status} to {$status}");
        }

        $updated = $application->updateStatus($status, $notes, $reviewerId);

        if ($updated) {
            $this->notifyStatusChanged($application);
        }

        return $updated;
    }

    public function getApplicationsForUser(int $userId): array
    {
        return ScholarshipApplication::with(['scholarship'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($app) => $this->formatApplicationForFrontend($app))
            ->toArray();
    }

    public function getAvailableScholarships(int $userId): array
    {
        $user = User::with('studentProfile')->findOrFail($userId);

        return Scholarship::where('status', 'active')
            ->where('deadline', '>', now())
            ->get()
            ->filter(fn ($scholarship) => $this->isUserEligible($scholarship, $user))
            ->map(fn ($scholarship) => $this->formatScholarshipForFrontend($scholarship))
            ->values()
            ->toArray();
    }

    public function isUserEligible(Scholarship $scholarship, User $user): bool
    {
        $student = $user->studentProfile;
        if (! $student) return false;
        $application = new ScholarshipApplication([
            'scholarship_id' => $scholarship->id,
            'user_id' => $user->id,
            'application_data' => [],
            'status' => 'submitted',
        ]);
        $application->setRelation('studentProfile', $student);
        $application->setRelation('scholarship', $scholarship);
        return $application->meetsEligibilityCriteria();
    }

    /**
     * Check Academic Full Scholarship eligibility
     */
    private function checkAcademicFullEligibility($student): bool
    {
        return $student->current_gwa >= 1.000
            && $student->current_gwa <= 1.450
            && $student->units >= 18;
    }

    /**
     * Check Academic Partial Scholarship eligibility
     */
    private function checkAcademicPartialEligibility($student): bool
    {
        return $student->current_gwa >= 1.460
            && $student->current_gwa <= 1.750
            && $student->units >= 18;
    }

    /**
     * Check Student Assistantship eligibility
     */
    private function checkStudentAssistantshipEligibility($student): bool
    {
        return $student->units <= 21
            && $student->current_gwa <= 2.250;
    }

    /**
     * Check Performing Arts eligibility
     */
    private function checkPerformingArtsEligibility($student): bool
    {
        return $student->current_gwa <= 2.250;
    }

    /**
     * Check Economic Assistance eligibility
     */
    private function checkEconomicAssistanceEligibility($student): bool
    {
        return $student->current_gwa <= 2.250;
    }

    private function hasActiveScholarship(User $user): bool
    {
        return ScholarshipApplication::where('user_id', $user->id)
            ->whereIn('status', ['approved', 'under_review', 'interview_scheduled'])
            ->exists();
    }

    private function validateEligibility(Scholarship $scholarship, User $user): void
    {
        if (! $this->isUserEligible($scholarship, $user)) {
            throw new InvalidArgumentException('User is not eligible for this scholarship');
        }
        if (! $scholarship->isAcceptingApplications()) {
            throw new InvalidArgumentException('Scholarship is not accepting applications');
        }
        $existingApplication = ScholarshipApplication::where('scholarship_id', $scholarship->id)
            ->where('user_id', $user->id)
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->exists();
        if ($existingApplication) {
            throw new InvalidArgumentException('User already has an application for this scholarship');
        }
    }

    private function processDocuments(array $documents): array
    {
        $processed = [];

        foreach ($documents as $type => $file) {
            if ($file) {
                $path = $file->store('scholarship-documents', 'private');
                $processed[$type] = [
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'uploaded_at' => now(),
                    'verified' => false,
                ];
            }
        }

        return $processed;
    }

    private function sanitizeApplicationData(array $data): array
    {
        $applicationData = [
            'personal_statement' => $data['personalStatement'] ?? '',
            'academic_year' => $data['academicYear'] ?? date('Y'),
            'semester' => $data['semester'] ?? '1st',
        ];

        // Add scholarship-specific data
        if (isset($data['membershipDuration'])) {
            $applicationData['membership_duration'] = $data['membershipDuration'];
        }

        if (isset($data['majorPerformances'])) {
            $applicationData['major_performances'] = $data['majorPerformances'];
        }

        if (isset($data['majorActivitiesCount'])) {
            $applicationData['major_activities_count'] = $data['majorActivitiesCount'];
        }

        if (isset($data['familyIncome'])) {
            $applicationData['family_income'] = $data['familyIncome'];
        }

        if (isset($data['preHiringCompleted'])) {
            $applicationData['pre_hiring_completed'] = $data['preHiringCompleted'];
        }

        return $applicationData;
    }

    private function formatApplicationForFrontend(ScholarshipApplication $application): array
    {
        return [
            'id' => $application->id,
            'scholarshipName' => $application->scholarship->name,
            'scholarshipType' => $application->scholarship->type,
            'status' => $application->status,
            'statusLabel' => $this->getStatusLabel($application->status),
            'submittedAt' => ($application->submitted_at ?: $application->applied_at)?->format('Y-m-d H:i:s'),
            'reviewedAt' => $application->reviewed_at?->format('Y-m-d H:i:s'),
            'interviewScheduledAt' => $application->interview_scheduled_at?->format('Y-m-d H:i:s'),
            'documents' => $this->formatDocumentsForFrontend($application->documents),
            'canEdit' => in_array($application->status, ['draft']),
            'canCancel' => in_array($application->status, ['draft', 'submitted', 'under_review']),
        ];
    }

    private function formatScholarshipForFrontend(Scholarship $scholarship): array
    {
        $stipendAmount = $scholarship->stipend_amount ?: $scholarship->getStipendAmount();
        $hasApplied = ScholarshipApplication::where('scholarship_id', $scholarship->id)
            ->where('user_id', Auth::id())
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->exists();

        // Calculate available slots properly
        $totalSlots = $scholarship->slots_available ?: $scholarship->slots ?: 0;
        $approvedApplications = $scholarship->applications()->where('status', 'approved')->count();
        $availableSlots = max(0, $totalSlots - $approvedApplications);

        $scholarshipData = [
            'id' => $scholarship->id,
            'name' => $scholarship->name,
            'type' => $scholarship->type,
            'typeLabel' => $this->getTypeLabel($scholarship->type),
            'description' => $scholarship->description,
            'benefits' => $scholarship->benefits ?? [],
            'requirements' => $scholarship->requirements ?? [],
            'requiredDocuments' => $scholarship->getRequiredDocuments(),
            'eligibilityCriteria' => $scholarship->getEligibilityCriteria(),
            'gwaRequirement' => $scholarship->getGwaRequirement(),
            'stipendAmount' => $stipendAmount,
            'applicationDeadline' => $scholarship->deadline->format('Y-m-d'),
            'deadline' => $scholarship->deadline->format('Y-m-d'),
            'availableSlots' => $availableSlots,
            'canApply' => $scholarship->isAcceptingApplications(),
            // Additional legacy fields for backward compatibility
            'amount' => $scholarship->amount,
            'stipend_amount' => $stipendAmount,
            'slots' => $scholarship->slots,
            'slots_available' => $scholarship->slots_available,
            'funding_source' => $scholarship->funding_source,
            'criteria' => $scholarship->criteria ?? [],
            'required_documents' => array_values($scholarship->getRequiredDocuments()),
            'status' => $scholarship->status,
            'has_applied' => $hasApplied,
            'stipend_schedule' => $scholarship->stipend_schedule,
            'renewal_criteria' => $scholarship->renewal_criteria ?? [],
            'admin_remarks' => $scholarship->admin_remarks,
        ];

        // Only include beneficiaries if there are approved applications
        if ($approvedApplications > 0) {
            $scholarshipData['beneficiaries'] = $approvedApplications;
        }

        return $scholarshipData;
    }

    /**
     * Format scholarship data for frontend display
     */
    public function formatScholarshipData(Scholarship $scholarship): array
    {
        $stipendAmount = $scholarship->stipend_amount ?: $scholarship->amount;

        // Ensure requiredDocuments is always an array
        $requiredDocuments = $scholarship->getRequiredDocuments();
        if (! is_array($requiredDocuments)) {
            $requiredDocuments = [];
        }

        return [
            'id' => $scholarship->id,
            'name' => $scholarship->name,
            'type' => $scholarship->type,
            'typeLabel' => $this->getTypeLabel($scholarship->type),
            'description' => $scholarship->description,
            'amount' => $scholarship->amount,
            'stipendAmount' => $stipendAmount,
            'stipendSchedule' => $scholarship->stipend_schedule,
            'deadline' => $scholarship->deadline,
            'slots' => $scholarship->slots,
            'slotsAvailable' => $scholarship->slots_available,
            'eligibilityCriteria' => $scholarship->getEligibilityCriteria(),
            'requiredDocuments' => $requiredDocuments,
            'status' => $scholarship->status,
            'updatedAt' => $scholarship->updated_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Format application data for frontend display
     */
    public function formatApplicationData(ScholarshipApplication $application): array
    {
        // Ensure we have the necessary relationships loaded
        if (! $application->relationLoaded('scholarship')) {
            $application->load('scholarship');
        }
        if (! $application->relationLoaded('interview')) {
            $application->load('interview');
        }
        if (! $application->relationLoaded('comments')) {
            $application->load('comments.user');
        }

        // Safely handle null/missing data with comprehensive fallbacks
        $applicationData = $application->application_data ?? [];
        $uploadedDocuments = $application->uploaded_documents ?? [];
        $disbursementRecords = $application->disbursement_records ?? [];

        return [
            'id' => $application->id ?? 0,
            'status' => $application->status ?? 'unknown',
            'submitted_at' => ($application->submitted_at ?: $application->applied_at) ?
                (is_string($application->submitted_at ?: $application->applied_at) ?
                    \Carbon\Carbon::parse($application->submitted_at ?: $application->applied_at)->format('Y-m-d H:i:s') :
                    ($application->submitted_at ?: $application->applied_at)->format('Y-m-d H:i:s')) : null,
            'created_at' => $application->created_at ?
                (is_string($application->created_at) ?
                    \Carbon\Carbon::parse($application->created_at)->format('Y-m-d H:i:s') :
                    $application->created_at->format('Y-m-d H:i:s')) : null,
            'progress' => $this->calculateApplicationProgress($application),
            'purpose_letter' => $applicationData['purpose_letter'] ?? $application->purpose_letter ?? '',
            'documents' => $this->formatRequiredDocuments($application),
            'verifier_comments' => $application->reviewer_notes ?? null,
            'interview_schedule' => $application->interview && $application->interview->schedule ?
                (is_string($application->interview->schedule) ?
                    \Carbon\Carbon::parse($application->interview->schedule)->format('Y-m-d H:i:s') :
                    $application->interview->schedule->format('Y-m-d H:i:s')) : null,
            'committee_recommendation' => $application->committee_recommendation ?? null,
            'evaluation_score' => $application->evaluation_score ?? null,
            // Flattened scholarship data to match frontend expectations
            'scholarship_name' => $application->scholarship->name ?? 'Unknown Scholarship',
            'scholarship_type' => $application->scholarship->type ?? 'Unknown Type',
            'scholarship_amount' => $application->scholarship->amount ?? 'Not specified',
            // Keep nested structure for backwards compatibility
            'scholarship' => [
                'id' => $application->scholarship->id ?? 0,
                'name' => $application->scholarship->name ?? 'Unknown Scholarship',
                'type' => $application->scholarship->type ?? 'Unknown Type',
                'amount' => $application->scholarship->amount ?? 'Not specified',
            ],
            'timeline' => [
                'submitted' => ($application->submitted_at ?: $application->applied_at) ?
                    (is_string($application->submitted_at ?: $application->applied_at) ?
                        \Carbon\Carbon::parse($application->submitted_at ?: $application->applied_at)->format('Y-m-d H:i:s') :
                        ($application->submitted_at ?: $application->applied_at)->format('Y-m-d H:i:s')) : null,
                'verification' => null,
                'evaluation' => null,
                'decision' => null,
            ],
            'interview' => $application->interview ? [
                'schedule' => $application->interview->schedule ?
                    (is_string($application->interview->schedule) ?
                        \Carbon\Carbon::parse($application->interview->schedule)->format('Y-m-d H:i:s') :
                        $application->interview->schedule->format('Y-m-d H:i:s')) : null,
                'status' => $application->interview->status ?? 'pending',
                'remarks' => $application->interview->remarks ?? null,
            ] : null,
            'disbursement_records' => is_array($disbursementRecords) ? $disbursementRecords : [],
            'comments' => $application->comments ? $application->comments->map(function ($comment) {
                return [
                    'id' => $comment->id ?? 0,
                    'content' => $comment->comment ?? '',
                    'type' => $comment->type ?? 'general',
                    'created_at' => $comment->created_at ?
                        (is_string($comment->created_at) ?
                            \Carbon\Carbon::parse($comment->created_at)->format('Y-m-d H:i:s') :
                            $comment->created_at->format('Y-m-d H:i:s')) : null,
                    'user' => [
                        'id' => $comment->user->id ?? 0,
                        'name' => $comment->user->name ?? 'Unknown User',
                        'role' => $comment->user->role ?? 'user',
                    ],
                ];
            }) : collect([]),
            'updated_at' => $application->updated_at ?
                (is_string($application->updated_at) ?
                    \Carbon\Carbon::parse($application->updated_at)->format('Y-m-d H:i:s') :
                    $application->updated_at->format('Y-m-d H:i:s')) : null,
        ];
    }

    /**
     * Schedule an interview for a scholarship application
     */
    public function scheduleInterview(ScholarshipApplication $application, array $data): void
    {
        // Ensure application is in a proper state for interview
        if (! in_array($application->status, ['submitted', 'under_review', 'documents_verified'])) {
            throw new InvalidArgumentException("Cannot schedule interview for application in {$application->status} status");
        }

        $interviewDateTime = $data['interview_date'].' '.$data['interview_time'];

        // Create or update interview
        if ($application->interview) {
            $application->interview->update([
                'scheduled_date' => $data['interview_date'],
                'scheduled_time' => $data['interview_time'],
                'location' => $data['location'],
                'notes' => $data['notes'] ?? null,
                'status' => 'scheduled',
            ]);
        } else {
            $application->interview()->create([
                'scheduled_date' => $data['interview_date'],
                'scheduled_time' => $data['interview_time'],
                'location' => $data['location'],
                'notes' => $data['notes'] ?? null,
                'status' => 'scheduled',
            ]);
        }        // Update application status if needed
        if ($application->status === 'submitted' || $application->status === 'documents_verified') {
            $application->update(['status' => 'interview_scheduled']);
        }

        // Notify the applicant
        \App\Models\ScholarshipNotification::create([
            'user_id' => $application->user_id,
            'title' => 'Interview Scheduled',
            'message' => "Your scholarship interview has been scheduled for {$data['interview_date']} at {$data['interview_time']}.",
            'type' => \App\Models\ScholarshipNotification::TYPE_INTERVIEW_SCHEDULE,
            'data' => [
                'application_id' => $application->id,
                'scholarship_name' => $application->scholarship->name,
                'interview_date' => $data['interview_date'],
                'interview_time' => $data['interview_time'],
                'location' => $data['location'],
                'notes' => $data['notes'] ?? null,
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);
    }

    /**
     * Record a stipend payment for a scholarship application
     */
    public function recordStipend(ScholarshipApplication $application, array $data): void
    {
        // Ensure application is approved
        if ($application->status !== 'approved') {
            throw new InvalidArgumentException('Cannot record stipend for non-approved application');
        }

        $disbursementRecords = $application->disbursement_records ?: [];
        // Add new disbursement record
        $disbursementRecords[] = [
            'amount' => (float) $data['amount'],
            'date' => $data['disbursement_date'],
            'notes' => $data['notes'] ?? null,
            'recorded_at' => now()->format('Y-m-d H:i:s'),
            'recorded_by' => Auth::id() ?? 1,
        ];
        // Update application with new record
        $application->update([
            'disbursement_records' => $disbursementRecords,
        ]);

        // Notify the applicant
        \App\Models\ScholarshipNotification::create([
            'user_id' => $application->user_id,
            'title' => 'Stipend Disbursement',
            'message' => 'A stipend of PHP '.number_format((float) $data['amount'], 2).' has been disbursed for your scholarship.',
            'type' => \App\Models\ScholarshipNotification::TYPE_STIPEND_RELEASE,
            'data' => [
                'application_id' => $application->id,
                'scholarship_name' => $application->scholarship->name,
                'amount' => (float) $data['amount'],
                'disbursement_date' => $data['disbursement_date'],
                'notes' => $data['notes'] ?? null,
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);
    }

    /**
     * Update a document for a scholarship application
     */
    public function updateDocument(ScholarshipApplication $application, string $documentType, $file): void
    {
        // Ensure documentType is valid for this scholarship type
        $requiredDocuments = $application->scholarship->getRequiredDocuments();
        if (! in_array($documentType, $requiredDocuments)) {
            throw new InvalidArgumentException("Document type '{$documentType}' is not required for this scholarship");
        }

        // Store the file
        $path = Storage::disk('public')->put(
            "scholarship_documents/{$application->id}",
            $file
        );

        // Update application documents
        $documents = $application->documents ?: [];
        $documents[$documentType] = [
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_at' => now()->format('Y-m-d H:i:s'),
            'verified' => false,
        ];

        $application->update([
            'documents' => $documents,
        ]);
    }

    private function notifyApplicationSubmitted(ScholarshipApplication $application): void
    {
        // Create notification for the applicant
        \App\Models\ScholarshipNotification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Submitted Successfully',
            'message' => "Your application for {$application->scholarship->name} has been submitted and is now under review.",
            'type' => \App\Models\ScholarshipNotification::TYPE_APPLICATION_STATUS,
            'data' => [
                'application_id' => $application->id,
                'scholarship_name' => $application->scholarship->name,
                'status' => $application->status,
                'submitted_at' => $application->submitted_at,
            ],
            'notifiable_type' => ScholarshipApplication::class,
            'notifiable_id' => $application->id,
        ]);

        // Fire the status changed event for email notifications
        event(new \App\Events\ScholarshipApplicationStatusChanged($application, 'draft'));
    }

    private function notifyStatusChanged(ScholarshipApplication $application): void
    {
        $statusMessages = [
            'submitted' => 'Your scholarship application has been submitted successfully.',
            'under_review' => 'Your scholarship application is now under review.',
            'documents_verified' => 'Your documents have been verified successfully.',
            'interview_scheduled' => 'An interview has been scheduled for your scholarship application.',
            'interview_completed' => 'Your scholarship interview has been completed.',
            'approved' => 'Congratulations! Your scholarship application has been approved.',
            'rejected' => 'Your scholarship application was not approved at this time.',
            'cancelled' => 'Your scholarship application has been cancelled.',
        ];

        $message = $statusMessages[$application->status] ?? 'Your scholarship application status has been updated.';

        // Create notification for the applicant
        \App\Models\ScholarshipNotification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Status Update',
            'message' => $message,
            'type' => \App\Models\ScholarshipNotification::TYPE_APPLICATION_STATUS,
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

    private function getTypeLabel(string $type): string
    {
        $labels = [
            'academic_full' => 'Academic Scholarship (Full)',
            'academic_partial' => 'Academic Scholarship (Partial)',
            'student_assistantship' => 'Student Assistantship Program',
            'performing_arts_full' => 'MinSU Accredited Performing Arts Group (Full Scholar)',
            'performing_arts_partial' => 'MinSU Accredited Performing Arts Group (Partial Scholar)',
            'economic_assistance' => 'Economically Deprived/Marginalized Student',
        ];

        return $labels[$type] ?? ucfirst(str_replace('_', ' ', $type));
    }

    private function getStatusLabel(string $status): string
    {
        $labels = [
            'draft' => 'Draft',
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'documents_verified' => 'Documents Verified',
            'interview_scheduled' => 'Interview Scheduled',
            'interview_completed' => 'Interview Completed',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'cancelled' => 'Cancelled',
        ];

        return $labels[$status] ?? ucfirst(str_replace('_', ' ', $status));
    }

    /**
     * Format documents for frontend display
     * Handles both array and Collection types
     */
    private function formatDocumentsForFrontend($documents): array
    {
        if (! $documents) {
            return [];
        }

        // Handle Collection type (from Eloquent relationship)
        if ($documents instanceof \Illuminate\Database\Eloquent\Collection) {
            return $documents->map(function ($document) {
                return [
                    'id' => $document->id,
                    'name' => $document->original_name ?? $document->name ?? 'Document',
                    'type' => $document->type,
                    'path' => $document->file_path ?? $document->path,
                    'uploaded' => $document->created_at?->format('Y-m-d H:i:s'),
                    'verified' => $document->status === 'verified',
                    'status' => $document->status ?? 'pending',
                ];
            })->toArray();
        }

        // Handle array type (legacy format)
        if (is_array($documents)) {
            $formatted = [];
            foreach ($documents as $type => $document) {
                $formatted[$type] = [
                    'name' => $document['original_name'] ?? basename($document['path']),
                    'path' => $document['path'],
                    'uploaded' => $document['uploaded_at'] ?? null,
                    'verified' => $document['verified'] ?? false,
                ];
            }

            return $formatted;
        }

        return [];
    }

    /**
     * Calculate application progress percentage based on status
     */
    private function calculateApplicationProgress(ScholarshipApplication $application): int
    {
        $statusProgressMap = [
            'draft' => 0,
            'incomplete' => 10,
            'submitted' => 25,
            'under_verification' => 40,
            'documents_verified' => 50,
            'under_review' => 60,
            'under_evaluation' => 75,
            'interview_scheduled' => 80,
            'interview_completed' => 85,
            'approved' => 100,
            'rejected' => 100,
            'withdrawn' => 0,
        ];

        return $statusProgressMap[$application->status] ?? 0;
    }

    /**
     * Format required documents for frontend display
     */
    private function formatRequiredDocuments(ScholarshipApplication $application): array
    {
        $scholarship = $application->scholarship;
        $requiredDocuments = $scholarship->required_documents ?? [];
        $uploadedDocuments = $application->uploaded_documents ?? [];
        $relatedDocuments = $application->documents ?? collect();

        // Document name mapping for better display
        $documentNames = [
            'application_form' => 'Application Form',
            'academic_records' => 'Academic Records/Transcript',
            'enrollment_certificate' => 'Certificate of Enrollment',
            'pre_hiring_certificate' => 'Pre-Hiring Certificate',
            'health_certificate' => 'Health Certificate',
            'birth_certificate' => 'Birth Certificate',
            'barangay_clearance' => 'Barangay Clearance',
            'police_clearance' => 'Police Clearance',
            'income_certificate' => 'Certificate of Income',
            'grades' => 'Grade Records',
            'recommendation_letter' => 'Recommendation Letter',
            'financial_statement' => 'Financial Statement',
        ];

        $formattedDocuments = [];

        foreach ($requiredDocuments as $docType) {
            // Check if document is uploaded in uploaded_documents array
            $uploadedDoc = collect($uploadedDocuments)->firstWhere('type', $docType)
                ?? (isset($uploadedDocuments[$docType]) ? $uploadedDocuments[$docType] : null);

            // Check if document exists in related documents
            $relatedDoc = $relatedDocuments->firstWhere('type', $docType);

            $isUploaded = $uploadedDoc || $relatedDoc;
            $status = 'pending';

            if ($relatedDoc) {
                $status = $relatedDoc->status ?? 'pending';
            } elseif ($uploadedDoc) {
                $status = $uploadedDoc['status'] ?? 'verified'; // Mark as verified if uploaded
            }

            $formattedDocuments[$docType] = [
                'name' => $documentNames[$docType] ?? ucwords(str_replace('_', ' ', $docType)),
                'uploaded' => (bool) $isUploaded,
                'status' => $status,
            ];
        }

        return $formattedDocuments;
    }
}
