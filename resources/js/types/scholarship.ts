export interface Scholarship {
    id: number;
    name: string;
    type: 'academic_full' | 'academic_partial' | 'student_assistantship' | 'performing_arts_full' | 'performing_arts_partial' | 'economic_assistance';
    typeLabel: string;
    description: string;
    benefits: string[];
    requirements: string[];
    requiredDocuments: { [key: string]: string };
    eligibilityCriteria: string[];
    gwaRequirement: { min?: number; max?: number } | null;
    amount: number | null;
    applicationDeadline: string;
    availableSlots: number;
    canApply: boolean;
}

export interface ScholarshipApplication {
    id: number;
    scholarshipName: string;
    scholarshipType: string;
    status: ApplicationStatus;
    statusLabel: string;
    appliedAt?: string;
    verifiedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    interviewSchedule?: string;
    verifierComments?: string;
    documents: ApplicationDocument[];
    canEdit: boolean;
    canCancel: boolean;
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

export interface ApplicationDocument {
    type: string;
    fileName: string;
    uploadedAt: string;
    verified: boolean;
}

export interface UserProfile {
    studentNumber: string;
    currentGwa: number;
    yearLevel: string;
    course: string;
    enrollmentStatus: string;
}

export interface ApplicationFormData {
    personalStatement: string;
    academicYear: number;
    semester: string;
    parentConsent: boolean;
    termsAgreement: boolean;
    documents: { [key: string]: File };
    // MinSU-specific fields
    membershipDuration?: number;
    majorPerformances?: boolean;
    majorActivitiesCount?: number;
    familyIncome?: number;
    preHiringCompleted?: boolean;
    [key: string]: string | number | boolean | File | { [key: string]: File } | undefined; // Index signature for FormDataType compatibility
}
