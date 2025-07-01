<?php

namespace Database\Seeders;

use App\Models\SiteComponent;
use Illuminate\Database\Seeder;

class SiteComponentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default header content
        SiteComponent::updateOrCreate(
            ['component_type' => 'header'],
            [
                'content' => [
                    'logo_text' => 'OSAS Connect',
                    'tagline' => 'Scholarship Management',
                    'navigation' => [
                        ['label' => 'Home', 'url' => '/', 'active' => true],
                        ['label' => 'About', 'url' => '/about', 'active' => true],
                        ['label' => 'Scholarships', 'url' => '/scholarships', 'active' => true],
                        ['label' => 'Announcements', 'url' => '/announcements', 'active' => true],
                        ['label' => 'Contact', 'url' => '/contact', 'active' => true],
                    ],
                ],
                'is_active' => true,
            ],
        );

        // Create default footer content
        SiteComponent::updateOrCreate(
            ['component_type' => 'footer'],
            [
                'content' => [
                    'cta_title' => 'Ready to Start Your Journey?',
                    'cta_description' => 'Create your account and begin exploring scholarship opportunities today.',
                    'cta_button_text' => 'Register Now',
                    'about_text' => 'Your complete scholarship management system designed to connect students with educational funding opportunities. We help streamline the application process and maximize your chances of success.',
                    'social_links' => [['platform' => 'Facebook', 'url' => 'https://www.facebook.com/mbc.scholarships']],
                    'quick_links' => [
                        ['label' => 'Home', 'url' => '/'],
                        ['label' => 'About', 'url' => '/about'],
                        ['label' => 'Scholarships', 'url' => '/scholarships'],
                        ['label' => 'Announcements', 'url' => '/announcements'],
                        ['label' => 'Contact', 'url' => '/contact'],
                    ],
                    'support_links' => [
                        ['label' => 'Privacy Policy', 'url' => '/privacy'],
                        ['label' => 'Terms of Service', 'url' => '/terms'],
                        ['label' => 'Cookie Policy', 'url' => '/cookies'],
                        ['label' => 'Accessibility', 'url' => '/accessibility'],
                        ['label' => 'Sitemap', 'url' => '/sitemap'],
                    ],
                    'contact_info' => [
                        'address' => 'Office of Student Affairs and Services\nUniversity Campus',
                        'email' => 'minsubcscholarship.edu.ph@gmail.com',
                        'viber' => '0948-296-8080',
                        'hours' => 'Monday-Friday: 8:00 AM - 5:00 PM',
                    ],
                ],
                'is_active' => true,
            ],
        );
    }
}
