import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
];

export default function AdminDashboard() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Admin Dashboard | OSAS Connect</title>
        <meta name="description" content="OSAS Connect administrative dashboard for managing users, monitoring system health, and accessing administrative tools." />
      </Head>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome to the OSAS Connect administrative dashboard. Here you can manage users, monitor system health, and access various administrative tools.</p>
        <p>Use the navigation menu to access different sections of the admin panel.</p>
      </div>

    </AppLayout>
  );
}
