<?php

namespace Database\Factories;

use App\Models\ScholarshipApplication;
use App\Models\StudentAssistantshipAssignment;
use App\Models\UniversityOffice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentAssistantshipAssignmentFactory extends Factory
{
    protected $model = StudentAssistantshipAssignment::class;

    public function definition(): array
    {
        $statuses = [
            StudentAssistantshipAssignment::STATUS_PENDING_SCREENING,
            StudentAssistantshipAssignment::STATUS_SCREENING_SCHEDULED,
            StudentAssistantshipAssignment::STATUS_APPROVED,
            StudentAssistantshipAssignment::STATUS_ACTIVE,
        ];

        return [
            'application_id' => ScholarshipApplication::factory(),
            'user_id' => User::factory(),
            'office_id' => UniversityOffice::factory(),
            'supervisor_id' => null,
            'status' => $this->faker->randomElement($statuses),
            'work_schedule' => [
                'monday' => '08:00-12:00',
                'wednesday' => '13:00-17:00',
                'friday' => '08:00-12:00',
            ],
            'hours_per_week' => $this->faker->randomElement([8, 10, 12, 15]),
            'hourly_rate' => 50.00,
            'screening_date' => null,
            'screening_notes' => null,
            'screening_score' => null,
            'screened_by' => null,
            'start_date' => null,
            'end_date' => null,
            'academic_year' => now()->year,
            'semester' => '1st',
            'duties_responsibilities' => $this->faker->paragraph(),
            'remarks' => null,
        ];
    }

    /**
     * Indicate pending screening status.
     */
    public function pendingScreening(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StudentAssistantshipAssignment::STATUS_PENDING_SCREENING,
        ]);
    }

    /**
     * Indicate screening scheduled status.
     */
    public function screeningScheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StudentAssistantshipAssignment::STATUS_SCREENING_SCHEDULED,
            'screening_date' => now()->addDays(3),
        ]);
    }

    /**
     * Indicate screening completed status.
     */
    public function screeningCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StudentAssistantshipAssignment::STATUS_SCREENING_COMPLETED,
            'screening_date' => now()->subDays(1),
            'screening_score' => $this->faker->randomFloat(2, 70, 100),
            'screening_notes' => $this->faker->sentence(),
        ]);
    }

    /**
     * Indicate approved status.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StudentAssistantshipAssignment::STATUS_APPROVED,
            'screening_date' => now()->subDays(5),
            'screening_score' => $this->faker->randomFloat(2, 75, 100),
            'screening_notes' => 'Passed screening',
            'start_date' => now()->addDays(7),
            'end_date' => now()->addMonths(4),
        ]);
    }

    /**
     * Indicate active status.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StudentAssistantshipAssignment::STATUS_ACTIVE,
            'screening_date' => now()->subMonth(),
            'screening_score' => $this->faker->randomFloat(2, 75, 100),
            'screening_notes' => 'Passed screening',
            'start_date' => now()->subWeeks(2),
            'end_date' => now()->addMonths(3),
        ]);
    }

    /**
     * Indicate rejected status.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StudentAssistantshipAssignment::STATUS_REJECTED,
            'screening_date' => now()->subDays(3),
            'screening_score' => $this->faker->randomFloat(2, 40, 65),
            'screening_notes' => 'Did not meet requirements',
        ]);
    }

    /**
     * Set supervisor for assignment.
     */
    public function withSupervisor(?User $supervisor = null): static
    {
        return $this->state(fn (array $attributes) => [
            'supervisor_id' => $supervisor?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
        ]);
    }
}
