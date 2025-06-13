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
    Calendar,
    CheckCircle,
    XCircle,
    ArrowUpDown,
    User,
    ShieldCheck,
    AlertTriangle,
    GraduationCap,
    HelpCircle,
    FileText
} from "lucide-react"
import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"

// Updated Application type definition to match backend
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
    // Updated to match actual backend status values (aligned with ScholarshipApplication model)
    status: 'draft' | 'submitted' | 'under_verification' | 'incomplete' | 'verified' | 'under_evaluation' | 'approved' | 'rejected' | 'end';
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

// Updated comprehensive status configuration (removed extra statuses)
const statusConfig = {
    // Backend status values (matching ScholarshipApplication model)
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: FileText,
    },
    submitted: {
        label: 'Submitted',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        icon: CheckCircle,
    },
    under_verification: {
        label: 'Under Verification',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        icon: Eye,
    },
    verified: {
        label: 'Verified',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: ShieldCheck,
    },
    under_evaluation: {
        label: 'Under Evaluation',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        icon: GraduationCap,
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
    incomplete: {
        label: 'Incomplete',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        icon: AlertTriangle,
    },
    end: {
        label: 'Completed',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: CheckCircle,
    },
} as const;

// Scholarship type mappings for better display
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

const getScholarshipTypeColor = (type: string): string => {
    const colors = {
        'academic_full': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'academic_partial': 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        'student_assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'performing_arts_full': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'performing_arts_partial': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
        'economic_assistance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        'others': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
};

// Format currency amount for display
const formatCurrency = (amount: string): string => {
    // Remove any existing currency symbols and clean the string
    const cleanAmount = amount.replace(/[₱$,]/g, '');
    const numericAmount = parseFloat(cleanAmount);

    // Return formatted currency if it's a valid number
    if (!isNaN(numericAmount)) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numericAmount);
    }

    // Return original amount if it's not a valid number (e.g., "Full Tuition", "Variable")
    return amount;
};

// Safe status component with fallback
const StatusCell = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig];

    // Fallback configuration for unknown statuses
    const fallbackConfig = {
        label: status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : 'Unknown',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
        icon: HelpCircle,
    };

    const finalConfig = config || fallbackConfig;
    const StatusIcon = finalConfig.icon;

    return (
        <Badge className={cn(finalConfig.color)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {finalConfig.label}
        </Badge>
    );
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
        id: "student",
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
            const student = row.original.student;
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
        accessorFn: (row) => {
            // Create a searchable string for the student column
            const student = row.student;
            return `${student.name} ${student.student_id} ${student.email} ${student.course} ${student.year_level}`;
        },
    },
    {
        id: "scholarship",
        header: "Scholarship",
        cell: ({ row }) => {
            const scholarship = row.original.scholarship;
            return (
                <div>
                    <div className="font-medium">{scholarship.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn(getScholarshipTypeColor(scholarship.type))}>
                            {getScholarshipTypeDisplay(scholarship.type)}
                        </Badge>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(scholarship.amount)}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "status",
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
            const status = row.original.status;
            return <StatusCell status={status} />;
        },
        accessorFn: (row) => row.status,
    },
    {
        id: "priority",
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
            const priority = row.original.priority;
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
        accessorFn: (row) => row.priority,
    },
    {
        id: "documents",
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
        id: "submitted_at",
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
            const date = new Date(row.original.submitted_at);
            return (
                <div className="text-sm">
                    {date.toLocaleDateString()}
                </div>
            );
        },
        accessorFn: (row) => row.submitted_at,
    },
    {
        id: "deadline",
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
            const deadlineValue = row.original.deadline;

            // Handle null/undefined deadline
            if (!deadlineValue) {
                return (
                    <div className="text-sm text-muted-foreground">
                        No deadline
                    </div>
                );
            }

            const deadline = new Date(deadlineValue);
            const isOverdue = deadline < new Date() && ['submitted', 'under_verification'].includes(row.original.status);

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
        accessorFn: (row) => row.deadline,
    },
    {
        id: "actions",
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('osas.applications.interview', application.id)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Interview
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('osas.students.details', application.student.id)}>
                                <User className="h-4 w-4 mr-2" />
                                View Student Profile
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]