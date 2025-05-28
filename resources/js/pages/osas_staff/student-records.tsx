import { Head } from '@inertiajs/react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-student-management/data-table';
import { columns } from '@/components/osas-student-management/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard', href: route('osas.dashboard')
    },
    {
        title: 'Students Records', href: route('osas.students')
    },
];

interface Props {
    students: {
        data: User[];
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

export default function StudentRecords({ students }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Student Records | OSAS Connect</title>
                <meta name="description" content="View and manage student information" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Student Records</h1>
                    <p className="text-base text-gray-500 dark:text-gray-400">View and manage student information</p>
                </div>

                <DataTable columns={columns} data={students.data} />
            </div>
        </AppLayout>
    );
}