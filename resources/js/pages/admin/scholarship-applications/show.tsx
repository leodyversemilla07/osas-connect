import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    User,
    GraduationCap,
    FileText,
    Eye,
    Download
} from 'lucide-react';
import { router } from '@inertiajs/react';

interface Application {
    id: number;
    student: {
        id: number;
        name: string;
        email: string;
        student_id: string;
        course: string;
        year_level: string;
    };
    scholarship: {
        id: number;
        name: string;
        type: string;
        amount: number;
    };
    status: string;
    applied_at: string;
    approved_at: string | null;
    rejected_at: string | null;
    amount_received: number | null;
    reviewer: {
        name: string;
        email: string;
    } | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    application: Application;
}

const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Scholarship Applications', href: '/admin/scholarship-applications' },
    { title: 'Application Details', href: '#' },
];

export default function ScholarshipApplicationShow({ application }: Props) {
    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'approved': return 'default';
            case 'rejected': return 'destructive';
            case 'submitted':
            case 'under_verification':
            case 'under_evaluation': return 'secondary';
            default: return 'outline';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Application #${application.id} - Admin`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Application #{application.id}</h1>
                            <p className="text-muted-foreground">
                                Submitted on {formatDate(application.applied_at)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(application.status)} className="text-sm">
                            {formatStatus(application.status)}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Student Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Name</label>
                                <p className="font-medium">{application.student.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                                <p className="font-medium">{application.student.student_id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="font-medium">{application.student.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Course</label>
                                <p className="font-medium">{application.student.course}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Year Level</label>
                                <p className="font-medium">{application.student.year_level}</p>
                            </div>
                            <Separator />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.visit(`/admin/students/${application.student.id}`)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Student Profile
                            </Button>
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
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Scholarship Name</label>
                                <p className="font-medium">{application.scholarship.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Type</label>
                                <p className="font-medium">{application.scholarship.type}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                <p className="font-medium">{formatCurrency(application.scholarship.amount)}</p>
                            </div>
                            <Separator />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.visit(`/admin/scholarships/${application.scholarship.id}`)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Scholarship Details
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Application Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Application Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                                <p className="font-medium">
                                    <Badge variant={getStatusVariant(application.status)}>
                                        {formatStatus(application.status)}
                                    </Badge>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                                <p className="font-medium">{formatDate(application.applied_at)}</p>
                            </div>
                            {application.approved_at && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Approved Date</label>
                                    <p className="font-medium">{formatDate(application.approved_at)}</p>
                                </div>
                            )}
                            {application.rejected_at && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Rejected Date</label>
                                    <p className="font-medium">{formatDate(application.rejected_at)}</p>
                                </div>
                            )}
                            {application.amount_received && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Amount Received</label>
                                    <p className="font-medium">{formatCurrency(application.amount_received)}</p>
                                </div>
                            )}
                            {application.reviewer && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Reviewer</label>
                                    <p className="font-medium">{application.reviewer.name}</p>
                                    <p className="text-sm text-muted-foreground">{application.reviewer.email}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>
                            Manage this scholarship application
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download Application
                            </Button>
                            <Button variant="outline">
                                <FileText className="h-4 w-4 mr-2" />
                                View Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
