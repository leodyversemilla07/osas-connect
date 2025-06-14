import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/student-management/data-table';
import { columns } from '@/components/student-management/columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: route('admin.dashboard'),
  },
  {
    title: 'Students',
    href: route('admin.students'),
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
        <title>Manage Students | OSAS Connect</title>
        <meta name="description" content="Manage OSAS Connect student accounts" />
      </Head>
      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Manage Students</CardTitle>
                <CardDescription className="text-base mt-2">
                  Manage student accounts and academic information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Student Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  All Students
                </CardTitle>
                <CardDescription>
                  Complete list of registered students • {students.data.length} of {students.total} total
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={students.data}
              searchPlaceholder="Search by student name, ID, or email..."
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
