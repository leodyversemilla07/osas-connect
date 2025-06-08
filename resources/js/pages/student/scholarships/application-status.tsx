import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    FileText,
    Clock,
    CheckCircle,
    GraduationCap,
    AlertCircle,
    MessageSquare,
    Download
} from 'lucide-react';

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
        'draft': 'text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-800',
        'submitted': 'text-blue-800 bg-blue-100 dark:text-blue-300 dark:bg-blue-800',
        'under_verification': 'text-yellow-800 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-800',
        'verified': 'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-800',
        'under_evaluation': 'text-purple-800 bg-purple-100 dark:text-purple-300 dark:bg-purple-800',
        'approved': 'text-emerald-800 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-800',
        'rejected': 'text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-800',
        'incomplete': 'text-orange-800 bg-orange-100 dark:text-orange-300 dark:bg-orange-800',
        'pending': 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    };
    return colors[status] || 'text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
};

const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
        'draft': 'Draft',
        'submitted': 'Submitted',
        'under_verification': 'Under Verification',
        'verified': 'Verified',
        'under_evaluation': 'Under Evaluation',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'incomplete': 'Incomplete Documents',
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
                </Head>                <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                    <div className="text-center py-12 lg:py-16">
                        <div className="mx-auto max-w-md">
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">Application data not found.</p>
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
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6 lg:pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                Application Status
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 mt-2 lg:mt-3 leading-relaxed">
                                Track your scholarship application progress
                            </p>
                        </div>                        <Badge
                            variant="secondary"
                            className={`px-3 py-2 lg:px-4 lg:py-2.5 text-sm lg:text-base font-medium ${getStatusColor(application.status || 'draft')}`}
                        >
                            {getStatusLabel(application.status || 'draft')}
                        </Badge>
                    </div>
                </div>

                <Separator className="my-6 lg:my-8" />{/* Progress Overview */}
                <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4 lg:p-6">
                        <div className="space-y-4 lg:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">{application.scholarship_name || 'Unknown Scholarship'}</h3>
                                <span className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                                    Application #{application.id}
                                </span>
                            </div>
                            <Progress value={application.progress || 0} className="h-2 lg:h-3" />
                            <div className="flex justify-between text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                                <span>Created</span>
                                <span>Submitted</span>
                                <span>Review</span>
                                <span>Decision</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-6 lg:my-8" />{/* Application Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6 xl:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                        {/* Scholarship Information */}
                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                                    <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                    Scholarship Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                    <div className="space-y-1 lg:space-y-2">
                                        <label className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400">
                                            Scholarship Name
                                        </label>
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">{application.scholarship_name || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1 lg:space-y-2">
                                        <label className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400">
                                            Type
                                        </label>
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">{application.scholarship_type || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1 lg:space-y-2">
                                        <label className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400">
                                            Date Created
                                        </label>
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
                                            {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    {application.submitted_at && (
                                        <div className="space-y-1 lg:space-y-2">
                                            <label className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400">
                                                Date Submitted
                                            </label>
                                            <p className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
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
                                    <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                                        <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                        Statement of Purpose
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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
                                <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                                    <FileText className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                    Required Documents
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Documents required for your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3 lg:space-y-4">{application.documents && Object.keys(application.documents).length > 0 ? (
                                    Object.entries(application.documents).map(([type, doc]) => (
                                        <div key={type} className="flex items-center justify-between p-4 lg:p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-gray-100 leading-tight">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {doc.uploaded ? 'Uploaded' : 'Not uploaded'}
                                                    </p>
                                                </div>
                                            </div>                                                <div className="flex items-center gap-2 lg:gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs lg:text-sm font-medium ${getStatusColor(doc.status)}`}
                                                >
                                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                </Badge>
                                                {doc.uploaded && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="min-h-[44px] text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    >
                                                        <Download className="h-4 w-4 lg:h-5 lg:w-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 lg:py-16 text-gray-500 dark:text-gray-400">
                                        <FileText className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed">No documents required for this application.</p>
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
                                    <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                                        <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                        Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 lg:p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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
                                    <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                                        <Clock className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                        Application Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-4 lg:space-y-6">
                                        {timeline.map((item, index) => (
                                            <div key={index} className="flex gap-3 lg:gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`p-2 lg:p-3 rounded-full ${item.status === 'completed'
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                        : item.status === 'current'
                                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                                        }`}>
                                                        {getTimelineIcon(item.icon)}
                                                    </div>
                                                    {index < timeline.length - 1 && (
                                                        <div className="w-px h-8 lg:h-12 bg-gray-200 dark:bg-gray-700 mt-2 lg:mt-3" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4 lg:pb-6">
                                                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-gray-100 leading-tight">{item.title}</p>
                                                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed mt-1">{item.description}</p>
                                                    {item.date && (
                                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1 lg:mt-2">{item.date}</p>
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
                                    <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                                        <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                        Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <ul className="space-y-3 lg:space-y-4">
                                        {application.next_steps.map((step, index) => (
                                            <li key={index} className="flex items-start gap-2 lg:gap-3 text-sm sm:text-base lg:text-lg">
                                                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-900 dark:bg-gray-100 rounded-full mt-2 lg:mt-2.5 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <Separator className="my-4 lg:my-6" />

                        {/* Status-specific alerts */}
                        {application.status === 'incomplete' && (
                            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700 p-4 lg:p-6">
                                <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600 dark:text-orange-400" />
                                <AlertDescription className="text-sm sm:text-base lg:text-lg text-orange-800 dark:text-orange-200 leading-relaxed">
                                    Your application is incomplete. Please review the feedback and upload any missing documents.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'approved' && (
                            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700 p-4 lg:p-6">
                                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-sm sm:text-base lg:text-lg text-green-800 dark:text-green-200 leading-relaxed">
                                    Congratulations! Your scholarship application has been approved.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'rejected' && (
                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-4 lg:p-6">
                                <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-sm sm:text-base lg:text-lg text-red-800 dark:text-red-200 leading-relaxed">
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
