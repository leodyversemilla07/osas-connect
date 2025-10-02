import ErrorBoundary from '@/components/error-boundary';
import InviteStaffDialog from '@/components/staff-management/invite-staff-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { Clock, Download, Eye, MoreHorizontal, UserCheck, UserPlus, X } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';

// Unified type for staff and invitations
export type StaffTableEntry = {
    id?: number;
    avatar?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    osas_staff_profile?: {
        staff_id?: string;
        position?: string;
        department?: string;
    };
    created_at?: string;
    type: 'staff' | 'invitation';
    status: 'active' | 'pending' | 'expired' | 'accepted';
    expires_at?: string;
    invitation_id?: number;
    inviter?: {
        id: number;
        first_name: string;
        last_name: string;
    };
};

// Columns definition merged from columns.tsx
export const columns: ColumnDef<StaffTableEntry, unknown>[] = [
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
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                // Generate initials from email address
                const email = row.original.email || '';
                const emailPrefix = email.split('@')[0];

                let initials = 'U';

                // Try to extract meaningful initials from email
                if (emailPrefix.includes('.')) {
                    // Handle emails like john.doe@example.com
                    const parts = emailPrefix.split('.');
                    initials = parts
                        .map((part) => part.charAt(0))
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
                } else if (emailPrefix.includes('_')) {
                    // Handle emails like john_doe@example.com
                    const parts = emailPrefix.split('_');
                    initials = parts
                        .map((part) => part.charAt(0))
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
                } else if (emailPrefix.length >= 2) {
                    // Fallback to first two characters
                    initials = (emailPrefix[0] + emailPrefix[1]).toUpperCase();
                } else if (emailPrefix.length === 1) {
                    // Single character email prefix
                    initials = emailPrefix[0].toUpperCase();
                }

                return (
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-sm text-blue-600 dark:bg-blue-800 dark:text-blue-300">{initials}</AvatarFallback>
                    </Avatar>
                );
            }
            return (
                <Avatar className="h-10 w-10">
                    <AvatarImage src={row.original.avatar as string} alt={`${row.original.first_name} ${row.original.last_name}`} />
                    <AvatarFallback className="bg-gray-100 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {row.original.first_name?.[0]}
                        {row.original.last_name?.[0]}
                    </AvatarFallback>
                </Avatar>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'osas_staff_profile.staff_id',
        header: 'Staff ID',
        cell: ({ row }) => {
            if (row.original.type === 'staff') {
                return <span className="font-mono text-sm text-gray-700 dark:text-gray-200">{row.original.osas_staff_profile?.staff_id || '—'}</span>;
            }
            // For invitations, show a dash or blank
            return <span className="text-gray-400">—</span>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: 'fullName',
        accessorFn: (row) => (row.type === 'invitation' ? row.email : `${row.first_name} ${row.last_name}`),
        header: 'Name',
        cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
                            <span className="text-gray-500">Invitation sent to:</span>
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">{row.original.email}</div>
                    </div>
                );
            }
            return (
                <div className="space-y-1">
                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {row.original.first_name} {row.original.last_name}
                    </div>
                </div>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                const getBadgeVariantAndText = (status: string) => {
                    switch (status) {
                        case 'pending':
                            return {
                                className: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300',
                                text: 'Pending Invitation',
                                icon: Clock,
                            };
                        case 'accepted':
                            return {
                                className: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300',
                                text: 'Accepted',
                                icon: UserCheck,
                            };
                        case 'expired':
                            return {
                                className: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300',
                                text: 'Expired',
                                icon: Clock,
                            };
                        default:
                            return {
                                className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                                text: status,
                                icon: Clock,
                            };
                    }
                };

                const { className, text, icon: Icon } = getBadgeVariantAndText(row.original.status);

                return (
                    <div className="space-y-1">
                        <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={className}>
                                <Icon className="mr-1 h-3 w-3" />
                                {text}
                            </Badge>
                        </div>
                    </div>
                );
            }
            return (
                <div className="space-y-1">
                    <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
                </div>
            );
        },
    },
    {
        id: 'activeStatus',
        header: 'Status',
        cell: ({ row }) => {
            if (row.original.type === 'staff') {
                return row.original.status === 'active' ? (
                    <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                        Active
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Inactive
                    </Badge>
                );
            }
            // For invitations, show a dash
            return <span className="text-gray-400">—</span>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: 'created_at',
        header: 'Joined',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            if (row.original.type === 'invitation') {
                return (
                    <div className="space-y-1">
                        <div className="text-base text-gray-900 dark:text-gray-100">
                            {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Invited</div>
                    </div>
                );
            }
            return (
                <div className="space-y-1">
                    <div className="text-base text-gray-900 dark:text-gray-100">
                        {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.osas_staff_profile?.staff_id || ''))}>
                            Copy Staff ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={typeof route !== 'undefined' ? route('admin.staff.show', { user: user.id }) : '#'}>
                                <Eye className="mr-2 inline h-4 w-4" />
                                View Staff
                            </a>
                        </DropdownMenuItem>
                        {/* Add more actions here as needed */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function DataTable({
    columns,
    data,
    searchPlaceholder = 'Search...',
}: {
    columns: ColumnDef<StaffTableEntry, unknown>[];
    data: StaffTableEntry[];
    searchPlaceholder?: string;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<string>('all');

    // Filter data based on status
    const filteredData = React.useMemo(() => {
        if (statusFilter === 'all') {
            return data;
        }
        return data.filter((item: StaffTableEntry) => {
            return item.status === statusFilter;
        });
    }, [data, statusFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        enableRowSelection: true,
        enableGlobalFilter: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0 || statusFilter !== 'all';

    // Get unique statuses from data
    const statuses = React.useMemo(() => {
        const statusSet = new Set<string>();

        data.forEach((item: StaffTableEntry) => {
            if (item.status) {
                statusSet.add(item.status);
            }
        });

        return Array.from(statusSet).sort();
    }, [data]);

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="w-[150px] lg:w-[250px]"
                    />

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setGlobalFilter('');
                                setStatusFilter('all');
                                table.resetColumnFilters();
                            }}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Bulk Actions - Selection Info */}
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="bg-muted/50 flex items-center justify-between rounded-md p-2">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{table.getFilteredSelectedRowModel().rows.length} selected</Badge>
                        <span className="text-muted-foreground text-sm">
                            {table.getFilteredSelectedRowModel().rows.length === 1 ? 'staff member selected' : 'staff members selected'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Bulk Actions */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Get selected staff data
                                const selectedStaff = table.getFilteredSelectedRowModel().rows.map((row) => row.original as StaffTableEntry);

                                // Convert to CSV
                                const headers = ['Name', 'Email', 'Role', 'Status', 'Type'];
                                const csvContent = [
                                    headers.join(','),
                                    ...selectedStaff.map((staff: StaffTableEntry) =>
                                        [
                                            `"${staff.first_name || ''} ${staff.middle_name ? `${staff.middle_name} ` : ''}${staff.last_name || ''}"`,
                                            staff.email || '',
                                            staff.role || staff.osas_staff_profile?.position || '',
                                            staff.status || '',
                                            staff.type || '',
                                        ].join(','),
                                    ),
                                ].join('\n');

                                // Create and download CSV
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `selected_staff_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Selected
                        </Button>

                        {/* Clear Selection Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                table.toggleAllPageRowsSelected(false);
                            }}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear Selection
                        </Button>
                    </div>
                </div>
            )}

            {/* Data Table */}
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
                                <TableCell colSpan={Array.isArray(columns) ? columns.length : 1} className="h-24 text-center">
                                    No staff members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {/* Pagination UI (no props, just styled nav) */}
            <Pagination />
        </div>
    );
}

// Main page component
interface Props {
    staff?: {
        data: StaffTableEntry[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: typeof route !== 'undefined' ? route('admin.dashboard') : '#',
    },
    {
        title: 'Staff',
        href: typeof route !== 'undefined' ? route('admin.staff') : '#',
    },
];

export default function Staff({ staff = { data: [], current_page: 1, from: 0, last_page: 1, per_page: 10, to: 0, total: 0 } }: Props) {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const processedStaffData = useMemo(() => {
        return staff.data || [];
    }, [staff.data]);

    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head>
                    <title>Manage Staff | OSAS Connect</title>
                    <meta name="description" content="Manage OSAS Connect staff members" />
                </Head>
                <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                    {/* Header Section */}
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-3xl font-bold">Manage Staff</span>
                            <div className="text-muted-foreground mt-2 text-base">Manage staff accounts and academic information</div>
                        </div>
                        <Button variant="default" onClick={() => setInviteDialogOpen(true)} className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Invite Staff
                        </Button>
                    </div>

                    {/* Staff Management Table */}
                    <DataTable columns={columns} data={processedStaffData} searchPlaceholder="Search by staff name, email, or role..." />
                </div>

                {/* Invite Staff Dialog */}
                <InviteStaffDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
            </AppLayout>
        </ErrorBoundary>
    );
}
