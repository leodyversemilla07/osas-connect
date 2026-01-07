<?php

use App\Models\RenewalApplication;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;

test('student can check renewal eligibility', function () {
    $student = User::factory()->withoutProfile()->create(['role' => 'student']);
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'current_gwa' => 1.25,
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

    $response = $this->actingAs($student)->get(route('renewal.check-eligibility', $application));

    // Check for either successful response or Vite manifest error (when frontend not built)
    if ($response->status() === 500 && str_contains($response->getContent(), 'Vite manifest')) {
        $this->markTestSkipped('Vite manifest not available - frontend not built');
    }
    
    $response->assertSuccessful();
});

test('student can submit renewal application', function () {
    $student = User::factory()->withoutProfile()->create(['role' => 'student']);
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'current_gwa' => 1.25,
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

    $response = $this->actingAs($student)->post(route('renewal.store', $application), [
        'semester' => 'First Semester',
        'year' => 2025,
        'current_gwa' => 1.3,
        'notes' => 'I would like to renew my scholarship',
    ]);

    if (session('error')) {
        dump(session('error'));
    }

    $response->assertRedirect();
    $this->assertDatabaseHas('renewal_applications', [
        'original_application_id' => $application->id,
        'student_id' => $student->id,
        'renewal_semester' => 'First Semester',
        'renewal_year' => 2025,
        'status' => 'pending',
    ]);
});

test('student cannot submit renewal if ineligible', function () {
    $student = User::factory()->withoutProfile()->create(['role' => 'student']);
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'current_gwa' => 3.5, // Too low for full academic
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

    $response = $this->actingAs($student)->post(route('renewal.store', $application), [
        'semester' => 'First Semester',
        'year' => 2025,
        'current_gwa' => 3.5,
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('renewal_applications', [
        'original_application_id' => $application->id,
        'renewal_semester' => 'First Semester',
        'renewal_year' => 2025,
    ]);
});

test('staff can review and approve renewals', function () {
    $student = User::factory()->withoutProfile()->create(['role' => 'student']);
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'current_gwa' => 1.25,
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

    $renewal = RenewalApplication::factory()->create([
        'original_application_id' => $application->id,
        'student_id' => $student->id,
        'status' => 'pending',
    ]);

    $staff = User::factory()->create(['role' => 'osas_staff']);

    $response = $this->actingAs($staff)->post(route('renewal.staff.approve', $renewal), [
        'notes' => 'Approved - excellent performance',
    ]);

    if (session('error')) {
        dump(session('error'));
    }

    $response->assertRedirect(route('renewal.staff.index'));

    $renewal->refresh();
    expect($renewal->status)->toBe('approved')
        ->and($renewal->reviewer_id)->toBe($staff->id)
        ->and($renewal->is_renewal)->toBeTrue()
        ->and($renewal->last_renewed_at)->not->toBeNull();
});
