import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { GraduationCap, Calendar, Search, Trophy, Clock, School, Users, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Scholarships',
        href: '/scholarships',
    },
];

type ScholarshipType = 'Academic' | 'Student Assistantship' | 'Performing Arts' | 'Economic Assistance';

interface GWARequirement {
    min?: number;
    max: number;
    description?: string;
}

interface Scholarship {
    id: number;
    name: string;
    type: ScholarshipType;
    amount: string;
    stipendSchedule: 'monthly' | 'semestral';
    deadline: string;
    description: string;
    gwaRequirement?: GWARequirement;
    eligibility: string[];
    requirements: string[];
    renewalCriteria: string[];
    status: 'open' | 'closed';
}

// Sample scholarships data
const scholarships: Scholarship[] = [
    {
        id: 1,
        name: 'Academic Scholarship (Full)',
        type: 'Academic',
        amount: '₱500',
        stipendSchedule: 'monthly',
        deadline: '2025-06-30',
        description: 'Full academic scholarship for students with exceptional academic performance.',
        gwaRequirement: {
            min: 1.000,
            max: 1.450,
            description: 'President\'s Lister'
        },
        eligibility: [
            'General Weighted Average (GWA) between 1.000 - 1.450',
            'No grade below 1.75 in any subject',
            'Must be enrolled with regular load (minimum of 18 units)',
            'No Drop/Incomplete/Failed marks'
        ],
        requirements: [
            'Certified True Copy of Grades from previous semester',
            'Certificate of Registration',
            'Endorsement letter from the College Dean',
            'Certificate of Good Moral Character'
        ],
        renewalCriteria: [
            'Maintain GWA requirement (1.000 - 1.450)',
            'Complete regular semester load',
            'No disciplinary cases'
        ],
        status: 'open'
    },
    {
        id: 2,
        name: 'Academic Scholarship (Partial)',
        type: 'Academic',
        amount: '₱300',
        stipendSchedule: 'monthly',
        deadline: '2025-06-30',
        description: 'Partial academic scholarship for students with outstanding academic standing.',
        gwaRequirement: {
            min: 1.460,
            max: 1.750,
            description: 'Dean\'s Lister'
        },
        eligibility: [
            'General Weighted Average (GWA) between 1.460 - 1.750',
            'No grade below 2.00 in any subject',
            'Must be enrolled with regular load (minimum of 18 units)',
            'No Drop/Incomplete/Failed marks'
        ],
        requirements: [
            'Certified True Copy of Grades from previous semester',
            'Certificate of Registration',
            'Certificate of Good Moral Character'
        ],
        renewalCriteria: [
            'Maintain GWA requirement (1.460 - 1.750)',
            'Complete regular semester load',
            'No disciplinary cases'
        ],
        status: 'open'
    },
    {
        id: 3,
        name: 'Student Assistantship Program',
        type: 'Student Assistantship',
        amount: 'Based on work hours',
        stipendSchedule: 'monthly',
        deadline: '2025-06-15',
        description: 'Work opportunity program allowing students to work part-time in university offices while studying.',
        gwaRequirement: {
            max: 2.500,
            description: 'Passing grades only'
        },
        eligibility: [
            'Maximum academic load of 21 units',
            'No failing grades from previous semester',
            'Available to render 3-4 hours of work daily',
            'Must be physically and mentally fit to work'
        ],
        requirements: [
            'Application Form with 2x2 ID picture',
            'Class Schedule',
            'Parent\'s Consent Form',
            'Medical Certificate',
            'Certificate of Good Moral Character',
            'Interview assessment form'
        ],
        renewalCriteria: [
            'Satisfactory work performance evaluation',
            'Maintain passing grades',
            'Regular class attendance',
            'No disciplinary cases'
        ],
        status: 'open'
    },
    {
        id: 4,
        name: 'MinSU Performing Arts (Full)',
        type: 'Performing Arts',
        amount: '₱500',
        stipendSchedule: 'monthly',
        deadline: '2025-05-30',
        description: 'Full scholarship for active members of MinSU performing arts groups with exceptional contribution.',
        eligibility: [
            'Active member for at least 1 year',
            'Regular participation in university performances',
            'Good academic standing',
            'Regular load student'
        ],
        requirements: [
            'Certification from group adviser/coach',
            'Performance record/portfolio',
            'Certificate of Registration',
            'Certificate of Good Moral Character',
            'Documentation of performances/achievements'
        ],
        renewalCriteria: [
            'Continued active participation in performances',
            'Maintain good academic standing',
            'Regular attendance in practice sessions',
            'Positive evaluation from adviser/coach'
        ],
        status: 'open'
    },
    {
        id: 5,
        name: 'MinSU Performing Arts (Partial)',
        type: 'Performing Arts',
        amount: '₱300',
        stipendSchedule: 'monthly',
        deadline: '2025-05-30',
        description: 'Partial scholarship for members of MinSU performing arts groups.',
        eligibility: [
            'Active member for at least 1 semester',
            'Regular participation in practices and performances',
            'Good academic standing',
            'Regular load student'
        ],
        requirements: [
            'Certification from group adviser/coach',
            'Certificate of Registration',
            'Certificate of Good Moral Character',
            'Documentation of participation in performances'
        ],
        renewalCriteria: [
            'Continued participation in performances',
            'Maintain good academic standing',
            'Regular attendance in practice sessions'
        ],
        status: 'open'
    },
    {
        id: 6,
        name: 'Economic Assistance Program',
        type: 'Economic Assistance',
        amount: '₱400',
        stipendSchedule: 'monthly',
        deadline: '2025-05-30',
        description: 'Financial assistance for economically disadvantaged but deserving students.',
        gwaRequirement: {
            max: 2.250,
            description: 'Passing grades with GWA not lower than 2.25'
        },
        eligibility: [
            'General Weighted Average not lower than 2.25',
            'Must be from low-income family',
            'Regular load student',
            'No other scholarship grants'
        ],
        requirements: [
            'Application Form with 2x2 ID picture',
            'Latest Income Tax Return of parents/guardian',
            'Certificate of Indigency from MSWDO',
            'Barangay Certificate',
            'Certificate of Good Moral Character',
            'Certified True Copy of Grades',
            'Certificate of Registration'
        ],
        renewalCriteria: [
            'Maintain GWA requirement (not lower than 2.25)',
            'Complete regular semester load',
            'No disciplinary cases',
            'Updated indigency certification'
        ],
        status: 'open'
    }
];

const getTypeColor = (type: ScholarshipType): string => {
    const colors: Record<ScholarshipType, string> = {
        'Academic': 'bg-accent text-accent-foreground',
        'Student Assistantship': 'bg-secondary text-secondary-foreground',
        'Performing Arts': 'bg-muted text-muted-foreground',
        'Economic Assistance': 'bg-primary text-primary-foreground'
    };
    return colors[type] || 'bg-secondary text-secondary-foreground';
};

export default function ViewScholarships(): React.ReactElement {
    const [selectedType, setSelectedType] = useState<ScholarshipType | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'name'>('deadline');

    // Filter scholarships based on search and type
    const filteredScholarships = scholarships
        .filter(scholarship => {
            const matchesSearch =
                scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = selectedType === 'all' || scholarship.type === selectedType;

            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'deadline':
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'amount':
                    return parseInt(a.amount.replace(/[^\d]/g, '')) - parseInt(b.amount.replace(/[^\d]/g, ''));
                default:
                    return 0;
            }
        });

    const deadlineSoon = scholarships.filter(
        s => new Date(s.deadline) <= new Date(new Date().setDate(new Date().getDate() + 30))
    ).length;

    const renderFilterBar = (): React.ReactElement => (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
                <Label htmlFor="search">Search Scholarships</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
            <div className="w-full md:w-48">
                <Label htmlFor="type">Filter by Type</Label>
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ScholarshipType | 'all')}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Student Assistantship">Student Assistantship</SelectItem>
                        <SelectItem value="Performing Arts">Performing Arts</SelectItem>
                        <SelectItem value="Economic Assistance">Economic Assistance</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full md:w-48">
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'deadline' | 'amount' | 'name')}>
                    <SelectTrigger id="sort">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scholarships">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                {/* Hero section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Scholarships</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Explore MinSU's official scholarship programs designed to support academic excellence, talent development, and equal access to education.
                    </p>
                </div>

                {/* Stats section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Programs</p>
                                <p className="text-xl font-semibold text-card-foreground">{scholarships.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Deadlines Soon</p>
                                <p className="text-xl font-semibold text-card-foreground">{deadlineSoon}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <School className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Academic</p>
                                <p className="text-xl font-semibold text-card-foreground">{scholarships.filter(s => s.type === 'Academic').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Assistantship</p>
                                <p className="text-xl font-semibold text-card-foreground">{scholarships.filter(s => s.type === 'Student Assistantship').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter bar */}
                {renderFilterBar()}

                {/* Scholarships Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredScholarships.map((scholarship) => (
                        <div
                            key={scholarship.id}
                            className="group bg-card rounded-lg border border-border hover:border-primary transition-colors duration-200"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge className={getTypeColor(scholarship.type)}>
                                        {scholarship.type}
                                    </Badge>
                                    <Badge variant={scholarship.status === 'open' ? 'default' : 'secondary'}>
                                        {scholarship.status === 'open' ? 'Accepting Applications' : 'Closed'}
                                    </Badge>
                                </div>

                                <h3 className="text-lg font-semibold mt-2 text-card-foreground">{scholarship.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{scholarship.description}</p>

                                <div className="space-y-3 mb-6 border-t border-border pt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span><strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Banknote className="w-4 h-4 text-primary" />
                                        <span><strong>Stipend:</strong> {scholarship.amount} ({scholarship.stipendSchedule})</span>
                                    </div>
                                    {scholarship.gwaRequirement && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                            <span>
                                                <strong>GWA Requirement:</strong> {scholarship.gwaRequirement.description}
                                                {scholarship.gwaRequirement.min && ` (${scholarship.gwaRequirement.min} - ${scholarship.gwaRequirement.max})`}
                                                {!scholarship.gwaRequirement.min && ` (max ${scholarship.gwaRequirement.max})`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="eligibility">
                                        <AccordionTrigger className="text-sm font-semibold">
                                            Eligibility Criteria
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc pl-4 text-sm space-y-1">
                                                {scholarship.eligibility.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="requirements">
                                        <AccordionTrigger className="text-sm font-semibold">
                                            Requirements
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc pl-4 text-sm space-y-1">
                                                {scholarship.requirements.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="renewal">
                                        <AccordionTrigger className="text-sm font-semibold">
                                            Renewal Criteria
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc pl-4 text-sm space-y-1">
                                                {scholarship.renewalCriteria.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <div className="mt-6 pt-4 border-t border-border">
                                    <Button className="w-full" variant="default">
                                        Apply Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
