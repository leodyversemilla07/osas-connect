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
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronDown } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    maxVisiblePages?: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    maxVisiblePages = 5,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageSize, setPageSize] = React.useState(10)

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageSize: pageSize,
                pageIndex: 0,
            },
        },
    })

    // Calculate pagination details
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1

    type PageItem = number | 'ellipsis'

    // Generate array of page numbers to display
    const generatePagination = React.useCallback((): PageItem[] => {
        const pages: PageItem[] = []

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate range around current page
            const sidePages = Math.floor((maxVisiblePages - 3) / 2) // -3 accounts for first, last, and current page
            let startPage = Math.max(2, currentPage - sidePages)
            let endPage = Math.min(totalPages - 1, currentPage + sidePages)

            // Adjust range if we're near the beginning or end
            if (currentPage <= sidePages + 2) {
                endPage = Math.min(totalPages - 1, maxVisiblePages - 2)
            } else if (currentPage >= totalPages - (sidePages + 1)) {
                startPage = Math.max(2, totalPages - (maxVisiblePages - 2))
            }

            // Add ellipsis and range
            if (startPage > 2) pages.push('ellipsis')
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }
            if (endPage < totalPages - 1) pages.push('ellipsis')

            // Always show last page
            if (totalPages > 1) pages.push(totalPages)
        }

        return pages
    }, [currentPage, totalPages, maxVisiblePages])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Filter by name..."
                        className="max-w-sm"
                        value={table.getColumn("fullName")?.getFilterValue() as string}
                        onChange={(event) =>
                            table.getColumn("fullName")?.setFilterValue(event.target.value)
                        }
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.toggleAllPageRowsSelected()}
                    >
                        {table.getIsAllPageRowsSelected() ? 'Deselect All' : 'Select All'}
                    </Button>
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button variant="default" size="sm">
                            Bulk Actions ({table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    )}
                </div>
            </div>
            
            <div className="rounded-md border shadow-sm">
                <Table>
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-900">
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(value) => {
                                setPageSize(Number(value))
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={`${size}`}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}
                                    className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    aria-disabled={!table.getCanPreviousPage()}
                                />
                            </PaginationItem>
                            {generatePagination().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === 'ellipsis' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => table.setPageIndex((page as number) - 1)}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => table.nextPage()}
                                    className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    aria-disabled={!table.getCanNextPage()}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}