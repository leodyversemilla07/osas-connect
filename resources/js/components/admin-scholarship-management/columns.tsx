import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Users,
    Clock
} from "lucide-react";

interface Scholarship {
    id: number;
    name: string;
    description: string;
    type: string;
    amount: number;
    status: 'open' | 'closed' | 'upcoming';
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

interface AdminColumnActions {
    onView: (scholarship: Scholarship) => void;
}

const getStatusColor = (status: 'open' | 'closed' | 'upcoming'): string => {
    const colors = {
        open: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        closed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        'Academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Student Assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Performing Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Economic Assistance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const createAdminColumns = (actions: AdminColumnActions): ColumnDef<Scholarship>[] => [
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
        cell: ({ row }) => (
            <Badge className={getTypeColor(row.getValue("type"))}>
                {row.getValue("type")}
            </Badge>
        ),
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
    },    {
        id: "actions",
        enableHiding: false,
        header: "ACTIONS",
        cell: ({ row }) => {
            const scholarship = row.original;

            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.onView(scholarship)}
                    className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                    <Eye className="mr-1 h-4 w-4" />
                    View Details
                </Button>
            );
        },
    },
];
