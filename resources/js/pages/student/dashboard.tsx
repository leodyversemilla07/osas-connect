import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/student/dashboard',
  },
];

export default function StudentDashboard() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Dashboard" />
      <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:space-y-8 sm:p-6 lg:space-y-10 lg:p-8">
        <div className="pb-6 lg:pb-8">
          {/* Header skeleton */}
          <Skeleton className="w-1/3 h-8 mb-6" />
          {/* Card skeletons */}
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-24 w-1/4" />
            <Skeleton className="h-24 w-1/4" />
            <Skeleton className="h-24 w-1/4" />
            <Skeleton className="h-24 w-1/4" />
          </div>
          {/* List/table skeletons */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
