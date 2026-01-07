import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Interview } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    FileText,
    MapPin,
    User,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'My Interviews', href: '/student/interviews' },
];

interface Props {
    interviews: Interview[];
}

const statusConfig = {
    scheduled: {
        label: 'Scheduled',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: Calendar,
    },
    completed: {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
    },
    rescheduled: {
        label: 'Rescheduled',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: AlertCircle,
    },
    no_show: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: XCircle,
    },
};

const InterviewCard = ({ interview, isUpcoming }: { interview: Interview; isUpcoming: boolean }) => {
    const status = statusConfig[interview.status] || statusConfig.scheduled;
    const StatusIcon = status.icon;

    const getTimeUntilInterview = () => {
        const now = new Date();
        const interviewDate = new Date(interview.schedule);
        const diffMs = interviewDate.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} away`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} away`;
        } else if (diffMs > 0) {
            return 'Starting soon!';
        }
        return null;
    };

    const timeUntil = isUpcoming ? getTimeUntilInterview() : null;

    return (
        <Card className={`transition-all hover:shadow-md ${isUpcoming && interview.status === 'scheduled' ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {interview.scholarship?.name || 'Scholarship Interview'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {interview.scholarship?.type?.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Scholarship
                                </p>
                            </div>
                            <Badge className={status.color}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {status.label}
                            </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span>{formatDate(interview.schedule)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>
                                    {new Date(interview.schedule).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span>{interview.application?.location || 'OSAS Office'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span>{interview.application?.interviewer?.name || 'To be assigned'}</span>
                            </div>
                        </div>

                        {/* Time Until */}
                        {timeUntil && (
                            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                <Clock className="mr-1.5 h-3.5 w-3.5" />
                                {timeUntil}
                            </div>
                        )}

                        {/* Remarks */}
                        {interview.remarks && (
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Note:</span> {interview.remarks}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:items-end">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('student.interviews.show', interview.id)}>
                                <Eye className="mr-1.5 h-4 w-4" />
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function Index({ interviews }: Props) {
    // Sort interviews by date
    const sortedInterviews = [...interviews].sort(
        (a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
    );

    // Split interviews into upcoming and past
    const now = new Date();
    const upcomingInterviews = sortedInterviews.filter(
        (interview) => new Date(interview.schedule) > now && interview.status === 'scheduled'
    );
    const pastInterviews = sortedInterviews.filter(
        (interview) => new Date(interview.schedule) <= now || interview.status !== 'scheduled'
    );

    // Get next interview for highlight
    const nextInterview = upcomingInterviews[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Interviews" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6 dark:border-gray-800">
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                        My Interviews
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        View your scheduled scholarship interviews and preparation information
                    </p>
                </div>

                {interviews.length === 0 ? (
                    /* Empty State */
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                No Interviews Scheduled
                            </h3>
                            <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                                You don't have any scheduled interviews yet. Once your scholarship
                                application is verified, an interview may be scheduled.
                            </p>
                            <Button variant="outline" className="mt-4" asChild>
                                <Link href={route('student.scholarships.my-applications')}>
                                    View My Applications
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Next Interview Highlight */}
                            {nextInterview && (
                                <Card className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                                            <Calendar className="h-5 w-5" />
                                            Your Next Interview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                    {nextInterview.scholarship?.name}
                                                </h3>
                                                <p className="text-blue-700 dark:text-blue-300">
                                                    {new Date(nextInterview.schedule).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}{' '}
                                                    at{' '}
                                                    {new Date(nextInterview.schedule).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" asChild>
                                                    <Link href={route('student.interviews.show', nextInterview.id)}>
                                                        View Details & Prepare
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Upcoming Interviews */}
                            {upcomingInterviews.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Upcoming Interviews ({upcomingInterviews.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {upcomingInterviews.map((interview) => (
                                            <InterviewCard
                                                key={interview.id}
                                                interview={interview}
                                                isUpcoming={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Interviews */}
                            {pastInterviews.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Past Interviews ({pastInterviews.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {pastInterviews.map((interview) => (
                                            <InterviewCard
                                                key={interview.id}
                                                interview={interview}
                                                isUpcoming={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Preparation Tips */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5" />
                                        Interview Preparation
                                    </CardTitle>
                                    <CardDescription>
                                        Tips to help you succeed in your scholarship interview
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span>Arrive 15 minutes before your scheduled time</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span>Bring a valid school ID and any required documents</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span>Dress professionally and appropriately</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span>Prepare to discuss your academic goals and financial need</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                            <span>Be honest and confident in your responses</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <AlertCircle className="h-5 w-5" />
                                        Important Reminders
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 mt-2 rounded-full bg-gray-400 flex-shrink-0" />
                                            <span>
                                                Request reschedule at least 24 hours before your interview
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 mt-2 rounded-full bg-gray-400 flex-shrink-0" />
                                            <span>
                                                Missing your interview without notice may affect your application
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 mt-2 rounded-full bg-gray-400 flex-shrink-0" />
                                            <span>
                                                Contact OSAS if you have any questions or concerns
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
