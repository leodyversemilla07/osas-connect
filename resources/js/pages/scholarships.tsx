import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, GraduationCap, Calendar, Search, Filter } from 'lucide-react';

interface Scholarship {
    id: number;
    name: string;
    amount: string;
    deadline: string;
    daysRemaining: number;
    type: 'Academic Scholarship' | 'Student Assistantship Program' | 'Performing Arts Scholarship' | 'Economic Assistance';
    description: string;
    requirements: string[];
}

interface ScholarshipsProps {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    scholarships: Scholarship[];
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

const scholarshipColors: Record<Scholarship['type'], {
    badge: string;
    card: string;
    icon: string;
}> = {
    'Academic Scholarship': {
        badge: 'bg-[#005a2d]/10 text-[#005a2d] dark:bg-[#005a2d]/20 dark:text-[#23b14d]',
        card: 'border-[#005a2d]/20 dark:border-[#005a2d]/20',
        icon: 'text-[#005a2d] dark:text-[#23b14d]'
    },
    'Performing Arts Scholarship': {
        badge: 'bg-[#febd12]/10 text-[#febd12] dark:bg-[#febd12]/20 dark:text-[#febd12]',
        card: 'border-[#febd12]/20 dark:border-[#febd12]/20',
        icon: 'text-[#febd12] dark:text-[#febd12]'
    },
    'Student Assistantship Program': {
        badge: 'bg-[#008040]/10 text-[#008040] dark:bg-[#008040]/20 dark:text-[#23b14d]',
        card: 'border-[#008040]/20 dark:border-[#008040]/20',
        icon: 'text-[#008040] dark:text-[#23b14d]'
    },
    'Economic Assistance': {
        badge: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400',
        card: 'border-purple-500/20 dark:border-purple-500/20',
        icon: 'text-purple-500 dark:text-purple-400'
    }
};

function ScholarshipCard({ scholarship, isAuthenticated }: { scholarship: Scholarship; isAuthenticated: boolean }) {
    const colors = scholarshipColors[scholarship.type];

    return (
        <Card className={`rounded-lg overflow-hidden border border-[#010002]/10 dark:border-[#f3f2f2]/10 ${colors.card}`}>
            <CardContent className="p-6">
                <div className="flex items-center gap-2">
                    <GraduationCap className={`h-5 w-5 ${colors.icon}`} />
                    <h3 className="font-semibold">{scholarship.name}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                    {scholarship.description}
                </p>
                <Badge className={`mt-3 ${colors.badge}`}>
                    {scholarship.type}
                </Badge>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">{scholarship.amount}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {scholarship.daysRemaining} days left
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Program Requirements
                    </h4>
                    <ul className="space-y-1">
                        {scholarship.requirements.map((requirement, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                {requirement}
                            </li>
                        ))}
                    </ul>
                </div>
                {isAuthenticated ? (
                    <Link href={`/student/scholarships/${scholarship.id}/apply`} className="block">
                        <Button className="mt-4 w-full" variant="default">
                            Apply Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Link href={route('login')} className="block">
                        <Button className="mt-4 w-full" variant="default">
                            Login to Apply
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}

export default function Scholarships({ auth, scholarships }: ScholarshipsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const isAuthenticated = !!auth?.user;

    // Filter scholarships based on search and type
    const filteredScholarships = (scholarships || []).filter(scholarship => {
        const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || scholarship.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <>
            <Head title="Scholarships - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                <SiteHeader />

                <main className="mt-16 w-full flex-1">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden min-h-[60vh] flex items-center">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60 xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }}></div>
                            </div>

                            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                                <div className="text-center space-y-8">
                                    <div className="inline-flex items-center gap-2 bg-[#febd12]/20 dark:bg-[#febd12]/30 px-4 py-2 rounded-full">
                                        <span className="text-sm font-medium text-[#010002] dark:text-[#febd12]">Available Opportunities</span>
                                    </div>

                                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#010002] dark:text-white leading-tight">
                                        Find Your Perfect Scholarship
                                    </h1>

                                    <p className="text-xl text-[#010002]/70 dark:text-[#f3f2f2]/70 max-w-3xl mx-auto leading-relaxed">
                                        Browse through our comprehensive collection of scholarships, financial aid, and student assistantship programs
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section - Only show for authenticated users */}
                        {isAuthenticated && (
                            <section className="mt-8 py-4">
                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Search scholarships..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Filter by type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Academic Scholarship">Academic Scholarship</SelectItem>
                                                <SelectItem value="Student Assistantship Program">Student Assistantship</SelectItem>
                                                <SelectItem value="Performing Arts Scholarship">Performing Arts</SelectItem>
                                                <SelectItem value="Economic Assistance">Economic Assistance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Scholarships Grid */}
                        <section className="mt-8 py-4">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Browse Scholarships
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Available Scholarships</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    {isAuthenticated
                                        ? 'Find and apply for scholarships that match your qualifications'
                                        : 'Discover scholarship opportunities - login to apply'
                                    }
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredScholarships.map((scholarship) => (
                                    <ScholarshipCard
                                        key={scholarship.id}
                                        scholarship={scholarship}
                                        isAuthenticated={isAuthenticated}
                                    />
                                ))}
                            </div>

                            {filteredScholarships.length === 0 && isAuthenticated && (searchTerm || selectedType !== 'all') && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No scholarships match your search criteria.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
