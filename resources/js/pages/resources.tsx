import { Head, Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function Resources() {
    const resourceCategories = [
        {
            title: "Application Guides",
            description: "Step-by-step instructions for scholarship applications",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            link: "/resources/guides",
        },
        {
            title: "Document Templates",
            description: "Ready-to-use templates for required documents",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            link: "/resources/templates",
        },
        {
            title: "Video Tutorials",
            description: "Visual walkthroughs of the application process",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            link: "/resources/videos",
        },
        {
            title: "Financial Calculators",
            description: "Tools to help budget your education expenses",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            link: "/resources/calculators",
        },
    ];

    const featuredResources = [
        {
            title: "Complete Scholarship Application Checklist",
            description: "Ensure your application is complete with this comprehensive checklist covering all required documents and submission guidelines.",
            image: "https://placehold.co/300x200/005a2d/FFFFFF?text=Checklist",
            tag: "Guide",
            link: "#",
        },
        {
            title: "Personal Statement Writing Guide",
            description: "Learn how to craft a compelling personal statement that highlights your achievements, goals, and why you deserve the scholarship.",
            image: "https://placehold.co/300x200/005a2d/FFFFFF?text=Writing+Guide",
            tag: "Template",
            link: "#",
        },
        {
            title: "Scholarship Interview Preparation",
            description: "Prepare for your scholarship interview with these tips, common questions, and strategies to make a lasting impression.",
            image: "https://placehold.co/300x200/005a2d/FFFFFF?text=Interview+Prep",
            tag: "Guide",
            link: "#",
        },
    ];

    const downloadableResources = [
        {
            title: "Personal Statement Template",
            description: "A structured template with prompts to help you write a compelling personal statement.",
            fileType: "DOC",
            fileSize: "285 KB",
        },
        {
            title: "Budget Planning Worksheet",
            description: "Calculate your educational expenses and create a financial plan.",
            fileType: "XLS",
            fileSize: "420 KB",
        },
        {
            title: "Recommendation Letter Request Guide",
            description: "Tips and email templates for requesting recommendation letters from professors.",
            fileType: "PDF",
            fileSize: "310 KB",
        },
        {
            title: "Scholarship Application Timeline",
            description: "A monthly planner to keep track of scholarship application deadlines.",
            fileType: "PDF",
            fileSize: "275 KB",
        },
        {
            title: "Resume Template for Students",
            description: "Academic resume template specifically designed for scholarship applications.",
            fileType: "DOC",
            fileSize: "345 KB",
        },
        {
            title: "Interview Questions Preparation",
            description: "Common scholarship interview questions with tips for effective answers.",
            fileType: "PDF",
            fileSize: "380 KB",
        },
    ];

    const externalResources = [
        {
            title: "Department of Education",
            description: "Official information on national scholarship programs and educational grants.",
            url: "https://www.deped.gov.ph/",
        },
        {
            title: "Commission on Higher Education",
            description: "Resources on scholarships for higher education and university programs.",
            url: "https://ched.gov.ph/",
        },
        {
            title: "Philippine Association of Student Financial Aid Administrators",
            description: "Network of financial aid professionals helping students fund their education.",
            url: "#",
        },
        {
            title: "Scholarship Search Engines",
            description: "External databases with thousands of scholarship opportunities.",
            url: "#",
        },
    ];

    return (
        <>
            <Head title="Resources - OSAS Connect">
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
                                        Scholarship Support
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Scholarship Resources
                                    </h1>
                                    <p className="mt-6 text-xl text-white/90">
                                        Access guides, templates, and tools to help you prepare competitive scholarship applications and maximize your chances of success.
                                    </p>

                                    <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <a
                                            href="#featured"
                                            className="rounded-md bg-[#febd12] px-8 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                        >
                                            Featured Resources
                                        </a>
                                        <a
                                            href="#downloads"
                                            className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-center font-medium text-white transition-all hover:bg-white hover:text-[#005a2d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                        >
                                            Downloadable Materials
                                        </a>
                                    </div>
                                </div>

                                {/* Right column - Image */}
                                <div className="flex md:w-1/2 md:justify-end">
                                    <div className="relative h-[220px] w-[300px] md:h-[300px] md:w-[400px]">
                                        <div className="absolute right-0 top-5 h-5/6 w-5/6 rounded-3xl bg-[#febd12]/30"></div>
                                        <div className="absolute left-0 top-0 h-5/6 w-5/6 rounded-3xl bg-white/10 backdrop-blur-sm"></div>
                                        <img
                                            src="https://img.freepik.com/free-photo/opened-book-with-glasses_1150-54.jpg?size=626&ext=jpg&ga=GA1.1.356696801.1743149314&semt=ais_hybrid"
                                            alt="Scholarship resources"
                                            className="absolute left-10 top-10 h-5/6 w-5/6 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/400x300/005a2d/FFFFFF?text=Resources";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resource Categories Section */}
                        <section className="mt-24 py-8">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Resource Categories
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Find What You Need</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Browse our collection of resources organized by category to help with your scholarship journey
                                </p>
                            </div>

                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {resourceCategories.map((category, index) => (
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

                        {/* Featured Resources Section */}
                        <section id="featured" className="mt-16 py-16 px-4 relative scroll-mt-20">
                            <div className="absolute inset-0 bg-[#005a2d]/5 rounded-3xl"></div>
                            <div className="relative rounded-lg p-8">
                                <div className="text-center mb-12">
                                    <span className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                        Must-Read Materials
                                    </span>
                                    <h2 className="text-3xl font-bold text-[#005a2d]">Featured Resources</h2>
                                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                        Our most popular and helpful resources for scholarship applicants
                                    </p>
                                </div>

                                <div className="grid gap-8 md:grid-cols-3">
                                    {featuredResources.map((resource, index) => (
                                        <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={resource.image}
                                                    alt={resource.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-[#23b14d]/10 text-[#23b14d]">
                                                    {resource.tag}
                                                </div>
                                                <h3 className="text-xl font-medium text-[#005a2d] mb-3">{resource.title}</h3>
                                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4 line-clamp-3">
                                                    {resource.description}
                                                </p>
                                                <a
                                                    href={resource.link}
                                                    className="inline-flex items-center text-[#23b14d] hover:underline"
                                                >
                                                    Read more
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Downloadable Resources Section */}
                        <section id="downloads" className="mt-16 py-8 scroll-mt-20">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Ready-to-Use
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Downloadable Materials</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Templates, forms, and documents to help with your scholarship applications
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {downloadableResources.map((resource, index) => (
                                    <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-6 shadow-md border-l-4 border-[#005a2d] hover:shadow-lg transition-shadow">
                                        <div className="flex items-start">
                                            <div className="mr-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#005a2d]/10">
                                                    {resource.fileType === "PDF" ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#e2574c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    ) : resource.fileType === "DOC" ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4a86e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#45b058]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-[#005a2d] mb-1">{resource.title}</h3>
                                                <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70 mb-3">{resource.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-[#010002]/50 dark:text-[#f3f2f2]/50">{resource.fileSize} • {resource.fileType}</span>
                                                    <button className="inline-flex items-center text-[#23b14d] text-sm hover:underline">
                                                        Download
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* External Resources Section */}
                        <section className="mt-16 py-8">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                    Additional Support
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">External Resources</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Official websites and platforms with valuable scholarship information
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {externalResources.map((resource, index) => (
                                    <a
                                        key={index}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white dark:bg-[#1a1a1a] rounded-lg p-6 shadow-md hover:shadow-lg transition-all flex items-center group"
                                    >
                                        <div className="mr-5 flex-shrink-0">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#febd12]/10 text-[#febd12] group-hover:bg-[#febd12] group-hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-[#005a2d] mb-1 group-hover:text-[#23b14d] transition-colors">{resource.title}</h3>
                                            <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">{resource.description}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Request Custom Resource CTA */}
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
                                        <h2 className="text-3xl font-bold text-white">Can't Find What You Need?</h2>
                                        <p className="mt-4 text-lg text-white/80">
                                            If you're looking for specific resources that aren't listed here, our team can help create customized materials for your scholarship application needs.
                                        </p>
                                    </div>
                                    <div className="md:w-1/3 flex justify-center">
                                        <Link
                                            href="/contact"
                                            className="block w-full rounded-md bg-[#febd12] px-6 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg"
                                        >
                                            Request Custom Resources
                                        </Link>
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
