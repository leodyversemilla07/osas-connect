import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { GraduationCap, Calendar, Search, Filter, Info } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scholarships',
        href: '/scholarships',
    },
];

interface Scholarship {
    id: number;
    name: string;
    type: 'Merit-Based' | 'Need-Based' | 'Research' | 'Athletic' | 'Cultural';
    amount: string;
    deadline: string;
    description: string;
    eligibility: string[];
    requirements: string[];
    status: 'open' | 'closed';
}

// Sample scholarships data - replace with API call
const scholarships: Scholarship[] = [
    {
        id: 1,
        name: 'Academic Excellence Scholarship',
        type: 'Merit-Based',
        amount: '₱25,000',
        deadline: '2025-06-30',
        description: 'Awarded to students with outstanding academic performance and leadership potential.',
        eligibility: [
            'Minimum GPA of 1.75',
            'Full-time enrolled student',
            'Active in extracurricular activities'
        ],
        requirements: [
            'Official Transcript of Records',
            'Recommendation letter from faculty',
            'List of extracurricular activities',
            'Essay on academic goals'
        ],
        status: 'open'
    },
    {
        id: 2,
        name: 'Financial Need Grant',
        type: 'Need-Based',
        amount: '₱20,000',
        deadline: '2025-06-15',
        description: 'Supporting students from economically challenged backgrounds to pursue their education.',
        eligibility: [
            'Demonstrated financial need',
            'Full-time enrolled student',
            'Good academic standing'
        ],
        requirements: [
            'Parents\' Income Tax Return',
            'Barangay Certificate of Indigency',
            'Current grades report',
            'Personal statement'
        ],
        status: 'open'
    },
    {
        id: 3,
        name: 'Research Innovation Grant',
        type: 'Research',
        amount: '₱30,000',
        deadline: '2025-07-15',
        description: 'Supporting innovative research projects in various fields of study.',
        eligibility: [
            'Enrolled in thesis/research course',
            'Research proposal approved by advisor',
            'Minimum GPA of 2.0'
        ],
        requirements: [
            'Research proposal',
            'Faculty advisor recommendation',
            'Budget plan',
            'Timeline of activities'
        ],
        status: 'open'
    }
];

export default function Scholarships() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');

    const filteredScholarships = scholarships.filter(scholarship => {
        const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || scholarship.type === selectedType;
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type: string) => {
        const colors = {
            'Merit-Based': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
            'Need-Based': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
            'Research': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
            'Athletic': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
            'Cultural': 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scholarships">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                {/* Hero section */}
                <Card className="bg-gradient-to-r from-[#005a2d] to-[#008040] text-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="md:w-2/3">
                                <h1 className="text-3xl font-bold mb-4">Available Scholarships</h1>
                                <p className="text-white/90 text-lg">
                                    Discover and apply for scholarships that match your profile. We've made it easy to find financial support for your education.
                                </p>
                            </div>
                            <div className="md:w-1/3 flex justify-center">
                                <div className="w-24 h-24 rounded-full bg-[#febd12]/20 flex items-center justify-center">
                                    <GraduationCap className="w-12 h-12 text-[#febd12]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search scholarships..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-[200px]">
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Scholarship Type</SelectLabel>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Merit-Based">Merit-Based</SelectItem>
                                            <SelectItem value="Need-Based">Need-Based</SelectItem>
                                            <SelectItem value="Research">Research</SelectItem>
                                            <SelectItem value="Athletic">Athletic</SelectItem>
                                            <SelectItem value="Cultural">Cultural</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Scholarships Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredScholarships.map((scholarship) => (
                        <Card key={scholarship.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <CardTitle className="text-xl mb-2">{scholarship.name}</CardTitle>
                                        <Badge className={`${getTypeColor(scholarship.type)}`}>
                                            {scholarship.type}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-lg">{scholarship.amount}</span>
                                        <p className="text-sm text-muted-foreground">Grant Amount</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{scholarship.description}</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            Eligibility
                                        </h4>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                            {scholarship.eligibility.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Filter className="w-4 h-4" />
                                            Requirements
                                        </h4>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                            {scholarship.requirements.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="mt-auto pt-6">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Deadline: {scholarship.deadline}</span>
                                    </div>
                                    <Button>Apply Now</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
