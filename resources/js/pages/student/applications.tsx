import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/student-application-management/data-table';
import { columns } from '@/components/student-application-management/columns';
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
    verifier_comments?: string;
    interview_schedule?: string;
}

interface MyApplicationsProps {
    applications: {
        data: Application[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    filters?: {
        search?: string;
    };
}

export default function MyApplications({ applications }: MyApplicationsProps) {
    // Sample data for demonstration
    const sampleApplications: Application[] = applications?.data?.length > 0 ? applications.data : [
        {
            id: 1,
            scholarship_name: 'Academic Scholarship (Full)',
            scholarship_type: 'Academic',
            status: 'under_evaluation',
            submitted_at: '2025-05-15',
            updated_at: '2025-05-20',
            progress: 80,
            amount: '₱500/month',
            deadline: '2025-06-30',
            verifier_comments: 'All documents verified successfully.',
        },
        {
            id: 2,
            scholarship_name: 'Economic Assistance Program',
            scholarship_type: 'Economic Assistance',
            status: 'approved',
            submitted_at: '2025-04-20',
            updated_at: '2025-05-10',
            progress: 100,
            amount: '₱400/month',
            deadline: '2025-05-30',
        },
        {
            id: 3,
            scholarship_name: 'Student Assistantship Program',
            scholarship_type: 'Student Assistantship',
            status: 'incomplete',
            submitted_at: '2025-05-25',
            updated_at: '2025-05-26',
            progress: 30,
            amount: 'Based on hours',
            deadline: '2025-06-15',
            verifier_comments: 'Missing birth certificate. Please upload a PSA-issued copy.',
        }
    ];

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
                        <Button asChild>
                            <Link href="/scholarships/available">
                                <Plus className="h-4 w-4 mr-2" />
                                Apply for Scholarship
                            </Link>
                        </Button>
                    </div>
                </div>

                <DataTable columns={columns} data={sampleApplications} />
            </div>
        </AppLayout>
    );
}
