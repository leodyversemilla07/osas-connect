<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScholarshipApplication extends Model
{
    use HasFactory, SoftDeletes;

    // Define scholarship types
    const TYPE_ACADEMIC_FULL = 'academic_full';

    const TYPE_ACADEMIC_PARTIAL = 'academic_partial';

    const TYPE_STUDENT_ASSISTANTSHIP = 'student_assistantship';

    const TYPE_PERFORMING_ARTS_FULL = 'performing_arts_full';

    const TYPE_PERFORMING_ARTS_PARTIAL = 'performing_arts_partial';

    const TYPE_ECONOMIC_ASSISTANCE = 'economic_assistance';

    // Priority levels
    const PRIORITY_LOW = 'low';

    const PRIORITY_MEDIUM = 'medium';

    const PRIORITY_HIGH = 'high';

    const PRIORITY_URGENT = 'urgent';

    // Stipend status
    const STIPEND_PENDING = 'pending';

    const STIPEND_PROCESSING = 'processing';

    const STIPEND_RELEASED = 'released';

    // Renewal status
    const RENEWAL_ELIGIBLE = 'eligible';

    const RENEWAL_INELIGIBLE = 'ineligible';

    const RENEWAL_PENDING = 'pending';

    const RENEWAL_APPROVED = 'approved';

    const RENEWAL_REJECTED = 'rejected';

    // Semester options
    const SEMESTER_FIRST = '1st';

    const SEMESTER_SECOND = '2nd';

    const SEMESTER_SUMMER = 'Summer';

    protected $fillable = [
        'scholarship_id',
        'user_id',
        'status',
        'priority',
        'reviewer_id',
        'applied_at',
        'verified_at',
        'approved_at',
        'rejected_at',
        'current_step',
        'purpose_letter',
        'application_data',
        'uploaded_documents',
        'evaluation_score',
        'verifier_comments',
        'committee_recommendation',
        'admin_remarks',
        'interview_schedule',
        'interview_notes',
        'stipend_status',
        'last_stipend_date',
        'amount_received',
        'renewal_status',
        'academic_year',
        'semester',
    ];

    protected $casts = [
        'application_data' => 'array',
        'uploaded_documents' => 'array',
        'applied_at' => 'datetime',
        'verified_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'interview_schedule' => 'datetime',
        'last_stipend_date' => 'datetime',
        'evaluation_score' => 'decimal:2',
        'amount_received' => 'decimal:2',
        'academic_year' => 'integer',
    ];

    // Status constants for easier reference
    const STATUS_DRAFT = 'draft';

    const STATUS_SUBMITTED = 'submitted';

    const STATUS_UNDER_VERIFICATION = 'under_verification';

    const STATUS_INCOMPLETE = 'incomplete';

    const STATUS_VERIFIED = 'verified';

    const STATUS_UNDER_EVALUATION = 'under_evaluation';

    const STATUS_APPROVED = 'approved';

    const STATUS_REJECTED = 'rejected';

    const STATUS_END = 'end';

    // Standardized status flow - aligned with database enum
    const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_SUBMITTED => 'Submitted',
        self::STATUS_UNDER_VERIFICATION => 'Under Verification',
        self::STATUS_INCOMPLETE => 'Incomplete',
        self::STATUS_VERIFIED => 'Verified',
        self::STATUS_UNDER_EVALUATION => 'Under Evaluation',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_REJECTED => 'Rejected',
        self::STATUS_END => 'End',
    ];

    const STATUS_FLOW = [
        self::STATUS_DRAFT => [self::STATUS_SUBMITTED],
        self::STATUS_SUBMITTED => [self::STATUS_UNDER_VERIFICATION, self::STATUS_INCOMPLETE, self::STATUS_REJECTED],
        self::STATUS_UNDER_VERIFICATION => [self::STATUS_VERIFIED, self::STATUS_INCOMPLETE, self::STATUS_REJECTED],
        self::STATUS_INCOMPLETE => [self::STATUS_SUBMITTED, self::STATUS_REJECTED],
        self::STATUS_VERIFIED => [self::STATUS_UNDER_EVALUATION, self::STATUS_REJECTED],
        self::STATUS_UNDER_EVALUATION => [self::STATUS_APPROVED, self::STATUS_REJECTED],
        self::STATUS_APPROVED => [self::STATUS_END],
        self::STATUS_REJECTED => [self::STATUS_END],
        self::STATUS_END => [],
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::STATUS_FLOW[$this->status] ?? []);
    }

    public function updateStatus(string $newStatus, ?string $notes = null, ?int $reviewerId = null): bool
    {
        if (! $this->canTransitionTo($newStatus)) {
            return false;
        }

        $updateData = [
            'status' => $newStatus,
            'reviewer_id' => $reviewerId,
        ];

        // Add timestamp based on status
        switch ($newStatus) {
            case 'verified':
                $updateData['verified_at'] = now();
                break;
            case 'approved':
                $updateData['approved_at'] = now();
                break;
            case 'rejected':
                $updateData['rejected_at'] = now();
                break;
            case 'submitted':
                $updateData['applied_at'] = now();
                break;
        }

        // Add notes if provided (using correct field name)
        if ($notes) {
            $updateData['verifier_comments'] = $notes;
        }

        $this->update($updateData);

        return true;
    }

    /**
     * Check if all required documents are complete.
     */
    public function areDocumentsComplete(): bool
    {
        $requiredDocs = $this->scholarship->required_documents ?? [];
        $uploadedDocs = $this->uploaded_documents ?? [];

        return empty(array_diff($requiredDocs, array_keys($uploadedDocs)));
    }

    /**
     * Check if application meets MinSU-specific eligibility criteria.
     * Modified to accept all applications regardless of criteria.
     */
    public function meetsEligibilityCriteria(): bool
    {
        // Accept all applications - simplified eligibility check
        return true;
    }

    /**
     * Check Academic Full Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkAcademicFullEligibility($student): bool
    {
        // Accept all applications regardless of GWA, units, or grades
        return true;
    }

    /**
     * Check Academic Partial Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkAcademicPartialEligibility($student): bool
    {
        // Accept all applications regardless of GWA, units, or grades
        return true;
    }

    /**
     * Check Student Assistantship eligibility
     * Modified to accept all applications.
     */
    protected function checkStudentAssistantshipEligibility($student): bool
    {
        // Accept all applications regardless of units, grades, or screening
        return true;
    }

    /**
     * Check Performing Arts Full Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkPerformingArtsFullEligibility($student): bool
    {
        // Accept all applications regardless of membership duration or performances
        return true;
    }

    /**
     * Check Performing Arts Partial Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkPerformingArtsPartialEligibility($student): bool
    {
        // Accept all applications regardless of membership duration or activities
        return true;
    }

    /**
     * Check Economic Assistance eligibility
     * Modified to accept all applications.
     */
    protected function checkEconomicAssistanceEligibility($student): bool
    {
        // Accept all applications regardless of GWA or financial documentation
        return true;
    }

    /**
     * Check if student has grades below specified threshold
     */
    protected function hasGradeBelow($student, float $threshold): bool
    {
        // This should check the student's grade records
        // Implementation depends on your grade tracking system
        // For now, returning false as placeholder
        return false;
    }

    /**
     * Check if student has failed subjects (grades of 5.0 or dropped/deferred)
     */
    protected function hasFailedSubjects($student): bool
    {
        // This should check for failed, dropped, or deferred subjects
        // Implementation depends on your grade tracking system
        return false;
    }

    /**
     * Check if student has other active scholarship
     */
    protected function hasOtherScholarship(): bool
    {
        return ScholarshipApplication::where('user_id', $this->user_id)->where('id', '!=', $this->id)->where('status', 'approved')->exists();
    }

    /**
     * Check if student has failing grades in previous semester
     */
    protected function hasFailingGradesInPreviousSemester($student): bool
    {
        // Implementation depends on your grade tracking system
        return false;
    }

    /**
     * Check if parent consent is provided
     */
    protected function hasParentConsent(): bool
    {
        return $this->application_data['parent_consent_provided'] ?? false;
    }

    /**
     * Check if pre-hiring screening is completed
     */
    protected function hasCompletedPreHiringScreening(): bool
    {
        return $this->application_data['pre_hiring_completed'] ?? false;
    }

    /**
     * Get performing arts group membership duration in months
     */
    protected function getPerformingArtsMembershipDuration(): int
    {
        // This should integrate with your membership tracking system
        // For now, returning data from application
        return $this->application_data['membership_duration'] ?? 0;
    }

    /**
     * Check if student has participated in major performances
     */
    protected function hasParticipatedInMajorPerformances(): bool
    {
        return $this->application_data['major_performances'] ?? false;
    }

    /**
     * Check if student has performed in specified number of major activities
     */
    protected function hasPerformedInMajorActivities(int $minimum = 2): bool
    {
        $count = $this->application_data['major_activities_count'] ?? 0;

        return $count >= $minimum;
    }

    /**
     * Check if coach recommendation is provided
     */
    protected function hasCoachRecommendation(): bool
    {
        return $this->application_data['coach_recommendation_provided'] ?? false;
    }

    /**
     * Check if applicant demonstrates financial need
     */
    protected function demonstratesFinancialNeed(): bool
    {
        $familyIncome = $this->application_data['family_income'] ?? null;

        return $familyIncome && (float) $familyIncome <= 250000; // Below poverty threshold
    }

    /**
     * Check if applicant has submitted a valid indigency certificate
     */
    protected function hasValidIndigencyCertificate(): bool
    {
        $issueDate = $this->application_data['indigency_certificate_issue_date'] ?? null;

        if (! $issueDate) {
            return false;
        }

        try {
            // Check if certificate is not expired (valid for 6 months)
            $certificateDate = new \DateTime($issueDate);
            $sixMonthsAgo = new \DateTime;
            $sixMonthsAgo->modify('-6 months');

            return $certificateDate >= $sixMonthsAgo;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get the student (user) who submitted this application.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the student profile through the user relationship.
     */
    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class, 'user_id', 'user_id'); // Fixed: use user_id for both
    }

    /**
     * Get the scholarship this application is for.
     */
    public function scholarship(): BelongsTo
    {
        return $this->belongsTo(Scholarship::class);
    }

    /**
     * Get the documents for this application.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'application_id');
    }

    /**
     * Get the comments for this application.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ApplicationComment::class, 'application_id');
    }

    /**
     * Get the interview for this application.
     */
    public function interview(): HasOne
    {
        return $this->hasOne(Interview::class, 'application_id');
    }

    /**
     * Get the reviewer for this application.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
