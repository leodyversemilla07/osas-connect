import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Interview } from '@/types/models';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Interviews',
        href: '/student/interviews',
    },
];

interface Props {
    interviews: Interview[];
}

const InterviewCard = ({ interview }: { interview: Interview }) => {
    const getInterviewerName = () => {
        return interview.application?.interviewer?.name || 'Not assigned';
    };

    const getLocation = () => {
        return interview.application?.location || 'To be determined';
    };

    const getStatusLabel = (status: Interview['status']) => {
        switch (status) {
            case 'scheduled':
                return 'Scheduled';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            case 'rescheduled':
                return 'Rescheduled';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md lg:p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3 lg:space-y-4">
                    <div>
                        <h3 className="text-lg leading-tight font-semibold text-gray-900 lg:text-xl dark:text-gray-100">
                            {interview.scholarship?.name || 'Scholarship Interview'}
                        </h3>
                        <p className="mt-1 text-xs font-medium tracking-wider text-gray-500 uppercase lg:text-sm dark:text-gray-400">
                            {interview.scholarship?.type || 'General'} Scholarship Interview
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
                        <div className="flex min-h-[24px] items-center text-sm text-gray-600 lg:text-base dark:text-gray-400">
                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0 lg:mr-3 lg:h-5 lg:w-5" />
                            <span className="truncate">{formatDate(interview.schedule)}</span>
                        </div>
                        <div className="flex min-h-[24px] items-center text-sm text-gray-600 lg:text-base dark:text-gray-400">
                            <Clock className="mr-2 h-4 w-4 flex-shrink-0 lg:mr-3 lg:h-5 lg:w-5" />
                            <span className="truncate">
                                {new Date(interview.schedule).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="flex min-h-[24px] items-center text-sm text-gray-600 lg:text-base dark:text-gray-400">
                            <MapPin className="mr-2 h-4 w-4 flex-shrink-0 lg:mr-3 lg:h-5 lg:w-5" />
                            <span className="truncate">{getLocation()}</span>
                        </div>
                        <div className="flex min-h-[24px] items-center text-sm text-gray-600 lg:text-base dark:text-gray-400">
                            <User className="mr-2 h-4 w-4 flex-shrink-0 lg:mr-3 lg:h-5 lg:w-5" />
                            <span className="truncate">{getInterviewerName()}</span>
                        </div>
                    </div>
                </div>

                <div className="ml-4 flex flex-shrink-0 flex-col items-end space-y-3 lg:ml-6 lg:space-y-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 lg:px-3 lg:py-1.5 lg:text-sm dark:bg-blue-900/20 dark:text-blue-300">
                        {getStatusLabel(interview.status)}
                    </span>
                    {interview.status === 'scheduled' && (
                        <a
                            href={route('student.interviews.reschedule', {
                                interview: interview.id,
                            })}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:px-4 lg:py-2.5 lg:text-base dark:text-gray-400 dark:hover:border-blue-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                        >
                            Request Reschedule
                        </a>
                    )}
                </div>
            </div>

            {interview.remarks && (
                <div className="mt-4 border-t border-gray-100 pt-4 lg:mt-6 lg:pt-6 dark:border-gray-700">
                    <p className="text-sm leading-relaxed text-gray-600 lg:text-base dark:text-gray-400">{interview.remarks}</p>
                </div>
            )}
        </div>
    );
};

export default function Index({ interviews }: Props) {
    // Sort interviews by date
    const sortedInterviews = [...interviews].sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());

    // Split interviews into upcoming and past
    const now = new Date();
    const upcomingInterviews = sortedInterviews.filter((interview) => new Date(interview.schedule) > now);
    const pastInterviews = sortedInterviews.filter((interview) => new Date(interview.schedule) <= now);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Interview Schedule" />

            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                {/* Header Section */}
                <div className="border-b border-gray-100 pb-6 lg:pb-8 dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl leading-tight font-semibold text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
                            Interview Schedule
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base lg:mt-3 lg:text-lg dark:text-gray-400">
                            View and manage your scholarship interview schedules
                        </p>
                    </div>
                </div>

                {interviews.length === 0 ? (
                    <div className="py-12 text-center lg:py-16">
                        <div className="mx-auto max-w-md">
                            <h3 className="text-lg leading-tight font-medium text-gray-900 sm:text-xl lg:text-2xl dark:text-gray-100">
                                No interviews scheduled
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base lg:mt-3 dark:text-gray-400">
                                You currently have no scheduled interviews.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 lg:space-y-8">
                        {upcomingInterviews.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-xl leading-tight font-semibold text-gray-900 sm:text-2xl lg:mb-6 lg:text-3xl dark:text-gray-100">
                                    Upcoming Interviews
                                </h2>
                                <div className="space-y-4 lg:space-y-6">
                                    {upcomingInterviews.map((interview) => (
                                        <InterviewCard key={interview.id} interview={interview} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {pastInterviews.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-xl leading-tight font-semibold text-gray-900 sm:text-2xl lg:mb-6 lg:text-3xl dark:text-gray-100">
                                    Past Interviews
                                </h2>
                                <div className="space-y-4 lg:space-y-6">
                                    {pastInterviews.map((interview) => (
                                        <InterviewCard key={interview.id} interview={interview} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
