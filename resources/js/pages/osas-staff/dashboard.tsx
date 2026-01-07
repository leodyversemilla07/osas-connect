import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, Eye, FileCheck, FileText, MoreHorizontal, Users } from 'lucide-react';

// Import Shadcn UI components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
];

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
        pending: 'outline',
        submitted: 'outline',
        under_verification: 'secondary',
        approved: 'default',
        rejected: 'destructive',
        verified: 'default',
    };
    return variants[status] || 'secondary';
};

interface DashboardStats {
    pending_applications: number;
    pending_documents: number;
    approved_this_month: number;
    total_scholars: number;
}

export default function StaffDashboard() {
    const { pendingApplications = [], recentDocuments = [], stats } = usePage<
        SharedData & {
            pendingApplications: Array<{
                id: number;
                studentName: string;
                scholarshipName: string;
                dateSubmitted: string;
                status: string;
                studentId: string;
            }>;
            recentDocuments: Array<{
                id: number;
                studentName: string;
                documentType: string;
                submissionDate: string;
                status: string;
            }>;
            stats?: DashboardStats;
        }
    >().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OSAS Staff Dashboard" />

            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">OSAS Staff Dashboard</h1>

                {/* Stats Cards */}
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                            <ClipboardList className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.pending_applications ?? pendingApplications?.length ?? 0}</div>
                            <p className="text-muted-foreground text-xs">Awaiting review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
                            <FileCheck className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.pending_documents ?? recentDocuments?.length ?? 0}</div>
                            <p className="text-muted-foreground text-xs">Awaiting verification</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
                            <BookOpen className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.approved_this_month ?? 0}</div>
                            <p className="text-muted-foreground text-xs">Applications approved</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Scholars</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_scholars ?? 0}</div>
                            <p className="text-muted-foreground text-xs">Active scholarship recipients</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Applications */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Applications</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Scholarship</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingApplications?.slice(0, 5).map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.studentName}</TableCell>
                                            <TableCell>{app.scholarshipName}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{app.dateSubmitted}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Approve</DropdownMenuItem>
                                                        <DropdownMenuItem>Reject</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {pendingApplications?.length === 0 && (
                                <div className="flex h-24 items-center justify-center">
                                    <p className="text-muted-foreground">No pending applications</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href={route('osas.applications')}>
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        Review Applications
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href={route('osas.manage.scholarships')}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Manage Scholarships
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href={route('osas.renewals.index')}>
                                        <FileCheck className="mr-2 h-4 w-4" />
                                        Review Renewals
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href={route('osas.reports')}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Reports
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
