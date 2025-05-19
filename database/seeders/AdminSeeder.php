<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AdminProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the default system admin with basic information
        $admin = User::create([
            'last_name' => 'Jane',
            'first_name' => 'Doe',
            'middle_name' => 'Smith',
            'email' => 'admin@minsu.edu.ph',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create the admin profile with personal and professional information
        AdminProfile::create([
            'user_id' => $admin->id,
            'admin_id' => 'ADMIN001',
            'department' => 'OSAS',
            'position' => 'System Administrator',
            'access_level' => 'full',
        ]);

        // You can add more admin users here as needed
    }
}