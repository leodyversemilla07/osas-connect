import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, GraduationCap, User } from 'lucide-react';
import { FormEvent } from 'react';

interface Student {
    id: number;
    name: string;
    student_id: string;
    email: string;
    phone: string;
    course: string;
    year_level: string;
}

interface Scholarship {
    id: number;
    name: string;
    type: string;
}

interface Application {
    id: number;
    status: string;
    student: Student;
    scholarship: Scholarship;
    interview_scheduled: boolean;
    interview_date: string | null;
}

interface Props {
    application: Application;
}

export default function InterviewSchedule({ application }: Props) {
    const form = useForm({
        interview_date: '',
        interview_time: '',
        location: '',
        notes: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('osas.scholarships.interview.store', application.id), {
            onSuccess: () => {
                // Redirect back to application review page
                window.location.href = route('osas.applications.review', application.id);
            },
        });
    };

    // Generate time options for the select dropdown
    const timeOptions: { value: string; label: string }[] = [];
    for (let hour = 8; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            timeOptions.push({ value: timeString, label: displayTime });
        }
    }

    return (
        <>
            <Head title="Schedule Interview" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('osas.applications.review', application.id)}
                                        className="flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        <ArrowLeft className="mr-1 h-5 w-5" />
                                        Back to Application
                                    </Link>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Schedule Interview</h1>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Student Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <User className="mr-2 h-5 w-5" />
                                            Student Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <span className="font-medium">Name:</span>
                                            <p className="text-gray-600">{application.student.name}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Student ID:</span>
                                            <p className="text-gray-600">{application.student.student_id}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Email:</span>
                                            <p className="text-gray-600">{application.student.email}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Phone:</span>
                                            <p className="text-gray-600">{application.student.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Course:</span>
                                            <p className="text-gray-600">{application.student.course}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Year Level:</span>
                                            <p className="text-gray-600">{application.student.year_level}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Scholarship Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <GraduationCap className="mr-2 h-5 w-5" />
                                            Scholarship Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <span className="font-medium">Scholarship:</span>
                                            <p className="text-gray-600">{application.scholarship.name}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Type:</span>
                                            <p className="text-gray-600">{application.scholarship.type}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Application Status:</span>
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {application.status}
                                            </span>
                                        </div>
                                        {application.interview_scheduled && (
                                            <div>
                                                <span className="font-medium">Current Interview:</span>
                                                <p className="text-gray-600">
                                                    {application.interview_date ? new Date(application.interview_date).toLocaleString() : 'Scheduled'}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Interview Scheduling Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Calendar className="mr-2 h-5 w-5" />
                                            {application.interview_scheduled ? 'Reschedule Interview' : 'Schedule Interview'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={submit} className="space-y-4">
                                            <div>
                                                <Label htmlFor="interview_date">Interview Date</Label>
                                                <Input
                                                    id="interview_date"
                                                    type="date"
                                                    value={form.data.interview_date}
                                                    onChange={(e) => form.setData('interview_date', e.target.value)}
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="mt-1"
                                                />
                                                {form.errors.interview_date && (
                                                    <p className="mt-1 text-sm text-red-600">{form.errors.interview_date}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="interview_time">Interview Time</Label>
                                                <select
                                                    id="interview_time"
                                                    value={form.data.interview_time}
                                                    onChange={(e) => form.setData('interview_time', e.target.value)}
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">Select time</option>
                                                    {timeOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {form.errors.interview_time && (
                                                    <p className="mt-1 text-sm text-red-600">{form.errors.interview_time}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    type="text"
                                                    value={form.data.location}
                                                    onChange={(e) => form.setData('location', e.target.value)}
                                                    placeholder="e.g., OSAS Office, Room 201"
                                                    required
                                                    className="mt-1"
                                                />
                                                {form.errors.location && <p className="mt-1 text-sm text-red-600">{form.errors.location}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="notes">Notes (Optional)</Label>
                                                <Textarea
                                                    id="notes"
                                                    value={form.data.notes}
                                                    onChange={(e) => form.setData('notes', e.target.value)}
                                                    placeholder="Additional instructions or notes for the student..."
                                                    rows={3}
                                                    className="mt-1"
                                                />
                                                {form.errors.notes && <p className="mt-1 text-sm text-red-600">{form.errors.notes}</p>}
                                            </div>

                                            <div className="flex space-x-3">
                                                <Button type="submit" disabled={form.processing} className="flex-1">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    {form.processing
                                                        ? 'Scheduling...'
                                                        : application.interview_scheduled
                                                          ? 'Reschedule Interview'
                                                          : 'Schedule Interview'}
                                                </Button>
                                                <Link
                                                    href={route('osas.applications.review', application.id)}
                                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </Link>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Additional Instructions */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Interview Guidelines</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-inside list-disc space-y-1 text-gray-600">
                                        <li>Interviews should be scheduled at least 24 hours in advance</li>
                                        <li>Students will receive an email notification with interview details</li>
                                        <li>Prepare interview questions based on the scholarship criteria</li>
                                        <li>Ensure the interview location is accessible and professional</li>
                                        <li>Allow 30-45 minutes for each interview session</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
