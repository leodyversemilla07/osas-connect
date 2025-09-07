import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    User,
    GraduationCap,
    ArrowLeft,
    MapPin,
    Users,
    CalendarIcon
} from 'lucide-react';
import { FormEvent, useState, useEffect } from 'react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Interviews',
        href: route('osas.interviews.index'),
    },
    {
        title: 'Schedule Interview',
        href: route('osas.interviews.create'),
    },
];

interface Student {
    id: number;
    name: string;
    student_id: string;
    student_profile: {
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
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();
    
    const form = useForm({
        application_id: '',
        interviewer_id: '',
        schedule: '',
        location: '',
        interview_type: 'in_person',
        notes: '',
    });

    // Sync selectedDate with form data
    useEffect(() => {
        if (form.data.schedule) {
            const dateStr = form.data.schedule.split('T')[0];
            if (dateStr) {
                setSelectedDate(new Date(dateStr));
            }
        }
    }, [form.data.schedule]);

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Interview" />

            <div className="flex h-full flex-1 flex-col space-y-8 p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Schedule New Interview
                        </h1>
                        <p className="text-muted-foreground">
                            Schedule an interview for a verified scholarship application
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={route('osas.interviews.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Interviews
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

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
                                        <Select
                                            value={form.data.application_id}
                                            onValueChange={(value) => form.setData('application_id', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select an application" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {applications.map((application) => (
                                                    <SelectItem key={application.id} value={application.id.toString()}>
                                                        {application.student.student_profile.first_name} {application.student.student_profile.last_name} - {application.scholarship.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.errors.application_id && (
                                            <p className="mt-1 text-sm text-red-600">{form.errors.application_id}</p>
                                        )}
                                    </div>

                                    {/* Interview Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="date">Interview Date *</Label>
                                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal mt-1",
                                                            !selectedDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={(date) => {
                                                            setSelectedDate(date);
                                                            if (date) {
                                                                const currentTime = form.data.schedule.split('T')[1] || '09:00';
                                                                const formattedDate = format(date, 'yyyy-MM-dd');
                                                                form.setData('schedule', `${formattedDate}T${currentTime}`);
                                                            }
                                                            setDatePickerOpen(false);
                                                        }}
                                                        disabled={(date) => date < new Date(today)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {form.errors.schedule && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.schedule}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="time">Interview Time *</Label>
                                            <Input
                                                type="time"
                                                id="time"
                                                value={form.data.schedule.split('T')[1] || ''}
                                                onChange={(e) => {
                                                    const currentDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : today;
                                                    form.setData('schedule', `${currentDate}T${e.target.value}`);
                                                }}
                                                className="mt-1 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Interview Type */}
                                    <div>
                                        <Label htmlFor="interview_type">Interview Type *</Label>
                                        <Select
                                            value={form.data.interview_type}
                                            onValueChange={(value) => form.setData('interview_type', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select interview type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="in_person">In Person</SelectItem>
                                                <SelectItem value="online">Online (Video Call)</SelectItem>
                                                <SelectItem value="phone">Phone Call</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                                            <Select
                                                value={form.data.interviewer_id}
                                                onValueChange={(value) => form.setData('interviewer_id', value)}
                                            >
                                                <SelectTrigger className="pl-10 mt-1">
                                                    <SelectValue placeholder="Select interviewer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* Note: In a real implementation, you'd pass a list of available interviewers */}
                                                    <SelectItem value="1">Admin User</SelectItem>
                                                    <SelectItem value="2">OSAS Staff 1</SelectItem>
                                                    <SelectItem value="3">OSAS Staff 2</SelectItem>
                                                </SelectContent>
                                            </Select>
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

                                    <Separator />

                                    {/* Submit Buttons */}
                                    <div className="flex justify-end space-x-3">
                                        <Button variant="outline" asChild>
                                            <Link href={route('osas.interviews.index')}>
                                                Cancel
                                            </Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
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
                                        <h4 className="font-medium text-foreground">Student Information</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedApplication.student.student_profile.first_name} {selectedApplication.student.student_profile.last_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedApplication.student.student_id}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-foreground">Academic Information</h4>
                                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                                            <GraduationCap className="h-4 w-4 mr-1" />
                                            {selectedApplication.student.student_profile.course}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Year {selectedApplication.student.student_profile.year_level}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-foreground">Scholarship</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedApplication.scholarship.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {selectedApplication.scholarship.type}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <Link
                                            href={route('osas.applications.review', selectedApplication.id)}
                                            className="text-sm text-primary hover:text-primary/80 font-medium"
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
                                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Select an application to view details
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}