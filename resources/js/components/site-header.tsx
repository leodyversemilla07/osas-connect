import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export default function SiteHeader() {
    const { auth } = usePage<SharedData>().props;

    const navItems = [
        { label: 'Home', url: '/' },
        { label: 'About', url: route('about') },
        { label: 'Scholarships', url: route('scholarships') },
        { label: 'Announcements', url: route('announcements') },
        { label: 'Contact', url: route('contact') },
    ];

    return (
        <header className="bg-background/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/85">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-md">
                            <AppLogoIcon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold tracking-tight">OSAS Connect</span>
                            <span className="text-muted-foreground text-[11px]">MinSU Scholarship Portal</span>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.url}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        {auth.user ? (
                            <Button asChild>
                                <Link href={route('dashboard')}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href={route('login')}>Log in</Link>
                                </Button>
                                <Button asChild>
                                    <Link href={route('register')}>Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0">
                                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                                <SheetDescription className="sr-only">Navigation menu for mobile devices</SheetDescription>
                                <div className="flex h-full flex-col">
                                    <div className="border-b p-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
                                                <AppLogoIcon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-semibold">OSAS Connect</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-6 py-6">
                                        <nav className="flex flex-col space-y-1">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.url}
                                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>

                                    <div className="border-t p-6">
                                        {auth.user ? (
                                            <Button className="w-full" asChild>
                                                <Link href={route('dashboard')}>Go to Dashboard</Link>
                                            </Button>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <Button className="w-full" asChild>
                                                    <Link href={route('register')}>Create Account</Link>
                                                </Button>
                                                <Button variant="outline" className="w-full" asChild>
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
        </header>
    );
}
