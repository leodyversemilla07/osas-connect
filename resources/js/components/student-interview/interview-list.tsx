import { Interview } from '@/types/models';
import { format } from 'date-fns';
import { Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

interface Props {
  interviews: Interview[];
}

export default function InterviewList({ interviews }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'missed':
        return 'red';
      case 'rescheduled':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const setRescheduleInterview = (interview: Interview) => {
    router.visit(route('scholarships.interviews.reschedule', interview.id), {
      method: 'get',
      preserveState: true,
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scholarship Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {interviews.map((interview) => (
            <tr key={interview.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(interview.schedule), 'MMM d, yyyy h:mm a')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {interview.application.scholarship.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={getStatusColor(interview.status)}>
                  {interview.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={route('scholarships.interviews.show', interview.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  View Details
                </Link>
                {interview.status === 'scheduled' && (
                  <button
                    onClick={() => setRescheduleInterview(interview)}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    Request Reschedule
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
