import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';

const pageContent = {
    hero: {
        badge: 'Contact Us',
        title: 'Get in Touch',
        subtitle: 'Have questions about scholarships or the application process? Our team is here to help you succeed.',
    },
    info: {
        badge: 'How to Reach Us',
        title: "We're Here to Help",
        subtitle: 'Choose the best way to contact us based on your needs and preferences.',
    },
    contacts: [
        {
            type: 'email',
            icon: 'Mail',
            title: 'Email Us',
            description: 'For general inquiries and scholarship questions',
            value: 'minsubcscholarship.edu.ph@gmail.com',
            link: 'mailto:minsubcscholarship.edu.ph@gmail.com',
        },
        {
            type: 'address',
            icon: 'MapPin',
            title: 'Visit Us',
            description: 'Office of Student Affairs and Services',
            value: 'Mindoro State University - Bongabong Campus\nBongabong, Oriental Mindoro',
        },
        {
            type: 'hours',
            icon: 'Clock',
            title: 'Office Hours',
            description: "We're available during regular business hours",
            value: 'Monday - Friday\n8:00 AM - 5:00 PM\n(Lunch break: 12:00 PM - 1:00 PM)',
        },
        {
            type: 'support',
            icon: 'MessageCircle',
            title: 'Quick Support',
            description: 'Need immediate help?',
            value: 'Use our live chat or submit a support ticket through your dashboard.',
        },
    ],
    cta: {
        title: 'Ready to Get Started?',
        description: 'Join thousands of students who have found their path to academic success through OSAS Connect.',
    },
};

const getIcon = (iconName: string) => {
    const icons = {
        Mail,
        MapPin,
        Clock,
        MessageCircle,
    };
    return icons[iconName as keyof typeof icons] || Mail;
};

export default function Contact() {
    return (
        <>
            <Head title="Contact Us - OSAS Connect" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="flex-1 overflow-hidden pt-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-24">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20" />

                        <div className="relative z-10 container mx-auto px-4 md:px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mx-auto max-w-4xl space-y-6 text-center"
                            >
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary mb-4 px-4 py-1.5">
                                    {pageContent.hero.badge}
                                </Badge>
                                <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-6xl">{pageContent.hero.title}</h1>
                                <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">{pageContent.hero.subtitle}</p>
                            </motion.div>
                        </div>
                    </section>

                    {/* Contact Cards Section */}
                    <section className="bg-background py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                                <Badge variant="secondary" className="text-primary bg-primary/10">
                                    {pageContent.info.badge}
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{pageContent.info.title}</h2>
                                <p className="text-muted-foreground text-lg">{pageContent.info.subtitle}</p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {pageContent.contacts.map((contact, index) => {
                                    const IconComponent = getIcon(contact.icon);

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="border-border/50 bg-background/50 hover:bg-background hover:shadow-primary/5 group h-full transition-all hover:shadow-lg">
                                                <CardContent className="space-y-4 p-8">
                                                    <div className="bg-primary/10 text-primary mb-2 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                                                        <IconComponent className="h-7 w-7" />
                                                    </div>
                                                    <h3 className="group-hover:text-primary text-xl font-bold transition-colors">{contact.title}</h3>
                                                    <p className="text-muted-foreground min-h-[40px] text-sm">{contact.description}</p>

                                                    <div className="border-border/50 border-t pt-4">
                                                        {contact.link ? (
                                                            <a href={contact.link} className="text-primary font-medium break-all hover:underline">
                                                                {contact.value}
                                                            </a>
                                                        ) : (
                                                            <div className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
                                                                {contact.value}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Map or CTA could go here, but strictly sticking to content */}
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
