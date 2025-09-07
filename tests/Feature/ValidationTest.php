<?php

use function Pest\Laravel\post;

describe('Basic Validation Testing', function () {
    test('registration requires basic fields', function () {
        $response = post('/register', []);

        $response->assertSessionHasErrors([
            'first_name',
            'last_name',
            'email',
            'password',
        ]);
    });

    test('email must be properly formatted', function () {
        $response = post('/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'not-an-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    });

    test('password confirmation must match', function () {
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
