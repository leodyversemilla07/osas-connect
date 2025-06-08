<?php

namespace Database\Seeders;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */    
    public function run(): void
    {
        // Create specific student user first
        $this->createSpecificStudent();
        $this->createAdditionalTestStudents();
        
        // Create 55 additional student users with comprehensive profiles
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

        $yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        $civilStatuses = ['Single', 'Married', 'Widowed', 'Separated'];
        $sexes = ['Male', 'Female'];
        $residenceTypes = ["Parent's House", "Boarding House", "With Guardian"];
        $statusOfParents = ['Living Together', 'Separated', 'Single Parent', 'Mother Deceased', 'Father Deceased'];

        // Filipino names arrays
        $firstNames = [
            'Juan', 'Maria', 'Jose', 'Ana', 'Antonio', 'Carmen', 'Francisco', 'Luz', 'Manuel', 'Esperanza',
            'Pedro', 'Rosario', 'Jesus', 'Teresa', 'Ramon', 'Remedios', 'Miguel', 'Elena', 'Ricardo', 'Rosa',
            'Carlos', 'Milagros', 'Fernando', 'Concepcion', 'Roberto', 'Soledad', 'Eduardo', 'Gloria', 'Rafael', 'Josefa',
            'Daniel', 'Angela', 'Gabriel', 'Cristina', 'Alejandro', 'Patricia', 'Pablo', 'Isabel', 'Martin', 'Dolores',
            'Diego', 'Sofia', 'Adrian', 'Monica', 'Sergio', 'Beatriz', 'Jorge', 'Victoria', 'Raul', 'Lucia',
            'Omar', 'Fatima', 'Hassan', 'Khadija', 'Ali', 'Aisha', 'Ahmed', 'Zeinab', 'Ibrahim', 'Maryam'
        ];

        $middleNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Tomas', 'Andres',
            'Marquez', 'Castillo', 'Iglesias', 'Moreno', 'Aquino', 'Ramos', 'Fidel', 'Valdez', 'Jimenez', 'Herrera'
        ];

        $lastNames = [
            'Dela Cruz', 'Garcia', 'Reyes', 'Ramos', 'Mendoza', 'Santos', 'Flores', 'Gonzales', 'Bautista', 'Manalo',
            'Ocampo', 'Torres', 'Castillo', 'Morales', 'Aquino', 'Valdez', 'Villanueva', 'Francisco', 'Soriano', 'Ignacio',
            'Fernandez', 'Vargas', 'Gutierrez', 'Romero', 'Herrera', 'Medina', 'Aguilar', 'Jimenez', 'Moreno', 'Muñoz',
            'Maranao', 'Dimaporo', 'Alonto', 'Disomangcop', 'Amilbangsa', 'Ampuan', 'Adiong', 'Lucman', 'Mama', 'Saber'
        ];

        for ($i = 1; $i <= 55; $i++) {
            $studentIdNumber = str_pad($i, 4, '0', STR_PAD_LEFT);
            $studentId = 'MBC2024-' . $studentIdNumber;

            // Generate realistic Filipino names
            $firstName = $firstNames[array_rand($firstNames)];
            $middleName = $middleNames[array_rand($middleNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $email = strtolower($firstName . '.' . $lastName . $studentIdNumber) . '@minsu.edu.ph';

            // Create user
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'last_name' => $lastName,
                    'first_name' => $firstName,
                    'middle_name' => $middleName,
                    'password' => Hash::make('Student@123'),
                    'role' => 'student',
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            // Generate random values for profile
            $course = $courses[array_rand($courses)];
            $yearLevel = $yearLevels[array_rand($yearLevels)];
            $civilStatus = $civilStatuses[array_rand($civilStatuses)];
            $sex = $sexes[array_rand($sexes)];
            $residenceType = $residenceTypes[array_rand($residenceTypes)];
            $statusOfParentsValue = $statusOfParents[array_rand($statusOfParents)];

            // Create comprehensive student profile
            StudentProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'student_id' => $studentId,
                    'course' => $course,
                    'major' => rand(1, 10) <= 6 ? ['Web Development', 'Network Administration', 'Database Management', 'Software Engineering', 'Data Science'][array_rand(['Web Development', 'Network Administration', 'Database Management', 'Software Engineering', 'Data Science'])] : 'None',
                    'year_level' => $yearLevel,
                    'current_gwa' => round(mt_rand(1000, 3000) / 1000, 3),
                    'enrollment_status' => 'enrolled',
                    'units' => rand(15, 21),
                    'guardian_name' => rand(1, 10) <= 3 ? $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)] : 'Not Applicable',
                    'existing_scholarships' => rand(1, 10) <= 2 ? 'Previous scholarship recipient' : null,

                    // Personal Information
                    'civil_status' => $civilStatus,
                    'sex' => $sex,
                    'date_of_birth' => date('Y-m-d', strtotime('-' . rand(17, 25) . ' years')),
                    'place_of_birth' => 'Butig, Lanao del Sur',
                    'street' => 'Street ' . rand(1, 100),
                    'barangay' => 'Barangay ' . $lastNames[array_rand($lastNames)],
                    'city' => 'Butig',
                    'province' => 'Lanao del Sur',
                    'zip_code' => '9307',
                    'mobile_number' => '09' . rand(100000000, 999999999),
                    'telephone_number' => rand(1, 10) <= 4 ? '063-' . rand(1000, 9999) : null,
                    'is_pwd' => rand(1, 100) <= 10,
                    'disability_type' => rand(1, 100) <= 10 ? ['Visual Impairment', 'Hearing Impairment', 'Physical Disability', 'Learning Disability'][array_rand(['Visual Impairment', 'Hearing Impairment', 'Physical Disability', 'Learning Disability'])] : null,
                    'religion' => ['Catholic', 'Protestant', 'Islam', 'Buddhism', 'Other'][array_rand(['Catholic', 'Protestant', 'Islam', 'Buddhism', 'Other'])],
                    'residence_type' => $residenceType,

                    // Family Background
                    'status_of_parents' => $statusOfParentsValue,

                    // Father's Information
                    'father_name' => $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)],
                    'father_age' => rand(40, 70),
                    'father_address' => 'Butig, Lanao del Sur',
                    'father_telephone' => rand(1, 10) <= 5 ? '063-' . rand(1000, 9999) : null,
                    'father_mobile' => rand(1, 10) <= 7 ? '09' . rand(100000000, 999999999) : null,
                    'father_email' => rand(1, 10) <= 3 ? strtolower($firstNames[array_rand($firstNames)]) . '@email.com' : null,
                    'father_occupation' => ['Farmer', 'Driver', 'Carpenter', 'Teacher', 'Engineer', 'Businessman'][array_rand(['Farmer', 'Driver', 'Carpenter', 'Teacher', 'Engineer', 'Businessman'])],
                    'father_company' => rand(1, 10) <= 6 ? 'Company Name Inc.' : null,
                    'father_monthly_income' => rand(15000, 80000),
                    'father_years_service' => rand(5, 30),                    'father_education' => ['Elementary', 'High School', 'Vocational', 'College Graduate', 'Masters'][array_rand(['Elementary', 'High School', 'Vocational', 'College Graduate', 'Masters'])],
                    'father_school' => rand(1, 10) <= 7 ? 'MinSU' : 'Other School',
                    'father_unemployment_reason' => rand(1, 10) <= 2 ? ['Retirement', 'Health Issues', 'Economic Downturn', 'Company Closure'][array_rand(['Retirement', 'Health Issues', 'Economic Downturn', 'Company Closure'])] : null,

                    // Mother's Information
                    'mother_name' => $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)],
                    'mother_age' => rand(35, 65),
                    'mother_address' => 'Butig, Lanao del Sur',
                    'mother_telephone' => rand(1, 10) <= 5 ? '063-' . rand(1000, 9999) : null,
                    'mother_mobile' => rand(1, 10) <= 8 ? '09' . rand(100000000, 999999999) : null,
                    'mother_email' => rand(1, 10) <= 4 ? strtolower($firstNames[array_rand($firstNames)]) . '@email.com' : null,
                    'mother_occupation' => ['Housewife', 'Teacher', 'Nurse', 'Seamstress', 'Vendor', 'Government Employee'][array_rand(['Housewife', 'Teacher', 'Nurse', 'Seamstress', 'Vendor', 'Government Employee'])],
                    'mother_company' => rand(1, 10) <= 5 ? 'Company Name Corp.' : null,
                    'mother_monthly_income' => rand(12000, 60000),
                    'mother_years_service' => rand(3, 25),                    'mother_education' => ['Elementary', 'High School', 'Vocational', 'College Graduate', 'Masters'][array_rand(['Elementary', 'High School', 'Vocational', 'College Graduate', 'Masters'])],
                    'mother_school' => rand(1, 10) <= 7 ? 'MinSU' : 'Other College',
                    'mother_unemployment_reason' => rand(1, 10) <= 2 ? ['Health Issues', 'Childcare Responsibilities', 'Economic Downturn', 'Career Change'][array_rand(['Health Issues', 'Childcare Responsibilities', 'Economic Downturn', 'Career Change'])] : null,

                    // Siblings Information
                    'total_siblings' => $siblingCount = rand(0, 5),
                    'siblings' => $this->generateSiblingsData($siblingCount),

                    // Income Information
                    'combined_annual_pay_parents' => rand(200000, 800000),
                    'combined_annual_pay_siblings' => rand(0, 300000),
                    'income_from_business' => rand(0, 150000),
                    'income_from_land_rentals' => rand(0, 100000),
                    'income_from_building_rentals' => rand(0, 120000),
                    'retirement_benefits_pension' => rand(0, 50000),
                    'commissions' => rand(0, 30000),
                    'support_from_relatives' => rand(0, 80000),
                    'bank_deposits' => rand(1000, 50000),
                    'other_income_description' => rand(1, 10) <= 3 ? 'Side business income' : null,
                    'other_income_amount' => rand(0, 25000),
                    'total_annual_income' => rand(250000, 1200000),

                    // Appliances (random selection)
                    'has_tv' => rand(1, 100) <= 85,
                    'has_radio_speakers_karaoke' => rand(1, 100) <= 70,
                    'has_musical_instruments' => rand(1, 100) <= 30,
                    'has_computer' => rand(1, 100) <= 60,
                    'has_stove' => rand(1, 100) <= 90,
                    'has_laptop' => rand(1, 100) <= 75,
                    'has_refrigerator' => rand(1, 100) <= 80,
                    'has_microwave' => rand(1, 100) <= 45,
                    'has_air_conditioner' => rand(1, 100) <= 40,
                    'has_electric_fan' => rand(1, 100) <= 95,
                    'has_washing_machine' => rand(1, 100) <= 65,
                    'has_cellphone' => rand(1, 100) <= 98,
                    'has_gaming_box' => rand(1, 100) <= 25,
                    'has_dslr_camera' => rand(1, 100) <= 15,

                    // Monthly Expenses
                    'house_rental' => rand(0, 15000),
                    'food_grocery' => rand(5000, 20000),
                    'car_loan_details' => rand(1, 10) <= 2 ? 'Monthly car payment' : null,
                    'other_loan_details' => rand(1, 10) <= 3 ? 'Personal loan payment' : null,
                    'school_bus_payment' => rand(0, 5000),
                    'transportation_expense' => rand(1000, 8000),
                    'education_plan_premiums' => rand(0, 3000),
                    'insurance_policy_premiums' => rand(500, 5000),
                    'health_insurance_premium' => rand(1000, 4000),
                    'sss_gsis_pagibig_loans' => rand(500, 3000),
                    'clothing_expense' => rand(1000, 5000),
                    'utilities_expense' => rand(2000, 8000),
                    'communication_expense' => rand(800, 3000),
                    'helper_details' => rand(1, 10) <= 2 ? 'House helper' : null,
                    'driver_details' => rand(1, 10) <= 1 ? 'Family driver' : null,
                    'medicine_expense' => rand(500, 3000),
                    'doctor_expense' => rand(1000, 5000),
                    'hospital_expense' => rand(2000, 10000),
                    'recreation_expense' => rand(1000, 8000),
                    'other_monthly_expense_details' => rand(1, 10) <= 4 ? 'Miscellaneous expenses' : null,
                    'total_monthly_expenses' => rand(20000, 60000),
                    'annualized_monthly_expenses' => rand(240000, 720000),

                    // Annual Expenses
                    'school_tuition_fee' => rand(30000, 120000),
                    'withholding_tax' => rand(0, 15000),
                    'sss_gsis_pagibig_contribution' => rand(2000, 8000),
                    'other_annual_expense_details' => rand(1, 10) <= 3 ? 'Other yearly expenses' : null,
                    'subtotal_annual_expenses' => rand(50000, 200000),
                    'total_annual_expenses' => rand(300000, 900000),
                ]
            );
        }

        $this->command->info('Created 61 total student users with comprehensive profiles (1 specific + 5 test scenarios + 55 random).');
    }

    /**
     * Generate siblings data array
     */
    private function generateSiblingsData(int $count): array
    {
        $occupations = ['Student', 'Teacher', 'Engineer', 'Driver', 'Nurse', 'Unemployed'];
        $names = ['Juan', 'Maria', 'Jose', 'Ana', 'Carlos', 'Sofia', 'Miguel', 'Elena'];
        
        $siblings = [];
        for ($i = 0; $i < $count; $i++) {
            $siblings[] = [
                'name' => $names[array_rand($names)] . ' Sibling',
                'age' => rand(5, 35),
                'occupation' => rand(1, 10) <= 7 ? $occupations[array_rand($occupations)] : 'Student',
                'monthly_income' => rand(0, 25000),
            ];
        }        return $siblings;
    }

    /**
     * Create specific student user
     */
    private function createSpecificStudent(): void
    {
        // Create specific student: Leodyver Semilla
        $user = User::firstOrCreate(
            ['email' => 'semilla.leodyver@minsu.edu.ph'],
            [
                'last_name' => 'Semilla',
                'first_name' => 'Leodyver',
                'middle_name' => 'Garcia',
                'password' => Hash::make('Student@123'),
                'role' => 'student',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Create comprehensive student profile for Leodyver
        StudentProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'student_id' => 'MBC2024-SPEC001',
                'course' => 'Bachelor of Science in Information Technology',
                'major' => 'Web Development',
                'year_level' => '4th Year',
                'current_gwa' => 1.200,
                'enrollment_status' => 'enrolled',
                'units' => 21,
                'guardian_name' => 'Not Applicable',
                'existing_scholarships' => 'Academic Excellence Scholarship',

                // Personal Information
                'civil_status' => 'Single',
                'sex' => 'Male',
                'date_of_birth' => '2001-05-15',
                'place_of_birth' => 'Butig, Lanao del Sur',
                'street' => 'Purok 3',
                'barangay' => 'Poblacion',
                'city' => 'Butig',
                'province' => 'Lanao del Sur',
                'zip_code' => '9307',
                'mobile_number' => '09123456789',
                'telephone_number' => '063-1234',
                'is_pwd' => false,
                'disability_type' => null,
                'religion' => 'Islam',
                'residence_type' => "Parent's House",

                // Family Background
                'status_of_parents' => 'Living Together',

                // Father's Information
                'father_name' => 'Roberto Semilla',
                'father_age' => 52,
                'father_address' => 'Butig, Lanao del Sur',
                'father_telephone' => '063-1234',
                'father_mobile' => '09187654321',
                'father_email' => 'roberto.semilla@email.com',
                'father_occupation' => 'Teacher',
                'father_company' => 'MinSU',
                'father_monthly_income' => 45000,
                'father_years_service' => 20,
                'father_education' => 'College Graduate',
                'father_school' => 'MinSU',
                'father_unemployment_reason' => null,

                // Mother's Information
                'mother_name' => 'Carmen Garcia',
                'mother_age' => 48,
                'mother_address' => 'Butig, Lanao del Sur',
                'mother_telephone' => '063-1234',
                'mother_mobile' => '09123456780',
                'mother_email' => 'carmen.garcia@email.com',
                'mother_occupation' => 'Nurse',
                'mother_company' => 'Butig District Hospital',
                'mother_monthly_income' => 35000,
                'mother_years_service' => 15,
                'mother_education' => 'College Graduate',
                'mother_school' => 'MinSU',
                'mother_unemployment_reason' => null,

                // Siblings Information
                'total_siblings' => 2,
                'siblings' => [
                    [
                        'name' => 'Maria Semilla',
                        'age' => 20,
                        'occupation' => 'Student',
                        'monthly_income' => 0,
                    ],
                    [
                        'name' => 'Jose Semilla',
                        'age' => 16,
                        'occupation' => 'Student',
                        'monthly_income' => 0,
                    ]
                ],

                // Income Information
                'combined_annual_pay_parents' => 960000,
                'combined_annual_pay_siblings' => 0,
                'income_from_business' => 50000,
                'income_from_land_rentals' => 0,
                'income_from_building_rentals' => 0,
                'retirement_benefits_pension' => 0,
                'commissions' => 0,
                'support_from_relatives' => 20000,
                'bank_deposits' => 15000,
                'other_income_description' => 'Freelance IT projects',
                'other_income_amount' => 30000,
                'total_annual_income' => 1075000,

                // Appliances
                'has_tv' => true,
                'has_radio_speakers_karaoke' => true,
                'has_musical_instruments' => false,
                'has_computer' => true,
                'has_stove' => true,
                'has_laptop' => true,
                'has_refrigerator' => true,
                'has_microwave' => true,
                'has_air_conditioner' => false,
                'has_electric_fan' => true,
                'has_washing_machine' => true,
                'has_cellphone' => true,
                'has_gaming_box' => false,
                'has_dslr_camera' => false,

                // Monthly Expenses
                'house_rental' => 0,
                'food_grocery' => 15000,
                'car_loan_details' => null,
                'other_loan_details' => null,
                'school_bus_payment' => 0,
                'transportation_expense' => 3000,
                'education_plan_premiums' => 2000,
                'insurance_policy_premiums' => 3000,
                'health_insurance_premium' => 2500,
                'sss_gsis_pagibig_loans' => 1500,
                'clothing_expense' => 2000,
                'utilities_expense' => 4000,
                'communication_expense' => 1500,
                'helper_details' => null,
                'driver_details' => null,
                'medicine_expense' => 1000,
                'doctor_expense' => 2000,
                'hospital_expense' => 3000,
                'recreation_expense' => 3000,
                'other_monthly_expense_details' => 'School supplies',
                'total_monthly_expenses' => 44500,
                'annualized_monthly_expenses' => 534000,

                // Annual Expenses
                'school_tuition_fee' => 60000,
                'withholding_tax' => 8000,
                'sss_gsis_pagibig_contribution' => 5000,
                'other_annual_expense_details' => 'Computer equipment',
                'subtotal_annual_expenses' => 73000,
                'total_annual_expenses' => 607000,
            ]
        );        $this->command->info('Created specific student: Leodyver Semilla');
    }

    /**
     * Create additional test students with specific scenarios
     */
    private function createAdditionalTestStudents(): void
    {
        $testStudents = [
            [
                'email' => 'honor.student@minsu.edu.ph',
                'first_name' => 'Maria',
                'middle_name' => 'Santos',
                'last_name' => 'Dela Cruz',
                'student_id' => 'MBC2024-HONOR001',
                'course' => 'Bachelor of Science in Information Technology',
                'major' => 'Software Engineering',
                'year_level' => '3rd Year',
                'current_gwa' => 1.100, // President's Lister
                'scenario' => 'honor_student'
            ],
            [
                'email' => 'average.student@minsu.edu.ph', 
                'first_name' => 'Juan',
                'middle_name' => 'Carlos',
                'last_name' => 'Reyes',
                'student_id' => 'MBC2024-AVG001',
                'course' => 'Bachelor of Science in Tourism Management',
                'major' => 'None',
                'year_level' => '2nd Year',
                'current_gwa' => 1.650, // Dean's Lister
                'scenario' => 'dean_lister'
            ],
            [
                'email' => 'working.student@minsu.edu.ph',
                'first_name' => 'Ana',
                'middle_name' => 'Marie',
                'last_name' => 'Garcia',
                'student_id' => 'MBC2024-WORK001',
                'course' => 'Bachelor of Science in Criminology',
                'major' => 'None',
                'year_level' => '4th Year',
                'current_gwa' => 2.100,
                'scenario' => 'working_student'
            ],
            [
                'email' => 'arts.student@minsu.edu.ph',
                'first_name' => 'Hassan',
                'middle_name' => 'Omar',
                'last_name' => 'Maranao',
                'student_id' => 'MBC2024-ARTS001',
                'course' => 'Bachelor of Arts in Political Science',
                'major' => 'None',
                'year_level' => '3rd Year',
                'current_gwa' => 1.800,
                'scenario' => 'performing_arts'
            ],
            [
                'email' => 'indigent.student@minsu.edu.ph',
                'first_name' => 'Fatima',
                'middle_name' => 'Aisha',
                'last_name' => 'Dimaporo',
                'student_id' => 'MBC2024-INDI001',
                'course' => 'Bachelor of Elementary Education',
                'major' => 'None',
                'year_level' => '1st Year',
                'current_gwa' => 2.300,
                'scenario' => 'indigent_student'
            ],
        ];

        foreach ($testStudents as $studentData) {
            // Create user
            $user = User::firstOrCreate(
                ['email' => $studentData['email']],
                [
                    'last_name' => $studentData['last_name'],
                    'first_name' => $studentData['first_name'],
                    'middle_name' => $studentData['middle_name'],
                    'password' => Hash::make('Student@123'),
                    'role' => 'student',
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            // Create profile based on scenario
            $profileData = $this->getProfileDataForScenario($studentData);
            
            StudentProfile::firstOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        }

        $this->command->info('Created 5 additional test students with specific scenarios');
    }

    /**
     * Get profile data based on student scenario
     */
    private function getProfileDataForScenario(array $studentData): array
    {
        $baseProfile = [
            'student_id' => $studentData['student_id'],
            'course' => $studentData['course'],
            'major' => $studentData['major'],
            'year_level' => $studentData['year_level'],
            'current_gwa' => $studentData['current_gwa'],
            'enrollment_status' => 'enrolled',
            'units' => 21,
            'guardian_name' => 'Not Applicable',
            'civil_status' => 'Single',
            'sex' => 'Male',
            'date_of_birth' => '2002-01-15',
            'place_of_birth' => 'Butig, Lanao del Sur',
            'street' => 'Main Street',
            'barangay' => 'Poblacion',
            'city' => 'Butig',
            'province' => 'Lanao del Sur',
            'zip_code' => '9307',
            'mobile_number' => '09123456789',
            'religion' => 'Islam',
            'residence_type' => "Parent's House",
            'status_of_parents' => 'Living Together',
        ];

        switch ($studentData['scenario']) {
            case 'honor_student':
                return array_merge($baseProfile, [
                    'existing_scholarships' => 'Previous Academic Excellence Award',
                    'father_occupation' => 'Engineer',
                    'father_monthly_income' => 75000,
                    'mother_occupation' => 'Teacher',
                    'mother_monthly_income' => 45000,                    'total_annual_income' => 1440000,
                    'has_computer' => true,
                    'has_laptop' => true,
                ]);

            case 'dean_lister':
                return array_merge($baseProfile, [
                    'existing_scholarships' => null,
                    'father_occupation' => 'Businessman',
                    'father_monthly_income' => 50000,
                    'mother_occupation' => 'Nurse',
                    'mother_monthly_income' => 35000,
                    'total_annual_income' => 1020000,
                    'has_computer' => true,
                    'has_laptop' => true,
                ]);

            case 'working_student':
                return array_merge($baseProfile, [
                    'existing_scholarships' => 'Student Assistantship',
                    'father_occupation' => 'Driver',
                    'father_monthly_income' => 25000,
                    'mother_occupation' => 'Housewife',
                    'mother_monthly_income' => 0,
                    'total_annual_income' => 300000,
                    'has_computer' => false,
                    'has_laptop' => false,
                ]);

            case 'performing_arts':
                return array_merge($baseProfile, [
                    'existing_scholarships' => 'Cultural Arts Recognition',
                    'father_occupation' => 'Teacher',
                    'father_monthly_income' => 40000,
                    'mother_occupation' => 'Government Employee',
                    'mother_monthly_income' => 30000,
                    'total_annual_income' => 840000,
                    'has_musical_instruments' => true,
                    'has_computer' => true,
                ]);

            case 'indigent_student':
                return array_merge($baseProfile, [
                    'existing_scholarships' => null,
                    'father_occupation' => 'Farmer',
                    'father_monthly_income' => 15000,
                    'mother_occupation' => 'Housewife',
                    'mother_monthly_income' => 0,
                    'total_annual_income' => 180000,
                    'has_computer' => false,
                    'has_laptop' => false,
                    'has_tv' => false,
                    'house_rental' => 0,
                ]);

            default:
                return $baseProfile;
        }
    }
}