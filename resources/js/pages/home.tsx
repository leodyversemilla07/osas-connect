import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, GraduationCap, ShieldCheck, Users } from 'lucide-react';

const features = [
    {
        title: 'Simple Application Flow',
        description: 'Apply online, upload requirements, and track progress in one place.',
        icon: BookOpen,
    },
    {
        title: 'Status Updates',
        description: 'Get clear updates for verification, interviews, and final decisions.',
        icon: Clock,
    },
    {
        title: 'Secure Records',
        description: 'Your student and scholarship data is handled through secure workflows.',
        icon: ShieldCheck,
    },
];

const stats = [
    { label: 'Students Served', value: '2,500+', icon: Users },
    { label: 'Programs', value: '15+', icon: GraduationCap },
    { label: 'Application Support', value: '24/7', icon: Clock },
];

export default function Home() {
    return (
        <>
            <Head title="OSAS Connect - Scholarship Management System" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="pt-16">
                    <section className="border-b">
                        <div className="container mx-auto px-4 py-20 md:px-6">
                            <div className="mx-auto max-w-3xl space-y-6 text-center">
                                <Badge variant="secondary">OSAS Connect</Badge>
                                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                                    Scholarship support made clear and accessible
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    Explore scholarship opportunities at Mindoro State University and manage your application journey with confidence.
                                </p>
                                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                    <Button asChild>
                                        <Link href={route('register')}>Get Started</Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={route('scholarships')}>Browse Scholarships</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto px-4 py-14 md:px-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {stats.map((item) => (
                                <Card key={item.label}>
                                    <CardContent className="flex items-center gap-3 p-5">
                                        <item.icon className="text-primary h-5 w-5" />
                                        <div>
                                            <p className="text-xl font-semibold">{item.value}</p>
                                            <p className="text-muted-foreground text-sm">{item.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="bg-muted/30 border-y">
                        <div className="container mx-auto px-4 py-16 md:px-6">
                            <div className="mx-auto mb-10 max-w-2xl text-center">
                                <h2 className="text-3xl font-semibold tracking-tight">Why students use OSAS Connect</h2>
                            </div>
                            <div className="grid gap-5 md:grid-cols-3">
                                {features.map((feature) => (
                                    <Card key={feature.title}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <feature.icon className="text-primary h-5 w-5" />
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto px-4 py-20 text-center md:px-6">
                        <h2 className="text-3xl font-semibold tracking-tight">Ready to apply?</h2>
                        <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
                            Create your account and start your scholarship application with OSAS Connect.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Button asChild>
                                <Link href={route('register')}>Create Account</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('contact')}>Contact Support</Link>
                            </Button>
                        </div>
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
