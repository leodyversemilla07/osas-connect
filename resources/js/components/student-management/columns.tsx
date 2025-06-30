import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteStudentDialog from '@/components/delete-student-dialog';
import React from 'react';

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
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(String(user.student_profile?.student_id || ''))}
                >
                    Copy Student ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('admin.students.show', { user: user.id })} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>View Student</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('admin.students.edit', { user: user.id })} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Edit Student</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => setOpenDelete(true)}
                    className="text-red-600 focus:text-red-700"
                >
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
        accessorKey: "student_profile.student_id",
        header: "Student ID",
        cell: ({ row }) => (
            <span className="font-mono text-base text-gray-900 dark:text-gray-100">
                {row.original.student_profile?.student_id || "-"}
            </span>
        ),
        enableSorting: true,
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
                </div>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
            </div>
        ),
    },
    {
        accessorKey: "student_profile.mobile_number",
        header: "Mobile Number",
        cell: ({ row }) => (
            <span className="text-base text-gray-900 dark:text-gray-100">
                {row.original.student_profile?.mobile_number || "-"}
            </span>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "student_profile.course",
        header: "Course",
        cell: ({ row }) => (
            <span className="text-base text-gray-900 dark:text-gray-100">
                {row.original.student_profile?.course || "-"}
            </span>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "student_profile.year_level",
        header: "Year",
        cell: ({ row }) => {
            const yearLevel = row.original.student_profile?.year_level;
            return (
                <span className="text-base text-gray-900 dark:text-gray-100">
                    {yearLevel || "-"}
                </span>
            );
        },
        enableSorting: false,
        enableHiding: false,
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
        enableHiding: false,
        cell: ({ row }) => <ActionsCell user={row.original} />,
    },
];
