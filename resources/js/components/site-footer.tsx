import { Link } from '@inertiajs/react';
import { Facebook, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

interface SocialLink {
    platform: string;
    url: string;
    icon?: string;
}

interface FooterLink {
    label: string;
    url: string;
}

interface FooterContent {
    cta_title?: string;
    cta_description?: string;
    cta_button_text?: string;
    cta_button_url?: string;
    about_title?: string;
    about_description?: string;
    social_links?: SocialLink[];
    quick_links?: FooterLink[];
    support_links?: FooterLink[];
    contact_title?: string;
    contact_address?: string;
    contact_email?: string;
    contact_viber?: string;
    contact_hours?: string;
}

interface Props {
    content?: FooterContent;
}

export default function SiteFooter({ content }: Props) {    // Default links for fallback
    const defaultQuickLinks = [
        { label: 'Home', url: route('home') },
        { label: 'About', url: route('about') },
        { label: 'Scholarships', url: route('scholarships') },
        { label: 'Announcements', url: route('announcements') },
        { label: 'Contact', url: route('contact') },
    ];

    const defaultSupportLinks = [
        { label: 'Privacy Policy', url: route('privacy') },
        { label: 'Terms of Service', url: route('terms') },
        { label: 'Cookie Policy', url: route('cookies') },
        { label: 'Accessibility', url: route('accessibility') },
        { label: 'Sitemap', url: route('sitemap') },
    ];

    return (
        <footer className="w-full bg-[#003a1d] text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">                {/* Top Section with CTA */}
                <div className="border-b border-white/10 py-8 sm:py-12">
                    <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
                        <h2 className="mb-3 text-xl font-bold text-[#febd12] sm:text-2xl">
                            {content?.cta_title || 'Ready to Start Your Journey?'}
                        </h2>
                        <p className="mb-6 text-sm text-white/80 sm:text-base">
                            {content?.cta_description || 'Create your account and begin exploring scholarship opportunities today.'}
                        </p>
                        <Link
                            href={content?.cta_button_url || route('register')}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#febd12] px-4 py-2.5 text-sm font-medium text-[#003a1d] transition-all hover:bg-[#f5b400] hover:shadow-lg sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                        >
                            {content?.cta_button_text || 'Register Now'}
                        </Link>
                    </div>
                </div>
                {/* Main Footer Content */}
                <div className="grid gap-8 py-12 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">                    {/* Column 1: About */}
                    <div className="mb-6 sm:mb-0">
                        <div className="mb-4 flex items-center">
                            <span className="text-2xl font-semibold text-white">
                                {content?.about_title || 'OSAS Connect'}
                            </span>
                            <span className="ml-2 text-xs text-[#febd12]">Scholarship Management</span>
                        </div>
                        <p className="mb-4 text-sm text-white/80">
                            {content?.about_description || 'Your complete scholarship management system designed to connect students with educational funding opportunities. We help streamline the application process and maximize your chances of success.'}
                        </p>
                        <div className="mt-6 flex items-center space-x-4">
                            {(content?.social_links || [{ platform: 'Facebook', url: 'https://www.facebook.com/mbc.scholarships' }]).map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="rounded-full bg-white/10 p-2 transition-all hover:bg-[#febd12] hover:text-[#003a1d]"
                                    aria-label={social.platform}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-[#febd12]">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            {(content?.quick_links || defaultQuickLinks).map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.url} 
                                        className="text-white/70 transition-colors hover:text-[#febd12]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-[#febd12]">Support</h3>
                        <ul className="space-y-3 text-sm">
                            {(content?.support_links || defaultSupportLinks).map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.url} 
                                        className="text-white/70 transition-colors hover:text-[#febd12]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>                    {/* Column 4: Contact & Support */}
                    <div className="mb-6 sm:mb-0">
                        <h3 className="mb-6 text-lg font-medium text-[#febd12]">
                            {content?.contact_title || 'Contact & Support'}
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#febd12]" />
                                <span className="text-white/80">
                                    {content?.contact_address || 'Office of Student Affairs and Services\nUniversity Campus'}
                                </span>
                            </li>
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <Mail className="h-5 w-5 flex-shrink-0 text-[#febd12] sm:mt-0.5" />
                                <div className="flex-1 break-words">
                                    <a href={`mailto:${content?.contact_email || 'minsubcscholarship.edu.ph@gmail.com'}`}
                                        className="text-white/80 hover:text-[#febd12] break-all">
                                        {content?.contact_email || 'minsubcscholarship.edu.ph@gmail.com'}
                                    </a>
                                </div>
                            </li>
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <MessageCircle className="h-5 w-5 flex-shrink-0 text-[#febd12] sm:mt-0.5" />
                                <a href={`viber://chat?number=%2B63${content?.contact_viber?.replace(/\D/g, '') || '9482968080'}`} className="text-white/80 hover:text-[#febd12]">
                                    Viber: {content?.contact_viber || '0948-296-8080'}
                                </a>
                            </li>
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <Clock className="h-5 w-5 flex-shrink-0 text-[#febd12] sm:mt-0.5" />
                                <span className="text-white/80">
                                    {content?.contact_hours || 'Monday-Friday: 8:00 AM - 5:00 PM'}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Bottom Copyright */}
                <div className="border-t border-white/10 py-6 text-center">
                    <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} OSAS Connect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
