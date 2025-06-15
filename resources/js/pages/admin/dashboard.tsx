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

      <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
        {/* Header */}
        <div className="border-b border-border pb-6 lg:pb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            Welcome, {user.first_name} {user.last_name}!
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2 lg:mt-3 leading-relaxed">
            Administrator dashboard for scholarship management system
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6 xl:gap-8">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-1 leading-tight">{safeStats.totalStudents}</p>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Total Students</p>
                </div>
                <div className="rounded-full bg-chart-1/10 p-2 lg:p-3">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-2 leading-tight">{safeStats.totalScholarships}</p>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Total Scholarships</p>
                </div>
                <div className="rounded-full bg-chart-2/10 p-2 lg:p-3">
                  <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-3 leading-tight">{safeStats.totalApplications}</p>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Total Applications</p>
                </div>
                <div className="rounded-full bg-chart-3/10 p-2 lg:p-3">
                  <ClipboardCheck className="h-4 w-4 lg:h-5 lg:w-5 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-4 leading-tight">{safeStats.pendingInvitations}</p>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Pending Invitations</p>
                </div>
                <div className="rounded-full bg-chart-4/10 p-2 lg:p-3">
                  <UserPlus className="h-4 w-4 lg:h-5 lg:w-5 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Status Overview */}
        <div className="grid gap-4 sm:gap-6 lg:gap-6 xl:gap-8 grid-cols-1 lg:grid-cols-3">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center gap-2 lg:gap-3">
                <PieChart className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 lg:space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">{safeStats.pendingApplications || 0}</span>
                  </div>
                  <Progress
                    value={safeStats.totalApplications ? (safeStats.pendingApplications / safeStats.totalApplications) * 100 : 0}
                    className="h-2 lg:h-3"
                  />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-muted-foreground">Approved</span>
                    <span className="font-medium">{safeStats.approvedApplications || 0}</span>
                  </div>
                  <Progress
                    value={safeStats.totalApplications ? (safeStats.approvedApplications / safeStats.totalApplications) * 100 : 0}
                    className="h-2 lg:h-3"
                  />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-muted-foreground">Rejected</span>
                    <span className="font-medium">{safeStats.rejectedApplications || 0}</span>
                  </div>
                  <Progress
                    value={safeStats.totalApplications ? (safeStats.rejectedApplications / safeStats.totalApplications) * 100 : 0}
                    className="h-2 lg:h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center gap-2 lg:gap-3">
                <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 text-chart-1" />
                Scholarship Funding
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 lg:space-y-6">
              <div className="flex flex-col h-full justify-between">
                <div className="mb-4 lg:mb-6">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">₱{(safeStats.totalFundsAllocated || 0).toLocaleString()}</div>
                  <p className="text-sm lg:text-base text-muted-foreground mt-1 lg:mt-2">Total funds allocated</p>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{safeStats.applicationSuccessRate || 0}%</span>
                  </div>
                  <Progress
                    value={safeStats.applicationSuccessRate || 0}
                    className="h-2 lg:h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center gap-2 lg:gap-3">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-chart-2" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 lg:space-y-6">
              <div className="space-y-4 lg:space-y-5">
                <div className="flex items-center justify-between min-h-[44px]">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <ClipboardCheck className="h-4 w-4 lg:h-5 lg:w-5 text-chart-3" />
                    <span className="text-sm lg:text-base">Applications for Review</span>
                  </div>
                  <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                    {safeStats.pendingApplications || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between min-h-[44px]">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <FileCheck className="h-4 w-4 lg:h-5 lg:w-5 text-chart-4" />
                    <span className="text-sm lg:text-base">Documents to Verify</span>
                  </div>
                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                    {safeStats.documentsNeedingVerification || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between min-h-[44px]">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <UserPlus className="h-4 w-4 lg:h-5 lg:w-5 text-chart-5" />
                    <span className="text-sm lg:text-base">Invitations Pending</span>
                  </div>
                  <Badge variant="outline" className="bg-chart-5/10 text-chart-5 border-chart-5/20">
                    {safeStats.pendingInvitations || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:gap-6 lg:gap-6 xl:gap-8 grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.students')}>
              <Users className="h-5 w-5 lg:h-6 lg:w-6 text-chart-1" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Manage Students</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.scholarships')}>
              <School className="h-5 w-5 lg:h-6 lg:w-6 text-chart-2" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Manage Scholarships</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.scholarship.applications')}>
              <ClipboardCheck className="h-5 w-5 lg:h-6 lg:w-6 text-chart-3" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Review Applications</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.scholarships')}>
              <BarChart4 className="h-5 w-5 lg:h-6 lg:w-6 text-chart-4" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Scholarship Analytics</span>
            </Link>
          </Button>
        </div>

        {/* Second row of Quick Actions */}
        <div className="grid gap-4 sm:gap-6 lg:gap-6 xl:gap-8 grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.cms.index')}>
              <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-chart-5" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Manage Pages</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.staff')}>
              <UserPlus className="h-5 w-5 lg:h-6 lg:w-6 text-chart-1" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Manage Staff</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.recent-logins')}>
              <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-chart-2" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">Recent Activity</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="min-h-[44px] h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center gap-2 lg:gap-3 bg-card hover:bg-accent border-border hover:shadow-md transition-all p-4 lg:p-6"
            asChild
          >
            <Link href={route('admin.scholarships')}>
              <Layers className="h-5 w-5 lg:h-6 lg:w-6 text-chart-3" />
              <span className="text-xs sm:text-sm lg:text-base text-center font-medium">System Reports</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activity and Applications */}
        <div className="grid gap-4 sm:gap-6 lg:gap-6 xl:gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Recent Logins */}
          <div className="space-y-4 lg:space-y-6">
            <div className="border-b border-border pb-4 lg:pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2 lg:gap-3">
                    <User className="h-4 w-4 lg:h-5 lg:w-5 text-chart-1" />
                    Recent Logins
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">Latest user activity</p>
                </div>
                <Button variant="outline" size="sm" className="min-h-[44px] px-3 lg:px-4" asChild>
                  <Link href={route('admin.recent-logins')}>
                    <span className="hidden sm:inline text-sm lg:text-base">View all</span>
                    <span className="sm:hidden text-sm">All</span>
                    <ChevronRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="min-w-[150px] text-sm lg:text-base font-medium py-3 lg:py-4">User</TableHead>
                      <TableHead className="min-w-[80px] text-sm lg:text-base font-medium py-3 lg:py-4">Role</TableHead>
                      <TableHead className="min-w-[100px] text-sm lg:text-base font-medium py-3 lg:py-4">Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeRecentLogins && safeRecentLogins.length > 0 ? (
                      safeRecentLogins.map((login) => (
                        <TableRow key={login.id} className="hover:bg-muted/50">
                          <TableCell className="py-3 lg:py-4">
                            <div className="flex flex-col space-y-1 lg:space-y-2">
                              <span className="font-medium text-sm lg:text-base">{login.name}</span>
                              <span className="text-xs lg:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{login.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 lg:py-4">
                            <Badge
                              variant="outline"
                              className={
                                login.role.toLowerCase() === 'admin'
                                  ? 'bg-destructive/10 text-destructive border-destructive/20'
                                  : login.role.toLowerCase() === 'staff'
                                    ? 'bg-chart-3/10 text-chart-3 border-chart-3/20'
                                    : 'bg-chart-1/10 text-chart-1 border-chart-1/20'
                              }
                            >
                              {login.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 lg:py-4">
                            <span className="text-xs lg:text-sm">
                              {format(new Date(login.timestamp), 'MMM dd, HH:mm')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 lg:h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 lg:space-y-3">
                            <User className="h-6 w-6 lg:h-8 lg:w-8 opacity-50" />
                            <p className="text-sm lg:text-base">No recent logins found</p>
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
          <div className="space-y-4 lg:space-y-6">
            <div className="border-b border-border pb-4 lg:pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2 lg:gap-3">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-chart-3" />
                    Recent Applications
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">Latest scholarship applications</p>
                </div>
                <Button variant="outline" size="sm" className="min-h-[44px] px-3 lg:px-4" asChild>
                  <Link href={route('admin.scholarship.applications')}>
                    <span className="hidden sm:inline text-sm lg:text-base">View all</span>
                    <span className="sm:hidden text-sm">All</span>
                    <ChevronRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="min-w-[150px] text-sm lg:text-base font-medium py-3 lg:py-4">Student</TableHead>
                      <TableHead className="min-w-[80px] text-sm lg:text-base font-medium py-3 lg:py-4">Status</TableHead>
                      <TableHead className="min-w-[100px] text-sm lg:text-base font-medium py-3 lg:py-4">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeRecentApplications && safeRecentApplications.length > 0 ? (
                      safeRecentApplications.map((application) => (
                        <TableRow key={application.id} className="hover:bg-muted/50">
                          <TableCell className="py-3 lg:py-4">
                            <div className="flex flex-col space-y-1 lg:space-y-2">
                              <span className="font-medium text-sm lg:text-base">{application.student}</span>
                              <span className="text-xs lg:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{application.scholarshipName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 lg:py-4">
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
                          <TableCell className="py-3 lg:py-4">
                            <span className="text-xs lg:text-sm">
                              {format(new Date(application.submittedDate), 'MMM dd, yyyy')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 lg:h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 lg:space-y-3">
                            <FileText className="h-6 w-6 lg:h-8 lg:w-8 opacity-50" />
                            <p className="text-sm lg:text-base">No recent applications found</p>
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
        <div className="grid gap-4 sm:gap-6 lg:gap-6 xl:gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Pending Invitations */}
          <div className="space-y-4 lg:space-y-6">
            <div className="border-b border-border pb-4 lg:pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2 lg:gap-3">
                    <UserPlus className="h-4 w-4 lg:h-5 lg:w-5 text-chart-4" />
                    Pending Invitations
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">Staff invitations awaiting response</p>
                </div>
                <Button variant="ghost" size="sm" className="min-h-[44px] px-3 lg:px-4 text-muted-foreground hover:text-foreground border-0 hover:bg-muted" asChild>
                  <Link href={route('admin.staff')}>
                    <span className="hidden sm:inline text-sm lg:text-base">Manage</span>
                    <span className="sm:hidden text-sm">Manage</span>
                    <ChevronRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="min-w-[150px] text-sm lg:text-base font-medium py-3 lg:py-4">Email</TableHead>
                      <TableHead className="min-w-[80px] text-sm lg:text-base font-medium py-3 lg:py-4">Role</TableHead>
                      <TableHead className="min-w-[100px] text-sm lg:text-base font-medium py-3 lg:py-4">Sent Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safePendingInvitations && safePendingInvitations.length > 0 ? (
                      safePendingInvitations.map((invitation) => (
                        <TableRow key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <TableCell className="py-3 lg:py-4">
                            <div className="flex flex-col space-y-1 lg:space-y-2">
                              <span className="font-medium text-sm lg:text-base truncate max-w-[120px] sm:max-w-none">{invitation.email}</span>
                              <span className="text-xs lg:text-sm text-muted-foreground">Invitation sent</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 lg:py-4">
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
                          <TableCell className="py-3 lg:py-4">
                            <span className="text-xs lg:text-sm">
                              {format(new Date(invitation.sentDate), 'MMM dd, yyyy')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 lg:h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 lg:space-y-3">
                            <UserPlus className="h-6 w-6 lg:h-8 lg:w-8 opacity-50" />
                            <p className="text-sm lg:text-base">No pending invitations found</p>
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
          <div className="space-y-4 lg:space-y-6">
            <div className="border-b border-border pb-4 lg:pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2 lg:gap-3">
                    <Layers className="h-4 w-4 lg:h-5 lg:w-5 text-chart-2" />
                    Pending Tasks
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">Tasks requiring attention</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="min-w-[150px] text-sm lg:text-base font-medium py-3 lg:py-4">Task</TableHead>
                      <TableHead className="min-w-[80px] text-sm lg:text-base font-medium py-3 lg:py-4">Priority</TableHead>
                      <TableHead className="min-w-[100px] text-sm lg:text-base font-medium py-3 lg:py-4">Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safePendingTasks && safePendingTasks.length > 0 ? (
                      safePendingTasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <TableCell className="py-3 lg:py-4">
                            <div className="flex flex-col space-y-1 lg:space-y-2">
                              <span className="font-medium text-sm lg:text-base">{task.type}</span>
                              <span className="text-xs lg:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">{task.description}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 lg:py-4">
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
                          <TableCell className="py-3 lg:py-4">
                            <span className="text-xs lg:text-sm">
                              {task.deadline ? format(new Date(task.deadline), 'MMM dd, yyyy') : 'No deadline'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 lg:h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 lg:space-y-3">
                            <Layers className="h-6 w-6 lg:h-8 lg:w-8 opacity-50" />
                            <p className="text-sm lg:text-base">No pending tasks found</p>
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
