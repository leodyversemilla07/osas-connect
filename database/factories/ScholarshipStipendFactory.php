<?php

namespace Database\Factories;

use App\Models\ScholarshipApplication;
use App\Models\ScholarshipStipend;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ScholarshipStipend>
 */
class ScholarshipStipendFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = [
            ScholarshipStipend::STATUS_PENDING,
            ScholarshipStipend::STATUS_PROCESSING,
            ScholarshipStipend::STATUS_RELEASED,
            ScholarshipStipend::STATUS_FAILED,
            ScholarshipStipend::STATUS_CANCELLED,
        ];

        $fundSources = [
            ScholarshipStipend::FUND_SPECIAL_TRUST,
            ScholarshipStipend::FUND_STUDENT_DEVELOPMENT,
            ScholarshipStipend::FUND_OTHER,
        ];

        $paymentMethods = ['bank_transfer', 'cash', 'check', 'online_payment'];
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $academicYears = ['2023-2024', '2024-2025', '2025-2026'];
        $semesters = ['1st', '2nd', 'Summer'];

        $status = $this->faker->randomElement($statuses);
        $isProcessed = $status !== ScholarshipStipend::STATUS_PENDING;
        $isReleased = $status === ScholarshipStipend::STATUS_RELEASED;

        return [
            'application_id' => ScholarshipApplication::factory(),
            'processed_by' => $isProcessed ? User::factory() : null,
            'amount' => $this->faker->randomFloat(2, 1000, 10000),
            'month' => $this->faker->randomElement($months),
            'academic_year' => $this->faker->randomElement($academicYears),
            'semester' => $this->faker->randomElement($semesters),
            'status' => $status,
            'remarks' => $this->faker->optional(0.6)->sentence(),
            'processed_at' => $isProcessed ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'released_at' => $isReleased ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'fund_source' => $this->faker->randomElement($fundSources),
            'fund_reference' => $isProcessed ? $this->faker->optional(0.8)->regexify('[A-Z]{2}[0-9]{6}') : null,
            'payment_method' => $isProcessed ? $this->faker->randomElement($paymentMethods) : null,
            'payment_reference' => $isReleased ? $this->faker->optional(0.8)->regexify('[0-9]{10}') : null,
        ];
    }

    /**
     * State for released stipends
     */
    public function released(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScholarshipStipend::STATUS_RELEASED,
            'processed_at' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
            'released_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'fund_reference' => $this->faker->regexify('[A-Z]{2}[0-9]{6}'),
            'payment_reference' => $this->faker->regexify('[0-9]{10}'),
        ]);
    }

    /**
     * State for pending stipends
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScholarshipStipend::STATUS_PENDING,
            'processed_at' => null,
            'released_at' => null,
            'fund_reference' => null,
            'payment_reference' => null,
        ]);
    }
}
