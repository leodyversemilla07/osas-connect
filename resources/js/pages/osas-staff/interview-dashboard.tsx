import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Calendar, CheckCircle, Clock, TrendingUp, UserX, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Interview Dashboard',
        href: route('osas.interviews.dashboard'),
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
    feedback: string;
    recommendation: string;
    scores: Record<string, number>;
    created_at: string;
    updated_at: string;
}

interface Statistics {
    total_interviews: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    no_show: number;
    this_week_count: number;
    completion_rate: number;
    average_score: number;
    monthly_trend: Array<{ month: string; count: number }>;
}

interface Props {
    statistics: Statistics;
    upcomingInterviews: Interview[];
    todayInterviews: Interview[];
}

export default function InterviewDashboard({ statistics, upcomingInterviews, todayInterviews }: Props) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            scheduled: { label: 'Scheduled', variant: 'default' as const },
            completed: { label: 'Completed', variant: 'default' as const },
            cancelled: { label: 'Cancelled', variant: 'destructive' as const },
            no_show: { label: 'No Show', variant: 'secondary' as const },
            rescheduled: { label: 'Rescheduled', variant: 'outline' as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const };

        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'no_show':
                return <UserX className="h-4 w-4 text-gray-600" />;
            default:
                return <Clock className="h-4 w-4 text-blue-600" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Interview Dashboard" />

            <div className="flex h-full flex-1 flex-col space-y-8 p-6 lg:p-8">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">Interview Dashboard</h1>
                            <p className="text-muted-foreground">Manage and track interview activities and statistics</p>
                        </div>
                        <Button asChild>
                            <Link href={route('osas.interviews.index')}>
                                View All Interviews
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-muted-foreground truncate text-sm font-medium">Total Interviews</p>
                                    <p className="text-2xl font-semibold">{statistics.total_interviews}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-muted-foreground truncate text-sm font-medium">Scheduled</p>
                                    <p className="text-2xl font-semibold">{statistics.scheduled}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-muted-foreground truncate text-sm font-medium">Completed</p>
                                    <p className="text-2xl font-semibold">{statistics.completed}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-muted-foreground truncate text-sm font-medium">Completion Rate</p>
                                    <p className="text-2xl font-semibold">{statistics.completion_rate}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Interviews */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-semibold">
                                <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
                                Today's Interviews ({todayInterviews.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {todayInterviews.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center">No interviews scheduled for today</p>
                            ) : (
                                <div className="space-y-4">
                                    {todayInterviews.slice(0, 5).map((interview) => (
                                        <div key={interview.id} className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(interview.status)}
                                                <div>
                                                    <p className="font-medium">
                                                        {interview.application.student.student_profile.first_name}{' '}
                                                        {interview.application.student.student_profile.last_name}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {formatTime(interview.schedule)} • {interview.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(interview.status)}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('osas.interviews.show', interview.id)}>View</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {todayInterviews.length > 5 && (
                                        <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                                            <Link href={route('osas.interviews.index')}>View all {todayInterviews.length} interviews</Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Interviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-semibold">
                                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                                Upcoming Interviews ({upcomingInterviews.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {upcomingInterviews.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center">No upcoming interviews scheduled</p>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingInterviews.slice(0, 5).map((interview) => (
                                        <div key={interview.id} className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(interview.status)}
                                                <div>
                                                    <p className="font-medium">
                                                        {interview.application.student.student_profile.first_name}{' '}
                                                        {interview.application.student.student_profile.last_name}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {formatDate(interview.schedule)} • {interview.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(interview.status)}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('osas.interviews.show', interview.id)}>View</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {upcomingInterviews.length > 5 && (
                                        <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                                            <Link href={route('osas.interviews.index')}>View all {upcomingInterviews.length} interviews</Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">Interviews This Week</p>
                                <p className="text-2xl font-semibold">{statistics.this_week_count}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">Average Interview Score</p>
                                <p className="text-2xl font-semibold">{statistics.average_score || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-muted-foreground text-sm font-medium">No-Show Count</p>
                                <p className="text-destructive text-2xl font-semibold">{statistics.no_show}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
