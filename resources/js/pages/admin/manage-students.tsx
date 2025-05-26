import { Head } from '@inertiajs/react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/student-management/data-table';
import { columns } from '@/components/student-management/columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Students',
    href: '/admin/students',
  },
];

interface StudentsPageProps {
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

export default function Students({ students }: StudentsPageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Manage Students</title>
        <meta name="description" content="Manage OSAS Connect student accounts" />
      </Head>
      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Students</h1>
          <p className="text-base text-gray-500 dark:text-gray-400">Manage student accounts</p>
        </div>

        <DataTable columns={columns} data={students.data} />
      </div>
    </AppLayout>
  );
}
