import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Calendar, 
    Clock, 
    User, 
    GraduationCap, 
    ArrowLeft,
    MapPin,
    Users
} from 'lucide-react';
import { FormEvent } from 'react';

interface Student {
    id: number;
    name: string;
    student_id: string;
    profile: {
        first_name: string;
        last_name: string;
        course: string;
        year_level: string;
    };
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
}

interface Props {
    applications: Application[];
}

export default function InterviewCreate({ applications }: Props) {
    const form = useForm({
        application_id: '',
        interviewer_id: '',
        schedule: '',
        location: '',
        interview_type: 'in_person',
        notes: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('osas.interviews.store'), {
            onSuccess: () => {
                // Redirect will be handled by the controller
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
                hour12: true
            });
            timeOptions.push({ value: timeString, label: displayTime });
        }
    }

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    const selectedApplication = applications.find(app => app.id === parseInt(form.data.application_id));

    return (
        <>
            <Head title="Schedule Interview" />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link
                                href={route('osas.interviews.index')}
                                className="flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Back to Interviews
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Schedule New Interview</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Schedule an interview for a verified scholarship application
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Interview Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Interview Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="space-y-6">
                                        {/* Application Selection */}
                                        <div>
                                            <Label htmlFor="application_id">Select Application *</Label>
                                            <select
                                                id="application_id"
                                                value={form.data.application_id}
                                                onChange={(e) => form.setData('application_id', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            >
                                                <option value="">Select an application</option>
                                                {applications.map((application) => (
                                                    <option key={application.id} value={application.id}>
                                                        {application.student.profile.first_name} {application.student.profile.last_name} - {application.scholarship.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {form.errors.application_id && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.application_id}</p>
                                            )}
                                        </div>

                                        {/* Interview Date */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="date">Interview Date *</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="date"
                                                        type="date"
                                                        min={today}
                                                        value={form.data.schedule.split('T')[0]}
                                                        onChange={(e) => {
                                                            const currentTime = form.data.schedule.split('T')[1] || '09:00';
                                                            form.setData('schedule', `${e.target.value}T${currentTime}`);
                                                        }}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                                {form.errors.schedule && (
                                                    <p className="mt-1 text-sm text-red-600">{form.errors.schedule}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="time">Interview Time *</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <select
                                                        id="time"
                                                        value={form.data.schedule.split('T')[1] || ''}
                                                        onChange={(e) => {
                                                            const currentDate = form.data.schedule.split('T')[0] || today;
                                                            form.setData('schedule', `${currentDate}T${e.target.value}`);
                                                        }}
                                                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    >
                                                        <option value="">Select time</option>
                                                        {timeOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interview Type */}
                                        <div>
                                            <Label htmlFor="interview_type">Interview Type *</Label>
                                            <select
                                                id="interview_type"
                                                value={form.data.interview_type}
                                                onChange={(e) => form.setData('interview_type', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            >
                                                <option value="in_person">In Person</option>
                                                <option value="online">Online (Video Call)</option>
                                                <option value="phone">Phone Call</option>
                                            </select>
                                            {form.errors.interview_type && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.interview_type}</p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <Label htmlFor="location">
                                                Location {form.data.interview_type === 'in_person' ? '*' : '(Optional)'}
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <Input
                                                    id="location"
                                                    type="text"
                                                    value={form.data.location}
                                                    onChange={(e) => form.setData('location', e.target.value)}
                                                    placeholder={
                                                        form.data.interview_type === 'online' 
                                                            ? 'Meeting link will be provided' 
                                                            : form.data.interview_type === 'phone'
                                                            ? 'Phone number will be provided'
                                                            : 'Enter meeting location'
                                                    }
                                                    className="pl-10"
                                                    required={form.data.interview_type === 'in_person'}
                                                />
                                            </div>
                                            {form.errors.location && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.location}</p>
                                            )}
                                        </div>

                                        {/* Interviewer Selection */}
                                        <div>
                                            <Label htmlFor="interviewer_id">Assign Interviewer *</Label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <select
                                                    id="interviewer_id"
                                                    value={form.data.interviewer_id}
                                                    onChange={(e) => form.setData('interviewer_id', e.target.value)}
                                                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                >
                                                    <option value="">Select interviewer</option>
                                                    {/* Note: In a real implementation, you'd pass a list of available interviewers */}
                                                    <option value="1">Admin User</option>
                                                    <option value="2">OSAS Staff 1</option>
                                                    <option value="3">OSAS Staff 2</option>
                                                </select>
                                            </div>
                                            {form.errors.interviewer_id && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.interviewer_id}</p>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                value={form.data.notes}
                                                onChange={(e) => form.setData('notes', e.target.value)}
                                                rows={3}
                                                placeholder="Any additional information about the interview..."
                                            />
                                            {form.errors.notes && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.notes}</p>
                                            )}
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex justify-end space-x-3 pt-6">
                                            <Link
                                                href={route('osas.interviews.index')}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Cancel
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={form.processing}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                {form.processing ? 'Scheduling...' : 'Schedule Interview'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Selected Application Details */}
                        <div>
                            {selectedApplication && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <User className="h-5 w-5 mr-2" />
                                            Application Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Student Information</h4>
                                            <p className="text-sm text-gray-600">
                                                {selectedApplication.student.profile.first_name} {selectedApplication.student.profile.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {selectedApplication.student.student_id}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Academic Information</h4>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <GraduationCap className="h-4 w-4 mr-1" />
                                                {selectedApplication.student.profile.course}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Year {selectedApplication.student.profile.year_level}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Scholarship</h4>
                                            <p className="text-sm text-gray-600">
                                                {selectedApplication.scholarship.name}
                                            </p>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {selectedApplication.scholarship.type}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t">
                                            <Link
                                                href={route('osas.applications.review', selectedApplication.id)}
                                                className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                View Full Application →
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {!selectedApplication && (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Select an application to view details
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
