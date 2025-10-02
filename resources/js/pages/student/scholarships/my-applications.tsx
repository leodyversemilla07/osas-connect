import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, DollarSign, Eye, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface Application {
    id: number;
    scholarship_name: string;
    scholarship_type: string;
    status: string;
    submitted_at: string;
    progress: number;
    amount: number | null;
    deadline: string | null;
}

interface MyApplicationsProps {
    applications: Application[];
    filters: {
        status?: string;
        search?: string;
    };
    statistics: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
}

export default function MyApplications() {
    const { applications, filters, statistics } = usePage<MyApplicationsProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'submitted':
            case 'under_verification':
            case 'verified':
            case 'under_evaluation':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'incomplete':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const getProgressColor = (progress: number) => {
        if (progress < 25) return 'bg-red-500';
        if (progress < 50) return 'bg-yellow-500';
        if (progress < 75) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (statusFilter) params.set('status', statusFilter);

        window.location.href = route('student.scholarships.my-applications') + '?' + params.toString();
    };

    const handleFilterReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        window.location.href = route('student.scholarships.my-applications');
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Scholarship Applications" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Scholarship Applications</h1>
                        <p className="mt-2 text-gray-600">Track the status of your scholarship applications and view detailed progress</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.total}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{statistics.pending}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{statistics.rejected}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Filter className="mr-2 h-5 w-5" />
                                Filter Applications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by scholarship name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Statuses</SelectItem>
                                            <SelectItem value="submitted">Submitted</SelectItem>
                                            <SelectItem value="under_verification">Under Verification</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="incomplete">Incomplete</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSearch} className="flex items-center">
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Button>
                                    <Button variant="outline" onClick={handleFilterReset}>
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Applications List */}
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-lg text-gray-500">No scholarship applications found.</p>
                                    <p className="mt-2 text-sm text-gray-400">You haven't submitted any scholarship applications yet.</p>
                                    <Link
                                        href={route('student.scholarships.index')}
                                        className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700"
                                    >
                                        Browse Scholarships
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            applications.map((application) => (
                                <Card key={application.id} className="transition-shadow hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center space-x-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">{application.scholarship_name}</h3>
                                                    <Badge className={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Applied on: {new Date(application.submitted_at).toLocaleDateString()}
                                                    </div>

                                                    {application.amount && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <DollarSign className="mr-2 h-4 w-4" />
                                                            Monthly Stipend: ₱{application.amount.toLocaleString()}
                                                        </div>
                                                    )}

                                                    {application.deadline && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="mr-2 h-4 w-4" />
                                                            Deadline: {new Date(application.deadline).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                                                        <span>Application Progress</span>
                                                        <span>{application.progress}%</span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(application.progress)}`}
                                                            style={{ width: `${application.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <Link
                                                    href={route('student.applications.show', application.id)}
                                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:bg-blue-700"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 flex justify-center">
                        <Link
                            href={route('student.scholarships.index')}
                            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-sm font-semibold tracking-widest text-white uppercase hover:bg-green-700"
                        >
                            Apply for More Scholarships
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
