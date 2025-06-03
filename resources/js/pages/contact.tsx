import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useCMSColors, ColorScheme } from '@/hooks/use-cms-colors';

interface Contact {
    type: string;
    icon: string;
    title: string;
    description: string;
    value: string;
    link?: string;
}

interface PageContent {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
    };
    info: {
        badge: string;
        title: string;
        subtitle: string;
    };
    contacts: Contact[];
    cta: {
        title: string;
        description: string;
    };
}

interface ContactProps {
    pageContent: PageContent;
    cmsTheme?: string | null;
    cmsColorScheme?: ColorScheme | null;    headerContent?: {
        logo_text?: string;
        tagline?: string;
        navigation?: Array<{
            label: string;
            url: string;
            active: boolean;
            children?: Array<{ label: string; url: string }>;
        }>;
    };
    footerContent?: {
        cta?: {
            title?: string;
            description?: string;
            button_text?: string;
            button_url?: string;
        };
        about?: {
            title?: string;
            description?: string;
        };
        contact?: {
            address?: string;
            email?: string;
            viber?: string;
            hours?: string;
        };
        social_links?: Array<{
            platform: string;
            url: string;
        }>;
    };
}

const getIcon = (iconName: string) => {
    const icons = {
        Mail,
        MapPin,
        Clock,
        MessageCircle
    };
    return icons[iconName as keyof typeof icons] || Mail;
};

export default function Contact({ pageContent, cmsTheme, cmsColorScheme, headerContent, footerContent }: ContactProps) {
    // Initialize CMS-aware theme and color management
    useCMSColors({ cmsTheme, cmsColorScheme });

    return (
        <>
            <Head title="Contact Us">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">                {/* Header Component */}
                <SiteHeader content={headerContent} />

                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section */}
                        <div className="relative mb-12 overflow-hidden rounded-xl shadow-lg">
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#005a2d]/95 to-[#008040]/90"></div>

                            {/* Background pattern/texture */}
                            <div className="absolute inset-0 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                    <pattern id="pattern-circles" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                        <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff" />
                                    </pattern>
                                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                                </svg>
                            </div>
                            <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
                                <div className="text-center">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        {pageContent.hero.badge}
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        {pageContent.hero.title}
                                    </h1>
                                    <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
                                        {pageContent.hero.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Cards Section */}
                        <section className="mt-16 py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    {pageContent.info.badge}
                                </div>
                                <h2 className="text-3xl font-bold text-[#005a2d]">{pageContent.info.title}</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    {pageContent.info.subtitle}
                                </p>
                            </div>

                            {/* Contact Cards Grid */}
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {pageContent.contacts.map((contact, index) => {
                                    const IconComponent = getIcon(contact.icon);
                                    const ContactValue = ({ contact }: { contact: Contact }) => {
                                        if (contact.link) {
                                            return (
                                                <a 
                                                    href={contact.link}
                                                    className="inline-flex items-center text-base text-[#23b14d] hover:text-[#1a8f3c] hover:underline transition-colors duration-200 break-all"
                                                >
                                                    {contact.value}
                                                </a>
                                            );
                                        }
                                        
                                        if (contact.type === 'hours' || contact.type === 'address') {
                                            return (
                                                <div className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    {contact.value.split('\n').map((line, i) => (
                                                        <div key={i}>{line}</div>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        return (
                                            <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80 leading-relaxed">
                                                {contact.value}
                                            </p>
                                        );
                                    };

                                    return (
                                        <div key={index} className="group rounded-xl bg-white p-8 shadow-md transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10 group-hover:bg-[#23b14d]/20 transition-colors duration-200">
                                                <IconComponent className="h-8 w-8 text-[#23b14d]" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-semibold text-[#005a2d]">{contact.title}</h3>
                                            <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-4">
                                                {contact.description}
                                            </p>
                                            <ContactValue contact={contact} />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Additional Help Section */}
                        <section className="py-16 mb-8">
                            <div className="rounded-2xl bg-gradient-to-r from-[#005a2d] to-[#008040] p-8 sm:p-12 shadow-xl overflow-hidden relative">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                        <pattern id="pattern-circles-cta" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                            <circle id="pattern-circle-cta" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                                        </pattern>
                                        <rect id="rect-cta" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
                                    </svg>
                                </div>

                                <div className="relative z-10 text-center">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{pageContent.cta.title}</h2>
                                    <p className="mt-4 mx-auto max-w-2xl text-lg text-white/90">
                                        {pageContent.cta.description}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>                {/* Footer Component */}
                <SiteFooter content={footerContent} />
            </div>
        </>
    );
}
