import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import renewalRoutes from '@/routes/renewal';
import student from '@/routes/student';
import { BreadcrumbItem } from '@/types';
import { RenewalApplication } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    MessageSquare,
    User,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'My Applications', href: '/student/scholarships/my-applications' },
    { title: 'Renewal Status', href: '#' },
];

interface Props {
    renewal: RenewalApplication;
}

const statusConfig = {
    pending: {
        label: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
        description: 'Your renewal application is waiting to be reviewed by OSAS staff.',
    },
    under_review: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: AlertCircle,
        description: 'Your renewal application is currently being reviewed.',
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
        description: 'Congratulations! Your scholarship renewal has been approved.',
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
        description: 'Unfortunately, your renewal application was not approved.',
    },
};

export default function Show({ renewal }: Props) {
    const status = statusConfig[renewal.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Renewal Application Status" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                                Renewal Application Status
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Track the progress of your scholarship renewal
                            </p>
                        </div>
                        <Badge className={status.color + ' px-4 py-2 text-sm'}>
                            <StatusIcon className="mr-2 h-4 w-4" />
                            {status.label}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Status Card */}
                        <Card
                            className={`border-2 ${
                                renewal.status === 'approved'
                                    ? 'border-green-200 dark:border-green-800'
                                    : renewal.status === 'rejected'
                                      ? 'border-red-200 dark:border-red-800'
                                      : 'border-blue-200 dark:border-blue-800'
                            }`}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`rounded-full p-3 ${
                                            renewal.status === 'approved'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : renewal.status === 'rejected'
                                                  ? 'bg-red-100 dark:bg-red-900/30'
                                                  : 'bg-blue-100 dark:bg-blue-900/30'
                                        }`}
                                    >
                                        <StatusIcon
                                            className={`h-8 w-8 ${
                                                renewal.status === 'approved'
                                                    ? 'text-green-600'
                                                    : renewal.status === 'rejected'
                                                      ? 'text-red-600'
                                                      : 'text-blue-600'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">{status.label}</h2>
                                        <p className="mt-1 text-gray-500">{status.description}</p>
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
                            <CardContent className="space-y-4">
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
                                        <p className="mt-1 text-lg font-semibold">
                                            {renewal.submitted_at
                                                ? new Date(renewal.submitted_at).toLocaleDateString()
                                                : 'Not submitted'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-500">Reviewed On</p>
                                        <p className="mt-1 text-lg font-semibold">
                                            {renewal.reviewed_at
                                                ? new Date(renewal.reviewed_at).toLocaleDateString()
                                                : 'Pending review'}
                                        </p>
                                    </div>
                                </div>
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
                                <div className="space-y-3">
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
                                                ₱{renewal.original_application.scholarship.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes/Feedback */}
                        {renewal.renewal_notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        {renewal.status === 'rejected' ? 'Rejection Reason' : 'Notes'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">{renewal.renewal_notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
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
                                            <p className="font-medium">Application Submitted</p>
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
                                                    renewal.status !== 'pending'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {renewal.status !== 'pending' ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : (
                                                    <Clock className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="h-full w-0.5 bg-gray-200" />
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium">Under Review</p>
                                            <p className="text-sm text-gray-500">
                                                {renewal.status !== 'pending'
                                                    ? 'Review in progress'
                                                    : 'Waiting for review'}
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
                                                    : 'Awaiting decision'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviewer Info */}
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
                                    <p className="text-sm text-gray-500">OSAS Staff</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={student.applications.url()}>
                                        Back to My Applications
                                    </Link>
                                </Button>
                                {renewal.status === 'rejected' && renewal.original_application && (
                                    <Button variant="default" className="w-full" asChild>
                                        <Link href={renewalRoutes.checkEligibility(renewal.original_application.id).url}>
                                            Check Eligibility Again
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
