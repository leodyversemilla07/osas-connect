<?php

use App\Models\User;

it('displays the profile page', function () {
    $user = User::factory()->student()->create();

    $response = $this->actingAs($user)->get('/settings/profile');

    $response->assertOk();
});

it('allows profile information updates', function () {
    $user = User::factory()->student()->unverified()->create();

    $response = $this->actingAs($user)->patch('/settings/profile', [
        'first_name' => 'John',
        'middle_name' => 'Doe',
        'last_name' => 'Smith',
        'email' => 'test@minsu.edu.ph',
        'student_id' => 'MBC2023-1234',
        'course' => 'Bachelor of Science in Information Technology',
        'major' => 'None',
        'year_level' => '2nd Year',
        'civil_status' => 'Single',
        'sex' => 'Male',
        'date_of_birth' => '2000-01-01',
        'place_of_birth' => 'Mindoro City, Occidental Mindoro',
        'address' => '123 Main St, Mindoro City',
        'street' => '123 Main St',
        'barangay' => 'Barangay 1',
        'city' => 'Mindoro City',
        'province' => 'Occidental Mindoro',
        'mobile_number' => '9123456789',
        'is_pwd' => false, // Changed from 'No' to boolean
        'disability_type' => null,
        'religion' => 'Roman Catholic',
        'residence_type' => "Parent's House",
        'guardian_name' => 'Not Applicable',
    ]);

    $response->assertSessionHasNoErrors()->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->first_name)->toBe('John');
    expect($user->middle_name)->toBe('Doe');
    expect($user->last_name)->toBe('Smith');
    expect($user->email)->toBe('test@minsu.edu.ph');
    expect($user->email_verified_at)->toBeNull();
});

it('preserves email verification status when email unchanged', function () {
    $user = User::factory()
        ->student()
        ->create([
            'email' => 'test@minsu.edu.ph',
        ]);

    // Load the student profile relationship
    $user->load('studentProfile');

    $response = $this->actingAs($user)->patch('/settings/profile', [
        'first_name' => $user->first_name,
        'middle_name' => $user->middle_name,
        'last_name' => $user->last_name,
        'email' => $user->email,
        'student_id' => $user->studentProfile->student_id,
        'course' => $user->studentProfile->course,
        'major' => $user->studentProfile->major,
        'year_level' => $user->studentProfile->year_level,
        'civil_status' => $user->studentProfile->civil_status,
        'sex' => $user->studentProfile->sex,
        'date_of_birth' => $user->studentProfile->date_of_birth,
        'place_of_birth' => $user->studentProfile->place_of_birth,
        'address' => $user->studentProfile->address,
        'street' => $user->studentProfile->street,
        'barangay' => $user->studentProfile->barangay,
        'city' => $user->studentProfile->city,
        'province' => $user->studentProfile->province,
        'mobile_number' => $user->studentProfile->mobile_number ? str_replace('+63', '', $user->studentProfile->mobile_number) : '',
        'is_pwd' => $user->studentProfile->is_pwd,
        'disability_type' => $user->studentProfile->disability_type,
        'religion' => $user->studentProfile->religion,
        'residence_type' => $user->studentProfile->residence_type,
        'guardian_name' => $user->studentProfile->guardian_name,
    ]);

    $response->assertSessionHasNoErrors()->assertRedirect('/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

it('allows users to delete their account', function () {
    $user = User::factory()->student()->create();

    $response = $this->actingAs($user)->delete('/settings/profile', [
        'password' => 'password',
    ]);

    $response->assertSessionHasNoErrors()->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

it('requires correct password to delete account', function () {
    $user = User::factory()->student()->create();

    $response = $this->actingAs($user)
        ->from('/settings/profile')
        ->delete('/settings/profile', [
            'password' => 'wrong-password',
        ]);

    $response->assertSessionHasErrors('password')->assertRedirect('/settings/profile');

    expect($user->fresh())->not->toBeNull();
});
