import CreateScholarshipDialog from '@/components/osas-scholarship-management/create-scholarship-dialog';
import DeleteScholarshipDialog from '@/components/osas-scholarship-management/delete-scholarship-dialog';
import EditScholarshipDialog from '@/components/osas-scholarship-management/edit-scholarship-dialog';
import ViewScholarshipDialog from '@/components/osas-scholarship-management/view-scholarship-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    type ColumnDef,
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
import { Clock, Edit, Eye, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Manage Scholarships',
        href: route('osas.manage.scholarships'),
    },
];

interface Scholarship {
    id: number;
    name: string;
    description: string;
    type: string;
    type_specification?: string;
    amount: number;
    status: 'active' | 'inactive' | 'upcoming' | 'draft';
    deadline: string | null;
    slots_available: number;
    total_applications: number;
    approved_applications: number;
    remaining_slots: number;
    criteria: string[] | null;
    required_documents: string[] | null;
    funding_source?: string;
    created_at: string;
    updated_at: string;
}

interface Statistics {
    total_scholarships: number;
    active_scholarships: number;
    total_applications: number;
    total_beneficiaries: number;
}

interface Filters {
    search?: string;
    status?: string;
    type?: string;
    sort_by: string;
    sort_direction: string;
}

interface ManageScholarshipsProps {
    scholarships: {
        data: Scholarship[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    statistics: Statistics;
    filters: Filters;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

interface ColumnActions {
    onEdit: (scholarship: Scholarship) => void;
    onView: (scholarship: Scholarship) => void;
    onDelete: (scholarship: Scholarship) => void;
}

const getStatusColor = (status: 'active' | 'inactive' | 'upcoming' | 'draft'): string => {
    const colors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

// Shorter mappings for badges and table display
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

const getTypeColor = (type: string): string => {
    const typeCategory = type.includes('academic')
        ? 'academic'
        : type.includes('student_assistantship')
          ? 'assistantship'
          : type.includes('performing_arts')
            ? 'arts'
            : type.includes('economic')
              ? 'economic'
              : 'other';

    const colors: Record<string, string> = {
        academic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        assistantship: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        arts: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        economic: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    };
    return colors[typeCategory];
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);
};

const createColumns = (actions: ColumnActions): ColumnDef<Scholarship>[] => [
    {
        accessorKey: 'name',
        header: 'NAME',
        cell: ({ row }) => (
            <div className="max-w-[200px]">
                <div className="font-medium text-gray-900 dark:text-gray-100">{row.getValue('name')}</div>
            </div>
        ),
    },
    {
        accessorKey: 'description',
        header: 'DESCRIPTION',
        cell: ({ row }) => (
            <div className="max-w-[300px]">
                <div className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">{row.getValue('description')}</div>
            </div>
        ),
    },
    {
        accessorKey: 'type',
        header: 'TYPE',
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            const displayType = getScholarshipTypeDisplay(type);
            return <Badge className={getTypeColor(type)}>{displayType}</Badge>;
        },
    },
    {
        accessorKey: 'amount',
        header: 'AMOUNT',
        cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue('amount'))}</div>,
    },
    {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.getValue('status'))}>
                {(row.getValue('status') as string).charAt(0).toUpperCase() + (row.getValue('status') as string).slice(1)}
            </Badge>
        ),
    },
    {
        accessorKey: 'deadline',
        header: 'DEADLINE',
        cell: ({ row }) => {
            const deadline = row.getValue('deadline') as string | null;
            if (!deadline) return <span className="text-gray-400">No deadline</span>;

            const deadlineDate = new Date(deadline);
            const now = new Date();
            const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                        <div className="text-sm font-medium">{deadlineDate.toLocaleDateString()}</div>
                        <div
                            className={`text-xs ${daysLeft <= 7 && daysLeft > 0 ? 'text-red-500' : daysLeft <= 0 ? 'text-red-600' : 'text-gray-500'}`}
                        >
                            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Expired'}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'applications',
        header: 'APPLICATIONS',
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <div className="text-sm">
                    <div className="font-medium">{row.original.total_applications} total</div>
                    <div className="text-gray-500">{row.original.approved_applications} approved</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'remaining_slots',
        header: 'SLOTS',
        cell: ({ row }) => (
            <div className="text-sm">
                <div className="font-medium">{row.original.remaining_slots} remaining</div>
                <div className="text-gray-500">of {row.original.slots_available} total</div>
            </div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        header: 'ACTIONS',
        cell: ({ row }) => {
            const scholarship = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => actions.onView(scholarship)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => actions.onEdit(scholarship)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Scholarship
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => actions.onDelete(scholarship)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
                                    className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                                const currentPage = table.getState().pagination.pageIndex;
                                const totalPages = table.getPageCount();

                                let pageNumber;
                                if (totalPages <= 5) {
                                    pageNumber = i;
                                } else if (currentPage < 3) {
                                    pageNumber = i;
                                } else if (currentPage > totalPages - 3) {
                                    pageNumber = totalPages - 5 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            size="default"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(pageNumber);
                                            }}
                                            isActive={pageNumber === currentPage}
                                        >
                                            {pageNumber + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {table.getPageCount() > 5 && table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    size="default"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        table.nextPage();
                                    }}
                                    className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default function ManageScholarships({ scholarships }: ManageScholarshipsProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

    const openEditDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Scholarships" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-border border-b pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-foreground text-3xl font-semibold">Scholarship Management</h1>
                            <p className="text-muted-foreground text-base">Manage scholarship programs and applications</p>
                        </div>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            variant="default"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Scholarship
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={
                        createColumns({
                            onEdit: openEditDialog,
                            onView: openViewDialog,
                            onDelete: openDeleteDialog,
                        }) as ColumnDef<Scholarship, unknown>[]
                    }
                    data={scholarships.data}
                />
            </div>

            {/* Dialog Components */}
            <CreateScholarshipDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

            {selectedScholarship && (
                <>
                    <EditScholarshipDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} scholarship={selectedScholarship} />

                    <ViewScholarshipDialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} scholarship={selectedScholarship} />

                    <DeleteScholarshipDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        scholarship={selectedScholarship}
                    />
                </>
            )}
        </AppLayout>
    );
}
