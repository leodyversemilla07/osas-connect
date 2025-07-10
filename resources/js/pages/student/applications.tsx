import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Applications', href: '/student/applications' },
];

interface Application {
    id: number;
    scholarship_name: string;
    scholarship_type: string;
    status: string;
    submitted_at: string;
    updated_at: string;
    progress: number;
    amount: string;
    deadline: string;
    can_edit?: boolean;
    verifier_comments?: string;
    interview_schedule?: string;
}


interface MyApplicationsProps {
    applications: Application[];
    filters?: {
        search?: string;
    };
}

export default function MyApplications({ applications }: MyApplicationsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>My Applications</title>
                <meta name="description" content="Track and manage your scholarship applications" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                {/* Header Section */}
                <div className="border-b border-border pb-6 lg:pb-8">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">Applications</h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:text-lg">Track and manage your scholarship applications</p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button asChild>
                                <Link href={route('student.scholarships.index')}>
                                    <Plus className="h-4 w-4 mr-2 lg:h-5 lg:w-5" />
                                    Apply for Scholarship
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    My Applications
                                </CardTitle>
                                <div className="text-sm mt-1 text-muted-foreground">
                                    Complete list of your scholarship applications
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Scholarship</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Submitted</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications && applications.length > 0 ? (
                                        applications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell>
                                                    <div className="font-medium text-foreground">#{app.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-foreground">{app.scholarship_name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">{app.scholarship_type}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace(/_/g, ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {app.amount}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span>{app.progress}%</span>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${app.progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(app.submitted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center text-base text-muted-foreground">
                                                No applications found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
