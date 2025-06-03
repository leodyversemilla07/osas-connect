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

        // Seed MinSU scholarships
        $this->call(MinSUScholarshipsSeeder::class);

        // Seed CMS pages
        $this->call(CMSPagesSeeder::class);

        // Seed scholarship applications with sample data
        $this->call(ScholarshipApplicationSeeder::class);

        // Add other seeders here as needed
    }
}
