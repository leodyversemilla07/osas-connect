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
import { Badge } from "@/components/ui/badge"
import {
    X,
    Download
} from "lucide-react"
import { Pagination } from "@/components/pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder?: string
}

interface StaffData {
    type: 'staff' | 'invitation'
    status: 'active' | 'pending' | 'expired' | 'accepted'
    first_name?: string
    middle_name?: string
    last_name?: string
    email?: string
    role?: string
    osas_staff_profile?: {
        position?: string
        department?: string
    }
    expires_at?: string
    invitation_id?: number
    inviter?: {
        id: number
        first_name: string
        last_name: string
    }
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")

    // Filter data based on status
    const filteredData = React.useMemo(() => {
        if (statusFilter === "all") {
            return data
        }
        return data.filter((item: TData) => {
            const staffData = item as StaffData
            return staffData.status === statusFilter
        })
    }, [data, statusFilter])

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
    })

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0 || statusFilter !== "all"

    // Get unique statuses from data
    const statuses = React.useMemo(() => {
        const statusSet = new Set<string>()

        data.forEach((item: TData) => {
            const staffData = item as StaffData
            if (staffData.status) {
                statusSet.add(staffData.status)
            }
        })

        return Array.from(statusSet).sort()
    }, [data])

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
                                setGlobalFilter("")
                                setStatusFilter("all")
                                table.resetColumnFilters()
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
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                            {table.getFilteredSelectedRowModel().rows.length} selected
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length === 1
                                ? "staff member selected"
                                : "staff members selected"}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Bulk Actions */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Get selected staff data
                                const selectedStaff = table.getFilteredSelectedRowModel().rows.map(row => row.original as StaffData)

                                // Convert to CSV
                                const headers = ['Name', 'Email', 'Role', 'Status', 'Type']
                                const csvContent = [
                                    headers.join(','),
                                    ...selectedStaff.map((staff: StaffData) => [
                                        `"${staff.first_name || ''} ${staff.middle_name ? `${staff.middle_name} ` : ''}${staff.last_name || ''}"`,
                                        staff.email || '',
                                        staff.role || staff.osas_staff_profile?.position || '',
                                        staff.status || '',
                                        staff.type || ''
                                    ].join(','))
                                ].join('\n')

                                // Create and download CSV
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                                const link = document.createElement('a')
                                const url = URL.createObjectURL(blob)
                                link.setAttribute('href', url)
                                link.setAttribute('download', `selected_staff_${new Date().toISOString().split('T')[0]}.csv`)
                                link.style.visibility = 'hidden'
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
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
                                table.toggleAllPageRowsSelected(false)
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No staff members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <Pagination table={table} filteredDataLength={filteredData.length} />
        </div>
    )
}
