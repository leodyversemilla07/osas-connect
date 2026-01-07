import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps } from '@/types';
import { Interview } from '@/types/models';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    MapPin,
    Phone,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'My Interviews', href: '/student/interviews' },
    { title: 'Interview Details', href: '#' },
];

interface Props extends PageProps {
    interview: Interview;
}

const statusConfig = {
    scheduled: {
        label: 'Scheduled',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: Calendar,
        description: 'Your interview is confirmed and scheduled.',
    },
    completed: {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
        description: 'Your interview has been completed. Results will be communicated soon.',
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
        description: 'This interview has been cancelled.',
    },
    rescheduled: {
        label: 'Rescheduled',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: AlertCircle,
        description: 'This interview has been rescheduled. Please check the new date and time.',
    },
    no_show: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: XCircle,
        description: 'You did not attend this interview.',
    },
};

const preparationChecklist = [
    { id: 1, text: 'Review your scholarship application details', icon: FileText },
    { id: 2, text: 'Prepare valid school ID and other required documents', icon: FileText },
    { id: 3, text: 'Research about the scholarship program', icon: GraduationCap },
    { id: 4, text: 'Prepare answers about your academic goals', icon: GraduationCap },
    { id: 5, text: 'Plan your route to arrive 15 minutes early', icon: MapPin },
    { id: 6, text: 'Dress professionally and appropriately', icon: User },
    { id: 7, text: 'Get a good night\'s sleep before the interview', icon: CheckCircle2 },
];

export default function Show({ interview }: Props) {
    const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    const status = statusConfig[interview.status] || statusConfig.scheduled;
    const StatusIcon = status.icon;

    const rescheduleForm = useForm({
        reason: '',
    });

    const handleRescheduleSubmit = () => {
        rescheduleForm.post(route('student.interviews.reschedule', interview.id), {
            onSuccess: () => setIsRescheduleDialogOpen(false),
        });
    };

    const toggleCheckedItem = (id: number) => {
        setCheckedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const isUpcoming = new Date(interview.schedule) > new Date() && interview.status === 'scheduled';
    const canReschedule = interview.status === 'scheduled' && isUpcoming;

    // Calculate time until interview
    const getTimeUntil = () => {
        const now = new Date();
        const interviewDate = new Date(interview.schedule);
        const diffMs = interviewDate.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffMs < 0) return null;
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} and ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        return 'Less than an hour';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Interview Details" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('student.interviews.index')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                                Interview Details
                            </h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                {interview.scholarship?.name || 'Scholarship Interview'}
                            </p>
                        </div>
                    </div>
                    <Badge className={status.color + ' px-4 py-2 text-sm'}>
                        <StatusIcon className="mr-2 h-4 w-4" />
                        {status.label}
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Status Card */}
                        <Card
                            className={`border-2 ${
                                interview.status === 'scheduled'
                                    ? 'border-blue-200 dark:border-blue-800'
                                    : interview.status === 'completed'
                                      ? 'border-green-200 dark:border-green-800'
                                      : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`rounded-full p-3 ${
                                            interview.status === 'scheduled'
                                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                                : interview.status === 'completed'
                                                  ? 'bg-green-100 dark:bg-green-900/30'
                                                  : 'bg-gray-100 dark:bg-gray-800'
                                        }`}
                                    >
                                        <StatusIcon
                                            className={`h-8 w-8 ${
                                                interview.status === 'scheduled'
                                                    ? 'text-blue-600'
                                                    : interview.status === 'completed'
                                                      ? 'text-green-600'
                                                      : 'text-gray-600'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">{status.label}</h2>
                                        <p className="mt-1 text-gray-500">{status.description}</p>
                                        {isUpcoming && getTimeUntil() && (
                                            <p className="mt-2 font-medium text-blue-600 dark:text-blue-400">
                                                Time remaining: {getTimeUntil()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interview Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Schedule Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">Date</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold">
                                            {new Date(interview.schedule).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm">Time</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold">
                                            {new Date(interview.schedule).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">Location</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold">
                                            {interview.application?.location || 'OSAS Office, MinSU Main Campus'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <User className="h-4 w-4" />
                                            <span className="text-sm">Interviewer</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold">
                                            {interview.application?.interviewer?.name || 'To be assigned'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Scholarship Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Scholarship Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Scholarship Name</span>
                                        <span className="font-medium">{interview.scholarship?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-medium">
                                            {interview.scholarship?.type
                                                ?.replace('_', ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Remarks */}
                        {interview.remarks && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">{interview.remarks}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        {canReschedule && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Need to Reschedule?</CardTitle>
                                    <CardDescription>
                                        If you cannot attend on the scheduled date, you can request a reschedule.
                                        Please do this at least 24 hours before your interview.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsRescheduleDialogOpen(true)}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Request Reschedule
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Preparation Checklist */}
                        {isUpcoming && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Preparation Checklist
                                    </CardTitle>
                                    <CardDescription>
                                        Track your preparation progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {preparationChecklist.map((item) => {
                                            const isChecked = checkedItems.includes(item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => toggleCheckedItem(item.id)}
                                                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                                                        isChecked
                                                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                                            : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
                                                    }`}
                                                >
                                                    <div
                                                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                                                            isChecked
                                                                ? 'border-green-500 bg-green-500 text-white'
                                                                : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    >
                                                        {isChecked && <CheckCircle2 className="h-3 w-3" />}
                                                    </div>
                                                    <span
                                                        className={`text-sm ${
                                                            isChecked
                                                                ? 'text-green-700 line-through dark:text-green-300'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {item.text}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Progress: {checkedItems.length} of {preparationChecklist.length} completed
                                        </p>
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-full rounded-full bg-green-500 transition-all"
                                                style={{
                                                    width: `${(checkedItems.length / preparationChecklist.length) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Phone className="h-5 w-5" />
                                    Contact OSAS
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Have questions about your interview? Contact the Office of Student
                                    Affairs and Services:
                                </p>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Location:</span> MinSU Main Campus,
                                        Admin Building
                                    </p>
                                    <p>
                                        <span className="font-medium">Hours:</span> Mon-Fri, 8:00 AM - 5:00 PM
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('student.interviews.index')}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        All My Interviews
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('student.scholarships.my-applications')}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        My Applications
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Reschedule Dialog */}
            <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Interview Reschedule</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for your reschedule request. The OSAS staff will
                            review your request and contact you with a new schedule.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Reschedule *</Label>
                            <Textarea
                                id="reason"
                                placeholder="Please explain why you need to reschedule..."
                                value={rescheduleForm.data.reason}
                                onChange={(e) => rescheduleForm.setData('reason', e.target.value)}
                                rows={4}
                            />
                            {rescheduleForm.errors.reason && (
                                <p className="text-sm text-red-600">{rescheduleForm.errors.reason}</p>
                            )}
                        </div>
                        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <AlertCircle className="mr-1 inline h-4 w-4" />
                                Please request reschedule at least 24 hours before your interview.
                                Multiple reschedule requests may affect your application.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRescheduleSubmit}
                            disabled={rescheduleForm.processing || !rescheduleForm.data.reason}
                        >
                            {rescheduleForm.processing ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
