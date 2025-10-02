import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
// Import the UI Pagination primitives
import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Pagination as UiPagination,
} from '@/components/ui/pagination';

interface PaginationProps<TData> {
    table: Table<TData>;
    filteredDataLength: number;
}

export function Pagination<TData>({ table, filteredDataLength }: PaginationProps<TData>) {
    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;

    // Generate page numbers for display (simple version, now for 5 max)
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (pageCount <= 5) {
            for (let i = 0; i < pageCount; i++) pages.push(i);
        } else {
            if (pageIndex <= 2) {
                pages.push(0, 1, 2, 'ellipsis', pageCount - 1);
            } else if (pageIndex >= pageCount - 3) {
                pages.push(0, 'ellipsis', pageCount - 3, pageCount - 2, pageCount - 1);
            } else {
                pages.push(0, 'ellipsis', pageIndex, 'ellipsis', pageCount - 1);
            }
        }
        return pages;
    };

    return (
        <UiPagination className="flex w-full items-center justify-between">
            {/* Left side: Rows per page and page info */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={
                            table.getState().pagination.pageSize >= filteredDataLength
                                ? String(filteredDataLength)
                                : String(table.getState().pagination.pageSize)
                        }
                        onValueChange={(value) => {
                            if (value === String(filteredDataLength)) {
                                table.setPageSize(filteredDataLength);
                            } else {
                                table.setPageSize(Number(value));
                            }
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue>
                                {table.getState().pagination.pageSize >= filteredDataLength ? 'All' : table.getState().pagination.pageSize}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                            <SelectItem value={String(filteredDataLength)}>All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
            </div>
            {/* Right side: Pagination controls */}
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            table.previousPage();
                        }}
                        aria-disabled={!table.getCanPreviousPage()}
                        tabIndex={!table.getCanPreviousPage() ? -1 : 0}
                        style={!table.getCanPreviousPage() ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                    />
                </PaginationItem>
                {getPageNumbers().map((page, idx) =>
                    page === 'ellipsis' ? (
                        <PaginationItem key={'ellipsis-' + idx}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={pageIndex === page}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(page as number);
                                }}
                            >
                                {(page as number) + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            table.nextPage();
                        }}
                        aria-disabled={!table.getCanNextPage()}
                        tabIndex={!table.getCanNextPage() ? -1 : 0}
                        style={!table.getCanNextPage() ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                    />
                </PaginationItem>
            </PaginationContent>
        </UiPagination>
    );
}
