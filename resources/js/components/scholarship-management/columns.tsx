import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ScholarshipType = 'Academic' | 'Student Assistantship' | 'Performing Arts' | 'Economic Assistance';

interface Scholarship {
    id: number;
    name: string;
    type: ScholarshipType;
    amount: string;
    stipendSchedule: 'monthly' | 'semestral';
    deadline: string;
    description: string;
    status: 'open' | 'closed';
}

const getTypeColor = (type: ScholarshipType): string => {
    const colors: Record<ScholarshipType, string> = {
        'Academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Student Assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Performing Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Economic Assistance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

const getStatusColor = (status: 'open' | 'closed'): string => {
    return status === 'open' 
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
};

export const createColumns = (onViewDetails?: (scholarship: Scholarship) => void): ColumnDef<Scholarship>[] => [
    {
        accessorKey: "name",
        header: "Scholarship Name",
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
        header: "Type",
        cell: ({ row }) => (
            <Badge className={getTypeColor(row.getValue("type"))}>
                {row.getValue("type")}
            </Badge>
        ),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.getValue("amount")}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {row.original.stipendSchedule}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "deadline",
        header: "Deadline",
        cell: ({ row }) => {
            const deadline = new Date(row.getValue("deadline"));
            const now = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                        <div className="text-sm font-medium">
                            {deadline.toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${daysLeft <= 7 ? 'text-red-500' : 'text-gray-500'}`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.getValue("status"))}>
                {row.getValue("status") === 'open' ? 'Open' : 'Closed'}
            </Badge>
        ),
    },    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
                            onClick={() => onViewDetails?.(row.original)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
