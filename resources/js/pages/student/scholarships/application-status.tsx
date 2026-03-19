import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    formatScholarshipDate,
    formatScholarshipDateTime,
    getScholarshipDocumentBadgeClass,
    getScholarshipDocumentStatusLabel,
    getScholarshipStatusBadgeClass,
    getTimelineIcon,
} from '@/lib/scholarship-application';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock3, FileText, GraduationCap, MessageSquare } from 'lucide-react';

import { ScholarshipApplicationDetail } from '@/types/scholarship-application';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface ApplicationStatusProps {
    application?: ScholarshipApplicationDetail;
}

export default function ApplicationStatus({ application }: ApplicationStatusProps) {
    if (!application) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title="Application Status" />
                <div className="flex h-full flex-1 items-center justify-center p-8">
                    <p className="text-muted-foreground">Application data not found.</p>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Applications', href: '/student/scholarships/applications' },
        { title: `Application #${application.id}`, href: '#' },
    ];

    const reviewFeedback = application.review_summary.feedback;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Application Status - ${application.scholarship.name}`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="border-b pb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold sm:text-3xl">Application Status</h1>
                            <p className="text-muted-foreground mt-2">Track your scholarship application progress and next steps.</p>
                        </div>
                        <Badge className={getScholarshipStatusBadgeClass(application.status)}>{application.status_label}</Badge>
                    </div>
                </div>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold">{application.scholarship.name}</h2>
                            <span className="text-muted-foreground text-sm">Application #{application.id}</span>
                        </div>
                        <Progress value={application.progress} className="h-3" />
                        <div className="text-muted-foreground grid grid-cols-4 text-xs sm:text-sm">
                            <span>Created</span>
                            <span>Verification</span>
                            <span>Evaluation</span>
                            <span className="text-right">Decision</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Scholarship Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-muted-foreground text-sm">Scholarship Name</p>
                                    <p className="font-medium">{application.scholarship.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Type</p>
                                    <p className="font-medium">{application.scholarship.type_label}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Amount</p>
                                    <p className="font-medium">{application.scholarship.amount_display}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Submitted</p>
                                    <p className="font-medium">{formatScholarshipDate(application.submitted_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {application.purpose_letter && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Statement of Purpose
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{application.purpose_letter}</p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Required Documents
                                </CardTitle>
                                <CardDescription>
                                    {application.document_summary.verified_count} of {application.document_summary.required_count} required documents verified
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {application.document_summary.items.map((document) => (
                                    <div key={document.type} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium">{document.name}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {document.uploaded
                                                    ? `Uploaded ${formatScholarshipDate(document.uploaded_at)}`
                                                    : document.required
                                                      ? 'Not uploaded yet'
                                                      : 'Optional document'}
                                            </p>
                                        </div>
                                        <Badge className={getScholarshipDocumentBadgeClass(document.status)}>
                                            {getScholarshipDocumentStatusLabel(document.status)}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {reviewFeedback && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        OSAS Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-100">
                                        {reviewFeedback}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock3 className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    {application.timeline.map((item, index) => {
                                        const Icon = getTimelineIcon(item);

                                        return (
                                            <div key={`${item.title}-${index}`} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`rounded-full p-2 ${
                                                            item.status === 'completed'
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                                : item.status === 'current'
                                                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    {index < application.timeline.length - 1 && <div className="mt-2 h-8 w-px bg-border" />}
                                                </div>
                                                <div className="flex-1 pb-2">
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                                    {item.date && <p className="text-muted-foreground mt-1 text-xs">{formatScholarshipDateTime(item.date)}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {application.next_steps.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {application.next_steps.map((step, index) => (
                                            <li key={`${step}-${index}`} className="flex gap-3 text-sm">
                                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground" />
                                                <span className="text-muted-foreground leading-relaxed">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <Separator />

                        {application.status === 'incomplete' && (
                            <Alert className="border-orange-200 bg-orange-50 text-orange-950 dark:border-orange-900/60 dark:bg-orange-950/20 dark:text-orange-100">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Your application needs additional or corrected documents before verification can continue.
                                </AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'approved' && (
                            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>Your scholarship application has been approved.</AlertDescription>
                            </Alert>
                        )}

                        {application.status === 'rejected' && (
                            <Alert className="border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-100">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>Your scholarship application was not approved at this time.</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
