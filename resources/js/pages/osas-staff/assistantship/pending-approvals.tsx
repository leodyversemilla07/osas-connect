import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, Clock, Search, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/osas-staff/dashboard' },
    { title: 'Student Assistantship', href: '/osas-staff/assistantship' },
    { title: 'Pending Approvals', href: '#' },
];

interface WorkLog {
    id: number;
    work_date: string;
    time_in: string;
    time_out: string;
    hours_worked: number;
    tasks_performed: string;
    status: string;
    assignment: {
        id: number;
        user: {
            id: number;
            first_name: string;
            last_name: string;
        };
        office: {
            name: string;
        };
    };
}

interface Office {
    id: number;
    name: string;
    code: string;
}

interface Props {
    pendingLogs: {
        data: WorkLog[];
        links: any;
        meta?: any;
    };
    offices: Office[];
    filters: {
        office_id?: string;
    };
}

export default function PendingApprovals({ pendingLogs, offices, filters }: Props) {
    const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
    const [hoursApproved, setHoursApproved] = useState('');
    const [remarks, setRemarks] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = (log: WorkLog) => {
        router.post(
            route('osas.assistantship.hours.approve', log.id),
            {
                hours_approved: hoursApproved || log.hours_worked,
                remarks,
            },
            {
                onSuccess: () => {
                    setSelectedLog(null);
                    setHoursApproved('');
                    setRemarks('');
                },
            }
        );
    };

    const handleReject = (log: WorkLog) => {
        router.post(
            route('osas.assistantship.hours.reject', log.id),
            { reason: rejectReason },
            {
                onSuccess: () => {
                    setSelectedLog(null);
                    setRejectReason('');
                },
            }
        );
    };

    const handleFilterChange = (officeId: string) => {
        router.get(route('osas.assistantship.pending-approvals'), {
            office_id: officeId === 'all' ? undefined : officeId,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Work Hour Approvals" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('osas.assistantship.dashboard')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                                Pending Work Hour Approvals
                            </h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                Review and approve student work hour entries
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-64">
                        <Select
                            value={filters.office_id || 'all'}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by office" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Offices</SelectItem>
                                {offices.map((office) => (
                                    <SelectItem key={office.id} value={office.id.toString()}>
                                        {office.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Pending Entries
                        </CardTitle>
                        <CardDescription>
                            {pendingLogs.data.length} entries awaiting approval
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingLogs.data.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Office</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Tasks</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingLogs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <p className="font-medium">
                                                    {log.assignment.user.first_name}{' '}
                                                    {log.assignment.user.last_name}
                                                </p>
                                            </TableCell>
                                            <TableCell>{log.assignment.office.name}</TableCell>
                                            <TableCell>
                                                {new Date(log.work_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {log.time_in} - {log.time_out}
                                            </TableCell>
                                            <TableCell>{log.hours_worked}h</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {log.tasks_performed || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => {
                                                            setSelectedLog(log);
                                                            setHoursApproved(log.hours_worked.toString());
                                                        }}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setSelectedLog(log)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Check className="h-12 w-12 text-green-500" />
                                <p className="mt-4 text-lg font-medium">All caught up!</p>
                                <p className="text-gray-500">No pending approvals at this time.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Approval Modal */}
                {selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>
                                    {hoursApproved ? 'Approve Work Hours' : 'Reject Work Hours'}
                                </CardTitle>
                                <CardDescription>
                                    {selectedLog.assignment.user.first_name}{' '}
                                    {selectedLog.assignment.user.last_name} -{' '}
                                    {new Date(selectedLog.work_date).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium">
                                            {selectedLog.time_in} - {selectedLog.time_out}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Hours</p>
                                        <p className="font-medium">{selectedLog.hours_worked}h</p>
                                    </div>
                                </div>

                                {hoursApproved !== '' ? (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium">Approved Hours</label>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                value={hoursApproved}
                                                onChange={(e) => setHoursApproved(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Remarks (optional)
                                            </label>
                                            <Input
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder="Any notes for this approval"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(selectedLog)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedLog(null);
                                                    setHoursApproved('');
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium">Rejection Reason</label>
                                            <Input
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Explain why this entry is being rejected"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="destructive"
                                                className="flex-1"
                                                onClick={() => handleReject(selectedLog)}
                                                disabled={!rejectReason}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedLog(null);
                                                    setRejectReason('');
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
