<?php

use function Pest\Laravel\post;

describe('Basic Validation Testing', function () {
    it('requires basic fields for registration', function () {
        $response = post('/register', []);

        $response->assertSessionHasErrors([
            'first_name',
            'last_name',
            'email',
            'password',
        ]);
    });

    it('validates email format', function () {
        $response = post('/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'not-an-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    });

    it('requires password confirmation to match', function () {
        $response = post('/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'test@minsu.edu.ph',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ]);

        $response->assertSessionHasErrors('password');
    });
});
