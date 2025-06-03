import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, DollarSign, FileText, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('student.scholarships.index')}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Scholarships
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{scholarship.name}</h1>
                                    <p className="text-gray-600 mt-2">{scholarship.description}</p>
                                </div>
                                <Badge className={getStatusColor(scholarship.status)}>
                                    {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <CardTitle className="text-sm font-medium ml-2">
                                            Monthly Stipend
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            ₱{scholarship.amount?.toLocaleString() || 'TBD'}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <CardTitle className="text-sm font-medium ml-2">
                                            Application Deadline
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {new Date(scholarship.deadline).toLocaleDateString()}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <CardTitle className="text-sm font-medium ml-2">
                                            Available Slots
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {scholarship.slots_available}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <CardTitle className="text-sm font-medium ml-2">
                                            Funding Source
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm">
                                            {scholarship.funding_source}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Eligibility Criteria</CardTitle>
                                        <CardDescription>
                                            Requirements you must meet to be eligible
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {scholarship.eligibility_criteria.map((criterion, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                                                    <span className="text-sm">{criterion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Required Documents</CardTitle>
                                        <CardDescription>
                                            Documents you need to submit with your application
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {scholarship.required_documents.map((document, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
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
                                            <CardDescription>
                                                You have already applied for this scholarship
                                            </CardDescription>
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
                                                    href={route('student.applications.show', existing_application.id)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
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
                                                href={route('student.scholarships.apply', scholarship.id)}
                                                className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-blue-700"
                                            >
                                                Apply for this Scholarship
                                            </Link>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-red-600 font-medium">
                                                    You are not eligible to apply for this scholarship
                                                </p>
                                                {eligibility.reasons.length > 0 && (
                                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                                        <h4 className="font-medium text-red-800 mb-2">Reasons:</h4>
                                                        <ul className="list-disc list-inside text-sm text-red-700">
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
