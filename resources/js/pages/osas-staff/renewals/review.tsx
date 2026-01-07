import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { RenewalApplication } from '@/types/models';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('osas.dashboard') },
    { title: 'Renewal Applications', href: route('renewal.staff.index') },
    { title: 'Review', href: '#' },
];

interface Props {
    renewal: RenewalApplication;
}

const statusConfig = {
    pending: {
        label: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
    },
    under_review: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: AlertCircle,
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
    },
};

export default function Review({ renewal }: Props) {
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const approveForm = useForm({
        notes: '',
    });

    const rejectForm = useForm({
        reason: '',
    });

    const status = statusConfig[renewal.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const handleApprove = () => {
        approveForm.post(route('renewal.staff.approve', renewal.id), {
            onSuccess: () => setApproveDialogOpen(false),
        });
    };

    const handleReject = () => {
        rejectForm.post(route('renewal.staff.reject', renewal.id), {
            onSuccess: () => setRejectDialogOpen(false),
        });
    };

    const canReview = ['pending', 'under_review'].includes(renewal.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Renewal Application" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('renewal.staff.index')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                                Review Renewal Application
                            </h1>
                            <p className="mt-1 text-gray-500">
                                Application ID: #{renewal.id}
                            </p>
                        </div>
                    </div>
                    <Badge className={status.color + ' px-4 py-2 text-sm'}>
                        <StatusIcon className="mr-2 h-4 w-4" />
                        {status.label}
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Student Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Student Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.student?.first_name} {renewal.student?.middle_name}{' '}
                                            {renewal.student?.last_name}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Student ID</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.student?.student_profile?.student_id ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Course</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.student?.student_profile?.course ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Year Level</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.student?.student_profile?.year_level ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="mt-1 font-semibold">{renewal.student?.email}</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Enrollment Status</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.student?.student_profile?.enrollment_status
                                                ?.replace('_', ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase()) ?? 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Renewal Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Renewal Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Renewal Period</p>
                                        <p className="mt-1 text-lg font-semibold">
                                            {renewal.renewal_semester} {renewal.renewal_year}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Current GWA</p>
                                        <p className="mt-1 text-lg font-semibold">
                                            {renewal.current_gwa?.toFixed(2) ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Submitted On</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.submitted_at
                                                ? new Date(renewal.submitted_at).toLocaleString()
                                                : 'Not submitted'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Documents</p>
                                        <p className="mt-1 font-semibold">
                                            {renewal.has_required_documents ? '✓ Complete' : '✗ Incomplete'}
                                        </p>
                                    </div>
                                </div>

                                {renewal.renewal_notes && (
                                    <div className="mt-4 rounded-lg border p-4">
                                        <p className="text-sm font-medium text-gray-500">Student Notes</p>
                                        <p className="mt-2">{renewal.renewal_notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Scholarship Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Scholarship Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Scholarship Name</span>
                                        <span className="font-medium">
                                            {renewal.original_application?.scholarship?.name ?? 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-medium">
                                            {renewal.original_application?.scholarship?.type
                                                ?.replace('_', ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase()) ?? 'N/A'}
                                        </span>
                                    </div>
                                    {renewal.original_application?.scholarship?.amount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Amount</span>
                                            <span className="font-medium">
                                                ₱
                                                {renewal.original_application.scholarship.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Original Application Status</span>
                                        <span className="font-medium">
                                            {renewal.original_application?.status
                                                ?.replace('_', ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase()) ?? 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        {renewal.documents && renewal.documents.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submitted Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {renewal.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between rounded-lg border p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{doc.original_name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {doc.type} •{' '}
                                                            {(doc.file_size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    View
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Review Actions */}
                        {canReview && (
                            <Card className="border-2 border-blue-200 dark:border-blue-800">
                                <CardHeader>
                                    <CardTitle>Review Actions</CardTitle>
                                    <CardDescription>
                                        Approve or reject this renewal application
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => setApproveDialogOpen(true)}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Approve Renewal
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setRejectDialogOpen(true)}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject Renewal
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5" />
                                    Application Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <div className="h-full w-0.5 bg-gray-200" />
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium">Application Created</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(renewal.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                    renewal.submitted_at
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {renewal.submitted_at ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : (
                                                    <Clock className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="h-full w-0.5 bg-gray-200" />
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium">Submitted</p>
                                            <p className="text-sm text-gray-500">
                                                {renewal.submitted_at
                                                    ? new Date(renewal.submitted_at).toLocaleString()
                                                    : 'Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                    renewal.status === 'approved'
                                                        ? 'bg-green-100 text-green-600'
                                                        : renewal.status === 'rejected'
                                                          ? 'bg-red-100 text-red-600'
                                                          : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {renewal.status === 'approved' ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : renewal.status === 'rejected' ? (
                                                    <XCircle className="h-4 w-4" />
                                                ) : (
                                                    <Clock className="h-4 w-4" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium">Decision</p>
                                            <p className="text-sm text-gray-500">
                                                {renewal.reviewed_at
                                                    ? new Date(renewal.reviewed_at).toLocaleString()
                                                    : 'Awaiting review'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Previous Reviewer */}
                        {renewal.reviewer && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5" />
                                        Reviewed By
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium">
                                        {renewal.reviewer.first_name} {renewal.reviewer.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {renewal.reviewed_at &&
                                            new Date(renewal.reviewed_at).toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Renewal Application</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve this renewal application for{' '}
                            {renewal.student?.first_name} {renewal.student?.last_name}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="approve-notes">Notes (Optional)</Label>
                            <Textarea
                                id="approve-notes"
                                placeholder="Add any notes for the student..."
                                value={approveForm.data.notes}
                                onChange={(e) => approveForm.setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleApprove}
                            disabled={approveForm.processing}
                        >
                            {approveForm.processing ? 'Processing...' : 'Approve'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Renewal Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this renewal application.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reject-reason">Rejection Reason *</Label>
                            <Textarea
                                id="reject-reason"
                                placeholder="Enter the reason for rejection..."
                                value={rejectForm.data.reason}
                                onChange={(e) => rejectForm.setData('reason', e.target.value)}
                                required
                            />
                            {rejectForm.errors.reason && (
                                <p className="text-sm text-red-600">{rejectForm.errors.reason}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={rejectForm.processing || !rejectForm.data.reason}
                        >
                            {rejectForm.processing ? 'Processing...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
