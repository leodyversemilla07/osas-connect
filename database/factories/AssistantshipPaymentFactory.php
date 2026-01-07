<?php

namespace Database\Factories;

use App\Models\AssistantshipPayment;
use App\Models\StudentAssistantshipAssignment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssistantshipPaymentFactory extends Factory
{
    protected $model = AssistantshipPayment::class;

    public function definition(): array
    {
        $totalHours = $this->faker->randomFloat(2, 20, 80);
        $hourlyRate = 50.00;
        $grossAmount = $totalHours * $hourlyRate;
        $deductions = 0;

        return [
            'assignment_id' => StudentAssistantshipAssignment::factory()->active(),
            'user_id' => User::factory(),
            'period_start' => now()->subMonth()->startOfMonth(),
            'period_end' => now()->subMonth()->endOfMonth(),
            'total_hours' => $totalHours,
            'hourly_rate' => $hourlyRate,
            'gross_amount' => $grossAmount,
            'deductions' => $deductions,
            'net_amount' => $grossAmount - $deductions,
            'status' => AssistantshipPayment::STATUS_PENDING,
            'processed_by' => null,
            'processed_at' => null,
            'released_at' => null,
            'payment_reference' => null,
            'remarks' => null,
        ];
    }

    /**
     * Indicate pending status.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AssistantshipPayment::STATUS_PENDING,
        ]);
    }

    /**
     * Indicate processing status.
     */
    public function processing(?User $processor = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AssistantshipPayment::STATUS_PROCESSING,
            'processed_by' => $processor?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
            'processed_at' => now(),
        ]);
    }

    /**
     * Indicate released status.
     */
    public function released(?User $processor = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AssistantshipPayment::STATUS_RELEASED,
            'processed_by' => $processor?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
            'processed_at' => now()->subDays(3),
            'released_at' => now(),
            'payment_reference' => 'PAY-' . strtoupper($this->faker->bothify('??####')),
        ]);
    }

    /**
     * Indicate on_hold status.
     */
    public function onHold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AssistantshipPayment::STATUS_ON_HOLD,
            'remarks' => 'Payment on hold: ' . $this->faker->sentence(),
        ]);
    }

    /**
     * Set specific period.
     */
    public function forPeriod(string $start, string $end): static
    {
        return $this->state(fn (array $attributes) => [
            'period_start' => $start,
            'period_end' => $end,
        ]);
    }

    /**
     * Set specific amount.
     */
    public function withAmount(float $hours, float $rate = 50.00): static
    {
        $gross = $hours * $rate;
        return $this->state(fn (array $attributes) => [
            'total_hours' => $hours,
            'hourly_rate' => $rate,
            'gross_amount' => $gross,
            'net_amount' => $gross,
        ]);
    }
}
