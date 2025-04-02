import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Calendar, AlertCircle, GraduationCap, Eye, Upload, Award, Clock } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

// Helper function to get user's full name
const getUserFullName = (user: User): string => {
    if (user.middle_name) {
        return `${user.first_name} ${user.middle_name.charAt(0)}. ${user.last_name}`;
    }
    return `${user.first_name} ${user.last_name}`;
};

// Get profile completion percentage - in real app would come from API
const getProfileCompletionPercentage = (user: User): number => {
    const fields = [
        'first_name', 'last_name', 'email', 'student_id',
        'course', 'year_level', 'civil_status', 'sex',
        'date_of_birth', 'place_of_birth', 'address',
        'middle_name', 'mobile_number', 'major',
        'religion', 'avatar'
    ];

    const filledFields = fields.filter(field => user[field]).length;
    return Math.round((filledFields / fields.length) * 100);
};

interface Scholarship {
    id: number;
    name: string;
    amount: string;
    deadline: string;
    daysRemaining: number;
    type: 'Scholarship' | 'Financial Assistantship' | 'Student Assistantship Program';
    description: string;
}

const availableScholarships: Scholarship[] = [
    {
        id: 1,
        name: 'Academic Merit Scholarship',
        amount: 'PHP 5,000',
        deadline: '2025-04-15',
        daysRemaining: 5,
        type: 'Scholarship',
        description: 'For students with outstanding academic performance'
    },
    {
        id: 2,
        name: 'Need-Based Financial Aid',
        amount: 'PHP 3,000',
        deadline: '2025-05-01',
        daysRemaining: 21,
        type: 'Financial Assistantship',
        description: 'Financial support for economically disadvantaged students'
    },
    {
        id: 3,
        name: 'Library Assistant Program',
        amount: 'PHP 4,000',
        deadline: '2025-05-15',
        daysRemaining: 35,
        type: 'Student Assistantship Program',
        description: 'Work-study opportunity at the university library'
    }
];

const applications = [
    {
        id: 1,
        scholarshipName: 'Need-Based Scholarship',
        status: 'pending',
        dateSubmitted: '2025-03-25',
    },
    {
        id: 2,
        scholarshipName: 'Academic Excellence Award',
        status: 'approved',
        dateSubmitted: '2025-02-10',
    }
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const scholarshipColors = {
    'Scholarship': {
        badge: 'bg-[#005a2d]/10 text-[#005a2d] dark:bg-[#005a2d]/20 dark:text-[#23b14d]',
        card: 'border-[#005a2d]/20 dark:border-[#005a2d]/20',
        icon: 'text-[#005a2d] dark:text-[#23b14d]'
    },
    'Financial Assistantship': {
        badge: 'bg-[#febd12]/10 text-[#febd12] dark:bg-[#febd12]/20 dark:text-[#febd12]',
        card: 'border-[#febd12]/20 dark:border-[#febd12]/20',
        icon: 'text-[#febd12] dark:text-[#febd12]'
    },
    'Student Assistantship Program': {
        badge: 'bg-[#008040]/10 text-[#008040] dark:bg-[#008040]/20 dark:text-[#23b14d]',
        card: 'border-[#008040]/20 dark:border-[#008040]/20',
        icon: 'text-[#008040] dark:text-[#23b14d]'
    }
} as const;

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
} as const;

interface Document {
    id: number;
    name: string;
    status: 'pending' | 'approved' | 'rejected' | 'missing';
    required: boolean;
}

const requiredDocuments: Document[] = [
    { id: 1, name: 'Transcript of Records', status: 'approved', required: true },
    { id: 2, name: 'Certificate of Registration', status: 'missing', required: true },
    { id: 3, name: 'Income Tax Return', status: 'pending', required: true },
];

const activeAwards = [
    {
        id: 1,
        name: 'Merit Scholarship',
        amount: 'PHP 10,000',
        nextDisbursement: '2025-05-01',
        renewalDeadline: '2025-06-15',
        requirements: ['Maintain 2.0 GPA', 'Submit grades by May 30']
    }
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const fullName = getUserFullName(user);
    const profileComplete = getProfileCompletionPercentage(user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard | OSAS Connect" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-[#005a2d]/5 to-[#008040]/5 dark:from-[#005a2d]/10 dark:to-[#008040]/10">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold text-[#005a2d] dark:text-[#23b14d]">Welcome, {fullName}</h1>
                        <p className="text-muted-foreground">Manage your scholarship applications here</p>
                    </CardContent>
                </Card>

                {/* Main Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-[#005a2d]/5 dark:bg-[#005a2d]/10 border-none">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-[#005a2d] dark:text-[#23b14d]">{availableScholarships.length}</p>
                            <p className="text-sm text-muted-foreground">Available Scholarships</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#febd12]/5 dark:bg-[#febd12]/10 border-none">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-[#febd12]">
                                {applications.filter(a => a.status === 'approved').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Active Scholarships</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#008040]/5 dark:bg-[#008040]/10 border-none">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-[#008040] dark:text-[#23b14d]">{profileComplete}%</p>
                            <p className="text-sm text-muted-foreground">Profile Complete</p>
                            <Progress value={profileComplete} className="mt-2 bg-[#008040]/20 dark:bg-[#008040]/20" />
                        </CardContent>
                    </Card>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        {/* Document Center */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Document Center
                                </CardTitle>
                                <Button variant="outline" size="sm">Upload New</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {requiredDocuments.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>
                                                    {doc.status.toUpperCase()}
                                                </Badge>
                                                <span>{doc.name}</span>
                                            </div>
                                            {doc.status === 'missing' && (
                                                <Button size="sm" variant="outline">Upload</Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Awards */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Active Awards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activeAwards.map((award) => (
                                    <div key={award.id} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold">{award.name}</h3>
                                            <Badge variant="outline">{award.amount}</Badge>
                                        </div>
                                        <div className="text-sm space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Next Disbursement: {new Date(award.nextDisbursement).toLocaleDateString()}
                                            </div>
                                            <div className="border-t pt-2">
                                                <p className="font-semibold">Renewal Requirements:</p>
                                                <ul className="list-disc list-inside text-muted-foreground">
                                                    {award.requirements.map((req, i) => (
                                                        <li key={i}>{req}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                        {/* Applications Table */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>My Applications</CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/applications">View All</a>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {applications.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead className="w-[300px]">Scholarship Details</TableHead>
                                                    <TableHead className="w-[150px]">Status</TableHead>
                                                    <TableHead className="w-[150px]">Submitted</TableHead>
                                                    <TableHead className="w-[100px] text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {applications.map((app) => (
                                                    <TableRow key={app.id} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">
                                                            {app.scholarshipName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${
                                                                    app.status === 'approved' ? 'bg-green-500' :
                                                                    app.status === 'rejected' ? 'bg-red-500' :
                                                                    'bg-yellow-500'
                                                                }`} />
                                                                <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">
                                                                    {new Date(app.dateSubmitted).toLocaleDateString()}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(app.dateSubmitted).toLocaleTimeString()}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                asChild
                                                            >
                                                                <a 
                                                                    href={`/applications/${app.id}`}
                                                                    className="inline-flex items-center justify-center"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="mt-2">No applications yet</p>
                                        <Button className="mt-4" asChild>
                                            <a href="/scholarships">Browse Scholarships</a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Available Scholarships */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Scholarships</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {availableScholarships.map((scholarship) => {
                                        const colors = scholarshipColors[scholarship.type];
                                        return (
                                            <Card key={scholarship.id} className={colors.card}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className={`h-5 w-5 ${colors.icon}`} />
                                                        <h3 className="font-semibold">{scholarship.name}</h3>
                                                    </div>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {scholarship.description}
                                                    </p>
                                                    <Badge className={`mt-2 ${colors.badge}`}>
                                                        {scholarship.type}
                                                    </Badge>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-lg font-bold">{scholarship.amount}</span>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <Calendar className="mr-1 h-4 w-4" />
                                                            {scholarship.daysRemaining} days left
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        className="mt-3 w-full" 
                                                        variant={scholarship.type === 'Scholarship' ? 'default' : 
                                                                scholarship.type === 'Financial Assistantship' ? 'secondary' : 
                                                                'outline'}
                                                        asChild
                                                    >
                                                        <a href={`/scholarships/${scholarship.id}/apply`}>Apply Now</a>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
