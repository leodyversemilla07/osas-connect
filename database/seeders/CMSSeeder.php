<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CMSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Page::create([
            'title' => 'Home',
            'slug' => 'home',
            'content' => json_encode([
                'heading' => 'Welcome to OSAS Connect',
                'subheading' => 'Your Gateway to Academic Success',
                'body' => 'OSAS Connect is the premier platform for managing scholarships, academic resources, and student services. Our comprehensive system helps students navigate their academic journey with ease and efficiency.',
                'features' => [
                    'Scholarship Application Management',
                    'Academic Resource Access',
                    'Student Support Services',
                    'Document Management System',
                ],
            ]),
        ]);

        \App\Models\Page::create([
            'title' => 'About Us',
            'slug' => 'about',
            'content' => json_encode([
                'heading' => 'About OSAS Connect',
                'body' => 'The Office of Student Affairs and Services (OSAS) Connect platform was designed to streamline academic processes and provide students with seamless access to essential services. Our mission is to support student success through innovative technology and comprehensive resource management.',
                'mission' => 'To empower students through accessible, efficient, and comprehensive academic support services.',
                'vision' => 'To be the leading platform for student academic success and resource management.',
                'values' => [
                    'Excellence in Service',
                    'Innovation in Technology',
                    'Accessibility for All',
                    'Student-Centered Approach',
                ],
            ]),
        ]);

        \App\Models\Page::create([
            'title' => 'Contact Us',
            'slug' => 'contact',
            'content' => json_encode([
                'heading' => 'Get in Touch',
                'body' => 'Have questions about scholarships, academic services, or need support? Our team is here to help you succeed.',
                'contact_info' => [
                    'email' => 'support@osasconnect.edu',
                    'phone' => '+1 (555) 123-4567',
                    'address' => '123 University Drive, Academic Building, Room 456',
                    'hours' => 'Monday - Friday: 8:00 AM - 5:00 PM',
                ],
                'departments' => [
                    'Scholarship Services' => 'scholarships@osasconnect.edu',
                    'Academic Support' => 'academic@osasconnect.edu',
                    'Technical Support' => 'tech@osasconnect.edu',
                    'General Inquiries' => 'info@osasconnect.edu',
                ],
            ]),
        ]);
    }
}
