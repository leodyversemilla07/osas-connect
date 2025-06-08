<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the admin seeder to create initial admin users
        $this->call(AdminSeeder::class);

        // Call the OSAS staff seeder to create staff users
        $this->call(OsasStaffSeeder::class);

        // Call the student seeder to create student users (60 students)
        $this->call(StudentSeeder::class);

        // Seed MinSU scholarships
        $this->call(MinSUScholarshipsSeeder::class);

        // Seed CMS pages using consolidated page seeder
        $this->call(PageSeeder::class);

        // Seed site components (header/footer configurations)
        $this->call(SiteComponentSeeder::class);

        // Seed scholarship applications with sample data
        $this->call(ScholarshipApplicationSeeder::class);

        // Add other seeders here as needed
    }
}
