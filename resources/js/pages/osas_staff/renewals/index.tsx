import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { RenewalApplication, RenewalDeadlines, RenewalStatistics } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    RefreshCw,
    Search,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('osas.dashboard') },
    { title: 'Renewal Applications', href: '#' },
];

interface PaginatedRenewals {
    data: RenewalApplication[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    renewals: PaginatedRenewals;
    statistics: RenewalStatistics;
    deadlines: RenewalDeadlines;
    filters: {
        status?: string;
        semester?: string;
        year?: string;
    };
}

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
    },
    under_review: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: Eye,
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
    },
};

export default function Index({ renewals, statistics, deadlines, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get(
            route('renewal.staff.index'),
            { status: status === 'all' ? undefined : status },
            { preserveState: true }
        );
    };

    const handleSearch = () => {
        router.get(
            route('renewal.staff.index'),
            { status: statusFilter === 'all' ? undefined : statusFilter, search: searchTerm },
            { preserveState: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Renewal Applications" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-2xl sm:text-3xl">Renewal Applications</CardTitle>
                                <CardDescription className="mt-2">
                                    Review and manage scholarship renewal applications
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => window.location.reload()}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh
                                </Button>
                                <Button asChild>
                                    <Link href={route('renewal.staff.statistics')}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Statistics
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                                    <Users className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-2xl font-bold">{statistics.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold">{statistics.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                    <Eye className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Under Review</p>
                                    <p className="text-2xl font-bold">{statistics.under_review}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold">{statistics.approved}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Rejected</p>
                                    <p className="text-2xl font-bold">{statistics.rejected}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Period Info */}
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="font-semibold text-blue-800 dark:text-blue-200">
                                Current Renewal Period: {deadlines.current_semester.semester}{' '}
                                {deadlines.current_semester.year}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                                Deadline: {new Date(deadlines.current_semester.deadline).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters and Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Applications List</CardTitle>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={handleFilterChange}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Filter status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {renewals.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    No renewal applications found
                                </h3>
                                <p className="mt-2 text-gray-500">
                                    There are no renewal applications matching your criteria.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Scholarship</TableHead>
                                                <TableHead>Period</TableHead>
                                                <TableHead>GWA</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {renewals.data.map((renewal) => {
                                                const status =
                                                    statusConfig[renewal.status] || statusConfig.pending;
                                                const StatusIcon = status.icon;

                                                return (
                                                    <TableRow key={renewal.id}>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {renewal.student?.first_name}{' '}
                                                                    {renewal.student?.last_name}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {renewal.student?.student_profile?.student_id}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-medium">
                                                                {renewal.original_application?.scholarship?.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {renewal.original_application?.scholarship?.type
                                                                    ?.replace('_', ' ')
                                                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            {renewal.renewal_semester} {renewal.renewal_year}
                                                        </TableCell>
                                                        <TableCell>
                                                            {renewal.current_gwa?.toFixed(2) ?? 'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {renewal.submitted_at
                                                                ? new Date(
                                                                      renewal.submitted_at
                                                                  ).toLocaleDateString()
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={status.color}>
                                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                                {status.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link
                                                                    href={route(
                                                                        'renewal.staff.review',
                                                                        renewal.id
                                                                    )}
                                                                >
                                                                    <Eye className="mr-1 h-4 w-4" />
                                                                    Review
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {renewals.last_page > 1 && (
                                    <div className="mt-4 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (renewals.current_page > 1) {
                                                                router.get(
                                                                    route('renewal.staff.index'),
                                                                    {
                                                                        page: renewals.current_page - 1,
                                                                        status:
                                                                            statusFilter === 'all'
                                                                                ? undefined
                                                                                : statusFilter,
                                                                    },
                                                                    { preserveState: true }
                                                                );
                                                            }
                                                        }}
                                                        className={
                                                            renewals.current_page === 1
                                                                ? 'pointer-events-none opacity-50'
                                                                : ''
                                                        }
                                                    />
                                                </PaginationItem>
                                                {Array.from(
                                                    { length: Math.min(5, renewals.last_page) },
                                                    (_, i) => {
                                                        const page = i + 1;
                                                        return (
                                                            <PaginationItem key={page}>
                                                                <PaginationLink
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        router.get(
                                                                            route('renewal.staff.index'),
                                                                            {
                                                                                page,
                                                                                status:
                                                                                    statusFilter === 'all'
                                                                                        ? undefined
                                                                                        : statusFilter,
                                                                            },
                                                                            { preserveState: true }
                                                                        );
                                                                    }}
                                                                    isActive={renewals.current_page === page}
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    }
                                                )}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (
                                                                renewals.current_page < renewals.last_page
                                                            ) {
                                                                router.get(
                                                                    route('renewal.staff.index'),
                                                                    {
                                                                        page: renewals.current_page + 1,
                                                                        status:
                                                                            statusFilter === 'all'
                                                                                ? undefined
                                                                                : statusFilter,
                                                                    },
                                                                    { preserveState: true }
                                                                );
                                                            }
                                                        }}
                                                        className={
                                                            renewals.current_page === renewals.last_page
                                                                ? 'pointer-events-none opacity-50'
                                                                : ''
                                                        }
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
