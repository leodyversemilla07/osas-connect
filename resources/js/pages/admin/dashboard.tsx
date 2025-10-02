import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
                <meta
                    name="description"
                    content="OSAS Connect administrative dashboard for managing users, monitoring system health, and accessing administrative tools."
                />
            </Head>

            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        Welcome to the OSAS Connect administrative dashboard. Here you can manage users, monitor system health, and access various
                        administrative tools.
                    </p>
                    <p className="text-muted-foreground">Use the navigation menu to access different sections of the admin panel.</p>
                </div>
            </div>
        </AppLayout>
    );
}
