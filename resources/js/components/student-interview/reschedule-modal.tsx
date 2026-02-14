import { Dialog, DialogTitle } from '@/components/ui/dialog';
import student from '@/routes/student';
import { Textarea } from '@/components/ui/textarea';
import { Interview } from '@/types/models';
import { Form } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    interview: Interview;
}

export default function RescheduleModal({ isOpen, setIsOpen, interview }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Form
                action={student.interviews.reschedule(interview.id).url}
                method="post"
                resetOnSuccess
                onSuccess={() => {
                    setIsOpen(false);
                }}
            >
                {({ errors, processing }) => (
                    <div className="p-6">
                        <DialogTitle className="text-lg font-medium text-gray-900">Request Interview Reschedule</DialogTitle>

                        <div className="mt-6">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Reason for Reschedule
                                </label>
                                <div>
                                    <Textarea id="reason" name="reason" required maxLength={500} />
                                    {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase shadow-sm transition hover:text-gray-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:outline-none active:bg-gray-50 active:text-gray-800 disabled:opacity-25"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition hover:bg-yellow-700 focus:border-yellow-900 focus:ring focus:ring-yellow-300 focus:outline-none active:bg-yellow-900 disabled:opacity-25"
                                disabled={processing}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                )}
            </Form>
        </Dialog>
    );
}
