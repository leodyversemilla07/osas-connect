import { ColumnDef } from "@tanstack/react-table"
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
import { 
    MoreVertical, 
    Eye, 
    FileText, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    ArrowUpDown,
    User
} from "lucide-react"
import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"

// Application type definition
export type Application = {
    id: number;
    student: {
        id: number;
        name: string;
        student_id: string;
        email: string;
        course: string;
        year_level: string;
    };
    scholarship: {
        id: number;
        name: string;
        type: string;
        amount: string;
    };
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold';
    submitted_at: string;
    updated_at: string;
    priority: 'high' | 'medium' | 'low';
    documents_count: number;
    verified_documents_count: number;
    interview_scheduled: boolean;
    deadline: string;
    reviewer?: {
        name: string;
        id: number;
    };
}

// Status configuration
const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        icon: Clock,
    },
    under_review: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        icon: Eye,
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        icon: XCircle,
    },
    on_hold: {
        label: 'On Hold',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: AlertCircle,
    },
} as const;

export const columns: ColumnDef<Application>[] = [
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
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="font-medium">#{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "student",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const student = row.getValue("student") as Application["student"];
            return (
                <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {student.student_id} • {student.course} {student.year_level}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "scholarship",
        header: "Scholarship",
        cell: ({ row }) => {
            const scholarship = row.getValue("scholarship") as Application["scholarship"];
            return (
                <div>
                    <div className="font-medium">{scholarship.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {scholarship.type} • {scholarship.amount}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as Application["status"];
            const StatusIcon = statusConfig[status].icon;
            
            return (
                <Badge className={cn(statusConfig[status].color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[status].label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const priority = row.getValue("priority") as Application["priority"];
            return (
                <Badge variant={
                    priority === 'high' ? 'destructive' : 
                    priority === 'medium' ? 'default' : 
                    'secondary'
                }>
                    {priority}
                </Badge>
            );
        },
    },
    {
        accessorKey: "documents",
        header: "Documents",
        cell: ({ row }) => {
            const documentsCount = row.original.documents_count;
            const verifiedCount = row.original.verified_documents_count;
            const percentage = documentsCount > 0 ? (verifiedCount / documentsCount) * 100 : 0;
            
            return (
                <div className="space-y-1">
                    <div className="text-sm">
                        {verifiedCount}/{documentsCount} verified
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all" 
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "submitted_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Submitted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("submitted_at"));
            return (
                <div className="text-sm">
                    {date.toLocaleDateString()}
                </div>
            );
        },
    },
    {
        accessorKey: "deadline",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 lg:px-3"
                >
                    Deadline
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const deadline = new Date(row.getValue("deadline"));
            const isOverdue = deadline < new Date() && row.original.status === 'pending';
            
            return (
                <div className={cn(
                    "text-sm",
                    isOverdue ? "text-red-600 font-medium" : ""
                )}>
                    {deadline.toLocaleDateString()}
                    {isOverdue && <div className="text-xs">(Overdue)</div>}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const application = row.original;
            
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
                            <Link href={route('osas.applications.review', application.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Review Application
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            View Student Profile
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]
