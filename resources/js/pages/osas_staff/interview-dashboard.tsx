import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    Clock, 
    TrendingUp, 
    CheckCircle, 
    XCircle, 
    UserX,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

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

        const config = statusConfig[status as keyof typeof statusConfig] || 
                      { label: status, variant: 'outline' as const };

        return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
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
            minute: '2-digit'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Interview Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Interview Dashboard
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Overview of interview activities and statistics
                            </p>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <Link
                                href={route('osas.interviews.index')}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                View All Interviews
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Calendar className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Total Interviews
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {statistics.total_interviews}
                                        </p>
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
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Scheduled
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {statistics.scheduled}
                                        </p>
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
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Completed
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {statistics.completed}
                                        </p>
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
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Completion Rate
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {statistics.completion_rate}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today's Interviews */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                                    Today's Interviews ({todayInterviews.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {todayInterviews.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No interviews scheduled for today
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {todayInterviews.slice(0, 5).map((interview) => (
                                            <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(interview.status)}
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {interview.application.student.profile.first_name} {interview.application.student.profile.last_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatTime(interview.schedule)} • {interview.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusBadge(interview.status)}
                                                    <Link
                                                        href={route('osas.interviews.show', interview.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                        {todayInterviews.length > 5 && (
                                            <Link
                                                href={route('osas.interviews.index')}
                                                className="block text-center text-indigo-600 hover:text-indigo-900 text-sm font-medium mt-4"
                                            >
                                                View all {todayInterviews.length} interviews
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upcoming Interviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                    Upcoming Interviews ({upcomingInterviews.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {upcomingInterviews.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No upcoming interviews scheduled
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {upcomingInterviews.slice(0, 5).map((interview) => (
                                            <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(interview.status)}
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {interview.application.student.profile.first_name} {interview.application.student.profile.last_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(interview.schedule)} • {interview.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusBadge(interview.status)}
                                                    <Link
                                                        href={route('osas.interviews.show', interview.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                        {upcomingInterviews.length > 5 && (
                                            <Link
                                                href={route('osas.interviews.index')}
                                                className="block text-center text-indigo-600 hover:text-indigo-900 text-sm font-medium mt-4"
                                            >
                                                View all {upcomingInterviews.length} interviews
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-gray-900 mb-2">
                                    {statistics.this_week_count}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Interviews This Week
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-gray-900 mb-2">
                                    {statistics.average_score || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Average Interview Score
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-2xl font-bold text-red-600 mb-2">
                                    {statistics.no_show}
                                </div>
                                <div className="text-sm text-gray-500">
                                    No-Show Count
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
