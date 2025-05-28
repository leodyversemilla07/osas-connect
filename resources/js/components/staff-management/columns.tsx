import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Clock, UserCheck, Eye } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Extended type to handle both staff and invitations
type StaffTableEntry = User & {
    type: 'staff' | 'invitation'
    status: 'active' | 'pending' | 'expired' | 'accepted'
    expires_at?: string
    invitation_id?: number
    inviter?: {
        id: number
        first_name: string
        last_name: string
    }
}

export const columns: ColumnDef<StaffTableEntry>[] = [
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
    }, {
        accessorKey: "avatar",
        header: "Avatar", cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                // Generate initials from email address
                const email = row.original.email || ''
                const emailPrefix = email.split('@')[0]

                let initials = 'U'

                // Try to extract meaningful initials from email
                if (emailPrefix.includes('.')) {
                    // Handle emails like john.doe@example.com
                    const parts = emailPrefix.split('.')
                    initials = parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2)
                } else if (emailPrefix.includes('_')) {
                    // Handle emails like john_doe@example.com
                    const parts = emailPrefix.split('_')
                    initials = parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2)
                } else if (emailPrefix.length >= 2) {
                    // Fallback to first two characters
                    initials = (emailPrefix[0] + emailPrefix[1]).toUpperCase()
                } else if (emailPrefix.length === 1) {
                    // Single character email prefix
                    initials = emailPrefix[0].toUpperCase()
                }

                return (
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                )
            }
            return (
                <Avatar className="h-10 w-10">
                    <AvatarImage src={row.original.avatar as string} alt={`${row.original.first_name} ${row.original.last_name}`} />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                        {row.original.first_name?.[0]}{row.original.last_name?.[0]}
                    </AvatarFallback>
                </Avatar>
            )
        },
        enableSorting: false,
        enableHiding: false,
    }, {
        id: "fullName",
        accessorFn: (row) => row.type === 'invitation' ? row.email : `${row.first_name} ${row.last_name}`,
        header: "Name",
        cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                return (
                    <div className="space-y-1">
                        <div className="font-medium text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="text-gray-500">Invitation sent to:</span>
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                            {row.original.email}
                        </div>
                    </div>
                )
            }
            return (
                <div className="space-y-1">
                    <div className="font-medium text-base text-gray-900 dark:text-gray-100">
                        {row.original.first_name} {row.original.last_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {row.original.osas_staff_profile?.staff_id}
                    </div>
                </div>
            )
        },
        enableHiding: false,
    }, {
        accessorKey: "email",
        header: "Contact", cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                const getBadgeVariantAndText = (status: string) => {
                    switch (status) {
                        case 'pending':
                            return {
                                className: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
                                text: "Pending Invitation",
                                icon: Clock
                            };
                        case 'accepted':
                            return {
                                className: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
                                text: "Accepted",
                                icon: UserCheck
                            };
                        case 'expired':
                            return {
                                className: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
                                text: "Expired",
                                icon: Clock
                            };
                        default:
                            return {
                                className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                                text: status,
                                icon: Clock
                            };
                    }
                };

                const { className, text, icon: Icon } = getBadgeVariantAndText(row.original.status);

                return (
                    <div className="space-y-1">
                        <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={className}>
                                <Icon className="h-3 w-3 mr-1" />
                                {text}
                            </Badge>
                        </div>
                    </div>
                )
            }
            return (
                <div className="space-y-1">
                    <div className="text-base text-gray-900 dark:text-gray-100">{row.original.email}</div>
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Active Staff
                        </Badge>
                    </div>
                </div>
            )
        },
    }, {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            if (row.original.type === 'invitation') {
                return (
                    <div className="space-y-1">
                        <div className="text-base text-gray-900 dark:text-gray-100">
                            {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Invited
                        </div>
                    </div>
                )
            }
            return (
                <div className="space-y-1">
                    <div className="text-base text-gray-900 dark:text-gray-100">
                        {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Joined
                    </div>
                </div>
            )
        },
    }, {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            if (row.original.type === 'invitation') {
                return (
                    <div className="text-left">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    onClick={() => {
                                        router.post(route('admin.invitations.resend', { invitation: row.original.invitation_id }))
                                    }}
                                    className="text-base"
                                >
                                    Resend Invitation
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        router.delete(route('admin.invitations.revoke', { invitation: row.original.invitation_id }))
                                    }}
                                    className="text-base text-red-600 dark:text-red-400"
                                >
                                    Revoke Invitation
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }

            return (
                <div className="text-left">
                    <Link
                        href={route('admin.staff.show', { user: row.original.id })}
                        className="text-sm text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-2 pb-1"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Link>
                </div>
            )
        },
    },
]
