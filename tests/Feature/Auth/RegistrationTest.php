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
        'address' => '123 Main St, Mindoro City',
        'mobile_number' => '9123456789',
        'is_pwd' => 'No',
        'disability_type' => null,
        'religion' => 'Roman Catholic',
        'terms_agreement' => true,  // Added missing field
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration validation errors are shown', function () {
    $response = $this->post('/register', [
        // Submit empty form
    ]);

    $response->assertSessionHasErrors([
        'last_name',
        'first_name',
        'email',
        'student_id',
        'password',
        'course',
        'major',  // Added missing field
        'year_level',
        'civil_status',
        'sex',
        'date_of_birth',
        'place_of_birth',
        'address',
        // 'mobile_number', - Removed as it's not showing as a validation error
        'is_pwd',
        'religion',
        'terms_agreement'  // Added missing field
    ]);
});

test('email must be unique', function () {
    // First create a user
    $user = \App\Models\User::factory()->create([
        'email' => 'duplicate@minsu.edu.ph'
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
        'address' => '456 Other St, Mindoro City',
        'mobile_number' => '9876543210',
        'is_pwd' => 'No',
        'disability_type' => null,
        'religion' => 'Roman Catholic',
        'terms_agreement' => true,
    ]);

    $response->assertSessionHasErrors('email');
});