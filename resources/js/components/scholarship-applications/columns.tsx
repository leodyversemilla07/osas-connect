import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, FileText, MoreHorizontal, Users } from 'lucide-react';

export interface Application {
    id: number;
    student: {
        id: number;
        name: string;
        email: string;
        student_id: string;
        course: string;
        year_level: string;
    };
    scholarship: {
        id: number;
        name: string;
        type: string;
        amount: number;
    };
    status: string;
    applied_at: string;
    approved_at: string | null;
    rejected_at: string | null;
    amount_received: number | null;
    reviewer: {
        name: string;
        email: string;
    } | null;
    created_at: string;
    updated_at: string;
}

const statusColors = {
    submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    under_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    verified: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    under_evaluation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    on_hold: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatScholarshipType = (type: string) => {
    const typeMap: { [key: string]: string } = {
        performing_arts_full: 'Performing Arts (Full)',
        performing_arts_partial: 'Performing Arts (Partial)',
        need_based: 'Need-Based',
        academic_excellence: 'Academic Excellence',
        sports_scholarship: 'Sports Scholarship',
        leadership_award: 'Leadership Award',
    };

    if (typeMap[type]) {
        return typeMap[type];
    }

    return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export const columns: ColumnDef<Application>[] = [
    {
        accessorKey: 'student_name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const application = row.original;
            return (
                <div>
                    <div className="text-foreground font-medium">{application.student.name}</div>
                    <div className="text-muted-foreground text-sm">
                        {application.student.student_id} • {application.student.course}
                    </div>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const application = row.original;
            const searchValue = value.toLowerCase();
            return (
                application.student.name.toLowerCase().includes(searchValue) ||
                application.student.student_id.toLowerCase().includes(searchValue) ||
                application.student.email.toLowerCase().includes(searchValue)
            );
        },
    },
    {
        accessorKey: 'scholarship',
        header: 'Scholarship',
        cell: ({ row }) => {
            const application = row.original;
            return (
                <div>
                    <div className="text-foreground font-medium">{application.scholarship.name}</div>
                    <div className="text-muted-foreground text-sm">
                        {formatScholarshipType(application.scholarship.type)} • {formatCurrency(application.scholarship.amount)}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.submitted}>{getStatusText(status)}</Badge>;
        },
    },
    {
        accessorKey: 'applied_at',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    Applied Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.getValue('applied_at') as string;
            return <div>{formatDate(date)}</div>;
        },
    },
    {
        accessorKey: 'amount_received',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = row.getValue('amount_received') as number | null;
            return <div>{amount ? formatCurrency(amount) : '—'}</div>;
        },
    },
    {
        accessorKey: 'reviewer',
        header: 'Reviewer',
        cell: ({ row }) => {
            const application = row.original;
            return (
                <div>
                    {application.reviewer ? (
                        <div>
                            <div className="text-foreground font-medium">{application.reviewer.name}</div>
                            <div className="text-muted-foreground text-xs">{application.reviewer.email}</div>
                        </div>
                    ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const application = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>{' '}
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.visit(`/admin/scholarship-applications/${application.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.visit(`/admin/students/${application.student.id}`)}>
                            <Users className="mr-2 h-4 w-4" />
                            View Student
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.visit(`/admin/scholarships/${application.scholarship.id}`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Scholarship
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
