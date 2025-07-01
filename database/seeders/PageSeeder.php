<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'home',
                'title' => 'Welcome to OSAS Connect',
                'content' => [
                    'hero' => [
                        'badge' => 'Scholarship Management',
                        'title' => 'Your Gateway to Educational Excellence',
                        'subtitle' => 'OSAS Connect streamlines the scholarship application process, making educational opportunities accessible to all students.',
                        'primary_button' => 'Apply for Scholarships',
                        'secondary_button' => 'Learn More',
                    ],
                    'features' => [
                        'badge' => 'Why Choose OSAS Connect',
                        'title' => 'Everything You Need',
                        'subtitle' => 'Comprehensive tools for scholarship management',
                        'items' => [
                            [
                                'icon' => 'FileText',
                                'title' => 'Easy Applications',
                                'description' => 'Streamlined application process with digital document submission.',
                            ],
                            [
                                'icon' => 'TrendingUp',
                                'title' => 'Track Progress',
                                'description' => 'Real-time updates on your application status and progress.',
                            ],
                            [
                                'icon' => 'Shield',
                                'title' => 'Secure & Reliable',
                                'description' => 'Your data is protected with enterprise-grade security.',
                            ],
                        ],
                    ],
                    'guide' => [
                        'badge' => 'How It Works',
                        'title' => 'Simple Steps to Success',
                        'subtitle' => 'Get started with your scholarship journey',
                        'items' => [
                            [
                                'icon' => 'UserCheck',
                                'title' => 'Create Account',
                                'description' => 'Register with your student credentials',
                            ],
                            [
                                'icon' => 'FileText',
                                'title' => 'Browse Scholarships',
                                'description' => 'Explore available opportunities',
                            ],
                            [
                                'icon' => 'Send',
                                'title' => 'Apply & Track',
                                'description' => 'Submit applications and monitor progress',
                            ],
                        ],
                    ],
                    'cta' => [
                        'title' => 'Ready to Apply?',
                        'description' => 'Start your scholarship journey today and unlock opportunities for your academic future.',
                        'button_text' => 'Get Started Now',
                        'button_link' => '/login',
                    ],
                ],
            ],
            [
                'slug' => 'about',
                'title' => 'About OSAS Connect',
                'content' => [
                    'hero' => [
                        'badge' => 'About Us',
                        'title' => 'Empowering Students Through Education',
                        'subtitle' => 'Learn about our mission to make quality education accessible to all students.',
                    ],
                    'mission' => [
                        'badge' => 'Our Mission',
                        'title' => 'Our Mission',
                        'description' => 'To provide a streamlined, efficient, and transparent scholarship management system that connects deserving students with educational opportunities.',
                        'features' => [
                            'Streamlined application process',
                            'Transparent selection criteria',
                            'Real-time status tracking',
                            'Comprehensive document management',
                            'Equal opportunity access',
                        ],
                        'image' => 'https://img.freepik.com/free-photo/portrait-female-teacher-holding-notepad-green-wall_651396-1833.jpg',
                    ],
                    'vision' => [
                        'badge' => 'Our Vision',
                        'title' => 'Our Vision',
                        'subtitle' => 'Building a future where every student can achieve their educational dreams.',
                        'values' => [
                            [
                                'icon' => 'Users',
                                'title' => 'Community',
                                'description' => 'Building strong connections between students, educators, and scholarship providers.',
                            ],
                            [
                                'icon' => 'Shield',
                                'title' => 'Trust',
                                'description' => 'Maintaining transparency and reliability in all scholarship processes.',
                            ],
                            [
                                'icon' => 'Heart',
                                'title' => 'Care',
                                'description' => 'Putting student success and wellbeing at the center of everything we do.',
                            ],
                        ],
                    ],
                    'team' => [
                        'badge' => 'Our Team',
                        'title' => 'Meet Our Team',
                        'subtitle' => 'Dedicated professionals working to make education accessible for all.',
                        'members' => [
                            [
                                'name' => 'Dr. Maria Santos',
                                'position' => 'Director, Office of Student Affairs',
                                'image' => 'https://via.placeholder.com/150x150/005a2d/ffffff?text=MS',
                            ],
                            [
                                'name' => 'Prof. Juan dela Cruz',
                                'position' => 'Scholarship Coordinator',
                                'image' => 'https://via.placeholder.com/150x150/005a2d/ffffff?text=JC',
                            ],
                            [
                                'name' => 'Ms. Ana Rodriguez',
                                'position' => 'Student Support Services',
                                'image' => 'https://via.placeholder.com/150x150/005a2d/ffffff?text=AR',
                            ],
                        ],
                    ],
                    'cta' => [
                        'title' => 'Ready to Start Your Journey?',
                        'description' => 'Join thousands of students who have successfully received scholarships through OSAS Connect.',
                        'button_text' => 'Apply Now',
                        'button_link' => '/login',
                    ],
                ],
            ],
            [
                'slug' => 'contact',
                'title' => 'Contact Us',
                'content' => [
                    'hero' => [
                        'badge' => 'Contact Us',
                        'title' => 'Get in Touch',
                        'subtitle' => 'Have questions about scholarships or the application process? Our team is here to help you succeed.',
                    ],
                    'info' => [
                        'badge' => 'How to Reach Us',
                        'title' => 'We\'re Here to Help',
                        'subtitle' => 'Choose the best way to contact us based on your needs and preferences.',
                    ],
                    'contacts' => [
                        [
                            'type' => 'email',
                            'icon' => 'Mail',
                            'title' => 'Email Us',
                            'description' => 'For general inquiries and scholarship questions',
                            'value' => 'minsubcscholarship.edu.ph@gmail.com',
                            'link' => 'mailto:minsubcscholarship.edu.ph@gmail.com',
                        ],
                        [
                            'type' => 'address',
                            'icon' => 'MapPin',
                            'title' => 'Visit Us',
                            'description' => 'Office of Student Affairs and Services',
                            'value' => "Mindoro State University - Bongabong Campus\nBongabong, Oriental Mindoro",
                        ],
                        [
                            'type' => 'hours',
                            'icon' => 'Clock',
                            'title' => 'Office Hours',
                            'description' => 'We\'re available during regular business hours',
                            'value' => "Monday - Friday\n8:00 AM - 5:00 PM\n(Lunch break: 12:00 PM - 1:00 PM)",
                        ],
                        [
                            'type' => 'support',
                            'icon' => 'MessageCircle',
                            'title' => 'Quick Support',
                            'description' => 'Need immediate help?',
                            'value' => 'Use our live chat or submit a support ticket through your dashboard.',
                        ],
                    ],
                    'cta' => [
                        'title' => 'Ready to Get Started?',
                        'description' => 'Join thousands of students who have found their path to academic success through OSAS Connect.',
                    ],
                ],
            ],
        ];

        foreach ($pages as $pageData) {
            Page::updateOrCreate(['slug' => $pageData['slug']], $pageData);
        }
    }
}
