import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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
                <div className="border-border border-b pb-6 lg:pb-8">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-foreground text-2xl font-semibold sm:text-3xl lg:text-4xl">Applications</h1>
                            <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
                                Track and manage your scholarship applications
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button asChild>
                                <Link href={route('student.scholarships.index')}>
                                    <Plus className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                                    Apply for Scholarship
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="mb-4">
                    <div className="mt-0 rounded-md border">
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
                                                <div className="text-foreground font-medium">#{app.id}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-foreground font-medium">{app.scholarship_name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-muted-foreground text-sm">{app.scholarship_type}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        app.status === 'approved'
                                                            ? 'default'
                                                            : app.status === 'rejected'
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{app.amount}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span>{app.progress}%</span>
                                                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                        <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${app.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(app.submitted_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-muted-foreground h-24 text-center text-base">
                                            No applications found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
