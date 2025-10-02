import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';

const pageContent = {
    hero: {
        badge: 'Contact Us',
        title: 'Get in Touch',
        subtitle: 'Have questions about scholarships or the application process? Our team is here to help you succeed.',
    },
    info: {
        badge: 'How to Reach Us',
        title: "We're Here to Help",
        subtitle: 'Choose the best way to contact us based on your needs and preferences.',
    },
    contacts: [
        {
            type: 'email',
            icon: 'Mail',
            title: 'Email Us',
            description: 'For general inquiries and scholarship questions',
            value: 'minsubcscholarship.edu.ph@gmail.com',
            link: 'mailto:minsubcscholarship.edu.ph@gmail.com',
        },
        {
            type: 'address',
            icon: 'MapPin',
            title: 'Visit Us',
            description: 'Office of Student Affairs and Services',
            value: 'Mindoro State University - Bongabong Campus\nBongabong, Oriental Mindoro',
        },
        {
            type: 'hours',
            icon: 'Clock',
            title: 'Office Hours',
            description: "We're available during regular business hours",
            value: 'Monday - Friday\n8:00 AM - 5:00 PM\n(Lunch break: 12:00 PM - 1:00 PM)',
        },
        {
            type: 'support',
            icon: 'MessageCircle',
            title: 'Quick Support',
            description: 'Need immediate help?',
            value: 'Use our live chat or submit a support ticket through your dashboard.',
        },
    ],
    cta: {
        title: 'Ready to Get Started?',
        description: 'Join thousands of students who have found their path to academic success through OSAS Connect.',
    },
};

const getIcon = (iconName: string) => {
    const icons = {
        Mail,
        MapPin,
        Clock,
        MessageCircle,
    };
    return icons[iconName as keyof typeof icons] || Mail;
};

export default function Contact() {
    return (
        <>
            <Head title="Contact Us">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {' '}
                {/* Header Component */}
                <SiteHeader />
                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Hero Section */}
                        <div className="relative flex min-h-[60vh] items-center overflow-hidden">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    }}
                                ></div>
                            </div>

                            <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                                <div className="space-y-8 text-center">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#febd12]/20 px-4 py-2 dark:bg-[#febd12]/30">
                                        <span className="text-sm font-medium text-[#010002] dark:text-[#febd12]">{pageContent.hero.badge}</span>
                                    </div>

                                    <h1 className="text-4xl leading-tight font-bold text-[#010002] sm:text-6xl lg:text-7xl dark:text-white">
                                        {pageContent.hero.title}
                                    </h1>

                                    <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                        {pageContent.hero.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Cards Section */}
                        <section className="mt-16 py-16">
                            <div className="mb-12 text-center">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#23b14d]/20 px-4 py-2 dark:bg-[#23b14d]/30">
                                    <span className="text-sm font-medium text-[#23b14d]">{pageContent.info.badge}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-[#010002] dark:text-white">{pageContent.info.title}</h2>
                                <p className="mx-auto mt-4 max-w-2xl text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">{pageContent.info.subtitle}</p>
                            </div>

                            {/* Contact Cards Grid */}
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {pageContent.contacts.map((contact, index) => {
                                    const IconComponent = getIcon(contact.icon);
                                    const ContactValue = ({ contact }: { contact: (typeof pageContent.contacts)[0] }) => {
                                        if (contact.link) {
                                            return (
                                                <a
                                                    href={contact.link}
                                                    className="inline-flex items-center text-base break-all text-[#23b14d] transition-colors duration-200 hover:text-[#1a8f3c]"
                                                >
                                                    {contact.value}
                                                </a>
                                            );
                                        }

                                        if (contact.type === 'hours' || contact.type === 'address') {
                                            return (
                                                <div className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    {contact.value.split('\n').map((line: string, i: number) => (
                                                        <div key={i}>{line}</div>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        return <p className="text-base leading-relaxed text-[#010002]/80 dark:text-[#f3f2f2]/80">{contact.value}</p>;
                                    };

                                    return (
                                        <div key={index} className="group rounded-lg border border-[#010002]/10 p-8 dark:border-[#f3f2f2]/10">
                                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#23b14d]/10">
                                                <IconComponent className="h-6 w-6 text-[#23b14d]" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-semibold text-[#010002] dark:text-white">{contact.title}</h3>
                                            <p className="mb-4 text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">{contact.description}</p>
                                            <ContactValue contact={contact} />
                                        </div>
                                    );
                                })}
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
