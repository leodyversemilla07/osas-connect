export interface Interview {
    id: number;
    application_id: number;
    schedule: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    remarks?: string;
    scholarship?: {
        id: number;
        name: string;
        type: string;
    };
    application?: {
        id: number;
        interviewer?: {
            id: number;
            name: string;
        };
        location?: string;
    };
    created_at: string;
    updated_at: string;
}

export interface RenewalApplication {
    id: number;
    original_application_id: number;
    student_id: number;
    renewal_semester: string;
    renewal_year: number;
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    submitted_at: string | null;
    reviewed_at: string | null;
    reviewer_id: number | null;
    renewal_notes: string | null;
    current_gwa: number | null;
    is_renewal: boolean;
    last_renewed_at: string | null;
    has_required_documents: boolean;
    required_document_ids: number[] | null;
    created_at: string;
    updated_at: string;
    original_application?: ScholarshipApplication;
    student?: User;
    reviewer?: User;
    documents?: Document[];
}

export interface ScholarshipApplication {
    id: number;
    user_id: number;
    scholarship_id: number;
    status: string;
    submitted_at: string | null;
    created_at: string;
    updated_at: string;
    scholarship?: Scholarship;
    student?: User;
}

export interface Scholarship {
    id: number;
    name: string;
    type: string;
    description: string | null;
    amount: number | null;
    deadline: string | null;
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: number;
    type: string;
    file_path: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    email: string;
    role: string;
    student_profile?: StudentProfile;
}

export interface StudentProfile {
    id: number;
    user_id: number;
    student_id: string;
    course: string;
    year_level: string;
    current_gwa: number | null;
    enrollment_status: string;
    has_disciplinary_action: boolean;
}

export interface RenewalEligibility {
    eligible: boolean;
    reasons: string[];
    requirements: {
        gwa_requirement: number;
        current_gwa: number | null;
        enrolled: boolean;
        no_disciplinary_action: boolean;
        documents_complete: boolean;
    };
}

export interface RenewalDeadlines {
    current_semester: {
        semester: string;
        year: number;
        deadline: string;
    };
    next_semester: {
        semester: string;
        year: number;
        deadline: string;
    };
}

export interface RenewalStatistics {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
    approval_rate: number;
}
