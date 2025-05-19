import { Link, router } from '@inertiajs/react';
import { type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface Invitation {
  id: number;
  email: string;
  role: string;
  position: string;
  department: string;
  created_at: string;
  expires_at: string;
  inviter: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface Props extends SharedData {
  invitations: {
    data: Invitation[];
    links: { label: string; url: string | null }[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Staff Invitations',
    href: '/admin/invitations',
  },
];

export default function Invitations({ invitations }: Props) {
  const handleRevoke = (id: number) => {
    if (confirm('Are you sure you want to revoke this invitation?')) {
      router.delete(route('admin.invitations.revoke', id));
    }
  };

  const handleResend = (id: number) => {
    if (confirm('Are you sure you want to resend this invitation?')) {
      router.post(route('admin.invitations.resend', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Staff Invitations</h2>
          <Link
            href={route('admin.invitations.create')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Invite Staff
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invited By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invitations.data.map((invitation) => (
                <tr key={invitation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invitation.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invitation.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invitation.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invitation.inviter.first_name} {invitation.inviter.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invitation.expires_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleResend(invitation.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Resend
                    </button>
                    <button
                      onClick={() => handleRevoke(invitation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            {invitations.links.map((link, i) => 
              link.url && (
                <Link
                  key={i}
                  href={link.url}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}