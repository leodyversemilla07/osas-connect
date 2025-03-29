import { Head, Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function Scholarships() {
    // Mock data for scholarship categories
    const scholarshipCategories = [
        {
            title: "Merit-Based",
            description: "Awarded based on academic achievements",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            link: "/scholarships/merit-based",
        },
        {
            title: "Need-Based",
            description: "Awarded based on financial need",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            link: "/scholarships/need-based",
        },
        {
            title: "Program-Specific",
            description: "Scholarships for particular fields of study",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
            ),
            link: "/scholarships/program-specific",
        },
        {
            title: "Regional",
            description: "Scholarships for specific regions or localities",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            link: "/scholarships/regional",
        },
    ];

    // Mock data for featured scholarships
    const featuredScholarships = [
        {
            title: "Presidential Scholarship",
            description: "Full tuition scholarship awarded to students with exceptional academic achievement and leadership potential.",
            amount: "₱150,000",
            deadline: "October 15, 2023",
            image: "https://placehold.co/300x200/005a2d/FFFFFF?text=Presidential",
        },
        {
            title: "STEM Excellence Scholarship",
            description: "For students pursuing degrees in science, technology, engineering, or mathematics with strong academic records.",
            amount: "₱100,000",
            deadline: "November 30, 2023",
            image: "https://placehold.co/300x200/005a2d/FFFFFF?text=STEM",
        },
        {
            title: "Community Leadership Award",
            description: "Recognizes students who have made significant contributions to their communities through volunteer work and civic engagement.",
            amount: "₱80,000",
            deadline: "December 1, 2023",
            image: "https://placehold.co/300x200/005a2d/FFFFFF?text=Leadership",
        },
    ];

    // Application steps
    const applicationSteps = [
        {
            number: "01",
            title: "Create an account",
            description: "Register on OSAS Connect to access the scholarship application system.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            number: "02",
            title: "Complete your profile",
            description: "Provide your academic information, financial details, and other relevant qualifications.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
        {
            number: "03",
            title: "Browse and apply",
            description: "Search for scholarships that match your profile and submit applications.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
        },
        {
            number: "04",
            title: "Upload documents",
            description: "Submit required supporting documents for your applications.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
            ),
        },
        {
            number: "05",
            title: "Track status",
            description: "Monitor the progress of your applications from submission to decision.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
        {
            number: "06",
            title: "Receive award",
            description: "If selected, accept your scholarship and complete any required follow-up.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
            ),
        },
    ];

    // Eligibility requirements
    const eligibilityRequirements = [
        "Currently enrolled or accepted at an accredited educational institution",
        "Minimum GPA of 2.5 (varies by scholarship)",
        "Philippine citizenship or permanent residency",
        "Demonstration of financial need (for need-based scholarships)",
        "Submission of complete application by the deadline",
        "Meeting specific criteria for specialized scholarships"
    ];

    return (
        <>
            <Head title="Scholarships - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {/* Header Component */}
                <SiteHeader />

                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section */}
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

                            <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:flex-row md:items-center md:px-10 lg:px-16">
                                {/* Left column - Text content */}
                                <div className="mb-10 md:mb-0 md:w-1/2 md:pr-8">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Financial Support
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Scholarships & Opportunities
                                    </h1>
                                    <p className="mt-6 text-xl text-white/90">
                                        Explore a wide range of scholarships designed to support your educational journey and help you achieve your academic goals.
                                    </p>

                                    <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <a
                                            href="#featured"
                                            className="rounded-md bg-[#febd12] px-8 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                        >
                                            Featured Scholarships
                                        </a>
                                        <a
                                            href="#apply"
                                            className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-center font-medium text-white transition-all hover:bg-white hover:text-[#005a2d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                        >
                                            How to Apply
                                        </a>
                                    </div>
                                </div>

                                {/* Right column - Image */}
                                <div className="flex md:w-1/2 md:justify-end">
                                    <div className="relative h-[220px] w-[300px] md:h-[300px] md:w-[400px]">
                                        <div className="absolute right-0 top-5 h-5/6 w-5/6 rounded-3xl bg-[#febd12]/30"></div>
                                        <div className="absolute left-0 top-0 h-5/6 w-5/6 rounded-3xl bg-white/10 backdrop-blur-sm"></div>
                                        <img
                                            src="https://img.freepik.com/free-photo/education-graduation-diploma-concept_53876-23329.jpg?size=626&ext=jpg&ga=GA1.1.356696801.1743149314&semt=ais_hybrid"
                                            alt="Graduation cap and diploma"
                                            className="absolute left-10 top-10 h-5/6 w-5/6 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/400x300/005a2d/FFFFFF?text=Scholarships";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scholarship Categories Section */}
                        <section className="mt-24 py-8">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Explore Options
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Scholarship Categories</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Browse scholarships by type to find opportunities that match your qualifications
                                </p>
                            </div>

                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {scholarshipCategories.map((category, index) => (
                                    <Link
                                        href={category.link}
                                        key={index}
                                        className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]"
                                    >
                                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                            {category.icon}
                                        </div>
                                        <h3 className="mb-3 text-xl font-medium text-[#005a2d]">{category.title}</h3>
                                        <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">{category.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Featured Scholarships Section */}
                        <section id="featured" className="mt-16 py-16 px-4 relative scroll-mt-20">
                            <div className="absolute inset-0 bg-[#005a2d]/5 rounded-3xl"></div>
                            <div className="relative rounded-lg p-8">
                                <div className="text-center mb-12">
                                    <span className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                        Top Opportunities
                                    </span>
                                    <h2 className="text-3xl font-bold text-[#005a2d]">Featured Scholarships</h2>
                                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                        Highlighted scholarships with upcoming deadlines
                                    </p>
                                </div>

                                <div className="grid gap-8 md:grid-cols-3">
                                    {featuredScholarships.map((scholarship, index) => (
                                        <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={scholarship.image}
                                                    alt={scholarship.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="text-xl font-medium text-[#005a2d]">{scholarship.title}</h3>
                                                    <span className="text-[#febd12] font-bold">{scholarship.amount}</span>
                                                </div>
                                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4 line-clamp-3">
                                                    {scholarship.description}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm">
                                                        <span className="text-[#010002]/50 dark:text-[#f3f2f2]/50">Deadline: </span>
                                                        <span className="font-medium">{scholarship.deadline}</span>
                                                    </div>
                                                    <Link
                                                        href={`/scholarships/details/${index}`}
                                                        className="inline-flex items-center text-[#23b14d] hover:underline"
                                                    >
                                                        View details
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 text-center">
                                    <Link
                                        href="/scholarships/all"
                                        className="inline-flex items-center justify-center rounded-md bg-[#005a2d] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#004020] focus:outline-none focus:ring-2 focus:ring-[#005a2d] focus:ring-offset-2"
                                    >
                                        View All Scholarships
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Eligibility Section */}
                        <section className="mt-16 py-8">
                            <div className="grid md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                        Qualifications
                                    </span>
                                    <h2 className="text-3xl font-bold text-[#005a2d] mb-6">Eligibility Requirements</h2>
                                    <p className="text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 mb-8">
                                        While specific requirements vary by scholarship, most opportunities on OSAS Connect require the following qualifications:
                                    </p>

                                    <ul className="space-y-4">
                                        {eligibilityRequirements.map((requirement, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="mr-3 mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span>{requirement}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8">
                                        <Link
                                            href="/scholarships/eligibility"
                                            className="inline-flex items-center text-[#23b14d] hover:underline"
                                        >
                                            Learn more about eligibility
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -right-4 -top-4 h-full w-full rounded-3xl bg-[#febd12]/10 transform rotate-3"></div>
                                    <div className="absolute -left-4 -bottom-4 h-full w-full rounded-3xl bg-[#005a2d]/10 transform -rotate-3"></div>
                                    <div className="relative z-10 rounded-xl overflow-hidden shadow-lg">
                                        <img
                                            src="https://img.freepik.com/free-photo/university-student-graduation-ceremony_1150-17755.jpg?size=626&ext=jpg&ga=GA1.1.356696801.1743149314&semt=ais_hybrid"
                                            alt="Graduates celebrating"
                                            className="w-full h-[400px] object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/600x400/005a2d/FFFFFF?text=Graduation";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Application Process Section */}
                        <section id="apply" className="mt-16 py-8 scroll-mt-20">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                    Application Process
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">How to Apply</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Follow these steps to apply for scholarships through OSAS Connect
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {applicationSteps.slice(0, 3).map((step, index) => (
                                    <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-8 shadow-md relative">
                                        <div className="absolute -right-3 -top-3 h-12 w-12 flex items-center justify-center rounded-full bg-[#febd12] text-[#010002] font-bold text-xl">
                                            {step.number}
                                        </div>
                                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10">
                                            {step.icon}
                                        </div>
                                        <h3 className="mb-3 text-xl font-medium text-[#005a2d]">{step.title}</h3>
                                        <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {applicationSteps.slice(3).map((step, index) => (
                                    <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-8 shadow-md relative">
                                        <div className="absolute -right-3 -top-3 h-12 w-12 flex items-center justify-center rounded-full bg-[#febd12] text-[#010002] font-bold text-xl">
                                            {step.number}
                                        </div>
                                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10">
                                            {step.icon}
                                        </div>
                                        <h3 className="mb-3 text-xl font-medium text-[#005a2d]">{step.title}</h3>
                                        <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <Link
                                    href="/resources/application-guide"
                                    className="inline-flex items-center justify-center rounded-md border border-[#005a2d] bg-transparent px-6 py-3 text-base font-medium text-[#005a2d] shadow-sm hover:bg-[#005a2d]/5 focus:outline-none focus:ring-2 focus:ring-[#005a2d] focus:ring-offset-2 dark:border-[#23b14d] dark:text-[#23b14d] dark:hover:bg-[#23b14d]/5"
                                >
                                    View Detailed Application Guide
                                </Link>
                            </div>
                        </section>

                        {/* Timeline Section */}
                        <section className="mt-16 py-8">
                            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-8 shadow-lg">
                                <div className="text-center mb-10">
                                    <span className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                                        Key Dates
                                    </span>
                                    <h2 className="text-2xl font-bold text-[#005a2d]">Scholarship Timeline</h2>
                                </div>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[#005a2d]/20"></div>

                                    <div className="space-y-12">
                                        {/* Timeline item 1 */}
                                        <div className="relative flex items-center justify-between">
                                            <div className="w-5/12 pr-8 text-right">
                                                <h3 className="text-lg font-medium text-[#005a2d]">Application Period</h3>
                                                <p className="mt-1 text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                                    August 1 - December 15
                                                </p>
                                            </div>

                                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                                <div className="h-10 w-10 rounded-full bg-[#005a2d] text-white flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="w-5/12 pl-8">
                                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Scholarship applications open for the academic year. Different scholarships may have varying deadlines within this period.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timeline item 2 */}
                                        <div className="relative flex items-center justify-between">
                                            <div className="w-5/12 pr-8 text-right">
                                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Applications are reviewed by the scholarship committee. Some scholarships may require interviews during this period.
                                                </p>
                                            </div>

                                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                                <div className="h-10 w-10 rounded-full bg-[#005a2d] text-white flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="w-5/12 pl-8">
                                                <h3 className="text-lg font-medium text-[#005a2d]">Review Process</h3>
                                                <p className="mt-1 text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                                    January 1 - February 28
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timeline item 3 */}
                                        <div className="relative flex items-center justify-between">
                                            <div className="w-5/12 pr-8 text-right">
                                                <h3 className="text-lg font-medium text-[#005a2d]">Award Notifications</h3>
                                                <p className="mt-1 text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                                    March 15 - April 15
                                                </p>
                                            </div>

                                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                                <div className="h-10 w-10 rounded-full bg-[#005a2d] text-white flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="w-5/12 pl-8">
                                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Applicants are notified of scholarship decisions. Recipients must accept awards within the specified timeframe.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timeline item 4 */}
                                        <div className="relative flex items-center justify-between">
                                            <div className="w-5/12 pr-8 text-right">
                                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Scholarship funds are disbursed according to the terms of each scholarship. Recipients may need to submit additional documentation.
                                                </p>
                                            </div>

                                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                                <div className="h-10 w-10 rounded-full bg-[#005a2d] text-white flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="w-5/12 pl-8">
                                                <h3 className="text-lg font-medium text-[#005a2d]">Disbursement</h3>
                                                <p className="mt-1 text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                                    May 1 - June 30
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* CTA Section */}
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
                                        <h2 className="text-3xl font-bold text-white">Ready to Apply?</h2>
                                        <p className="mt-4 text-lg text-white/80">
                                            Create your OSAS Connect account today and start your scholarship application journey. Our platform will match you with opportunities based on your profile.
                                        </p>
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-white">500+ Scholarships</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-white">Simple Applications</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-white">Expert Support</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-1/3 flex justify-center">
                                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl w-full">
                                            <Link
                                                href={route('register')}
                                                className="block w-full rounded-md bg-[#febd12] px-6 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg mb-3"
                                            >
                                                Create Account
                                            </Link>
                                            <Link
                                                href="/resources"
                                                className="block w-full rounded-md border border-white bg-transparent px-6 py-3 text-center font-medium text-white transition-all hover:bg-white/10 hover:shadow-lg"
                                            >
                                                Browse Resources
                                            </Link>
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
