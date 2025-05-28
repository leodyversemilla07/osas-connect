import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/application-management/data-table';
import { columns } from '@/components/application-management/columns';
import { Button } from '@/components/ui/button';
import {
    Download,
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    BarChart3
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Application Management',
        href: route('osas.applications'),
    },
];

// Types
interface Application {
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

interface ApplicationsPageProps {
    applications: {
        data: Application[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    statistics: {
        total: number;
        pending: number;
        under_review: number;
        approved: number;
        rejected: number;
        on_hold: number;
        this_month_count: number;
        last_month_count: number;
        completion_rate: number;
    };
    filters: {
        search?: string;
        status?: string;
        scholarship_type?: string;
        priority?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

// Status configuration
export default function ApplicationsPage({ applications, statistics }: ApplicationsPageProps) {
    const calculateTrend = () => {
        if (statistics.last_month_count === 0) return { value: 0, direction: 'neutral' };
        const change = ((statistics.this_month_count - statistics.last_month_count) / statistics.last_month_count) * 100;
        return {
            value: Math.abs(change),
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    };

    const trend = calculateTrend(); return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Application Management" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Application Management</h1>
                            <p className="text-base text-gray-500 dark:text-gray-400">Review and manage scholarship applications from students</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Reports
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Total Applications</h3>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                {trend.direction === 'up' ? (
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                                ) : trend.direction === 'down' ? (
                                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                                ) : null}
                                {trend.direction !== 'neutral' && (
                                    <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
                                        {trend.value.toFixed(1)}%
                                    </span>
                                )}
                                <span className="ml-1">from last month</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Pending Review</h3>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.pending + statistics.under_review}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires immediate attention
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Approved</h3>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.approved}</div>
                            <p className="text-xs text-muted-foreground">
                                Successfully processed
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Completion Rate</h3>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.completion_rate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">
                                Applications processed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={applications.data}
                />
            </div>
        </AppLayout>
    );
}
