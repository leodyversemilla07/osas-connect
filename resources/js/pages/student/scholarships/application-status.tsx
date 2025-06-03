import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
        'draft': 'border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300',
        'submitted': 'border-blue-200 text-blue-800 dark:border-blue-700 dark:text-blue-300',
        'under_verification': 'border-yellow-200 text-yellow-800 dark:border-yellow-700 dark:text-yellow-300',
        'verified': 'border-green-200 text-green-800 dark:border-green-700 dark:text-green-300',
        'under_evaluation': 'border-purple-200 text-purple-800 dark:border-purple-700 dark:text-purple-300',
        'approved': 'border-emerald-200 text-emerald-800 dark:border-emerald-700 dark:text-emerald-300',
        'rejected': 'border-red-200 text-red-800 dark:border-red-700 dark:text-red-300',
        'incomplete': 'border-orange-200 text-orange-800 dark:border-orange-700 dark:text-orange-300',
        'pending': 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400',
    };
    return colors[status] || 'border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300';
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
            return <FileText className="h-4 w-4" />;
        case 'eye':
            return <Clock className="h-4 w-4" />;
        case 'document-check':
            return <CheckCircle className="h-4 w-4" />;
        case 'academic-cap':
            return <GraduationCap className="h-4 w-4" />;
        case 'check-badge':
            return <CheckCircle className="h-4 w-4" />;
        case 'x-circle':
            return <AlertCircle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
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
                </Head>
                <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">Application data not found.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Applications', href: '/student/applications' },
        { title: `Application #${application.id || 'Unknown'}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>{`Application Status - ${application.scholarship_name || 'Unknown Scholarship'}`}</title>
                <meta name="description" content="Track your scholarship application status" />
            </Head>

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                                Application Status
                            </h1>
                            <p className="text-base text-gray-500 dark:text-gray-400">
                                Track your scholarship application progress
                            </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${getStatusColor(application.status || 'draft')}`}>
                            {getStatusLabel(application.status || 'draft')}
                        </span>
                    </div>
                </div>

                {/* Progress Overview */}
                <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{application.scholarship_name || 'Unknown Scholarship'}</h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Application #{application.id}
                                </span>
                            </div>
                            <Progress value={application.progress || 0} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Created</span>
                                <span>Submitted</span>
                                <span>Review</span>
                                <span>Decision</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Application Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Scholarship Information */}
                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <GraduationCap className="h-5 w-5" />
                                    Scholarship Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Scholarship Name
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">{application.scholarship_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Type
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">{application.scholarship_type || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Date Created
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    {application.submitted_at && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Date Submitted
                                            </label>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {new Date(application.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statement of Purpose */}
                        {application.purpose_letter && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                        <MessageSquare className="h-5 w-5" />
                                        Statement of Purpose
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {application.purpose_letter}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}                        {/* Documents */}
                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <FileText className="h-5 w-5" />
                                    Required Documents
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    Documents required for your application
                                </CardDescription>
                            </CardHeader>                            
                            <CardContent>
                                <div className="space-y-3">
                                    {application.documents && Object.keys(application.documents).length > 0 ? (
                                        Object.entries(application.documents).map(([type, doc]) => (
                                            <div key={type} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {doc.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {doc.uploaded ? 'Uploaded' : 'Not uploaded'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${getStatusColor(doc.status)}`}>
                                                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                    </span>
                                                    {doc.uploaded && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No documents required for this application.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feedback */}
                        {application.verifier_comments && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                        <MessageSquare className="h-5 w-5" />
                                        Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {application.verifier_comments}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        {timeline && timeline.length > 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                        <Clock className="h-5 w-5" />
                                        Application Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        {timeline.map((item, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`p-2 rounded-full ${item.status === 'completed'
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                        : item.status === 'current'
                                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                                        }`}>
                                                        {getTimelineIcon(item.icon)}
                                                    </div>
                                                    {index < timeline.length - 1 && (
                                                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                                                    {item.date && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.date}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Next Steps */}
                        {application.next_steps && application.next_steps.length > 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                        <CheckCircle className="h-5 w-5" />
                                        Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {application.next_steps.map((step, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 bg-gray-900 dark:bg-gray-100 rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status-specific alerts */}
                        {application.status === 'incomplete' && (
                            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
                                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                <AlertDescription className="text-orange-800 dark:text-orange-200">
                                    Your application is incomplete. Please review the feedback and upload any missing documents.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'approved' && (
                            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    Congratulations! Your scholarship application has been approved.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'rejected' && (
                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
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
