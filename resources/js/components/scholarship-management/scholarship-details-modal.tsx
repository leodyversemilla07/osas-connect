import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Calendar, DollarSign, ExternalLink, FileText, Info } from 'lucide-react';

type ScholarshipType = 'Academic' | 'Student Assistantship' | 'Performing Arts' | 'Economic Assistance';

interface Scholarship {
    id: number;
    name: string;
    type: ScholarshipType;
    amount: string;
    stipendSchedule: 'monthly' | 'semestral';
    deadline: string;
    description: string;
    status: 'open' | 'closed';
}

interface ScholarshipDetailsModalProps {
    scholarship: Scholarship | null;
    isOpen: boolean;
    onClose: () => void;
    showApplyButton?: boolean;
}

const getTypeColor = (type: ScholarshipType): string => {
    const colors: Record<ScholarshipType, string> = {
        Academic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Student Assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Performing Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Economic Assistance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

const getStatusColor = (status: 'open' | 'closed'): string => {
    return status === 'open'
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
};

export function ScholarshipDetailsModal({ scholarship, isOpen, onClose, showApplyButton = true }: ScholarshipDetailsModalProps) {
    if (!scholarship) return null;

    const deadline = new Date(scholarship.deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isApplicationOpen = scholarship.status === 'open' && daysLeft > 0;

    const handleApplyNow = () => {
        router.visit(`/student/scholarships/${scholarship.id}/apply`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{scholarship.name}</DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge className={getTypeColor(scholarship.type)}>{scholarship.type}</Badge>
                                <Badge className={getStatusColor(scholarship.status)}>
                                    {scholarship.status === 'open' ? 'Open for Applications' : 'Closed'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <DialogDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {scholarship.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Financial Information */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Financial Details
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stipend Amount</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{scholarship.amount}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Schedule</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize dark:text-gray-100">
                                    {scholarship.stipendSchedule}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Information */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Application Timeline
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Deadline</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {deadline.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Remaining</span>
                                <span
                                    className={`text-sm font-semibold ${
                                        daysLeft <= 7
                                            ? 'text-red-600 dark:text-red-400'
                                            : daysLeft <= 30
                                              ? 'text-yellow-600 dark:text-yellow-400'
                                              : 'text-green-600 dark:text-green-400'
                                    }`}
                                >
                                    {daysLeft > 0 ? `${daysLeft} days left` : 'Application period ended'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <FileText className="h-5 w-5 text-purple-600" />
                            General Requirements
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Must be a currently enrolled student at MinSU</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Submit complete application documents before the deadline</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Meet specific criteria based on scholarship type</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Maintain good academic standing throughout the scholarship period
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <Info className="h-5 w-5 text-blue-600" />
                            Important Notes
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <p>• Applications are processed on a first-come, first-served basis while slots are available.</p>
                            <p>• Incomplete applications will not be considered for evaluation.</p>
                            <p>• Recipients are required to maintain the scholarship requirements throughout the award period.</p>{' '}
                            <p>• For questions about this scholarship, please contact the OSAS office.</p>
                        </div>
                    </div>

                    {/* Apply Button */}
                    {showApplyButton && isApplicationOpen && (
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={handleApplyNow}
                                className="flex items-center gap-2 bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
                                size="lg"
                            >
                                Apply Now
                                <ExternalLink className="h-5 w-5" />
                            </Button>
                        </div>
                    )}

                    {/* Application Closed Message */}
                    {showApplyButton && !isApplicationOpen && (
                        <div className="flex justify-center pt-4">
                            <div className="rounded-lg bg-gray-100 px-8 py-3 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                {scholarship.status === 'closed' ? 'Application period has ended' : 'Applications are currently closed'}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
