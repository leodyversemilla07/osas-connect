<?php

use App\Models\User;

it('redirects guests to login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

it('redirects authenticated students to their dashboard', function () {
    $user = User::factory()->create(['role' => 'student']); // Assign role directly

    $this->actingAs($user)->get('/dashboard')->assertRedirect(route('student.dashboard')); // Assert redirection to the student dashboard
});

it('redirects authenticated admins to their dashboard', function () {
    $user = User::factory()->create(['role' => 'admin']); // Assign role directly

    $this->actingAs($user)->get('/dashboard')->assertRedirect(route('admin.dashboard'));
});

it('redirects authenticated OSAS staff to their dashboard', function () {
    $user = User::factory()->create(['role' => 'osas_staff']); // Assign role directly

    $this->actingAs($user)->get('/dashboard')->assertRedirect(route('osas.dashboard'));
});
