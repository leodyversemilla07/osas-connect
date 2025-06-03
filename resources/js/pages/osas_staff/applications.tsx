import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/application-management/data-table';
import { columns } from '@/components/application-management/columns';
import {
    Download,
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
                            <button className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1">
                                <Download className="h-4 w-4 mr-2 inline" />
                                Export
                            </button>
                            <button className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1">
                                <BarChart3 className="h-4 w-4 mr-2 inline" />
                                Reports
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Applications</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.total}</p>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                    </div>

                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Review</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.pending + statistics.under_review}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Requires immediate attention
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Approved</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.approved}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Successfully processed
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion Rate</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.completion_rate.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Applications processed
                                </p>
                            </div>
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
