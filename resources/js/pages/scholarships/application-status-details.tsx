import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ApplicationStatusDetails from '@/components/application-status-details';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Calendar, DollarSign } from 'lucide-react';
import { router } from '@inertiajs/react';
import { ApplicationStatus } from '@/types/application-status';

interface ApplicationStatusPageProps {
    application: {
        id: number;
        status: string;  // Laravel sends string, we'll cast to ApplicationStatus type in component
        statusLabel: string;
        submittedAt?: string;
        verifiedAt?: string;
        approvedAt?: string;
        rejectedAt?: string;
        createdAt: string;
        progressPercentage: number;
        purposeLetter: string;
        verifierComments?: string;
        committeeRecommendation?: string;
        adminRemarks?: string;
        interviewSchedule?: string;
        interviewNotes?: string;
        amountReceived?: number;
        lastStipendDate?: string;
        scholarship: {
            id: number;
            name: string;
            type: string;
            amount: string;
            description: string;
        };
        student: {
            id: number;
            name: string;
            course: string;
            studentNumber: string;
            yearLevel: string;
        };
        documents: Array<{
            type: string;
            name: string;
            required: boolean;
            uploaded: boolean;
            status: string;
            uploadedAt?: string;
            verifiedAt?: string;
        }>;
        timeline: Array<{
            title: string;
            description: string;
            date?: string;
            status: 'completed' | 'current' | 'pending';
            icon: string;
        }>;
    };
    can: {
        update_documents: boolean;
        schedule_interview: boolean;
        record_stipend: boolean;
    };
}

const ApplicationStatusPage: React.FC<ApplicationStatusPageProps> = ({
    application,
    can
}) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Applications', href: '/student/applications' },
        { title: `Application #${application.id}`, href: '#' },
    ];

    const handleDocumentUpload = (documentType: string, file: File) => {
        const formData = new FormData();
        formData.append('document', file);

        router.post(`/scholarship-applications/${application.id}/documents/${documentType}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                // Handle success - page will refresh with updated data
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
            }
        });
    };

    const handleViewDocument = (documentType: string) => {
        window.open(`/scholarship-applications/${application.id}/documents/${documentType}/view`, '_blank');
    };

    const handleDownloadApplication = () => {
        window.open(`/scholarship-applications/${application.id}/download`, '_blank');
    };

    const handleScheduleInterview = () => {
        router.get(`/scholarship-applications/${application.id}/schedule-interview`);
    };

    const handleRecordStipend = () => {
        router.get(`/scholarship-applications/${application.id}/record-stipend`);
    };

    const getPageTitle = () => {
        switch (application.status) {
            case 'approved': return 'Application Approved';
            case 'rejected': return 'Application Status';
            case 'under_verification': return 'Under Verification';
            case 'under_evaluation': return 'Under Evaluation';
            case 'verified': return 'Documents Verified';
            default: return 'Application Status';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>{getPageTitle()} - {application.scholarship.name}</title>
                <meta
                    name="description"
                    content={`Track your ${application.scholarship.name} scholarship application status and progress.`}
                />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/student/applications')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Applications
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDownloadApplication}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>

                        {/* Admin/Staff Actions */}
                        {can.schedule_interview && application.status === 'verified' && (
                            <Button
                                onClick={handleScheduleInterview}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                Schedule Interview
                            </Button>
                        )}

                        {can.record_stipend && application.status === 'approved' && (
                            <Button
                                onClick={handleRecordStipend}
                                className="flex items-center gap-2"
                            >
                                <DollarSign className="h-4 w-4" />
                                Record Stipend
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <ApplicationStatusDetails
                    application={{
                        ...application,
                        status: application.status as ApplicationStatus,
                        documents: application.documents.map(doc => ({
                            ...doc,
                            status: doc.status as 'pending' | 'verified' | 'rejected'
                        }))
                    }}
                    onDocumentUpload={handleDocumentUpload}
                    onViewDocument={handleViewDocument}
                    canUpdateDocuments={can.update_documents}
                    canScheduleInterview={can.schedule_interview}
                    canRecordStipend={can.record_stipend}
                />
            </div>
        </AppLayout>
    );
};

export default ApplicationStatusPage;
