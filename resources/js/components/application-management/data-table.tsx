import * as React from "react"
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
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeft,
    ChevronsRight,
    Settings2,
    X,
    Download
} from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder?: string
}

interface ApplicationData {
    id: number
    status: string
    priority: string
    submitted_at?: string
    student: {
        name: string
        student_id: string
        email: string
        course: string
        year_level: string
    }
    scholarship: {
        name: string
        type: string
        amount?: string
    }
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Search applications...",
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [priorityFilter, setPriorityFilter] = React.useState<string>("all")

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
            const search = value.toLowerCase()
            const rowData = row.original as ApplicationData

            // Safely access nested properties
            const student = rowData.student || {}
            const scholarship = rowData.scholarship || {}
            const status = rowData.status || ''
            const priority = rowData.priority || ''

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
            )
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    // Apply additional filters
    React.useEffect(() => {
        const filters: ColumnFiltersState = []

        if (statusFilter !== "all") {
            filters.push({ id: "status", value: statusFilter })
        }

        if (priorityFilter !== "all") {
            filters.push({ id: "priority", value: priorityFilter })
        }

        setColumnFilters(filters)
    }, [statusFilter, priorityFilter])

    const selectedRows = table.getFilteredSelectedRowModel().rows.length
    const totalRows = table.getFilteredRowModel().rows.length

    // Get unique status and priority values for filters
    const uniqueStatuses = React.useMemo(() => {
        const statuses = new Set(data.map((row) => (row as ApplicationData).status))
        return Array.from(statuses)
    }, [data])

    const uniquePriorities = React.useMemo(() => {
        const priorities = new Set(data.map((row) => (row as ApplicationData).priority))
        return Array.from(priorities)
    }, [data])

    const resetFilters = () => {
        setGlobalFilter("")
        setStatusFilter("all")
        setPriorityFilter("all")
        table.resetColumnFilters()
    }

    const hasActiveFilters = globalFilter || statusFilter !== "all" || priorityFilter !== "all"

    return (
        <div className="space-y-4">
            {/* Enhanced Search and Filters */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                    {/* Global Search */}
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-8 w-full sm:w-[250px]"
                    />

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 w-full sm:w-[180px]">
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
                        <SelectTrigger className="h-8 w-full sm:w-[150px]">
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
                        <Button
                            variant="ghost"
                            onClick={resetFilters}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Column Visibility Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                            <Settings2 className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Selection Info and Bulk Actions */}
            {selectedRows > 0 && (
                <div className="flex items-center justify-between rounded-md border border-dashed p-4">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                            {selectedRows}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            of {totalRows} row(s) selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const selectedData = table.getFilteredSelectedRowModel().rows.map(row => row.original);
                                // Export functionality - convert to CSV
                                const headers = ['Student Name', 'Student ID', 'Email', 'Course', 'Year Level', 'Scholarship', 'Type', 'Amount', 'Status', 'Priority', 'Submitted At'];
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
                                            `"${appData.submitted_at || ''}"`
                                        ].join(',');
                                    })
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
                            <Download className="h-4 w-4 mr-2" />
                            Export Selected
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.resetRowSelection()}
                        >
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
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
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

            {/* Enhanced Pagination */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Rows per page */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
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
                </div>

                {/* Page info */}
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>

                {/* Navigation controls */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    Showing {table.getRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} application(s)
                </div>
                {selectedRows > 0 && (
                    <div>
                        {selectedRows} row(s) selected
                    </div>
                )}
            </div>
        </div>
    )
}
