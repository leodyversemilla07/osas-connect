import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, Shield, UserCheck, Send } from 'lucide-react';

const pageContent = {
    hero: {
        badge: 'Scholarship Management',
        title: 'Your Gateway to Educational Excellence',
        subtitle: 'OSAS Connect streamlines the scholarship application process, making educational opportunities accessible to all students.',
        primary_button: 'Apply for Scholarships',
        secondary_button: 'Learn More',
    },
    features: {
        badge: 'Why Choose OSAS Connect',
        title: 'Everything You Need',
        subtitle: 'Comprehensive tools for scholarship management',
        items: [
            {
                icon: 'FileText',
                title: 'Easy Applications',
                description: 'Streamlined application process with digital document submission.',
            },
            {
                icon: 'TrendingUp',
                title: 'Track Progress',
                description: 'Real-time updates on your application status and progress.',
            },
            {
                icon: 'Shield',
                title: 'Secure & Reliable',
                description: 'Your data is protected with enterprise-grade security.',
            },
        ],
    },
    guide: {
        badge: 'How It Works',
        title: 'Simple Steps to Success',
        subtitle: 'Get started with your scholarship journey',
        items: [
            {
                icon: 'UserCheck',
                title: 'Create Account',
                description: 'Register with your student credentials',
            },
            {
                icon: 'FileText',
                title: 'Browse Scholarships',
                description: 'Explore available opportunities',
            },
            {
                icon: 'Send',
                title: 'Apply & Track',
                description: 'Submit applications and monitor progress',
            },
        ],
    },
    cta: {
        title: 'Ready to Apply?',
        description: 'Start your scholarship journey today and unlock opportunities for your academic future.',
        button_text: 'Get Started Now',
        button_link: '/login',
    },
};

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

export default function Home() {
    // All content is now hardcoded in pageContent above
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
                <main className="mt-16 w-full flex-1">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Hero Section - Above the Fold */}
                        <div className="relative overflow-hidden min-h-[80vh] flex items-center">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }}></div>
                            </div>

                            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                                <div className="text-center space-y-8">
                                    <div className="inline-flex items-center gap-2 bg-[#febd12]/20 dark:bg-[#febd12]/30 px-4 py-2 rounded-full">
                                        <span className="text-sm font-medium text-[#010002] dark:text-[#febd12]">Scholarship Management Made Simple</span>
                                    </div>

                                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#010002] dark:text-white leading-tight">
                                        Empowering
                                        <br />
                                        <span className="text-[#008040] dark:text-[#23b14d]">
                                            Future Leaders
                                        </span>
                                    </h1>

                                    <p className="text-xl text-[#010002]/70 dark:text-[#f3f2f2]/70 max-w-3xl mx-auto leading-relaxed">
                                        OSAS Connect transforms the scholarship application process into a seamless,
                                        transparent experience that connects deserving students with life-changing opportunities.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                        <Button asChild size="lg" className="bg-[#005a2d] hover:bg-[#008040] text-white px-8 py-4 text-lg">
                                            <a href="/login">
                                                Begin Your Journey
                                            </a>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg border-[#005a2d]/20 hover:bg-[#005a2d]/5">
                                            <a href="/about">
                                                Learn More
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Features Section with better visual hierarchy */}
                        <section className="mt-16 py-8 sm:mt-24 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <Badge variant="secondary" className="mb-3">
                                    {pageContent.features.badge}
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#005a2d]">{pageContent.features.title}</h2>
                                <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 px-4">
                                    {pageContent.features.subtitle}
                                </p>
                            </div>

                            <div className="mt-8 grid gap-6 px-4 sm:mt-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                {pageContent.features.items.map((feature, index) => {
                                    const IconComponent = getIcon(feature.icon);
                                    return (
                                        <Card key={index} className="transition-all hover:bg-[#005a2d]/5 dark:hover:bg-[#23b14d]/5 border-b-4 border-[#23b14d]">
                                            <CardHeader>
                                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#23b14d]/10">
                                                    <IconComponent className="h-8 w-8 text-[#23b14d]" />
                                                </div>
                                                <CardTitle className="text-xl text-[#005a2d]">{feature.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Resource Guide Section */}
                        <section className="py-8 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <Badge variant="outline" className="mb-3">
                                    {pageContent.guide.badge}
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#005a2d] px-4">{pageContent.guide.title}</h2>
                                <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70 px-4">
                                    {pageContent.guide.subtitle}
                                </p>
                            </div>

                            <div className="grid gap-6 px-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                {pageContent.guide.items.map((item, index) => {
                                    const IconComponent = getIcon(item.icon);
                                    return (
                                        <Card key={index} className="transition-all hover:bg-[#febd12]/5 dark:hover:bg-[#febd12]/10 border-l-4 border-[#febd12]">
                                            <CardHeader>
                                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10">
                                                    <IconComponent className="h-8 w-8 text-[#febd12]" />
                                                </div>
                                                <CardTitle className="text-xl text-[#005a2d]">{item.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                    {item.description}
                                                </p>
                                            </CardContent>
                                        </Card>
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
