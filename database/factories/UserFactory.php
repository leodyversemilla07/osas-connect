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
        $role = 'student'; // Default role for factory

        // Generate appropriate email based on role
        $email = $this->generateEmailForRole($role);

        return [
            'last_name' => fake()->lastName(),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional(0.7)->lastName(),
            'email' => $email,
            'email_verified_at' => now(),
            'password' => (static::$password ??= Hash::make('password')),
            'remember_token' => Str::random(10),
            'role' => $role,
        ];
    }

    /**
     * Generate appropriate email based on user role
     */
    private function generateEmailForRole(string $role): string
    {
        $username = fake()->unique()->userName();

        switch ($role) {
            case 'student':
                return $username.'@minsu.edu.ph';
            case 'osas_staff':
            case 'admin':
            default:
                return fake()->unique()->safeEmail();
        }
    }

    public function configure()
    {
        return $this;
    }

    /**
     * Factory state for creating users with auto-generated profiles based on role.
     * This is opt-in to avoid conflicts in tests where profiles are created manually.
     */
    public function withProfile(): static
    {
        return $this->afterCreating(function ($user) {
            // Create appropriate profile based on role
            if ($user->role === 'student') {
                \App\Models\StudentProfile::factory()->create(['user_id' => $user->id]);
            } elseif ($user->role === 'osas_staff') {
                \App\Models\OsasStaffProfile::create([
                    'user_id' => $user->id,
                    'staff_id' => 'STAFF'.str_pad(fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
                ]);
            } elseif ($user->role === 'admin') {
                \App\Models\AdminProfile::create([
                    'user_id' => $user->id,
                    'admin_id' => 'ADMIN'.str_pad(fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
                ]);
            }
        });
    }

    /**
     * @deprecated Use ->withProfile() when you need auto-generated profiles
     */
    public function withoutProfile(): static
    {
        return $this;
    }

    public function unverified(): static
    {
        return $this->state(
            fn (array $attributes) => [
                'email_verified_at' => null,
            ],
        );
    }

    /**
     * Factory state for creating admin users
     */
    public function admin(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
                'email' => $this->generateEmailForRole('admin'),
            ];
        });
    }

    /**
     * Factory state for creating OSAS staff users
     */
    public function osasStaff(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'osas_staff',
                'email' => $this->generateEmailForRole('osas_staff'),
            ];
        });
    }

    /**
     * Factory state for creating student users
     */
    public function student(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'student',
                'email' => $this->generateEmailForRole('student'),
            ];
        });
    }
}
