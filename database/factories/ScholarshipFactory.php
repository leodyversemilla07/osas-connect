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
        $types = [
            'academic_full',
            'academic_partial',
            'student_assistantship',
            'performing_arts_full',
            'performing_arts_partial',
            'economic_assistance',
            'others',
        ];

        $amount = $this->faker->randomFloat(2, 100, 50000);

        return [
            'name' => $this->faker->sentence(4),
            'type' => $this->faker->randomElement($types),
            'type_specification' => $this->faker->optional(0.3)->word(),
            'description' => $this->faker->paragraphs(3, true),
            'amount' => $amount,
            'stipend_amount' => $this->faker->optional(0.8)->randomFloat(2, 100, 1000),
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+3 months'),
            'slots' => $this->faker->numberBetween(5, 50),
            'beneficiaries' => $this->faker->numberBetween(0, 10),
            'slots_available' => function (array $attributes) {
                return $attributes['slots'] - $attributes['beneficiaries'];
            },
            'funding_source' => $this->faker->randomElement([
                'MinSU Institutional Fund',
                'Special Trust Fund',
                'Student Development Fund',
                'External Donor Fund'
            ]),
            'eligibility_criteria' => json_encode([
                'minimum_gwa' => $this->faker->randomFloat(2, 1.0, 3.0),
                'enrollment_status' => 'enrolled',
                'academic_standing' => 'good_standing',
            ]),
            'required_documents' => json_encode([
                'application_form', 
                'academic_records', 
                'enrollment_certificate',
                'grade_report'
            ]),
            'criteria' => json_encode([
                'gwa_requirement' => $this->faker->randomFloat(2, 1.0, 2.5),
                'enrollment_units' => $this->faker->randomElement(['full_load', 'partial_load']),
            ]),
            'stipend_schedule' => $this->faker->randomElement(['monthly', 'semestral']),
            'renewal_criteria' => json_encode([
                'maintain_gwa' => $this->faker->randomFloat(2, 1.0, 2.5),
                'continuous_enrollment' => true,
            ]),
            'status' => $this->faker->randomElement(['draft', 'active', 'inactive', 'upcoming']),
            'admin_remarks' => $this->faker->optional(0.4)->sentence(),
        ];
    }
}
