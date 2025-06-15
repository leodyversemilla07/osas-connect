import { Head, router } from '@inertiajs/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Users, Clock, Monitor, Globe } from 'lucide-react';

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
  ip_address?: string;
  device?: string;
  browser?: string;
}

interface PaginatedRecentLogins {
  data: RecentLogin[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface PageProps {
  recentLogins: PaginatedRecentLogins;
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
    case 'administrator':
      return 'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/20 dark:border-destructive/30';
    case 'osas staff':
      return 'bg-primary/10 text-primary dark:bg-primary/20 border-primary/20 dark:border-primary/30';
    case 'student':
      return 'bg-chart-1/10 text-chart-1 dark:bg-chart-1/20 border-chart-1/20 dark:border-chart-1/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
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
  const handlePageChange = (url: string | null) => {
    if (url) {
      router.visit(url, {
        preserveScroll: true,
        preserveState: true,
      });
    }
  };
  const handlePerPageChange = (perPage: string) => {
    router.visit('/admin/recent-logins', {
      data: { per_page: perPage },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const renderPaginationLinks = () => {
    const links = recentLogins.links;
    const items = [];

    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      if (i === 0) {
        // Previous button
        items.push(
          <PaginationItem key="previous">
            <PaginationPrevious
              onClick={() => handlePageChange(link.url)}
              className={link.url ? 'cursor-pointer hover:bg-muted dark:hover:bg-muted/50 transition-colors' : 'cursor-not-allowed opacity-50'}
            />
          </PaginationItem>
        );
      } else if (i === links.length - 1) {
        // Next button
        items.push(
          <PaginationItem key="next">
            <PaginationNext
              onClick={() => handlePageChange(link.url)}
              className={link.url ? 'cursor-pointer hover:bg-muted dark:hover:bg-muted/50 transition-colors' : 'cursor-not-allowed opacity-50'}
            />
          </PaginationItem>
        );
      } else {
        // Page numbers
        if (link.label === '...') {
          items.push(
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        } else {
          items.push(
            <PaginationItem key={link.label}>
              <PaginationLink
                onClick={() => handlePageChange(link.url)}
                isActive={link.active}
                className="cursor-pointer hover:bg-muted dark:hover:bg-muted/50 transition-colors"
              >
                {link.label}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
    }

    return items;
  };
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Recent Activity - Admin</title>
        <meta name="description" content="View recent user login activity across the system" />
      </Head>

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Recent Activity
              </h1>
              <p className="text-base text-muted-foreground">
                Monitor recent user login activity and system access
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              Page {recentLogins.current_page} of {recentLogins.last_page}
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
              <div className="text-2xl font-bold">{recentLogins.total}</div>
              <p className="text-xs text-muted-foreground">Total activities tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">
                {recentLogins.data.filter(login => login.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently active (this page)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {recentLogins.data.filter(login => {
                  const activityTime = new Date(login.last_activity);
                  const now = new Date();
                  const hoursDiff = (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);
                  return hoursDiff <= 24;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours (this page)</p>
            </CardContent>
          </Card>
        </div>
        {/* Recent Activity Table */}
        <Card>          <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent User Activity
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                Showing {recentLogins.from || 0} to {recentLogins.to || 0} of {recentLogins.total} entries
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select value={recentLogins.per_page.toString()} onValueChange={handlePerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
          </div>
        </CardHeader><CardContent className="p-0">
            {recentLogins.data.length > 0 ? (
              <div className="space-y-4">
                <div className="border-b border-border">
                  <Table>                    <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="h-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">User</TableHead>
                      <TableHead className="h-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">Role</TableHead>
                      <TableHead className="h-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">Details</TableHead>
                      <TableHead className="h-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">Access Info</TableHead>
                      <TableHead className="h-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">Last Activity</TableHead>
                      <TableHead className="h-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader><TableBody>
                      {recentLogins.data.map((login) => (
                        <TableRow
                          key={login.id}
                          className="border-b border-border hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-border bg-card">
                                <AvatarImage src={login.avatar || ''} alt={login.name} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {getInitials(login.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-foreground">{login.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {login.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={`px-2.5 py-0.5 ${getRoleColor(login.role)}`}>
                              {login.role}
                            </Badge>
                          </TableCell>                            <TableCell className="py-4">
                            {login.profile_info && (
                              <div className="text-sm space-y-1">
                                {login.profile_info.student_id && (
                                  <div>
                                    <span className="font-medium text-foreground">ID:</span>
                                    <span className="ml-1 text-muted-foreground">{login.profile_info.student_id}</span>
                                  </div>
                                )}
                                {login.profile_info.course && (
                                  <div>
                                    <span className="font-medium text-foreground">Course:</span>
                                    <span className="ml-1 text-muted-foreground">{login.profile_info.course}</span>
                                  </div>
                                )}
                                {login.profile_info.year_level && (
                                  <div>
                                    <span className="font-medium text-foreground">Year:</span>
                                    <span className="ml-1 text-muted-foreground">{login.profile_info.year_level}</span>
                                  </div>
                                )}
                                {login.profile_info.staff_id && (
                                  <div>
                                    <span className="font-medium text-foreground">Staff ID:</span>
                                    <span className="ml-1 text-muted-foreground">{login.profile_info.staff_id}</span>
                                  </div>
                                )}
                                {login.profile_info.department && (
                                  <div>
                                    <span className="font-medium text-foreground">Dept:</span>
                                    <span
                                      className={`ml-1 text-muted-foreground ${login.profile_info.department.length > 15 ? 'text-xs' : ''}`}
                                      title={login.profile_info.department}
                                    >
                                      {login.profile_info.department.length > 25
                                        ? login.profile_info.department.substring(0, 25) + '...'
                                        : login.profile_info.department}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm space-y-1">
                              {login.ip_address && (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-medium text-foreground">IP:</span>
                                  <span className="font-mono text-xs bg-muted text-foreground px-1.5 py-0.5 rounded border border-border">
                                    {login.ip_address}
                                  </span>
                                </div>
                              )}
                              {login.device && (
                                <div className="flex items-center gap-1">
                                  <Monitor className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-medium text-foreground">Device:</span>
                                  <span className="text-muted-foreground">{login.device}</span>
                                </div>
                              )}
                              {login.browser && (
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-medium text-foreground">Browser:</span>
                                  <span className="text-muted-foreground">{login.browser}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm font-medium text-foreground">
                              {formatDistanceToNow(new Date(login.last_activity), { addSuffix: true })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(login.last_activity).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </TableCell>                          <TableCell className="py-4">
                            <Badge
                              variant={login.is_active ? "default" : "secondary"}
                              className={`px-2.5 py-0.5 border ${login.is_active
                                ? "bg-chart-1/10 text-chart-1 border-chart-1/20 dark:bg-chart-1/20 dark:border-chart-1/30"
                                : "bg-muted text-muted-foreground border-border"
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
              </div>) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">
                  No recent activity
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No user activity has been recorded yet.
                </p>
              </div>
            )}

            {/* Pagination */}
            {recentLogins.last_page > 1 && (
              <div className="border-t border-border px-4 py-4">
                <Pagination>
                  <PaginationContent>
                    {renderPaginationLinks()}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
