<?php

use App\Models\RenewalApplication;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;
use App\Services\DocumentVerificationService;
use App\Services\ScholarshipEligibilityService;
use App\Services\ScholarshipRenewalService;

beforeEach(function () {
    $this->renewalService = app(ScholarshipRenewalService::class);
});

test('checks renewal eligibility for approved application', function () {
    $student = User::factory()->create();
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'cgpa' => 3.5,
        'enrollment_status' => 'enrolled',
        'has_disciplinary_action' => false,
    ]);

    $scholarship = Scholarship::factory()->create([
        'type' => Scholarship::TYPE_ACADEMIC_FULL,
    ]);

    $application = ScholarshipApplication::factory()->create([
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => 'approved',
    ]);

    $eligibility = $this->renewalService->checkRenewalEligibility(
        $application,
        'First Semester',
        2025
    );

    expect($eligibility['eligible'])->toBeTrue()
        ->and($eligibility['requirements_met'])->toContain('cgpa_requirement')
        ->and($eligibility['requirements_met'])->toContain('enrollment_status')
        ->and($eligibility['requirements_met'])->toContain('good_standing');
});

test('rejects renewal eligibility for low CGPA', function () {
    $student = User::factory()->create();
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'cgpa' => 2.0, // Too low for academic scholarship
        'enrollment_status' => 'enrolled',
        'has_disciplinary_action' => false,
    ]);

    $scholarship = Scholarship::factory()->create([
        'type' => Scholarship::TYPE_ACADEMIC_FULL,
    ]);

    $application = ScholarshipApplication::factory()->create([
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => 'approved',
    ]);

    $eligibility = $this->renewalService->checkRenewalEligibility(
        $application,
        'First Semester',
        2025
    );

    expect($eligibility['eligible'])->toBeFalse()
        ->and($eligibility['requirements_failed'])->toContain('cgpa_below_minimum');
});

test('rejects renewal eligibility for unapproved application', function () {
    $student = User::factory()->create();
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'cgpa' => 3.5,
        'enrollment_status' => 'enrolled',
    ]);

    $scholarship = Scholarship::factory()->create();

    $application = ScholarshipApplication::factory()->create([
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => 'pending', // Not approved yet
    ]);

    $eligibility = $this->renewalService->checkRenewalEligibility(
        $application,
        'First Semester',
        2025
    );

    expect($eligibility['eligible'])->toBeFalse()
        ->and($eligibility['requirements_failed'])->toContain('original_application_not_approved');
});

test('rejects renewal eligibility if already renewed for period', function () {
    $student = User::factory()->create();
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'cgpa' => 3.5,
        'enrollment_status' => 'enrolled',
    ]);

    $scholarship = Scholarship::factory()->create();

    $application = ScholarshipApplication::factory()->create([
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => 'approved',
    ]);

    // Create existing renewal
    RenewalApplication::factory()->create([
        'original_application_id' => $application->id,
        'student_id' => $student->id,
        'renewal_semester' => 'First Semester',
        'renewal_year' => 2025,
    ]);

    $eligibility = $this->renewalService->checkRenewalEligibility(
        $application,
        'First Semester',
        2025
    );

    expect($eligibility['eligible'])->toBeFalse()
        ->and($eligibility['requirements_failed'])->toContain('already_renewed');
});

test('creates renewal application successfully', function () {
    $student = User::factory()->create();
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'cgpa' => 3.5,
        'enrollment_status' => 'enrolled',
        'has_disciplinary_action' => false,
    ]);

    $scholarship = Scholarship::factory()->create([
        'type' => Scholarship::TYPE_ACADEMIC_FULL,
    ]);

    $application = ScholarshipApplication::factory()->create([
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => 'approved',
    ]);

    $renewal = $this->renewalService->createRenewalApplication(
        $application,
        'First Semester',
        2025,
        ['cgpa' => 3.6, 'notes' => 'Test renewal']
    );

    expect($renewal)->toBeInstanceOf(RenewalApplication::class)
        ->and($renewal->status)->toBe('pending')
        ->and($renewal->renewal_semester)->toBe('First Semester')
        ->and($renewal->renewal_year)->toBe(2025)
        ->and($renewal->cgpa)->toBe('3.60');
});

test('approves renewal application', function () {
    $renewal = RenewalApplication::factory()->pending()->create();
    $reviewer = User::factory()->create();

    $approvedRenewal = $this->renewalService->approveRenewal(
        $renewal,
        $reviewer,
        'Approved - meets all requirements'
    );

    expect($approvedRenewal->status)->toBe('approved')
        ->and($approvedRenewal->reviewer_id)->toBe($reviewer->id)
        ->and($approvedRenewal->reviewed_at)->not->toBeNull()
        ->and($approvedRenewal->renewal_notes)->toContain('Approved');
});

test('rejects renewal application', function () {
    $renewal = RenewalApplication::factory()->pending()->create();
    $reviewer = User::factory()->create();

    $rejectedRenewal = $this->renewalService->rejectRenewal(
        $renewal,
        $reviewer,
        'Rejected - insufficient CGPA'
    );

    expect($rejectedRenewal->status)->toBe('rejected')
        ->and($rejectedRenewal->reviewer_id)->toBe($reviewer->id)
        ->and($rejectedRenewal->reviewed_at)->not->toBeNull()
        ->and($rejectedRenewal->renewal_notes)->toContain('insufficient CGPA');
});

test('gets renewal statistics for period', function () {
    // Create renewals with different statuses
    RenewalApplication::factory()->pending()->forPeriod('First Semester', 2025)->create();
    RenewalApplication::factory()->approved()->forPeriod('First Semester', 2025)->create();
    RenewalApplication::factory()->rejected()->forPeriod('First Semester', 2025)->create();
    RenewalApplication::factory()->underReview()->forPeriod('First Semester', 2025)->create();

    $stats = $this->renewalService->getRenewalStatistics('First Semester', 2025);

    expect($stats['total'])->toBe(4)
        ->and($stats['pending'])->toBe(1)
        ->and($stats['approved'])->toBe(1)
        ->and($stats['rejected'])->toBe(1)
        ->and($stats['under_review'])->toBe(1)
        ->and($stats['approval_rate'])->toBe(25.0);
});

test('gets upcoming renewal deadlines', function () {
    $deadlines = $this->renewalService->getUpcomingRenewalDeadlines();

    expect($deadlines)->toHaveKeys(['current_semester', 'next_semester'])
        ->and($deadlines['current_semester'])->toHaveKeys(['semester', 'year', 'deadline'])
        ->and($deadlines['next_semester'])->toHaveKeys(['semester', 'year', 'deadline']);
});

