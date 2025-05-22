import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, GraduationCap, Calendar } from 'lucide-react';
import { GeneralRequirementsList, RequirementsList } from '@/components/scholarships/requirements-list';

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

const scholarships: Scholarship[] = [
    {
        id: 1,
        name: 'Academic Scholarship (Full)',
        amount: 'PHP 500/month',
        deadline: '2025-05-30',
        daysRemaining: 11,
        type: 'Academic Scholarship',
        description: 'President\'s Lister Scholarship for exceptional academic achievement',        
        requirements: [
            'GWA between 1.000 - 1.450',
            'No grade below 1.75 in any course',
            'No Dropped/Deferred/Failed marks',
            'Minimum of 18 units enrollment'
        ]
    },
    {
        id: 2,
        name: 'Academic Scholarship (Partial)',
        amount: 'PHP 300/month',
        deadline: '2025-05-30',
        daysRemaining: 11,
        type: 'Academic Scholarship',
        description: 'Dean\'s Lister Scholarship for outstanding academic performance',        
        requirements: [
            'GWA between 1.460 - 1.750',
            'No grade below 1.75 in any course',
            'No Dropped/Deferred/Failed marks',
            'Minimum of 18 units enrollment'
        ]
    },
    {
        id: 3,
        name: 'Student Assistantship Program',
        amount: 'Student Rate',
        deadline: '2025-05-30',
        daysRemaining: 11,
        type: 'Student Assistantship Program',
        description: 'Work opportunity for students to earn while studying',        
        requirements: [
            'Maximum load of 21 units',
            'No failing grades from previous semester',
            'Must pass pre-hiring screening',
            'Must submit parent\'s consent'
        ]
    },
    {
        id: 4,
        name: 'MinSU Performing Arts (Full)',
        amount: 'Full Scholarship',
        deadline: '2025-05-30',
        daysRemaining: 11,
        type: 'Performing Arts Scholarship',
        description: 'For active members of MinSU performing arts groups',        
        requirements: [            
            'Active member for at least 1 year',
            'Participated in major local/regional/national events',
            'Must be recommended by coach/adviser'
        ]
    },
    {
        id: 5,
        name: 'MinSU Performing Arts (Partial)',
        amount: 'Partial Scholarship',
        deadline: '2025-05-30',
        daysRemaining: 11,
        type: 'Performing Arts Scholarship',
        description: 'For members of MinSU performing arts groups',        requirements: [
            'Member for at least 1 semester',
            'Performed in 2+ major University activities',
            'Must be recommended by coach/adviser'
        ]
    },
    {
        id: 6,
        name: 'Economic Assistance Grant',
        amount: 'Financial Aid',
        deadline: '2025-05-30',
        daysRemaining: 11,
        type: 'Economic Assistance',
        description: 'Financial support for economically disadvantaged students',        requirements: [
            'General Weighted Average of 2.25',
            'Must provide MSWDO Indigency Certificate'
        ]
    }
];

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
    const colors = scholarshipColors[scholarship.type];

    return (
        <Card className={`rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a1a1a] border-b-4 border-[#23b14d] ${colors.card}`}>
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
                <RequirementsList
                    title="Program Requirements"
                    requirements={scholarship.requirements}
                />
                <Link href={route('login')} className="block">
                    <Button className="mt-4 w-full" variant="default">
                        Login to Apply
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

export default function Scholarships() {
    return (
        <>
            <Head title="Scholarships - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                <SiteHeader />

                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#005a2d]/95 to-[#008040]/90"></div>
                            {/* ... existing background pattern ... */}
                            <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
                                <div className="text-center">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Available Opportunities
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        Find Your Perfect Scholarship
                                    </h1>
                                    <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
                                        Browse through our comprehensive collection of scholarships, financial aid, and student assistantship programs
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Scholarships Grid */}
                        <section className="mt-8 py-4">
                            <div className="text-center mb-12">
                                <span className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Browse Scholarships
                                </span>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Available Scholarships</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Find and apply for scholarships that match your qualifications
                                </p>
                            </div>                            

                            <GeneralRequirementsList />

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {scholarships.map((scholarship) => (
                                    <ScholarshipCard
                                        key={scholarship.id}
                                        scholarship={scholarship}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* CTA Section */}
                        <section className="mt-16 mb-8">
                            <div className="rounded-2xl bg-gradient-to-r from-[#005a2d] to-[#008040] p-8 shadow-xl overflow-hidden relative">
                                {/* ... existing background pattern ... */}
                                <div className="relative z-10 flex flex-col items-center justify-center text-center py-12">
                                    <h2 className="text-3xl font-bold text-white leading-tight md:text-4xl lg:text-5xl">
                                        Ready to Apply for a Scholarship?
                                    </h2>
                                    <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
                                        Take the next step towards your academic and professional goals. Apply for our scholarships today!
                                    </p>
                                    <Link href={route('login')} className="mt-6">
                                        <Button variant="default" className="px-8 py-3 text-base font-semibold">
                                            Login to Apply
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}