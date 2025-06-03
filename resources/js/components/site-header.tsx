import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationItem {
    label: string;
    url: string;
    active: boolean;
}

interface HeaderContent {
    logo_text?: string;
    tagline?: string;
    navigation?: NavigationItem[];
}

interface Props {
    content?: HeaderContent;
}

export default function SiteHeader({ content }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navRef = useRef<HTMLDivElement>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Default navigation if no CMS content provided
    const defaultNavigation = [
        { label: 'Home', url: '/', active: true },
        { label: 'About', url: '/about', active: true },
        { label: 'Scholarships', url: '/scholarships', active: true },
        { label: 'Announcements', url: '/announcements', active: true },
        { label: 'Contact', url: '/contact', active: true },
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && !event.target) return;

            const target = event.target as HTMLElement;
            const isDropdownButton = target.closest('[data-dropdown-toggle]');
            const isDropdownMenu = target.closest('[data-dropdown]');

            if (!isDropdownButton && !isDropdownMenu) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    // Handle scroll for sticky nav show/hide behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Hide on scroll down
            } else {
                setIsVisible(true); // Show on scroll up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Close mobile menu when pressing Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (activeDropdown) {
                    setActiveDropdown(null);
                }
                if (isMenuOpen) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen, activeDropdown]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Trap focus within mobile menu when open
    useEffect(() => {
        if (isMenuOpen && mobileMenuRef.current) {
            const focusableElements = mobileMenuRef.current.querySelectorAll(
                'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTabKey = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);
            return () => {
                document.removeEventListener('keydown', handleTabKey);
            };
        }
    }, [isMenuOpen]);

    return (
        <div
            ref={navRef}
            className={`fixed top-0 z-50 w-full transform bg-[#005a2d] shadow-md backdrop-blur transition-transform duration-300 dark:bg-[#004020] ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
            role="navigation"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="relative flex h-16 items-center justify-between">                    {/* Logo Section */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link href="/" className="flex items-center">
                            <img
                                src={route('home') + '/images/logo.png'}
                                alt="OSAS Connect Logo"
                                className="mr-2 h-8 w-8 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/32x32/005a2d/febd12?text=OC";
                                }}
                            />
                            <span className="text-xl font-semibold text-white">
                                {content?.logo_text || 'OSAS Connect'}
                            </span>
                            <span className="ml-2 hidden text-xs text-[#febd12] sm:block">
                                {content?.tagline || 'Scholarship Management'}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <nav
                        className="hidden md:block"
                        aria-label="Primary navigation"
                    >                        <ul className="flex space-x-8" role="menubar">
                            {(content?.navigation || defaultNavigation).map((item, index) => (
                                <li key={index} role="none">
                                    <Link
                                        href={item.url}
                                        className={`rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#007a3d] hover:text-[#febd12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febd12] focus-visible:ring-offset-2 ${route().current() === item.url.replace('/', '') || (item.url === '/' && route().current('home')) ? 'bg-[#007a3d] text-[#febd12]' : ''}`}
                                        aria-current={route().current() === item.url.replace('/', '') || (item.url === '/' && route().current('home')) ? 'page' : undefined}
                                        role="menuitem"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Auth Section - Right */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-md bg-[#febd12] px-5 py-1.5 text-sm font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-md px-5 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:text-[#febd12] focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-md bg-[#febd12] px-5 py-1.5 text-sm font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                >

                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-white transition-all duration-200 hover:bg-[#007a3d] hover:text-[#febd12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#febd12] focus-visible:ring-offset-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                            aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
                        >
                            <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                            <span className="relative w-6 h-6">
                                {isMenuOpen ? (
                                    <X className="h-6 w-6 transition-transform duration-200 ease-in-out" />
                                ) : (
                                    <Menu className="h-6 w-6 transition-transform duration-200 ease-in-out" />
                                )}
                            </span>
                        </button>
                    </div>
                </header>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                id="mobile-menu"
                ref={mobileMenuRef}
                aria-expanded={isMenuOpen}
            >                <nav
                    className="space-y-1 bg-[#004020] px-4 pb-3 pt-2 sm:px-6"
                    aria-label="Mobile navigation"
                >
                    {(content?.navigation || defaultNavigation).map((item, index) => (
                        <Link
                            key={index}
                            href={item.url}
                            className={`flex items-center rounded-md px-3 py-2 text-base font-medium text-white transition-all duration-200 hover:bg-[#005a2d] hover:text-[#febd12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febd12] focus-visible:ring-offset-2 ${route().current() === item.url.replace('/', '') || (item.url === '/' && route().current('home')) ? 'bg-[#005a2d] text-[#febd12]' : ''}`}
                            aria-current={route().current() === item.url.replace('/', '') || (item.url === '/' && route().current('home')) ? 'page' : undefined}
                            role="menuitem"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="mt-4 border-t border-[#006a3d] pt-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center w-full rounded-md bg-[#febd12] px-5 py-2 text-center text-base font-medium text-[#010002] shadow-sm transition-all duration-200 hover:bg-[#e5ab0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febd12] focus-visible:ring-offset-2"
                                role="menuitem"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link
                                    href={route('login')}
                                    className="flex items-center justify-center w-full rounded-md px-5 py-2 text-center text-base font-medium text-white transition-all duration-200 hover:text-[#febd12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febd12] focus-visible:ring-offset-2"
                                    role="menuitem"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="flex items-center justify-center w-full rounded-md bg-[#febd12] px-5 py-2 text-center text-base font-medium text-[#010002] shadow-sm transition-all duration-200 hover:bg-[#e5ab0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febd12] focus-visible:ring-offset-2"
                                    role="menuitem"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}
