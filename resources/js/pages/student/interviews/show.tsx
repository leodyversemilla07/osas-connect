import { PageProps } from '@/types';
import { Interview } from '@/types/models';
import { Head } from '@inertiajs/react';
import RescheduleModal from '@/components/student-interview/reschedule-modal';
import { useState } from 'react';

interface Props extends PageProps {
  interview: Interview;
}

export default function Show({ interview }: Props) {
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  return (
    <>
      <Head title="Interview Details" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Interview Details
                </h2>
                {interview.status === 'scheduled' && (
                  <button
                    onClick={() => setIsRescheduleModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700"
                  >
                    Request Reschedule
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Scholarship Type
                    </h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {interview.application.scholarship.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Interview Schedule
                    </h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {new Date(interview.schedule).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {interview.status}
                    </p>
                  </div>

                  {interview.remarks && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Remarks
                      </h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {interview.remarks}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Important Notes
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Please arrive 15 minutes before your scheduled time</li>
                    <li>Bring valid identification</li>
                    <li>Dress appropriately for the interview</li>
                    <li>
                      If you need to reschedule, please request at least 24 hours
                      in advance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        setIsOpen={setIsRescheduleModalOpen}
        interview={interview}
      />
    </>
  );
}
