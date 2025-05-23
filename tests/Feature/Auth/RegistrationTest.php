<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'last_name' => 'Doe',
        'first_name' => 'John',
        'middle_name' => 'Smith',
        'email' => 'jdoe123@minsu.edu.ph',
        'student_id' => 'MBC2023-1234',
        'password' => 'password',
        'password_confirmation' => 'password',
        'course' => 'Bachelor of Science in Information Technology',
        'major' => 'None',
        'year_level' => '2nd Year',
        'civil_status' => 'Single',
        'sex' => 'Male',
        'date_of_birth' => '2000-01-01',
        'place_of_birth' => 'Mindoro City, Occidental Mindoro',
        'street' => '123 Main St',
        'barangay' => 'Barangay 1',
        'city' => 'Mindoro City',
        'province' => 'Occidental Mindoro',
        'mobile_number' => '9123456789',
        'telephone_number' => null,
        'is_pwd' => 'No',
        'disability_type' => null,
        'religion' => 'Roman Catholic',
        'residence_type' => "Parent's House",
        'guardian_name' => 'Not Applicable',
        'scholarships' => null,
        'terms_agreement' => true,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration validation errors are shown', function () {
    $response = $this->post('/register', []);

    $response->assertSessionHasErrors([
        'last_name',
        'first_name',
        'email',
        'student_id',
        'password',
        'course',
        'major',
        'year_level',
        'civil_status',
        'sex',
        'date_of_birth',
        'place_of_birth',
        'street',
        'barangay',
        'city',
        'province',
        'mobile_number',
        'is_pwd',
        'religion',
        'residence_type',
        'guardian_name',
        'terms_agreement',
    ]);
});

test('email must be unique', function () {
    // First create a user
    $user = \App\Models\User::factory()->create([
        'email' => 'duplicate@minsu.edu.ph',
    ]);

    // Try to register with the same email
    $response = $this->post('/register', [
        'last_name' => 'Smith',
        'first_name' => 'Jane',
        'middle_name' => null,
        'email' => 'duplicate@minsu.edu.ph',
        'student_id' => 'MBC2023-5678',
        'password' => 'password',
        'password_confirmation' => 'password',
        'course' => 'Bachelor of Science in Information Technology',
        'major' => 'None',
        'year_level' => '3rd Year',
        'civil_status' => 'Single',
        'sex' => 'Female',
        'date_of_birth' => '2001-05-15',
        'place_of_birth' => 'Mindoro City, Occidental Mindoro',
        'street' => '456 Other St',
        'barangay' => 'Barangay 2',
        'city' => 'Mindoro City',
        'province' => 'Occidental Mindoro',
        'mobile_number' => '9876543210',
        'telephone_number' => null,
        'is_pwd' => 'No',
        'disability_type' => null,
        'religion' => 'Roman Catholic',
        'residence_type' => "Parent's House",
        'guardian_name' => 'Not Applicable',
        'scholarships' => null,
        'terms_agreement' => true,
    ]);

    $response->assertSessionHasErrors('email');
});
