import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpDown,
    Calendar,
    CheckCircle,
    Download,
    Eye,
    FileText,
    GraduationCap,
    Grid,
    HelpCircle,
    Keyboard,
    List,
    MoreVertical,
    RefreshCw,
    Search,
    ShieldCheck,
    Timer,
    User,
    X,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Application Management',
        href: route('osas.applications'),
    },
];

// Types
interface Application {
    id: number;
    student: {
        id: number;
        name: string;
        student_id: string;
        email: string;
        course: string;
        year_level: string;
    };
    scholarship: {
        id: number;
        name: string;
        type: string;
        amount: string;
    };
    status: 'draft' | 'submitted' | 'under_verification' | 'incomplete' | 'verified' | 'under_evaluation' | 'approved' | 'rejected' | 'end';
    submitted_at: string;
    updated_at: string;
    priority: 'high' | 'medium' | 'low';
    documents_count: number;
    verified_documents_count: number;
    interview_scheduled: boolean;
    deadline: string;
    reviewer?: {
        name: string;
        id: number;
    };
}

interface ApplicationsPageProps {
    applications: Application[];
    statistics: {
        total: number;
        submitted: number;
        under_verification: number;
        verified: number;
        under_evaluation: number;
        approved: number;
        rejected: number;
        incomplete: number;
        this_month_count: number;
        last_month_count: number;
        completion_rate: number;
    };
    filters: {
        search?: string;
        status?: string;
        scholarship_type?: string;
        priority?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
}

interface ApplicationData {
    id: number;
    status: string;
    priority: string;
    submitted_at?: string;
    student: {
        name: string;
        student_id: string;
        email: string;
        course: string;
        year_level: string;
    };
    scholarship: {
        name: string;
        type: string;
        amount?: string;
    };
}

// Updated comprehensive status configuration (removed extra statuses)
const statusConfig = {
    // Backend status values (matching ScholarshipApplication model)
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: FileText,
    },
    submitted: {
        label: 'Submitted',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        icon: CheckCircle,
    },
    under_verification: {
        label: 'Under Verification',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        icon: Eye,
    },
    verified: {
        label: 'Verified',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: ShieldCheck,
    },
    under_evaluation: {
        label: 'Under Evaluation',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        icon: GraduationCap,
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        icon: XCircle,
    },
    incomplete: {
        label: 'Incomplete',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        icon: AlertTriangle,
    },
    end: {
        label: 'Completed',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: CheckCircle,
    },
} as const;

// Scholarship type mappings for better display
const SCHOLARSHIP_TYPES = {
    academic_full: 'Academic (Full)',
    academic_partial: 'Academic (Partial)',
    student_assistantship: 'Student Assistantship',
    performing_arts_full: 'Performing Arts (Full)',
    performing_arts_partial: 'Performing Arts (Partial)',
    economic_assistance: 'Economic Assistance',
    others: 'Custom Type',
} as const;

const getScholarshipTypeDisplay = (type: string): string => {
    return SCHOLARSHIP_TYPES[type as keyof typeof SCHOLARSHIP_TYPES] || type;
};

const getScholarshipTypeColor = (type: string): string => {
    const colors = {
        academic_full: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        academic_partial: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        student_assistantship: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        performing_arts_full: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        performing_arts_partial: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
        economic_assistance: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        others: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

// Format currency amount for display
const formatCurrency = (amount: string): string => {
    // Remove any existing currency symbols and clean the string
    const cleanAmount = amount.replace(/[₱$,]/g, '');
    const numericAmount = parseFloat(cleanAmount);

    // Return formatted currency if it's a valid number
    if (!isNaN(numericAmount)) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numericAmount);
    }

    // Return original amount if it's not a valid number (e.g., "Full Tuition", "Variable")
    return amount;
};

// Safe status component with fallback
const StatusCell = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig];

    // Fallback configuration for unknown statuses
    const fallbackConfig = {
        label: status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : 'Unknown',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: HelpCircle,
    };

    const finalConfig = config || fallbackConfig;
    const StatusIcon = finalConfig.icon;

    return (
        <Badge className={cn(finalConfig.color)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {finalConfig.label}
        </Badge>
    );
};

// Mobile-friendly Card Component
const ApplicationCard = ({
    application,
    onQuickAction,
}: {
    application: Application;
    onQuickAction: (action: 'approve' | 'reject' | 'schedule', app: Application) => void;
}) => {
    const isOverdue =
        application.deadline && new Date(application.deadline) < new Date() && ['submitted', 'under_verification'].includes(application.status);

    return (
        <Card
            className={cn(
                'border-l-4 p-4 transition-all duration-200 hover:shadow-md',
                application.priority === 'high'
                    ? 'border-l-red-500'
                    : application.priority === 'medium'
                      ? 'border-l-yellow-500'
                      : 'border-l-green-500',
            )}
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <span className="font-semibold">{application.student.name}</span>
                            <Badge variant="outline" className="text-xs">
                                #{application.id}
                            </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {application.student.student_id} • {application.student.course} {application.student.year_level}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('osas.applications.review', application.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Review Application
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={route('osas.students.details', application.student.id)}>
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Scholarship Info */}
                <div className="space-y-2">
                    <div className="text-sm font-medium">{application.scholarship.name}</div>
                    <div className="flex items-center gap-2">
                        <Badge className={cn(getScholarshipTypeColor(application.scholarship.type))}>
                            {getScholarshipTypeDisplay(application.scholarship.type)}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">{formatCurrency(application.scholarship.amount)}</span>
                    </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <StatusCell status={application.status} />
                        <Badge
                            variant={application.priority === 'high' ? 'destructive' : application.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                        >
                            {application.priority}
                        </Badge>
                    </div>
                    {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                            <Timer className="mr-1 h-3 w-3" />
                            Overdue
                        </Badge>
                    )}
                </div>

                {/* Documents Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Documents</span>
                        <span>
                            {application.verified_documents_count}/{application.documents_count} verified
                        </span>
                    </div>
                    <Progress
                        value={application.documents_count > 0 ? (application.verified_documents_count / application.documents_count) * 100 : 0}
                        className="h-2"
                    />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                    onClick={() => onQuickAction('approve', application)}
                                    disabled={!['verified', 'under_evaluation'].includes(application.status)}
                                >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Approve
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Quick approve this application</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => onQuickAction('reject', application)}
                                    disabled={['approved', 'rejected', 'end'].includes(application.status)}
                                >
                                    <XCircle className="mr-1 h-4 w-4" />
                                    Reject
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Quick reject this application</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                                    onClick={() => onQuickAction('schedule', application)}
                                    disabled={!['verified', 'under_evaluation'].includes(application.status)}
                                >
                                    <Calendar className="mr-1 h-4 w-4" />
                                    Interview
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Schedule interview</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Timestamp */}
                <div className="text-muted-foreground border-t pt-2 text-xs">
                    Submitted {new Date(application.submitted_at).toLocaleDateString()} • Updated{' '}
                    {new Date(application.updated_at).toLocaleDateString()}
                </div>
            </div>
        </Card>
    );
};

const columns: ColumnDef<Application>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 px-2 lg:px-3">
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">#{row.getValue('id')}</div>,
    },
    {
        id: 'student',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 px-2 lg:px-3">
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const student = row.original.student;
            return (
                <div className="flex items-center space-x-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-muted-foreground text-sm">
                            {student.student_id} • {student.course} {student.year_level}
                        </div>
                    </div>
                </div>
            );
        },
        accessorFn: (row) => {
            // Create a searchable string for the student column
            const student = row.student;
            return `${student.name} ${student.student_id} ${student.email} ${student.course} ${student.year_level}`;
        },
    },
    {
        id: 'scholarship',
        header: 'Scholarship',
        cell: ({ row }) => {
            const scholarship = row.original.scholarship;
            return (
                <div>
                    <div className="font-medium">{scholarship.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                        <Badge className={cn(getScholarshipTypeColor(scholarship.type))}>{getScholarshipTypeDisplay(scholarship.type)}</Badge>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(scholarship.amount)}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: 'status',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 px-2 lg:px-3">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.status;
            return <StatusCell status={status} />;
        },
        accessorFn: (row) => row.status,
    },
    {
        id: 'priority',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 px-2 lg:px-3">
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const priority = row.original.priority;
            return <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'secondary'}>{priority}</Badge>;
        },
        accessorFn: (row) => row.priority,
    },
    {
        id: 'documents',
        header: 'Documents',
        cell: ({ row }) => {
            const documentsCount = row.original.documents_count;
            const verifiedCount = row.original.verified_documents_count;
            const percentage = documentsCount > 0 ? (verifiedCount / documentsCount) * 100 : 0;

            return (
                <div className="space-y-1">
                    <div className="text-sm">
                        {verifiedCount}/{documentsCount} verified
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-1.5 rounded-full bg-blue-600 transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                </div>
            );
        },
    },
    {
        id: 'submitted_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 px-2 lg:px-3">
                    Submitted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.submitted_at);
            return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
        accessorFn: (row) => row.submitted_at,
    },
    {
        id: 'deadline',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 px-2 lg:px-3">
                    Deadline
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const deadlineValue = row.original.deadline;

            // Handle null/undefined deadline
            if (!deadlineValue) {
                return <div className="text-muted-foreground text-sm">No deadline</div>;
            }

            const deadline = new Date(deadlineValue);
            const isOverdue = deadline < new Date() && ['submitted', 'under_verification'].includes(row.original.status);

            return (
                <div className={cn('text-sm', isOverdue ? 'font-medium text-red-600' : '')}>
                    {deadline.toLocaleDateString()}
                    {isOverdue && <div className="text-xs">(Overdue)</div>}
                </div>
            );
        },
        accessorFn: (row) => row.deadline,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const application = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={route('osas.applications.review', application.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Review Application
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('osas.applications.interview', application.id)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Interview
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('osas.students.details', application.student.id)}>
                                <User className="mr-2 h-4 w-4" />
                                View Student Profile
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

function DataTable<TData, TValue>({ columns, data, searchPlaceholder = 'Search applications...' }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
    const [priorityFilter, setPriorityFilter] = React.useState<string>('all');
    const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table');
    const [quickActionDialog, setQuickActionDialog] = React.useState<{
        isOpen: boolean;
        application: Application | null;
        action: 'approve' | 'reject' | 'schedule' | null;
    }>({
        isOpen: false,
        application: null,
        action: null,
    });

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: true,
        enableGlobalFilter: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
        globalFilterFn: (row, columnId, value) => {
            // Custom global filter function to search across all relevant fields
            const search = value.toLowerCase();
            const rowData = row.original as ApplicationData;

            // Safely access nested properties
            const student = rowData.student || {};
            const scholarship = rowData.scholarship || {};
            const status = rowData.status || '';
            const priority = rowData.priority || '';

            return (
                student?.name?.toLowerCase().includes(search) ||
                student?.student_id?.toLowerCase().includes(search) ||
                student?.email?.toLowerCase().includes(search) ||
                student?.course?.toLowerCase().includes(search) ||
                student?.year_level?.toLowerCase().includes(search) ||
                scholarship?.name?.toLowerCase().includes(search) ||
                scholarship?.type?.toLowerCase().includes(search) ||
                status?.toLowerCase().includes(search) ||
                priority?.toLowerCase().includes(search) ||
                String(rowData.id || '').includes(search)
            );
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    // Apply additional filters
    React.useEffect(() => {
        const filters: ColumnFiltersState = [];

        if (statusFilter !== 'all') {
            filters.push({ id: 'status', value: statusFilter });
        }

        if (priorityFilter !== 'all') {
            filters.push({ id: 'priority', value: priorityFilter });
        }

        setColumnFilters(filters);
    }, [statusFilter, priorityFilter]);

    const selectedRows = table.getFilteredSelectedRowModel().rows.length;
    const totalRows = table.getFilteredRowModel().rows.length;

    // Get unique status and priority values for filters
    const uniqueStatuses = React.useMemo(() => {
        const statuses = new Set(data.map((row) => (row as ApplicationData).status));
        return Array.from(statuses);
    }, [data]);

    const uniquePriorities = React.useMemo(() => {
        const priorities = new Set(data.map((row) => (row as ApplicationData).priority));
        return Array.from(priorities);
    }, [data]);

    const resetFilters = React.useCallback(() => {
        setGlobalFilter('');
        setStatusFilter('all');
        setPriorityFilter('all');
        table.resetColumnFilters();
    }, [table]);

    const hasActiveFilters = globalFilter || statusFilter !== 'all' || priorityFilter !== 'all';

    // Quick action handler
    const handleQuickAction = (action: 'approve' | 'reject' | 'schedule', application: Application) => {
        setQuickActionDialog({
            isOpen: true,
            application,
            action,
        });
    };

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if no input is focused and no modals are open
            if (document.activeElement?.tagName === 'INPUT' || quickActionDialog.isOpen) return;

            switch (e.key) {
                case '/': {
                    e.preventDefault();
                    // Focus search input
                    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                    searchInput?.focus();
                    break;
                }
                case 'r': {
                    if (e.metaKey || e.ctrlKey) return; // Don't interfere with browser refresh
                    e.preventDefault();
                    resetFilters();
                    break;
                }
                case 't': {
                    e.preventDefault();
                    setViewMode('table');
                    break;
                }
                case 'c': {
                    e.preventDefault();
                    setViewMode('cards');
                    break;
                }
                case 'Escape': {
                    e.preventDefault();
                    setGlobalFilter('');
                    break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [quickActionDialog.isOpen, resetFilters, setViewMode, setGlobalFilter]);

    return (
        <div className="space-y-4">
            {/* Enhanced Search and Filters */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                        {/* Global Search with enhanced styling */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="text-muted-foreground h-4 w-4" />
                            </div>
                            <Input
                                placeholder={searchPlaceholder}
                                value={globalFilter ?? ''}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="focus:border-primary h-9 w-full border-2 pr-4 pl-10 transition-colors sm:w-[300px]"
                            />
                            {globalFilter && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute inset-y-0 right-0 h-full px-3"
                                    onClick={() => setGlobalFilter('')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-9 w-full border-2 sm:w-[180px]">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                {uniqueStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Priority Filter */}
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="h-9 w-full border-2 sm:w-[150px]">
                                <SelectValue placeholder="All priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All priorities</SelectItem>
                                {uniquePriorities.map((priority) => (
                                    <SelectItem key={priority} value={priority}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-foreground h-9 px-3">
                                Reset
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        {/* Keyboard shortcuts help */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Keyboard className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <kbd>/</kbd> Focus search
                                        </div>
                                        <div>
                                            <kbd>r</kbd> Reset filters
                                        </div>
                                        <div>
                                            <kbd>t</kbd> Table view
                                        </div>
                                        <div>
                                            <kbd>c</kbd> Cards view
                                        </div>
                                        <div>
                                            <kbd>Esc</kbd> Clear search
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
                            <Button
                                variant={viewMode === 'table' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('table')}
                                className="h-8 px-3"
                            >
                                <List className="mr-1 h-4 w-4" />
                                Table
                            </Button>
                            <Button
                                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('cards')}
                                className="h-8 px-3"
                            >
                                <Grid className="mr-1 h-4 w-4" />
                                Cards
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards View */}
            {viewMode === 'cards' ? (
                <div className="space-y-4">
                    {/* Results count */}
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} applications
                        </div>
                        {selectedRows > 0 && (
                            <Badge variant="secondary" className="rounded-sm px-2 font-normal">
                                {selectedRows} selected
                            </Badge>
                        )}
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {table.getRowModel().rows?.length ? (
                            table
                                .getRowModel()
                                .rows.map((row) => (
                                    <ApplicationCard key={row.id} application={row.original as Application} onQuickAction={handleQuickAction} />
                                ))
                        ) : (
                            <div className="col-span-full">
                                <Card className="p-8">
                                    <div className="space-y-2 text-center">
                                        <div className="text-muted-foreground text-sm">No applications found</div>
                                        <div className="text-muted-foreground text-xs">Try adjusting your search or filters</div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Shadcn Pagination for cards */}
                    <div className="bg-card/30 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">Cards per page</p>
                                <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                                    <SelectTrigger className="bg-background h-9 w-[70px]">
                                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[12, 24, 36, 48].map((size) => (
                                            <SelectItem key={size} value={`${size}`}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="text-muted-foreground text-sm">
                                Showing <span className="text-foreground font-medium">{table.getRowModel().rows.length}</span> of{' '}
                                <span className="text-foreground font-medium">{table.getFilteredRowModel().rows.length}</span> applications
                            </div>
                        </div>

                        {table.getPageCount() > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (table.getCanPreviousPage()) {
                                                    table.previousPage();
                                                }
                                            }}
                                            size="default"
                                            className={
                                                !table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'hover:bg-accent cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>

                                    {/* Smart page number display */}
                                    {(() => {
                                        const currentPage = table.getState().pagination.pageIndex + 1;
                                        const totalPages = table.getPageCount();
                                        const pages = [];

                                        if (totalPages <= 7) {
                                            // Show all pages if 7 or fewer
                                            for (let i = 1; i <= totalPages; i++) {
                                                pages.push(
                                                    <PaginationItem key={i}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                table.setPageIndex(i - 1);
                                                            }}
                                                            isActive={currentPage === i}
                                                            size="icon"
                                                            className="cursor-pointer"
                                                        >
                                                            {i}
                                                        </PaginationLink>
                                                    </PaginationItem>,
                                                );
                                            }
                                        } else {
                                            // Show condensed pagination for many pages
                                            // Always show first page
                                            pages.push(
                                                <PaginationItem key={1}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            table.setPageIndex(0);
                                                        }}
                                                        isActive={currentPage === 1}
                                                        size="icon"
                                                        className="cursor-pointer"
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>,
                                            );

                                            // Add ellipsis if needed
                                            if (currentPage > 3) {
                                                pages.push(
                                                    <PaginationItem key="ellipsis1">
                                                        <PaginationEllipsis />
                                                    </PaginationItem>,
                                                );
                                            }

                                            // Show current page and neighbors
                                            const start = Math.max(2, currentPage - 1);
                                            const end = Math.min(totalPages - 1, currentPage + 1);

                                            for (let i = start; i <= end; i++) {
                                                if (i !== 1 && i !== totalPages) {
                                                    pages.push(
                                                        <PaginationItem key={i}>
                                                            <PaginationLink
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    table.setPageIndex(i - 1);
                                                                }}
                                                                isActive={currentPage === i}
                                                                size="icon"
                                                                className="cursor-pointer"
                                                            >
                                                                {i}
                                                            </PaginationLink>
                                                        </PaginationItem>,
                                                    );
                                                }
                                            }

                                            // Add ellipsis if needed
                                            if (currentPage < totalPages - 2) {
                                                pages.push(
                                                    <PaginationItem key="ellipsis2">
                                                        <PaginationEllipsis />
                                                    </PaginationItem>,
                                                );
                                            }

                                            // Always show last page
                                            if (totalPages > 1) {
                                                pages.push(
                                                    <PaginationItem key={totalPages}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                table.setPageIndex(totalPages - 1);
                                                            }}
                                                            isActive={currentPage === totalPages}
                                                            size="icon"
                                                            className="cursor-pointer"
                                                        >
                                                            {totalPages}
                                                        </PaginationLink>
                                                    </PaginationItem>,
                                                );
                                            }
                                        }

                                        return pages;
                                    })()}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (table.getCanNextPage()) {
                                                    table.nextPage();
                                                }
                                            }}
                                            size="default"
                                            className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'hover:bg-accent cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            ) : (
                /* Table View */
                <div className="space-y-4">
                    {/* Selection Info and Bulk Actions */}
                    {selectedRows > 0 && (
                        <div className="flex items-center justify-between rounded-md border border-dashed p-4">
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                    {selectedRows}
                                </Badge>
                                <span className="text-muted-foreground text-sm">of {totalRows} row(s) selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const selectedData = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
                                        // Export functionality - convert to CSV
                                        const headers = [
                                            'Student Name',
                                            'Student ID',
                                            'Email',
                                            'Course',
                                            'Year Level',
                                            'Scholarship',
                                            'Type',
                                            'Amount',
                                            'Status',
                                            'Priority',
                                            'Submitted At',
                                        ];
                                        const csvContent = [
                                            headers.join(','),
                                            ...selectedData.map((app) => {
                                                const appData = app as ApplicationData;
                                                return [
                                                    `"${appData.student?.name || ''}"`,
                                                    `"${appData.student?.student_id || ''}"`,
                                                    `"${appData.student?.email || ''}"`,
                                                    `"${appData.student?.course || ''}"`,
                                                    `"${appData.student?.year_level || ''}"`,
                                                    `"${appData.scholarship?.name || ''}"`,
                                                    `"${appData.scholarship?.type || ''}"`,
                                                    `"${appData.scholarship?.amount || ''}"`,
                                                    `"${appData.status || ''}"`,
                                                    `"${appData.priority || ''}"`,
                                                    `"${appData.submitted_at || ''}"`,
                                                ].join(',');
                                            }),
                                        ].join('\n');

                                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                        const link = document.createElement('a');
                                        const url = URL.createObjectURL(blob);
                                        link.setAttribute('href', url);
                                        link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
                                        link.style.visibility = 'hidden';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Selected
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => table.resetRowSelection()}>
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className="h-12">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Enhanced Shadcn Pagination */}
                    <div className="bg-card/30 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Rows per page */}
                        <div className="flex items-center space-x-2">
                            <p className="text-muted-foreground text-sm font-medium">Rows per page</p>
                            <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                                <SelectTrigger className="bg-background h-9 w-[70px]">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50, 100].map((size) => (
                                        <SelectItem key={size} value={`${size}`}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="text-muted-foreground text-sm">
                                Showing <span className="text-foreground font-medium">{table.getRowModel().rows.length}</span> of{' '}
                                <span className="text-foreground font-medium">{table.getFilteredRowModel().rows.length}</span> applications
                            </div>
                        </div>

                        {/* Shadcn Pagination */}
                        {table.getPageCount() > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            size="default"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.previousPage();
                                            }}
                                            className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>

                                    {/* Show page numbers with ellipsis for better UX */}
                                    {(() => {
                                        const currentPage = table.getState().pagination.pageIndex + 1;
                                        const totalPages = table.getPageCount();
                                        const pages = [];

                                        if (totalPages <= 7) {
                                            // Show all pages if 7 or fewer
                                            for (let i = 1; i <= totalPages; i++) {
                                                pages.push(
                                                    <PaginationItem key={i}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                table.setPageIndex(i - 1);
                                                            }}
                                                            isActive={currentPage === i}
                                                            size="icon"
                                                            className="cursor-pointer"
                                                        >
                                                            {i}
                                                        </PaginationLink>
                                                    </PaginationItem>,
                                                );
                                            }
                                        } else {
                                            // Show first page
                                            pages.push(
                                                <PaginationItem key={1}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            table.setPageIndex(0);
                                                        }}
                                                        isActive={currentPage === 1}
                                                        size="icon"
                                                        className="cursor-pointer"
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>,
                                            );

                                            // Show ellipsis if current page is far from start
                                            if (currentPage > 3) {
                                                pages.push(
                                                    <PaginationItem key="ellipsis1">
                                                        <PaginationEllipsis />
                                                    </PaginationItem>,
                                                );
                                            }

                                            // Show pages around current page
                                            const start = Math.max(2, currentPage - 1);
                                            const end = Math.min(totalPages - 1, currentPage + 1);

                                            for (let i = start; i <= end; i++) {
                                                pages.push(
                                                    <PaginationItem key={i}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                table.setPageIndex(i - 1);
                                                            }}
                                                            isActive={currentPage === i}
                                                            size="icon"
                                                            className="cursor-pointer"
                                                        >
                                                            {i}
                                                        </PaginationLink>
                                                    </PaginationItem>,
                                                );
                                            }

                                            // Show ellipsis if current page is far from end
                                            if (currentPage < totalPages - 2) {
                                                pages.push(
                                                    <PaginationItem key="ellipsis2">
                                                        <PaginationEllipsis />
                                                    </PaginationItem>,
                                                );
                                            }

                                            // Show last page
                                            pages.push(
                                                <PaginationItem key={totalPages}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            table.setPageIndex(totalPages - 1);
                                                        }}
                                                        isActive={currentPage === totalPages}
                                                        size="icon"
                                                        className="cursor-pointer"
                                                    >
                                                        {totalPages}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                            );
                                        }

                                        return pages;
                                    })()}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            size="default"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.nextPage();
                                            }}
                                            className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Action Dialog */}
            <Dialog open={quickActionDialog.isOpen} onOpenChange={(open) => setQuickActionDialog((prev) => ({ ...prev, isOpen: open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {quickActionDialog.action === 'approve' && 'Approve Application'}
                            {quickActionDialog.action === 'reject' && 'Reject Application'}
                            {quickActionDialog.action === 'schedule' && 'Schedule Interview'}
                        </DialogTitle>
                        <DialogDescription>
                            {quickActionDialog.application && (
                                <>
                                    {quickActionDialog.action === 'approve' &&
                                        `Are you sure you want to approve ${quickActionDialog.application.student.name}'s application?`}
                                    {quickActionDialog.action === 'reject' &&
                                        `Are you sure you want to reject ${quickActionDialog.application.student.name}'s application?`}
                                    {quickActionDialog.action === 'schedule' &&
                                        `Schedule an interview for ${quickActionDialog.application.student.name}'s application.`}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setQuickActionDialog((prev) => ({ ...prev, isOpen: false }))}>
                            Cancel
                        </Button>
                        <Button
                            variant={quickActionDialog.action === 'reject' ? 'destructive' : 'default'}
                            onClick={() => {
                                // Handle the action here - you would typically make an API call
                                console.log(`${quickActionDialog.action} application #${quickActionDialog.application?.id}`);
                                setQuickActionDialog({ isOpen: false, application: null, action: null });
                            }}
                        >
                            {quickActionDialog.action === 'approve' && 'Approve'}
                            {quickActionDialog.action === 'reject' && 'Reject'}
                            {quickActionDialog.action === 'schedule' && 'Schedule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Status configuration
export default function ApplicationsPage({ applications }: ApplicationsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Application Management" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl">Application Management</CardTitle>
                                <CardDescription className="mt-2 text-base">Review and manage scholarship applications from students</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.reload()}
                                                className="flex h-8 items-center gap-2 px-3"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                                Refresh
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Refresh data</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Application Management */}
                <div>
                    <DataTable columns={columns} data={applications} searchPlaceholder="Search by student name, ID, or email..." />
                </div>
            </div>
        </AppLayout>
    );
}
