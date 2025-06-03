import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { format } from "date-fns";

export interface Page {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export const getColumns = (onDeletePage?: (page: Page) => void): ColumnDef<Page>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    },    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium text-base text-gray-900 dark:text-gray-100">
                    {row.getValue("title")}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                /{row.getValue("slug")}
            </div>
        ),
    },    {
        accessorKey: "updated_at",
        header: "Last Updated",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updated_at"));
            return (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {format(date, 'MMM dd, yyyy')}
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                        {format(date, 'HH:mm')}
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const page = row.original;

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
                            <Link 
                                href={route('admin.cms.show', page.id)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link 
                                href={route('admin.cms.edit', page.id)}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => {
                                if (onDeletePage) {
                                    onDeletePage(page);
                                } else {
                                    // Fallback to old behavior
                                    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                                        router.delete(route('admin.cms.destroy', page.id));
                                    }
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

// Export backward compatible columns without delete handler
export const columns = getColumns();
