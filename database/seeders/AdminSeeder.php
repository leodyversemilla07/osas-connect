<?php

namespace Database\Seeders;

use App\Models\AdminProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific admin user first
        $this->createSpecificAdmin();
        
        // Create admin users
        $adminUsers = [
            [
                'first_name' => 'Jane',
                'middle_name' => 'Smith',
                'last_name' => 'Doe',
                'email' => 'admin@minsu.edu.ph',
                'admin_id' => 'ADMIN001',
            ],
            [
                'first_name' => 'John',
                'middle_name' => 'Alexander',
                'last_name' => 'Santos',
                'email' => 'john.santos@minsu.edu.ph',
                'admin_id' => 'ADMIN002',
            ],
            [
                'first_name' => 'Patricia',
                'middle_name' => 'Grace',
                'last_name' => 'Reyes',
                'email' => 'patricia.reyes@minsu.edu.ph',
                'admin_id' => 'ADMIN003',
            ],
            [
                'first_name' => 'Abdul',
                'middle_name' => 'Rahman',
                'last_name' => 'Maranao',
                'email' => 'abdul.maranao@minsu.edu.ph',
                'admin_id' => 'ADMIN004',
            ],
            [
                'first_name' => 'Fatima',
                'middle_name' => 'Aisha',
                'last_name' => 'Dimaporo',
                'email' => 'fatima.dimaporo@minsu.edu.ph',
                'admin_id' => 'ADMIN005',
            ],
        ];

        foreach ($adminUsers as $adminData) {
            // Create or get the admin user
            $admin = User::firstOrCreate(
                ['email' => $adminData['email']],
                [
                    'last_name' => $adminData['last_name'],
                    'first_name' => $adminData['first_name'],
                    'middle_name' => $adminData['middle_name'],
                    'password' => Hash::make('Admin@123'),
                    'role' => 'admin',
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            // Create the admin profile
            AdminProfile::firstOrCreate(
                ['user_id' => $admin->id],
                ['admin_id' => $adminData['admin_id']]
            );
        }

        $this->command->info('Created 5 admin users with profiles.');
    }

    /**
     * Create specific admin user
     */
    private function createSpecificAdmin(): void
    {
        // Create specific admin user: Leif Sage Semilla
        $admin = User::firstOrCreate(
            ['email' => 'leifsagesemilla@gmail.com'],
            [
                'last_name' => 'Semilla',
                'first_name' => 'Leif Sage',
                'middle_name' => 'Garcia',
                'password' => Hash::make('Admin@123'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Create admin profile
        AdminProfile::firstOrCreate(
            ['user_id' => $admin->id],
            ['admin_id' => 'ADMIN_SPEC001']
        );

        $this->command->info('Created specific admin: Leif Sage Semilla');
    }
}
