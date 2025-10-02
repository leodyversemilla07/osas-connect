import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
import { format } from 'date-fns';
import { Download, Eye, X } from 'lucide-react';
import * as React from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Student Records',
        href: route('osas.students'),
    },
];

const columns: ColumnDef<User>[] = [
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
        cell: ({ row }) => (
            <Avatar className="h-10 w-10">
                <AvatarImage src={row.original.avatar as string} alt={`${row.original.first_name} ${row.original.last_name}`} />
                <AvatarFallback className="bg-gray-100 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {row.original.first_name?.[0]}
                    {row.original.last_name?.[0]}
                </AvatarFallback>
            </Avatar>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'fullName',
        accessorFn: (row) => `${row.first_name} ${row.middle_name ? `${row.middle_name} ` : ''}${row.last_name}`,
        header: 'Name',
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {row.original.first_name} {row.original.middle_name && `${row.original.middle_name} `}
                    {row.original.last_name}
                </div>{' '}
                <div className="text-sm text-gray-500 dark:text-gray-400">ID: {row.original.student_profile?.student_id}</div>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'email',
        header: 'Contact',
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
                {row.original.student_profile?.mobile_number && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{row.original.student_profile.mobile_number}</div>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'student_profile.year_level',
        header: 'Year',
        cell: ({ row }) => {
            const yearLevel = row.original.student_profile?.year_level;
            const course = row.original.student_profile?.course;

            return (
                <div className="space-y-1">
                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{yearLevel}</div>
                    {course && <div className="text-sm text-gray-500 dark:text-gray-400">{course}</div>}
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Joined',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return <div className="text-base text-gray-900 dark:text-gray-100">{format(date, 'MMM d, yyyy')}</div>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className="text-left">
                    <Link
                        href={route('osas.students.details', { id: user.id })}
                        className="flex items-center gap-2 pb-1 text-sm text-gray-900 transition-colors hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Link>
                </div>
            );
        },
    },
];

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
}

interface StudentData {
    student_profile?: {
        year_level?: string;
        student_id?: string;
        course?: string;
        mobile_number?: string;
    };
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
}

function DataTable<TData, TValue>({ columns, data, searchPlaceholder = 'Search students...' }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [yearLevelFilter, setYearLevelFilter] = React.useState<string>('all');
    const [pageSize, setPageSize] = React.useState(10);

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
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination: {
                pageSize: pageSize,
                pageIndex: 0,
            },
        },
    });

    React.useEffect(() => {
        table.setPageSize(pageSize);
    }, [pageSize, table]);

    // Filter data based on year level
    React.useEffect(() => {
        if (yearLevelFilter === 'all') {
            table.getColumn('student_profile.year_level')?.setFilterValue(undefined);
        } else {
            table.getColumn('student_profile.year_level')?.setFilterValue(yearLevelFilter);
        }
    }, [yearLevelFilter, table]);

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0;

    // Get unique year levels from data
    const yearLevels = React.useMemo(() => {
        const levels = new Set<string>();
        data.forEach((item: TData) => {
            const studentData = item as StudentData;
            if (studentData.student_profile?.year_level) {
                levels.add(studentData.student_profile.year_level);
            }
        });
        return Array.from(levels).sort();
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
                        className="h-8 w-[150px] lg:w-[250px]"
                    />

                    {/* Year Level Filter */}
                    <Select value={yearLevelFilter} onValueChange={setYearLevelFilter}>
                        <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue placeholder="Year Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {yearLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setGlobalFilter('');
                                setYearLevelFilter('all');
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
                            {table.getFilteredSelectedRowModel().rows.length === 1 ? 'student selected' : 'students selected'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Bulk Actions */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Get selected student data
                                const selectedStudents = table.getFilteredSelectedRowModel().rows.map((row) => row.original as StudentData);

                                // Convert to CSV
                                const headers = ['Name', 'Student ID', 'Email', 'Course', 'Year Level', 'Mobile Number'];
                                const csvContent = [
                                    headers.join(','),
                                    ...selectedStudents.map((student: StudentData) =>
                                        [
                                            `"${student.first_name || ''} ${student.middle_name ? `${student.middle_name} ` : ''}${student.last_name || ''}"`,
                                            student.student_profile?.student_id || '',
                                            student.email || '',
                                            student.student_profile?.course || '',
                                            student.student_profile?.year_level || '',
                                            student.student_profile?.mobile_number || '',
                                        ].join(','),
                                    ),
                                ].join('\n');

                                // Create and download CSV file
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => table.resetRowSelection()}>
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                </div>
            )}
            {/* Table */}
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
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>{' '}
            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
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
                                setPageSize(Number(value));
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
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        table.previousPage();
                                    }}
                                    className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {/* First page */}
                            {table.getState().pagination.pageIndex > 2 && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(0);
                                            }}
                                            className="cursor-pointer"
                                            size="sm"
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    {table.getState().pagination.pageIndex > 3 && (
                                        <PaginationItem>
                                            <span className="px-3 py-2">...</span>
                                        </PaginationItem>
                                    )}
                                </>
                            )}

                            {/* Previous page */}
                            {table.getCanPreviousPage() && (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.previousPage();
                                        }}
                                        className="cursor-pointer"
                                        size="sm"
                                    >
                                        {table.getState().pagination.pageIndex}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            {/* Current page */}
                            <PaginationItem>
                                <PaginationLink isActive size="sm">
                                    {table.getState().pagination.pageIndex + 1}
                                </PaginationLink>
                            </PaginationItem>

                            {/* Next page */}
                            {table.getCanNextPage() && (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.nextPage();
                                        }}
                                        className="cursor-pointer"
                                        size="sm"
                                    >
                                        {table.getState().pagination.pageIndex + 2}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            {/* Last page */}
                            {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                                <>
                                    {table.getState().pagination.pageIndex < table.getPageCount() - 4 && (
                                        <PaginationItem>
                                            <span className="px-3 py-2">...</span>
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(table.getPageCount() - 1);
                                            }}
                                            className="cursor-pointer"
                                            size="sm"
                                        >
                                            {table.getPageCount()}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        table.nextPage();
                                    }}
                                    className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

interface Props {
    students: {
        data: User[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    filters?: {
        search?: string;
        year_level?: string;
        course?: string;
    };
}

export default function StudentRecords({ students }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Student Records | OSAS Connect</title>
                <meta name="description" content="View and manage student information" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl">Student Records</CardTitle>
                                <CardDescription className="mt-2 text-base">View and manage student information and academic records</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <DataTable columns={columns} data={students.data} searchPlaceholder="Search by student name, ID, or email..." />
            </div>
        </AppLayout>
    );
}
