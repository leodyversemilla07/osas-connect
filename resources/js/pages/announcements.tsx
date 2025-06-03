import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Announcement {
    id: number;
    title: string;
    description: string;
    date: string;
    category: keyof typeof categoryColors;
    priority: keyof typeof priorityColors;
}

interface AnnouncementsProps {
    announcements: Announcement[];
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

// Mock announcements data - replaced with dynamic data from backend

const priorityColors: Record<'high' | 'medium' | 'low', string> = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
};

const categoryColors: Record<'Scholarship' | 'Deadlines' | 'Events' | 'Requirements', string> = {
    Scholarship: 'bg-[#005a2d]/10 text-[#005a2d] dark:bg-[#005a2d]/20 dark:text-[#23b14d]',
    Deadlines: 'bg-[#febd12]/10 text-[#febd12] dark:bg-[#febd12]/20 dark:text-[#febd12]',
    Events: 'bg-[#008040]/10 text-[#008040] dark:bg-[#008040]/20 dark:text-[#23b14d]',
    Requirements: 'bg-[#23b14d]/10 text-[#23b14d] dark:bg-[#23b14d]/20 dark:text-[#23b14d]'
};

export default function Announcements({ announcements, headerContent, footerContent }: AnnouncementsProps) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Handler for opening the dialog with a specific announcement
    const handleAnnouncementClick = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsOpen(true);
    };

    return (
        <>
            <Head title="Announcements - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                <SiteHeader content={headerContent} />

                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                            {/* Background pattern */}
                            <div className="absolute inset-0 bg-[#005a2d]">
                                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#ffffff0d 2px, transparent 2px)", backgroundSize: "24px 24px" }}></div>
                            </div>

                            <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
                                <div className="text-center">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Stay Informed
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Announcements
                                    </h1>
                                    <p className="mt-6 max-w-2xl text-xl text-white/90">
                                        Stay updated with the latest news, deadlines, and opportunities from OSAS Connect
                                    </p>
                                </div>
                            </div>
                        </div>                        {/* Announcements Section */}
                        <section className="mt-16">
                            <div className="grid gap-6">
                                {(announcements || []).map((announcement) => (
                                    <Card key={announcement.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer" onClick={() => handleAnnouncementClick(announcement)}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[announcement.category]}`}>
                                                        {announcement.category}
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[announcement.priority]}`}>
                                                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                                    </span>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="mr-1 h-4 w-4" />
                                                        {announcement.date}
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <h3 className="text-xl font-semibold text-[#005a2d] dark:text-[#23b14d]">
                                                        {announcement.title}
                                                    </h3>
                                                    <p className="mt-2 text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                                        {announcement.description}
                                                    </p>
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button 
                                                        variant="ghost" 
                                                        className="text-[#23b14d] hover:text-[#1a8f3c] hover:bg-[#23b14d]/10"
                                                    >
                                                        Learn more
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* CTA Section */}
                        <section className="mt-12 sm:mt-16 mb-8">
                            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#005a2d] to-[#008040] p-6 sm:p-8 shadow-xl overflow-hidden relative mx-4 sm:mx-0">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <pattern id="pattern-circles-cta" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <circle id="pattern-circle-cta" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                                        </pattern>
                                        <rect id="rect-cta" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
                                    </svg>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                                    <div className="mb-6 md:mb-0 md:mr-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Never Miss an Update</h2>
                                        <p className="mt-3 text-lg text-white/90">
                                            Enable notifications to stay informed about new scholarship opportunities, deadlines, and important announcements.
                                        </p>
                                    </div>
                                    <div>
                                        <Button className="w-full md:w-auto bg-[#febd12] text-[#010002] hover:bg-[#f5b400]">
                                            <Bell className="mr-2 h-4 w-4" />
                                            Enable Notifications
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                <SiteFooter content={footerContent} />
            </div>

            {/* Announcement Detail Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#005a2d] dark:text-[#23b14d]">
                            {selectedAnnouncement?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {selectedAnnouncement && (
                                <>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[selectedAnnouncement.category]}`}>
                                        {selectedAnnouncement.category}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[selectedAnnouncement.priority]}`}>
                                        {selectedAnnouncement.priority.charAt(0).toUpperCase() + selectedAnnouncement.priority.slice(1)} Priority
                                    </span>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {selectedAnnouncement.date}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="prose prose-emerald dark:prose-invert max-w-none">
                            {selectedAnnouncement?.description}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold mb-2">Additional Information:</h4>
                                {selectedAnnouncement?.category === 'Scholarship' && (
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Visit the Scholarships section for complete eligibility criteria</li>
                                        <li>Required documents must be submitted through your dashboard</li>
                                        <li>For inquiries, contact the OSAS office during business hours</li>
                                    </ul>
                                )}
                                {selectedAnnouncement?.category === 'Deadlines' && (
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Mark this date in your calendar</li>
                                        <li>Late submissions will not be accepted</li>
                                        <li>Early submissions are encouraged</li>
                                    </ul>
                                )}
                                {selectedAnnouncement?.category === 'Events' && (
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Attendance is recorded for scholarship requirements</li>
                                        <li>Bring your student ID</li>
                                        <li>Business attire is required</li>
                                    </ul>
                                )}
                                {selectedAnnouncement?.category === 'Requirements' && (
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>All documents must be in PDF format</li>
                                        <li>File size should not exceed 5MB</li>
                                        <li>Original copies may be requested for verification</li>
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 pt-6 border-t">
                                <p className="text-sm text-muted-foreground">
                                    For any questions or clarifications about this announcement, please contact the OSAS office or visit during office hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
