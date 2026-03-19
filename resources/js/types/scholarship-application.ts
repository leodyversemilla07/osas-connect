export type ScholarshipApplicationStatus =
    | 'draft'
    | 'submitted'
    | 'under_verification'
    | 'incomplete'
    | 'verified'
    | 'under_evaluation'
    | 'approved'
    | 'rejected'
    | 'end';

export type ScholarshipDocumentStatus = 'pending' | 'verified' | 'rejected' | 'missing';
export type ScholarshipTimelineStatus = 'completed' | 'current' | 'pending';

export interface ScholarshipSummary {
    id: number;
    name: string;
    type: string;
    type_label: string;
    amount: number | null;
    amount_display: string;
    description: string;
    deadline: string | null;
    eligibility: string[];
    requirements: string[];
    required_documents: Array<{
        key: string;
        label: string;
    }>;
}

export interface ScholarshipStudentSummary {
    id: number;
    name: string;
    email: string | null;
    student_id: string;
    course: string;
    year_level: string;
    major?: string | null;
    phone?: string | null;
    address?: string | null;
    gpa?: number | null;
    photo_url?: string | null;
}

export interface ScholarshipDocumentItem {
    id?: number | null;
    type: string;
    name: string;
    required: boolean;
    uploaded: boolean;
    status: ScholarshipDocumentStatus;
    uploaded_at: string | null;
    verified_at: string | null;
    comments?: string | null;
    original_name?: string | null;
    file_path?: string | null;
    file_size?: number | null;
    mime_type?: string | null;
    verified_by?: {
        id: number;
        name: string;
    } | null;
}

export interface ScholarshipDocumentSummary {
    required_count: number;
    uploaded_count: number;
    verified_count: number;
    pending_count: number;
    rejected_count: number;
    items: ScholarshipDocumentItem[];
}

export interface ScholarshipInterviewSummary {
    scheduled: boolean;
    scheduled_at: string | null;
    location?: string | null;
    type?: string | null;
    status: string;
    completed: boolean;
    remarks?: string | null;
    recommendation?: string | null;
    interviewer?: {
        id: number;
        name: string;
    } | null;
}

export interface ScholarshipReviewerSummary {
    id: number;
    name: string;
    email?: string | null;
}

export interface ScholarshipReviewSummary {
    completed: boolean;
    feedback?: string | null;
    committee_recommendation?: string | null;
    admin_remarks?: string | null;
    reviewer?: ScholarshipReviewerSummary | null;
}

export interface ScholarshipTimelineItem {
    title: string;
    description: string;
    date: string | null;
    status: ScholarshipTimelineStatus;
    icon: string;
}

export interface ScholarshipComment {
    id: number;
    comment: string;
    type: string;
    created_at: string | null;
    created_at_human?: string | null;
    user: {
        id: number;
        name: string;
    };
}

export interface ScholarshipProgressFlags {
    submitted: boolean;
    documents_verified: boolean;
    interview_completed: boolean;
    review_completed: boolean;
}

export interface ScholarshipApplicationListItem {
    id: number;
    status: ScholarshipApplicationStatus;
    status_label: string;
    progress: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    submitted_at: string | null;
    updated_at: string | null;
    scholarship: ScholarshipSummary;
    document_summary: ScholarshipDocumentSummary;
    interview_summary: ScholarshipInterviewSummary;
    review_summary: ScholarshipReviewSummary;
    timeline: ScholarshipTimelineItem[];
    can_edit?: boolean;
    student?: ScholarshipStudentSummary;
    reviewer?: ScholarshipReviewerSummary | null;
    amount_received?: number | null;
    approved_at?: string | null;
    rejected_at?: string | null;
}

export interface ScholarshipApplicationDetail extends ScholarshipApplicationListItem {
    created_at: string | null;
    application_data: Record<string, unknown>;
    purpose_letter?: string | null;
    academic_year?: number | null;
    semester?: string | null;
    next_steps: string[];
    comments?: ScholarshipComment[];
    progress_flags?: ScholarshipProgressFlags;
    verified_at?: string | null;
    last_stipend_date?: string | null;
    stipend_status?: string | null;
}
