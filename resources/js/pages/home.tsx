import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, GraduationCap, LayoutDashboard, ShieldCheck, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            },
        }),
    };

    return (
        <>
            <Head title="OSAS Connect - Scholarship Management System" />

            <div className="bg-background min-h-screen font-sans antialiased selection:bg-green-500/30 selection:text-green-900">
                <SiteHeader />

                <main className="flex-1 overflow-hidden">
                    {/* Hero Section */}
                    <section ref={targetRef} className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
                        {/* Abstract Background */}
                        <div className="via-background to-background dark:via-background dark:to-background absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 dark:from-green-950/30" />
                        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:14px_24px]" />

                        {/* Floating Blobs */}
                        <div className="absolute top-1/4 -left-20 h-72 w-72 animate-pulse rounded-full bg-green-400/20 blur-[100px]" />
                        <div className="absolute -right-20 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-400/20 blur-[100px] delay-1000" />

                        <div className="relative z-10 container mx-auto px-4 md:px-6">
                            <motion.div style={{ opacity, scale, y }} className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
                                <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-green-600/20 bg-green-50 px-4 py-1.5 text-sm font-semibold tracking-wide text-green-700 uppercase backdrop-blur-sm dark:border-green-500/30 dark:bg-green-900/30 dark:text-green-300"
                                    >
                                        <Sparkles className="mr-2 h-3.5 w-3.5 fill-green-500" />
                                        Excellence in Education
                                    </Badge>
                                </motion.div>

                                <motion.h1
                                    custom={1}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    className="text-foreground text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl"
                                >
                                    Your Future, <br className="hidden md:block" />
                                    <span className="animate-gradient-x bg-gradient-to-r from-[#005a2d] via-green-600 to-amber-500 bg-clip-text text-transparent dark:from-green-400 dark:via-green-300 dark:to-amber-300">
                                        Funded & Secure
                                    </span>
                                </motion.h1>

                                <motion.p
                                    custom={2}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    className="text-muted-foreground max-w-2xl text-xl leading-relaxed md:text-2xl"
                                >
                                    The official scholarship management portal for{' '}
                                    <span className="text-foreground font-semibold">Mindoro State University</span>. Streamlined applications,
                                    real-time tracking, and faster disbursements.
                                </motion.p>

                                <motion.div
                                    custom={3}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    className="flex w-full flex-col justify-center gap-4 pt-8 sm:flex-row"
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-14 rounded-full bg-[#005a2d] px-8 text-lg font-semibold text-white shadow-xl shadow-green-900/20 transition-all hover:scale-105 hover:bg-[#006e38] hover:shadow-green-900/30"
                                    >
                                        <Link href={route('register')}>
                                            Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="border-foreground/10 hover:bg-foreground/5 h-14 rounded-full border-2 bg-white/50 px-8 text-lg font-semibold backdrop-blur-sm transition-all hover:scale-105 dark:bg-black/50"
                                    >
                                        <Link href={route('scholarships')}>View Programs</Link>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="border-border/50 bg-muted/30 relative border-y py-12">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                                {[
                                    { label: 'Active Scholars', value: '2.5k+', icon: Users },
                                    { label: 'Programs', value: '15+', icon: BookOpen },
                                    { label: 'Disbursed', value: '₱12M+', icon: Trophy },
                                    { label: 'Efficiency', value: '100%', icon: Zap },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group flex flex-col items-center space-y-2 text-center"
                                    >
                                        <div className="mb-2 rounded-2xl bg-green-100 p-3 text-green-700 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/20 dark:text-green-400">
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <div className="text-foreground text-3xl font-bold tracking-tight">{stat.value}</div>
                                        <div className="text-muted-foreground text-sm font-medium tracking-wider uppercase">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="relative overflow-hidden py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="mb-16 space-y-4 text-center">
                                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Built for Student Success</h2>
                                <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                                    Modernizing the scholarship experience with transparency and ease.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {[
                                    {
                                        title: 'Centralized Dashboard',
                                        desc: 'Manage all your applications, documents, and interview schedules in one secure location.',
                                        icon: LayoutDashboard,
                                        gradient: 'from-blue-500/20 to-cyan-500/20',
                                        text: 'text-blue-600 dark:text-blue-400',
                                    },
                                    {
                                        title: 'Real-time Notifications',
                                        desc: 'Get instant updates via email and in-app alerts whenever your status changes.',
                                        icon: Clock,
                                        gradient: 'from-amber-500/20 to-orange-500/20',
                                        text: 'text-amber-600 dark:text-amber-400',
                                    },
                                    {
                                        title: 'Secure Processing',
                                        desc: 'Bank-grade encryption for your personal data and document submissions.',
                                        icon: ShieldCheck,
                                        gradient: 'from-green-500/20 to-emerald-500/20',
                                        text: 'text-green-600 dark:text-green-400',
                                    },
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="border-border/50 bg-background/50 group h-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-900/5">
                                            <CardContent className="p-8">
                                                <div
                                                    className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                                                >
                                                    <feature.icon className={`h-7 w-7 ${feature.text}`} />
                                                </div>
                                                <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-[#005a2d] dark:group-hover:text-green-400">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Scholarship Programs */}
                    <section className="relative overflow-hidden bg-[#005a2d] py-24 text-white">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Sparkles className="h-96 w-96 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-12 opacity-10">
                            <GraduationCap className="h-64 w-64 text-white" />
                        </div>

                        <div className="relative z-10 container mx-auto px-4 md:px-6">
                            <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
                                <div>
                                    <Badge className="mb-4 border-none bg-white/10 text-white hover:bg-white/20">Scholarship Programs</Badge>
                                    <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Find Your Opportunity</h2>
                                </div>
                                <Button asChild variant="secondary" size="lg" className="rounded-full">
                                    <Link href={route('scholarships')}>
                                        View All Programs <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { title: 'Academic', sub: 'For top achievers', icon: BookOpen },
                                    { title: 'Student Assistant', sub: 'Work-study program', icon: Users },
                                    { title: 'Performing Arts', sub: 'For creative talents', icon: Sparkles },
                                    { title: 'Sports Excellence', sub: 'For varsity athletes', icon: Trophy },
                                ].map((prog, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.03 }}
                                        className="cursor-pointer rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-colors hover:bg-white/20"
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                            <prog.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="mb-1 text-xl font-bold">{prog.title}</h3>
                                        <p className="text-sm text-white/60">{prog.sub}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="relative overflow-hidden py-32">
                        <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="mx-auto max-w-3xl space-y-8"
                            >
                                <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Ready to shape your future?</h2>
                                <p className="text-muted-foreground text-xl">
                                    Join thousands of MinSU students who have secured their education through our scholarship programs.
                                </p>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-16 rounded-full bg-[#005a2d] px-10 text-lg text-white shadow-xl shadow-green-900/20 hover:bg-[#006e38]"
                                    >
                                        <Link href={route('register')}>Create Account</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-16 rounded-full px-10 text-lg">
                                        <Link href={route('contact')}>Contact Support</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
