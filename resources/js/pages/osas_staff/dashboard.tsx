import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { ClipboardList, FileCheck, BookOpen, FileText, MoreHorizontal, Eye } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
        pending: 'outline',
        approved: 'default',
        rejected: 'destructive'
    };
    return variants[status] || 'secondary';
};

export default function StaffDashboard() {
    const { pendingApplications = [], recentDocuments = [] } = usePage<SharedData & {
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
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OSAS Staff Dashboard" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">OSAS Staff Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Applications
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingApplications?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Scholarships
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">
                                +180.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recent Documents
                            </CardTitle>
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recentDocuments?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +19% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Reports
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                +201 since last hour
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
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
                                                <Badge variant={getStatusVariant(app.status)}>
                                                    {app.status}
                                                </Badge>
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
                                <div className="flex items-center justify-center h-24">
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
                                    <a href="/applications">
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        Review Applications
                                    </a>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <a href="/documents">
                                        <FileCheck className="mr-2 h-4 w-4" />
                                        Manage Documents
                                    </a>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <a href="/scholarships">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Manage Scholarships
                                    </a>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <a href="/reports">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Generate Reports
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}