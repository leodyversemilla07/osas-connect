import * as React from "react";
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScholarshipDetailsDialog } from '@/components/admin-scholarship-management/scholarship-details-dialog';
import { Pagination } from '@/components/pagination';

import {
    Award,
    GraduationCap,
    Users,
    DollarSign,
    Filter,
    Search,
    Calendar,
    TrendingUp,
    Eye,
    Plus
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Scholarships',
        href: route('admin.scholarships'),
    },
];

export interface Scholarship {
    id: number;
    name: string;
    description: string;
    type: string;
    status: 'open' | 'closed' | 'upcoming';
    amount: number;
    deadline: string | null;
    slots: number;
    slots_available: number;
    beneficiaries: number;
    total_applications: number;
    approved_applications: number;
    remaining_slots: number;
    criteria: string[] | null;
    required_documents: string[] | null;
    funding_source: string;
    eligibility_criteria: string[] | null;
    renewal_criteria: string[] | null;
    admin_remarks: string | null;
    created_at: string;
    updated_at: string;
    applications: Application[];
}

export interface Application {
    id: number;
    student_name: string;
    student_id: string;
    status: string;
    applied_at: string | null;
    approved_at: string | null;
    amount_received: number;
}


interface Statistics {
    total_scholarships: number;
    active_scholarships: number;
    total_applications: number;
    approved_applications: number;
}

interface Filters {
    search: string;
    status: string;
    type: string;
}

interface Props {
    scholarships: {
        data: Scholarship[];
        links: {
            first?: string;
            last?: string;
            prev?: string;
            next?: string;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            per_page: number;
            to: number;
            total: number;
        };
    };
    filters: Filters;
    statistics: Statistics;
}

export default function AdminScholarshipsIndex({ scholarships, filters, statistics }: Props) {
    const [searchQuery, setSearchQuery] = React.useState(filters.search || '');
    const [statusFilter, setStatusFilter] = React.useState(filters.status || 'all');
    const [typeFilter, setTypeFilter] = React.useState(filters.type || 'all');
    const [selectedScholarship, setSelectedScholarship] = React.useState<Scholarship | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Unified filter function
    const applyFilters = (searchValue?: string, statusValue?: string, typeValue?: string) => {
        router.get(route('admin.scholarships'), {
            search: searchValue ?? searchQuery,
            status: (statusValue ?? statusFilter) === 'all' ? '' : (statusValue ?? statusFilter),
            type: (typeValue ?? typeFilter) === 'all' ? '' : (typeValue ?? typeFilter),
        }, {
            preserveState: true,
            replace: true
        });
    }; const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        applyFilters(undefined, value);
    };

    const handleTypeChange = (value: string) => {
        setTypeFilter(value);
        applyFilters(undefined, undefined, value);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setTypeFilter('all');
        router.get(route('admin.scholarships'), {}, {
            preserveState: true,
            replace: true
        });
    };

    // Admin-specific action handlers
    const handleViewScholarship = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedScholarship(null);
    };

    // Minimal table object for Pagination
    const paginationTable = {
        getPageCount: () => scholarships.meta?.last_page || 1,
        getState: () => ({
            pagination: {
                pageIndex: (scholarships.meta?.current_page || 1) - 1,
                pageSize: scholarships.meta?.per_page || 10,
            },
        }),
        setPageIndex(page: number) {
            router.get(route('admin.scholarships'), {
                ...filters,
                page: page + 1,
            }, {
                preserveState: true,
                replace: true,
            });
        },
        setPageSize(size: number) {
            router.get(route('admin.scholarships'), {
                ...filters,
                per_page: size,
            }, {
                preserveState: true,
                replace: true,
            });
        },
        getCanPreviousPage() {
            return (scholarships.meta?.current_page || 1) > 1;
        },
        getCanNextPage() {
            return (scholarships.meta?.current_page || 1) < (scholarships.meta?.last_page || 1);
        },
        previousPage() {
            if ((scholarships.meta?.current_page || 1) > 1) {
                router.get(route('admin.scholarships'), {
                    ...filters,
                    page: (scholarships.meta?.current_page || 1) - 1,
                }, {
                    preserveState: true,
                    replace: true,
                });
            }
        },
        nextPage() {
            if ((scholarships.meta?.current_page || 1) < (scholarships.meta?.last_page || 1)) {
                router.get(route('admin.scholarships'), {
                    ...filters,
                    page: (scholarships.meta?.current_page || 1) + 1,
                }, {
                    preserveState: true,
                    replace: true,
                });
            }
        },
    } as any;

    return (<AppLayout breadcrumbs={breadcrumbs}>
        <Head>
            <title>Scholarships Overview</title>
            <meta name="description" content="Administrative overview of all scholarships in the system" />
        </Head>            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">                {/* Header Section */}
            <div className="border-b border-border pb-6 lg:pb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                            Scholarship Management
                        </h1>
                        <p className="text-base text-muted-foreground lg:text-lg">
                            Comprehensive oversight and administration of all scholarship programs
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Analytics
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Scholarship
                        </Button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
                <Card className="border-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Total Scholarships
                        </CardTitle>
                        <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {statistics?.total_scholarships || 0}
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Programs available
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                            Active Programs
                        </CardTitle>
                        <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                            <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {statistics?.active_scholarships || 0}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Currently accepting applications
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Total Applications
                        </CardTitle>
                        <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-full">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {statistics?.total_applications || 0}
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            Students applied
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            Approved Students
                        </CardTitle>
                        <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-full">
                            <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                            {statistics?.approved_applications || 0}
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            Receiving financial aid
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Filter className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Filter & Search
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Find and manage scholarship programs
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, type, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10"
                                />
                            </div>
                            <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full sm:w-[180px] h-10">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter || "all"} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-full sm:w-[220px] h-10">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="academic_full">Academic Scholarship (Full)</SelectItem>
                                    <SelectItem value="academic_partial">Academic Scholarship (Partial)</SelectItem>
                                    <SelectItem value="student_assistantship">Student Assistantship</SelectItem>
                                    <SelectItem value="performing_arts_full">Performing Arts (Full)</SelectItem>
                                    <SelectItem value="performing_arts_partial">Performing Arts (Partial)</SelectItem>
                                    <SelectItem value="economic_assistance">Economic Assistance</SelectItem>
                                    <SelectItem value="others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="h-10"
                        >
                            Clear filters
                        </Button>
                    </div>
                </div>
            </Card>
            {/* Data Table */}
            <Card>
                <CardHeader className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">Scholarship Programs</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {scholarships.meta?.total || 0} total programs found
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Program Name</TableHead>
                                    <TableHead className="font-semibold">Type</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Amount</TableHead>
                                    <TableHead className="font-semibold">Deadline</TableHead>
                                    <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scholarships.data.length > 0 ? (
                                    scholarships.data.map((scholarship) => (
                                        <TableRow key={scholarship.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-foreground">{scholarship.name}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                                        {scholarship.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">
                                                    {scholarship.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={
                                                        scholarship.status === 'open' ? 'default' :
                                                        scholarship.status === 'closed' ? 'destructive' : 'secondary'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {scholarship.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                ₱{scholarship.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {scholarship.deadline ? (
                                                        <>
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                {new Date(scholarship.deadline).toLocaleDateString()}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">No deadline</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleViewScholarship(scholarship)}
                                                    className="gap-2 h-8"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Award className="h-8 w-8 text-muted-foreground" />
                                                <div className="text-sm font-medium">No scholarships found</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Try adjusting your search or filter criteria
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="px-6 py-4 border-t">
                        <Pagination
                            table={paginationTable}
                            filteredDataLength={scholarships.meta?.total || 0}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Scholarship Details Dialog */}
        {selectedScholarship && (
            <ScholarshipDetailsDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                scholarship={selectedScholarship}
            />
        )}
    </AppLayout>
    );
}
