import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Users,
    Clock
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Scholarship {
    id: number;
    name: string;
    description: string;
    type: string;
    amount: number;
    status: 'active' | 'inactive' | 'upcoming' | 'draft';
    deadline: string | null;
    slots_available: number;
    total_applications: number;
    approved_applications: number;
    remaining_slots: number;
    criteria: string[] | null;
    required_documents: string[] | null;
    funding_source: string;
    created_at: string;
    updated_at: string;
}

interface ColumnActions {
    onEdit: (scholarship: Scholarship) => void;
    onView: (scholarship: Scholarship) => void;
    onDelete: (scholarship: Scholarship) => void;
}

const getStatusColor = (status: 'active' | 'inactive' | 'upcoming' | 'draft'): string => {
    const colors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

// Shorter mappings for badges and table display
const SCHOLARSHIP_TYPES = {
    'academic_full': 'Academic (Full)',
    'academic_partial': 'Academic (Partial)',
    'student_assistantship': 'Student Assistantship',
    'performing_arts_full': 'Performing Arts (Full)',
    'performing_arts_partial': 'Performing Arts (Partial)',
    'economic_assistance': 'Economic Assistance',
    'others': 'Custom Type',
} as const;

const getScholarshipTypeDisplay = (type: string): string => {
    return SCHOLARSHIP_TYPES[type as keyof typeof SCHOLARSHIP_TYPES] || type;
};

const getTypeColor = (type: string): string => {
    const typeCategory = type.includes('academic') ? 'academic' :
        type.includes('student_assistantship') ? 'assistantship' :
            type.includes('performing_arts') ? 'arts' :
                type.includes('economic') ? 'economic' : 'other';

    const colors: Record<string, string> = {
        'academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'economic': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    };
    return colors[typeCategory];
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Export the function for use in other components
export { getScholarshipTypeDisplay };

export const createColumns = (actions: ColumnActions): ColumnDef<Scholarship>[] => [
    {
        accessorKey: "name",
        header: "SCHOLARSHIP NAME",
        cell: ({ row }) => (
            <div className="max-w-[300px]">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {row.getValue("name")}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {row.original.description}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: "TYPE",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const displayType = getScholarshipTypeDisplay(type);
            return (
                <Badge className={getTypeColor(type)}>
                    {displayType}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ row }) => (
            <div className="font-medium">
                {formatCurrency(row.getValue("amount"))}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.getValue("status"))}>
                {(row.getValue("status") as string).charAt(0).toUpperCase() +
                    (row.getValue("status") as string).slice(1)}
            </Badge>
        ),
    },
    {
        accessorKey: "deadline",
        header: "DEADLINE",
        cell: ({ row }) => {
            const deadline = row.getValue("deadline") as string | null;
            if (!deadline) return <span className="text-gray-400">No deadline</span>;

            const deadlineDate = new Date(deadline);
            const now = new Date();
            const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                        <div className="text-sm font-medium">
                            {deadlineDate.toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${daysLeft <= 7 && daysLeft > 0 ? 'text-red-500' : daysLeft <= 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Expired'}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "applications",
        header: "APPLICATIONS",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <div className="text-sm">
                    <div className="font-medium">
                        {row.original.total_applications} total
                    </div>
                    <div className="text-gray-500">
                        {row.original.approved_applications} approved
                    </div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "remaining_slots",
        header: "SLOTS",
        cell: ({ row }) => (
            <div className="text-sm">
                <div className="font-medium">
                    {row.original.remaining_slots} remaining
                </div>
                <div className="text-gray-500">
                    of {row.original.slots_available} total
                </div>
            </div>
        ),
    }, {
        id: "actions",
        enableHiding: false,
        header: "ACTIONS",
        cell: ({ row }) => {
            const scholarship = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => actions.onView(scholarship)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => actions.onEdit(scholarship)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Scholarship
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => actions.onDelete(scholarship)}  // Add this line
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
