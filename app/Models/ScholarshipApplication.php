<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use InvalidArgumentException;

class ScholarshipApplication extends Model
{
    use SoftDeletes;

    // Define scholarship types
    const TYPE_ACADEMIC_FULL = 'academic_full';

    const TYPE_ACADEMIC_PARTIAL = 'academic_partial';

    const TYPE_STUDENT_ASSISTANTSHIP = 'student_assistantship';

    const TYPE_PERFORMING_ARTS_FULL = 'performing_arts_full';

    const TYPE_PERFORMING_ARTS_PARTIAL = 'performing_arts_partial';

    const TYPE_ECONOMIC_ASSISTANCE = 'economic_assistance';

    protected $fillable = [
        'student_id',
        'scholarship_id',
        'status',
        'priority',
        'reviewer_id',
        'applied_at',
        'approved_at',
        'rejected_at',
        'verifier_comments',
        'current_step',
        'uploaded_documents',
        'interview_schedule',
        'interview_notes',
        'committee_recommendation',
        'semester',
        'academic_year',
        'evaluation_score',
        'admin_remarks',
        'stipend_status',
        'last_stipend_date',
        'amount_received',
        'renewal_status',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'interview_schedule' => 'datetime',
        'last_stipend_date' => 'datetime',
        'uploaded_documents' => 'array',
        'amount_received' => 'decimal:2',
        'evaluation_score' => 'decimal:2',
    ];

    // Application Status Constants
    const STATUS_DRAFT = 'draft';

    const STATUS_SUBMITTED = 'submitted';

    const STATUS_UNDER_VERIFICATION = 'under_verification';

    const STATUS_INCOMPLETE = 'incomplete';

    const STATUS_VERIFIED = 'verified';

    const STATUS_UNDER_EVALUATION = 'under_evaluation';

    const STATUS_APPROVED = 'approved';

    const STATUS_REJECTED = 'rejected';

    const STATUS_END = 'end';

    // Status Workflow Definition
    protected static array $allowedStatusTransitions = [
        self::STATUS_DRAFT => [self::STATUS_SUBMITTED],
        self::STATUS_SUBMITTED => [self::STATUS_UNDER_VERIFICATION],
        self::STATUS_UNDER_VERIFICATION => [self::STATUS_INCOMPLETE, self::STATUS_VERIFIED],
        self::STATUS_INCOMPLETE => [self::STATUS_UNDER_VERIFICATION],
        self::STATUS_VERIFIED => [self::STATUS_UNDER_EVALUATION],
        self::STATUS_UNDER_EVALUATION => [self::STATUS_APPROVED, self::STATUS_REJECTED],
        self::STATUS_APPROVED => [self::STATUS_END],
        self::STATUS_REJECTED => [self::STATUS_END],
        self::STATUS_END => [],
    ];

    /**
     * Update the application status if the transition is allowed.
     *
     * @throws InvalidArgumentException
     */
    public function updateStatus(string $newStatus, ?string $comment = null): bool
    {
        if (! $this->canTransitionTo($newStatus)) {
            throw new InvalidArgumentException(
                "Cannot transition from {$this->status} to {$newStatus}"
            );
        }

        $this->status = $newStatus;

        // Set timestamps based on status
        switch ($newStatus) {
            case self::STATUS_SUBMITTED:
                $this->applied_at = now();
                break;
            case self::STATUS_APPROVED:
                $this->approved_at = now();
                break;
            case self::STATUS_REJECTED:
                $this->rejected_at = now();
                break;
        }

        if ($comment) {
            $this->verifier_comments = $comment;
        }

        return $this->save();
    }

    /**
     * Check if the application can transition to the given status.
     */
    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::$allowedStatusTransitions[$this->status] ?? []);
    }

    /**
     * Get the next possible statuses for this application.
     */
    public function getNextPossibleStatuses(): array
    {
        return self::$allowedStatusTransitions[$this->status] ?? [];
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
     * Check if application meets basic eligibility criteria.
     */
    public function meetsEligibilityCriteria(): bool
    {
        // Get the student's profile
        $student = $this->student;
        $scholarship = $this->scholarship;

        // Check if student has no failing grades
        if (! $student->hasNoFailingGrades()) {
            return false;
        }

        // Check if student has regular load (minimum 18 units except for SAP)
        if ($scholarship->type !== self::TYPE_STUDENT_ASSISTANTSHIP && $student->units < 18) {
            return false;
        }

        // Check specific scholarship type requirements
        switch ($scholarship->type) {
            case self::TYPE_ACADEMIC_FULL:
                return $student->gwa >= 1.000 && $student->gwa <= 1.450 && ! $student->hasGradeBelow(1.75);

            case self::TYPE_ACADEMIC_PARTIAL:
                return $student->gwa >= 1.460 && $student->gwa <= 1.750 && ! $student->hasGradeBelow(2.00);

            case self::TYPE_STUDENT_ASSISTANTSHIP:
                // Check if units don't exceed 21
                return $student->units <= 21;

            case self::TYPE_PERFORMING_ARTS_FULL:
                // Verify 1+ year membership through records
                $membershipDuration = $this->verifyPerformingArtsMembership();

                return $membershipDuration >= 12; // 12 months

            case self::TYPE_PERFORMING_ARTS_PARTIAL:
                // Verify 1+ semester membership through records
                $membershipDuration = $this->verifyPerformingArtsMembership();

                return $membershipDuration >= 4; // 4 months (1 semester)

            case self::TYPE_ECONOMIC_ASSISTANCE:
                return $student->gwa <= 2.25 && $this->hasValidIndigencyCertificate();

            default:
                return true;
        }
    }

    /**
     * Verify performing arts group membership duration
     *
     * @return int Duration in months
     */
    protected function verifyPerformingArtsMembership(): int
    {
        // This should be implemented based on your membership tracking system
        // For now, returning a placeholder value
        return 0;
    }

    /**
     * Check if applicant has submitted a valid indigency certificate
     */
    protected function hasValidIndigencyCertificate(): bool
    {
        if (! isset($this->uploaded_documents['indigency_certificate'])) {
            return false;
        }

        $certificate = $this->uploaded_documents['indigency_certificate'];

        // Check if certificate is not expired (valid for 6 months)
        $issueDate = new \DateTime($certificate['issue_date']);
        $validity = new \DateTime;
        $validity->modify('-6 months');

        return $issueDate > $validity;
    }

    /**
     * Get the student that owns the application.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
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
     * Get the reviewer for this application.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
