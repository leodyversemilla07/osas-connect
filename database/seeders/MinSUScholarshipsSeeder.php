<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MinSUScholarshipsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert MinSU scholarship types
        $this->insertMinSUScholarships();
    }

    /**
     * Insert MinSU institutional scholarships
     */
    private function insertMinSUScholarships(): void
    {
        $scholarships = [
            [
                'name' => 'MinSU Academic Scholarship (Full) - President\'s Lister',
                'description' => 'Full scholarship for students with exceptional academic performance (GWA 1.000-1.450)',
                'type' => 'academic_full',
                'amount' => 500.00,
                'stipend_amount' => 500.00,
                'deadline' => '2025-08-31',
                'slots' => 50,
                'beneficiaries' => 0,
                'funding_source' => 'MinSU Institutional Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 1.000,
                    'maximum_gwa' => 1.450,
                    'enrollment_status' => 'enrolled',
                    'academic_standing' => 'good_standing',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'grade_report',
                ]),
                'stipend_schedule' => 'monthly',
                'slots_available' => 50,
                'criteria' => json_encode([
                    'gwa_requirement' => 1.450,
                    'enrollment_units' => 'full_load',
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.450,
                    'continuous_enrollment' => true,
                ]),
                'status' => 'active',
                'admin_remarks' => 'For students maintaining President\'s List status',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MinSU Academic Scholarship (Partial) - Dean\'s Lister',
                'description' => 'Partial scholarship for students with high academic performance (GWA 1.460-1.750)',
                'type' => 'academic_partial',
                'amount' => 300.00,
                'stipend_amount' => 300.00,
                'deadline' => '2025-08-31',
                'slots' => 100,
                'beneficiaries' => 0,
                'funding_source' => 'MinSU Institutional Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 1.460,
                    'maximum_gwa' => 1.750,
                    'enrollment_status' => 'enrolled',
                    'academic_standing' => 'good_standing',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'grade_report',
                ]),
                'stipend_schedule' => 'monthly',
                'slots_available' => 100,
                'criteria' => json_encode([
                    'gwa_requirement' => 1.750,
                    'enrollment_units' => 'full_load',
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.750,
                    'continuous_enrollment' => true,
                ]),
                'status' => 'active',
                'admin_remarks' => 'For students maintaining Dean\'s List status',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MinSU Student Assistantship Program',
                'description' => 'Work-study program providing financial assistance through campus employment',
                'type' => 'student_assistantship',
                'amount' => 0.00,
                'stipend_amount' => null,
                'deadline' => '2025-08-31',
                'slots' => 200,
                'beneficiaries' => 0,
                'funding_source' => 'MinSU Work-Study Program',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 0.000,
                    'enrollment_status' => 'enrolled',
                    'work_capacity' => 'available',
                    'pre_hiring_completion' => 'required',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'pre_hiring_certificate',
                    'health_certificate',
                ]),
                'stipend_schedule' => 'monthly',
                'slots_available' => 200,
                'criteria' => json_encode([
                    'work_hours' => 20,
                    'department_assignment' => true,
                ]),
                'renewal_criteria' => json_encode([
                    'satisfactory_performance' => true,
                    'continuous_enrollment' => true,
                ]),
                'status' => 'active',
                'admin_remarks' => 'Compensation based on work hours and assignment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MinSU Accredited Performing Arts Group (Full Scholar)',
                'description' => 'Full scholarship for active members of accredited performing arts groups (1+ year membership)',
                'type' => 'performing_arts_full',
                'amount' => 500.00,
                'stipend_amount' => 500.00,
                'deadline' => '2025-08-31',
                'slots' => 30,
                'beneficiaries' => 0,
                'funding_source' => 'MinSU Cultural Development Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 0.000,
                    'membership_duration' => 'one_year_plus',
                    'enrollment_status' => 'enrolled',
                    'group_status' => 'accredited',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'group_membership_certificate',
                    'coach_recommendation',
                    'performance_portfolio',
                ]),
                'stipend_schedule' => 'monthly',
                'slots_available' => 30,
                'criteria' => json_encode([
                    'group_membership' => 'one_year',
                    'performance_participation' => 5,
                ]),
                'renewal_criteria' => json_encode([
                    'continue_membership' => true,
                    'performance_requirements' => 5,
                ]),
                'status' => 'active',
                'admin_remarks' => 'For long-term performing arts group members',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MinSU Accredited Performing Arts Group (Partial Scholar)',
                'description' => 'Partial scholarship for members of accredited performing arts groups (1+ semester membership)',
                'type' => 'performing_arts_partial',
                'amount' => 300.00,
                'stipend_amount' => 300.00,
                'deadline' => '2025-08-31',
                'slots' => 50,
                'beneficiaries' => 0,
                'funding_source' => 'MinSU Cultural Development Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 0.000,
                    'membership_duration' => 'one_semester_plus',
                    'enrollment_status' => 'enrolled',
                    'group_status' => 'accredited',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'group_membership_certificate',
                    'coach_recommendation',
                ]),
                'stipend_schedule' => 'monthly',
                'slots_available' => 50,
                'criteria' => json_encode([
                    'group_membership' => 'one_semester',
                    'performance_participation' => 3,
                ]),
                'renewal_criteria' => json_encode([
                    'continue_membership' => true,
                    'performance_requirements' => 3,
                ]),
                'status' => 'active',
                'admin_remarks' => 'For new performing arts group members',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MinSU Economically Deprived/Marginalized Student Assistance',
                'description' => 'Financial assistance for students from economically disadvantaged backgrounds',
                'type' => 'economic_assistance',
                'amount' => 300.00,
                'stipend_amount' => 300.00,
                'deadline' => '2025-08-31',
                'slots' => 100,
                'beneficiaries' => 0,
                'funding_source' => 'MinSU Student Assistance Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 0.000,
                    'maximum_gwa' => 2.25,
                    'family_income' => 'below_poverty_threshold',
                    'enrollment_status' => 'enrolled',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'indigency_certificate',
                    'family_income_statement',
                    'barangay_certificate',
                ]),
                'stipend_schedule' => 'monthly',
                'slots_available' => 100,
                'criteria' => json_encode([
                    'gwa_requirement' => 2.25,
                    'family_income_threshold' => 25000,
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 2.25,
                    'maintain_income_status' => true,
                ]),
                'status' => 'active',
                'admin_remarks' => 'For economically disadvantaged students',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($scholarships as $scholarship) {
            // Check if scholarship already exists to avoid duplicates
            $exists = DB::table('scholarships')
                ->where('name', $scholarship['name'])
                ->exists();

            if (! $exists) {
                DB::table('scholarships')->insert($scholarship);
            }
        }
    }
}
