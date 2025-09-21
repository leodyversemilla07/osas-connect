<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

it('renders the login screen', function () {
    $response = get('/login');

    $response->assertSuccessful();
});

it('authenticates users with valid credentials', function () {
    /** @var User $user */
    $user = User::factory()->create();

    $response = post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

it('does not authenticate users with invalid password', function () {
    /** @var User $user */
    $user = User::factory()->create();

    post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

it('logs out authenticated users', function () {
    /** @var User $user */
    $user = User::factory()->create();

    $response = actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
