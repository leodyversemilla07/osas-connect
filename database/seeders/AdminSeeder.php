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
            ],
        );

        // Create admin profile
        AdminProfile::firstOrCreate(['user_id' => $admin->id], ['admin_id' => 'ADMIN_SPEC001']);

        $this->command->info('Created specific admin: Leif Sage Semilla');
    }
}
