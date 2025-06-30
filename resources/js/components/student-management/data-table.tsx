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

interface StudentData {
    student_profile?: {
        year_level?: string
        student_id?: string
        course?: string
        mobile_number?: string
    }
    first_name?: string
    middle_name?: string
    last_name?: string
    email?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Search students...",
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [yearLevelFilter, setYearLevelFilter] = React.useState<string>("all")

    // Filter data based on year level
    const filteredData = React.useMemo(() => {
        if (yearLevelFilter === "all") {
            return data
        }
        return data.filter((item: TData) => {
            const studentData = item as StudentData
            return studentData.student_profile?.year_level === yearLevelFilter
        })
    }, [data, yearLevelFilter])

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

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0 || yearLevelFilter !== "all"

    // Get unique year levels from data
    const yearLevels = React.useMemo(() => {
        const levels = new Set<string>()

        // Add common year levels as defaults
        const commonYearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']
        commonYearLevels.forEach(level => levels.add(level))

        // Add actual year levels from data
        data.forEach((item: TData) => {
            const studentData = item as StudentData
            if (studentData.student_profile?.year_level) {
                levels.add(studentData.student_profile.year_level)
            }
        })

        return Array.from(levels).sort((a, b) => {
            // Custom sort to put year levels in proper order
            const yearOrder = ['1st Year', '2nd Year', '3rd Year', '4th Year']
            const aIndex = yearOrder.indexOf(a)
            const bIndex = yearOrder.indexOf(b)

            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex
            } else if (aIndex !== -1) {
                return -1
            } else if (bIndex !== -1) {
                return 1
            } else {
                return a.localeCompare(b)
            }
        })
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
                                setGlobalFilter("")
                                setYearLevelFilter("all")
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
                                ? "student selected"
                                : "students selected"}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Bulk Actions */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Get selected student data
                                const selectedStudents = table.getFilteredSelectedRowModel().rows.map(row => row.original as StudentData)

                                // Convert to CSV
                                const headers = ['Name', 'Student ID', 'Email', 'Course', 'Year Level', 'Mobile Number']
                                const csvContent = [
                                    headers.join(','),
                                    ...selectedStudents.map((student: StudentData) => [
                                        `"${student.first_name || ''} ${student.middle_name ? `${student.middle_name} ` : ''}${student.last_name || ''}"`,
                                        student.student_profile?.student_id || '',
                                        student.email || '',
                                        student.student_profile?.course || '',
                                        student.student_profile?.year_level || '',
                                        student.student_profile?.mobile_number || ''
                                    ].join(','))
                                ].join('\n')

                                // Create and download CSV
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                                const link = document.createElement('a')
                                const url = URL.createObjectURL(blob)
                                link.setAttribute('href', url)
                                link.setAttribute('download', `selected_students_${new Date().toISOString().split('T')[0]}.csv`)
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
    )
}
