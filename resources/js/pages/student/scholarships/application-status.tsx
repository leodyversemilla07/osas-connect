import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Download, FileText, GraduationCap, MessageSquare } from 'lucide-react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface TimelineItem {
    title: string;
    description: string;
    date: string | null;
    status: 'current' | 'completed' | 'pending';
    icon: string;
}

interface ApplicationDocument {
    name: string;
    uploaded: boolean;
    status: 'pending' | 'verified' | 'rejected';
}

interface ApplicationData {
    id: number;
    scholarship_name: string;
    scholarship_type: string;
    status: string;
    submitted_at: string | null;
    created_at: string;
    progress: number;
    purpose_letter?: string;
    verifier_comments?: string;
    next_steps?: string[];
    documents?: { [key: string]: ApplicationDocument };
}

interface ApplicationStatusProps {
    application?: ApplicationData;
    timeline?: TimelineItem[];
}

const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
        draft: 'text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-800',
        submitted: 'text-blue-800 bg-blue-100 dark:text-blue-300 dark:bg-blue-800',
        under_verification: 'text-yellow-800 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-800',
        verified: 'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-800',
        under_evaluation: 'text-purple-800 bg-purple-100 dark:text-purple-300 dark:bg-purple-800',
        approved: 'text-emerald-800 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-800',
        rejected: 'text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-800',
        incomplete: 'text-orange-800 bg-orange-100 dark:text-orange-300 dark:bg-orange-800',
        end: 'text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-800',
    };
    return colors[status] || 'text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
};

const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
        draft: 'Draft',
        submitted: 'Submitted',
        under_verification: 'Under Verification',
        verified: 'Verified',
        under_evaluation: 'Under Evaluation',
        approved: 'Approved',
        rejected: 'Rejected',
        incomplete: 'Incomplete Documents',
        end: 'Completed',
    };
    return labels[status] || status;
};

const getTimelineIcon = (icon: string) => {
    switch (icon) {
        case 'file-text':
            return <FileText className="h-4 w-4 lg:h-5 lg:w-5" />;
        case 'eye':
            return <Clock className="h-4 w-4 lg:h-5 lg:w-5" />;
        case 'document-check':
            return <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />;
        case 'academic-cap':
            return <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5" />;
        case 'check-badge':
            return <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />;
        case 'x-circle':
            return <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5" />;
        default:
            return <Clock className="h-4 w-4 lg:h-5 lg:w-5" />;
    }
};

export default function ApplicationStatus({ application, timeline }: ApplicationStatusProps) {
    // Add safety checks
    if (!application) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head>
                    <title>Application Status</title>
                    <meta name="description" content="Track your scholarship application status" />
                </Head>{' '}
                <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                    <div className="py-12 text-center lg:py-16">
                        <div className="mx-auto max-w-md">
                            <p className="text-sm leading-relaxed text-gray-500 sm:text-base dark:text-gray-400">Application data not found.</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Applications', href: '/student/applications' },
        { title: `Application #${application.id || 'Unknown'}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>{`Application Status - ${application.scholarship_name || 'Unknown Scholarship'}`}</title>
                <meta name="description" content="Track your scholarship application status" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                {/* Header */}
                <div className="border-b border-gray-100 pb-6 lg:pb-8 dark:border-gray-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl leading-tight font-semibold text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
                                Application Status
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base lg:mt-3 lg:text-lg dark:text-gray-400">
                                Track your scholarship application progress
                            </p>
                        </div>{' '}
                        <Badge
                            variant="secondary"
                            className={`px-3 py-2 text-sm font-medium lg:px-4 lg:py-2.5 lg:text-base ${getStatusColor(application.status || 'draft')}`}
                        >
                            {getStatusLabel(application.status || 'draft')}
                        </Badge>
                    </div>
                </div>

                <Separator className="my-6 lg:my-8" />
                {/* Progress Overview */}
                <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4 lg:p-6">
                        <div className="space-y-4 lg:space-y-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <h3 className="text-lg leading-tight font-semibold text-gray-900 sm:text-xl lg:text-2xl dark:text-gray-100">
                                    {application.scholarship_name || 'Unknown Scholarship'}
                                </h3>
                                <span className="text-sm font-medium text-gray-600 lg:text-base dark:text-gray-400">
                                    Application #{application.id}
                                </span>
                            </div>
                            <Progress value={application.progress || 0} className="h-2 lg:h-3" />
                            <div className="flex justify-between text-xs text-gray-500 sm:text-sm lg:text-base dark:text-gray-400">
                                <span>Created</span>
                                <span>Submitted</span>
                                <span>Review</span>
                                <span>Decision</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-6 lg:my-8" />
                {/* Application Details */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8">
                    {/* Main Content */}
                    <div className="space-y-4 lg:col-span-2 lg:space-y-6">
                        {/* Scholarship Information */}
                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-2 text-lg text-gray-900 sm:text-xl lg:gap-3 lg:text-2xl dark:text-gray-100">
                                    <GraduationCap className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
                                    Scholarship Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                                    <div className="space-y-1 lg:space-y-2">
                                        <label className="text-xs font-medium text-gray-500 sm:text-sm lg:text-base dark:text-gray-400">
                                            Scholarship Name
                                        </label>
                                        <p className="text-sm leading-relaxed text-gray-900 sm:text-base lg:text-lg dark:text-gray-100">
                                            {application.scholarship_name || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 lg:space-y-2">
                                        <label className="text-xs font-medium text-gray-500 sm:text-sm lg:text-base dark:text-gray-400">Type</label>
                                        <p className="text-sm leading-relaxed text-gray-900 sm:text-base lg:text-lg dark:text-gray-100">
                                            {application.scholarship_type || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 lg:space-y-2">
                                        <label className="text-xs font-medium text-gray-500 sm:text-sm lg:text-base dark:text-gray-400">
                                            Date Created
                                        </label>
                                        <p className="text-sm leading-relaxed text-gray-900 sm:text-base lg:text-lg dark:text-gray-100">
                                            {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    {application.submitted_at && (
                                        <div className="space-y-1 lg:space-y-2">
                                            <label className="text-xs font-medium text-gray-500 sm:text-sm lg:text-base dark:text-gray-400">
                                                Date Submitted
                                            </label>
                                            <p className="text-sm leading-relaxed text-gray-900 sm:text-base lg:text-lg dark:text-gray-100">
                                                {new Date(application.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Separator className="my-4 lg:my-6" />

                        {/* Statement of Purpose */}
                        {application.purpose_letter && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 sm:text-xl lg:gap-3 lg:text-2xl dark:text-gray-100">
                                        <MessageSquare className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
                                        Statement of Purpose
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 lg:p-6 dark:border-gray-700 dark:bg-gray-800">
                                        <p className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg dark:text-gray-300">
                                            {application.purpose_letter}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Separator className="my-4 lg:my-6" />

                        {/* Documents */}
                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-2 text-lg text-gray-900 sm:text-xl lg:gap-3 lg:text-2xl dark:text-gray-100">
                                    <FileText className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
                                    Required Documents
                                </CardTitle>
                                <CardDescription className="text-sm leading-relaxed text-gray-500 sm:text-base dark:text-gray-400">
                                    Documents required for your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3 lg:space-y-4">
                                    {application.documents && Object.keys(application.documents).length > 0 ? (
                                        Object.entries(application.documents).map(([type, doc]) => (
                                            <div
                                                key={type}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 lg:p-6 dark:border-gray-800"
                                            >
                                                <div className="flex items-center gap-3 lg:gap-4">
                                                    <FileText className="h-4 w-4 flex-shrink-0 text-gray-600 lg:h-5 lg:w-5 dark:text-gray-400" />
                                                    <div>
                                                        <p className="text-sm leading-tight font-medium text-gray-900 sm:text-base lg:text-lg dark:text-gray-100">
                                                            {doc.name}
                                                        </p>
                                                        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm lg:text-base dark:text-gray-400">
                                                            {doc.uploaded ? 'Uploaded' : 'Not uploaded'}
                                                        </p>
                                                    </div>
                                                </div>{' '}
                                                <div className="flex items-center gap-2 lg:gap-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs font-medium lg:text-sm ${getStatusColor(doc.status)}`}
                                                    >
                                                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                    </Badge>
                                                    {doc.uploaded && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="min-h-[44px] border-0 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                                                        >
                                                            <Download className="h-4 w-4 lg:h-5 lg:w-5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center text-gray-500 lg:py-16 dark:text-gray-400">
                                            <FileText className="mx-auto mb-4 h-12 w-12 opacity-50 lg:h-16 lg:w-16" />
                                            <p className="text-sm leading-relaxed sm:text-base lg:text-lg">
                                                No documents required for this application.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Separator className="my-4 lg:my-6" />

                        {/* Feedback */}
                        {application.verifier_comments && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 sm:text-xl lg:gap-3 lg:text-2xl dark:text-gray-100">
                                        <MessageSquare className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
                                        Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 lg:p-6 dark:border-blue-700 dark:bg-blue-900/20">
                                        <p className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg dark:text-gray-300">
                                            {application.verifier_comments}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Timeline */}
                        {timeline && timeline.length > 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 sm:text-xl lg:gap-3 lg:text-2xl dark:text-gray-100">
                                        <Clock className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
                                        Application Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-4 lg:space-y-6">
                                        {timeline.map((item, index) => (
                                            <div key={index} className="flex gap-3 lg:gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`rounded-full p-2 lg:p-3 ${
                                                            item.status === 'completed'
                                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                                : item.status === 'current'
                                                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                                        }`}
                                                    >
                                                        {getTimelineIcon(item.icon)}
                                                    </div>
                                                    {index < timeline.length - 1 && (
                                                        <div className="mt-2 h-8 w-px bg-gray-200 lg:mt-3 lg:h-12 dark:bg-gray-700" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4 lg:pb-6">
                                                    <p className="text-sm leading-tight font-medium text-gray-900 sm:text-base lg:text-lg dark:text-gray-100">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm lg:text-base dark:text-gray-400">
                                                        {item.description}
                                                    </p>
                                                    {item.date && (
                                                        <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 dark:text-gray-500">
                                                            {item.date}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Separator className="my-4 lg:my-6" />

                        {/* Next Steps */}
                        {application.next_steps && application.next_steps.length > 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader className="pb-4 lg:pb-6">
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 sm:text-xl lg:gap-3 lg:text-2xl dark:text-gray-100">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
                                        Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <ul className="space-y-3 lg:space-y-4">
                                        {application.next_steps.map((step, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm sm:text-base lg:gap-3 lg:text-lg">
                                                <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-900 lg:mt-2.5 lg:h-2 lg:w-2 dark:bg-gray-100" />
                                                <span className="leading-relaxed text-gray-700 dark:text-gray-300">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <Separator className="my-4 lg:my-6" />

                        {/* Status-specific alerts */}
                        {application.status === 'incomplete' && (
                            <Alert className="border-orange-200 bg-orange-50 p-4 lg:p-6 dark:border-orange-700 dark:bg-orange-900/20">
                                <AlertCircle className="h-4 w-4 text-orange-600 lg:h-5 lg:w-5 dark:text-orange-400" />
                                <AlertDescription className="text-sm leading-relaxed text-orange-800 sm:text-base lg:text-lg dark:text-orange-200">
                                    Your application is incomplete. Please review the feedback and upload any missing documents.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'approved' && (
                            <Alert className="border-green-200 bg-green-50 p-4 lg:p-6 dark:border-green-700 dark:bg-green-900/20">
                                <CheckCircle className="h-4 w-4 text-green-600 lg:h-5 lg:w-5 dark:text-green-400" />
                                <AlertDescription className="text-sm leading-relaxed text-green-800 sm:text-base lg:text-lg dark:text-green-200">
                                    Congratulations! Your scholarship application has been approved.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'rejected' && (
                            <Alert className="border-red-200 bg-red-50 p-4 lg:p-6 dark:border-red-700 dark:bg-red-900/20">
                                <AlertCircle className="h-4 w-4 text-red-600 lg:h-5 lg:w-5 dark:text-red-400" />
                                <AlertDescription className="text-sm leading-relaxed text-red-800 sm:text-base lg:text-lg dark:text-red-200">
                                    Your application was not approved at this time. You may apply for other available scholarships.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
