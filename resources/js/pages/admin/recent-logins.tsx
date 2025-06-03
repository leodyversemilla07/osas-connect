import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Users, Clock } from 'lucide-react';

interface ProfileInfo {
  student_id?: string;
  course?: string;
  year_level?: string;
  staff_id?: string;
  department?: string;
}

interface RecentLogin {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  last_activity: string;
  is_active: boolean;
  profile_info: ProfileInfo | null;
}

interface PageProps {
  recentLogins: RecentLogin[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Recent Activity',
    href: '/admin/recent-logins',
  },
];

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'osas staff':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'student':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function RecentLogins({ recentLogins }: PageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Recent Activity - Admin</title>
        <meta name="description" content="View recent user login activity across the system" />
      </Head>

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Monitor recent user login activity and system access
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              Last 50 activities
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentLogins.length}</div>
              <p className="text-xs text-muted-foreground">Recent activities tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {recentLogins.filter(login => login.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {recentLogins.filter(login => {
                  const activityTime = new Date(login.last_activity);
                  const now = new Date();
                  const hoursDiff = (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);
                  return hoursDiff <= 24;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>
        {/* Recent Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentLogins.length > 0 ? (
              <div className="space-y-4">
                <div className="border-b border-gray-100 dark:border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                        <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</TableHead>
                        <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</TableHead>
                        <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</TableHead>
                        <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Activity</TableHead>
                        <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentLogins.map((login) => (
                        <TableRow
                          key={login.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/10"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                                <AvatarImage src={login.avatar || ''} alt={login.name} />
                                <AvatarFallback className="text-xs bg-primary/10">
                                  {getInitials(login.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-gray-100">{login.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {login.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={`px-2.5 py-0.5 ${getRoleColor(login.role)}`}>
                              {login.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            {login.profile_info && (
                              <div className="text-sm space-y-1">
                                {login.profile_info.student_id && (
                                  <div>
                                    <span className="font-medium">ID:</span> {login.profile_info.student_id}
                                  </div>
                                )}
                                {login.profile_info.course && (
                                  <div>
                                    <span className="font-medium">Course:</span> {login.profile_info.course}
                                  </div>
                                )}
                                {login.profile_info.year_level && (
                                  <div>
                                    <span className="font-medium">Year:</span> {login.profile_info.year_level}
                                  </div>
                                )}
                                {login.profile_info.staff_id && (
                                  <div>
                                    <span className="font-medium">Staff ID:</span> {login.profile_info.staff_id}
                                  </div>
                                )}
                                {login.profile_info.department && (
                                  <div>
                                    <span className="font-medium">Dept:</span> {login.profile_info.department}
                                  </div>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatDistanceToNow(new Date(login.last_activity), { addSuffix: true })}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(login.last_activity).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant={login.is_active ? "default" : "secondary"}
                              className={`px-2.5 py-0.5 ${login.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                }`}
                            >
                              {login.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No recent activity
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No user activity has been recorded yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
