<?php

namespace Database\Seeders;

use App\Models\OsasStaffProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OsasStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */    
    public function run(): void
    {
        // Create specific OSAS staff user first
        $this->createSpecificStaff();
        
        // Create OSAS staff users
        $staffMembers = [
            [
                'first_name' => 'Maria',
                'middle_name' => 'Santos',
                'last_name' => 'Rodriguez',
                'email' => 'maria.rodriguez@minsu.edu.ph',
                'staff_id' => 'STAFF001',
            ],
            [
                'first_name' => 'Juan',
                'middle_name' => 'Carlos',
                'last_name' => 'Dela Cruz',
                'email' => 'juan.delacruz@minsu.edu.ph',
                'staff_id' => 'STAFF002',
            ],
            [
                'first_name' => 'Ana',
                'middle_name' => 'Marie',
                'last_name' => 'Gonzales',
                'email' => 'ana.gonzales@minsu.edu.ph',
                'staff_id' => 'STAFF003',
            ],
            [
                'first_name' => 'Roberto',
                'middle_name' => 'Luis',
                'last_name' => 'Fernandez',
                'email' => 'roberto.fernandez@minsu.edu.ph',
                'staff_id' => 'STAFF004',
            ],
            [
                'first_name' => 'Carmen',
                'middle_name' => 'Isabel',
                'last_name' => 'Morales',
                'email' => 'carmen.morales@minsu.edu.ph',
                'staff_id' => 'STAFF005',
            ],
            [
                'first_name' => 'Miguel',
                'middle_name' => 'Antonio',
                'last_name' => 'Rivera',
                'email' => 'miguel.rivera@minsu.edu.ph',
                'staff_id' => 'STAFF006',
            ],
            [
                'first_name' => 'Sofia',
                'middle_name' => 'Elena',
                'last_name' => 'Valdez',
                'email' => 'sofia.valdez@minsu.edu.ph',
                'staff_id' => 'STAFF007',
            ],            
            [
                'first_name' => 'Carlos',
                'middle_name' => 'Eduardo',
                'last_name' => 'Mendoza',
                'email' => 'carlos.mendoza@minsu.edu.ph',
                'staff_id' => 'STAFF008',
            ],
            [
                'first_name' => 'Hassan',
                'middle_name' => 'Abdullah',
                'last_name' => 'Alonto',
                'email' => 'hassan.alonto@minsu.edu.ph',
                'staff_id' => 'STAFF009',
            ],
            [
                'first_name' => 'Zainab',
                'middle_name' => 'Fatima',
                'last_name' => 'Disomangcop',
                'email' => 'zainab.disomangcop@minsu.edu.ph',
                'staff_id' => 'STAFF010',
            ],
        ];

        foreach ($staffMembers as $staffData) {
            // Create or get the OSAS staff user
            $staff = User::firstOrCreate(
                ['email' => $staffData['email']],
                [
                    'last_name' => $staffData['last_name'],
                    'first_name' => $staffData['first_name'],
                    'middle_name' => $staffData['middle_name'],
                    'password' => Hash::make('Staff@123'),
                    'role' => 'osas_staff',
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            // Create the OSAS staff profile
            OsasStaffProfile::firstOrCreate(
                ['user_id' => $staff->id],
                ['staff_id' => $staffData['staff_id']]
            );
        }

        
        $this->command->info('Created 10 OSAS staff users with profiles.');
    }

    /**
     * Create specific OSAS staff user
     */
    private function createSpecificStaff(): void
    {
        // Create specific OSAS staff user
        $staff = User::firstOrCreate(
            ['email' => 'lunarspectre00@gmail.com'],
            [
                'last_name' => 'Lunar',
                'first_name' => 'Spectre',
                'middle_name' => 'Admin',
                'password' => Hash::make('Staff@123'),
                'role' => 'osas_staff',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Create OSAS staff profile
        OsasStaffProfile::firstOrCreate(
            ['user_id' => $staff->id],
            ['staff_id' => 'STAFF_SPEC001']
        );

        $this->command->info('Created specific OSAS staff: Spectre Lunar');
    }
}
