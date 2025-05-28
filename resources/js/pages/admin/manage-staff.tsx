import { Head } from '@inertiajs/react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/staff-management/data-table';
import { columns } from '@/components/staff-management/columns';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
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
    href: '/admin/dashboard',
  },
  {
    title: 'Staff',
    href: '/admin/staff',
  },
];

export default function Staff({ staff = { data: [], current_page: 1, from: 0, last_page: 1, per_page: 10, to: 0, total: 0 } }: Props) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Process the staff data to combine staff members with their invitations
  const processedStaffData = useMemo(() => {
    if (!staff.data) return [];

    // Separate staff and invitations
    const staffMembers = staff.data.filter(item => item.type === 'staff');
    const invitations = staff.data.filter(item => item.type === 'invitation');

    // Find invitations that don't have corresponding staff members
    const pendingInvitations = invitations.filter(invitation => {
      return !staffMembers.some(staffMember =>
        staffMember.email?.toLowerCase() === invitation.email?.toLowerCase()
      );
    });

    // Combine: keep all staff members, only add invitations that don't have corresponding staff
    return [...staffMembers, ...pendingInvitations];
  }, [staff.data]);

  return (
    <ErrorBoundary>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head>
          <title>Manage Staff</title>
          <meta name="description" content="Manage OSAS Connect staff members" />
        </Head>
        <div className="flex h-full flex-1 flex-col space-y-6 p-6">
          {/* Header Section */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Staff</h1>
                <p className="text-base text-gray-500 dark:text-gray-400">Manage staff members</p>
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
          </div>

          <DataTable columns={columns} data={processedStaffData} />
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
