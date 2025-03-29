import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function Welcome() {
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

                            <div className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-12 md:flex-row md:items-center md:px-10 lg:px-16">
                                {/* Left column - Text content */}
                                <div className="mb-10 md:mb-0 md:w-1/2 md:pr-8">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Student Scholarship Platform
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Find Your Path to Academic Success
                                    </h1>
                                    <p className="mt-6 text-xl text-white/90">
                                        OSAS Connect is your all-in-one scholarship management system that helps students discover, apply for, and track educational funding opportunities.
                                    </p>

                                    <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <Link
                                            href="/scholarships/available"
                                            className="rounded-md bg-[#febd12] px-8 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                        >
                                            Browse Scholarships
                                        </Link>
                                        <Link
                                            href="/scholarships/application"
                                            className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-center font-medium text-white transition-all hover:bg-white hover:text-[#005a2d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                        >
                                            How to Apply
                                        </Link>
                                    </div>

                                    {/* Key benefits - quick stats */}
                                    <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 text-white sm:grid-cols-3">
                                        <div>
                                            <p className="text-xl font-bold text-[#febd12]">500+</p>
                                            <p className="text-sm text-white/80">Available Scholarships</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-[#febd12]">95%</p>
                                            <p className="text-sm text-white/80">Success Rate</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-[#febd12]">₱50M+</p>
                                            <p className="text-sm text-white/80">Awarded Annually</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column - Image */}
                                <div className="flex md:w-1/2 md:justify-center">
                                    <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                                        <div className="absolute right-0 top-5 h-5/6 w-5/6 rounded-3xl bg-[#febd12]/30"></div>
                                        <div className="absolute left-0 top-0 h-5/6 w-5/6 rounded-3xl bg-white/10 backdrop-blur-sm"></div>
                                        <img
                                            src="https://img.freepik.com/free-photo/education-students-happy-asian-woman-holding-notebooks-laughing-smiling-camera-enjoys-goi_1258-167792.jpg?ga=GA1.1.356696801.1743149314&semt=ais_hybrid"
                                            alt="Students with scholarships"
                                            className="absolute left-10 top-10 h-5/6 w-5/6 object-contain"
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
                        <section className="mt-24 py-16">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Streamlined Process
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">How OSAS Connect Works</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Our platform simplifies the scholarship application process from start to finish
                                </p>
                            </div>

                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                                    <Link href="/scholarships/application" className="inline-flex items-center text-[#23b14d] hover:underline">
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

                        {/* Enhanced Stats Section with visual elements */}
                        <section className="py-16 px-4 relative">
                            <div className="absolute inset-0 bg-[#005a2d]/5 rounded-3xl"></div>
                            <div className="relative rounded-lg p-8">
                                <div className="text-center mb-12">
                                    <span className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                        Our Impact
                                    </span>
                                    <h2 className="text-3xl font-bold text-[#005a2d]">Empowering Students Through Opportunity</h2>
                                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                        See the difference OSAS Connect has made in students' academic journeys
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                                    <div className="text-center bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold text-[#febd12]">500+</p>
                                        <p className="mt-2 text-sm">Available Scholarships</p>
                                    </div>

                                    <div className="text-center bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold text-[#febd12]">₱50M+</p>
                                        <p className="mt-2 text-sm">Scholarship Funds</p>
                                    </div>

                                    <div className="text-center bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold text-[#febd12]">10,000+</p>
                                        <p className="mt-2 text-sm">Registered Students</p>
                                    </div>

                                    <div className="text-center bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold text-[#febd12]">95%</p>
                                        <p className="mt-2 text-sm">Application Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* NEW: Testimonials Section */}
                        <section className="py-16">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                                    Success Stories
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">What Our Scholars Say</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Hear from students who have successfully secured scholarships through OSAS Connect
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {/* Testimonial 1 */}
                                <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md relative">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-[#febd12] rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div className="mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="36" className="fill-[#005a2d]/20">
                                            <path d="M13.415.43c-2.523-.21-4.694.655-6.51 2.598C4.132 5.863 3.05 8.187 2.86 10.88c-.19 2.716.478 5.342 2.004 7.88 1.526 2.52 3.614 4.224 6.264 5.12V36H22.2v-12.12c-3.42-.952-5.93-2.486-7.54-4.602-1.61-2.14-2.41-4.646-2.41-7.52 0-1.3.14-2.498.43-3.59.71 1.517 1.894 2.748 3.556 3.695 1.687.947 3.528 1.42 5.524 1.42 2.21 0 4.22-.872 6.032-2.616 1.806-1.744 2.71-4.05 2.71-6.917 0-2.627-.904-4.836-2.71-6.628C26.01.85 24 0 21.79 0c-1.61 0-3.333.47-5.167 1.415-1.834.945-2.957 2.306-3.368 4.086l.16-5.07zm22.7.01c-2.526-.212-4.697.654-6.512 2.596-1.773 2.836-2.855 5.16-3.047 7.852-.19 2.72.478 5.342 2.004 7.88 1.526 2.52 3.613 4.226 6.263 5.12V36H46v-12.12c-3.42-.95-5.93-2.485-7.54-4.6-1.61-2.14-2.41-4.647-2.41-7.52 0-1.3.14-2.498.43-3.59.71 1.516 1.894 2.748 3.556 3.695 1.687.945 3.528 1.42 5.523 1.42 2.208 0 4.22-.873 6.03-2.618 1.81-1.745 2.71-4.05 2.71-6.917 0-2.627-.9-4.836-2.71-6.628C48.708.85 46.7 0 44.49 0c-1.61 0-3.335.47-5.17 1.414-1.835.945-2.957 2.306-3.366 4.086l.16-5.07z" />
                                        </svg>
                                    </div>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-6">OSAS Connect made finding and applying for scholarships so much easier. The system guided me through each step, and I was able to secure funding for my entire college education!</p>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full bg-[#005a2d]/20 flex items-center justify-center mr-4">
                                            <span className="text-[#005a2d] font-bold">MA</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Maria Aquino</h4>
                                            <p className="text-sm text-[#010002]/60 dark:text-[#f3f2f2]/60">Engineering Student</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 2 */}
                                <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md relative">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-[#febd12] rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div className="mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="36" className="fill-[#005a2d]/20">
                                            <path d="M13.415.43c-2.523-.21-4.694.655-6.51 2.598C4.132 5.863 3.05 8.187 2.86 10.88c-.19 2.716.478 5.342 2.004 7.88 1.526 2.52 3.614 4.224 6.264 5.12V36H22.2v-12.12c-3.42-.952-5.93-2.486-7.54-4.602-1.61-2.14-2.41-4.646-2.41-7.52 0-1.3.14-2.498.43-3.59.71 1.517 1.894 2.748 3.556 3.695 1.687.947 3.528 1.42 5.524 1.42 2.21 0 4.22-.872 6.032-2.616 1.806-1.744 2.71-4.05 2.71-6.917 0-2.627-.904-4.836-2.71-6.628C26.01.85 24 0 21.79 0c-1.61 0-3.333.47-5.167 1.415-1.834.945-2.957 2.306-3.368 4.086l.16-5.07zm22.7.01c-2.526-.212-4.697.654-6.512 2.596-1.773 2.836-2.855 5.16-3.047 7.852-.19 2.72.478 5.342 2.004 7.88 1.526 2.52 3.613 4.226 6.263 5.12V36H46v-12.12c-3.42-.95-5.93-2.485-7.54-4.6-1.61-2.14-2.41-4.647-2.41-7.52 0-1.3.14-2.498.43-3.59.71 1.516 1.894 2.748 3.556 3.695 1.687.945 3.528 1.42 5.523 1.42 2.208 0 4.22-.873 6.03-2.618 1.81-1.745 2.71-4.05 2.71-6.917 0-2.627-.9-4.836-2.71-6.628C48.708.85 46.7 0 44.49 0c-1.61 0-3.335.47-5.17 1.414-1.835.945-2.957 2.306-3.366 4.086l.16-5.07z" />
                                        </svg>
                                    </div>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-6">The tracking system kept me informed throughout the entire process. I could see exactly which documents were needed and when decisions were made. It removed all the uncertainty!</p>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full bg-[#005a2d]/20 flex items-center justify-center mr-4">
                                            <span className="text-[#005a2d] font-bold">JR</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Juan Reyes</h4>
                                            <p className="text-sm text-[#010002]/60 dark:text-[#f3f2f2]/60">Business Administration</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 3 */}
                                <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md relative">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-[#febd12] rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div className="mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="36" className="fill-[#005a2d]/20">
                                            <path d="M13.415.43c-2.523-.21-4.694.655-6.51 2.598C4.132 5.863 3.05 8.187 2.86 10.88c-.19 2.716.478 5.342 2.004 7.88 1.526 2.52 3.614 4.224 6.264 5.12V36H22.2v-12.12c-3.42-.952-5.93-2.486-7.54-4.602-1.61-2.14-2.41-4.646-2.41-7.52 0-1.3.14-2.498.43-3.59.71 1.517 1.894 2.748 3.556 3.695 1.687.947 3.528 1.42 5.524 1.42 2.21 0 4.22-.872 6.032-2.616 1.806-1.744 2.71-4.05 2.71-6.917 0-2.627-.904-4.836-2.71-6.628C26.01.85 24 0 21.79 0c-1.61 0-3.333.47-5.167 1.415-1.834.945-2.957 2.306-3.368 4.086l.16-5.07zm22.7.01c-2.526-.212-4.697.654-6.512 2.596-1.773 2.836-2.855 5.16-3.047 7.852-.19 2.72.478 5.342 2.004 7.88 1.526 2.52 3.613 4.226 6.263 5.12V36H46v-12.12c-3.42-.95-5.93-2.485-7.54-4.6-1.61-2.14-2.41-4.647-2.41-7.52 0-1.3.14-2.498.43-3.59.71 1.516 1.894 2.748 3.556 3.695 1.687.945 3.528 1.42 5.523 1.42 2.208 0 4.22-.873 6.03-2.618 1.81-1.745 2.71-4.05 2.71-6.917 0-2.627-.9-4.836-2.71-6.628C48.708.85 46.7 0 44.49 0c-1.61 0-3.335.47-5.17 1.414-1.835.945-2.957 2.306-3.366 4.086l.16-5.07z" />
                                        </svg>
                                    </div>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-6">As a first-generation college student, I had no idea where to start with scholarships. OSAS Connect provided all the guidance I needed and connected me with opportunities I wouldn't have found otherwise.</p>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full bg-[#005a2d]/20 flex items-center justify-center mr-4">
                                            <span className="text-[#005a2d] font-bold">SD</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Sarah Delos Santos</h4>
                                            <p className="text-sm text-[#010002]/60 dark:text-[#f3f2f2]/60">Education Major</p>
                                        </div>
                                    </div>
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
