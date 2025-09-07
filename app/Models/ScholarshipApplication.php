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

    const STATUS_ACTIVE = 'active';

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
        self::STATUS_ACTIVE => 'Active',
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
     * Returns true if no eligibility issues.
     */
    public function meetsEligibilityCriteria(): bool
    {
        return count($this->getEligibilityIssues()) === 0;
    }

    /**
     * Get all reasons why this application is ineligible (for UI feedback/preview).
     * Returns an array of error messages. If empty, application is eligible.
     */
    public function getEligibilityIssues(): array
    {
        $issues = [];
        $student = $this->studentProfile;
        $scholarship = $this->scholarship;
        if (! $student) {
            $issues[] = 'Student profile not found.';

            return $issues;
        }
        if (! $scholarship) {
            $issues[] = 'Scholarship not found.';

            return $issues;
        }

        // General requirements (Section 16.4)
        if (! $student->is_bona_fide) {
            $issues[] = 'Applicant is not a bona fide MinSU student.';
        }
        if (! $student->has_regular_load) {
            $issues[] = 'Applicant does not have a regular load as certified by the Registrar.';
        }
        if (! $student->has_good_moral) {
            $issues[] = 'Applicant does not have good moral character as certified by the Guidance Counselor.';
        }
        if ($this->hasFailedSubjects($student)) {
            $issues[] = 'Applicant has failed, dropped, deferred, or incomplete grades.';
        }
        if (! $this->hasUploadedDocument('certification_of_grades')) {
            $issues[] = 'Certification of Grades (signed by Registrar) is missing.';
        }
        if ($this->hasOtherScholarship()) {
            $issues[] = 'Applicant is already receiving another scholarship.';
        }
        if (! $this->hasPassedInterview()) {
            $issues[] = 'Applicant has not passed the required interview.';
        }

        // Type-specific requirements
        switch ($scholarship->type) {
            case self::TYPE_ACADEMIC_FULL:
                $issues = array_merge($issues, $this->getAcademicFullEligibilityIssues($student));
                break;
            case self::TYPE_ACADEMIC_PARTIAL:
                $issues = array_merge($issues, $this->getAcademicPartialEligibilityIssues($student));
                break;
            case self::TYPE_STUDENT_ASSISTANTSHIP:
                $issues = array_merge($issues, $this->getStudentAssistantshipEligibilityIssues($student));
                break;
            case self::TYPE_PERFORMING_ARTS_FULL:
                $issues = array_merge($issues, $this->getPerformingArtsFullEligibilityIssues($student));
                break;
            case self::TYPE_PERFORMING_ARTS_PARTIAL:
                $issues = array_merge($issues, $this->getPerformingArtsPartialEligibilityIssues($student));
                break;
            case self::TYPE_ECONOMIC_ASSISTANCE:
                $issues = array_merge($issues, $this->getEconomicAssistanceEligibilityIssues($student));
                break;
        }

        // Document completeness
        if (! $this->areDocumentsComplete()) {
            $issues[] = 'Not all required documents have been uploaded.';
        }

        // Renewal logic (stub for fund check)
        if ($this->isRenewal() && ! $this->isRenewalEligible()) {
            $issues[] = 'Application is not eligible for renewal.';
        }
        if ($this->isRenewal() && ! $this->isFundsAvailable()) {
            $issues[] = 'Renewal not possible: funds unavailable.';
        }

        return $issues;
    }

    /**
     * Helper: Check if a specific document is uploaded.
     */
    protected function hasUploadedDocument(string $docKey): bool
    {
        $uploadedDocs = $this->uploaded_documents ?? [];

        return isset($uploadedDocs[$docKey]);
    }

    /**
     * Helper: Check if interview is passed (status in interview relation or application_data).
     */
    protected function hasPassedInterview(): bool
    {
        if ($this->interview && ($this->interview->status ?? null) === 'passed') {
            return true;
        }

        return ($this->application_data['interview_passed'] ?? false) === true;
    }

    /**
     * Helper: Is this a renewal application?
     */
    public function isRenewal(): bool
    {
        return $this->renewal_status === self::RENEWAL_PENDING || $this->renewal_status === self::RENEWAL_ELIGIBLE;
    }

    /**
     * Helper: Is renewal eligible (requirements met)?
     */
    public function isRenewalEligible(): bool
    {
        // For now, same as meetsEligibilityCriteria; can be customized for renewal rules
        return $this->meetsEligibilityCriteria();
    }

    /**
     * Helper: Are funds available for renewal? (Stub, to be implemented with finance logic)
     */
    public function isFundsAvailable(): bool
    {
        // TODO: Integrate with fund management system
        return true;
    }

    /**
     * Academic Full Scholarship: get all eligibility issues.
     */
    protected function getAcademicFullEligibilityIssues($student): array
    {
        $issues = [];
        if ($student->current_gwa === null || $student->current_gwa < 1.000 || $student->current_gwa > 1.450) {
            $issues[] = 'GWA must be between 1.000 and 1.450 for Full Scholarship.';
        }
        if ($this->hasGradeBelow($student, 1.75)) {
            $issues[] = 'No grade below 1.75 allowed for Full Scholarship.';
        }
        if ($this->hasFailedSubjects($student)) {
            $issues[] = 'No failed, dropped, deferred, or incomplete grades allowed for Full Scholarship.';
        }
        if ($student->units < 18) {
            $issues[] = 'Must be enrolled in at least 18 units for Full Scholarship.';
        }
        if ($this->hasOtherScholarship()) {
            $issues[] = 'Cannot receive other scholarship grants.';
        }

        return $issues;
    }

    /**
     * Academic Partial Scholarship: get all eligibility issues.
     */
    protected function getAcademicPartialEligibilityIssues($student): array
    {
        $issues = [];
        if ($student->current_gwa === null || $student->current_gwa < 1.460 || $student->current_gwa > 1.750) {
            $issues[] = 'GWA must be between 1.460 and 1.750 for Partial Scholarship.';
        }
        if ($this->hasGradeBelow($student, 1.75)) {
            $issues[] = 'No grade below 1.75 allowed for Partial Scholarship.';
        }
        if ($this->hasFailedSubjects($student)) {
            $issues[] = 'No failed, dropped, deferred, or incomplete grades allowed for Partial Scholarship.';
        }
        if ($student->units < 18) {
            $issues[] = 'Must be enrolled in at least 18 units for Partial Scholarship.';
        }
        if ($this->hasOtherScholarship()) {
            $issues[] = 'Cannot receive other scholarship grants.';
        }

        return $issues;
    }

    /**
     * Student Assistantship: get all eligibility issues.
     */
    protected function getStudentAssistantshipEligibilityIssues($student): array
    {
        $issues = [];
        if (! $this->hasUploadedDocument('letter_of_intent')) {
            $issues[] = 'Letter of intent is required for Student Assistantship.';
        }
        if (! $this->hasParentConsent()) {
            $issues[] = 'Parent consent is required for Student Assistantship.';
        }
        if ($student->units > 21) {
            $issues[] = 'Cannot be enrolled in more than 21 units for Student Assistantship.';
        }
        if ($this->hasFailingGradesInPreviousSemester($student)) {
            $issues[] = 'No failing or incomplete grades in previous semester allowed for Student Assistantship.';
        }
        if (! $this->hasCompletedPreHiringScreening()) {
            $issues[] = 'Pre-hiring screening by OSAS is required for Student Assistantship.';
        }
        if (! $this->hasUploadedDocument('certification_of_grades')) {
            $issues[] = 'Certification of Grades (signed by Registrar) is required for Student Assistantship.';
        }

        return $issues;
    }

    /**
     * Performing Arts Full: get all eligibility issues.
     */
    protected function getPerformingArtsFullEligibilityIssues($student): array
    {
        $issues = [];
        if ($this->getPerformingArtsMembershipDuration() < 12) {
            $issues[] = 'Must be an active member for at least one year for Full Performing Arts Scholarship.';
        }
        if (! $this->hasParticipatedInMajorPerformances()) {
            $issues[] = 'Must have participated in major local, regional, or national performances for Full Performing Arts Scholarship.';
        }
        if (! $this->hasCoachRecommendation()) {
            $issues[] = 'Coach/adviser recommendation is required for Full Performing Arts Scholarship.';
        }

        return $issues;
    }

    /**
     * Performing Arts Partial: get all eligibility issues.
     */
    protected function getPerformingArtsPartialEligibilityIssues($student): array
    {
        $issues = [];
        if ($this->getPerformingArtsMembershipDuration() < 4) {
            $issues[] = 'Must be a member for at least one semester for Partial Performing Arts Scholarship.';
        }
        if (! $this->hasPerformedInMajorActivities(2)) {
            $issues[] = 'Must have performed in at least two major University activities for Partial Performing Arts Scholarship.';
        }
        if (! $this->hasCoachRecommendation()) {
            $issues[] = 'Coach/adviser recommendation is required for Partial Performing Arts Scholarship.';
        }

        return $issues;
    }

    /**
     * Economic Assistance: get all eligibility issues.
     */
    protected function getEconomicAssistanceEligibilityIssues($student): array
    {
        $issues = [];
        if ($student->current_gwa === null || $student->current_gwa > 2.25) {
            $issues[] = 'GWA must not exceed 2.25 for Economic Assistance.';
        }
        if (! $this->hasUploadedDocument('indigency_certificate')) {
            $issues[] = 'Certification of Indigency from MSWDO is required for Economic Assistance.';
        }
        if (! $this->hasValidIndigencyCertificate()) {
            $issues[] = 'Indigency certificate is missing or expired (must be issued within last 6 months).';
        }

        return $issues;
    }

    /**
     * Check Academic Full Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkAcademicFullEligibility($student): bool
    {
        // GWA: 1.000–1.450, no grade below 1.75, no failed/dropped/deferred, at least 18 units, no other scholarship
        if ($student->current_gwa === null || $student->current_gwa < 1.000 || $student->current_gwa > 1.450) {
            return false;
        }
        if ($this->hasGradeBelow($student, 1.75)) {
            return false;
        }
        if ($this->hasFailedSubjects($student)) {
            return false;
        }
        if ($student->units < 18) {
            return false;
        }
        if ($this->hasOtherScholarship()) {
            return false;
        }

        return true;
    }

    /**
     * Check Academic Partial Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkAcademicPartialEligibility($student): bool
    {
        // GWA: 1.460–1.750, no grade below 1.75, no failed/dropped/deferred, at least 18 units, no other scholarship
        if ($student->current_gwa === null || $student->current_gwa < 1.460 || $student->current_gwa > 1.750) {
            return false;
        }
        if ($this->hasGradeBelow($student, 1.75)) {
            return false;
        }
        if ($this->hasFailedSubjects($student)) {
            return false;
        }
        if ($student->units < 18) {
            return false;
        }
        if ($this->hasOtherScholarship()) {
            return false;
        }

        return true;
    }

    /**
     * Check Student Assistantship eligibility
     * Modified to accept all applications.
     */
    protected function checkStudentAssistantshipEligibility($student): bool
    {
        // ≤21 units, no failing/incomplete grades in previous semester, parent consent, pre-hiring screening
        if ($student->units > 21) {
            return false;
        }
        if ($this->hasFailingGradesInPreviousSemester($student)) {
            return false;
        }
        if (! $this->hasParentConsent()) {
            return false;
        }
        if (! $this->hasCompletedPreHiringScreening()) {
            return false;
        }

        return true;
    }

    /**
     * Check Performing Arts Full Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkPerformingArtsFullEligibility($student): bool
    {
        // 1+ year membership, major performances, coach recommendation
        if ($this->getPerformingArtsMembershipDuration() < 12) {
            return false;
        }
        if (! $this->hasParticipatedInMajorPerformances()) {
            return false;
        }
        if (! $this->hasCoachRecommendation()) {
            return false;
        }

        return true;
    }

    /**
     * Check Performing Arts Partial Scholarship eligibility
     * Modified to accept all applications.
     */
    protected function checkPerformingArtsPartialEligibility($student): bool
    {
        // 1+ semester membership, at least 2 major activities, coach recommendation
        if ($this->getPerformingArtsMembershipDuration() < 4) {
            return false;
        }
        if (! $this->hasPerformedInMajorActivities(2)) {
            return false;
        }
        if (! $this->hasCoachRecommendation()) {
            return false;
        }

        return true;
    }

    /**
     * Check Economic Assistance eligibility
     * Modified to accept all applications.
     */
    protected function checkEconomicAssistanceEligibility($student): bool
    {
        // GWA ≤ 2.25, valid indigency certificate
        if ($student->current_gwa === null || $student->current_gwa > 2.25) {
            return false;
        }
        if (! $this->hasValidIndigencyCertificate()) {
            return false;
        }

        return true;
    }

    /**
     * Check if student has grades below specified threshold
     */
    protected function hasGradeBelow($student, float $threshold): bool
    {
        // Check if any grade is below the threshold
        return $student->grades()->where('grade', '<', $threshold)->exists();
    }

    /**
     * Check if student has failed subjects (grades of 5.0 or dropped/deferred)
     */
    protected function hasFailedSubjects($student): bool
    {
        // Check for failed, dropped, or deferred subjects
        return $student->grades()->whereIn('status', ['failed', 'dropped', 'deferred', 'incomplete'])->exists();
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
        // Check for failed or incomplete grades in the previous semester
        $latestSemester = $student->grades()->max('semester');
        if (! $latestSemester) {
            return false;
        }

        return $student->grades()->where('semester', $latestSemester)
            ->whereIn('status', ['failed', 'incomplete', 'dropped', 'deferred'])->exists();
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
     * Get the stipends for this application.
     */
    public function stipends(): HasMany
    {
        return $this->hasMany(ScholarshipStipend::class, 'application_id');
    }

    /**
     * Get the reviewer for this application.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
