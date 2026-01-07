<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentProfile>
 */
class StudentProfileFactory extends Factory
{
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
            'Bachelor of Science in Fisheries',
        ];

        $course = fake()->randomElement($courses);
        $major = 'None';

        // Assign majors based on education courses
        if ($course === 'Bachelor of Secondary Education') {
            $major = fake()->randomElement(['English', 'Mathematics', 'Science', 'Filipino', 'Social Studies']);
        } elseif ($course === 'Bachelor of Elementary Education') {
            $major = fake()->randomElement(['General Education', 'Special Education', 'Pre-School Education']);
        }

        $isPwd = fake()->boolean();
        $residenceType = fake()->randomElement(["Parent's House", 'Boarding House', 'With Guardian']);

        return [
            // Basic Student Information
            'student_id' => 'MBC'.fake()->numberBetween(2020, 2025).'-'.fake()->unique()->randomNumber(4, true),
            'course' => $course,
            'major' => $major,
            'year_level' => fake()->randomElement(['1st Year', '2nd Year', '3rd Year', '4th Year']),
            'current_gwa' => fake()->randomFloat(3, 1.0, 3.0), // Philippine GWA scale (1.0 is best)
            'enrollment_status' => fake()->randomElement(['enrolled', 'not_enrolled', 'graduated', 'dropped_out']),
            'has_disciplinary_action' => fake()->boolean(10), // 10% chance of having disciplinary action
            'units' => fake()->numberBetween(15, 24),
            'existing_scholarships' => fake()
                ->optional(0.4)
                ->randomElement(['TES', 'ESGP-PA', 'Tulong Dunong', 'Municipal Scholarship', 'Provincial Scholarship', 'DOST Scholarship']),

            // Personal Information
            'civil_status' => fake()->randomElement(['Single', 'Married', 'Widowed', 'Separated', 'Annulled']),
            'sex' => fake()->randomElement(['Male', 'Female']),
            'date_of_birth' => fake()->dateTimeBetween('-25 years', '-17 years'),
            'place_of_birth' => fake()->city().', '.fake()->state(),
            'religion' => fake()->randomElement([
                'Roman Catholic',
                'Islam',
                'Iglesia ni Cristo',
                'Methodist',
                'Seventh Day Adventist',
                'Baptist',
                'Prefer not to say',
            ]),

            // Contact & Address Information
            'street' => fake()->streetAddress(),
            'barangay' => fake()->word(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'mobile_number' => '+63'.fake()->numerify('9#########'),
            'telephone_number' => fake()->optional(0.3)->numerify('###-####'),

            // PWD Information
            'is_pwd' => $isPwd,
            'disability_type' => $isPwd
                ? fake()->randomElement(['Visual Impairment', 'Hearing Impairment', 'Physical Disability', 'Learning Disability'])
                : null,

            // Residence Information
            'residence_type' => $residenceType,
            'guardian_name' => $residenceType === 'With Guardian' ? fake()->name() : 'Not Applicable',

            // Family Background - Parents
            'status_of_parents' => fake()->randomElement(['Living Together', 'Separated', 'Single Parent', 'Mother Deceased', 'Father Deceased']),

            // Father's Information
            'father_name' => fake()->name('male'),
            'father_age' => fake()->numberBetween(35, 70),
            'father_address' => fake()->address(),
            'father_telephone' => fake()->optional(0.3)->phoneNumber(),
            'father_mobile' => '+63'.fake()->numerify('9#########'),
            'father_email' => fake()->optional(0.5)->safeEmail(),
            'father_occupation' => fake()->jobTitle(),
            'father_company' => fake()->optional(0.8)->company(),
            'father_monthly_income' => fake()->randomFloat(2, 10000, 100000),
            'father_years_service' => fake()->numberBetween(1, 30),
            'father_education' => fake()->randomElement(['High School', 'College', 'Vocational', 'Post Graduate']),
            'father_school' => fake()->company(),
            'father_unemployment_reason' => fake()->optional(0.2)->sentence(),

            // Mother's Information
            'mother_name' => fake()->name('female'),
            'mother_age' => fake()->numberBetween(35, 70),
            'mother_address' => fake()->address(),
            'mother_telephone' => fake()->optional(0.3)->phoneNumber(),
            'mother_mobile' => '+63'.fake()->numerify('9#########'),
            'mother_email' => fake()->optional(0.5)->safeEmail(),
            'mother_occupation' => fake()->jobTitle(),
            'mother_company' => fake()->optional(0.8)->company(),
            'mother_monthly_income' => fake()->randomFloat(2, 10000, 100000),
            'mother_years_service' => fake()->numberBetween(1, 30),
            'mother_education' => fake()->randomElement(['High School', 'College', 'Vocational', 'Post Graduate']),
            'mother_school' => fake()->company(),
            'mother_unemployment_reason' => fake()->optional(0.2)->sentence(),

            // Siblings Information
            'total_siblings' => fake()->numberBetween(0, 5),
            'siblings' => fake()
                ->optional(0.8)
                ->randomElements(
                    array_map(function () {
                        return [
                            'name' => fake()->name(),
                            'age_civil_status' => fake()->numberBetween(1, 40).' / '.fake()->randomElement(['Single', 'Married']),
                            'permanent_home_address' => fake()->address(),
                            'occupation' => fake()->jobTitle(),
                            'average_monthly_income' => fake()->randomFloat(2, 0, 50000),
                            'educational_attainment' => fake()->randomElement(['Elementary', 'High School', 'College', 'Post Graduate']),
                            'school_or_college' => fake()->company(),
                            'still_with_you' => fake()->boolean(),
                            'school_fees_per_year' => fake()->optional(0.6)->randomFloat(2, 10000, 100000),
                        ];
                    }, range(1, fake()->numberBetween(1, 5))),
                ),

            // Income Information
            'combined_annual_pay_parents' => fake()->randomFloat(2, 120000, 1200000),
            'combined_annual_pay_siblings' => fake()->randomFloat(2, 0, 600000),
            'income_from_business' => fake()->randomFloat(2, 0, 500000),
            'income_from_land_rentals' => fake()->randomFloat(2, 0, 240000),
            'income_from_building_rentals' => fake()->randomFloat(2, 0, 600000),
            'retirement_benefits_pension' => fake()->randomFloat(2, 0, 300000),
            'commissions' => fake()->randomFloat(2, 0, 120000),
            'support_from_relatives' => fake()->randomFloat(2, 0, 120000),
            'bank_deposits' => fake()->randomFloat(2, 0, 100000),
            'other_income_description' => fake()->optional(0.2)->sentence(),
            'other_income_amount' => fake()->randomFloat(2, 0, 120000),
            'total_annual_income' => fake()->randomFloat(2, 120000, 2400000),

            // Appliances
            'has_tv' => fake()->boolean(80),
            'has_radio_speakers_karaoke' => fake()->boolean(70),
            'has_musical_instruments' => fake()->boolean(30),
            'has_computer' => fake()->boolean(60),
            'has_stove' => fake()->boolean(90),
            'has_laptop' => fake()->boolean(50),
            'has_refrigerator' => fake()->boolean(70),
            'has_microwave' => fake()->boolean(40),
            'has_air_conditioner' => fake()->boolean(30),
            'has_electric_fan' => fake()->boolean(95),
            'has_washing_machine' => fake()->boolean(60),
            'has_cellphone' => fake()->boolean(98),
            'has_gaming_box' => fake()->boolean(20),
            'has_dslr_camera' => fake()->boolean(15),

            // Monthly Expenses
            'house_rental' => fake()->randomFloat(2, 0, 15000),
            'food_grocery' => fake()->randomFloat(2, 5000, 20000),
            'car_loan_details' => fake()->optional(0.2)->sentence(),
            'other_loan_details' => fake()->optional(0.3)->sentence(),
            'school_bus_payment' => fake()->randomFloat(2, 0, 5000),
            'transportation_expense' => fake()->randomFloat(2, 1000, 8000),
            'education_plan_premiums' => fake()->randomFloat(2, 0, 10000),
            'insurance_policy_premiums' => fake()->randomFloat(2, 0, 8000),
            'health_insurance_premium' => fake()->randomFloat(2, 0, 8000),
            'sss_gsis_pagibig_loans' => fake()->randomFloat(2, 0, 5000),
            'clothing_expense' => fake()->randomFloat(2, 1000, 5000),
            'utilities_expense' => fake()->randomFloat(2, 2000, 8000),
            'communication_expense' => fake()->randomFloat(2, 1000, 4000),
            'helper_details' => fake()->optional(0.1)->sentence(),
            'driver_details' => fake()->optional(0.1)->sentence(),
            'medicine_expense' => fake()->randomFloat(2, 0, 5000),
            'doctor_expense' => fake()->randomFloat(2, 0, 5000),
            'hospital_expense' => fake()->randomFloat(2, 0, 10000),
            'recreation_expense' => fake()->randomFloat(2, 1000, 5000),
            'other_monthly_expense_details' => fake()->optional(0.3)->sentence(),
            'total_monthly_expenses' => fake()->randomFloat(2, 20000, 100000),
            'annualized_monthly_expenses' => fake()->randomFloat(2, 240000, 1200000),

            // Annual Expenses
            'school_tuition_fee' => fake()->randomFloat(2, 20000, 100000),
            'withholding_tax' => fake()->randomFloat(2, 0, 120000),
            'sss_gsis_pagibig_contribution' => fake()->randomFloat(2, 12000, 36000),
            'other_annual_expense_details' => fake()->optional(0.3)->sentence(),
            'subtotal_annual_expenses' => fake()->randomFloat(2, 44000, 256000),
            'total_annual_expenses' => fake()->randomFloat(2, 284000, 1456000),
        ];
    }
}
