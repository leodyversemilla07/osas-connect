import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-scholarship-management/data-table';
import { createAdminColumns } from '@/components/admin-scholarship-management/columns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScholarshipDetailsDialog } from '@/components/admin-scholarship-management/scholarship-details-dialog';
import { useState } from 'react';
import { 
    Award, 
    GraduationCap, 
    Users, 
    DollarSign, 
    Filter 
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
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleStatusChange = (value: string) => {
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
    
    return (        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Scholarships Overview</title>
                <meta name="description" content="Administrative overview of all scholarships in the system" />
            </Head>            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4 lg:pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl">
                                Scholarships Overview
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg">
                                Administrative view of all scholarships and their performance metrics
                            </p>
                        </div>
                    </div>
                </div>                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8">
                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Scholarships
                                </CardTitle>
                                <Award className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                                {statistics.total_scholarships}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 lg:text-sm">
                                All scholarships in system
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Active Scholarships
                                </CardTitle>
                                <GraduationCap className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-green-600 dark:text-green-500 lg:text-3xl">
                                {statistics.active_scholarships}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 lg:text-sm">
                                Currently accepting applications
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Applications
                                </CardTitle>
                                <Users className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-blue-600 dark:text-blue-500 lg:text-3xl">
                                {statistics.total_applications}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 lg:text-sm">
                                All submitted applications
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Approved Applications
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-green-600 dark:text-green-500 lg:text-3xl">
                                {statistics.approved_applications}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 lg:text-sm">
                                Currently receiving benefits
                            </p>
                        </CardContent>
                    </Card>
                </div>{/* Filters and Search */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Scholarship Management
                        </h3>
                    </div>
                    
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search scholarships..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="text-base border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                            </div>
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-full sm:w-48 h-10 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={typeFilter || "all"} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="w-full sm:w-48 h-10 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500">
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All types</SelectItem>
                                        <SelectItem value="Academic">Academic</SelectItem>
                                        <SelectItem value="Student Assistantship">Student Assistantship</SelectItem>
                                        <SelectItem value="Performing Arts">Performing Arts</SelectItem>
                                        <SelectItem value="Economic Assistance">Economic Assistance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                            >
                                <Filter className="mr-2 h-4 w-4 inline" />
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
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
