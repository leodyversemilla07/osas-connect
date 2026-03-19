import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatScholarshipCurrency, formatScholarshipDateTime, getScholarshipStatusBadgeClass } from '@/lib/scholarship-application';
import AppLayout from '@/layouts/app-layout';
import { ScholarshipApplicationDetail } from '@/types/scholarship-application';
import { Head, router } from '@inertiajs/react';
import { Download, Eye, FileText, GraduationCap, User } from 'lucide-react';

interface Props {
    application: ScholarshipApplicationDetail;
}

const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Scholarship Applications', href: '/admin/scholarship-applications' },
    { title: 'Application Details', href: '#' },
];

export default function ScholarshipApplicationShow({ application }: Props) {
    const student = application.student;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Application #${application.id} - Admin`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Application #{application.id}</h1>
                            <p className="text-muted-foreground">Submitted on {formatScholarshipDateTime(application.submitted_at)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getScholarshipStatusBadgeClass(application.status)}>{application.status_label}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                                <label className="text-muted-foreground text-sm font-medium">Name</label>
                                <p className="font-medium">{student?.name ?? 'Unknown Student'}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Student ID</label>
                                <p className="font-medium">{student?.student_id ?? 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Email</label>
                                <p className="font-medium">{student?.email ?? 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Course</label>
                                <p className="font-medium">{student?.course ?? 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Year Level</label>
                                <p className="font-medium">{student?.year_level ?? 'N/A'}</p>
                            </div>
                            <Separator />
                            <Button variant="outline" className="w-full" onClick={() => router.visit(`/admin/students/${student?.id ?? 0}`)}>
                                <Eye className="mr-2 h-4 w-4" />
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
                                <label className="text-muted-foreground text-sm font-medium">Scholarship Name</label>
                                <p className="font-medium">{application.scholarship.name}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Type</label>
                                <p className="font-medium">{application.scholarship.type_label}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Amount</label>
                                <p className="font-medium">{application.scholarship.amount_display}</p>
                            </div>
                            <Separator />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.visit(`/admin/scholarships/${application.scholarship.id}`)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
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
                                <label className="text-muted-foreground text-sm font-medium">Current Status</label>
                                <p className="font-medium">
                                    <Badge className={getScholarshipStatusBadgeClass(application.status)}>{application.status_label}</Badge>
                                </p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Applied Date</label>
                                <p className="font-medium">{formatScholarshipDateTime(application.submitted_at)}</p>
                            </div>
                            {application.approved_at && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Approved Date</label>
                                    <p className="font-medium">{formatScholarshipDateTime(application.approved_at)}</p>
                                </div>
                            )}
                            {application.rejected_at && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Rejected Date</label>
                                    <p className="font-medium">{formatScholarshipDateTime(application.rejected_at)}</p>
                                </div>
                            )}
                            {application.amount_received && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Amount Received</label>
                                    <p className="font-medium">{formatScholarshipCurrency(application.amount_received)}</p>
                                </div>
                            )}
                            {application.reviewer && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Reviewer</label>
                                    <p className="font-medium">{application.reviewer.name}</p>
                                    <p className="text-muted-foreground text-sm">{application.reviewer.email}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Manage this scholarship application</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download Application
                            </Button>
                            <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                View Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
