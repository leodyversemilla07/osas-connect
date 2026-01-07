<?php

namespace Database\Factories;

use App\Models\StudentAssistantshipAssignment;
use App\Models\User;
use App\Models\WorkHourLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkHourLogFactory extends Factory
{
    protected $model = WorkHourLog::class;

    public function definition(): array
    {
        $timeIn = $this->faker->time('H:i', '12:00');
        $timeOut = $this->faker->time('H:i', '17:00');
        
        // Ensure time_out is after time_in
        if ($timeOut <= $timeIn) {
            $timeOut = '17:00';
        }

        // Calculate hours
        $hoursWorked = (strtotime($timeOut) - strtotime($timeIn)) / 3600;

        return [
            'assignment_id' => StudentAssistantshipAssignment::factory()->active(),
            'user_id' => User::factory(),
            'work_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'time_in' => $timeIn,
            'time_out' => $timeOut,
            'hours_worked' => round($hoursWorked, 2),
            'hours_approved' => null,
            'status' => WorkHourLog::STATUS_PENDING,
            'approved_by' => null,
            'approved_at' => null,
            'tasks_performed' => $this->faker->sentence(),
            'supervisor_remarks' => null,
            'rejection_reason' => null,
        ];
    }

    /**
     * Indicate pending status.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkHourLog::STATUS_PENDING,
            'hours_approved' => null,
            'approved_by' => null,
            'approved_at' => null,
        ]);
    }

    /**
     * Indicate approved status.
     */
    public function approved(?User $approver = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkHourLog::STATUS_APPROVED,
            'hours_approved' => $attributes['hours_worked'],
            'approved_by' => $approver?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
            'approved_at' => now(),
            'supervisor_remarks' => 'Approved',
        ]);
    }

    /**
     * Indicate rejected status.
     */
    public function rejected(?User $approver = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkHourLog::STATUS_REJECTED,
            'hours_approved' => 0,
            'approved_by' => $approver?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
            'approved_at' => now(),
            'rejection_reason' => $this->faker->sentence(),
        ]);
    }

    /**
     * Indicate paid status.
     */
    public function paid(?User $approver = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkHourLog::STATUS_PAID,
            'hours_approved' => $attributes['hours_worked'],
            'approved_by' => $approver?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
            'approved_at' => now()->subDays(7),
        ]);
    }

    /**
     * Set specific work date.
     */
    public function forDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'work_date' => $date,
        ]);
    }

    /**
     * Set specific hours.
     */
    public function withHours(float $hours): static
    {
        return $this->state(fn (array $attributes) => [
            'time_in' => '08:00',
            'time_out' => sprintf('%02d:00', 8 + (int)$hours),
            'hours_worked' => $hours,
        ]);
    }
}
