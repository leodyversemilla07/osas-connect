import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/student-application-management/data-table';
import { columns } from '@/components/student-application-management/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Applications', href: '/student/applications' },
];

interface Application {
    id: number;
    scholarship_name: string;
    scholarship_type: string;
    status: string;
    submitted_at: string;
    updated_at: string;
    progress: number;
    amount: string;
    deadline: string;
    can_edit?: boolean;
    verifier_comments?: string;
    interview_schedule?: string;
}

interface MyApplicationsProps {
    applications: Application[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        draft: number;
    };
    filters?: {
        search?: string;
    };
}

export default function MyApplications({ applications, stats }: MyApplicationsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>My Applications</title>
                <meta name="description" content="Track and manage your scholarship applications" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6 lg:pb-8">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl">Applications</h1>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg">Track and manage your scholarship applications</p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button asChild className="min-h-[44px] px-4 lg:px-6">
                                <Link href={route('student.scholarships.index')}>
                                    <Plus className="h-4 w-4 mr-2 lg:h-5 lg:w-5" />
                                    Apply for Scholarship
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6 xl:gap-8">
                    <Card className="border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-3 lg:pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:text-base">
                                Total Applications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">{stats?.total || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-3 lg:pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:text-base">
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 lg:text-3xl">{stats?.pending || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-3 lg:pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:text-base">
                                Approved
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-2xl font-semibold text-green-600 dark:text-green-400 lg:text-3xl">{stats?.approved || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-3 lg:pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:text-base">
                                Draft
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 lg:text-3xl">{stats?.draft || 0}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications Table */}
                <div className="space-y-4 lg:space-y-6">
                    <DataTable columns={columns} data={applications || []} />
                </div>
            </div>
        </AppLayout>
    );
}
