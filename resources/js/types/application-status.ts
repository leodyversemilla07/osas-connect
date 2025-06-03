// Types for Application Status Details Component
export interface ApplicationStatusData {
    id: number;
    status: ApplicationStatus;
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
    scholarship: ScholarshipInfo;
    student: StudentInfo;
    documents: ApplicationDocumentStatus[];
    timeline: ApplicationTimelineStep[];
}

export interface ScholarshipInfo {
    id: number;
    name: string;
    type: string;
    amount: string;
    description: string;
}

export interface StudentInfo {
    id: number;
    name: string;
    course: string;
    studentNumber: string;
    yearLevel: string;
}

export interface ApplicationDocumentStatus {
    type: string;
    name: string;
    required: boolean;
    uploaded: boolean;
    status: DocumentVerificationStatus;
    uploadedAt?: string;
    verifiedAt?: string;
    rejectedReason?: string;
}

export interface ApplicationTimelineStep {
    title: string;
    description: string;
    date?: string;
    status: TimelineStepStatus;
    icon: string;
}

export type ApplicationStatus = 
    | 'draft' 
    | 'submitted' 
    | 'under_verification' 
    | 'incomplete'
    | 'verified'
    | 'under_evaluation' 
    | 'approved' 
    | 'rejected' 
    | 'end';

export type DocumentVerificationStatus = 
    | 'pending'
    | 'verified'
    | 'rejected'
    | 'missing';

export type TimelineStepStatus = 
    | 'completed'
    | 'current'
    | 'pending';

export interface ApplicationPermissions {
    update_documents: boolean;
    schedule_interview: boolean;
    record_stipend: boolean;
    view_admin_comments: boolean;
    download_documents: boolean;
}

// Event handlers
export interface ApplicationStatusHandlers {
    onDocumentUpload?: (documentType: string, file: File) => void;
    onViewDocument?: (documentType: string) => void;
    onDownloadApplication?: () => void;
    onScheduleInterview?: () => void;
    onRecordStipend?: () => void;
}

// Props for the main component
export interface ApplicationStatusDetailsProps {
    application: ApplicationStatusData;
    permissions?: ApplicationPermissions;
    handlers?: ApplicationStatusHandlers;
}

// Status badge configuration
export interface StatusBadgeConfig {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
}

// Document type configurations based on scholarship types
export interface DocumentTypeConfig {
    [key: string]: {
        name: string;
        description: string;
        required: boolean;
        acceptedFormats: string[];
        maxSize: number; // in MB
    };
}

// Pre-configured document types for MinSU scholarships
export const SCHOLARSHIP_DOCUMENTS: DocumentTypeConfig = {
    'transcript_records': {
        name: 'Official Transcript of Records',
        description: 'Latest copy from registrar',
        required: true,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    },
    'birth_certificate': {
        name: 'Birth Certificate',
        description: 'PSA-issued copy',
        required: true,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    },
    'good_moral': {
        name: 'Certificate of Good Moral Character',
        description: 'From previous school',
        required: true,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    },
    'income_statement': {
        name: 'Family Income Statement',
        description: 'BIR Form or Certificate of Indigency',
        required: true,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    },
    'enrollment_certificate': {
        name: 'Certificate of Enrollment',
        description: 'Current semester',
        required: true,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    },
    'recommendation_letter': {
        name: 'Letter of Recommendation',
        description: 'From faculty or advisor',
        required: false,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    },
    'portfolio': {
        name: 'Performance Portfolio',
        description: 'For performing arts scholarships',
        required: false,
        acceptedFormats: ['.pdf'],
        maxSize: 10
    },
    'medical_certificate': {
        name: 'Medical Certificate',
        description: 'Recent health clearance',
        required: false,
        acceptedFormats: ['.pdf'],
        maxSize: 5
    }
};

// Status progress mapping
export const STATUS_PROGRESS_MAP: { [key in ApplicationStatus]: number } = {
    'draft': 10,
    'submitted': 25,
    'under_verification': 40,
    'incomplete': 35,
    'verified': 60,
    'under_evaluation': 80,
    'approved': 100,
    'rejected': 100,
    'end': 100
};

// Timeline icon mapping
export const TIMELINE_ICONS: { [key: string]: string } = {
    'document-plus': 'FileText',
    'check-circle': 'CheckCircle',
    'eye': 'Eye',
    'document-check': 'FileCheck',
    'academic-cap': 'GraduationCap',
    'check-badge': 'Award',
    'x-circle': 'XCircle',
    'clock': 'Clock',
    'calendar': 'Calendar',
    'user': 'User',
    'message': 'MessageSquare'
};
