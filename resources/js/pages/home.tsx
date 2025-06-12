import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { ChevronDown, FileText, TrendingUp, Shield, UserCheck, Send } from 'lucide-react';
import { useCMSColors, ColorScheme } from '@/hooks/use-cms-colors';

interface PageContent {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        primary_button: string;
        secondary_button: string;
    };
    features: {
        badge: string;
        title: string;
        subtitle: string;
        items: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    guide: {
        badge: string;
        title: string;
        subtitle: string;
        items: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    cta: {
        title: string;
        description: string;
        button_text: string;
        button_link: string;
    };
}

interface HomeProps {
    pageContent: PageContent;
    cmsTheme?: string | null;
    cmsColorScheme?: ColorScheme | null;
    headerContent?: {
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
        FileText,
        TrendingUp,
        Shield,
        UserCheck,
        Send
    };
    return icons[iconName as keyof typeof icons] || FileText;
};

export default function Home({ pageContent, cmsTheme, cmsColorScheme, headerContent, footerContent }: HomeProps) {
    // Initialize CMS-aware theme and color management
    useCMSColors({ cmsTheme, cmsColorScheme });

    return (
        <>
            <Head title="OSAS Connect - Scholarship Management System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {/* Header Component */}
                <SiteHeader content={headerContent} />

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
                                        <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff" />
                                    </pattern>
                                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                                </svg>
                            </div>

                            <div className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-8 md:flex-row md:items-center md:px-10 lg:px-16">
                                {/* Left column - Text content */}
                                <div className="mb-8 w-full text-center md:mb-0 md:w-1/2 md:pr-8 md:text-left">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        {pageContent?.hero?.badge || 'Welcome'}
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        {pageContent?.hero?.title || 'OSAS Connect'}
                                    </h1>
                                    <p className="mt-6 text-xl text-white/90">
                                        {pageContent?.hero?.subtitle || 'Scholarship Management System'}
                                    </p>
                                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                        <a
                                            href="/login"
                                            className="inline-flex items-center justify-center rounded-lg bg-[#febd12] px-8 py-3 text-lg font-semibold text-[#005a2d] transition-all duration-200 hover:bg-[#febd12]/90 hover:shadow-lg"
                                        >
                                            {pageContent?.hero?.primary_button || 'Get Started'}
                                        </a>
                                        <a
                                            href="/about"
                                            className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                                        >
                                            {pageContent?.hero?.secondary_button || 'Learn More'}
                                        </a>
                                    </div>
                                </div>

                                {/* Right column - Illustration */}
                                <div className="flex w-full justify-center md:w-1/2">
                                    <div className="relative">
                                        <div className="absolute -inset-4 rounded-full bg-white/10 blur-xl"></div>
                                        <img
                                            src="https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg"
                                            alt="Scholarship Application Illustration"
                                            className="relative z-10 h-80 w-80 object-cover rounded-full border-4 border-white/20"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://via.placeholder.com/320x320/005a2d/ffffff?text=OSAS+Connect";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Scroll indicator */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                <div className="animate-bounce rounded-full bg-white/20 p-2">
                                    <ChevronDown className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Features Section with better visual hierarchy */}
                        <section className="mt-16 py-8 sm:mt-24 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    {pageContent?.features?.badge || 'Features'}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#005a2d]">{pageContent?.features?.title || 'Platform Features'}</h2>
                                <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 px-4">
                                    {pageContent?.features?.subtitle || 'Discover our comprehensive scholarship management platform.'}
                                </p>
                            </div>

                            <div className="mt-8 grid gap-6 px-4 sm:mt-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                {pageContent?.features?.items?.map((feature, index) => {
                                    const IconComponent = getIcon(feature.icon);
                                    return (
                                        <div key={index} className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-b-4 border-[#23b14d]">
                                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                                <IconComponent className="h-8 w-8 text-[#23b14d]" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-semibold text-[#005a2d]">{feature.title}</h3>
                                            <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                {feature.description}
                                            </p>
                                        </div>
                                    );
                                }) || []}
                            </div>
                        </section>

                        {/* Resource Guide Section */}
                        <section className="py-8 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                                    {pageContent?.guide?.badge || 'Guide'}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#005a2d] px-4">{pageContent?.guide?.title || 'How It Works'}</h2>
                                <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 px-4">
                                    {pageContent?.guide?.subtitle || 'Follow these simple steps to get started.'}
                                </p>
                            </div>

                            <div className="grid gap-6 px-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                {pageContent?.guide?.items?.map((item, index) => {
                                    const IconComponent = getIcon(item.icon);
                                    return (
                                        <div key={index} className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px] dark:bg-[#1a1a1a] border-l-4 border-[#febd12]">
                                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10">
                                                <IconComponent className="h-8 w-8 text-[#febd12]" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-semibold text-[#005a2d]">{item.title}</h3>
                                            <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                {item.description}
                                            </p>
                                        </div>
                                    );
                                }) || []}
                            </div>
                        </section>

                        {/* Enhanced CTA Section with two-column layout */}
                        <section className="mt-16 mb-8">
                            <div className="rounded-2xl bg-gradient-to-r from-[#005a2d] to-[#008040] p-8 shadow-xl overflow-hidden relative">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                        <pattern id="pattern-circles-cta" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                            <circle id="pattern-circle-cta" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                                        </pattern>
                                        <rect id="rect-cta" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
                                    </svg>
                                </div>

                                <div className="flex flex-col md:flex-row items-center relative z-10">
                                    <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                                        <h2 className="text-3xl sm:text-4xl font-bold text-white">{pageContent?.cta?.title || 'Ready to Get Started?'}</h2>
                                        <p className="mt-4 text-lg text-white/90">
                                            {pageContent?.cta?.description || 'Join thousands of students managing their scholarships with ease.'}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a
                                            href={pageContent?.cta?.button_link || '/login'}
                                            className="inline-flex items-center justify-center rounded-lg bg-[#febd12] px-8 py-3 text-lg font-semibold text-[#005a2d] transition-all duration-200 hover:bg-[#febd12]/90 hover:shadow-lg"
                                        >
                                            {pageContent?.cta?.button_text || 'Start Now'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer Component */}
                <SiteFooter content={footerContent} />
            </div>
        </>
    );
}
