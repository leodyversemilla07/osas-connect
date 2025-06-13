import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/application-management/data-table';
import { columns } from '@/components/application-management/columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle
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

interface ApplicationsPageProps {
    applications: Application[];
    statistics: {
        total: number;
        submitted: number;
        under_verification: number;
        verified: number;
        under_evaluation: number;
        approved: number;
        rejected: number;
        incomplete: number;
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

    const trend = calculateTrend();

    const urgentApplications = statistics.submitted + statistics.under_verification + statistics.incomplete;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Application Management" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl">Application Management</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Review and manage scholarship applications from students
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{urgentApplications}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires immediate attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
                            <p className="text-xs text-muted-foreground">
                                Successfully processed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.completion_rate.toFixed(1)}%</div>
                            <Progress value={statistics.completion_rate} className="mt-2" />
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Application Management */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    All Applications
                                </CardTitle>
                                <CardDescription>
                                    Complete list of scholarship applications • {applications.length} of {statistics.total} total
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {statistics.submitted} Submitted
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {statistics.under_verification} Under Verification
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={applications}
                            searchPlaceholder="Search by student name, ID, or email..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
