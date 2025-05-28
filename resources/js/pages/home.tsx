import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function Home() {
    return (
        <>
            <Head title="OSAS Connect - Scholarship Management System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {/* Header Component */}
                <SiteHeader />

                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section - Above the Fold */}
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#005a2d]/95 to-[#008040]/90"></div>

                            {/* Background pattern/texture */}
                            <div className="absolute inset-0 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                    <pattern id="pattern-circles" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                        <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                                    </pattern>
                                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                                </svg>
                            </div>

                            <div className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-8 md:flex-row md:items-center md:px-10 lg:px-16">
                                {/* Left column - Text content */}
                                <div className="mb-8 w-full text-center md:mb-0 md:w-1/2 md:pr-8 md:text-left">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Student Scholarship Platform
                                    </div>
                                    <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                        Find Your Path to Academic Success
                                    </h1>
                                    <p className="mt-4 text-lg text-white/90 sm:text-xl">
                                        OSAS Connect is your all-in-one scholarship management system that helps students discover, apply for, and track educational funding opportunities.
                                    </p>

                                    <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <Link
                                            href="/scholarships/available"
                                            className="rounded-md bg-[#febd12] px-8 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                        >
                                            Browse Scholarships
                                        </Link>
                                        <Link
                                            href="/about"
                                            className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-center font-medium text-white transition-all hover:bg-white hover:text-[#005a2d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>

                                {/* Right column - Image */}
                                <div className="flex w-full justify-center md:w-1/2">
                                    <div className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                                        <div className="absolute right-0 top-5 h-5/6 w-5/6 rounded-3xl bg-[#febd12]/30"></div>
                                        <div className="absolute left-0 top-0 h-5/6 w-5/6 rounded-3xl bg-white/10 backdrop-blur-sm"></div>
                                        <img
                                            src="https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/483629014_669192902285751_1736933274720208377_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFZXtOa81sijqh7rIU05kOdbdrB0hz9HOZt2sHSHP0c5uLPDxz5CXHKkkJNEHv4AjdQ3dWq5fWFtzdcsyFrHQOB&_nc_ohc=IoFJR-94wGMQ7kNvwE7eOD6&_nc_oc=AdniH08iGsIrFvrStXBha-xZPebUzd07XZBtCv1gIDvrktm2_xohu0x0MvBp3drlNrE&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=83R5tKFapxz4fG9LshaNXw&oh=00_AfKQc42oEroAJPf8O45JLO4403BRhj64QEa7gaf60g91Qg&oe=683B2663"
                                            alt="Students with scholarships"
                                            className="absolute left-10 top-10 h-5/6 w-5/6 object-contain rounded-3xl"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/400x400/005a2d/FFFFFF?text=OSAS+CONNECT";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Scroll indicator */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                <div className="animate-bounce rounded-full bg-white/20 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Features Section with better visual hierarchy */}
                        <section className="mt-16 py-8 sm:mt-24 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Streamlined Process
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#005a2d]">How OSAS Connect Works</h2>
                                <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 px-4">
                                    Our platform simplifies the scholarship application process from start to finish
                                </p>
                            </div>

                            <div className="mt-8 grid gap-6 px-4 sm:mt-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                {/* Feature 1 - Enhanced with visual elements */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Find Scholarships</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">Browse through our comprehensive database of available scholarships filtered by your qualifications.</p>
                                    <Link href="/scholarships/available" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        Explore scholarships
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* Feature 2 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Apply Online</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">Complete and submit your applications directly through our secure online platform.</p>
                                    <Link href="/scholarships/available" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        Application guide
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* Feature 3 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Track Progress</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">Monitor the status of your applications and receive updates throughout the selection process.</p>
                                    <Link href="/dashboard" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        View your dashboard
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Resource Guide Section */}
                        <section className="py-8 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                                    Application Guide
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#005a2d] px-4">Get Started with Your Application</h2>
                                <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 px-4">
                                    Follow our step-by-step guide to prepare a strong scholarship application
                                </p>
                            </div>

                            <div className="grid gap-6 px-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-l-4 border-[#febd12]">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-[#005a2d] mb-2">Document Checklist</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">Prepare all required documents including transcripts, recommendation letters, and proof of enrollment.</p>
                                </div>

                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-l-4 border-[#febd12]">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-[#005a2d] mb-2">Essay Writing Tips</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">Learn how to write compelling personal statements and essays that highlight your achievements and goals.</p>
                                </div>

                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-l-4 border-[#febd12]">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-[#005a2d] mb-2">Important Deadlines</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">Keep track of application periods, submission deadlines, and document requirements for each scholarship.</p>
                                </div>
                            </div>
                        </section>

                        {/* Enhanced CTA Section with two-column layout */}
                        <section className="mt-16 mb-8">
                            <div className="rounded-2xl bg-gradient-to-r from-[#005a2d] to-[#008040] p-8 shadow-xl overflow-hidden relative">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                        <pattern id="pattern-circles-cta" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                            <circle id="pattern-circle-cta" cx="10" cy="10" r="1.6" fill="#fff"></circle>
                                        </pattern>
                                        <rect id="rect-cta" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
                                    </svg>
                                </div>

                                <div className="flex flex-col md:flex-row items-center relative z-10">
                                    <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                                        <h2 className="text-3xl font-bold text-white">Ready to Find Your Scholarship?</h2>
                                        <p className="mt-4 text-lg text-white/80">Create an account today and start your journey toward academic success. Our platform will guide you through every step of the process.</p>
                                        <ul className="mt-6 space-y-2">
                                            <li className="flex items-center text-white/90">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Access to 500+ scholarship opportunities
                                            </li>
                                            <li className="flex items-center text-white/90">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Personalized scholarship recommendations
                                            </li>
                                            <li className="flex items-center text-white/90">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Real-time application tracking
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="md:w-1/3 flex justify-center">
                                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl w-full max-w-md">
                                            <h3 className="text-xl font-medium text-white mb-4">Get Started Today</h3>
                                            <div className="space-y-4">
                                                <Link
                                                    href={route('register')}
                                                    className="block w-full rounded-md bg-[#febd12] px-6 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg"
                                                >
                                                    Register Now
                                                </Link>
                                                <Link
                                                    href={route('login')}
                                                    className="block w-full rounded-md border border-white/30 bg-transparent px-6 py-3 text-center font-medium text-white transition-all hover:bg-white/10"
                                                >
                                                    Login to Your Account
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer Component */}
                <SiteFooter />
            </div>
        </>
    );
}
