import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    Clock, 
    User, 
    MapPin, 
    Phone,
    Video,
    ArrowLeft,
    Edit,
    CheckCircle,
    XCircle,
    UserX,
    RotateCcw
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Student {
    id: number;
    name: string;
    student_id: string;
    email: string;
    phone: string;
    student_profile: {
        first_name: string;
        last_name: string;
        course: string;
        year_level: string;
        contact_number: string;
    };
}

interface Scholarship {
    id: number;
    name: string;
    type: string;
    description: string;
}

interface Application {
    id: number;
    status: string;
    student: Student;
    scholarship: Scholarship;
}

interface Interviewer {
    id: number;
    name: string;
    email: string;
}

interface Interview {
    id: number;
    schedule: string;
    status: string;
    location: string;
    interview_type: string;
    notes: string;
    application: Application;
    interviewer: Interviewer;
    feedback: string;
    recommendation: string;
    scores: Record<string, number>;
    reschedule_history: Array<{
        type: string;
        reason: string;
        old_schedule?: string;
        new_schedule?: string;
        created_at: string;
        created_by: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface Props {
    interview: Interview;
}

export default function InterviewDetails({ interview }: Props) {
    const [showCompleteForm, setShowCompleteForm] = useState(false);
    const [showCancelForm, setShowCancelForm] = useState(false);

    const completeForm = useForm({
        scores: {},
        recommendation: '',
        notes: '',
    });

    const cancelForm = useForm({
        reason: '',
    });

    const noShowForm = useForm({});

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            scheduled: { label: 'Scheduled', variant: 'default' as const, icon: Clock },
            completed: { label: 'Completed', variant: 'default' as const, icon: CheckCircle },
            cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle },
            no_show: { label: 'No Show', variant: 'secondary' as const, icon: UserX },
            rescheduled: { label: 'Rescheduled', variant: 'outline' as const, icon: RotateCcw },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || 
                      { label: status, variant: 'outline' as const, icon: Clock };

        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <IconComponent className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const getInterviewTypeIcon = (type: string) => {
        switch (type) {
            case 'online':
                return <Video className="h-4 w-4" />;
            case 'phone':
                return <Phone className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleComplete = (e: FormEvent) => {
        e.preventDefault();
        completeForm.post(route('osas.interviews.complete', interview.id), {
            onSuccess: () => {
                setShowCompleteForm(false);
            },
        });
    };

    const handleCancel = (e: FormEvent) => {
        e.preventDefault();
        cancelForm.post(route('osas.interviews.cancel', interview.id), {
            onSuccess: () => {
                setShowCancelForm(false);
            },
        });
    };

    const handleNoShow = () => {
        if (confirm('Are you sure you want to mark this interview as no-show? This action cannot be undone.')) {
            noShowForm.post(route('osas.interviews.no-show', interview.id));
        }
    };

    return (
        <>
            <Head title={`Interview - ${interview.application.student.student_profile.first_name} ${interview.application.student.student_profile.last_name}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('osas.interviews.index')}
                                    className="flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-1" />
                                    Back to Interviews
                                </Link>
                            </div>
                            <div className="flex items-center space-x-3">
                                {interview.status === 'scheduled' && (
                                    <>
                                        <Link
                                            href={route('osas.interviews.edit', interview.id)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Link>
                                        <Button
                                            onClick={() => setShowCompleteForm(true)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Complete
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCancelForm(true)}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleNoShow}
                                        >
                                            <UserX className="h-4 w-4 mr-1" />
                                            No Show
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Interview with {interview.application.student.student_profile.first_name} {interview.application.student.student_profile.last_name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {interview.application.scholarship.name} • {interview.application.student.student_id}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Interview Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Interview Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Interview Details
                                        {getStatusBadge(interview.status)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center text-sm">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="font-medium">Schedule:</span>
                                            <span className="ml-2">{formatDate(interview.schedule)}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            {getInterviewTypeIcon(interview.interview_type)}
                                            <span className="font-medium ml-2">Type:</span>
                                            <span className="ml-2 capitalize">{interview.interview_type.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="font-medium">Location:</span>
                                            <span className="ml-2">{interview.location || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <User className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="font-medium">Interviewer:</span>
                                            <span className="ml-2">{interview.interviewer.name}</span>
                                        </div>
                                    </div>

                                    {interview.notes && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                            <p className="text-sm text-gray-600">{interview.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Interview Results (if completed) */}
                            {interview.status === 'completed' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Interview Results</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {interview.scores && Object.keys(interview.scores).length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Scores</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {Object.entries(interview.scores).map(([criterion, score]) => (
                                                        <div key={criterion} className="flex justify-between py-1">
                                                            <span className="text-sm text-gray-600 capitalize">
                                                                {criterion.replace('_', ' ')}:
                                                            </span>
                                                            <span className="text-sm font-medium">{score}/100</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {interview.recommendation && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                                                <Badge 
                                                    variant={
                                                        interview.recommendation === 'approved' ? 'default' :
                                                        interview.recommendation === 'rejected' ? 'destructive' : 'outline'
                                                    }
                                                >
                                                    {interview.recommendation.toUpperCase()}
                                                </Badge>
                                            </div>
                                        )}

                                        {interview.feedback && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                                                <p className="text-sm text-gray-600">{interview.feedback}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reschedule History */}
                            {interview.reschedule_history && interview.reschedule_history.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reschedule History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {interview.reschedule_history.map((entry, index) => (
                                                <div key={index} className="border-l-2 border-gray-200 pl-4">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <RotateCcw className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium capitalize">
                                                            {entry.type}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(entry.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">{entry.reason}</p>
                                                    {entry.old_schedule && entry.new_schedule && (
                                                        <div className="text-xs text-gray-500">
                                                            From: {new Date(entry.old_schedule).toLocaleString()} → 
                                                            To: {new Date(entry.new_schedule).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
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
                                    <CardTitle>Student Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {interview.application.student.student_profile.first_name} {interview.application.student.student_profile.last_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {interview.application.student.student_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Course:</span> {interview.application.student.student_profile.course}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Year:</span> {interview.application.student.student_profile.year_level}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Email:</span> {interview.application.student.email}
                                        </p>
                                        {interview.application.student.student_profile.contact_number && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Phone:</span> {interview.application.student.student_profile.contact_number}
                                            </p>
                                        )}
                                    </div>
                                    <div className="pt-2 border-t">
                                        <Link
                                            href={route('osas.applications.review', interview.application.id)}
                                            className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            View Full Application →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Scholarship Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Scholarship Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {interview.application.scholarship.name}
                                        </p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {interview.application.scholarship.type}
                                        </p>
                                    </div>
                                    {interview.application.scholarship.description && (
                                        <p className="text-sm text-gray-600">
                                            {interview.application.scholarship.description}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Complete Interview Form */}
                    {showCompleteForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Complete Interview
                                    </h3>
                                    <form onSubmit={handleComplete} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Recommendation
                                            </label>
                                            <select
                                                value={completeForm.data.recommendation}
                                                onChange={(e) => completeForm.setData('recommendation', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                required
                                            >
                                                <option value="">Select recommendation</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="pending">Pending</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Feedback Notes
                                            </label>
                                            <Textarea
                                                value={completeForm.data.notes}
                                                onChange={(e) => completeForm.setData('notes', e.target.value)}
                                                rows={4}
                                                placeholder="Interview feedback and observations..."
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowCompleteForm(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={completeForm.processing}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                {completeForm.processing ? 'Completing...' : 'Complete Interview'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cancel Interview Form */}
                    {showCancelForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Cancel Interview
                                    </h3>
                                    <form onSubmit={handleCancel} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Reason for Cancellation
                                            </label>
                                            <Textarea
                                                value={cancelForm.data.reason}
                                                onChange={(e) => cancelForm.setData('reason', e.target.value)}
                                                rows={3}
                                                placeholder="Please provide a reason for cancelling this interview..."
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowCancelForm(false)}
                                            >
                                                Keep Interview
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                disabled={cancelForm.processing}
                                            >
                                                {cancelForm.processing ? 'Cancelling...' : 'Cancel Interview'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
