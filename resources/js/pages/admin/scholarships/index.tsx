import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-scholarship-management/data-table';
import { createAdminColumns } from '@/components/admin-scholarship-management/columns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScholarshipDetailsDialog } from '@/components/admin-scholarship-management/scholarship-details-dialog';
import { useState } from 'react';
import {
    Award,
    GraduationCap,
    Users,
    DollarSign,
    Filter,
    Search
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

interface Scholarship {
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

interface Application {
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
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    };    // Admin-specific action handlers
    const handleViewScholarship = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedScholarship(null);
    };    // Convert admin scholarship to columns scholarship format
    const convertScholarshipForColumns = (scholarship: Scholarship) => ({
        id: scholarship.id,
        name: scholarship.name,
        description: scholarship.description,
        type: scholarship.type,
        amount: scholarship.amount,
        status: scholarship.status,
        deadline: scholarship.deadline,
        slots: scholarship.slots,
        slots_available: scholarship.slots_available,
        beneficiaries: scholarship.beneficiaries,
        total_applications: scholarship.total_applications,
        approved_applications: scholarship.approved_applications,
        remaining_slots: scholarship.remaining_slots,
        criteria: scholarship.criteria,
        required_documents: scholarship.required_documents,
        funding_source: scholarship.funding_source,
        eligibility_criteria: scholarship.eligibility_criteria,
        renewal_criteria: scholarship.renewal_criteria,
        admin_remarks: scholarship.admin_remarks,
        created_at: scholarship.created_at,
        updated_at: scholarship.updated_at,
        applications: scholarship.applications,
    });

    return (<AppLayout breadcrumbs={breadcrumbs}>
        <Head>
            <title>Scholarships Overview</title>
            <meta name="description" content="Administrative overview of all scholarships in the system" />
        </Head>            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">                {/* Header Section */}
            <div className="border-b border-border pb-4 lg:pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
                            Scholarships Overview
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base lg:text-lg">
                            Administrative view of all scholarships and their performance metrics
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8">
                <Card className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 lg:pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Total Scholarships
                            </CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
                        </div>
                    </CardHeader>                    <CardContent className="pt-0">
                        <div className="text-2xl font-semibold text-foreground lg:text-3xl">
                            {statistics?.total_scholarships || 0}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                            All scholarships in system
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 lg:pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Active Scholarships
                            </CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
                        </div>
                    </CardHeader>                    <CardContent className="pt-0">
                        <div className="text-2xl font-semibold text-chart-2 lg:text-3xl">
                            {statistics?.active_scholarships || 0}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                            Currently accepting applications
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 lg:pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Total Applications
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
                        </div>
                    </CardHeader>                    <CardContent className="pt-0">
                        <div className="text-2xl font-semibold text-chart-1 lg:text-3xl">
                            {statistics?.total_applications || 0}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                            All submitted applications
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 lg:pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Approved Applications
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
                        </div>
                    </CardHeader>                    
                    <CardContent className="pt-0">
                        <div className="text-2xl font-semibold text-chart-2 lg:text-3xl">
                            {statistics?.approved_applications || 0}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                            Currently receiving benefits
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground">
                        Scholarship Management
                    </h3>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search scholarships..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 max-w-sm"
                            />
                        </div>
                        <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                            </SelectContent>
                        </Select>                            <Select value={typeFilter || "all"} onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="All types" />
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
                    </div>                        <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </Button>
                    </div>
                </div>
            </div>
            {/* Data Table */}
            <DataTable
                columns={createAdminColumns({
                    onView: (scholarship) => handleViewScholarship(scholarships.data.find(s => s.id === scholarship.id)!)
                })}
                data={scholarships.data.map(convertScholarshipForColumns)}
            />

            {/* Scholarship Details Dialog */}
            <ScholarshipDetailsDialog
                scholarship={selectedScholarship}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
            />
        </div>
    </AppLayout>
    );
}
