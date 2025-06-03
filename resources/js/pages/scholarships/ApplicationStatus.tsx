import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Calendar, 
    FileText, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    Download,
    MessageSquare,
    Users,
    ArrowLeft
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface ApplicationDocument {
    name: string;
    path: string;
    uploaded_at: string;
    status: 'pending' | 'verified' | 'rejected';
}

interface Application {
    id: number;
    status: string;
    submitted_at: string;
    purpose_letter: string;
    documents: { [key: string]: ApplicationDocument };
    verifier_comments?: string;
    interview_schedule?: string;
    committee_recommendation?: string;
    evaluation_score?: number;
    scholarship: {
        name: string;
        type: string;
        amount: string;
    };
    timeline: {
        submitted: string;
        verification: string | null;
        evaluation: string | null;
        decision: string | null;
    };
}

interface ApplicationStatusProps {
    application: Application;
}

const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
        'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        'submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'under_verification': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'verified': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'under_evaluation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'approved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'incomplete': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

const getApplicationProgress = (status: string): number => {
    const progressMap: { [key: string]: number } = {
        'draft': 10,
        'submitted': 25,
        'under_verification': 40,
        'verified': 60,
        'under_evaluation': 80,
        'approved': 100,
        'rejected': 100,
        'incomplete': 30,
    };
    return progressMap[status] || 0;
};

export default function ApplicationStatus({ application }: ApplicationStatusProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Applications', href: '/student/scholarships/my-applications' },
        { title: `Application #${application.id}`, href: '#' },
    ];

    const progress = getApplicationProgress(application.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Application Status - {application.scholarship.name}</title>
                <meta name="description" content="Track your scholarship application status" />
            </Head>

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/student/scholarships/my-applications"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Applications
                        </Link>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Application Status
                        </h1>
                        <Badge className={getStatusColor(application.status)}>
                            {getStatusLabel(application.status)}
                        </Badge>
                    </div>

                    {/* Progress Overview */}
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{application.scholarship.name}</h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Application #{application.id}
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Submitted</span>
                                <span>Verification</span>
                                <span>Evaluation</span>
                                <span>Decision</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Scholarship Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Scholarship Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Scholarship Type
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">{application.scholarship.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Monthly Amount
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">{application.scholarship.amount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statement of Purpose */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Statement of Purpose
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {application.purpose_letter}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Submitted Documents
                                </CardTitle>
                                <CardDescription>
                                    All documents submitted with your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(application.documents).map(([type, doc]) => (
                                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-gray-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(doc.status)}>
                                                    {doc.status}
                                                </Badge>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments and Feedback */}
                        {(application.verifier_comments || application.committee_recommendation) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Feedback & Comments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {application.verifier_comments && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                Verification Comments
                                            </h4>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {application.verifier_comments}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {application.committee_recommendation && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                Committee Recommendation
                                            </h4>
                                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {application.committee_recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Application Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Submitted</p>
                                            <p className="text-xs text-gray-500">{application.timeline.submitted}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {application.timeline.verification ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Verification</p>
                                            <p className="text-xs text-gray-500">
                                                {application.timeline.verification || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {application.timeline.evaluation ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Evaluation</p>
                                            <p className="text-xs text-gray-500">
                                                {application.timeline.evaluation || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {application.timeline.decision ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Final Decision</p>
                                            <p className="text-xs text-gray-500">
                                                {application.timeline.decision || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interview Schedule */}
                        {application.interview_schedule && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Interview Schedule
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-yellow-600" />
                                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                Interview Scheduled
                                            </p>
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            {application.interview_schedule}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Evaluation Score */}
                        {application.evaluation_score && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Evaluation Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {application.evaluation_score}/100
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Overall Assessment
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status-specific alerts */}
                        {application.status === 'incomplete' && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Your application is incomplete. Please review the feedback and upload any missing documents.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'approved' && (
                            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    Congratulations! Your scholarship application has been approved. You will receive further instructions about stipend disbursement.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
