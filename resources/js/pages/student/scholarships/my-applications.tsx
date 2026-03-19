import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatScholarshipDate, getProgressToneClass, getScholarshipStatusBadgeClass } from '@/lib/scholarship-application';
import AuthenticatedLayout from '@/layouts/app-layout';
import student from '@/routes/student';
import { ScholarshipApplicationListItem } from '@/types/scholarship-application';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Eye } from 'lucide-react';

interface Props {
    applications: ScholarshipApplicationListItem[];
}

export default function MyApplications({ applications }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="My Scholarship Applications" />

            <div className="py-6">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Scholarship Applications</h1>
                        <p className="mt-2 text-gray-600">Track the live status, verification progress, and next step for each application.</p>
                    </div>

                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-lg text-gray-500">No scholarship applications found.</p>
                                    <Link
                                        href={student.scholarships.index.url()}
                                        className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Browse Scholarships
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            applications.map((application) => (
                                <Card key={application.id} className="transition-shadow hover:shadow-md">
                                    <CardHeader className="space-y-3">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <CardTitle>{application.scholarship.name}</CardTitle>
                                                <p className="mt-1 text-sm text-gray-500">{application.scholarship.type_label}</p>
                                            </div>
                                            <Badge className={getScholarshipStatusBadgeClass(application.status)}>{application.status_label}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Submitted {formatScholarshipDate(application.submitted_at)}
                                            </div>
                                            <div>{application.scholarship.amount_display}</div>
                                            <div>
                                                {application.document_summary.verified_count}/{application.document_summary.required_count} documents verified
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                                                <span>Application Progress</span>
                                                <span>{application.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressToneClass(application.progress)}`}
                                                    style={{ width: `${application.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <Button asChild>
                                            <Link href={student.scholarships.applications.show(application.id).url}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
