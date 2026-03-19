import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    formatScholarshipDate,
    formatScholarshipDateTime,
    getScholarshipDocumentBadgeClass,
    getScholarshipDocumentStatusLabel,
    getScholarshipStatusBadgeClass,
    getTimelineIcon,
} from '@/lib/scholarship-application';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ScholarshipApplicationDetail, ScholarshipDocumentStatus } from '@/types/scholarship-application';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, History, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ApplicationReviewProps {
    application: ScholarshipApplicationDetail;
}

export default function ApplicationReview({ application }: ApplicationReviewProps) {
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [documentRemarks, setDocumentRemarks] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/osas-staff/dashboard' },
        { title: 'Applications', href: '/osas-staff/applications' },
        { title: `Application #${application.id}`, href: '#' },
    ];

    const { data: statusData, setData: setStatusData, patch: updateStatus, processing: statusProcessing } = useForm({
        status: application.status,
        feedback: application.review_summary.feedback ?? '',
        priority: application.priority,
    });

    const { data: commentData, setData: setCommentData, post: addComment, processing: commentProcessing, reset: resetComment } = useForm({
        comment: '',
    });

    const { processing: verifyProcessing } = useForm({});

    const handleStatusUpdate = () => {
        updateStatus(route('osas.applications.status', application.id), {
            onSuccess: () => {
                setShowStatusDialog(false);
                toast.success('Application status updated successfully.');
            },
            onError: () => toast.error('Failed to update application status.'),
        });
    };

    const handleAddComment = () => {
        addComment(route('osas.applications.comment', application.id), {
            onSuccess: () => {
                resetComment();
                toast.success('Comment added successfully.');
            },
            onError: () => toast.error('Failed to add comment.'),
        });
    };

    const handleDocumentReview = (status: ScholarshipDocumentStatus) => {
        if (!selectedDocumentId) return;

        router.patch(route('osas.documents.verify', selectedDocumentId), {
            status,
            remarks: documentRemarks,
        }, {
            onSuccess: () => {
                setSelectedDocumentId(null);
                setDocumentRemarks('');
                toast.success(`Document marked as ${status}.`);
            },
            onError: () => toast.error('Failed to update document status.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review Application #${application.id}`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Application #{application.id}</h1>
                        <p className="text-muted-foreground">Submitted on {formatScholarshipDate(application.submitted_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getScholarshipStatusBadgeClass(application.status)}>{application.status_label}</Badge>
                        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm">Update Status</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Application Status</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={statusData.status} onValueChange={(value) => setStatusData('status', value as typeof statusData.status)}>
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
                                        <Select value={statusData.priority} onValueChange={(value) => setStatusData('priority', value as typeof statusData.priority)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="feedback">Feedback</Label>
                                        <Textarea
                                            id="feedback"
                                            value={statusData.feedback}
                                            onChange={(event) => setStatusData('feedback', event.target.value)}
                                            placeholder="Add review feedback."
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

                <Card>
                    <CardHeader>
                        <CardTitle>Workflow Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>Overall progress</span>
                            <span>{application.progress}%</span>
                        </div>
                        <Progress value={application.progress} className="h-2" />
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="font-medium">{application.student?.name}</div>
                                <div className="text-muted-foreground">{application.student?.student_id}</div>
                                <div>{application.student?.email}</div>
                                <div>
                                    {application.student?.course} • {application.student?.year_level}
                                </div>
                                {application.student && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('osas.students.details', application.student.id)}>View Student Profile</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Scholarship</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="font-medium">{application.scholarship.name}</div>
                                <div className="text-muted-foreground">{application.scholarship.type_label}</div>
                                <div>{application.scholarship.amount_display}</div>
                                <div>Deadline: {formatScholarshipDate(application.scholarship.deadline)}</div>
                            </CardContent>
                        </Card>

                        {application.purpose_letter && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statement of Purpose</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{application.purpose_letter}</p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {application.document_summary.items.map((document) => (
                                    <div key={document.type} className="flex flex-col gap-3 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="font-medium">{document.name}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {document.original_name ?? 'No uploaded file'} {document.uploaded_at ? `• ${formatScholarshipDate(document.uploaded_at)}` : ''}
                                            </p>
                                            {document.comments && <p className="mt-1 text-sm text-red-600">{document.comments}</p>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className={getScholarshipDocumentBadgeClass(document.status)}>
                                                {getScholarshipDocumentStatusLabel(document.status)}
                                            </Badge>
                                            <Dialog
                                                open={selectedDocumentId === document.id}
                                                onOpenChange={(open) => {
                                                    setSelectedDocumentId(open ? document.id ?? null : null);
                                                    setDocumentRemarks(document.comments ?? '');
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button size="sm" disabled={!document.uploaded}>
                                                        Review
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>{document.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="documentRemarks">Remarks</Label>
                                                            <Textarea
                                                                id="documentRemarks"
                                                                value={documentRemarks}
                                                                onChange={(event) => setDocumentRemarks(event.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter className="gap-2">
                                                        <Button variant="outline" onClick={() => setSelectedDocumentId(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="destructive" onClick={() => handleDocumentReview('rejected')} disabled={verifyProcessing}>
                                                            Reject
                                                        </Button>
                                                        <Button onClick={() => handleDocumentReview('verified')} disabled={verifyProcessing}>
                                                            Approve
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('osas.applications.interview', application.id)}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Manage Interview
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Add Comment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Add an internal note."
                                    value={commentData.comment}
                                    onChange={(event) => setCommentData('comment', event.target.value)}
                                />
                                <Button onClick={handleAddComment} disabled={commentProcessing || !commentData.comment.trim()} className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    {commentProcessing ? 'Adding...' : 'Add Comment'}
                                </Button>
                            </CardContent>
                        </Card>

                        {application.comments && application.comments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Internal Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {application.comments.map((comment) => (
                                        <div key={comment.id} className="rounded-lg border p-3">
                                            <p className="text-sm leading-relaxed">{comment.comment}</p>
                                            <p className="text-muted-foreground mt-2 text-xs">
                                                {comment.user.name} • {comment.created_at_human ?? formatScholarshipDateTime(comment.created_at)}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {application.timeline.map((item, index) => {
                                    const Icon = getTimelineIcon(item);
                                    return (
                                        <div key={`${item.title}-${index}`} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`rounded-full p-2 ${
                                                        item.status === 'completed'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : item.status === 'current'
                                                              ? 'bg-blue-100 text-blue-700'
                                                              : 'bg-slate-100 text-slate-500'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                {index < application.timeline.length - 1 && <div className="mt-2 h-8 w-px bg-border" />}
                                            </div>
                                            <div className="flex-1 pb-2">
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-muted-foreground text-sm">{item.description}</p>
                                                {item.date && <p className="text-muted-foreground mt-1 text-xs">{formatScholarshipDateTime(item.date)}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
