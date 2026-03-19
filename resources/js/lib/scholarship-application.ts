import {
    ScholarshipApplicationStatus,
    ScholarshipDocumentStatus,
    ScholarshipTimelineItem,
} from '@/types/scholarship-application';
import { AlertCircle, BadgeCheck, Calendar, CheckCircle, Clock3, Eye, FileCheck, FileText, GraduationCap, XCircle } from 'lucide-react';

const STATUS_BADGE_CLASSES: Record<ScholarshipApplicationStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300',
    submitted: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300',
    under_verification: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300',
    incomplete: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300',
    verified: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300',
    under_evaluation: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300',
    approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300',
    end: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/50 dark:text-slate-300',
};

const DOCUMENT_BADGE_CLASSES: Record<ScholarshipDocumentStatus, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300',
    verified: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300',
    missing: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-300',
};

export const getScholarshipStatusBadgeClass = (status: ScholarshipApplicationStatus): string => STATUS_BADGE_CLASSES[status];

export const getScholarshipDocumentBadgeClass = (status: ScholarshipDocumentStatus): string => DOCUMENT_BADGE_CLASSES[status];

export const getScholarshipDocumentStatusLabel = (status: ScholarshipDocumentStatus): string => {
    switch (status) {
        case 'verified':
            return 'Verified';
        case 'rejected':
            return 'Rejected';
        case 'pending':
            return 'Pending Review';
        default:
            return 'Missing';
    }
};

export const formatScholarshipDate = (value: string | null, options?: Intl.DateTimeFormatOptions): string => {
    if (!value) return 'N/A';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    }).format(new Date(value));
};

export const formatScholarshipDateTime = (value: string | null): string => {
    if (!value) return 'N/A';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
};

export const formatScholarshipCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return 'Amount TBD';

    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const getScholarshipTypeLabel = (type: string): string =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const getProgressToneClass = (progress: number): string => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-amber-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-emerald-500';
};

export const getTimelineIcon = (item: ScholarshipTimelineItem) => {
    switch (item.icon) {
        case 'document-plus':
            return FileText;
        case 'check-circle':
            return CheckCircle;
        case 'eye':
            return Eye;
        case 'alert-circle':
            return AlertCircle;
        case 'document-check':
            return FileCheck;
        case 'calendar':
            return Calendar;
        case 'academic-cap':
            return GraduationCap;
        case 'check-badge':
            return BadgeCheck;
        case 'x-circle':
            return XCircle;
        default:
            return Clock3;
    }
};
