<?php

use App\Models\Scholarship;
use App\Models\StudentProfile;
use App\Models\User;
use App\Services\ScholarshipEligibilityService;

beforeEach(function () {
    $this->eligibilityService = new ScholarshipEligibilityService;
});

describe('ScholarshipEligibilityService', function () {
    it('checks basic requirements correctly', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'current_gwa' => 1.25,
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility)->toHaveKeys(['eligible', 'requirements_met', 'requirements_failed', 'messages']);
        expect($eligibility['requirements_met'])->toContain('bona_fide_student');
        expect($eligibility['requirements_met'])->toContain('regular_load');
        expect($eligibility['requirements_met'])->toContain('no_existing_scholarship');
    });

    it('fails eligibility for insufficient GWA for full scholarship', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'current_gwa' => 2.00, // Too high for full scholarship
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeFalse();
        expect($eligibility['requirements_failed'])->toContain('gwa_full_scholar');
    });

    it('passes eligibility for correct GWA range for full scholarship', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'current_gwa' => 1.25, // Perfect for full scholarship
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeTrue();
        expect($eligibility['requirements_met'])->toContain('gwa_full_scholar');
    });

    it('fails eligibility for assistantship with too many units', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 24, // Too many units for assistantship
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_STUDENT_ASSISTANTSHIP,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeFalse();
        expect($eligibility['requirements_failed'])->toContain('max_units');
    });

    it('passes eligibility for assistantship with acceptable units', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18, // Acceptable units for assistantship
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_STUDENT_ASSISTANTSHIP,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeTrue();
        expect($eligibility['requirements_met'])->toContain('max_units');
    });

    it('fails eligibility for economic assistance with high GWA', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'current_gwa' => 1.50, // Too low (good) for economic assistance
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ECONOMIC_ASSISTANCE,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeFalse();
        expect($eligibility['requirements_failed'])->toContain('gwa_requirement');
    });

    it('detects conflicting scholarships', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'existing_scholarships' => 'TES', // Has existing scholarship
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeFalse();
        expect($eligibility['requirements_failed'])->toContain('no_existing_scholarship');
    });

    it('gets recommended scholarships based on student profile', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'current_gwa' => 1.25, // Qualifies for full scholarship
            'existing_scholarships' => null,
        ]);

        // Create multiple scholarship types
        Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);

        Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_PARTIAL,
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);

        $recommendations = $this->eligibilityService->getRecommendedScholarships($student);

        expect($recommendations->count())->toBeGreaterThan(0);

        // Should recommend full scholarship first (better GWA)
        $firstRecommendation = $recommendations->first();
        expect($firstRecommendation['scholarship']->type)->toBe(Scholarship::TYPE_ACADEMIC_FULL);
    });

    it('fails eligibility for insufficient units', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 9, // Below minimum required units
            'existing_scholarships' => null,
        ]);

        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
        ]);

        $eligibility = $this->eligibilityService->checkEligibility($student, $scholarship);

        expect($eligibility['eligible'])->toBeFalse();
        expect($eligibility['requirements_failed'])->toContain('regular_load');
    });

    it('calculates eligibility score correctly', function () {
        $user = User::factory()->create(['role' => 'student']);
        $student = StudentProfile::factory()->create([
            'user_id' => $user->id,
            'enrollment_status' => 'enrolled',
            'units' => 18,
            'current_gwa' => 1.25,
            'existing_scholarships' => null,
        ]);

        Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);

        $recommendations = $this->eligibilityService->getRecommendedScholarships($student);

        expect($recommendations->count())->toBe(1);

        $recommendation = $recommendations->first();
        expect($recommendation['eligibility_score'])->toBeGreaterThan(0);
        expect($recommendation['priority'])->toBe('high');
    });
});
