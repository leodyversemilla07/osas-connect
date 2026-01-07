import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { RenewalDeadlines, RenewalEligibility, ScholarshipApplication } from '@/types/models';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, Calendar, FileText, GraduationCap, Upload } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'My Applications', href: '/student/scholarships/my-applications' },
    { title: 'Submit Renewal', href: '#' },
];

interface Props {
    application: ScholarshipApplication;
    eligibility: RenewalEligibility;
    deadlines: RenewalDeadlines;
}

export default function Create({ application, eligibility, deadlines }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        semester: deadlines.current_semester.semester,
        year: deadlines.current_semester.year,
        current_gwa: application.student?.student_profile?.current_gwa?.toString() ?? '',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('renewal.store', application.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submit Renewal Application" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                        Submit Renewal Application
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Complete the form below to renew your scholarship for the upcoming semester
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Renewal Application Form
                            </CardTitle>
                            <CardDescription>
                                Please review and confirm your information before submitting
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Scholarship Info (Read-only) */}
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <h3 className="mb-3 font-medium">Scholarship Details</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-sm text-gray-500">Scholarship Name</Label>
                                            <p className="font-medium">{application.scholarship?.name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-500">Type</Label>
                                            <p className="font-medium">
                                                {application.scholarship?.type?.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Renewal Period */}
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-3 flex items-center gap-2 font-medium">
                                        <Calendar className="h-4 w-4" />
                                        Renewal Period
                                    </h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="semester">Semester</Label>
                                            <Input
                                                id="semester"
                                                value={data.semester}
                                                onChange={(e) => setData('semester', e.target.value)}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="year">Academic Year</Label>
                                            <Input
                                                id="year"
                                                type="number"
                                                value={data.year}
                                                onChange={(e) => setData('year', parseInt(e.target.value))}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-3 flex items-center gap-2 font-medium">
                                        <GraduationCap className="h-4 w-4" />
                                        Academic Information
                                    </h3>
                                    <div>
                                        <Label htmlFor="current_gwa">Current GWA</Label>
                                        <Input
                                            id="current_gwa"
                                            type="number"
                                            step="0.001"
                                            min="1"
                                            max="5"
                                            value={data.current_gwa}
                                            onChange={(e) => setData('current_gwa', e.target.value)}
                                            placeholder="Enter your current GWA"
                                        />
                                        {errors.current_gwa && (
                                            <p className="mt-1 text-sm text-red-600">{errors.current_gwa}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            Philippine GWA scale: 1.0 (highest) to 5.0 (lowest)
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional information you'd like to provide..."
                                        rows={4}
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Submit Actions */}
                                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Submitting...' : 'Submit Renewal Application'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('renewal.check-eligibility', application.id)}>
                                            Back to Eligibility Check
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Deadline Warning */}
                        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-amber-800 dark:text-amber-200">
                                    <AlertCircle className="h-5 w-5" />
                                    Deadline Reminder
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    The renewal deadline for {deadlines.current_semester.semester}{' '}
                                    {deadlines.current_semester.year} is:
                                </p>
                                <p className="mt-2 text-lg font-bold text-amber-900 dark:text-amber-100">
                                    {new Date(deadlines.current_semester.deadline).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Requirements Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Eligibility Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">GWA Requirement</span>
                                        <span className="font-medium">
                                            ≤ {eligibility.requirements.gwa_requirement.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Your Current GWA</span>
                                        <span className="font-medium">
                                            {eligibility.requirements.current_gwa?.toFixed(2) ?? 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Enrollment Status</span>
                                        <span className="font-medium">
                                            {eligibility.requirements.enrolled ? '✓ Enrolled' : '✗ Not Enrolled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Disciplinary Record</span>
                                        <span className="font-medium">
                                            {eligibility.requirements.no_disciplinary_action ? '✓ Clear' : '✗ Has Record'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Upload Hint */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Upload className="h-5 w-5" />
                                    Required Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    After submitting your renewal application, you may be required to upload
                                    additional documents such as:
                                </p>
                                <ul className="mt-3 space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                        Updated Certificate of Registration
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                        Current Semester Grades
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                        Good Moral Certificate
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
