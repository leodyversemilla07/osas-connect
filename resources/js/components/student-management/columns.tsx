import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Mail, Calendar, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
            <Avatar className="h-9 w-9">                
            <AvatarImage src={row.original.avatar as string} alt={`${row.original.first_name} ${row.original.middle_name ? `${row.original.middle_name} ` : ''}${row.original.last_name}`} />
                <AvatarFallback className="bg-primary/10 text-primary">
                    {row.original.first_name?.[0]}{row.original.middle_name?.[0]}{row.original.last_name?.[0]}
                </AvatarFallback>
            </Avatar>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "fullName",
        accessorFn: (row) => `${row.first_name} ${row.middle_name ? `${row.middle_name} ` : ''}${row.last_name}`,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <span className="font-medium">
                    {row.original.first_name} {row.original.middle_name && `${row.original.middle_name} `}{row.original.last_name}
                </span>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        ID: {row.original.student_profile?.student_id}
                    </Badge>
                    {row.original.student_profile?.course && (
                        <Badge variant="outline" className="text-xs">
                            {row.original.student_profile.course}
                        </Badge>
                    )}
                </div>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    Contact Info
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{row.original.email}</span>
                </div>
                {row.original.student_profile?.mobile_number && (
                    <span className="text-sm text-muted-foreground">
                        📱 {row.original.student_profile.mobile_number}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "student_profile.year_level",
        header: "Academic Info",
        cell: ({ row }) => {
            const yearLevel = row.original.student_profile?.year_level;
            const major = row.original.student_profile?.major;
            
            return (
                <div className="flex flex-col gap-1">
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "w-fit",
                            yearLevel?.toLowerCase().includes('1') && "border-blue-500 text-blue-500",
                            yearLevel?.toLowerCase().includes('2') && "border-green-500 text-green-500",
                            yearLevel?.toLowerCase().includes('3') && "border-yellow-500 text-yellow-500",
                            yearLevel?.toLowerCase().includes('4') && "border-purple-500 text-purple-500",
                        )}
                    >
                        {yearLevel}
                    </Badge>
                    {major && (
                        <span className="text-sm text-muted-foreground">
                            Major in {major}
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    Joined Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(date, "MMM d, yyyy")}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            
            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Scholarship Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                Archive Student
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];
