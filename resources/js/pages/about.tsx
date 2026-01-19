import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Shield, Users } from 'lucide-react';

// Hardcoded content from PageSeeder.php for the 'about' page
const pageContent = {
    hero: {
        badge: 'About Us',
        title: 'Empowering Students Through Education',
        subtitle: 'Learn about our mission to make quality education accessible to all students at Mindoro State University.',
    },
    mission: {
        badge: 'Our Mission',
        title: 'Making Education Accessible',
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
        title: 'Building the Future',
        subtitle: 'Building a future where every student can achieve their educational dreams without financial barriers.',
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
        title: 'Dedicated Professionals',
        subtitle: 'Meet the team working tirelessly to support your educational journey.',
        members: [
            {
                name: 'Dr. Maria Santos',
                position: 'Director, Office of Student Affairs',
                image: 'https://ui-avatars.com/api/?name=Maria+Santos&background=005a2d&color=fff&size=150',
            },
            {
                name: 'Prof. Juan dela Cruz',
                position: 'Scholarship Coordinator',
                image: 'https://ui-avatars.com/api/?name=Juan+dela+Cruz&background=005a2d&color=fff&size=150',
            },
            {
                name: 'Ms. Ana Rodriguez',
                position: 'Student Support Services',
                image: 'https://ui-avatars.com/api/?name=Ana+Rodriguez&background=005a2d&color=fff&size=150',
            },
        ],
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
    return (
        <>
            <Head title="About - OSAS Connect" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="flex-1 overflow-hidden pt-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-24">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20" />
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Users className="text-primary h-96 w-96" />
                        </div>

                        <div className="relative z-10 container mx-auto px-4 md:px-6">
                            <div className="mx-auto max-w-4xl space-y-6 text-center">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary mb-4 px-4 py-1.5">
                                        {pageContent.hero.badge}
                                    </Badge>
                                    <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-6xl">{pageContent.hero.title}</h1>
                                    <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">{pageContent.hero.subtitle}</p>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Mission Section */}
                    <section className="bg-background py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="grid items-center gap-12 md:grid-cols-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <Badge variant="secondary" className="text-primary bg-primary/10">
                                        {pageContent.mission.badge}
                                    </Badge>
                                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{pageContent.mission.title}</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">{pageContent.mission.description}</p>
                                    <ul className="space-y-4 pt-4">
                                        {pageContent.mission.features.map((feature, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="text-foreground/80">{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 rotate-3 transform rounded-3xl bg-gradient-to-tr from-green-500/20 to-amber-500/20 blur-2xl" />
                                    <div className="border-border/50 relative overflow-hidden rounded-3xl border shadow-2xl">
                                        <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
                                            {/* Placeholder pattern if image fails or is generic */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 opacity-50 dark:from-green-950 dark:to-green-900" />
                                            <div className="text-primary/10 absolute inset-0 flex items-center justify-center">
                                                <Users className="h-32 w-32" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Vision Section */}
                    <section className="bg-muted/30 py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                                <Badge variant="outline" className="border-primary/20 text-primary">
                                    {pageContent.vision.badge}
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{pageContent.vision.title}</h2>
                                <p className="text-muted-foreground text-lg">{pageContent.vision.subtitle}</p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-3">
                                {pageContent.vision.values.map((value, index) => {
                                    const IconComponent = getIcon(value.icon);
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="border-border/50 bg-background/50 hover:bg-background hover:shadow-primary/5 h-full transition-colors hover:shadow-lg">
                                                <CardContent className="space-y-4 p-8 text-center">
                                                    <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
                                                        <IconComponent className="h-7 w-7" />
                                                    </div>
                                                    <h3 className="text-xl font-bold">{value.title}</h3>
                                                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="bg-background py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                                <Badge variant="secondary" className="text-primary bg-primary/10">
                                    {pageContent.team.badge}
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{pageContent.team.title}</h2>
                                <p className="text-muted-foreground text-lg">{pageContent.team.subtitle}</p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-3">
                                {pageContent.team.members.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="bg-muted border-border/50 relative mb-6 aspect-[3/4] overflow-hidden rounded-3xl border">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=400`;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-foreground mb-1 text-xl font-bold">{member.name}</h3>
                                            <p className="text-primary text-sm font-medium tracking-wide">{member.position}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
