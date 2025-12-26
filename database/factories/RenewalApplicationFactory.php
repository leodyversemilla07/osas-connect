<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RenewalApplication>
 */
class RenewalApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $semesters = ['First Semester', 'Second Semester'];
        $statuses = ['pending', 'under_review', 'approved', 'rejected', 'withdrawn'];

        return [
            'original_application_id' => \App\Models\ScholarshipApplication::factory(),
            'student_id' => \App\Models\User::factory(),
            'renewal_semester' => fake()->randomElement($semesters),
            'renewal_year' => fake()->year(),
            'status' => fake()->randomElement($statuses),
            'submitted_at' => fake()->optional(0.8)->dateTimeBetween('-3 months', 'now'),
            'reviewed_at' => fake()->optional(0.5)->dateTimeBetween('-2 months', 'now'),
            'reviewer_id' => fake()->optional(0.5)->randomElement(\App\Models\User::pluck('id')->toArray() ?: [null]),
            'renewal_notes' => fake()->optional(0.6)->sentence(),
            'cgpa' => fake()->randomFloat(2, 2.0, 4.0),
            'has_required_documents' => fake()->boolean(70),
            'required_document_ids' => fake()->optional(0.7)->randomElements([1, 2, 3, 4, 5], fake()->numberBetween(1, 3)),
        ];
    }

    /**
     * Indicate that the renewal is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'submitted_at' => now(),
            'reviewed_at' => null,
            'reviewer_id' => null,
        ]);
    }

    /**
     * Indicate that the renewal is under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
            'submitted_at' => now()->subDays(3),
            'reviewed_at' => null,
        ]);
    }

    /**
     * Indicate that the renewal is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'submitted_at' => now()->subWeeks(2),
            'reviewed_at' => now()->subWeek(),
            'reviewer_id' => \App\Models\User::factory(),
            'renewal_notes' => 'Renewal approved. Student meets all requirements.',
        ]);
    }

    /**
     * Indicate that the renewal is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'submitted_at' => now()->subWeeks(2),
            'reviewed_at' => now()->subWeek(),
            'reviewer_id' => \App\Models\User::factory(),
            'renewal_notes' => 'Renewal rejected. CGPA below required threshold.',
        ]);
    }

    /**
     * Indicate the renewal is for a specific period.
     */
    public function forPeriod(string $semester, int $year): static
    {
        return $this->state(fn (array $attributes) => [
            'renewal_semester' => $semester,
            'renewal_year' => $year,
        ]);
    }
}
