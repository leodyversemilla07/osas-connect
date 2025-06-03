import { Head, usePage, Link } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
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
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users, School, BookOpen, ClipboardCheck,
  DollarSign, Clock, BarChart4,
  FileText, UserPlus, User, FileCheck, PieChart,
  Layers, ChevronRight
} from 'lucide-react';

interface AdminStats {
  totalStudents: number;
  totalStaff: number;
  totalAdmins: number;
  pendingInvitations: number;
  totalScholarships: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalFundsAllocated: number;
  applicationSuccessRate: number;
  documentsNeedingVerification: number;
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

interface RecentApplication {
  id: string;
  student: string;
  scholarshipName: string;
  status: string;
  submittedDate: string;
}

interface PendingTask {
  id: string;
  type: string;
  description: string;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
}

interface PageProps extends SharedData {
  stats: AdminStats;
  recentLogins: RecentLogin[];
  pendingInvitations: PendingInvitation[];
  recentApplications: RecentApplication[];
  pendingTasks: PendingTask[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
];

export default function AdminDashboard() {
  const { auth: pageAuth, stats, recentLogins, pendingInvitations, recentApplications, pendingTasks } = usePage<PageProps>().props;
  const user = pageAuth.user;

  // Provide default values to prevent undefined errors
  const safeStats = stats || {
    totalStudents: 0,
    totalStaff: 0,
    totalAdmins: 0,
    pendingInvitations: 0,
    totalScholarships: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalFundsAllocated: 0,
    applicationSuccessRate: 0,
    documentsNeedingVerification: 0
  };
  const safeRecentLogins = recentLogins || [];
  const safePendingInvitations = pendingInvitations || [];
  const safeRecentApplications = recentApplications || [];
  const safePendingTasks = pendingTasks || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Admin Dashboard | OSAS Connect</title>
        <meta name="description" content="OSAS Connect administrative dashboard for managing users, monitoring system health, and accessing administrative tools." />
      </Head>

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[#005a2d]/5 via-transparent to-[#008040]/5 dark:from-[#005a2d]/20 dark:via-transparent dark:to-[#008040]/20 border-none">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-[#005a2d] dark:text-[#23b14d]">Welcome, {user.first_name} {user.last_name}!</h1>
            <p className="text-muted-foreground">Administrator dashboard for scholarship management system</p>
          </CardContent>
        </Card>

        {/* Main Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#005a2d]/5 dark:bg-[#005a2d]/20 border-none hover:bg-[#005a2d]/10 dark:hover:bg-[#005a2d]/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-[#005a2d] dark:text-[#23b14d]">{safeStats.totalStudents}</p>
                <div className="rounded-full bg-[#005a2d]/10 p-2 dark:bg-[#005a2d]/30">
                  <Users className="h-5 w-5 text-[#005a2d] dark:text-[#23b14d]" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>

          <Card className="bg-[#febd12]/5 dark:bg-[#febd12]/20 border-none hover:bg-[#febd12]/10 dark:hover:bg-[#febd12]/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-[#febd12] dark:text-[#febd12]">{safeStats.totalScholarships}</p>
                <div className="rounded-full bg-[#febd12]/10 p-2 dark:bg-[#febd12]/30">
                  <BookOpen className="h-5 w-5 text-[#febd12] dark:text-[#febd12]" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total Scholarships</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0070f3]/5 dark:bg-[#0070f3]/20 border-none hover:bg-[#0070f3]/10 dark:hover:bg-[#0070f3]/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-[#0070f3] dark:text-[#0070f3]">{safeStats.totalApplications}</p>
                <div className="rounded-full bg-[#0070f3]/10 p-2 dark:bg-[#0070f3]/30">
                  <ClipboardCheck className="h-5 w-5 text-[#0070f3] dark:text-[#0070f3]" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>

          <Card className="bg-[#ff4081]/5 dark:bg-[#ff4081]/20 border-none hover:bg-[#ff4081]/10 dark:hover:bg-[#ff4081]/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-[#ff4081] dark:text-[#ff4081]">{safeStats.pendingInvitations}</p>
                <div className="rounded-full bg-[#ff4081]/10 p-2 dark:bg-[#ff4081]/30">
                  <UserPlus className="h-5 w-5 text-[#ff4081] dark:text-[#ff4081]" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Pending Invitations</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Status Overview */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#0070f3]" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">{safeStats.pendingApplications || 0}</span>
                  </div>
                  <Progress
                    value={safeStats.totalApplications ? (safeStats.pendingApplications / safeStats.totalApplications) * 100 : 0}
                    className="h-2 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Approved</span>
                    <span className="font-medium">{safeStats.approvedApplications || 0}</span>
                  </div>
                  <Progress
                    value={safeStats.totalApplications ? (safeStats.approvedApplications / safeStats.totalApplications) * 100 : 0}
                    className="h-2 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rejected</span>
                    <span className="font-medium">{safeStats.rejectedApplications || 0}</span>
                  </div>
                  <Progress
                    value={safeStats.totalApplications ? (safeStats.rejectedApplications / safeStats.totalApplications) * 100 : 0}
                    className="h-2 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Scholarship Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full justify-between">
                <div className="mb-4">
                  <div className="text-3xl font-bold">₱{(safeStats.totalFundsAllocated || 0).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total funds allocated</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{safeStats.applicationSuccessRate || 0}%</span>
                  </div>
                  <Progress
                    value={safeStats.applicationSuccessRate || 0}
                    className="h-2 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Applications for Review</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-100">
                    {safeStats.pendingApplications || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Documents to Verify</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100">
                    {safeStats.documentsNeedingVerification || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Invitations Pending</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-100">
                    {safeStats.pendingInvitations || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.students')}>
              <Users className="h-6 w-6 text-[#005a2d] dark:text-[#23b14d]" />
              <span className="text-sm text-center">Manage Students</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.scholarships')}>
              <School className="h-6 w-6 text-[#febd12] dark:text-[#febd12]" />
              <span className="text-sm text-center">Manage Scholarships</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.scholarship.applications')}>
              <ClipboardCheck className="h-6 w-6 text-[#0070f3] dark:text-[#0070f3]" />
              <span className="text-sm text-center">Review Applications</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.scholarships')}>
              <BarChart4 className="h-6 w-6 text-[#ff4081] dark:text-[#ff4081]" />
              <span className="text-sm text-center">Scholarship Analytics</span>
            </Link>
          </Button>
        </div>

        {/* Second row of Quick Actions */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.cms.index')}>
              <FileText className="h-6 w-6 text-[#8b5cf6] dark:text-[#8b5cf6]" />
              <span className="text-sm text-center">Manage Pages</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.staff')}>
              <UserPlus className="h-6 w-6 text-[#059669] dark:text-[#059669]" />
              <span className="text-sm text-center">Manage Staff</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.recent-logins')}>
              <Clock className="h-6 w-6 text-[#0ea5e9] dark:text-[#0ea5e9]" />
              <span className="text-sm text-center">Recent Activity</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
            asChild
          >
            <Link href={route('admin.scholarships')}>
              <Layers className="h-6 w-6 text-[#f59e0b] dark:text-[#f59e0b]" />
              <span className="text-sm text-center">System Reports</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activity and Applications */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Recent Logins */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#005a2d]" />
                    Recent Logins
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Latest user activity</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800" asChild>
                  <Link href={route('admin.recent-logins')}>
                    <span className="hidden sm:inline">View all</span>
                    <span className="sm:hidden">All</span>
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead className="min-w-[80px]">Role</TableHead>
                      <TableHead className="min-w-[100px]">Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeRecentLogins && safeRecentLogins.length > 0 ? (
                      safeRecentLogins.map((login) => (
                        <TableRow key={login.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{login.name}</span>
                              <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{login.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                login.role.toLowerCase() === 'admin'
                                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                  : login.role.toLowerCase() === 'staff'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                    : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                              }
                            >
                              {login.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {format(new Date(login.timestamp), 'MMM dd, HH:mm')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <User className="h-8 w-8 mb-2 opacity-50" />
                            <p>No recent logins found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#0070f3]" />
                    Recent Applications
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Latest scholarship applications</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800" asChild>
                  <Link href={route('admin.scholarship.applications')}>
                    <span className="hidden sm:inline">View all</span>
                    <span className="sm:hidden">All</span>
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Student</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeRecentApplications && safeRecentApplications.length > 0 ? (
                      safeRecentApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{application.student}</span>
                              <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{application.scholarshipName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                application.status.toLowerCase() === 'approved'
                                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                  : application.status.toLowerCase() === 'rejected'
                                    ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                              }
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {format(new Date(application.submittedDate), 'MMM dd, yyyy')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="h-8 w-8 mb-2 opacity-50" />
                            <p>No recent applications found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Invitations and Tasks */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Pending Invitations */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-[#ff4081]" />
                    Pending Invitations
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Staff invitations awaiting response</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800" asChild>
                  <Link href={route('admin.staff')}>
                    <span className="hidden sm:inline">Manage</span>
                    <span className="sm:hidden">Manage</span>
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Email</TableHead>
                      <TableHead className="min-w-[80px]">Role</TableHead>
                      <TableHead className="min-w-[100px]">Sent Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safePendingInvitations && safePendingInvitations.length > 0 ? (
                      safePendingInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium truncate max-w-[120px] sm:max-w-none">{invitation.email}</span>
                              <span className="text-sm text-muted-foreground">Invitation sent</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                invitation.role.toLowerCase() === 'admin'
                                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                  : invitation.role.toLowerCase() === 'staff'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                    : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                              }
                            >
                              {invitation.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {format(new Date(invitation.sentDate), 'MMM dd, yyyy')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <UserPlus className="h-8 w-8 mb-2 opacity-50" />
                            <p>No pending invitations found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#febd12]" />
                    Pending Tasks
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tasks requiring attention</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Task</TableHead>
                      <TableHead className="min-w-[80px]">Priority</TableHead>
                      <TableHead className="min-w-[100px]">Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safePendingTasks && safePendingTasks.length > 0 ? (
                      safePendingTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{task.type}</span>
                              <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{task.description}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                task.priority === 'high'
                                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                  : task.priority === 'medium'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                              }
                            >
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {task.deadline ? format(new Date(task.deadline), 'MMM dd, yyyy') : 'No deadline'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Layers className="h-8 w-8 mb-2 opacity-50" />
                            <p>No pending tasks found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
