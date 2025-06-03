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
        // php artisan db:seed -> this should be run to seed the database with the default admin user

        // Create the default system admin with basic information
        // Create or get the default system admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@minsu.edu.ph'],
            [
                'last_name' => 'Jane',
                'first_name' => 'Doe',
                'middle_name' => 'Smith',
                'password' => Hash::make('Admin@123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create the admin profile with personal and professional information
        // Create profile if not exists
        AdminProfile::firstOrCreate(
            ['user_id' => $admin->id],
            ['admin_id' => 'ADMIN001']
        );

        // You can add more admin users here as needed
    }
}
