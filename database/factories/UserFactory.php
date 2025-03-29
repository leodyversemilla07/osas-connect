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
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $courses = [
            'Bachelor of Arts in Political Science',
            'Bachelor of Science in Tourism Management',
            'Bachelor of Science in Hospitality Management',
            'Bachelor of Science in Information Technology',
            'Bachelor of Science in Computer Engineering',
            'Bachelor of Science in Criminology',
            'Bachelor of Secondary Education',
            'Bachelor of Elementary Education',
            'Bachelor of Science in Fisheries'
        ];

        $course = fake()->randomElement($courses);
        $major = 'None';

        // Assign majors based on education courses
        if ($course === 'Bachelor of Secondary Education') {
            $major = fake()->randomElement(['English', 'Mathematics', 'Science', 'Filipino', 'Social Studies']);
        } elseif ($course === 'Bachelor of Elementary Education') {
            $major = fake()->randomElement(['General Education', 'Special Education', 'Pre-School Education']);
        }

        $isPwd = fake()->randomElement(['Yes', 'No']);

        return [
            'last_name' => fake()->lastName(),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional(0.7)->lastName(),
            'email' => fake()->unique()->userName() . '@minsu.edu.ph',
            'student_id' => 'MBC' . fake()->numberBetween(2020, 2025) . '-' . fake()->unique()->randomNumber(4, true),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'course' => $course,
            'major' => $major,
            'year_level' => fake()->randomElement(['1st Year', '2nd Year', '3rd Year', '4th Year']),
            'civil_status' => fake()->randomElement(['Single', 'Married', 'Widowed', 'Separated', 'Annulled']),
            'sex' => fake()->randomElement(['Male', 'Female']),
            'date_of_birth' => fake()->dateTimeBetween('-25 years', '-17 years')->format('Y-m-d'),
            'place_of_birth' => fake()->city() . ', ' . fake()->state(),
            'address' => fake()->address(),
            'mobile_number' => fake()->numerify('9#########'),
            'is_pwd' => $isPwd,
            'disability_type' => $isPwd === 'Yes' ? fake()->randomElement(['Visual Impairment', 'Hearing Impairment', 'Physical Disability', 'Learning Disability']) : null,
            'religion' => fake()->randomElement([
                'Roman Catholic',
                'Islam',
                'Iglesia ni Cristo',
                'Methodist',
                'Seventh Day Adventist',
                'Baptist',
                'Prefer not to say'
            ]),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
