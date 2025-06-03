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
                'content' => '<div class="space-y-8">
                    <div class="text-center">
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">Find Your Path to Academic Success</h1>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">OSAS Connect is your all-in-one scholarship management system that helps students discover, apply for, and track educational funding opportunities.</p>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-8 mt-12">
                        <div class="text-center">
                            <div class="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Find Scholarships</h3>
                            <p class="text-gray-600">Browse through our comprehensive database of available scholarships filtered by your qualifications.</p>
                        </div>
                        
                        <div class="text-center">
                            <div class="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Apply Online</h3>
                            <p class="text-gray-600">Complete and submit your applications directly through our secure online platform.</p>
                        </div>
                        
                        <div class="text-center">
                            <div class="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Track Progress</h3>
                            <p class="text-gray-600">Monitor the status of your applications and receive updates throughout the selection process.</p>
                        </div>
                    </div>
                </div>',
            ],
            [
                'slug' => 'about',
                'title' => 'About OSAS Connect',
                'content' => '<div class="space-y-8">
                    <div class="text-center">
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">About OSAS Connect</h1>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Empowering students through accessible scholarship opportunities and streamlined management</p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <p class="text-lg text-gray-600 mb-6">To bridge the gap between deserving students and educational opportunities by providing a comprehensive, user-friendly platform that simplifies scholarship discovery, application, and management processes.</p>
                            <p class="text-gray-600">We believe that financial constraints should never be a barrier to academic excellence and personal growth.</p>
                        </div>
                        <div class="bg-gray-100 p-8 rounded-lg">
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p class="text-gray-600">A future where every student can thrive academically, regardless of their financial background, through accessible educational funding and support.</p>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-8 rounded-lg">
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Why Choose OSAS Connect?</h3>
                        <ul class="grid md:grid-cols-2 gap-4">
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span>Comprehensive scholarship database</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span>Streamlined application process</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span>Real-time application tracking</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span>Dedicated support team</span>
                            </li>
                        </ul>
                    </div>
                </div>',
            ],
            [
                'slug' => 'contact',
                'title' => 'Contact Us',
                'content' => '<div class="space-y-8">
                    <div class="text-center">
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Have questions about scholarships or the application process? Our team is here to help you succeed.</p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div class="text-center p-6 bg-white rounded-lg shadow-md">
                            <div class="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Email Us</h3>
                            <p class="text-gray-600 mb-2">For general inquiries:</p>
                            <a href="mailto:minsubcscholarship.edu.ph@gmail.com" class="text-green-600 hover:text-green-700">minsubcscholarship.edu.ph@gmail.com</a>
                        </div>
                        
                        <div class="text-center p-6 bg-white rounded-lg shadow-md">
                            <div class="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Visit Us</h3>
                            <p class="text-gray-600">Office of Student Affairs and Services</p>
                            <p class="text-gray-600">Mindoro State University - Bongabong Campus</p>
                            <p class="text-gray-600">Bongabong, Oriental Mindoro</p>
                        </div>
                        
                        <div class="text-center p-6 bg-white rounded-lg shadow-md">
                            <div class="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Office Hours</h3>
                            <p class="text-gray-600">Monday - Friday</p>
                            <p class="text-gray-600">8:00 AM - 5:00 PM</p>
                            <p class="text-gray-600 text-sm mt-2">(Lunch break: 12:00 PM - 1:00 PM)</p>
                        </div>
                        
                        <div class="text-center p-6 bg-white rounded-lg shadow-md">
                            <div class="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Quick Support</h3>
                            <p class="text-gray-600 mb-2">Need immediate help?</p>
                            <p class="text-gray-600">Use our live chat or submit a support ticket through your dashboard.</p>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-8 rounded-lg text-center">
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                        <p class="text-gray-600 mb-6">Join thousands of students who have found their path to academic success through OSAS Connect.</p>
                        <div class="space-x-4">
                            <a href="/register" class="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">Register Now</a>
                            <a href="/scholarships" class="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-md hover:bg-green-50 transition-colors">Browse Scholarships</a>
                        </div>
                    </div>
                </div>',
            ],
        ];

        foreach ($pages as $pageData) {
            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }
    }
}
