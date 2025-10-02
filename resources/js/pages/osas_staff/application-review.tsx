import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileCheck,
    FileText,
    GraduationCap,
    History,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    ShieldCheck,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Types
interface Student {
    id: number;
    name: string;
    student_id: string;
    email: string;
    phone?: string;
    course: string;
    year_level: string;
    major?: string;
    gpa?: number;
    address?: string;
    photo_url?: string;
}

interface Scholarship {
    id: number;
    name: string;
    type: string;
    amount: string;
    description: string;
    eligibility: string[];
    requirements: string[];
    deadline: string;
}

interface Document {
    id: number;
    name: string;
    type: string;
    file_path: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    is_verified: boolean;
    verified_at?: string;
    verified_by?: {
        name: string;
        id: number;
    };
    uploaded_at: string;
    status: 'pending' | 'verified' | 'rejected';
    comments?: string;
}

interface TimelineEvent {
    id: number;
    type: 'status_change' | 'comment' | 'document_upload' | 'document_verification' | 'interview_scheduled';
    title: string;
    description: string;
    timestamp: string;
    user: {
        name: string;
        role: string;
    };
    metadata?: Record<string, unknown>;
}

interface Application {
    id: number;
    student: Student;
    scholarship: Scholarship;
    status: 'draft' | 'submitted' | 'under_verification' | 'incomplete' | 'verified' | 'under_evaluation' | 'approved' | 'rejected' | 'end';
    priority: 'high' | 'medium' | 'low';
    submitted_at: string;
    updated_at: string;
    deadline: string;
    purpose_letter: string;
    academic_year: number;
    semester: string;
    verifier_comments?: string;
    interview_scheduled?: boolean;
    interview_date?: string;
    interview_notes?: string;
    documents: Document[];
    timeline: TimelineEvent[];
    progress: {
        submitted: boolean;
        documents_verified: boolean;
        interview_completed: boolean;
        review_completed: boolean;
    };
    reviewer?: {
        name: string;
        id: number;
    };
}

interface ApplicationReviewProps {
    application: Application;
}

// Status configuration (aligned with ScholarshipApplication model)
const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: FileCheck,
    },
    submitted: {
        label: 'Submitted',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        icon: CheckCircle,
    },
    under_verification: {
        label: 'Under Verification',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        icon: Eye,
    },
    incomplete: {
        label: 'Incomplete',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        icon: AlertTriangle,
    },
    verified: {
        label: 'Verified',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: ShieldCheck,
    },
    under_evaluation: {
        label: 'Under Evaluation',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        icon: GraduationCap,
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        icon: XCircle,
    },
    end: {
        label: 'Completed',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: CheckCircle,
    },
} as const;

export default function ApplicationReview({ application }: ApplicationReviewProps) {
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [showDocumentDialog, setShowDocumentDialog] = useState<Document | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/osas-staff/dashboard',
        },
        {
            title: 'Applications',
            href: '/osas-staff/applications',
        },
        {
            title: `Application #${application.id}`,
            href: `/osas-staff/applications/${application.id}/review`,
        },
    ];

    const {
        data: statusData,
        setData: setStatusData,
        patch: updateStatus,
        processing: statusProcessing,
    } = useForm({
        status: application.status,
        comments: '',
        priority: application.priority,
    });

    const {
        data: commentData,
        setData: setCommentData,
        post: addComment,
        processing: commentProcessing,
        reset: resetComment,
    } = useForm({
        comment: '',
    });

    const { patch: verifyDocument, processing: verifyProcessing } = useForm();

    const handleStatusUpdate = () => {
        updateStatus(route('osas.applications.status', application.id), {
            onSuccess: () => {
                setShowStatusDialog(false);
                toast.success('Application status updated successfully');
            },
            onError: () => {
                toast.error('Failed to update application status');
            },
        });
    };
    const handleDocumentVerification = (documentId: number, status: 'verified' | 'rejected') => {
        verifyDocument(route('osas.documents.verify', documentId), {
            onSuccess: () => {
                setShowDocumentDialog(null);
                toast.success(`Document ${status} successfully`);
            },
            onError: () => {
                toast.error('Failed to verify document');
            },
        });
    };

    const handleAddComment = () => {
        addComment(route('osas.applications.comment', application.id), {
            onSuccess: () => {
                resetComment();
                toast.success('Comment added successfully');
            },
            onError: () => {
                toast.error('Failed to add comment');
            },
        });
    };

    const calculateProgress = () => {
        let progress = 0;
        if (application.progress.submitted) progress += 25;
        if (application.progress.documents_verified) progress += 25;
        if (application.progress.interview_completed) progress += 25;
        if (application.progress.review_completed) progress += 25;
        return progress;
    };

    const StatusIcon = statusConfig[application.status]?.icon || Clock;
    const isOverdue = new Date(application.deadline) < new Date() && ['submitted', 'under_verification', 'incomplete'].includes(application.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review Application #${application.id}`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold">Application #{application.id}</h1>
                            <p className="text-muted-foreground">Submitted on {new Date(application.submitted_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Badge
                            className={cn(
                                statusConfig[application.status]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
                            )}
                        >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[application.status]?.label || 'Unknown'}
                        </Badge>
                        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm">Update Status</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Application Status</DialogTitle>
                                    <DialogDescription>Change the status of this application and add comments if needed.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={statusData.status}
                                            onValueChange={(value) =>
                                                setStatusData(
                                                    'status',
                                                    value as
                                                        | 'draft'
                                                        | 'submitted'
                                                        | 'under_verification'
                                                        | 'incomplete'
                                                        | 'verified'
                                                        | 'under_evaluation'
                                                        | 'approved'
                                                        | 'rejected'
                                                        | 'end',
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="submitted">Submitted</SelectItem>
                                                <SelectItem value="under_verification">Under Verification</SelectItem>
                                                <SelectItem value="incomplete">Incomplete</SelectItem>
                                                <SelectItem value="verified">Verified</SelectItem>
                                                <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                <SelectItem value="end">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={statusData.priority}
                                            onValueChange={(value) => setStatusData('priority', value as 'high' | 'medium' | 'low')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="comments">Comments (Optional)</Label>
                                        <Textarea
                                            id="comments"
                                            placeholder="Add any comments or notes about this status change..."
                                            value={statusData.comments}
                                            onChange={(e) => setStatusData('comments', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleStatusUpdate} disabled={statusProcessing}>
                                        {statusProcessing ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Progress Bar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Application Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{calculateProgress()}%</span>
                            </div>
                            <Progress value={calculateProgress()} className="h-2" />
                            <div className="text-muted-foreground mt-4 grid grid-cols-4 gap-4 text-xs">
                                <div className={cn('text-center', application.progress.submitted && 'text-green-600')}>
                                    <CheckCircle
                                        className={cn('mx-auto mb-1 h-4 w-4', application.progress.submitted ? 'text-green-600' : 'text-gray-300')}
                                    />
                                    Submitted
                                </div>
                                <div className={cn('text-center', application.progress.documents_verified && 'text-green-600')}>
                                    <FileCheck
                                        className={cn(
                                            'mx-auto mb-1 h-4 w-4',
                                            application.progress.documents_verified ? 'text-green-600' : 'text-gray-300',
                                        )}
                                    />
                                    Documents
                                </div>
                                <div className={cn('text-center', application.progress.interview_completed && 'text-green-600')}>
                                    <MessageSquare
                                        className={cn(
                                            'mx-auto mb-1 h-4 w-4',
                                            application.progress.interview_completed ? 'text-green-600' : 'text-gray-300',
                                        )}
                                    />
                                    Interview
                                </div>
                                <div className={cn('text-center', application.progress.review_completed && 'text-green-600')}>
                                    <CheckCircle
                                        className={cn(
                                            'mx-auto mb-1 h-4 w-4',
                                            application.progress.review_completed ? 'text-green-600' : 'text-gray-300',
                                        )}
                                    />
                                    Complete
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Student Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Student Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={application.student.photo_url} />
                                        <AvatarFallback>
                                            {application.student.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold">{application.student.name}</h3>
                                        <p className="text-muted-foreground">{application.student.student_id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="text-muted-foreground h-4 w-4" />
                                            <span>{application.student.email}</span>
                                        </div>
                                        {application.student.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="text-muted-foreground h-4 w-4" />
                                                <span>{application.student.phone}</span>
                                            </div>
                                        )}
                                        {application.student.address && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="text-muted-foreground h-4 w-4" />
                                                <span>{application.student.address}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                                            <span>
                                                {application.student.course} - {application.student.year_level}
                                            </span>
                                        </div>
                                        {application.student.major && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Major: </span>
                                                <span>{application.student.major}</span>
                                            </div>
                                        )}
                                        {application.student.gpa && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">GPA: </span>
                                                <span className="font-medium">{application.student.gpa}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Scholarship Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Scholarship Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{application.scholarship.name}</h3>
                                    <p className="text-muted-foreground">{application.scholarship.type}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-muted-foreground text-sm font-medium">Amount</span>
                                        <p className="text-lg font-semibold text-green-600">{application.scholarship.amount}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-sm font-medium">Deadline</span>
                                        <p className={cn('text-sm', isOverdue ? 'font-medium text-red-600' : '')}>
                                            {new Date(application.scholarship.deadline).toLocaleDateString()}
                                            {isOverdue && <span className="ml-1">(Overdue)</span>}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-muted-foreground text-sm font-medium">Description</span>
                                    <p className="mt-1 text-sm">{application.scholarship.description}</p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground text-sm font-medium">Eligibility Criteria</span>
                                    <ul className="mt-1 space-y-1 text-sm">
                                        {application.scholarship.eligibility.map((criterion, index) => (
                                            <li key={`eligibility-${index}`} className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                                {criterion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purpose Letter */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Purpose Letter</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <p className="whitespace-pre-wrap">{application.purpose_letter}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card id="documents">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Documents ({application.documents.length})
                                </CardTitle>
                                <CardDescription>Review and verify submitted documents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {application.documents.map((document) => (
                                        <div key={`document-${document.id}`} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="text-muted-foreground h-8 w-8" />
                                                <div>
                                                    <p className="font-medium">{document.name}</p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {document.original_name} • {(document.file_size / 1024).toFixed(1)} KB
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge
                                                    variant={
                                                        document.status === 'verified'
                                                            ? 'default'
                                                            : document.status === 'rejected'
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {document.status}
                                                </Badge>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`/storage/${document.file_path}`} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        View
                                                    </a>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`/storage/${document.file_path}`} download>
                                                        <Download className="mr-1 h-4 w-4" />
                                                        Download
                                                    </a>
                                                </Button>
                                                {document.status === 'pending' && (
                                                    <Dialog
                                                        open={showDocumentDialog?.id === document.id}
                                                        onOpenChange={(open) => setShowDocumentDialog(open ? document : null)}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button size="sm">Verify</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Verify Document</DialogTitle>
                                                                <DialogDescription>Review and verify the document: {document.name}</DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div className="text-sm">
                                                                    <p>
                                                                        <strong>Document:</strong> {document.name}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Type:</strong> {document.type}
                                                                    </p>
                                                                    <p>
                                                                        <strong>File:</strong> {document.original_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <DialogFooter className="gap-2">
                                                                <Button variant="outline" onClick={() => setShowDocumentDialog(null)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => handleDocumentVerification(document.id, 'rejected')}
                                                                    disabled={verifyProcessing}
                                                                >
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDocumentVerification(document.id, 'verified')}
                                                                    disabled={verifyProcessing}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule Interview
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download All Documents
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Add Comment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Comment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Add a comment or note about this application..."
                                    value={commentData.comment}
                                    onChange={(e) => setCommentData('comment', e.target.value)}
                                />
                                <Button onClick={handleAddComment} disabled={commentProcessing || !commentData.comment.trim()} className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    {commentProcessing ? 'Adding...' : 'Add Comment'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {application.timeline.map((event, index) => (
                                        <div key={`timeline-${event.id || index}`} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                {index < application.timeline.length - 1 && <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="text-sm font-medium">{event.title}</p>
                                                <p className="text-muted-foreground text-xs">{event.description}</p>
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    {new Date(event.timestamp).toLocaleString()} • {event.user?.name || 'Unknown User'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
