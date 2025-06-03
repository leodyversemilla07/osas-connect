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
    <div className="border-b border-gray-50 dark:border-gray-800 pb-6">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {interview.scholarship?.name || 'Scholarship Interview'}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {interview.scholarship?.type || 'General'} Scholarship Interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(interview.schedule)}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              {new Date(interview.schedule).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              {getLocation()}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4 mr-2" />
              {getInterviewerName()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-4 ml-6">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {getStatusLabel(interview.status)}
          </span>
          {interview.status === 'scheduled' && (
            <a
              href={route('student.interviews.reschedule', {
                interview: interview.id,
              })}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
            >
              Request Reschedule
            </a>
          )}
        </div>
      </div>

      {interview.remarks && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">{interview.remarks}</p>
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

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Interview Schedule</h1>
            <p className="text-base text-gray-500 dark:text-gray-400">View and manage your scholarship interview schedules</p>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No interviews scheduled
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You currently have no scheduled interviews.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {upcomingInterviews.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Upcoming Interviews
                </h2>
                <div className="space-y-6">
                  {upcomingInterviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))}
                </div>
              </div>
            )}

            {pastInterviews.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Past Interviews
                </h2>
                <div className="space-y-6">
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
