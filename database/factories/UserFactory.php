<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'last_name' => fake()->lastName(),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional(0.7)->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'student', // Default role for factory
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($user) {
            // Create appropriate profile based on role
            if ($user->role === 'student') {
                \App\Models\StudentProfile::factory()->create(['user_id' => $user->id]);
            } elseif ($user->role === 'osas_staff') {
                // Create OSAS staff profile manually if factory doesn't exist
                \App\Models\OsasStaffProfile::create([
                    'user_id' => $user->id,
                    'staff_id' => 'STAFF' . str_pad(fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
                ]);
            } elseif ($user->role === 'admin') {
                // Create admin profile manually if factory doesn't exist
                \App\Models\AdminProfile::create([
                    'user_id' => $user->id,
                    'admin_id' => 'ADMIN' . str_pad(fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
                ]);
            }
        });
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
