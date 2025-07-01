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
        $this->call([
            AdminSeeder::class,

            OsasStaffSeeder::class,

            StudentSeeder::class,

            MinSUScholarshipsSeeder::class,

            PageSeeder::class,

            SiteComponentSeeder::class,

            ScholarshipApplicationSeeder::class,
        ]);
    }
}
