import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import studentRoutes from '@/routes/student';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/student/dashboard',
    },
];

type ApplicationStatus = 'approved' | 'rejected' | 'submitted' | 'under_verification' | 'under_evaluation' | 'verified' | 'incomplete' | 'draft';

interface StudentDashboardProps {
    student: {
        first_name?: string;
    };
    availableScholarships: Array<{
        id: number;
        name: string;
        type: string;
        amount: string;
        deadline: string;
    }>;
    recentApplications: Array<{
        id: number;
        scholarship_name: string;
        status: ApplicationStatus;
        submitted_at: string;
        progress: number;
    }>;
    totalApplications: number;
    approvedScholarships: number;
}

const getStatusVariant = (status: ApplicationStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (status === 'approved' || status === 'verified') {
        return 'default';
    }

    if (status === 'rejected') {
        return 'destructive';
    }

    if (status === 'submitted' || status === 'draft') {
        return 'outline';
    }

    return 'secondary';
};

const formatStatus = (status: string): string => {
    return status
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

export default function StudentDashboard({
    student,
    availableScholarships,
    recentApplications,
    totalApplications,
    approvedScholarships,
}: StudentDashboardProps) {
    const activeApplications = Math.max(totalApplications - approvedScholarships, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />

            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                <div className="border-border border-b pb-6 lg:pb-8">
                    <h1 className="text-foreground text-2xl font-semibold sm:text-3xl lg:text-4xl">
                        Welcome back{student?.first_name ? `, ${student.first_name}` : ''}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">Track your scholarship progress and available opportunities.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{totalApplications}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Approved Scholarships</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{approvedScholarships}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{activeApplications}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Open Scholarships</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{availableScholarships.length}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between gap-2">
                            <CardTitle>Recent Applications</CardTitle>
                            <Button variant="outline" asChild>
                                <Link href={studentRoutes.applications.url()}>View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Scholarship</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentApplications.length > 0 ? (
                                        recentApplications.map((application) => (
                                            <TableRow key={application.id}>
                                                <TableCell className="font-medium">{application.scholarship_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(application.status)}>{formatStatus(application.status)}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={application.progress} className="h-2" />
                                                        <span className="text-muted-foreground min-w-9 text-xs">{application.progress}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-muted-foreground text-center">
                                                No recent applications yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between gap-2">
                            <CardTitle>Available Scholarships</CardTitle>
                            <Button variant="outline" asChild>
                                <Link href={studentRoutes.scholarships.index.url()}>Browse</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {availableScholarships.length > 0 ? (
                                availableScholarships.slice(0, 4).map((scholarship) => (
                                    <div key={scholarship.id} className="border-border rounded-md border p-3">
                                        <p className="text-sm font-medium">{scholarship.name}</p>
                                        <p className="text-muted-foreground mt-1 text-xs">{scholarship.amount}</p>
                                        <p className="text-muted-foreground text-xs">Deadline: {scholarship.deadline}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm">No open scholarships at the moment.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
