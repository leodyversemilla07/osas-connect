import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Trash2, Mail } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      const fullName = `${user.first_name}${user.middle_name ? ` ${user.middle_name} ` : ' '}${user.last_name}`
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{fullName}</span>
            <span className="text-xs text-muted-foreground">{user.student_id}</span>
          </div>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const major = row.original.major && row.original.major !== 'None' 
        ? ` (${row.original.major})`
        : ''
      return (
        <div className="flex flex-col">
          <span className="truncate">{row.original.course}</span>
          {major && <span className="text-xs text-muted-foreground">{major}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "year_level",
    header: "Year Level",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      // Map human-readable labels and colors
      const roleLabels: { [key: string]: string } = {
        student: "Student",
        osas_staff: "OSAS Staff",
        admin: "Admin",
      }
      const roleColors: { [key: string]: string } = {
        student: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400",
        osas_staff: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400",
        admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400",
      }
      const role = row.original.role
      return (
        <Badge
          variant="secondary"
          className={roleColors[role] + " px-2 py-1 rounded-full text-xs font-semibold"}
        >
          {roleLabels[role] || role.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={route('admin.users.show', user.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {user.role === 'osas_staff' && (
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]