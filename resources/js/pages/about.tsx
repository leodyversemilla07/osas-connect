import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Head } from '@inertiajs/react';
import { CheckCircle, Heart, Shield, Users } from 'lucide-react';

// Hardcoded content from PageSeeder.php for the 'about' page
const pageContent = {
    hero: {
        badge: 'About Us',
        title: 'Empowering Students Through Education',
        subtitle: 'Learn about our mission to make quality education accessible to all students.',
    },
    mission: {
        badge: 'Our Mission',
        title: 'Our Mission',
        description:
            'To provide a streamlined, efficient, and transparent scholarship management system that connects deserving students with educational opportunities.',
        features: [
            'Streamlined application process',
            'Transparent selection criteria',
            'Real-time status tracking',
            'Comprehensive document management',
            'Equal opportunity access',
        ],
        image: 'https://img.freepik.com/free-photo/portrait-female-teacher-holding-notepad-green-wall_651396-1833.jpg',
    },
    vision: {
        badge: 'Our Vision',
        title: 'Our Vision',
        subtitle: 'Building a future where every student can achieve their educational dreams.',
        values: [
            {
                icon: 'Users',
                title: 'Community',
                description: 'Building strong connections between students, educators, and scholarship providers.',
            },
            {
                icon: 'Shield',
                title: 'Trust',
                description: 'Maintaining transparency and reliability in all scholarship processes.',
            },
            {
                icon: 'Heart',
                title: 'Care',
                description: 'Putting student success and wellbeing at the center of everything we do.',
            },
        ],
    },
    team: {
        badge: 'Our Team',
        title: 'Meet Our Team',
        subtitle: 'Dedicated professionals working to make education accessible for all.',
        members: [
            {
                name: 'Dr. Maria Santos',
                position: 'Director, Office of Student Affairs',
                image: 'https://via.placeholder.com/150x150/005a2d/ffffff?text=MS',
            },
            {
                name: 'Prof. Juan dela Cruz',
                position: 'Scholarship Coordinator',
                image: 'https://via.placeholder.com/150x150/005a2d/ffffff?text=JC',
            },
            {
                name: 'Ms. Ana Rodriguez',
                position: 'Student Support Services',
                image: 'https://via.placeholder.com/150x150/005a2d/ffffff?text=AR',
            },
        ],
    },
    cta: {
        title: 'Ready to Start Your Journey?',
        description: 'Join thousands of students who have successfully received scholarships through OSAS Connect.',
        button_text: 'Apply Now',
        button_link: '/login',
    },
};

const getIcon = (iconName: string) => {
    const icons = {
        Users,
        Shield,
        Heart,
        CheckCircle,
    };
    return icons[iconName as keyof typeof icons] || Users;
};

export default function About() {
    // All content is now hardcoded in pageContent above
    return (
        <>
            <Head title="About - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
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

                        {/* Our Mission Section */}
                        <section className="mt-16 py-8 sm:mt-24 sm:py-16">
                            <div className="mb-8 text-center sm:mb-12">
                                <Badge variant="secondary" className="mb-3">
                                    {pageContent.mission.badge}
                                </Badge>
                                <h2 className="text-2xl font-bold text-[#005a2d] sm:text-3xl">{pageContent.mission.title}</h2>
                                <p className="mx-auto mt-3 max-w-2xl px-4 text-base text-[#010002]/70 sm:mt-4 sm:text-lg dark:text-[#f3f2f2]/70">
                                    {pageContent.mission.description}
                                </p>
                            </div>

                            <div className="mx-auto mt-8 max-w-3xl px-4">
                                <ul className="space-y-4">
                                    {pageContent.mission.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#23b14d]" />
                                            <span className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Our Vision Section */}
                        <section className="py-8 sm:py-16">
                            <div className="mb-8 text-center sm:mb-12">
                                <Badge variant="outline" className="mb-3">
                                    {pageContent.vision.badge}
                                </Badge>
                                <h2 className="px-4 text-2xl font-bold text-[#005a2d] sm:text-3xl">{pageContent.vision.title}</h2>
                                <p className="mx-auto mt-3 max-w-2xl px-4 text-base text-[#010002]/70 sm:mt-4 sm:text-lg dark:text-[#f3f2f2]/70">
                                    {pageContent.vision.subtitle}
                                </p>
                            </div>

                            <div className="grid gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-0 lg:grid-cols-3">
                                {pageContent.vision.values.map((value, index) => {
                                    const IconComponent = getIcon(value.icon);
                                    return (
                                        <div key={index} className="rounded-lg p-6 transition-all hover:bg-[#febd12]/5 dark:hover:bg-[#febd12]/10">
                                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10">
                                                <IconComponent className="h-8 w-8 text-[#febd12]" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-semibold text-[#005a2d]">{value.title}</h3>
                                            <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">{value.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Team Section */}
                        <section className="py-8 sm:py-16">
                            <div className="mb-8 text-center sm:mb-12">
                                <Badge variant="secondary" className="mb-3">
                                    {pageContent.team.badge}
                                </Badge>
                                <h2 className="px-4 text-2xl font-bold text-[#005a2d] sm:text-3xl">{pageContent.team.title}</h2>
                                <p className="mx-auto mt-3 max-w-2xl px-4 text-base text-[#010002]/70 sm:mt-4 sm:text-lg dark:text-[#f3f2f2]/70">
                                    {pageContent.team.subtitle}
                                </p>
                            </div>
                            <div className="grid gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-0 lg:grid-cols-3">
                                {pageContent.team.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg p-6 text-center transition-all hover:bg-[#005a2d]/5 dark:hover:bg-[#23b14d]/5"
                                    >
                                        <div className="mx-auto mb-6 h-24 w-24">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="h-full w-full rounded-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://via.placeholder.com/96x96/005a2d/ffffff?text=${member.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}`;
                                                }}
                                            />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-[#005a2d]">{member.name}</h3>
                                        <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">{member.position}</p>
                                    </div>
                                ))}
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
