import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Menu, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoIcon from './app-logo-icon';

export default function SiteHeader() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', url: '/' },
        { label: 'About', url: route('about') },
        { label: 'Scholarships', url: route('scholarships') },
        { label: 'Contact', url: route('contact') },
    ];

    return (
        <motion.header
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-[#005a2d]/10 bg-white/80 py-3 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/80'
                    : 'border-transparent bg-transparent py-5'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'circOut' }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#005a2d] to-[#008040] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <AppLogoIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-lg font-bold tracking-tight text-[#005a2d] transition-colors group-hover:text-[#008040] dark:text-white dark:group-hover:text-green-400">
                                OSAS Connect
                            </span>
                            <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-80">
                                MinSU Scholarship Portal
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-1 md:flex">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.url}
                                className="text-foreground/80 dark:text-foreground/90 relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[#005a2d]/5 hover:text-[#005a2d] dark:hover:bg-white/10 dark:hover:text-green-400"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth & Actions */}
                    <div className="hidden items-center space-x-4 md:flex">
                        {auth.user ? (
                            <Button
                                asChild
                                className="rounded-full bg-[#005a2d] px-6 font-semibold text-white shadow-lg shadow-[#005a2d]/20 transition-all hover:-translate-y-0.5 hover:bg-[#006e38] hover:shadow-[#005a2d]/30"
                            >
                                <Link href={route('dashboard')}>
                                    Dashboard
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-foreground/80 dark:text-foreground text-sm font-semibold transition-colors hover:text-[#005a2d] dark:hover:text-green-400"
                                >
                                    Log in
                                </Link>
                                <Button
                                    asChild
                                    className="rounded-full bg-[#005a2d] px-6 font-semibold text-white shadow-lg shadow-[#005a2d]/20 transition-all hover:-translate-y-0.5 hover:bg-[#006e38] hover:shadow-[#005a2d]/30"
                                >
                                    <Link href={route('register')}>
                                        Get Started
                                        <Sparkles className="ml-2 h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-[#005a2d] dark:text-green-400">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] border-l-[#005a2d]/10 p-0 dark:border-white/10">
                                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                                <SheetDescription className="sr-only">Navigation menu for mobile devices</SheetDescription>
                                <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
                                    <div className="flex items-center justify-between border-b border-dashed p-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005a2d] text-white">
                                                <AppLogoIcon className="h-5 w-5" />
                                            </div>
                                            <span className="font-display text-lg font-bold text-[#005a2d] dark:text-white">OSAS Connect</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-6 py-6">
                                        <nav className="flex flex-col space-y-2">
                                            {navItems.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.url}
                                                    className="text-foreground/80 flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-[#005a2d]/5 hover:text-[#005a2d] dark:hover:bg-white/5 dark:hover:text-green-400"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>

                                    <div className="border-t border-dashed p-6">
                                        {auth.user ? (
                                            <Button
                                                className="w-full rounded-xl bg-[#005a2d] py-6 text-base font-bold text-white shadow-lg hover:bg-[#006e38]"
                                                asChild
                                            >
                                                <Link href={route('dashboard')}>Go to Dashboard</Link>
                                            </Button>
                                        ) : (
                                            <div className="flex flex-col space-y-3">
                                                <Button
                                                    className="w-full rounded-xl bg-[#005a2d] py-6 text-base font-bold text-white shadow-lg hover:bg-[#006e38]"
                                                    asChild
                                                >
                                                    <Link href={route('register')}>Create Account</Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full rounded-xl border-[#005a2d]/20 py-6 text-base font-bold text-[#005a2d] hover:bg-[#005a2d]/5 dark:border-white/20 dark:text-white"
                                                    asChild
                                                >
                                                    <Link href={route('login')}>Log In</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
