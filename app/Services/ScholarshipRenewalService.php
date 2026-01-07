<?php

namespace App\Services;

use App\Models\Document;
use App\Models\RenewalApplication;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ScholarshipRenewalService
{
    public function __construct(
        protected ScholarshipEligibilityService $eligibilityService,
        protected DocumentVerificationService $documentService
    ) {}

    /**
     * Check if a student is eligible for scholarship renewal.
     */
    public function checkRenewalEligibility(
        ScholarshipApplication $application,
        string $semester,
        int $year
    ): array {
        $student = $application->student->studentProfile;
        $scholarship = $application->scholarship;

        $eligibilityResult = [
            'eligible' => false,
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
            'required_documents' => [],
        ];

        // Check if application is approved
        if ($application->status !== 'approved') {
            $eligibilityResult['requirements_failed'][] = 'original_application_not_approved';
            $eligibilityResult['messages'][] = 'Your original scholarship application must be approved to renew.';

            return $eligibilityResult;
        }

        // Check if already renewed for this period
        $existingRenewal = RenewalApplication::where('original_application_id', $application->id)
            ->where('renewal_semester', $semester)
            ->where('renewal_year', $year)
            ->first();

        if ($existingRenewal) {
            $eligibilityResult['requirements_failed'][] = 'already_renewed';
            $eligibilityResult['messages'][] = "You have already submitted a renewal for {$semester} {$year}.";

            return $eligibilityResult;
        }

        // Check GWA requirement (must maintain minimum GWA - lower is better in Philippine scale)
        $maximumGwa = $this->getMaximumGwaForScholarship($scholarship);
        if ($student->current_gwa > $maximumGwa) {
            $eligibilityResult['requirements_failed'][] = 'cgpa_below_minimum';
            $eligibilityResult['messages'][] = "Your GWA ({$student->current_gwa}) exceeds the maximum allowed ({$maximumGwa}).";
        } else {
            $eligibilityResult['requirements_met'][] = 'cgpa_requirement';
        }

        // Check enrollment status
        if ($student->enrollment_status !== 'enrolled') {
            $eligibilityResult['requirements_failed'][] = 'not_enrolled';
            $eligibilityResult['messages'][] = 'You must be currently enrolled to renew your scholarship.';
        } else {
            $eligibilityResult['requirements_met'][] = 'enrollment_status';
        }

        // Check if student has any disciplinary actions
        if ($student->has_disciplinary_action) {
            $eligibilityResult['requirements_failed'][] = 'disciplinary_action';
            $eligibilityResult['messages'][] = 'Students with disciplinary actions are not eligible for renewal.';
        } else {
            $eligibilityResult['requirements_met'][] = 'good_standing';
        }

        // Get required documents for renewal
        $eligibilityResult['required_documents'] = $this->getRequiredRenewalDocuments($scholarship);

        // Calculate final eligibility
        $eligibilityResult['eligible'] = empty($eligibilityResult['requirements_failed']);

        if ($eligibilityResult['eligible']) {
            $eligibilityResult['messages'][] = 'You are eligible to renew your scholarship.';
        }

        return $eligibilityResult;
    }

    /**
     * Create a new renewal application.
     */
    public function createRenewalApplication(
        ScholarshipApplication $originalApplication,
        string $semester,
        int $year,
        array $additionalData = []
    ): RenewalApplication {
        // Verify eligibility first
        $eligibility = $this->checkRenewalEligibility($originalApplication, $semester, $year);

        if (! $eligibility['eligible']) {
            throw new \Exception('Student is not eligible for renewal: '.implode(', ', $eligibility['messages']));
        }

        return DB::transaction(function () use ($originalApplication, $semester, $year, $additionalData) {
            $renewal = RenewalApplication::create([
                'original_application_id' => $originalApplication->id,
                'student_id' => $originalApplication->user_id,
                'renewal_semester' => $semester,
                'renewal_year' => $year,
                'status' => 'pending',
                'submitted_at' => now(),
                'current_gwa' => $additionalData['current_gwa'] ?? $originalApplication->student->studentProfile->current_gwa,
                'renewal_notes' => $additionalData['notes'] ?? null,
            ]);

            return $renewal;
        });
    }

    /**
     * Process renewal document uploads.
     */
    public function processRenewalDocuments(
        RenewalApplication $renewal,
        array $documents
    ): array {
        $uploadedDocuments = [];

        foreach ($documents as $documentData) {
            $document = Document::create([
                'renewal_application_id' => $renewal->id,
                'type' => $documentData['type'],
                'file_path' => $documentData['file_path'],
                'original_name' => $documentData['original_name'],
                'file_size' => $documentData['file_size'] ?? null,
                'mime_type' => $documentData['mime_type'] ?? null,
                'status' => Document::STATUS_PENDING,
            ]);

            $uploadedDocuments[] = $document;
        }

        // Update renewal application to mark documents as uploaded
        $documentIds = collect($uploadedDocuments)->pluck('id')->toArray();
        $renewal->update([
            'has_required_documents' => true,
            'required_document_ids' => $documentIds,
        ]);

        return $uploadedDocuments;
    }

    /**
     * Approve a renewal application.
     */
    public function approveRenewal(
        RenewalApplication $renewal,
        User $reviewer,
        ?string $notes = null
    ): RenewalApplication {
        return DB::transaction(function () use ($renewal, $reviewer, $notes) {
            $renewal->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewer_id' => $reviewer->id,
                'renewal_notes' => $notes ?? 'Renewal approved. Student meets all requirements.',
            ]);

            // Update the renewal status and application tracking
            $renewal->update([
                'is_renewal' => true,
                'last_renewed_at' => now(),
            ]);

            return $renewal->fresh();
        });
    }

    /**
     * Reject a renewal application.
     */
    public function rejectRenewal(
        RenewalApplication $renewal,
        User $reviewer,
        string $reason
    ): RenewalApplication {
        return DB::transaction(function () use ($renewal, $reviewer, $reason) {
            $renewal->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'reviewer_id' => $reviewer->id,
                'renewal_notes' => $reason,
            ]);

            return $renewal->fresh();
        });
    }

    /**
     * Get renewal statistics for a specific period.
     */
    public function getRenewalStatistics(string $semester, int $year): array
    {
        $renewals = RenewalApplication::forPeriod($semester, $year)->get();

        return [
            'total' => $renewals->count(),
            'pending' => $renewals->where('status', 'pending')->count(),
            'under_review' => $renewals->where('status', 'under_review')->count(),
            'approved' => $renewals->where('status', 'approved')->count(),
            'rejected' => $renewals->where('status', 'rejected')->count(),
            'withdrawn' => $renewals->where('status', 'withdrawn')->count(),
            'approval_rate' => $renewals->count() > 0
                ? round(($renewals->where('status', 'approved')->count() / $renewals->count()) * 100, 2)
                : 0,
        ];
    }

    /**
     * Get renewal statistics by scholarship type.
     */
    public function getRenewalStatisticsByType(string $semester, int $year): array
    {
        $renewals = RenewalApplication::with('originalApplication.scholarship')
            ->forPeriod($semester, $year)
            ->get();

        $stats = [];

        foreach ($renewals as $renewal) {
            $type = $renewal->originalApplication->scholarship->type ?? 'Unknown';

            if (! isset($stats[$type])) {
                $stats[$type] = [
                    'total' => 0,
                    'approved' => 0,
                    'rejected' => 0,
                    'pending' => 0,
                ];
            }

            $stats[$type]['total']++;
            $stats[$type][$renewal->status]++;
        }

        return $stats;
    }

    /**
     * Get upcoming renewal deadlines.
     */
    public function getUpcomingRenewalDeadlines(): array
    {
        $currentYear = now()->year;
        $currentMonth = now()->month;

        // Determine current and next semester
        if ($currentMonth >= 6 && $currentMonth <= 10) {
            $currentSemester = 'First Semester';
            $currentSemesterYear = $currentYear;
            $nextSemester = 'Second Semester';
            $nextSemesterYear = $currentYear;
        } else {
            $currentSemester = 'Second Semester';
            $currentSemesterYear = $currentMonth <= 5 ? $currentYear - 1 : $currentYear;
            $nextSemester = 'First Semester';
            $nextSemesterYear = $currentMonth <= 5 ? $currentYear : $currentYear + 1;
        }

        return [
            'current_semester' => [
                'semester' => $currentSemester,
                'year' => $currentSemesterYear,
                'deadline' => $this->getSemesterDeadline($currentSemester, $currentSemesterYear),
            ],
            'next_semester' => [
                'semester' => $nextSemester,
                'year' => $nextSemesterYear,
                'deadline' => $this->getSemesterDeadline($nextSemester, $nextSemesterYear),
            ],
        ];
    }

    /**
     * Get maximum GWA requirement for a scholarship (Philippine scale - lower is better).
     */
    protected function getMaximumGwaForScholarship(Scholarship $scholarship): float
    {
        return match ($scholarship->type) {
            Scholarship::TYPE_ACADEMIC_FULL => 1.450,      // President's Lister (1.000-1.450)
            Scholarship::TYPE_ACADEMIC_PARTIAL => 1.750,   // Dean's Lister (1.460-1.750)
            Scholarship::TYPE_PERFORMING_ARTS_FULL => 2.00,
            Scholarship::TYPE_PERFORMING_ARTS_PARTIAL => 2.25,
            Scholarship::TYPE_STUDENT_ASSISTANTSHIP => 2.25,
            Scholarship::TYPE_ECONOMIC_ASSISTANCE => 2.25, // Per scholarships.md
            default => 2.25,
        };
    }

    /**
     * Get required documents for renewal based on scholarship type.
     */
    protected function getRequiredRenewalDocuments(Scholarship $scholarship): array
    {
        $baseDocuments = [
            Document::TYPE_GRADES,
        ];

        $typeSpecificDocuments = match ($scholarship->type) {
            Scholarship::TYPE_ACADEMIC_FULL,
            Scholarship::TYPE_ACADEMIC_PARTIAL => [
                Document::TYPE_TRANSCRIPTS,
            ],
            Scholarship::TYPE_PERFORMING_ARTS_FULL,
            Scholarship::TYPE_PERFORMING_ARTS_PARTIAL => [
                Document::TYPE_RECOMMENDATION,
            ],
            Scholarship::TYPE_ECONOMIC_ASSISTANCE => [
                Document::TYPE_FINANCIAL_STATEMENT,
                Document::TYPE_INDIGENCY,
            ],
            default => [],
        };

        return array_merge($baseDocuments, $typeSpecificDocuments);
    }

    /**
     * Get semester deadline.
     */
    protected function getSemesterDeadline(string $semester, int $year): Carbon
    {
        if ($semester === 'First Semester') {
            return Carbon::create($year, 8, 15); // August 15
        }

        return Carbon::create($year + 1, 1, 15); // January 15
    }
}
