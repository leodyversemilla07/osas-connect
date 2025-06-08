import { Interview } from '@/types/models';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-3 lg:space-y-4 flex-1">
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {interview.scholarship?.name || 'Scholarship Interview'}
            </h3>
            <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
              {interview.scholarship?.type || 'General'} Scholarship Interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <div className="flex items-center text-sm lg:text-base text-gray-600 dark:text-gray-400 min-h-[24px]">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">{formatDate(interview.schedule)}</span>
            </div>
            <div className="flex items-center text-sm lg:text-base text-gray-600 dark:text-gray-400 min-h-[24px]">
              <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">
                {new Date(interview.schedule).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center text-sm lg:text-base text-gray-600 dark:text-gray-400 min-h-[24px]">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">{getLocation()}</span>
            </div>
            <div className="flex items-center text-sm lg:text-base text-gray-600 dark:text-gray-400 min-h-[24px]">
              <User className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">{getInterviewerName()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3 lg:space-y-4 ml-4 lg:ml-6 flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
            {getStatusLabel(interview.status)}
          </span>
          {interview.status === 'scheduled' && (
            <a
              href={route('student.interviews.reschedule', {
                interview: interview.id,
              })}
              className="inline-flex items-center justify-center min-h-[44px] px-3 py-2 lg:px-4 lg:py-2.5 text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              Request Reschedule
            </a>
          )}
        </div>
      </div>

      {interview.remarks && (
        <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{interview.remarks}</p>
        </div>
      )}
    </div>
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
    (interview) => new Date(interview.schedule) > now
  );
  const pastInterviews = sortedInterviews.filter(
    (interview) => new Date(interview.schedule) <= now
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Interview Schedule" />

      <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-6 lg:pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">Interview Schedule</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 mt-2 lg:mt-3 leading-relaxed">View and manage your scholarship interview schedules</p>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 dark:text-gray-100 leading-tight">
                No interviews scheduled
              </h3>
              <p className="mt-2 lg:mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                You currently have no scheduled interviews.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            {upcomingInterviews.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6 leading-tight">
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
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6 leading-tight">
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
