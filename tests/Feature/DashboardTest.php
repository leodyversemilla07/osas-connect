<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated student users can visit the dashboard', function () {
    $user = User::factory()->create(['role' => 'student']); // Assign role directly

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertRedirect(route('student.dashboard')); // Assert redirection to the student dashboard
});

test('authenticated admin users are redirected to the admin dashboard', function () {
    $user = User::factory()->create(['role' => 'admin']); // Assign role directly

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertRedirect(route('admin.dashboard'));
});

test('authenticated osas_staff users are redirected to the osas_staff dashboard', function () {
    $user = User::factory()->create(['role' => 'osas_staff']); // Assign role directly

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertRedirect(route('osas.dashboard'));
});
