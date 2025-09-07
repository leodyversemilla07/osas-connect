import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Calendar,
    Clock,
    User,
    MapPin,
    Plus,
    Search,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    UserX
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Interviews',
        href: route('osas.interviews.index'),
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
                return <UserX className="h-4 w-4 text-muted-foreground" />;
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
            interview.application.student.student_profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.application.student.student_profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.application.student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.application.scholarship.name.toLowerCase().includes(searchTerm.toLowerCase());        const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Interview Management" />

            <div className="flex h-full flex-1 flex-col space-y-8 p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Interview Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage student interviews and schedules
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={route('osas.interviews.dashboard')}>
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('osas.interviews.create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule Interview
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search students or scholarships..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status Filter</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="no_show">No Show</SelectItem>
                                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Interviews List */}
                <div className="space-y-4">
                    {filteredInterviews.length === 0 ? (
                        <Card>
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto mb-4">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                                </div>
                                <CardTitle className="text-lg">No interviews found</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground mb-6">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'No interviews match your current filters.'
                                        : 'Get started by scheduling your first interview.'
                                    }
                                </p>
                                <Button asChild>
                                    <Link href={route('osas.interviews.create')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule Interview
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredInterviews.map((interview) => (
                            <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {getStatusIcon(interview.status)}
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {interview.application.student.student_profile.first_name} {interview.application.student.student_profile.last_name}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {interview.application.student.student_id} • {interview.application.student.student_profile.course}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusBadge(interview.status)}
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('osas.interviews.show', interview.id)}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                                {interview.status === 'scheduled' && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('osas.interviews.edit', interview.id)}>
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {formatDate(interview.schedule)}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {interview.location || 'Location TBD'}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <User className="h-4 w-4 mr-2" />
                                            {interview.interviewer.name}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Badge variant="outline">
                                                {interview.application.scholarship.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    {interview.notes && (
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Notes:</strong> {interview.notes}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {interviews.last_page > 1 && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {interviews.current_page > 1 && (
                                        <Button variant="outline" asChild>
                                            <Link href={`?page=${interviews.current_page - 1}`}>
                                                Previous
                                            </Link>
                                        </Button>
                                    )}
                                    {interviews.current_page < interviews.last_page && (
                                        <Button variant="outline" asChild>
                                            <Link href={`?page=${interviews.current_page + 1}`}>
                                                Next
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
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
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: interviews.last_page }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={page === interviews.current_page ? "default" : "outline"}
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`?page=${page}`}>
                                                    {page}
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
