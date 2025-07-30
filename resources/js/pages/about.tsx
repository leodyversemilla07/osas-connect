
import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Users, Shield, Heart, CheckCircle } from 'lucide-react';

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
        description: 'To provide a streamlined, efficient, and transparent scholarship management system that connects deserving students with educational opportunities.',
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
        CheckCircle
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

                        {/* Our Mission Section */}
                        <section className="mt-16 py-16">
                            <div className="grid gap-12 md:grid-cols-2 items-center">
                                <div>
                                    <div className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                        {pageContent.mission.badge}
                                    </div>
                                    <h2 className="text-3xl font-bold text-[#005a2d] mb-6">{pageContent.mission.title}</h2>
                                    <p className="text-lg text-[#010002]/80 dark:text-[#f3f2f2]/80 mb-6 leading-relaxed">
                                        {pageContent.mission.description}
                                    </p>

                                    <ul className="space-y-3">
                                        {pageContent.mission.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#23b14d] flex-shrink-0 mt-0.5" />
                                                <span className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="relative">
                                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#23b14d]/20 to-[#febd12]/20 blur-lg"></div>
                                    <img
                                        src={pageContent.mission.image}
                                        alt="OSAS Connect Mission"
                                        className="relative z-10 w-full rounded-3xl object-cover shadow-lg"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/500x400/005a2d/ffffff?text=OSAS+Mission";
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Our Vision Section */}
                        <section className="py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                    {pageContent.vision.badge}
                                </div>
                                <h2 className="text-3xl font-bold text-[#005a2d]">{pageContent.vision.title}</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    {pageContent.vision.subtitle}
                                </p>
                            </div>

                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {pageContent.vision.values.map((value, index) => {
                                    const IconComponent = getIcon(value.icon);
                                    return (
                                        <div key={index} className="group rounded-xl bg-white p-8 shadow-md transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] dark:bg-[#1a1a1a] border-t-4 border-[#febd12]">
                                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#febd12]/10 group-hover:bg-[#febd12]/20 transition-colors duration-200">
                                                <IconComponent className="h-8 w-8 text-[#febd12]" />
                                            </div>
                                            <h3 className="mb-3 text-xl font-semibold text-[#005a2d]">{value.title}</h3>
                                            <p className="text-base text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                                {value.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Team Section */}
                        <section className="py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                                    {pageContent.team.badge}
                                </div>
                                <h2 className="text-3xl font-bold text-[#005a2d]">{pageContent.team.title}</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    {pageContent.team.subtitle}
                                </p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {pageContent.team.members.map((member, index) => (
                                    <div key={index} className="group rounded-xl bg-white p-8 shadow-md transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] dark:bg-[#1a1a1a] text-center">
                                        <div className="relative mb-6 mx-auto w-32 h-32">
                                            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#23b14d]/20 to-[#febd12]/20 blur-md group-hover:blur-lg transition-all duration-200"></div>
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="relative z-10 w-full h-full rounded-full object-cover border-4 border-white dark:border-[#1a1a1a]"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://via.placeholder.com/128x128/005a2d/ffffff?text=${member.name.split(' ').map(n => n[0]).join('')}`;
                                                }}
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#005a2d] mb-2">{member.name}</h3>
                                        <p className="text-base text-[#010002]/70 dark:text-[#f3f2f2]/70">{member.position}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Contact CTA Section */}
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

                                <div className="relative z-10 text-center">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{pageContent.cta.title}</h2>
                                    <p className="mt-4 mx-auto max-w-2xl text-lg text-white/90 mb-6">
                                        {pageContent.cta.description}
                                    </p>
                                    <a
                                        href={pageContent.cta.button_link}
                                        className="inline-flex items-center justify-center rounded-lg bg-[#febd12] px-8 py-3 text-lg font-semibold text-[#005a2d] transition-all duration-200 hover:bg-[#febd12]/90 hover:shadow-lg"
                                    >
                                        {pageContent.cta.button_text}
                                    </a>
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
