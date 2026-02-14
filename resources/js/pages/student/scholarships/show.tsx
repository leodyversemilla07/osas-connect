import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticatedLayout from '@/layouts/app-layout';
import student from '@/routes/student';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, FileText, Users } from 'lucide-react';

interface ScholarshipShowProps {
    scholarship: {
        id: number;
        name: string;
        description: string;
        type: string;
        amount: number;
        deadline: string;
        status: string;
        eligibility_criteria: string[];
        required_documents: string[];
        slots_available: number;
        funding_source: string;
    };
    eligibility: {
        can_apply: boolean;
        is_eligible: boolean;
        requirements: string[];
        reasons: string[];
    };
    existing_application?: {
        id: number;
        status: string;
        submitted_at: string;
    };
    auth?: unknown;
    flash?: unknown;
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function ScholarshipShow() {
    const { scholarship, eligibility, existing_application } = usePage<ScholarshipShowProps>().props;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getApplicationStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'submitted':
            case 'under_verification':
            case 'under_evaluation':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Scholarship: ${scholarship.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={student.scholarships.index.url()}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Scholarships
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{scholarship.name}</h1>
                                    <p className="mt-2 text-gray-600">{scholarship.description}</p>
                                </div>
                                <Badge className={getStatusColor(scholarship.status)}>
                                    {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <DollarSign className="text-muted-foreground h-4 w-4" />
                                        <CardTitle className="ml-2 text-sm font-medium">Monthly Stipend</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">₱{scholarship.amount?.toLocaleString() || 'TBD'}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <Calendar className="text-muted-foreground h-4 w-4" />
                                        <CardTitle className="ml-2 text-sm font-medium">Application Deadline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{new Date(scholarship.deadline).toLocaleDateString()}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <Users className="text-muted-foreground h-4 w-4" />
                                        <CardTitle className="ml-2 text-sm font-medium">Available Slots</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{scholarship.slots_available}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <FileText className="text-muted-foreground h-4 w-4" />
                                        <CardTitle className="ml-2 text-sm font-medium">Funding Source</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm">{scholarship.funding_source}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Eligibility Criteria</CardTitle>
                                        <CardDescription>Requirements you must meet to be eligible</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {scholarship.eligibility_criteria.map((criterion, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="mt-2 mr-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                                    <span className="text-sm">{criterion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Required Documents</CardTitle>
                                        <CardDescription>Documents you need to submit with your application</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {scholarship.required_documents.map((document, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="mt-2 mr-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                                                    <span className="text-sm">{document}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Application Status or Apply Button */}
                            <div className="border-t pt-6">
                                {existing_application ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Your Application</CardTitle>
                                            <CardDescription>You have already applied for this scholarship</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Applied on: {new Date(existing_application.submitted_at).toLocaleDateString()}
                                                    </p>
                                                    <Badge className={getApplicationStatusColor(existing_application.status)}>
                                                        {existing_application.status.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <Link
                                                    href={student.applications.status(existing_application.id).url}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700"
                                                >
                                                    View Application
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="text-center">
                                        {eligibility.can_apply ? (
                                            <Link
                                                href={student.scholarships.apply(scholarship.id).url}
                                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-semibold tracking-widest text-white uppercase hover:bg-blue-700"
                                            >
                                                Apply for this Scholarship
                                            </Link>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="font-medium text-red-600">You are not eligible to apply for this scholarship</p>
                                                {eligibility.reasons.length > 0 && (
                                                    <div className="rounded-md border border-red-200 bg-red-50 p-4">
                                                        <h4 className="mb-2 font-medium text-red-800">Reasons:</h4>
                                                        <ul className="list-inside list-disc text-sm text-red-700">
                                                            {eligibility.reasons.map((reason, index) => (
                                                                <li key={index}>{reason}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
