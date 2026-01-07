<?php

namespace App\Services;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use Illuminate\Support\Collection;

class ScholarshipEligibilityService
{
    /**
     * Check if a student is eligible for a specific scholarship
     */
    public function checkEligibility(StudentProfile $student, Scholarship $scholarship): array
    {
        $eligibilityResult = [
            'eligible' => false,
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
            'recommended_scholarship_type' => null,
        ];

        // Check basic requirements first
        $basicChecks = $this->checkBasicRequirements($student, $scholarship);
        $eligibilityResult = array_merge_recursive($eligibilityResult, $basicChecks);

        // If basic requirements failed, no need to check further
        if (! empty($basicChecks['requirements_failed'])) {
            $eligibilityResult['eligible'] = false;

            return $eligibilityResult;
        }

        // Check scholarship-type specific requirements
        switch ($scholarship->type) {
            case Scholarship::TYPE_ACADEMIC_FULL:
            case Scholarship::TYPE_ACADEMIC_PARTIAL:
                $academicChecks = $this->checkAcademicScholarshipEligibility($student, $scholarship);
                $eligibilityResult = array_merge_recursive($eligibilityResult, $academicChecks);
                break;

            case Scholarship::TYPE_STUDENT_ASSISTANTSHIP:
                $assistantshipChecks = $this->checkAssistantshipEligibility($student, $scholarship);
                $eligibilityResult = array_merge_recursive($eligibilityResult, $assistantshipChecks);
                break;

            case Scholarship::TYPE_PERFORMING_ARTS_FULL:
            case Scholarship::TYPE_PERFORMING_ARTS_PARTIAL:
                $performingArtsChecks = $this->checkPerformingArtsEligibility($student, $scholarship);
                $eligibilityResult = array_merge_recursive($eligibilityResult, $performingArtsChecks);
                break;

            case Scholarship::TYPE_ECONOMIC_ASSISTANCE:
                $economicChecks = $this->checkEconomicAssistanceEligibility($student, $scholarship);
                $eligibilityResult = array_merge_recursive($eligibilityResult, $economicChecks);
                break;
        }

        // Calculate final eligibility - eligible if no requirements failed
        $eligibilityResult['eligible'] = empty($eligibilityResult['requirements_failed']);

        return $eligibilityResult;
    }

    /**
     * Get recommended scholarship types for a student based on their profile
     */
    public function getRecommendedScholarships(StudentProfile $student): Collection
    {
        $recommendations = collect();
        $availableScholarships = Scholarship::where('status', 'active')
            ->where('deadline', '>=', now())
            ->get();

        foreach ($availableScholarships as $scholarship) {
            $eligibility = $this->checkEligibility($student, $scholarship);

            if ($eligibility['eligible']) {
                $recommendations->push([
                    'scholarship' => $scholarship,
                    'eligibility_score' => $this->calculateEligibilityScore($student, $scholarship),
                    'requirements_met' => $eligibility['requirements_met'],
                    'priority' => $this->getScholarshipPriority($student, $scholarship),
                ]);
            }
        }

        return $recommendations->sortByDesc('eligibility_score');
    }

    /**
     * Check basic requirements that apply to all scholarships
     */
    private function checkBasicRequirements(StudentProfile $student, Scholarship $scholarship): array
    {
        $result = [
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
        ];

        // 1. Must be a bona fide MinSU student
        if (! $student->user || $student->enrollment_status !== 'enrolled') {
            $result['requirements_failed'][] = 'bona_fide_student';
            $result['messages'][] = 'Must be a bona fide MinSU student with active enrollment';
        } else {
            $result['requirements_met'][] = 'bona_fide_student';
        }

        // 2. Must have regular load per semester (minimum requirements)
        if ($student->units < 12) { // Minimum for regular student
            $result['requirements_failed'][] = 'regular_load';
            $result['messages'][] = 'Must have regular course load (minimum 12 units)';
        } else {
            $result['requirements_met'][] = 'regular_load';
        }

        // 3. No existing conflicting scholarships
        if ($this->hasConflictingScholarship($student, $scholarship)) {
            $result['requirements_failed'][] = 'no_existing_scholarship';
            $result['messages'][] = 'Cannot have multiple scholarships simultaneously';
        } else {
            $result['requirements_met'][] = 'no_existing_scholarship';
        }

        // 4. Must have passed all subjects
        if (! $this->hasPassedAllSubjects($student)) {
            $result['requirements_failed'][] = 'passed_all_subjects';
            $result['messages'][] = 'Must have passed all subjects in previous semester';
        } else {
            $result['requirements_met'][] = 'passed_all_subjects';
        }

        return $result;
    }

    /**
     * Check eligibility for Academic Scholarships (Full/Partial)
     */
    private function checkAcademicScholarshipEligibility(StudentProfile $student, Scholarship $scholarship): array
    {
        $result = [
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
        ];

        // Check GWA requirements
        $gwaCheck = $this->checkGWARequirements($student, $scholarship->type);
        $result = array_merge_recursive($result, $gwaCheck);

        // Must be enrolled in at least 18 units or prescribed regular load
        if ($student->units < 18) {
            $result['requirements_failed'][] = 'minimum_units';
            $result['messages'][] = 'Must be enrolled in at least 18 units or prescribed regular load';
        } else {
            $result['requirements_met'][] = 'minimum_units';
        }

        // No grade below 1.75 in any course
        if (! $this->hasNoGradeBelowThreshold($student, 1.75)) {
            $result['requirements_failed'][] = 'no_low_grades';
            $result['messages'][] = 'Must have no grade below 1.75 in any course';
        } else {
            $result['requirements_met'][] = 'no_low_grades';
        }

        // No marks of "Dropped", "Deferred", or "Failed"
        if ($this->hasUnacceptableMarks($student)) {
            $result['requirements_failed'][] = 'no_dropped_deferred_failed';
            $result['messages'][] = 'Must have no Dropped, Deferred, or Failed marks in any subject';
        } else {
            $result['requirements_met'][] = 'no_dropped_deferred_failed';
        }

        return $result;
    }

    /**
     * Check eligibility for Student Assistantship Program
     */
    private function checkAssistantshipEligibility(StudentProfile $student, Scholarship $scholarship): array
    {
        $result = [
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
        ];

        // Must not exceed 21 units per semester
        if ($student->units > 21) {
            $result['requirements_failed'][] = 'max_units';
            $result['messages'][] = 'Must not exceed 21 units per semester for assistantship';
        } else {
            $result['requirements_met'][] = 'max_units';
        }

        // No failing or incomplete grades in previous semester
        if ($this->hasFailingOrIncompleteGrades($student)) {
            $result['requirements_failed'][] = 'no_failing_incomplete';
            $result['messages'][] = 'Must have no failing or incomplete grades in previous semester';
        } else {
            $result['requirements_met'][] = 'no_failing_incomplete';
        }

        return $result;
    }

    /**
     * Check eligibility for Performing Arts Scholarships
     */
    private function checkPerformingArtsEligibility(StudentProfile $student, Scholarship $scholarship): array
    {
        $result = [
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
        ];

        // This would need integration with performing arts group database
        // For now, we'll mark as requiring manual verification
        $result['requirements_met'][] = 'membership_verification_pending';
        $result['messages'][] = 'Performing arts group membership requires manual verification by coach/adviser';

        return $result;
    }

    /**
     * Check eligibility for Economic Assistance Program
     * Per scholarships.md Section 16.5.d: Must have GWA of 2.25 or better
     */
    private function checkEconomicAssistanceEligibility(StudentProfile $student, Scholarship $scholarship): array
    {
        $result = [
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
        ];

        // Economic assistance requires GWA ≤ 2.25 (Philippine scale: lower is better)
        // Per scholarships.md: "Must have a General Weighted Average of 2.25"
        if (! $student->current_gwa) {
            $result['requirements_failed'][] = 'gwa_requirement';
            $result['messages'][] = 'GWA information not available';
        } elseif ($student->current_gwa > 2.25) {
            $result['requirements_failed'][] = 'gwa_requirement';
            $result['messages'][] = "GWA must be 2.25 or better for Economic Assistance. Current GWA: {$student->current_gwa}";
        } else {
            $result['requirements_met'][] = 'gwa_requirement';
            $result['messages'][] = "Qualified for Economic Assistance with GWA: {$student->current_gwa}";
        }

        return $result;
    }

    /**
     * Check GWA requirements for different scholarship types
     */
    private function checkGWARequirements(StudentProfile $student, string $scholarshipType): array
    {
        $result = [
            'requirements_met' => [],
            'requirements_failed' => [],
            'messages' => [],
        ];

        if (! $student->current_gwa) {
            $result['requirements_failed'][] = 'gwa_available';
            $result['messages'][] = 'GWA information not available';

            return $result;
        }

        $gwa = $student->current_gwa;

        switch ($scholarshipType) {
            case Scholarship::TYPE_ACADEMIC_FULL:
                if ($gwa >= 1.000 && $gwa <= 1.450) {
                    $result['requirements_met'][] = 'gwa_full_scholar';
                    $result['messages'][] = "Qualified for Full Academic Scholarship (President's Lister) with GWA: {$gwa}";
                } else {
                    $result['requirements_failed'][] = 'gwa_full_scholar';
                    $result['messages'][] = "GWA must be between 1.000-1.450 for Full Scholarship. Current GWA: {$gwa}";

                    // Suggest alternative
                    if ($gwa >= 1.460 && $gwa <= 1.750) {
                        $result['messages'][] = 'Consider applying for Partial Academic Scholarship instead.';
                    }
                }
                break;

            case Scholarship::TYPE_ACADEMIC_PARTIAL:
                if ($gwa >= 1.460 && $gwa <= 1.750) {
                    $result['requirements_met'][] = 'gwa_partial_scholar';
                    $result['messages'][] = "Qualified for Partial Academic Scholarship (Dean's Lister) with GWA: {$gwa}";
                } else {
                    $result['requirements_failed'][] = 'gwa_partial_scholar';
                    $result['messages'][] = "GWA must be between 1.460-1.750 for Partial Scholarship. Current GWA: {$gwa}";

                    // Suggest alternative
                    if ($gwa >= 1.000 && $gwa <= 1.450) {
                        $result['messages'][] = 'You qualify for Full Academic Scholarship instead!';
                    }
                }
                break;
        }

        return $result;
    }

    /**
     * Check if student has conflicting scholarship
     */
    private function hasConflictingScholarship(StudentProfile $student, Scholarship $scholarship): bool
    {
        // Check for existing scholarships from profile
        if (! empty($student->existing_scholarships)) {
            return true;
        }

        // Check for active approved applications
        $activeApplications = $student->scholarshipApplications()
            ->whereIn('status', [
                ScholarshipApplication::STATUS_APPROVED,
                ScholarshipApplication::STATUS_ACTIVE,
            ])
            ->where('scholarship_id', '!=', $scholarship->id)
            ->count();

        return $activeApplications > 0;
    }

    /**
     * Check if student has passed all subjects
     */
    private function hasPassedAllSubjects(StudentProfile $student): bool
    {
        // This would integrate with the grades system
        // For now, we'll check if there are any failed grades recorded
        // If no grades exist, we assume they passed (for new students)
        if (! $student->user->grades()->exists()) {
            return true; // New student with no grades yet
        }

        $failedGrades = $student->user->grades()
            ->where('grade', '>', 3.0) // Assuming 3.0+ is failing
            ->orWhere('remarks', 'like', '%fail%')
            ->orWhere('remarks', 'like', '%drop%')
            ->count();

        return $failedGrades === 0;
    }

    /**
     * Check if student has no grade below threshold
     */
    private function hasNoGradeBelowThreshold(StudentProfile $student, float $threshold): bool
    {
        // This would integrate with the grades system
        // If no grades exist, we assume they meet the requirement (for new students)
        if (! $student->user->grades()->exists()) {
            return true; // New student with no grades yet
        }

        $lowGrades = $student->user->grades()
            ->where('grade', '>', $threshold)
            ->count();

        return $lowGrades === 0;
    }

    /**
     * Check for unacceptable marks (Dropped, Deferred, Failed)
     */
    private function hasUnacceptableMarks(StudentProfile $student): bool
    {
        // This would integrate with the grades system
        // If no grades exist, we assume no unacceptable marks (for new students)
        if (! $student->user->grades()->exists()) {
            return false; // New student with no grades yet
        }

        $unacceptableMarks = $student->user->grades()
            ->where(function ($query) {
                $query->where('remarks', 'like', '%drop%')
                    ->orWhere('remarks', 'like', '%defer%')
                    ->orWhere('remarks', 'like', '%fail%')
                    ->orWhere('status', 'D')
                    ->orWhere('status', 'F')
                    ->orWhere('status', 'INC');
            })
            ->count();

        return $unacceptableMarks > 0;
    }

    /**
     * Check for failing or incomplete grades
     */
    private function hasFailingOrIncompleteGrades(StudentProfile $student): bool
    {
        // This would integrate with the grades system
        // If no grades exist, we assume no failing grades (for new students)
        if (! $student->user->grades()->exists()) {
            return false; // New student with no grades yet
        }

        $failingIncomplete = $student->user->grades()
            ->where(function ($query) {
                $query->where('grade', '>', 3.0) // Failing grade
                    ->orWhere('status', 'INC') // Incomplete
                    ->orWhere('status', 'F')   // Failed
                    ->orWhere('remarks', 'like', '%incomplete%');
            })
            ->count();

        return $failingIncomplete > 0;
    }

    /**
     * Calculate eligibility score for ranking recommendations
     */
    private function calculateEligibilityScore(StudentProfile $student, Scholarship $scholarship): int
    {
        $score = 0;

        // GWA bonus points
        if ($student->current_gwa) {
            $score += (4.0 - $student->current_gwa) * 10; // Lower GWA = higher score
        }

        // Scholarship amount consideration
        if ($scholarship->getStipendAmount()) {
            $score += $scholarship->getStipendAmount() / 100; // Higher amount = higher score
        }

        // Need-based considerations
        if ($student->total_annual_income && $student->total_annual_income < 200000) {
            $score += 20; // Economic need bonus
        }

        return (int) $score;
    }

    /**
     * Get scholarship priority based on student profile
     */
    private function getScholarshipPriority(StudentProfile $student, Scholarship $scholarship): string
    {
        // High priority for excellent academic performance
        if ($student->current_gwa && $student->current_gwa <= 1.25) {
            return 'high';
        }

        // High priority for economic need
        if ($student->total_annual_income && $student->total_annual_income < 150000) {
            return 'high';
        }

        // Medium priority for good academic performance
        if ($student->current_gwa && $student->current_gwa <= 1.75) {
            return 'medium';
        }

        return 'normal';
    }
}
