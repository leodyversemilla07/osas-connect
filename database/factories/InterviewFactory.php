<?php

namespace Database\Factories;

use App\Models\ScholarshipApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Interview>
 */
class InterviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $interviewTypes = ['in_person', 'online', 'phone'];
        $statuses = ['scheduled', 'completed', 'rescheduled', 'cancelled', 'no_show'];
        $locations = [
            'Room A - Administration Building',
            'Room B - Administration Building', 
            'Online - Zoom Meeting',
            'Phone Interview',
            'Conference Room 1',
        ];
        
        $status = $this->faker->randomElement($statuses);
        
        return [
            'application_id' => ScholarshipApplication::factory(),
            'interviewer_id' => User::factory(),
            'schedule' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
            'location' => $this->faker->randomElement($locations),
            'interview_type' => $this->faker->randomElement($interviewTypes),
            'status' => $status,
            'remarks' => $this->faker->optional(0.6)->sentence(),
            'interview_scores' => $status === 'completed' ? [
                $this->faker->numberBetween(70, 100),
                $this->faker->numberBetween(70, 100),
                $this->faker->numberBetween(70, 100),
            ] : null,
            'total_score' => $status === 'completed' ? $this->faker->randomFloat(2, 70, 100) : null,
            'recommendation' => $status === 'completed' ? $this->faker->randomElement([
                'approved',
                'rejected', 
                'pending'
            ]) : null,
            'interviewer_notes' => $status === 'completed' ? $this->faker->optional(0.8)->paragraph() : null,
            'completed_at' => $status === 'completed' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'reschedule_history' => $status === 'rescheduled' ? [
                [
                    'original_schedule' => $this->faker->dateTimeBetween('-10 days', '+5 days'),
                    'new_schedule' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
                    'reason' => $this->faker->sentence(),
                    'rescheduled_at' => $this->faker->dateTimeBetween('-5 days', 'now'),
                ]
            ] : null,
        ];
    }

    /**
     * State for completed interviews
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'interview_scores' => [
                $this->faker->numberBetween(70, 100),
                $this->faker->numberBetween(70, 100),
                $this->faker->numberBetween(70, 100),
            ],
            'total_score' => $this->faker->randomFloat(2, 70, 100),
            'recommendation' => $this->faker->randomElement([
                'approved',
                'rejected', 
                'pending'
            ]),
            'interviewer_notes' => $this->faker->paragraph(),
        ]);
    }

    /**
     * State for scheduled interviews
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'schedule' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
            'completed_at' => null,
            'interview_scores' => null,
            'total_score' => null,
            'recommendation' => null,
            'interviewer_notes' => null,
        ]);
    }
}
