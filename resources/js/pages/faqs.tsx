import { Head, Link } from '@inertiajs/react';
import { } from '@inertiajs/react';
import { useState, JSX } from 'react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

interface FaqItem {
    question: string;
    answer: string | JSX.Element;
}

interface FaqCategory {
    title: string;
    description: string;
    icon: JSX.Element;
    faqs: FaqItem[];
}

export default function FAQs() {
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

    const toggleItem = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isOpen = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        return !!openItems[key];
    };

    const faqCategories: FaqCategory[] = [
        {
            title: "General Questions",
            description: "Basic information about OSAS Connect and our scholarship programs",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            faqs: [
                {
                    question: "What is OSAS Connect?",
                    answer: "OSAS Connect is a scholarship management system designed to help students find, apply for, and track educational funding opportunities. It streamlines the entire scholarship application process, from discovery to award notification."
                },
                {
                    question: "Is OSAS Connect free to use?",
                    answer: "Yes, OSAS Connect is completely free for all students. There are no hidden fees for creating an account, applying for scholarships, or accessing our resources."
                },
                {
                    question: "Who is eligible to use OSAS Connect?",
                    answer: "OSAS Connect is available to all current and prospective students. Scholarship eligibility varies by program, but our platform will help you find opportunities that match your specific qualifications."
                },
                {
                    question: "How do I create an account?",
                    answer: (
                        <div>
                            <p>To create an account on OSAS Connect:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Click the "Register" button in the top-right corner of the page</li>
                                <li>Fill out the registration form with your personal information</li>
                                <li>Verify your email address through the link sent to your inbox</li>
                                <li>Complete your profile to improve scholarship matching</li>
                            </ol>
                        </div>
                    )
                }
            ]
        },
        {
            title: "Scholarship Applications",
            description: "Information about finding and applying for scholarships",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            faqs: [
                {
                    question: "How do I find scholarships that match my profile?",
                    answer: "Once you've created an account and completed your profile, OSAS Connect will automatically match you with relevant scholarships based on your academic achievements, field of study, demographic information, and other factors. You can also use our search filters to find specific opportunities."
                },
                {
                    question: "What documents do I need to apply for scholarships?",
                    answer: (
                        <div>
                            <p>Common documents required for scholarship applications include:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Academic transcripts</li>
                                <li>Proof of enrollment or acceptance letter</li>
                                <li>Personal statement or essay</li>
                                <li>Letters of recommendation</li>
                                <li>Financial information (for need-based scholarships)</li>
                                <li>Identification documents</li>
                            </ul>
                            <p className="mt-2">Specific requirements vary by scholarship program.</p>
                        </div>
                    )
                },
                {
                    question: "Can I apply for multiple scholarships?",
                    answer: "Yes, you can apply for as many scholarships as you qualify for. In fact, we encourage students to apply for multiple opportunities to increase their chances of receiving funding."
                },
                {
                    question: "How can I track my scholarship applications?",
                    answer: "After submitting your applications through OSAS Connect, you can track their status through your dashboard. You'll receive notifications when there are updates to your applications, such as when additional information is requested or when decisions are made."
                },
                {
                    question: "Is there a deadline to apply for scholarships?",
                    answer: "Each scholarship has its own deadline. You can find this information in the scholarship details page. We recommend setting up notifications for upcoming deadlines and applying well in advance to ensure your application is completed on time."
                }
            ]
        },
        {
            title: "Technical Support",
            description: "Help with using the OSAS Connect platform",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            faqs: [
                {
                    question: "I forgot my password. How do I reset it?",
                    answer: (
                        <div>
                            <p>To reset your password:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Click the "Log in" button</li>
                                <li>Click on the "Forgot password?" link</li>
                                <li>Enter the email address associated with your account</li>
                                <li>Check your email for a password reset link</li>
                                <li>Follow the link to create a new password</li>
                            </ol>
                        </div>
                    )
                },
                {
                    question: "How do I update my profile information?",
                    answer: "After logging in, go to your dashboard and click on the 'Profile' section. Here, you can update your personal information, academic details, and other profile data. Keeping your profile updated ensures that you'll be matched with the most relevant scholarship opportunities."
                },
                {
                    question: "The system isn't working properly. What should I do?",
                    answer: "If you encounter technical issues while using OSAS Connect, try clearing your browser cache and cookies, then reload the page. If the problem persists, please contact our technical support team at support@osas-connect.edu with details about the issue, including screenshots if possible."
                },
                {
                    question: "How do I upload documents to my application?",
                    answer: "When completing a scholarship application that requires document uploads, you'll see an upload button or area within the application form. Click on this button to browse your files and select the document you wish to upload. We accept PDF, JPG, and PNG formats. Each file must be less than 5MB in size."
                }
            ]
        },
        {
            title: "Post-Application",
            description: "What happens after you apply for scholarships",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            faqs: [
                {
                    question: "How will I be notified if I receive a scholarship?",
                    answer: "You'll receive notifications through the OSAS Connect platform as well as via email when there are updates to your scholarship applications. If you're selected to receive a scholarship, you'll be notified through these channels and provided with instructions on next steps."
                },
                {
                    question: "What should I do if I'm selected for a scholarship?",
                    answer: "If you're selected for a scholarship, follow the instructions provided in the award notification. This typically involves accepting the scholarship offer, providing any additional requested information, and following specific disbursement procedures. All of this can be managed through your OSAS Connect dashboard."
                },
                {
                    question: "How is scholarship money disbursed?",
                    answer: "Scholarship disbursement methods vary by program. Some scholarships are paid directly to your educational institution to cover tuition and fees, while others may be paid directly to you. The disbursement schedule and method will be explained in your award notification."
                },
                {
                    question: "What if I need to defer my scholarship?",
                    answer: "If you need to defer your scholarship due to unforeseen circumstances, contact the scholarship provider as soon as possible. Many scholarships have policies regarding deferrals, and it's important to understand these policies before making any decisions. You can reach out to the contact person listed in your scholarship details on OSAS Connect."
                }
            ]
        }
    ];

    return (
        <>
            <Head title="Frequently Asked Questions - OSAS Connect">
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

                            <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
                                <div className="text-center">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Help Center
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Frequently Asked Questions
                                    </h1>
                                    <p className="mt-6 max-w-2xl text-xl text-white/90">
                                        Find answers to common questions about scholarships and using the OSAS Connect platform
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar Section */}
                        <section className="mt-8 py-4">
                            <div className="relative max-w-2xl mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-[#010002]/50 dark:text-[#f3f2f2]/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-[#010002] placeholder-[#010002]/50 shadow-sm focus:border-[#23b14d] focus:outline-none focus:ring-1 focus:ring-[#23b14d] dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-[#f3f2f2] dark:placeholder-[#f3f2f2]/50"
                                    placeholder="Search frequently asked questions..."
                                    aria-label="Search frequently asked questions"
                                />
                            </div>
                        </section>

                        {/* Categories Section */}
                        <section className="mt-8 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {faqCategories.map((category, index) => (
                                    <a
                                        key={index}
                                        href={`#category-${index}`}
                                        className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-b-4 border-[#23b14d]"
                                    >
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#febd12]/10 mb-4">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-lg font-medium text-[#005a2d] mb-2">{category.title}</h3>
                                        <p className="text-[#010002]/70 dark:text-[#f3f2f2]/70 text-sm">{category.description}</p>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Accordion Sections */}
                        {faqCategories.map((category, categoryIndex) => (
                            <section
                                id={`category-${categoryIndex}`}
                                key={categoryIndex}
                                className="mt-16 py-8 scroll-mt-20"
                            >
                                <div className="text-center mb-12">
                                    <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                        {category.title}
                                    </span>
                                    <h2 className="text-3xl font-bold text-[#005a2d]">{category.title}</h2>
                                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="max-w-3xl mx-auto">
                                    {category.faqs.map((faq, faqIndex) => (
                                        <div
                                            key={faqIndex}
                                            className="mb-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1a1a1a]"
                                        >
                                            <button
                                                className="flex w-full items-center justify-between rounded-t-lg px-6 py-4 text-left font-medium text-[#005a2d] hover:bg-gray-50 dark:hover:bg-[#242424]"
                                                onClick={() => toggleItem(categoryIndex, faqIndex)}
                                                aria-expanded={isOpen(categoryIndex, faqIndex)}
                                                aria-controls={`faq-${categoryIndex}-${faqIndex}-content`}
                                            >
                                                <span className="text-lg">{faq.question}</span>
                                                <svg
                                                    className={`h-5 w-5 transform transition-transform ${isOpen(categoryIndex, faqIndex) ? 'rotate-180' : ''}`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div
                                                id={`faq-${categoryIndex}-${faqIndex}-content`}
                                                className={`px-6 pb-4 ${isOpen(categoryIndex, faqIndex) ? 'block' : 'hidden'}`}
                                            >
                                                <div className="text-[#010002]/80 dark:text-[#f3f2f2]/80 pt-2">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* Can't Find Answer Section */}
                        <section className="mt-16 py-8 bg-[#005a2d]/5 rounded-2xl">
                            <div className="text-center mb-8">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                    Need More Help?
                                </span>
                                <h2 className="text-2xl font-bold text-[#005a2d]">Can't Find What You're Looking For?</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    If you couldn't find the answer you need, our support team is ready to help
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md bg-[#23b14d] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#1a9940] focus:outline-none focus:ring-2 focus:ring-[#23b14d] focus:ring-offset-2"
                                >
                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Support
                                </Link>
                                <a
                                    href="tel:+1-234-567-8900"
                                    className="inline-flex items-center justify-center rounded-md bg-white border border-gray-300 px-6 py-3 text-base font-medium text-[#010002] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#23b14d] focus:ring-offset-2 dark:bg-[#1a1a1a] dark:border-gray-600 dark:text-[#f3f2f2] dark:hover:bg-[#242424]"
                                >
                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Call Helpline
                                </a>
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
                                        <h2 className="text-3xl font-bold text-white">Ready to Find Your Scholarship?</h2>
                                        <p className="mt-4 text-lg text-white/80">
                                            Now that you've got answers to your questions, it's time to start your scholarship journey.
                                            Create an account today and explore hundreds of opportunities.
                                        </p>
                                    </div>
                                    <div className="md:w-1/3 flex justify-center">
                                        <Link
                                            href={route('register')}
                                            className="block w-full rounded-md bg-[#febd12] px-6 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg"
                                        >
                                            Start Your Application
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
