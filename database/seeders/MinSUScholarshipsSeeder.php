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
                'type' => 'academic_full',
                'type_specification' => null,
                'description' => 'Full scholarship for students with exceptional academic performance (GWA 1.000-1.450)',
                'amount' => 500.0,
                'stipend_amount' => 500.0,
                'deadline' => '2025-08-31',
                'slots' => 50,
                'beneficiaries' => 0,
                'slots_available' => 50,
                'funding_source' => 'MinSU Institutional Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 1.0,
                    'maximum_gwa' => 1.45,
                    'enrollment_status' => 'enrolled',
                    'academic_standing' => 'good_standing',
                ]),
                'required_documents' => json_encode(['application_form', 'academic_records', 'enrollment_certificate', 'grade_report']),
                'stipend_schedule' => 'monthly',
                'status' => 'active',
                'admin_remarks' => 'For students maintaining President\'s List status',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 1.45,
                    'enrollment_units' => 'full_load',
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.45,
                    'continuous_enrollment' => true,
                ]),
            ],
            [
                'name' => 'MinSU Academic Scholarship (Partial) - Dean\'s Lister',
                'type' => 'academic_partial',
                'type_specification' => null,
                'description' => 'Partial scholarship for students with high academic performance (GWA 1.460-1.750)',
                'amount' => 300.0,
                'stipend_amount' => 300.0,
                'deadline' => '2025-08-31',
                'slots' => 100,
                'beneficiaries' => 0,
                'slots_available' => 100,
                'funding_source' => 'MinSU Institutional Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 1.46,
                    'maximum_gwa' => 1.75,
                    'enrollment_status' => 'enrolled',
                    'academic_standing' => 'good_standing',
                ]),
                'required_documents' => json_encode(['application_form', 'academic_records', 'enrollment_certificate', 'grade_report']),
                'stipend_schedule' => 'monthly',
                'status' => 'active',
                'admin_remarks' => 'For students maintaining Dean\'s List status',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 1.75,
                    'enrollment_units' => 'full_load',
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.75,
                    'continuous_enrollment' => true,
                ]),
            ],
            [
                'name' => 'MinSU Student Assistantship Program',
                'type' => 'student_assistantship',
                'type_specification' => null,
                'description' => 'Work-study program providing financial assistance through campus employment',
                'amount' => 0.0,
                'stipend_amount' => null,
                'deadline' => '2025-08-31',
                'slots' => 200,
                'beneficiaries' => 0,
                'slots_available' => 200,
                'funding_source' => 'MinSU Work-Study Program',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 0.0,
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
                'status' => 'active',
                'admin_remarks' => 'Compensation based on work hours and assignment',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'work_hours' => 20,
                    'department_assignment' => true,
                ]),
                'renewal_criteria' => json_encode([
                    'satisfactory_performance' => true,
                    'continuous_enrollment' => true,
                ]),
            ],
            [
                'name' => 'MinSU Performing Arts Full Scholarship',
                'type' => 'performing_arts_full',
                'type_specification' => null,
                'description' => 'Full scholarship for students excelling in performing arts with cultural contributions',
                'amount' => 50000.0,
                'stipend_amount' => 500.0,
                'deadline' => '2025-08-31',
                'slots' => 15,
                'beneficiaries' => 0,
                'slots_available' => 15,
                'funding_source' => 'MinSU Cultural Development Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 1.75,
                    'enrollment_status' => 'enrolled',
                    'performing_arts_skills' => 'exceptional',
                    'cultural_participation' => 'required',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'performing_arts_portfolio',
                    'cultural_activity_certificate',
                ]),
                'stipend_schedule' => 'monthly',
                'status' => 'active',
                'admin_remarks' => 'For students with exceptional performing arts talents',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 1.75,
                    'arts_performance' => 'exceptional',
                    'cultural_contribution' => true,
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.75,
                    'continued_arts_participation' => true,
                    'cultural_activities' => 'regular',
                ]),
            ],
            [
                'name' => 'MinSU Performing Arts Partial Scholarship',
                'type' => 'performing_arts_partial',
                'type_specification' => null,
                'description' => 'Partial scholarship for students showing talent in performing arts',
                'amount' => 25000.0,
                'stipend_amount' => 300.0,
                'deadline' => '2025-08-31',
                'slots' => 25,
                'beneficiaries' => 0,
                'slots_available' => 25,
                'funding_source' => 'MinSU Cultural Development Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 2.0,
                    'enrollment_status' => 'enrolled',
                    'performing_arts_skills' => 'proficient',
                    'cultural_participation' => 'active',
                ]),
                'required_documents' => json_encode(['application_form', 'academic_records', 'enrollment_certificate', 'performing_arts_portfolio']),
                'stipend_schedule' => 'monthly',
                'status' => 'active',
                'admin_remarks' => 'For students with developing performing arts talents',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 2.0,
                    'arts_performance' => 'proficient',
                    'cultural_contribution' => true,
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 2.0,
                    'continued_arts_participation' => true,
                ]),
            ],
            [
                'name' => 'MinSU Economic Assistance Program',
                'type' => 'economic_assistance',
                'type_specification' => null,
                'description' => 'Financial assistance for students from economically disadvantaged families',
                'amount' => 20000.0,
                'stipend_amount' => 400.0,
                'deadline' => '2025-08-31',
                'slots' => 100,
                'beneficiaries' => 0,
                'slots_available' => 100,
                'funding_source' => 'MinSU Economic Assistance Fund',
                'eligibility_criteria' => json_encode([
                    'minimum_gwa' => 2.25,
                    'enrollment_status' => 'enrolled',
                    'family_income' => 'below_poverty_threshold',
                    'financial_need' => 'documented',
                ]),
                'required_documents' => json_encode([
                    'application_form',
                    'academic_records',
                    'enrollment_certificate',
                    'family_income_certificate',
                    'barangay_indigency_certificate',
                ]),
                'stipend_schedule' => 'monthly',
                'status' => 'active',
                'admin_remarks' => 'For students with documented financial need',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 2.25,
                    'family_income_threshold' => 200000,
                    'financial_need_assessment' => true,
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 2.25,
                    'continued_financial_need' => true,
                    'family_income_verification' => 'annual',
                ]),
            ],
        ];

        // Use individual insert/update for SQLite compatibility
        foreach ($scholarships as $scholarship) {
            DB::table('scholarships')->updateOrInsert(
                ['name' => $scholarship['name']], // where condition
                $scholarship // data to insert/update
            );
        }
    }
}
