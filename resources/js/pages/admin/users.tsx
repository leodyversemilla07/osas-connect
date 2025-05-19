import { Head, Link } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/user-management/data-table';
import { columns } from '@/components/user-management/columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
];

interface UsersPageProps {
  users: {
    data: User[];
    // Add other pagination properties if needed
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export default function Users({ users }: UsersPageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Users | OSAS Connect</title>
        <meta name="description" content="Manage OSAS Connect user accounts and permissions" />
      </Head>

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button asChild>
            <Link href={route('admin.invite')} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Staff
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={users.data} />
      </div>
    </AppLayout>
  );
}