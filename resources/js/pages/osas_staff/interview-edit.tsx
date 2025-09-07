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
    Edit
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

interface Interviewer {
    id: number;
    name: string;
    email: string;
}

interface Interview {
    id: number;
    schedule: string;
    status: string;
    location: string;
    interview_type: string;
    notes: string;
    application: Application;
    interviewer: Interviewer;
    created_at: string;
    updated_at: string;
}

interface Props {
    interview: Interview;
}

export default function InterviewEdit({ interview }: Props) {
    const form = useForm({
        schedule: interview.schedule,
        location: interview.location || '',
        notes: interview.notes || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.patch(route('osas.interviews.update', interview.id), {
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

    // Parse the current schedule
    const currentDate = form.data.schedule ? form.data.schedule.split('T')[0] : '';
    const currentTime = form.data.schedule ? form.data.schedule.split('T')[1]?.substring(0, 5) : '';

    return (
        <>
            <Head title={`Edit Interview - ${interview.application.student.profile.first_name} ${interview.application.student.profile.last_name}`} />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link
                                href={route('osas.interviews.show', interview.id)}
                                className="flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Back to Interview
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Interview
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Update interview details for {interview.application.student.profile.first_name} {interview.application.student.profile.last_name}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Interview Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Edit className="h-5 w-5 mr-2" />
                                        Edit Interview Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="space-y-6">
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
                                                        value={currentDate}
                                                        onChange={(e) => {
                                                            const time = currentTime || '09:00';
                                                            form.setData('schedule', `${e.target.value}T${time}`);
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
                                                        value={currentTime}
                                                        onChange={(e) => {
                                                            const date = currentDate || today;
                                                            form.setData('schedule', `${date}T${e.target.value}`);
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

                                        {/* Location */}
                                        <div>
                                            <Label htmlFor="location">
                                                Location {interview.interview_type === 'in_person' ? '*' : '(Optional)'}
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <Input
                                                    id="location"
                                                    type="text"
                                                    value={form.data.location}
                                                    onChange={(e) => form.setData('location', e.target.value)}
                                                    placeholder={
                                                        interview.interview_type === 'online' 
                                                            ? 'Meeting link will be provided' 
                                                            : interview.interview_type === 'phone'
                                                            ? 'Phone number will be provided'
                                                            : 'Enter meeting location'
                                                    }
                                                    className="pl-10"
                                                    required={interview.interview_type === 'in_person'}
                                                />
                                            </div>
                                            {form.errors.location && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.location}</p>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                value={form.data.notes}
                                                onChange={(e) => form.setData('notes', e.target.value)}
                                                rows={4}
                                                placeholder="Any additional information about the interview..."
                                            />
                                            {form.errors.notes && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.notes}</p>
                                            )}
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex justify-end space-x-3 pt-6">
                                            <Link
                                                href={route('osas.interviews.show', interview.id)}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Cancel
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={form.processing}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                {form.processing ? 'Updating...' : 'Update Interview'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Application Details (Read-only) */}
                        <div>
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
                                            {interview.application.student.profile.first_name} {interview.application.student.profile.last_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {interview.application.student.student_id}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Academic Information</h4>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <GraduationCap className="h-4 w-4 mr-1" />
                                            {interview.application.student.profile.course}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Year {interview.application.student.profile.year_level}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Scholarship</h4>
                                        <p className="text-sm text-gray-600">
                                            {interview.application.scholarship.name}
                                        </p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {interview.application.scholarship.type}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Interview Type</h4>
                                        <p className="text-sm text-gray-600 capitalize">
                                            {interview.interview_type.replace('_', ' ')}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Interviewer</h4>
                                        <p className="text-sm text-gray-600">
                                            {interview.interviewer.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {interview.interviewer.email}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <Link
                                            href={route('osas.applications.review', interview.application.id)}
                                            className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            View Full Application →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Current Interview Info */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Current Interview</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Scheduled for</h4>
                                        <p className="text-sm text-gray-600">
                                            {new Date(interview.schedule).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    
                                    {interview.location && (
                                        <div>
                                            <h4 className="font-medium text-gray-900">Current Location</h4>
                                            <p className="text-sm text-gray-600">{interview.location}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-medium text-gray-900">Status</h4>
                                        <p className="text-sm text-gray-600 capitalize">{interview.status}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
