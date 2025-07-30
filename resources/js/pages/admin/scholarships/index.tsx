import * as React from "react";
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import {
    Award,
    Calendar,
    Eye,
    Plus,
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

export default function AdminScholarshipsIndex({ scholarships, filters }: Props) {
    const [searchQuery, setSearchQuery] = React.useState(filters.search || '');
    const [statusFilter, setStatusFilter] = React.useState(filters.status || 'all');
    const [typeFilter, setTypeFilter] = React.useState(filters.type || 'all');

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

    return (<AppLayout breadcrumbs={breadcrumbs}>
        <Head>
            <title>Scholarships Overview</title>
            <meta name="description" content="Administrative overview of all scholarships in the system" />
        </Head>
        <div className="flex h-full flex-1 flex-col space-y-6 p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <span className="text-3xl font-bold">Scholarship Management</span>
                    <div className="text-base text-muted-foreground mt-2">
                        Comprehensive oversight and administration of all scholarship programs
                    </div>
                </div>
                <Button
                    variant="default"
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Scholarship
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="space-y-4">
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

            {/* Data Table (Card removed) */}
            <div className="overflow-x-auto rounded-lg bg-card border">
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
                                            onClick={() => router.get(route('admin.scholarships.show', { scholarship: scholarship.id }))}
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
        </div>
    </AppLayout >
    );
}
