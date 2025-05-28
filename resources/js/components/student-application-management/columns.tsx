import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    MoreHorizontal, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle
} from "lucide-react"
import { Link } from "@inertiajs/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Application type definition
export type Application = {
    id: number;
    scholarship_name: string;
    scholarship_type: string;
    status: string;
    submitted_at: string;
    updated_at: string;
    progress: number;
    amount: string;
    deadline: string;
    verifier_comments?: string;
    interview_schedule?: string;
}

// Status configuration
const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
        'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        'submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'under_verification': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'verified': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'under_evaluation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'approved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'incomplete': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
        'draft': 'Draft',
        'submitted': 'Submitted',
        'under_verification': 'Under Verification',
        'verified': 'Verified',
        'under_evaluation': 'Under Evaluation',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'incomplete': 'Incomplete Documents',
    };
    return labels[status] || status;
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'approved':
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'rejected':
            return <XCircle className="h-4 w-4 text-red-600" />;
        case 'incomplete':
            return <AlertCircle className="h-4 w-4 text-orange-600" />;
        default:
            return <Clock className="h-4 w-4 text-blue-600" />;
    }
};

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
    },    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <div className="font-medium text-base text-gray-900 dark:text-gray-100">
                #{row.getValue("id")}
            </div>
        ),
    },
    {
        accessorKey: "scholarship_name",
        header: "Scholarship",
        cell: ({ row }) => {
            return (
                <div className="space-y-1">
                    <div className="font-medium text-base text-gray-900 dark:text-gray-100">
                        {row.getValue("scholarship_name")}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {row.original.scholarship_type}
                    </div>
                </div>
            )
        },
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <Badge className={getStatusColor(status)}>
                        {getStatusLabel(status)}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-medium text-base text-gray-900 dark:text-gray-100">
                {row.getValue("amount")}
            </div>
        ),
    },
    {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-12 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {row.getValue("progress")}%
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${row.getValue("progress")}%` }}
                    ></div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "submitted_at",
        header: "Submitted",
        cell: ({ row }) => {
            const date = new Date(row.getValue("submitted_at"))
            return (
                <div className="text-base text-gray-900 dark:text-gray-100">
                    {date.toLocaleDateString()}
                </div>
            )
        },
    },    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const application = row.original;

            return (
                <div className="text-left">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem asChild>
                                <Link href={`/scholarships/applications/${application.id}`} className="text-base cursor-pointer">
                                    View
                                </Link>
                            </DropdownMenuItem>
                            {application.status === 'incomplete' && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/scholarships/applications/${application.id}/complete`} className="text-base cursor-pointer">
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {application.status === 'approved' && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-base cursor-pointer">
                                        Download Certificate
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
]
