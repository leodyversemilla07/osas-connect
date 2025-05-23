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
    // Add other pagination properties if needed
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

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header Section */}
        <div className="flex items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manage Students</h2>
            <p className="text-muted-foreground">Manage student accounts</p>
          </div>
        </div>

        <DataTable columns={columns} data={students.data} />
      </div>
    </AppLayout>
  );
}