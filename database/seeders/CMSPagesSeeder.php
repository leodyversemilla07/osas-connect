<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class CMSPagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Home Page
        Page::updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Home Page',
                'content' => [
                    'hero' => [
                        'badge' => 'Scholarship Management',
                        'title' => 'Your Gateway to Educational Excellence',
                        'subtitle' => 'OSAS Connect streamlines the scholarship application process, making it easier for students to access funding opportunities and achieve their academic dreams.',
                        'primary_button' => 'Apply for Scholarships',
                        'secondary_button' => 'Learn More',
                    ],
                    'features' => [
                        'badge' => 'Streamlined Process',
                        'title' => 'How OSAS Connect Works',
                        'subtitle' => 'Our platform simplifies the scholarship application process from start to finish',
                        'items' => [
                            [
                                'icon' => 'FileText',
                                'title' => 'Easy Application',
                                'description' => 'Submit your scholarship applications online with our user-friendly interface',
                            ],
                            [
                                'icon' => 'TrendingUp',
                                'title' => 'Track Progress',
                                'description' => 'Monitor your application status in real-time throughout the review process',
                            ],
                            [
                                'icon' => 'Shield',
                                'title' => 'Document Management',
                                'description' => 'Upload and manage all required documents securely in one place',
                            ],
                        ],
                    ],
                    'guide' => [
                        'badge' => 'Application Guide',
                        'title' => 'Get Started with Your Application',
                        'subtitle' => 'Follow our step-by-step guide to prepare a strong scholarship application',
                        'items' => [
                            [
                                'icon' => 'UserCheck',
                                'title' => 'Check Eligibility',
                                'description' => 'Review scholarship requirements and ensure you meet all criteria before applying',
                            ],
                            [
                                'icon' => 'FileText',
                                'title' => 'Prepare Documents',
                                'description' => 'Gather all necessary documents including transcripts, recommendations, and essays',
                            ],
                            [
                                'icon' => 'Send',
                                'title' => 'Submit Application',
                                'description' => 'Complete your application online and submit it before the deadline',
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
            ]
        );

        // Create About Page
        Page::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About OSAS Connect',
                'content' => [
                    'hero' => [
                        'badge' => 'About Us',
                        'title' => 'Empowering Students Through Education',
                        'subtitle' => 'Learn about our mission to make quality education accessible to all students through innovative scholarship management.',
                    ],
                    'mission' => [
                        'badge' => 'Our Mission',
                        'title' => 'Bridging Dreams and Opportunities',
                        'description' => 'To provide a streamlined, efficient, and transparent scholarship management system that connects deserving students with educational opportunities. We believe in removing barriers and creating pathways for academic excellence.',
                        'features' => [
                            'Simplified application processes',
                            'Transparent selection criteria',
                            'Real-time status tracking',
                            'Comprehensive support services',
                        ],
                        'image' => 'https://img.freepik.com/free-photo/portrait-female-teacher-holding-notepad-green-wall_651396-1833.jpg',
                    ],
                    'vision' => [
                        'badge' => 'Our Vision',
                        'title' => 'A Future Where Every Student Can Thrive',
                        'subtitle' => 'We envision a world where financial barriers no longer prevent talented students from achieving their educational dreams',
                        'values' => [
                            [
                                'icon' => 'Users',
                                'title' => 'Accessibility',
                                'description' => 'Making scholarship opportunities available to all qualified students',
                            ],
                            [
                                'icon' => 'Shield',
                                'title' => 'Transparency',
                                'description' => 'Ensuring fair and open scholarship selection processes',
                            ],
                            [
                                'icon' => 'Heart',
                                'title' => 'Support',
                                'description' => 'Providing comprehensive guidance throughout the scholarship journey',
                            ],
                        ],
                    ],
                    'team' => [
                        'badge' => 'Our Team',
                        'title' => 'Meet the People Behind OSAS Connect',
                        'subtitle' => 'Dedicated professionals committed to your educational success',
                        'members' => [
                            [
                                'name' => 'Dr. Maria Santos',
                                'position' => 'Director, Office of Student Affairs',
                                'image' => 'https://img.freepik.com/free-photo/portrait-woman-customer-service-worker_23-2148890981.jpg',
                            ],
                            [
                                'name' => 'Prof. Juan dela Cruz',
                                'position' => 'Scholarship Coordinator',
                                'image' => 'https://img.freepik.com/free-photo/portrait-man-customer-service-worker_23-2148890984.jpg',
                            ],
                            [
                                'name' => 'Ms. Ana Rodriguez',
                                'position' => 'Student Support Specialist',
                                'image' => 'https://img.freepik.com/free-photo/portrait-woman-customer-service-worker_23-2148890985.jpg',
                            ],
                        ],
                    ],
                    'cta' => [
                        'title' => 'Ready to Start Your Journey?',
                        'description' => 'Join thousands of students who have successfully received scholarships through our platform.',
                        'button_text' => 'Apply Now',
                        'button_link' => '/login',
                    ],
                ],
            ]
        );

        // Create Contact Page
        Page::updateOrCreate(
            ['slug' => 'contact'],
            [
                'title' => 'Contact Us',
                'content' => [
                    'hero' => [
                        'badge' => 'Get in Touch',
                        'title' => 'Contact Us',
                        'subtitle' => 'Have questions about scholarships or the application process? Our team is here to help you succeed.',
                    ],
                    'info' => [
                        'badge' => 'Reach Out',
                        'title' => 'How to Connect With Us',
                        'subtitle' => 'Multiple ways to get in touch with our scholarship support team',
                    ],
                    'contacts' => [
                        [
                            'type' => 'email',
                            'icon' => 'Mail',
                            'title' => 'Email Us',
                            'description' => 'For general inquiries and scholarship questions:',
                            'value' => 'minsubcscholarship.edu.ph@gmail.com',
                            'link' => 'mailto:minsubcscholarship.edu.ph@gmail.com',
                        ],
                        [
                            'type' => 'address',
                            'icon' => 'MapPin',
                            'title' => 'Visit Us',
                            'description' => 'Office of Student Affairs and Services:',
                            'value' => 'Mindoro State University - Bongabong Campus\nBongabong\nOriental Mindoro',
                        ],
                        [
                            'type' => 'hours',
                            'icon' => 'Clock',
                            'title' => 'Office Hours',
                            'description' => 'Available during:',
                            'value' => 'Monday - Friday\n8:00 AM - 5:00 PM\nExcept Holidays',
                        ],
                        [
                            'type' => 'viber',
                            'icon' => 'MessageCircle',
                            'title' => 'Viber',
                            'description' => 'Connect with us on Viber:',
                            'value' => '0948-296-8080',
                            'link' => 'viber://chat?number=%2B639482968080',
                        ],
                    ],
                    'cta' => [
                        'title' => 'Need Additional Help?',
                        'description' => 'Our dedicated team is ready to assist you with any questions about scholarships, applications, or general inquiries.',
                    ],
                ],
            ]
        );
    }
}
