import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import renewal from '@/routes/renewal';
import student from '@/routes/student';
import { BreadcrumbItem } from '@/types';
import { RenewalDeadlines, RenewalEligibility, ScholarshipApplication } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, BookOpen, Calendar, CheckCircle2, GraduationCap, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'My Applications', href: '/student/scholarships/my-applications' },
    { title: 'Check Renewal Eligibility', href: '#' },
];

interface Props {
    application: ScholarshipApplication;
    eligibility: RenewalEligibility;
    deadlines: RenewalDeadlines;
}

export default function CheckEligibility({ application, eligibility, deadlines }: Props) {
    const requirements = eligibility.requirements;

    const RequirementItem = ({
        label,
        met,
        detail,
    }: {
        label: string;
        met: boolean;
        detail?: string;
    }) => (
        <div className="flex items-start gap-3 rounded-lg border p-4">
            {met ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            ) : (
                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            )}
            <div className="flex-1">
                <p className={`font-medium ${met ? 'text-green-700' : 'text-red-700'}`}>{label}</p>
                {detail && <p className="text-sm text-gray-500">{detail}</p>}
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check Renewal Eligibility" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                        Scholarship Renewal Eligibility
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Check if you're eligible to renew your scholarship for the upcoming semester
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Scholarship Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        {application.scholarship?.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {application.scholarship?.type?.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Scholarship
                                    </CardDescription>
                                </div>
                                <Badge variant={eligibility.eligible ? 'default' : 'destructive'}>
                                    {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Eligibility Status */}
                            <div
                                className={`rounded-lg p-4 ${
                                    eligibility.eligible
                                        ? 'bg-green-50 dark:bg-green-900/20'
                                        : 'bg-red-50 dark:bg-red-900/20'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {eligibility.eligible ? (
                                        <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                                    )}
                                    <div>
                                        <h3
                                            className={`font-semibold ${
                                                eligibility.eligible ? 'text-green-800' : 'text-red-800'
                                            }`}
                                        >
                                            {eligibility.eligible
                                                ? 'You are eligible for renewal!'
                                                : 'You are not currently eligible for renewal'}
                                        </h3>
                                        {eligibility.reasons.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-sm">
                                                {eligibility.reasons.map((reason, index) => (
                                                    <li key={index} className="text-gray-600">
                                                        • {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Requirements Checklist */}
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Requirements Checklist</h3>
                                <div className="space-y-3">
                                    <RequirementItem
                                        label="GWA Requirement Met"
                                        met={requirements.current_gwa !== null && requirements.current_gwa <= requirements.gwa_requirement}
                                        detail={`Required: ≤ ${requirements.gwa_requirement.toFixed(2)} | Current: ${
                                            requirements.current_gwa?.toFixed(2) ?? 'Not set'
                                        }`}
                                    />
                                    <RequirementItem
                                        label="Currently Enrolled"
                                        met={requirements.enrolled}
                                        detail={requirements.enrolled ? 'You are currently enrolled' : 'You must be enrolled to renew'}
                                    />
                                    <RequirementItem
                                        label="No Disciplinary Action"
                                        met={requirements.no_disciplinary_action}
                                        detail={
                                            requirements.no_disciplinary_action
                                                ? 'No disciplinary actions on record'
                                                : 'Disciplinary action affects eligibility'
                                        }
                                    />
                                    <RequirementItem
                                        label="Required Documents Complete"
                                        met={requirements.documents_complete}
                                        detail={
                                            requirements.documents_complete
                                                ? 'All required documents submitted'
                                                : 'Some documents are missing'
                                        }
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                                {eligibility.eligible ? (
                                    <Button asChild>
                                        <Link href={renewal.create(application.id).url}>
                                            Proceed with Renewal Application
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button disabled variant="secondary">
                                        Cannot Proceed - Requirements Not Met
                                    </Button>
                                )}
                                <Button variant="outline" asChild>
                                    <Link href={student.applications.url()}>
                                        Back to My Applications
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Deadlines Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5" />
                                    Renewal Deadlines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                        Current Semester
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-blue-900 dark:text-blue-100">
                                        {deadlines.current_semester.semester} {deadlines.current_semester.year}
                                    </p>
                                    <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                        Deadline: {new Date(deadlines.current_semester.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <p className="text-sm font-medium text-gray-600">Next Semester</p>
                                    <p className="mt-1 font-semibold">
                                        {deadlines.next_semester.semester} {deadlines.next_semester.year}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Deadline: {new Date(deadlines.next_semester.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BookOpen className="h-5 w-5" />
                                    Student Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-medium">
                                        {application.student?.first_name} {application.student?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Student ID</span>
                                    <span className="font-medium">
                                        {application.student?.student_profile?.student_id ?? 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Course</span>
                                    <span className="font-medium">
                                        {application.student?.student_profile?.course ?? 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Year Level</span>
                                    <span className="font-medium">
                                        {application.student?.student_profile?.year_level ?? 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Current GWA</span>
                                    <span className="font-medium">
                                        {application.student?.student_profile?.current_gwa?.toFixed(2) ?? 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
