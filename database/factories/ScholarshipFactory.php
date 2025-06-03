<?php

namespace Database\Factories;

use App\Models\Scholarship;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Scholarship>
 */
class ScholarshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = array_keys(Scholarship::TYPES);

        return [
            'name' => $this->faker->sentence(4),
            'type' => $this->faker->randomElement($types),
            'description' => $this->faker->paragraphs(3, true),
            'amount' => $this->faker->randomFloat(2, 100, 1000),
            'stipend_amount' => $this->faker->randomFloat(2, 100, 500),
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+3 months'),
            'slots' => $this->faker->numberBetween(5, 50),
            'beneficiaries' => $this->faker->numberBetween(0, 10),
            'funding_source' => 'MinSU Institutional Fund',
            'eligibility_criteria' => json_encode([
                'academic_standing' => 'good_standing',
                'enrollment_status' => 'enrolled',
            ]),
            'required_documents' => json_encode([
                'application_form',
                'academic_records',
                'enrollment_certificate',
            ]),
            'stipend_schedule' => $this->faker->randomElement(['monthly', 'semestral']),
            'slots_available' => $this->faker->numberBetween(5, 50),
            'status' => $this->faker->randomElement(['draft', 'active', 'inactive', 'upcoming']),
        ];
    }
}
