import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const contactItems = [
    {
        title: 'Email',
        description: 'For scholarship and application concerns',
        value: 'minsubcscholarship.edu.ph@gmail.com',
        href: 'mailto:minsubcscholarship.edu.ph@gmail.com',
        icon: Mail,
    },
    {
        title: 'Office Location',
        description: 'Office of Student Affairs and Services',
        value: 'Mindoro State University - Bongabong Campus, Oriental Mindoro',
        icon: MapPin,
    },
    {
        title: 'Office Hours',
        description: 'Monday to Friday',
        value: '8:00 AM - 5:00 PM',
        icon: Clock,
    },
    {
        title: 'Phone',
        description: 'For immediate concerns',
        value: '+63 (43) 286-2368',
        icon: Phone,
    },
];

export default function Contact() {
    return (
        <>
            <Head title="Contact Us - OSAS Connect" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="pt-16">
                    <section className="border-b">
                        <div className="container mx-auto px-4 py-20 md:px-6">
                            <div className="mx-auto max-w-3xl space-y-5 text-center">
                                <Badge variant="secondary">Contact Us</Badge>
                                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">We’re here to help</h1>
                                <p className="text-muted-foreground text-lg">
                                    Reach out to the OSAS team for scholarship guidance, requirements, and application support.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto px-4 py-14 md:px-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            {contactItems.map((item) => (
                                <Card key={item.title}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <item.icon className="text-primary h-5 w-5" />
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-2 text-sm">{item.description}</p>
                                        {item.href ? (
                                            <a href={item.href} className="text-primary text-sm font-medium hover:underline">
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-sm">{item.value}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="bg-muted/30 border-y">
                        <div className="container mx-auto px-4 py-14 text-center md:px-6">
                            <div className="mx-auto max-w-2xl">
                                <div className="mb-3 inline-flex items-center gap-2">
                                    <MessageCircle className="text-primary h-4 w-4" />
                                    <span className="text-sm font-medium">Support Tip</span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    For faster processing, include your full name, student number, and scholarship concern when sending inquiries.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
