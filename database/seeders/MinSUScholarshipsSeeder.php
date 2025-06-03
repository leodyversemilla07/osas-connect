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
                'amount' => 500.00,
                'stipend_amount' => 500.00,
                'deadline' => '2025-08-31',
                'slots' => 50,
                'beneficiaries' => 0,
                'slots_available' => 50,
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
                'status' => 'active',
                'admin_remarks' => 'For students maintaining President\'s List status',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 1.450,
                    'enrollment_units' => 'full_load',
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.450,
                    'continuous_enrollment' => true,
                ]),
            ],
            [
                'name' => 'MinSU Academic Scholarship (Partial) - Dean\'s Lister',
                'type' => 'academic_partial',
                'type_specification' => null,
                'description' => 'Partial scholarship for students with high academic performance (GWA 1.460-1.750)',
                'amount' => 300.00,
                'stipend_amount' => 300.00,
                'deadline' => '2025-08-31',
                'slots' => 100,
                'beneficiaries' => 0,
                'slots_available' => 100,
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
                'status' => 'active',
                'admin_remarks' => 'For students maintaining Dean\'s List status',
                'created_at' => now(),
                'updated_at' => now(),
                'criteria' => json_encode([
                    'gwa_requirement' => 1.750,
                    'enrollment_units' => 'full_load',
                ]),
                'renewal_criteria' => json_encode([
                    'maintain_gwa' => 1.750,
                    'continuous_enrollment' => true,
                ]),
            ],
            [
                'name' => 'MinSU Student Assistantship Program',
                'type' => 'student_assistantship',
                'type_specification' => null,
                'description' => 'Work-study program providing financial assistance through campus employment',
                'amount' => 0.00,
                'stipend_amount' => null,
                'deadline' => '2025-08-31',
                'slots' => 200,
                'beneficiaries' => 0,
                'slots_available' => 200,
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
        ];

        // Insert or update scholarships without criteria/renewal fields
        DB::table('scholarships')->upsert(
            $scholarships,
            ['name'],    // unique key
            [
                'type',
                'type_specification',
                'description',
                'amount',
                'stipend_amount',
                'deadline',
                'slots',
                'beneficiaries',
                'slots_available',
                'funding_source',
                'eligibility_criteria',
                'required_documents',
                'stipend_schedule',
                'criteria',
                'renewal_criteria',
                'status',
                'admin_remarks',
                'updated_at'
            ]
        );
    }
}
