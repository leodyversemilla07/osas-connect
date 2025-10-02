import { Link } from '@inertiajs/react';

export default function SiteFooter() {
    const footerLinks = [
        { label: 'About', url: route('about') },
        { label: 'Contact', url: route('contact') },
        { label: 'Privacy', url: route('privacy') },
        { label: 'Terms', url: route('terms') },
    ];

    return (
        <footer className="w-full border-t border-[#005a2d]/10 bg-white/30 dark:border-[#f3f2f2]/10 dark:bg-[#121212]/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-8">
                    <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="text-lg font-semibold text-[#005a2d] dark:text-[#23b14d]">
                                OSAS Connect
                            </Link>
                        </div>

                        {/* Links */}
                        <nav className="flex items-center space-x-6" aria-label="Footer navigation">
                            {footerLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className="text-sm font-medium text-[#010002] transition-colors duration-200 hover:text-[#008040] dark:text-[#f3f2f2] dark:hover:text-[#23b14d]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Copyright */}
                        <div className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">© {new Date().getFullYear()} OSAS Connect</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
