import { Head } from '@inertiajs/react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/staff-management/data-table';
import { columns } from '@/components/staff-management/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import InviteStaffDialog from '@/components/staff-management/invite-staff-dialog';
import ErrorBoundary from '@/components/error-boundary';

// Extended type to handle both staff and invitations
type StaffTableEntry = User & {
  type: 'staff' | 'invitation'
  status: 'active' | 'pending' | 'expired' | 'accepted'
  expires_at?: string
  invitation_id?: number
  inviter?: {
    id: number
    first_name: string
    last_name: string
  }
}

interface Props {
  staff?: {
    data: StaffTableEntry[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: route('admin.dashboard'),
  },
  {
    title: 'Staff',
    href: route('admin.staff'),
  },
];

export default function Staff({ staff = { data: [], current_page: 1, from: 0, last_page: 1, per_page: 10, to: 0, total: 0 } }: Props) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Process the staff data (backend already handles proper filtering)
  const processedStaffData = useMemo(() => {
    return staff.data || [];
  }, [staff.data]);

  return (
    <ErrorBoundary>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head>
          <title>Manage Staff | OSAS Connect</title>
          <meta name="description" content="Manage OSAS Connect staff members" />
        </Head>
        <div className="flex h-full flex-1 flex-col space-y-6 p-6">
          {/* Header Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">Manage Staff</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Manage staff members and invitations
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setInviteDialogOpen(true)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Staff
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Staff Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    All Staff
                  </CardTitle>
                  <CardDescription>
                    Complete list of staff members and pending invitations • Showing {staff.from || 0} to {staff.to || 0} of {staff.total} total
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={processedStaffData}
                searchPlaceholder="Search by staff name, email, or role..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Invite Staff Dialog */}
        <InviteStaffDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
        />

      </AppLayout>
    </ErrorBoundary>
  );
}
