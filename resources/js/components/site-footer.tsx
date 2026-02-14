import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export default function SiteFooter() {
    const links = [
        { label: 'About', url: route('about') },
        { label: 'Scholarships', url: route('scholarships') },
        { label: 'Announcements', url: route('announcements') },
        { label: 'Contact', url: route('contact') },
    ];

    return (
        <footer className="bg-muted/30 border-t">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-3">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold tracking-tight">OSAS Connect</span>
                                <span className="text-muted-foreground text-[11px]">Mindoro State University</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-sm">
                            Scholarship information and student support in one place.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
                        <nav className="grid gap-2">
                            {links.map((item) => (
                                <Link key={item.label} href={item.url} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Contact</h3>
                        <div className="text-muted-foreground grid gap-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                <span>Main Campus, Victoria, Oriental Mindoro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>+63 (43) 286-2368</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span>osas@minsu.edu.ph</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col items-center justify-between gap-3 text-xs md:flex-row">
                    <p className="text-muted-foreground">© {new Date().getFullYear()} Mindoro State University. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href={route('privacy')} className="text-muted-foreground hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href={route('terms')} className="text-muted-foreground hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <Link href={route('cookies')} className="text-muted-foreground hover:text-foreground transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
