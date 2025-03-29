import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
        // Reset form after submission
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setFormSubmitted(false), 5000);
    };

    return (
        <>
            <Head title="Contact Us - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {/* Header Component */}
                <SiteHeader />

                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section for Contact Page */}
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
                                        Get in Touch
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Contact Us
                                    </h1>
                                    <p className="mt-6 max-w-2xl text-xl text-white/90">
                                        Have questions about scholarships or the application process? Our team is here to help you succeed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Grid */}
                        <section className="mt-16 py-8">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Reach Out
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">How to Connect With Us</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Multiple ways to get in touch with our scholarship support team
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {/* Contact Card 1 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Email Us</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">For general inquiries and scholarship questions:</p>
                                    <a href="mailto:osas@example.edu" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        osas@example.edu
                                    </a>
                                    <p className="mt-4 text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-2">For technical support:</p>
                                    <a href="mailto:support@osas-connect.edu" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        support@osas-connect.edu
                                    </a>
                                </div>

                                {/* Contact Card 2 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Call Us</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">Office of Student Affairs and Services:</p>
                                    <a href="tel:+1-234-567-8900" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        (234) 567-8900
                                    </a>
                                    <p className="mt-4 text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-2">Scholarship Hotline:</p>
                                    <a href="tel:+1-234-567-8901" className="inline-flex items-center text-[#23b14d] hover:underline">
                                        (234) 567-8901
                                    </a>
                                </div>

                                {/* Contact Card 3 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#23b14d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Visit Us</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">Office of Student Affairs and Services:</p>
                                    <address className="not-italic text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        Room 101, Student Services Building<br />
                                        University Campus<br />
                                        1234 Education Street<br />
                                        Manila, Philippines
                                    </address>
                                    <p className="mt-4 text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        <span className="font-medium">Office Hours:</span><br />
                                        Monday-Friday: 8:00 AM - 5:00 PM
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact Form Section */}
                        <section className="mt-16 py-8">
                            <div className="rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden">
                                <div className="grid md:grid-cols-2">
                                    {/* Left side - Form */}
                                    <div className="p-8 lg:p-12">
                                        <h2 className="text-2xl font-bold text-[#005a2d]">Send Us a Message</h2>
                                        <p className="mt-3 text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                            Fill out the form below and we'll get back to you as soon as possible.
                                        </p>

                                        {formSubmitted && (
                                            <div className="mt-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                            Thank you for your message! We'll respond shortly.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="mt-6">
                                            <div className="mb-4">
                                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Your Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm shadow-sm focus:border-[#23b14d] focus:ring-[#23b14d] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                                                    placeholder="Juan Dela Cruz"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm shadow-sm focus:border-[#23b14d] focus:ring-[#23b14d] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Subject
                                                </label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm shadow-sm focus:border-[#23b14d] focus:ring-[#23b14d] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                                                    required
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="Scholarship Inquiry">Scholarship Inquiry</option>
                                                    <option value="Application Help">Application Help</option>
                                                    <option value="Technical Support">Technical Support</option>
                                                    <option value="General Question">General Question</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    Your Message
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    rows={5}
                                                    className="w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm shadow-sm focus:border-[#23b14d] focus:ring-[#23b14d] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                                                    placeholder="How can we help you?"
                                                    required
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                className="mt-2 w-full rounded-md bg-[#23b14d] px-5 py-3 text-center font-medium text-white shadow-md transition-all hover:bg-[#1a9940] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#23b14d] focus:ring-offset-2"
                                            >
                                                Send Message
                                            </button>
                                        </form>
                                    </div>

                                    {/* Right side - Map and info */}
                                    <div className="bg-gradient-to-r from-[#005a2d] to-[#008040] p-8 lg:p-12 text-white">
                                        <h2 className="text-2xl font-bold text-white">Our Locations</h2>
                                        <p className="mt-3 text-white/90">
                                            Visit our offices for in-person assistance with your scholarship applications.
                                        </p>

                                        <div className="mt-8 h-64 rounded-lg overflow-hidden">
                                            {/* Replace with an actual map component or image */}
                                            <div className="h-full w-full bg-[#004020] flex items-center justify-center">
                                                <img
                                                    src="https://placehold.co/600x400/004020/febd12?text=Campus+Map"
                                                    alt="Campus Map"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-lg font-medium text-[#febd12]">Office Locations</h3>

                                            <div className="mt-3 space-y-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium">Main Campus</p>
                                                        <p className="mt-1 text-sm">Student Services Building, Room 101</p>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#febd12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium">North Campus</p>
                                                        <p className="mt-1 text-sm">Administration Building, 2nd Floor</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-lg font-medium text-[#febd12]">Scholarship Help Desk Hours</h3>
                                            <div className="mt-3 space-y-2 text-sm">
                                                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                                                <p>Saturday: 9:00 AM - 12:00 PM (By appointment only)</p>
                                                <p>Sunday: Closed</p>
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
                                        <h2 className="text-3xl font-bold text-white">Still have questions?</h2>
                                        <p className="mt-4 text-lg text-white/80">
                                            Our team is ready to provide personalized assistance with your scholarship needs.
                                            Don't hesitate to reach out through any of our contact channels.
                                        </p>
                                        <div className="mt-4">
                                            <Link
                                                href="/faq"
                                                className="text-[#febd12] hover:underline flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Check our FAQ page for common questions
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="md:w-1/3 flex justify-center">
                                        <a
                                            href="tel:+1-234-567-8900"
                                            className="block w-full rounded-md bg-[#febd12] px-6 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f5b400] hover:shadow-lg"
                                        >
                                            Call Us Now
                                        </a>
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
