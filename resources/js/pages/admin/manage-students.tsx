import { Head, Link } from '@inertiajs/react';
import * as React from 'react';

import { format } from 'date-fns';
import { Download, Eye, MoreHorizontal, X } from 'lucide-react';

import DeleteStudentDialog from '@/components/delete-student-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';

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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Pagination } from '@/components/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Students',
        href: route('admin.students.index'),
    },
];

interface StudentsPageProps {
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
    };
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

export default function Students({ students }: StudentsPageProps) {
    const data = students.data;
    const searchPlaceholder = 'Search by student name, ID, or email...';

    // Move ActionsCell inside Students
    const ActionsCell: React.FC<{ user: User }> = ({ user }) => {
        const [openDelete, setOpenDelete] = React.useState(false);
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
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.student_profile?.student_id || ''))}>
                        Copy Student ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={route('admin.students.show', { student: user.id })} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>View Student</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route('admin.students.edit', { student: user.id })} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>Edit Student</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600 focus:text-red-700">
                        Delete Student
                    </DropdownMenuItem>
                </DropdownMenuContent>
                <DeleteStudentDialog
                    open={openDelete}
                    onOpenChange={setOpenDelete}
                    user={{
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                    }}
                />
            </DropdownMenu>
        );
    };

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
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                        {row.original.first_name?.[0]}
                        {row.original.last_name?.[0]}
                    </AvatarFallback>
                </Avatar>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'student_profile.student_id',
            header: 'Student ID',
            cell: ({ row }) => <span className="text-foreground font-mono text-sm">{row.original.student_profile?.student_id || '-'}</span>,
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: 'fullName',
            accessorFn: (row) => `${row.first_name} ${row.middle_name ? `${row.middle_name} ` : ''}${row.last_name}`,
            header: 'Name',
            cell: ({ row }) => (
                <div className="space-y-1">
                    <div className="text-foreground text-sm font-medium">
                        {row.original.first_name} {row.original.middle_name && `${row.original.middle_name} `}
                        {row.original.last_name}
                    </div>
                </div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <div className="space-y-1">
                    <div className="text-foreground text-sm">{row.original.email}</div>
                </div>
            ),
        },
        {
            accessorKey: 'student_profile.mobile_number',
            header: 'Mobile Number',
            cell: ({ row }) => <span className="text-foreground text-sm">{row.original.student_profile?.mobile_number || '-'}</span>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'student_profile.course',
            header: 'Course',
            cell: ({ row }) => <span className="text-foreground text-sm">{row.original.student_profile?.course || '-'}</span>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'student_profile.year_level',
            header: 'Year',
            cell: ({ row }) => {
                const yearLevel = row.original.student_profile?.year_level;
                return <span className="text-foreground text-sm">{yearLevel || '-'}</span>;
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'created_at',
            header: 'Joined',
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at'));
                return <div className="text-foreground text-sm">{format(date, 'MMM d, yyyy')}</div>;
            },
        },
        {
            id: 'actions',
            header: '',
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex w-8 justify-center">
                    <ActionsCell user={row.original} />
                </div>
            ),
        },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [yearLevelFilter, setYearLevelFilter] = React.useState<string>('all');

    const filteredData = React.useMemo(() => {
        if (yearLevelFilter === 'all') {
            return data;
        }
        return data.filter((item: User) => {
            const studentData = item as StudentData;
            return studentData.student_profile?.year_level === yearLevelFilter;
        });
    }, [data, yearLevelFilter]);

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

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0 || yearLevelFilter !== 'all';

    const yearLevels = React.useMemo(() => {
        const levels = new Set<string>();

        const commonYearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        commonYearLevels.forEach((level) => levels.add(level));

        data.forEach((item: User) => {
            const studentData = item as StudentData;
            if (studentData.student_profile?.year_level) {
                levels.add(studentData.student_profile.year_level);
            }
        });

        return Array.from(levels).sort((a, b) => {
            const yearOrder = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
            const aIndex = yearOrder.indexOf(a);
            const bIndex = yearOrder.indexOf(b);

            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            } else if (aIndex !== -1) {
                return -1;
            } else if (bIndex !== -1) {
                return 1;
            } else {
                return a.localeCompare(b);
            }
        });
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Manage Students | OSAS Connect</title>
                <meta name="description" content="Manage OSAS Connect student accounts" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-bold">Manage Students</span>
                        <div className="text-muted-foreground mt-2 text-base">Manage student accounts and academic information</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="w-[150px] lg:w-[250px]"
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
                                    const selectedStudents = table.getFilteredSelectedRowModel().rows.map((row) => row.original as StudentData);

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

                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const link = document.createElement('a');
                                    const url = URL.createObjectURL(blob);
                                    link.setAttribute('href', url);
                                    link.setAttribute('download', `selected_students_${new Date().toISOString().split('T')[0]}.csv`);
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
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <Pagination table={table} filteredDataLength={filteredData.length} />
            </div>
        </AppLayout>
    );
}
