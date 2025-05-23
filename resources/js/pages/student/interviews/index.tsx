import { PageProps } from '@/types';
import { Interview } from '@/types/models';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Student Dashboard',
    href: '/student/dashboard',
  },
  {
    title: 'Interviews',
    href: '/student/interviews',
  },
];

interface Props extends PageProps {
  interviews: Interview[];
}

const InterviewCard = ({ interview }: { interview: Interview }) => {
  const getInterviewerName = () => {
    return interview.application?.interviewer?.name || 'Not assigned';
  };

  const getLocation = () => {
    return interview.application?.location || 'To be determined';
  };

  return (
    <Card className="hover:bg-gray-50 transition">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {interview.scholarship?.name || 'Scholarship Interview'}
              </h3>
              <p className="text-sm text-gray-500">
                {interview.scholarship?.type || 'General'} Scholarship Interview
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(interview.schedule)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {new Date(interview.schedule).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {getLocation()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {getInterviewerName()}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-4">
            <Badge
              variant="secondary"
              className={getStatusClass(interview.status)}
            >
              {interview.status}
            </Badge>
            {interview.status === 'scheduled' && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={route('scholarships.interviews.reschedule', {
                    interview: interview.id,
                  })}
                >
                  Request Reschedule
                </a>
              </Button>
            )}
          </div>
        </div>

        {interview.remarks && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{interview.remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const getStatusClass = (status: Interview['status']) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'rescheduled':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
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

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Interview Schedule
            </h2>
            <p className="text-muted-foreground">
              View and manage your scholarship interview schedules
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            {interviews.length === 0 ? (
              <CardContent>
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    No interviews scheduled
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You currently have no scheduled interviews.
                  </p>
                </div>
              </CardContent>
            ) : (
              <>
                {upcomingInterviews.length > 0 && (
                  <div className="space-y-6">
                    <CardContent>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Upcoming Interviews
                      </h3>
                      <div className="space-y-4">
                        {upcomingInterviews.map((interview) => (
                          <InterviewCard key={interview.id} interview={interview} />
                        ))}
                      </div>
                    </CardContent>
                  </div>
                )}

                {pastInterviews.length > 0 && (
                  <div className="space-y-6">
                    <CardContent>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Past Interviews
                      </h3>
                      <div className="space-y-4">
                        {pastInterviews.map((interview) => (
                          <InterviewCard key={interview.id} interview={interview} />
                        ))}
                      </div>
                    </CardContent>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
