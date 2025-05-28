import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

interface AdminStats {
  totalStudents: number;
  totalStaff: number;
  totalAdmins: number;
  pendingInvitations: number;
}

interface RecentLogin {
  id: string;
  name: string;
  email: string;
  role: string;
  timestamp: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  sentDate: string;
  status: string;
}

interface PageProps extends SharedData {
  stats: AdminStats;
  recentLogins: RecentLogin[];
  pendingInvitations: PendingInvitation[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
];

export default function AdminDashboard() {
  const { auth: pageAuth, stats, recentLogins, pendingInvitations } = usePage<PageProps>().props;
  const user = pageAuth.user;

  // Provide default values to prevent undefined errors
  const safeStats = stats || {
    totalStudents: 0,
    totalStaff: 0,
    totalAdmins: 0,
    pendingInvitations: 0
  };
  const safeRecentLogins = recentLogins || [];
  const safePendingInvitations = pendingInvitations || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Admin Dashboard | OSAS Connect</title>
        <meta name="description" content="OSAS Connect administrative dashboard for managing users, monitoring system health, and accessing administrative tools." />
      </Head>

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[#005a2d]/5 via-transparent to-[#008040]/5 dark:from-[#005a2d]/20 dark:via-transparent dark:to-[#008040]/20 border-none">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-[#005a2d] dark:text-[#23b14d]">Welcome, {user.first_name} {user.last_name}!</h1>
            <p className="text-muted-foreground">Administrator dashboard for system management</p>
          </CardContent>
        </Card>
        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[#005a2d]/5 dark:bg-[#005a2d]/20 border-none hover:bg-[#005a2d]/10 dark:hover:bg-[#005a2d]/30 transition-colors">
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-[#005a2d] dark:text-[#23b14d]">{safeStats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card className="bg-[#febd12]/5 dark:bg-[#febd12]/20 border-none hover:bg-[#febd12]/10 dark:hover:bg-[#febd12]/30 transition-colors">
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-[#febd12] dark:text-[#febd12]">{safeStats.totalStaff}</p>
              <p className="text-sm text-muted-foreground">OSAS Staff Members</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0070f3]/5 dark:bg-[#0070f3]/20 border-none hover:bg-[#0070f3]/10 dark:hover:bg-[#0070f3]/30 transition-colors">
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-[#0070f3] dark:text-[#0070f3]">{safeStats.totalAdmins}</p>
              <p className="text-sm text-muted-foreground">Admin Users</p>
            </CardContent>
          </Card>
          <Card className="bg-[#ff4081]/5 dark:bg-[#ff4081]/20 border-none hover:bg-[#ff4081]/10 dark:hover:bg-[#ff4081]/30 transition-colors">
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-[#ff4081] dark:text-[#ff4081]">{safeStats.pendingInvitations}</p>
              <p className="text-sm text-muted-foreground">Pending Invitations</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Pending Invitations */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Logins */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Logins</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeRecentLogins && safeRecentLogins.length > 0 ? (
                      safeRecentLogins.map((login) => (
                        <TableRow key={login.id}>
                          <TableCell className="font-medium">{login.name}</TableCell>
                          <TableCell>{login.role}</TableCell>
                          <TableCell>{format(new Date(login.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No recent logins found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Sent Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safePendingInvitations && safePendingInvitations.length > 0 ? (
                      safePendingInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell className="font-medium">{invitation.email}</TableCell>
                          <TableCell>{invitation.role}</TableCell>
                          <TableCell>{format(new Date(invitation.sentDate), 'MMM dd, yyyy')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No pending invitations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
