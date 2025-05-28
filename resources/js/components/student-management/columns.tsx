import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";

export const columns: ColumnDef<User>[] = [
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
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => (
            <Avatar className="h-10 w-10">
                <AvatarImage src={row.original.avatar as string} alt={`${row.original.first_name} ${row.original.last_name}`} />
                <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                    {row.original.first_name?.[0]}{row.original.last_name?.[0]}
                </AvatarFallback>
            </Avatar>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "fullName",
        accessorFn: (row) => `${row.first_name} ${row.middle_name ? `${row.middle_name} ` : ''}${row.last_name}`,
        header: "Name",
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium text-base text-gray-900 dark:text-gray-100">
                    {row.original.first_name} {row.original.middle_name && `${row.original.middle_name} `}{row.original.last_name}
                </div>                <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {row.original.student_profile?.student_id}
                </div>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
                {row.original.student_profile?.mobile_number && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {row.original.student_profile.mobile_number}
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: "student_profile.year_level",
        header: "Year", cell: ({ row }) => {
            const yearLevel = row.original.student_profile?.year_level;
            const course = row.original.student_profile?.course;

            return (
                <div className="space-y-1">
                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{yearLevel}</div>
                    {course && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {course}
                        </div>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return (
                <div className="text-base text-gray-900 dark:text-gray-100">
                    {format(date, "MMM d, yyyy")}
                </div>
            )
        },
    }, {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="text-left">
                    <Link
                        href={route('admin.students.show', { user: row.original.id })}
                        className="text-sm text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-2 pb-1"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Link>
                </div>
            );
        },
    },
];
