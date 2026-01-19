import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Coins, Filter, GraduationCap, Music, Search, Users } from 'lucide-react';
import { useState } from 'react';

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
}

const scholarshipColors: Record<
    Scholarship['type'],
    {
        badge: string;
        card: string;
        icon: string;
        iconComponent: any;
        gradient: string;
    }
> = {
    'Academic Scholarship': {
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        card: 'hover:border-green-500/50',
        icon: 'text-green-600',
        iconComponent: GraduationCap,
        gradient: 'from-green-500/10 to-emerald-500/10',
    },
    'Performing Arts Scholarship': {
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        card: 'hover:border-purple-500/50',
        icon: 'text-purple-600',
        iconComponent: Music,
        gradient: 'from-purple-500/10 to-pink-500/10',
    },
    'Student Assistantship Program': {
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        card: 'hover:border-blue-500/50',
        icon: 'text-blue-600',
        iconComponent: Users,
        gradient: 'from-blue-500/10 to-cyan-500/10',
    },
    'Economic Assistance': {
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        card: 'hover:border-amber-500/50',
        icon: 'text-amber-600',
        iconComponent: Coins,
        gradient: 'from-amber-500/10 to-orange-500/10',
    },
};

function ScholarshipCard({ scholarship, isAuthenticated }: { scholarship: Scholarship; isAuthenticated: boolean }) {
    const style = scholarshipColors[scholarship.type] || scholarshipColors['Academic Scholarship'];
    const Icon = style.iconComponent;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
            <Card
                className={`border-border/50 bg-background/50 h-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${style.card}`}
            >
                <div className={`h-2 w-full bg-gradient-to-r ${style.gradient.replace('/10', '')}`} />
                <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div className={`rounded-xl bg-gradient-to-br p-3 ${style.gradient}`}>
                            <Icon className={`h-6 w-6 ${style.icon}`} />
                        </div>
                        <Badge className={`rounded-full px-3 ${style.badge}`}>{scholarship.type}</Badge>
                    </div>

                    <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-xl font-bold">{scholarship.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3 min-h-[4.5rem] text-sm">{scholarship.description}</p>

                    <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-lg p-3">
                        <span className="text-foreground font-bold">{scholarship.amount}</span>
                        <div
                            className={`flex items-center text-xs font-medium ${scholarship.daysRemaining < 10 ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {scholarship.daysRemaining} days left
                        </div>
                    </div>

                    <div className="mb-6 space-y-3">
                        <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Requirements</h4>
                        <ul className="space-y-2">
                            {scholarship.requirements.slice(0, 3).map((requirement, index) => (
                                <li key={index} className="text-foreground/80 flex items-start gap-2 text-sm">
                                    <span className="bg-primary/40 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                                    <span className="line-clamp-1">{requirement}</span>
                                </li>
                            ))}
                            {scholarship.requirements.length > 3 && (
                                <li className="text-muted-foreground pl-3.5 text-xs">+ {scholarship.requirements.length - 3} more requirements</li>
                            )}
                        </ul>
                    </div>

                    <Button
                        className={`w-full font-semibold ${isAuthenticated ? 'bg-[#005a2d] hover:bg-[#006e38]' : ''}`}
                        variant={isAuthenticated ? 'default' : 'secondary'}
                        asChild
                    >
                        <Link href={isAuthenticated ? `/student/scholarships/${scholarship.id}/apply` : route('login')}>
                            {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function Scholarships({ auth, scholarships }: ScholarshipsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const isAuthenticated = !!auth?.user;

    // Filter scholarships based on search and type
    const filteredScholarships = (scholarships || []).filter((scholarship) => {
        const matchesSearch =
            scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || scholarship.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <>
            <Head title="Scholarships - OSAS Connect" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="flex-1 overflow-hidden pt-20">
                    {/* Hero Section */}
                    <section className="bg-muted/30 relative overflow-hidden py-20">
                        <div className="bg-grid-black/[0.02] dark:bg-grid-white/[0.02] absolute inset-0" />
                        <div className="relative z-10 container mx-auto px-4 md:px-6">
                            <div className="mx-auto max-w-3xl space-y-6 text-center">
                                <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary px-4 py-1.5 backdrop-blur">
                                    Available Opportunities
                                </Badge>
                                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Find Your Perfect Scholarship</h1>
                                <p className="text-muted-foreground text-xl">
                                    Browse through our comprehensive collection of scholarships, financial aid, and student assistantship programs.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="container mx-auto px-4 py-12 md:px-6">
                        {/* Search and Filter Section */}
                        <div className="border-border/50 bg-background/80 sticky top-24 z-30 mb-12 rounded-2xl border p-4 shadow-lg backdrop-blur-md">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                    <Input
                                        placeholder="Search scholarships..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-background h-11 pl-10"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter className="text-muted-foreground hidden h-4 w-4 sm:block" />
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger className="bg-background h-11 w-full md:w-[240px]">
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
                        </div>

                        {/* Scholarships Grid */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-foreground text-2xl font-bold">{selectedType === 'all' ? 'All Scholarships' : selectedType}</h2>
                                <span className="text-muted-foreground text-sm font-medium">
                                    {filteredScholarships.length} result{filteredScholarships.length !== 1 && 's'}
                                </span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredScholarships.map((scholarship) => (
                                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} isAuthenticated={isAuthenticated} />
                                ))}
                            </div>

                            {filteredScholarships.length === 0 && (
                                <div className="py-24 text-center">
                                    <div className="bg-muted mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                                        <Search className="text-muted-foreground h-8 w-8" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">No scholarships found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedType('all');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
