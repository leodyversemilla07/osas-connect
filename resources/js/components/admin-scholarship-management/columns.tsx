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
        open: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
        closed: 'bg-destructive/10 text-destructive border-destructive/20',
        upcoming: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground border-border';
};

const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        'academic_full': 'bg-chart-1/10 text-chart-1 border-chart-1/20',
        'academic_partial': 'bg-chart-1/10 text-chart-1 border-chart-1/20',
        'student_assistantship': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
        'performing_arts_full': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
        'performing_arts_partial': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
        'economic_assistance': 'bg-chart-5/10 text-chart-5 border-chart-5/20',
        'others': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
        // Legacy fallback for old format
        'Academic': 'bg-chart-1/10 text-chart-1 border-chart-1/20',
        'Student Assistantship': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
        'Performing Arts': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
        'Economic Assistance': 'bg-chart-5/10 text-chart-5 border-chart-5/20'
    };
    return colors[type] || 'bg-muted text-muted-foreground border-border';
};

const getTypeDisplayName = (type: string): string => {
    const typeNames: Record<string, string> = {
        'academic_full': 'Academic Scholarship (Full)',
        'academic_partial': 'Academic Scholarship (Partial)',
        'student_assistantship': 'Student Assistantship',
        'performing_arts_full': 'Performing Arts (Full)',
        'performing_arts_partial': 'Performing Arts (Partial)',
        'economic_assistance': 'Economic Assistance',
        'others': 'Others',
        // Legacy fallback for old format
        'Academic': 'Academic',
        'Student Assistantship': 'Student Assistantship',
        'Performing Arts': 'Performing Arts',
        'Economic Assistance': 'Economic Assistance'
    };
    return typeNames[type] || type;
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
        header: "SCHOLARSHIP NAME",        cell: ({ row }) => (
            <div className="max-w-[300px]">
                <div className="font-medium text-foreground">
                    {row.getValue("name")}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                    {row.original.description}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: "TYPE",        cell: ({ row }) => (
            <Badge className={`border ${getTypeColor(row.getValue("type"))}`}>
                {getTypeDisplayName(row.getValue("type"))}
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
        header: "STATUS",        cell: ({ row }) => (
            <Badge className={`border ${getStatusColor(row.getValue("status"))}`}>
                {(row.getValue("status") as string).charAt(0).toUpperCase() +
                    (row.getValue("status") as string).slice(1)}
            </Badge>
        ),
    },
    {
        accessorKey: "deadline",
        header: "DEADLINE",        cell: ({ row }) => {
            const deadline = row.getValue("deadline") as string | null;
            if (!deadline) return <span className="text-muted-foreground">No deadline</span>;

            const deadlineDate = new Date(deadline);
            const now = new Date();
            const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <div className="text-sm font-medium">
                            {deadlineDate.toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${daysLeft <= 7 && daysLeft > 0 ? 'text-destructive' : daysLeft <= 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Expired'}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "applications",
        header: "APPLICATIONS",        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                    <div className="font-medium">
                        {row.original.total_applications} total
                    </div>
                    <div className="text-muted-foreground">
                        {row.original.approved_applications} approved
                    </div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "remaining_slots",
        header: "SLOTS",        cell: ({ row }) => (
            <div className="text-sm">
                <div className="font-medium">
                    {row.original.remaining_slots} remaining
                </div>
                <div className="text-muted-foreground">
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

            return (                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.onView(scholarship)}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                    <Eye className="mr-1 h-4 w-4" />
                    View Details
                </Button>
            );
        },
    },
];
