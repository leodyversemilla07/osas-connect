import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/osas-staff/dashboard' },
    { title: 'Student Assistantship', href: '#' },
];

interface Assignment {
    id: number;
    status: string;
    screening_date: string | null;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    office: {
        name: string;
    };
    application: {
        id: number;
    };
}

interface Office {
    id: number;
    name: string;
    code: string;
    max_assistants: number;
    active_count: number;
    remaining_slots: number;
    has_slots: boolean;
}

interface Props {
    statistics: {
        active_assignments: number;
        pending_screenings: number;
        pending_approvals: number;
        pending_payments: number;
        total_hours_this_month: number;
        total_paid_this_month: number;
    };
    pendingScreenings: Assignment[];
    offices: Office[];
}

const statusColors: Record<string, string> = {
    pending_screening: 'bg-yellow-100 text-yellow-800',
    screening_scheduled: 'bg-blue-100 text-blue-800',
    screening_completed: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-green-100 text-green-800',
    active: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function Dashboard({ statistics, pendingScreenings, offices }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Assistantship Management" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                            Student Assistantship Management
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Manage student assistants, screenings, work hours, and payments
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                                    <Users className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Active Assistants</p>
                                    <p className="text-xl font-bold">{statistics.active_assignments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                    <Calendar className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Pending Screenings</p>
                                    <p className="text-xl font-bold">{statistics.pending_screenings}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Pending Approvals</p>
                                    <p className="text-xl font-bold">{statistics.pending_approvals}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Pending Payments</p>
                                    <p className="text-xl font-bold">{statistics.pending_payments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
                                    <Clock className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Hours This Month</p>
                                    <p className="text-xl font-bold">{statistics.total_hours_this_month}h</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Paid This Month</p>
                                    <p className="text-xl font-bold">₱{statistics.total_paid_this_month.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    <Button asChild>
                        <Link href={route('osas.assistantship.assignments')}>
                            <Users className="mr-2 h-4 w-4" />
                            All Assignments
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('osas.assistantship.pending-approvals')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Approve Hours
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('osas.assistantship.payments')}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Manage Payments
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('osas.assistantship.offices')}>
                            <Building2 className="mr-2 h-4 w-4" />
                            Manage Offices
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Pending Screenings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Pending Screenings
                            </CardTitle>
                            <CardDescription>Students awaiting pre-hiring screening</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingScreenings.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Office</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingScreenings.slice(0, 5).map((assignment) => (
                                            <TableRow key={assignment.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">
                                                            {assignment.user.first_name} {assignment.user.last_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {assignment.user.email}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{assignment.office.name}</TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[assignment.status]}>
                                                        {assignment.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('osas.assistantship.assignments.show', assignment.id)}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No pending screenings</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Office Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Office Availability
                            </CardTitle>
                            <CardDescription>Available slots in each office</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {offices.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Office</TableHead>
                                            <TableHead>Active</TableHead>
                                            <TableHead>Available</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {offices.map((office) => (
                                            <TableRow key={office.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{office.name}</p>
                                                        <p className="text-xs text-gray-500">{office.code}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {office.active_count}/{office.max_assistants}
                                                </TableCell>
                                                <TableCell>{office.remaining_slots}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            office.has_slots
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }
                                                    >
                                                        {office.has_slots ? 'Available' : 'Full'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No offices configured</p>
                                    <Button className="mt-4" asChild>
                                        <Link href={route('osas.assistantship.offices')}>
                                            Add Office
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
