<?php

use App\Models\RenewalApplication;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;

test('student can check renewal eligibility', function () {
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

    $response = $this->actingAs($student)->get(route('renewal.check-eligibility', $application));

    $response->assertSuccessful();
});

test('student can submit renewal application', function () {
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

    $response = $this->actingAs($student)->post(route('renewal.store', $application), [
        'semester' => 'First Semester',
        'year' => 2025,
        'cgpa' => 3.6,
        'notes' => 'I would like to renew my scholarship',
    ]);

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
    $student = User::factory()->create();
    $studentProfile = StudentProfile::factory()->create([
        'user_id' => $student->id,
        'cgpa' => 2.0, // Too low
        'enrollment_status' => 'enrolled',
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
        'cgpa' => 2.0,
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('renewal_applications', [
        'original_application_id' => $application->id,
        'renewal_semester' => 'First Semester',
        'renewal_year' => 2025,
    ]);
});

test('staff can approve renewal', function () {
    $staff = User::factory()->create();
    $staff->assignRole('osas_staff');

    $renewal = RenewalApplication::factory()->pending()->create();

    $response = $this->actingAs($staff)->post(route('renewal.staff.approve', $renewal), [
        'notes' => 'Approved - meets requirements',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('renewal_applications', [
        'id' => $renewal->id,
        'status' => 'approved',
        'reviewer_id' => $staff->id,
    ]);
});

test('staff can reject renewal', function () {
    $staff = User::factory()->create();
    $staff->assignRole('osas_staff');

    $renewal = RenewalApplication::factory()->pending()->create();

    $response = $this->actingAs($staff)->post(route('renewal.staff.reject', $renewal), [
        'reason' => 'CGPA below requirement',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('renewal_applications', [
        'id' => $renewal->id,
        'status' => 'rejected',
        'reviewer_id' => $staff->id,
    ]);
});

test('complete renewal workflow', function () {
    // Step 1: Create student with approved application
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

    // Step 2: Student checks eligibility
    $response = $this->actingAs($student)->get(route('renewal.check-eligibility', $application));
    $response->assertSuccessful();

    // Step 3: Student submits renewal
    $response = $this->actingAs($student)->post(route('renewal.store', $application), [
        'semester' => 'First Semester',
        'year' => 2025,
        'cgpa' => 3.6,
        'notes' => 'I would like to renew my scholarship',
    ]);
    $response->assertRedirect();

    // Step 4: Verify renewal created
    $renewal = RenewalApplication::where('student_id', $student->id)->first();
    expect($renewal)->not->toBeNull()
        ->and($renewal->status)->toBe('pending');

    // Step 5: Staff reviews and approves
    $staff = User::factory()->create();
    $staff->assignRole('osas_staff');

    $response = $this->actingAs($staff)->post(route('renewal.staff.approve', $renewal), [
        'notes' => 'Approved - excellent performance',
    ]);
    $response->assertRedirect();

    // Step 6: Verify renewal approved and original application updated
    $renewal->refresh();
    expect($renewal->status)->toBe('approved')
        ->and($renewal->reviewer_id)->toBe($staff->id);

    $application->refresh();
    expect($application->is_renewal)->toBeTrue()
        ->and($application->last_renewed_at)->not->toBeNull();
});

