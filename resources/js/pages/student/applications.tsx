import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/student-application-management/data-table';
import { columns } from '@/components/student-application-management/columns';
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
            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Applications</h1>
                            <p className="text-base text-gray-500 dark:text-gray-400">Track and manage your scholarship applications</p>
                        </div>
                        <Link
                            href={route('student.scholarships.index')}
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                        >
                            <Plus className="h-4 w-4 mr-2 inline" />
                            Apply for Scholarship
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Applications</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{stats?.total || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{stats?.pending || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Approved</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{stats?.approved || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Draft</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{stats?.draft || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable columns={columns} data={applications || []} />
            </div>
        </AppLayout>
    );
}
