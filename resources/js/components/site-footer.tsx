import { Link } from '@inertiajs/react';
import { Facebook, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function SiteFooter() {
    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/mbc.scholarships', label: 'Facebook' },
    ];

    return (
        <footer className="w-full bg-[#003a1d] text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top Section with CTA */}
                <div className="border-b border-white/10 py-8 sm:py-12">
                    <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
                        <h2 className="mb-3 text-xl font-bold text-[#febd12] sm:text-2xl">Ready to Start Your Journey?</h2>
                        <p className="mb-6 text-sm text-white/80 sm:text-base">Create your account and begin exploring scholarship opportunities today.</p>
                        <Link
                            href={route('register')}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#febd12] px-4 py-2.5 text-sm font-medium text-[#003a1d] transition-all hover:bg-[#f5b400] hover:shadow-lg sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
                {/* Main Footer Content */}
                <div className="grid gap-8 py-12 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: About */}
                    <div className="mb-6 sm:mb-0">
                        <div className="mb-4 flex items-center">
                            <span className="text-2xl font-semibold text-white">OSAS Connect</span>
                            <span className="ml-2 text-xs text-[#febd12]">Scholarship Management</span>
                        </div>
                        <p className="mb-4 text-sm text-white/80">
                            Your complete scholarship management system designed to connect students with educational funding opportunities. We help streamline the application process and maximize your chances of success.
                        </p>
                        <div className="mt-6 flex items-center space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="rounded-full bg-white/10 p-2 transition-all hover:bg-[#febd12] hover:text-[#003a1d]"
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-[#febd12]">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={route('home')} className="text-white/70 transition-colors hover:text-[#febd12]">Home</Link></li>
                            <li><Link href={route('about')} className="text-white/70 transition-colors hover:text-[#febd12]">About</Link></li>
                            <li><Link href={route('scholarships')} className="text-white/70 transition-colors hover:text-[#febd12]">Scholarships</Link></li>
                            <li><Link href={route('announcements')} className="text-white/70 transition-colors hover:text-[#febd12]">Announcements</Link></li>
                            <li><Link href={route('contact')} className="text-white/70 transition-colors hover:text-[#febd12]">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-[#febd12]">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={route('privacy')} className="text-white/70 transition-colors hover:text-[#febd12]">Privacy Policy</Link></li>
                            <li><Link href={route('terms')} className="text-white/70 transition-colors hover:text-[#febd12]">Terms of Service</Link></li>
                            <li><Link href={route('cookies')} className="text-white/70 transition-colors hover:text-[#febd12]">Cookie Policy</Link></li>
                            <li><Link href={route('accessibility')} className="text-white/70 transition-colors hover:text-[#febd12]">Accessibility</Link></li>
                            <li><Link href={route('sitemap')} className="text-white/70 transition-colors hover:text-[#febd12]">Sitemap</Link></li>
                        </ul>
                    </div>
                    {/* Column 4: Contact & Support */}
                    <div className="mb-6 sm:mb-0">
                        <h3 className="mb-6 text-lg font-medium text-[#febd12]">Contact & Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#febd12]" />
                                <span className="text-white/80">Office of Student Affairs and Services<br />University Campus</span>
                            </li>                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <Mail className="h-5 w-5 flex-shrink-0 text-[#febd12] sm:mt-0.5" />
                                <div className="flex-1 break-words">
                                    <a href="mailto:minsubcscholarship.edu.ph@gmail.com"
                                        className="text-white/80 hover:text-[#febd12] break-all">
                                        minsubcscholarship.edu.ph@gmail.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <MessageCircle className="h-5 w-5 flex-shrink-0 text-[#febd12] sm:mt-0.5" />
                                <a href="viber://chat?number=%2B639482968080" className="text-white/80 hover:text-[#febd12]">
                                    Viber: 0948-296-8080
                                </a>
                            </li>
                            <li className="flex flex-col space-y-2 rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10 sm:flex-row sm:items-start sm:space-x-3 sm:space-y-0">
                                <Clock className="h-5 w-5 flex-shrink-0 text-[#febd12] sm:mt-0.5" />
                                <span className="text-white/80">Monday-Friday: 8:00 AM - 5:00 PM</span>
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
