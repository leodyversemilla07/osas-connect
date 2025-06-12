import { 
    ApplicationStatus, 
    DocumentVerificationStatus, 
    StatusBadgeConfig, 
    STATUS_PROGRESS_MAP,
    ApplicationStatusData
} from '@/types/application-status';

/**
 * Get the badge variant and styling for application status
 */
export const getStatusBadgeConfig = (status: ApplicationStatus): StatusBadgeConfig => {
    switch (status) {
        case 'approved':
            return { variant: 'default', className: 'bg-green-100 text-green-800 border-green-200' };
        case 'rejected':
            return { variant: 'destructive' };
        case 'under_verification':
        case 'under_evaluation':
            return { variant: 'secondary', className: 'bg-blue-100 text-blue-800 border-blue-200' };
        case 'verified':
            return { variant: 'secondary', className: 'bg-purple-100 text-purple-800 border-purple-200' };
        case 'submitted':
            return { variant: 'outline', className: 'bg-gray-100 text-gray-800 border-gray-200' };
        case 'incomplete':
            return { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        default:
            return { variant: 'outline' };
    }
};

/**
 * Get the progress percentage for application status
 */
export const getApplicationProgress = (status: ApplicationStatus): number => {
    return STATUS_PROGRESS_MAP[status] || 0;
};

/**
 * Get the user-friendly status label
 */
export const getStatusLabel = (status: ApplicationStatus): string => {
    const labels: { [key in ApplicationStatus]: string } = {
        'draft': 'Draft',
        'submitted': 'Submitted',
        'under_verification': 'Under Verification',
        'incomplete': 'Incomplete Documents',
        'verified': 'Documents Verified',
        'under_evaluation': 'Under Evaluation',
        'approved': 'Approved',
        'rejected': 'Not Approved',
        'end': 'Completed'
    };
    
    return labels[status] || status;
};

/**
 * Get document status badge configuration
 */
export const getDocumentStatusConfig = (status: DocumentVerificationStatus, uploaded: boolean): StatusBadgeConfig => {
    if (!uploaded) {
        return { variant: 'outline', className: 'bg-gray-100 text-gray-600' };
    }
    
    switch (status) {
        case 'verified':
            return { variant: 'default', className: 'bg-green-100 text-green-800' };
        case 'rejected':
            return { variant: 'destructive' };
        case 'pending':
            return { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' };
        default:
            return { variant: 'outline' };
    }
};

/**
 * Get document status label
 */
export const getDocumentStatusLabel = (status: DocumentVerificationStatus, uploaded: boolean): string => {
    if (!uploaded) return 'Missing';
    
    const labels: { [key in DocumentVerificationStatus]: string } = {
        'verified': 'Verified',
        'rejected': 'Rejected',
        'pending': 'Pending Review',
        'missing': 'Missing'
    };
    
    return labels[status] || 'Unknown';
};

/**
 * Check if application can be edited
 */
export const canEditApplication = (status: ApplicationStatus): boolean => {
    return ['draft', 'incomplete', 'under_verification'].includes(status);
};

/**
 * Check if documents can be uploaded/updated
 */
export const canUpdateDocuments = (status: ApplicationStatus): boolean => {
    return ['draft', 'incomplete', 'under_verification'].includes(status);
};

/**
 * Check if interview can be scheduled
 */
export const canScheduleInterview = (status: ApplicationStatus): boolean => {
    return ['verified', 'under_evaluation'].includes(status);
};

/**
 * Check if stipend can be recorded
 */
export const canRecordStipend = (status: ApplicationStatus): boolean => {
    return status === 'approved';
};

/**
 * Get next steps based on application status
 */
export const getNextSteps = (status: ApplicationStatus): string[] => {
    switch (status) {
        case 'draft':
            return [
                'Complete your application form',
                'Upload all required documents',
                'Submit your application for review'
            ];
        case 'submitted':
            return [
                'Wait for initial review by OSAS staff',
                'You will be notified of any required document updates'
            ];
        case 'under_verification':
            return [
                'OSAS staff is verifying your submitted documents',
                'Upload any missing or rejected documents',
                'Wait for verification completion'
            ];
        case 'incomplete':
            return [
                'Upload missing documents as indicated',
                'Replace any rejected documents',
                'Resubmit for verification'
            ];
        case 'verified':
            return [
                'All documents have been verified',
                'Wait for interview scheduling',
                'Prepare for your scholarship interview'
            ];
        case 'under_evaluation':
            return [
                'Attend your scheduled interview',
                'Wait for committee evaluation',
                'Final decision will be communicated soon'
            ];
        case 'approved':
            return [
                'Congratulations! Your application has been approved',
                'Wait for stipend disbursement instructions',
                'Maintain scholarship requirements throughout the period'
            ];
        case 'rejected':
            return [
                'Your application was not approved at this time',
                'Review feedback provided by the committee',
                'Consider applying for other available scholarships'
            ];
        default:
            return ['Contact OSAS office for more information'];
    }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Get scholarship type display name
 */
export const getScholarshipTypeLabel = (type: string): string => {
    const typeLabels: { [key: string]: string } = {
        'academic_full': 'Academic Full Scholarship',
        'academic_partial': 'Academic Partial Scholarship',
        'student_assistantship': 'Student Assistantship',
        'performing_arts_full': 'Performing Arts Full Scholarship',
        'performing_arts_partial': 'Performing Arts Partial Scholarship',
        'economic_assistance': 'Economic Assistance Program'
    };
    
    return typeLabels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.type.includes('pdf')) {
        return { valid: false, error: 'Only PDF files are allowed' };
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }
    
    return { valid: true };
};

/**
 * Calculate application completeness percentage
 */
export const calculateCompleteness = (application: ApplicationStatusData): number => {
    const requiredDocs = application.documents.filter(doc => doc.required);
    const uploadedDocs = requiredDocs.filter(doc => doc.uploaded);
    const verifiedDocs = requiredDocs.filter(doc => doc.status === 'verified');
    
    let completeness = 0;
    
    // Basic application submission (20%)
    if (application.status !== 'draft') {
        completeness += 20;
    }
    
    // Document upload (40%)
    if (requiredDocs.length > 0) {
        completeness += (uploadedDocs.length / requiredDocs.length) * 40;
    }
    
    // Document verification (30%)
    if (requiredDocs.length > 0) {
        completeness += (verifiedDocs.length / requiredDocs.length) * 30;
    }
    
    // Final status (10%)
    if (['approved', 'rejected'].includes(application.status)) {
        completeness += 10;
    }
    
    return Math.round(completeness);
};

/**
 * Get application priority color
 */
export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'urgent': return 'text-red-600';
        case 'high': return 'text-orange-600';
        case 'medium': return 'text-yellow-600';
        case 'low': return 'text-green-600';
        default: return 'text-gray-600';
    }
};
