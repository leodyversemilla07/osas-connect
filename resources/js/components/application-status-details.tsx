import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
    Clock, 
    FileText, 
    MessageSquare, 
    User, 
    Calendar, 
    CheckCircle, 
    XCircle,
    Eye,
    FileCheck,
    GraduationCap,
    Award,
    DollarSign,
    Upload
} from 'lucide-react';
import { 
    ApplicationStatusData,
    DocumentVerificationStatus 
} from '@/types/application-status';
import {
    getStatusBadgeConfig,
    getDocumentStatusConfig,
    getDocumentStatusLabel,
    getScholarshipTypeLabel,
    formatCurrency,
    formatDate,
    formatDateTime
} from '@/utils/application-status';

// Props interface using the imported types
interface ApplicationStatusDetailsProps {
    application: ApplicationStatusData;
    onDocumentUpload?: (documentType: string, file: File) => void;
    onViewDocument?: (documentType: string) => void;
    canUpdateDocuments?: boolean;
    canScheduleInterview?: boolean;
    canRecordStipend?: boolean;
}

const ApplicationStatusDetails: React.FC<ApplicationStatusDetailsProps> = ({
    application,
    onDocumentUpload,
    onViewDocument,
    canUpdateDocuments = false,
}) => {
    // Document status icons
    const getDocumentStatusIcon = (status: string, uploaded: boolean) => {
        if (!uploaded) return <Upload className="h-4 w-4 text-gray-400" />;
        
        switch (status) {
            case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
            case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
            default: return <FileText className="h-4 w-4 text-blue-600" />;
        }
    };

    // Timeline icons
    const getTimelineIcon = (iconName: string, status: string) => {
        const iconClass = `h-4 w-4 ${status === 'completed' ? 'text-green-600' : status === 'current' ? 'text-blue-600' : 'text-gray-400'}`;
        
        switch (iconName) {
            case 'document-plus': return <FileText className={iconClass} />;
            case 'check-circle': return <CheckCircle className={iconClass} />;
            case 'eye': return <Eye className={iconClass} />;
            case 'document-check': return <FileCheck className={iconClass} />;
            case 'academic-cap': return <GraduationCap className={iconClass} />;
            case 'check-badge': return <Award className={iconClass} />;
            case 'x-circle': return <XCircle className={iconClass} />;
            default: return <Clock className={iconClass} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Status */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {application.scholarship.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Application #{application.id}
                                </p>
                            </div>                            <Badge 
                                variant={getStatusBadgeConfig(application.status).variant} 
                                className={`text-sm ${getStatusBadgeConfig(application.status).className || ''}`}
                            >
                                {application.statusLabel}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Application Progress</span>
                                <span>{application.progressPercentage}%</span>
                            </div>
                            <Progress value={application.progressPercentage} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Submitted</span>
                                <span>Verification</span>
                                <span>Evaluation</span>
                                <span>Decision</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Alert */}
                    {application.status === 'approved' && (
                        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                Congratulations! Your scholarship application has been approved. You will receive further instructions about stipend disbursement.
                            </AlertDescription>
                        </Alert>
                    )}

                    {application.status === 'rejected' && (
                        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                We regret to inform you that your scholarship application was not approved at this time. Please check the feedback below for more details.
                            </AlertDescription>
                        </Alert>
                    )}

                    {application.status === 'under_verification' && (
                        <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertDescription>
                                Your application is currently under verification. Please ensure all required documents are uploaded and complete.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Scholarship Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Scholarship Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Scholarship Type
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100 capitalize">
                                        {getScholarshipTypeLabel(application.scholarship.type)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Monthly Amount
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {application.scholarship.amount}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <p className="text-gray-900 dark:text-gray-100 mt-1">
                                    {application.scholarship.description}
                                </p>
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
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {application.purposeLetter}
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
                                {application.documents.map((doc) => (
                                    <div key={doc.type} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getDocumentStatusIcon(doc.status, doc.uploaded)}
                                            <div>
                                                <p className="font-medium">{doc.name}</p>                                                {doc.uploaded && doc.uploadedAt && (
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded on {formatDate(doc.uploadedAt)}
                                                    </p>
                                                )}
                                                {doc.status === 'rejected' && (
                                                    <p className="text-sm text-red-600">Document needs to be re-uploaded</p>
                                                )}
                                            </div>
                                        </div>                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant={getDocumentStatusConfig(doc.status as DocumentVerificationStatus, doc.uploaded).variant}
                                                className="text-xs"
                                            >
                                                {getDocumentStatusLabel(doc.status as DocumentVerificationStatus, doc.uploaded)}
                                            </Badge>
                                            {doc.uploaded && onViewDocument && (
                                                <Button variant="outline" size="sm" onClick={() => onViewDocument(doc.type)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}                                            {canUpdateDocuments && (!doc.uploaded || doc.status === 'rejected') && (
                                                <label className="cursor-pointer">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <span>
                                                            <Upload className="h-4 w-4" />
                                                        </span>
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file && onDocumentUpload) {
                                                                onDocumentUpload(doc.type, file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interview Information */}
                    {application.interviewSchedule && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Interview Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="font-medium text-blue-900 dark:text-blue-100">
                                        {formatDateTime(application.interviewSchedule)}
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                        Please arrive 15 minutes early for your interview.
                                    </p>
                                </div>
                                {application.interviewNotes && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h4 className="font-medium mb-2">Interview Notes</h4>
                                        <p className="text-gray-700 dark:text-gray-300">{application.interviewNotes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Feedback and Comments */}
                    {(application.verifierComments || application.committeeRecommendation || application.adminRemarks) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Feedback & Comments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {application.verifierComments && (
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Verifier Comments
                                        </h4>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {application.verifierComments}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {application.committeeRecommendation && (
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Committee Recommendation
                                        </h4>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {application.committeeRecommendation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {application.adminRemarks && (
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Admin Remarks
                                        </h4>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {application.adminRemarks}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Stipend Information */}
                    {application.status === 'approved' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Stipend Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Total Amount Received
                                        </label>                                        <p className="text-lg font-semibold text-green-600">
                                            {formatCurrency(application.amountReceived || 0)}
                                        </p>
                                    </div>
                                    {application.lastStipendDate && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Last Release Date
                                            </label>                                            <p className="text-gray-900 dark:text-gray-100">
                                                {formatDate(application.lastStipendDate)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Student Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Student Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Student Number
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {application.student.studentNumber}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Course
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {application.student.course}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Year Level
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {application.student.yearLevel}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Application Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {application.timeline.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`mt-1 ${step.status === 'completed' ? 'text-green-600' : step.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {getTimelineIcon(step.icon, step.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${
                                                step.status === 'completed' ? 'text-green-700 dark:text-green-300' : 
                                                step.status === 'current' ? 'text-blue-700 dark:text-blue-300' : 
                                                'text-gray-500 dark:text-gray-400'
                                            }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {step.description}
                                            </p>
                                            {step.date && (
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {step.date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Important Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Application Started
                                </label>                                <p className="text-gray-900 dark:text-gray-100">
                                    {formatDate(application.createdAt)}
                                </p>
                            </div>
                            {application.submittedAt && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Submitted
                                    </label>                                    <p className="text-gray-900 dark:text-gray-100">
                                        {formatDate(application.submittedAt)}
                                    </p>
                                </div>
                            )}
                            {application.verifiedAt && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Verified
                                    </label>                                    <p className="text-gray-900 dark:text-gray-100">
                                        {formatDate(application.verifiedAt)}
                                    </p>
                                </div>
                            )}
                            {application.approvedAt && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Approved
                                    </label>                                    <p className="text-gray-900 dark:text-gray-100">
                                        {formatDate(application.approvedAt)}
                                    </p>
                                </div>
                            )}
                            {application.rejectedAt && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Rejected
                                    </label>                                    <p className="text-gray-900 dark:text-gray-100">
                                        {formatDate(application.rejectedAt)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ApplicationStatusDetails;
