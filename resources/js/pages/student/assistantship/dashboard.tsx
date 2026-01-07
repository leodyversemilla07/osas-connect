import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    MapPin,
    Plus,
    User,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'Student Assistantship', href: '#' },
];

interface Assignment {
    id: number;
    status: string;
    hours_per_week: number;
    hourly_rate: number;
    start_date: string;
    end_date: string;
    work_schedule: Record<string, string>;
    duties_responsibilities: string;
    office: {
        name: string;
        location: string;
    };
    supervisor?: {
        first_name: string;
        last_name: string;
    };
}

interface WorkLog {
    id: number;
    work_date: string;
    time_in: string;
    time_out: string;
    hours_worked: number;
    hours_approved: number | null;
    status: string;
    tasks_performed: string;
}

interface Payment {
    id: number;
    period_start: string;
    period_end: string;
    total_hours: number;
    net_amount: number;
    status: string;
    released_at: string | null;
}

interface Props {
    summary: {
        has_assignment: boolean;
        assignment: Assignment | null;
        total_hours: number;
        pending_hours: number;
        total_earnings: number;
        pending_earnings: number;
    };
    recentLogs: WorkLog[];
    recentPayments: Payment[];
}

const statusColors: Record<string, string> = {
    pending_screening: 'bg-yellow-100 text-yellow-800',
    screening_scheduled: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    active: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    released: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function Dashboard({ summary, recentLogs, recentPayments }: Props) {
    const formatSchedule = (schedule: Record<string, string>) => {
        if (!schedule) return 'Not set';
        return Object.entries(schedule)
            .map(([day, time]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
            .join(', ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Assistantship" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                        Student Assistantship
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Manage your work hours and track your earnings
                    </p>
                </div>

                {summary.has_assignment && summary.assignment ? (
                    <>
                        {/* Stats Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                            <Clock className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Hours Worked</p>
                                            <p className="text-2xl font-bold">{summary.total_hours.toFixed(1)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                                            <FileText className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Pending Hours</p>
                                            <p className="text-2xl font-bold">{summary.pending_hours.toFixed(1)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                            <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Earnings</p>
                                            <p className="text-2xl font-bold">₱{summary.total_earnings.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                                            <Briefcase className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Pending Earnings</p>
                                            <p className="text-2xl font-bold">₱{summary.pending_earnings.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Assignment Details */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Assignment Details
                                    </CardTitle>
                                    <CardDescription>Your current work assignment</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Status</span>
                                        <Badge className={statusColors[summary.assignment.status]}>
                                            {summary.assignment.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Office</span>
                                        <p className="font-medium">{summary.assignment.office.name}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{summary.assignment.office.location}</span>
                                    </div>
                                    {summary.assignment.supervisor && (
                                        <div className="flex items-start gap-2">
                                            <User className="mt-0.5 h-4 w-4 text-gray-400" />
                                            <span className="text-sm">
                                                Supervisor: {summary.assignment.supervisor.first_name}{' '}
                                                {summary.assignment.supervisor.last_name}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                                        <span className="text-sm">
                                            {new Date(summary.assignment.start_date).toLocaleDateString()} -{' '}
                                            {new Date(summary.assignment.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <p className="text-sm font-medium text-gray-500">Work Schedule</p>
                                        <p className="mt-1 text-sm">{formatSchedule(summary.assignment.work_schedule)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Hours per Week</p>
                                        <p className="mt-1">{summary.assignment.hours_per_week} hours</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                                        <p className="mt-1">₱{summary.assignment.hourly_rate}/hour</p>
                                    </div>
                                    {summary.assignment.duties_responsibilities && (
                                        <div className="border-t pt-4">
                                            <p className="text-sm font-medium text-gray-500">Duties & Responsibilities</p>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {summary.assignment.duties_responsibilities}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Work Logs */}
                            <Card className="lg:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Work Hours</CardTitle>
                                        <CardDescription>Your recent work hour entries</CardDescription>
                                    </div>
                                    {summary.assignment.status === 'active' && (
                                        <Button asChild>
                                            <Link href={route('student.assistantship.log-hours')}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Log Hours
                                            </Link>
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {recentLogs.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Time</TableHead>
                                                    <TableHead>Hours</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentLogs.map((log) => (
                                                    <TableRow key={log.id}>
                                                        <TableCell>
                                                            {new Date(log.work_date).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            {log.time_in} - {log.time_out}
                                                        </TableCell>
                                                        <TableCell>
                                                            {log.hours_approved ?? log.hours_worked}h
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={statusColors[log.status]}>
                                                                {log.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">
                                            No work hours logged yet.
                                        </p>
                                    )}
                                    <div className="mt-4">
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={route('student.assistantship.hours-history')}>
                                                View All Hours
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Payments */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Payments</CardTitle>
                                    <CardDescription>Your payment history</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {recentPayments.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Period</TableHead>
                                                <TableHead>Hours</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Released</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentPayments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell>
                                                        {new Date(payment.period_start).toLocaleDateString()} -{' '}
                                                        {new Date(payment.period_end).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>{payment.total_hours}h</TableCell>
                                                    <TableCell>₱{payment.net_amount.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge className={statusColors[payment.status]}>
                                                            {payment.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {payment.released_at
                                                            ? new Date(payment.released_at).toLocaleDateString()
                                                            : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No payments yet.</p>
                                )}
                                <div className="mt-4">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={route('student.assistantship.payment-history')}>
                                            View All Payments
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    /* No Assignment State */
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                                <Briefcase className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">No Active Assignment</h3>
                            <p className="mt-2 max-w-md text-center text-gray-500">
                                You don't have an active student assistantship assignment yet. Apply for the
                                Student Assistantship Program to get started.
                            </p>
                            <Button className="mt-6" asChild>
                                <Link href={route('student.scholarships.index')}>
                                    Browse Scholarships
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
