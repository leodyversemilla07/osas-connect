import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    Clock, 
    User, 
    MapPin, 
    Plus, 
    Search,
    Filter,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    UserX
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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

interface Props {
    interviews: {
        data: Interview[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Interviews({ interviews }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredInterviews = interviews.data.filter(interview => {
        const matchesSearch = 
            interview.application.student.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.application.student.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.application.student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.application.scholarship.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head title="Interview Management" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Interview Management
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage student interviews and schedules
                            </p>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
                            <Link
                                href={route('osas.interviews.dashboard')}
                                className="inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route('osas.interviews.create')}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule Interview
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search students or scholarships..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no_show">No Show</option>
                                        <option value="rescheduled">Rescheduled</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interviews List */}
                    <div className="space-y-4">
                        {filteredInterviews.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No interviews found
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {searchTerm || statusFilter !== 'all' 
                                            ? 'No interviews match your current filters.' 
                                            : 'Get started by scheduling your first interview.'
                                        }
                                    </p>
                                    <Link
                                        href={route('osas.interviews.create')}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule Interview
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredInterviews.map((interview) => (
                                <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    {getStatusIcon(interview.status)}
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {interview.application.student.profile.first_name} {interview.application.student.profile.last_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {interview.application.student.student_id} • {interview.application.student.profile.course}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(interview.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        {formatDate(interview.schedule)}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {interview.location || 'Location TBD'}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <User className="h-4 w-4 mr-2" />
                                                        {interview.interviewer.name}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Badge variant="outline">
                                                            {interview.application.scholarship.name}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {interview.notes && (
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        <strong>Notes:</strong> {interview.notes}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2 ml-4">
                                                <Link
                                                    href={route('osas.interviews.show', interview.id)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Link>
                                                {interview.status === 'scheduled' && (
                                                    <Link
                                                        href={route('osas.interviews.edit', interview.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {interviews.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {interviews.current_page > 1 && (
                                    <Link
                                        href={`?page=${interviews.current_page - 1}`}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {interviews.current_page < interviews.last_page && (
                                    <Link
                                        href={`?page=${interviews.current_page + 1}`}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {(interviews.current_page - 1) * interviews.per_page + 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(interviews.current_page * interviews.per_page, interviews.total)}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">{interviews.total}</span>{' '}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {Array.from({ length: interviews.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={`?page=${page}`}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === interviews.current_page
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
