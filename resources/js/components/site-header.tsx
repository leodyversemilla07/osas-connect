import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close mobile menu when clicking outside or on escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isMenuOpen && !target.closest('[data-mobile-menu]')) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const navItems = [
        { label: 'Home', url: '/', active: true },
        { label: 'About', url: '/about', active: false },
        { label: 'Scholarships', url: '/scholarships', active: false },
        { label: 'Contact', url: '/contact', active: false },
    ];

    return (
        <header className="fixed top-0 z-50 w-full border-b border-[#005a2d]/10 dark:border-[#f3f2f2]/10 bg-white/50 dark:bg-[#121212]/50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between w-full">
                    {/* Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link href="/" className="text-lg font-semibold text-[#005a2d] dark:text-[#23b14d]">
                            OSAS Connect
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6" aria-label="Primary navigation">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                className="text-sm font-medium text-[#010002] dark:text-[#f3f2f2] transition-colors duration-200 hover:text-[#008040] dark:hover:text-[#23b14d]"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth */}
                    <div className="flex items-center">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-medium text-[#005a2d] dark:text-[#23b14d] hover:text-[#008040] dark:hover:text-[#008040] transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-[#010002] dark:text-[#f3f2f2] hover:text-[#008040] dark:hover:text-[#23b14d] transition-colors duration-200 mr-4"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-sm font-medium bg-[#005a2d] hover:bg-[#008040] text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="md:hidden ml-4 p-3 text-[#010002] dark:text-[#f3f2f2] hover:text-[#008040] dark:hover:text-[#23b14d] transition-colors duration-200 rounded-md hover:bg-[#005a2d]/5 dark:hover:bg-[#23b14d]/10 focus:outline-none focus:ring-2 focus:ring-[#008040] dark:focus:ring-[#23b14d] focus:ring-offset-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-[#005a2d]/10 dark:border-[#f3f2f2]/10 bg-white dark:bg-[#121212]">
                    <nav className="px-4 py-4 space-y-3">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                className="block text-sm font-medium text-[#010002] dark:text-[#f3f2f2] hover:text-[#008040] dark:hover:text-[#23b14d] transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="pt-3 border-t border-[#005a2d]/10 dark:border-[#f3f2f2]/10">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="block text-sm font-medium text-[#005a2d] dark:text-[#23b14d] hover:text-[#008040] dark:hover:text-[#008040] transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href={route('login')}
                                        className="block text-sm font-medium text-[#010002] dark:text-[#f3f2f2] hover:text-[#008040] dark:hover:text-[#23b14d] transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block text-sm font-medium bg-[#005a2d] hover:bg-[#008040] text-white px-4 py-2 rounded-md text-center transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
