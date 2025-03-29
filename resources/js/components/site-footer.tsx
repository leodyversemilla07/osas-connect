import { Link } from '@inertiajs/react';

export default function SiteFooter() {
    return (
        <footer className="w-full bg-[#003a1d] pt-12 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: About */}
                    <div className="mb-6">
                        <div className="mb-4 flex items-center">
                            <span className="text-2xl font-semibold text-white">OSAS Connect</span>
                            <span className="ml-2 text-xs text-[#febd12]">Scholarship Management</span>
                        </div>
                        <p className="mb-4 text-sm text-white/80">
                            Your complete scholarship management system designed to connect students with educational funding opportunities. We help streamline the application process and maximize your chances of success.
                        </p>
                        <div className="mt-6 flex items-center space-x-4">
                            <a href="#" className="rounded-full bg-white/10 p-2 transition-all hover:bg-[#febd12] hover:text-[#003a1d]" aria-label="Facebook">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="rounded-full bg-white/10 p-2 transition-all hover:bg-[#febd12] hover:text-[#003a1d]" aria-label="Twitter">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="rounded-full bg-white/10 p-2 transition-all hover:bg-[#febd12] hover:text-[#003a1d]" aria-label="Instagram">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="rounded-full bg-white/10 p-2 transition-all hover:bg-[#febd12] hover:text-[#003a1d]" aria-label="LinkedIn">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Site Navigation */}
                    <div className="mb-6">
                        <h3 className="mb-6 text-lg font-medium text-[#febd12]">Navigate</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/" className="text-white/70 transition-colors hover:text-[#febd12]">Home</Link></li>
                                    <li><Link href="/about" className="text-white/70 transition-colors hover:text-[#febd12]">About Us</Link></li>
                                    <li><Link href="/scholarships" className="text-white/70 transition-colors hover:text-[#febd12]">Scholarships</Link></li>
                                    <li><Link href="/resources" className="text-white/70 transition-colors hover:text-[#febd12]">Resources</Link></li>
                                    <li><Link href="/news" className="text-white/70 transition-colors hover:text-[#febd12]">News & Events</Link></li>
                                </ul>
                            </div>
                            <div>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/faqs" className="text-white/70 transition-colors hover:text-[#febd12]">FAQ</Link></li>
                                    <li><Link href="/contact" className="text-white/70 transition-colors hover:text-[#febd12]">Contact Us</Link></li>
                                    <li><Link href="/careers" className="text-white/70 transition-colors hover:text-[#febd12]">Careers</Link></li>
                                    <li><Link href="/privacy" className="text-white/70 transition-colors hover:text-[#febd12]">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="text-white/70 transition-colors hover:text-[#febd12]">Terms of Service</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Resources & CTA */}
                    <div className="mb-6">
                        <h3 className="mb-6 text-lg font-medium text-[#febd12]">Scholarship Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/scholarships/application" className="text-white/70 transition-colors hover:text-[#febd12]">Application Guide</Link></li>
                            <li><Link href="/scholarships/requirements" className="text-white/70 transition-colors hover:text-[#febd12]">Requirements Checklist</Link></li>
                            <li><Link href="/scholarships/deadlines" className="text-white/70 transition-colors hover:text-[#febd12]">Upcoming Deadlines</Link></li>
                            <li><Link href="/scholarships/tips" className="text-white/70 transition-colors hover:text-[#febd12]">Application Tips</Link></li>
                        </ul>

                        <div className="mt-8 rounded-lg bg-[#004a25] p-4">
                            <h4 className="mb-2 text-base font-medium text-[#febd12]">Ready to Start?</h4>
                            <p className="mb-3 text-sm text-white/80">Create your account and begin your scholarship journey today.</p>
                            <Link href={route('register')} className="inline-flex w-full items-center justify-center rounded-md bg-[#febd12] px-4 py-2 text-sm font-medium text-[#003a1d] transition-all hover:bg-[#f5b400]">
                                Register Now
                            </Link>
                        </div>
                    </div>

                    {/* Column 4: Contact & Newsletter */}
                    <div className="mb-6">
                        <h3 className="mb-6 text-lg font-medium text-[#febd12]">Contact & Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <svg className="mr-2 mt-1 h-4 w-4 text-[#febd12]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white/80">Office of Student Affairs and Services<br />University Campus</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="mr-2 mt-0.5 h-4 w-4 text-[#febd12]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                <span className="text-white/80">osas@example.edu</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="mr-2 mt-0.5 h-4 w-4 text-[#febd12]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                <span className="text-white/80">(123) 456-7890</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="mr-2 mt-0.5 h-4 w-4 text-[#febd12]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white/80">Monday-Friday: 8:00 AM - 5:00 PM</span>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="mb-3 text-base font-medium text-[#febd12]">Stay Updated</h4>
                            <p className="mb-3 text-sm text-white/80">Subscribe to our newsletter for the latest scholarship opportunities.</p>
                            <form className="flex flex-col space-y-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="rounded-md border-0 bg-white/10 p-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#febd12]"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-[#febd12] px-4 py-2 text-sm font-medium text-[#003a1d] transition-all hover:bg-[#f5b400]"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Awards & Certifications */}
                <div className="mt-8 border-t border-white/10 py-6">
                    <h4 className="mb-4 text-center text-sm font-medium text-white/80">Recognized By</h4>
                    <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
                        <div className="flex h-12 w-auto items-center justify-center">
                            <img src="/images/award-1.svg" alt="Education Excellence Award" className="h-full"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/100x40/febd12/003a1d?text=Award+1"; }} />
                        </div>
                        <div className="flex h-12 w-auto items-center justify-center">
                            <img src="/images/award-2.svg" alt="Digital Education Initiative" className="h-full"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/100x40/febd12/003a1d?text=Award+2"; }} />
                        </div>
                        <div className="flex h-12 w-auto items-center justify-center">
                            <img src="/images/award-3.svg" alt="Student Support Excellence" className="h-full"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/100x40/febd12/003a1d?text=Award+3"; }} />
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="border-t border-white/10 py-6 text-center">
                    <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                        <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} OSAS Connect. All rights reserved.</p>
                        <div className="text-sm text-white/60">
                            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
                            <span className="mx-2">|</span>
                            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
                            <span className="mx-2">|</span>
                            <Link href="/cookies" className="hover:text-white">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
