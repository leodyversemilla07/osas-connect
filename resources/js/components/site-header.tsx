import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
        <header className="fixed top-0 z-50 w-full border-b border-[#005a2d]/10 bg-white/50 dark:border-[#f3f2f2]/10 dark:bg-[#121212]/50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 w-full items-center justify-between">
                    {/* Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link href="/" className="text-lg font-semibold text-[#005a2d] dark:text-[#23b14d]">
                            OSAS Connect
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden items-center space-x-6 md:flex" aria-label="Primary navigation">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                className="text-sm font-medium text-[#010002] transition-colors duration-200 hover:text-[#008040] dark:text-[#f3f2f2] dark:hover:text-[#23b14d]"
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
                                className="text-sm font-medium text-[#005a2d] transition-colors duration-200 hover:text-[#008040] dark:text-[#23b14d] dark:hover:text-[#008040]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="mr-4 text-sm font-medium text-[#010002] transition-colors duration-200 hover:text-[#008040] dark:text-[#f3f2f2] dark:hover:text-[#23b14d]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-[#005a2d] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#008040]"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="ml-4 rounded-md p-3 text-[#010002] transition-colors duration-200 hover:bg-[#005a2d]/5 hover:text-[#008040] focus:ring-2 focus:ring-[#008040] focus:ring-offset-2 focus:outline-none md:hidden dark:text-[#f3f2f2] dark:hover:bg-[#23b14d]/10 dark:hover:text-[#23b14d] dark:focus:ring-[#23b14d]"
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
                <div className="border-t border-[#005a2d]/10 bg-white md:hidden dark:border-[#f3f2f2]/10 dark:bg-[#121212]">
                    <nav className="space-y-3 px-4 py-4">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                className="block text-sm font-medium text-[#010002] transition-colors duration-200 hover:text-[#008040] dark:text-[#f3f2f2] dark:hover:text-[#23b14d]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="border-t border-[#005a2d]/10 pt-3 dark:border-[#f3f2f2]/10">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="block text-sm font-medium text-[#005a2d] transition-colors duration-200 hover:text-[#008040] dark:text-[#23b14d] dark:hover:text-[#008040]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href={route('login')}
                                        className="block text-sm font-medium text-[#010002] transition-colors duration-200 hover:text-[#008040] dark:text-[#f3f2f2] dark:hover:text-[#23b14d]"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block rounded-md bg-[#005a2d] px-4 py-2 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-[#008040]"
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
