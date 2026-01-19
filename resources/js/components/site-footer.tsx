import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export default function SiteFooter() {
    return (
        <footer className="relative overflow-hidden bg-[#002e17] pt-20 pb-10 text-white">
            {/* Background Pattern */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden opacity-10">
                <div className="absolute -top-[50%] -left-[20%] h-[80%] w-[80%] rounded-full bg-green-400 blur-[150px]" />
                <div className="absolute -right-[20%] bottom-[20%] h-[60%] w-[60%] rounded-full bg-amber-500 blur-[150px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                                <AppLogoIcon className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display text-2xl font-bold tracking-tight">OSAS Connect</span>
                                <span className="text-xs font-medium tracking-widest text-white/60 uppercase">MinSU Scholarship Portal</span>
                            </div>
                        </div>
                        <p className="max-w-sm leading-relaxed text-white/70">
                            Empowering Mindoro State University students through accessible financial assistance and streamlined scholarship
                            management.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-green-500 hover:bg-green-500 hover:text-white"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <h3 className="text-lg font-bold text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'About OSAS', url: route('about') },
                                { label: 'Scholarships', url: route('scholarships') },
                                { label: 'Announcements', url: '#' },
                                { label: 'Contact Us', url: route('contact') },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.url}
                                        className="text-white/70 transition-colors hover:text-green-400 hover:underline hover:decoration-green-400/50 hover:underline-offset-4"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Programs Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <h3 className="text-lg font-bold text-white">Programs</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Academic', url: '#' },
                                { label: 'Student Assistant', url: '#' },
                                { label: 'Performing Arts', url: '#' },
                                { label: 'Sports', url: '#' },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.url}
                                        className="text-white/70 transition-colors hover:text-green-400 hover:underline hover:decoration-green-400/50 hover:underline-offset-4"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact/Newsletter Column */}
                    <div className="space-y-6 lg:col-span-4">
                        <h3 className="text-lg font-bold text-white">Stay Updated</h3>
                        <p className="text-white/70">Subscribe to our newsletter for the latest scholarship announcements.</p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                placeholder="Enter your email"
                                className="border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:border-green-400 focus:ring-green-400/20"
                            />
                            <Button className="bg-green-500 text-white hover:bg-green-600">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center space-x-3 text-white/70">
                                <MapPin className="h-4 w-4 text-green-400" />
                                <span className="text-sm">Main Campus, Victoria, Oriental Mindoro</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/70">
                                <Phone className="h-4 w-4 text-green-400" />
                                <span className="text-sm">+63 (43) 286-2368</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/70">
                                <Mail className="h-4 w-4 text-green-400" />
                                <span className="text-sm">osas@minsu.edu.ph</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-sm text-white/50">© {new Date().getFullYear()} Mindoro State University. All rights reserved.</p>
                    <div className="flex space-x-6 text-sm text-white/50">
                        <Link href="#" className="transition-colors hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="transition-colors hover:text-white">
                            Terms of Service
                        </Link>
                        <Link href="#" className="transition-colors hover:text-white">
                            Cookie Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
