<?php

namespace Database\Factories;

use App\Models\UniversityOffice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UniversityOfficeFactory extends Factory
{
    protected $model = UniversityOffice::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Office',
            'code' => strtoupper($this->faker->unique()->lexify('???')),
            'description' => $this->faker->sentence(),
            'location' => 'Building ' . $this->faker->randomLetter() . ', Room ' . $this->faker->numberBetween(100, 500),
            'supervisor_id' => null,
            'max_assistants' => $this->faker->numberBetween(3, 10),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the office has a supervisor.
     */
    public function withSupervisor(?User $supervisor = null): static
    {
        return $this->state(fn (array $attributes) => [
            'supervisor_id' => $supervisor?->id ?? User::factory()->create(['role' => 'osas_staff'])->id,
        ]);
    }

    /**
     * Indicate that the office is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
