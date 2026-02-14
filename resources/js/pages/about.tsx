import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Heart, Shield, Users } from 'lucide-react';

const values = [
    {
        title: 'Student-Centered',
        description: 'We keep processes understandable and accessible for all applicants.',
        icon: Users,
    },
    {
        title: 'Transparency',
        description: 'We promote fair, consistent, and trackable scholarship workflows.',
        icon: Shield,
    },
    {
        title: 'Supportive',
        description: 'We help students navigate applications, requirements, and updates.',
        icon: Heart,
    },
];

const missionItems = [
    'Provide a streamlined scholarship application process',
    'Improve visibility of application status and requirements',
    'Support equitable access to educational assistance',
];

export default function About() {
    return (
        <>
            <Head title="About - OSAS Connect" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="pt-16">
                    <section className="border-b">
                        <div className="container mx-auto px-4 py-20 md:px-6">
                            <div className="mx-auto max-w-3xl space-y-5 text-center">
                                <Badge variant="secondary">About OSAS Connect</Badge>
                                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Empowering students through accessible support</h1>
                                <p className="text-muted-foreground text-lg">
                                    OSAS Connect helps Mindoro State University students discover and manage scholarship opportunities through a clear and guided platform.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto px-4 py-14 md:px-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Our Mission</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-muted-foreground space-y-2 text-sm">
                                        {missionItems.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="bg-primary mt-2 h-1.5 w-1.5 rounded-full" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Our Vision</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        A university community where every qualified student can pursue academic goals without unnecessary financial barriers.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section className="bg-muted/30 border-y">
                        <div className="container mx-auto px-4 py-16 md:px-6">
                            <div className="mx-auto mb-8 max-w-2xl text-center">
                                <h2 className="text-3xl font-semibold tracking-tight">Core Values</h2>
                            </div>
                            <div className="grid gap-5 md:grid-cols-3">
                                {values.map((value) => (
                                    <Card key={value.title}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <value.icon className="text-primary h-5 w-5" />
                                                {value.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">{value.description}</p>
                                        </CardContent>
                                    </Card>
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
