<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\SiteComponent;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    /**
     * Get header and footer content for all public pages
     */
    private function getSiteComponents(): array
    {
        $header = SiteComponent::getHeader();
        $footer = SiteComponent::getFooter();

        return [
            'headerContent' => $header ? $header->content : null,
            'footerContent' => $footer ? $footer->content : null,
        ];
    }

    /**
     * Display the home page with CMS content.
     */
    public function home(): Response
    {
        $page = Page::findBySlug('home');

        if ($page && $page->content) {
            // Map CMS content to expected home page structure
            $cmsContent = $page->content;
            $pageContent = [
                'hero' => [
                    'badge' => 'Scholarship Management',
                    'title' => $cmsContent['heading'] ?? 'Your Gateway to Educational Excellence',
                    'subtitle' => $cmsContent['subheading'] ?? $cmsContent['body'] ?? 'OSAS Connect streamlines the scholarship application process.',
                    'primary_button' => 'Apply for Scholarships',
                    'secondary_button' => 'Learn More',
                ],
                'features' => [
                    'badge' => 'Why Choose OSAS Connect',
                    'title' => 'Everything You Need',
                    'subtitle' => 'Comprehensive tools for scholarship management',
                    'items' => [],
                ],
                'guide' => [
                    'badge' => 'How It Works',
                    'title' => 'Simple Steps to Success',
                    'subtitle' => 'Get started with your scholarship journey',
                    'items' => [],
                ],
                'cta' => [
                    'title' => 'Ready to Apply?',
                    'description' => 'Start your scholarship journey today and unlock opportunities for your academic future.',
                    'button_text' => 'Get Started Now',
                    'button_link' => '/login',
                ],
            ];
            // Convert features array to expected format
            if (isset($cmsContent['features']) && is_array($cmsContent['features'])) {
                $icons = ['FileText', 'TrendingUp', 'Shield', 'UserCheck'];
                $pageContent['features']['items'] = array_map(function ($feature, $index) use ($icons) {
                    // Handle both string and array feature formats
                    if (is_array($feature)) {
                        $title = $feature['title'] ?? $feature['name'] ?? 'Feature';
                        $description = $feature['description'] ?? ('Enhanced '.strtolower($title).' capabilities');
                    } else {
                        $title = $feature;
                        $description = 'Enhanced '.strtolower($feature).' capabilities';
                    }

                    return [
                        'icon' => $icons[$index % count($icons)],
                        'title' => $title,
                        'description' => $description,
                    ];
                }, array_values($cmsContent['features']), array_keys(array_values($cmsContent['features'])));
            }

            // Add default guide items
            $pageContent['guide']['items'] = [
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
            ];
        } else {
            $pageContent = $this->getDefaultHomeContent();
        }

return Inertia::render('home', [
            'pageContent' => $pageContent,
            'cmsTheme' => $page ? $page->getTheme() : null,
            'cmsColorScheme' => $page ? $page->getEffectiveColorScheme() : null,
            ...$this->getSiteComponents(),
        ]);
    }

    /**
     * Display the about page with CMS content.
     */
    public function about(): Response
    {
        $pageContent = Page::findBySlug('about');

        return Inertia::render('about', [
            'pageContent' => $pageContent ? $pageContent->content : $this->getDefaultAboutContent(),
            'cmsTheme' => $pageContent ? $pageContent->getTheme() : null,
            'cmsColorScheme' => $pageContent ? $pageContent->getEffectiveColorScheme() : null,
            ...$this->getSiteComponents(),
        ]);
    }

    /**
     * Display the contact page with CMS content.
     */
    public function contact(): Response
    {
        $pageContent = Page::findBySlug('contact');

        return Inertia::render('contact', [
            'pageContent' => $pageContent ? $pageContent->content : $this->getDefaultContactContent(),
            'cmsTheme' => $pageContent ? $pageContent->getTheme() : null,
            'cmsColorScheme' => $pageContent ? $pageContent->getEffectiveColorScheme() : null,
            ...$this->getSiteComponents(),
        ]);
    }

    /**
     * Display a page by its slug
     */
    public function show($slug)
    {
        $page = Page::findBySlug($slug);

        if (! $page) {
            abort(404);
        }

return Inertia::render('public-page', [
            'page' => $page,
            'cmsTheme' => $page->getTheme(),
            'cmsColorScheme' => $page->getEffectiveColorScheme(),
            ...$this->getSiteComponents(),
        ]);
    }

    /**
     * Get default home page content if no CMS content exists
     */
    private function getDefaultHomeContent(): array
    {
        return [
            'hero' => [
                'badge' => 'Scholarship Management',
                'title' => 'Your Gateway to Educational Excellence',
                'subtitle' => 'OSAS Connect streamlines the scholarship application process, making it easier for students to access funding opportunities and achieve their academic dreams.',
                'primary_button' => 'Apply for Scholarships',
                'secondary_button' => 'Learn More',
            ],
            'features' => [
                [
                    'title' => 'Easy Application',
                    'description' => 'Submit your scholarship applications online with our user-friendly interface',
                ],
                [
                    'title' => 'Track Progress',
                    'description' => 'Monitor your application status in real-time throughout the review process',
                ],
                [
                    'title' => 'Document Management',
                    'description' => 'Upload and manage all required documents securely in one place',
                ],
            ],
            'cta' => [
                'title' => 'Ready to Apply?',
                'description' => 'Start your scholarship journey today and unlock opportunities for your academic future.',
                'button_text' => 'Get Started Now',
            ],
        ];
    }

    /**
     * Get default about page content if no CMS content exists
     */
    private function getDefaultAboutContent(): array
    {
        return [
            'hero' => [
                'badge' => 'About Us',
                'title' => 'Empowering Students Through Education',
                'subtitle' => 'Learn about our mission to make quality education accessible to all students.',
            ],
            'mission' => [
                'title' => 'Our Mission',
                'description' => 'To provide a streamlined, efficient, and transparent scholarship management system that connects deserving students with educational opportunities.',
                'image' => 'https://img.freepik.com/free-photo/portrait-female-teacher-holding-notepad-green-wall_651396-1833.jpg',
            ],
            'vision' => [
                'title' => 'Our Vision',
                'description' => 'A future where every student can thrive',
                'subtitle' => 'We envision a world where financial barriers no longer prevent talented students from achieving their educational dreams',
            ],
        ];
    }

    /**
     * Get default contact page content if no CMS content exists
     */
    private function getDefaultContactContent(): array
    {
        return [
            'hero' => [
                'badge' => 'Get in Touch',
                'title' => 'Contact Us',
                'subtitle' => 'Have questions about scholarships or the application process? Our team is here to help you succeed.',
            ],
            'contacts' => [
                [
                    'type' => 'email',
                    'title' => 'Email Us',
                    'description' => 'For general inquiries and scholarship questions:',
                    'value' => 'minsubcscholarship.edu.ph@gmail.com',
                ],
                [
                    'type' => 'address',
                    'title' => 'Visit Us',
                    'description' => 'Office of Student Affairs and Services:',
                    'value' => 'Mindoro State University - Bongabong Campus\nBongabong\nOriental Mindoro',
                ],
                [
                    'type' => 'hours',
                    'title' => 'Office Hours',
                    'description' => 'Available during:',
                    'value' => 'Monday - Friday\n8:00 AM - 5:00 PM\nExcept Holidays',
                ],
                [
                    'type' => 'viber',
                    'title' => 'Viber',
                    'description' => 'Connect with us on Viber:',
                    'value' => '0948-296-8080',
                ],
            ],
            'cta' => [
                'title' => 'Need Additional Help?',
                'description' => 'Our dedicated team is ready to assist you with any questions about scholarships, applications, or general inquiries.',
            ],
        ];
    }
}
