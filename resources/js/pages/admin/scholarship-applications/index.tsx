import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Application } from '@/components/scholarship-applications/columns';
import {
  FileText,
  CheckCircle,
  Clock,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3, AlertCircle,
  Search,
  MoreHorizontal,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ApplicationsData {
  data: Application[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  next_page_url?: string;
  prev_page_url?: string;
}

interface Statistics {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  this_month_count?: number;
  last_month_count?: number;
  completion_rate?: number;
}

interface Props {
  applications: ApplicationsData;
  statistics: Statistics;
}

const breadcrumbs = [
  { title: 'Admin Dashboard', href: '/admin' },
  { title: 'Scholarship Applications', href: '/admin/scholarship-applications' },
];

export default function ScholarshipApplicationsIndex({ applications, statistics }: Props) {
  const calculateTrend = () => {
    if (!statistics.last_month_count || statistics.last_month_count === 0) return { value: 0, direction: 'neutral' };
    const thisMonth = statistics.this_month_count || 0;
    const change = ((thisMonth - statistics.last_month_count) / statistics.last_month_count) * 100;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  // Helper functions
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'submitted':
      case 'under_verification':
      case 'under_evaluation': return 'secondary';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const trend = calculateTrend();
  const urgentApplications = statistics.pending_applications;
  const completionRate = statistics.completion_rate ||
    (statistics.total_applications > 0 ?
      (statistics.approved_applications / statistics.total_applications) * 100 : 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Scholarship Applications - Admin" />

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Scholarship Applications</CardTitle>
                <CardDescription className="text-base mt-2">
                  Review and manage all scholarship applications
                </CardDescription>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                  onClick={() => router.visit('/admin/scholarships')}
                >
                  <FileText className="mr-2 h-4 w-4 inline" />
                  View Scholarships
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                >
                  <Download className="mr-2 h-4 w-4 inline" />
                  Export Applications
                </button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_applications}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {trend.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                ) : trend.direction === 'down' ? (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                ) : null}
                {trend.direction !== 'neutral' && (
                  <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {trend.value.toFixed(1)}%
                  </span>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentApplications}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.approved_applications}</div>
              <p className="text-xs text-muted-foreground">
                Successfully processed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Application Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Applications
                </CardTitle>
                <CardDescription>
                  Complete list of scholarship applications • {applications.data.length} of {applications.total} total
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {statistics.pending_applications} Pending
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {statistics.rejected_applications} Rejected
                </Badge>
              </div>
            </div>
          </CardHeader>          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name, ID, or email..."
                      className="pl-10"
                      onChange={(e) => {
                        const url = new URL(window.location.href);
                        if (e.target.value) {
                          url.searchParams.set('search', e.target.value);
                        } else {
                          url.searchParams.delete('search');
                        }
                        url.searchParams.delete('page');
                        router.get(url.pathname + url.search);
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => {
                    const url = new URL(window.location.href);
                    if (value && value !== 'all') {
                      url.searchParams.set('status', value);
                    } else {
                      url.searchParams.delete('status');
                    }
                    url.searchParams.delete('page');
                    router.get(url.pathname + url.search);
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_verification">Under Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Scholarship</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.data.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{application.student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {application.student.student_id} • {application.student.course}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{application.scholarship.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {application.scholarship.type} • {application.scholarship.amount}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(application.status)}>
                          {formatStatus(application.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(application.applied_at)}
                      </TableCell>
                      <TableCell>
                        {application.amount_received
                          ? formatCurrency(application.amount_received)
                          : '—'
                        }
                      </TableCell>
                      <TableCell>
                        {application.reviewer ? (
                          <div>
                            <div className="font-medium text-foreground">{application.reviewer.name}</div>
                            <div className="text-xs text-muted-foreground">{application.reviewer.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/scholarship-applications/${application.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/students/${application.student.id}`}>
                                <Users className="mr-2 h-4 w-4" />
                                View Student
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/scholarships/${application.scholarship.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Scholarship
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {applications.last_page > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {applications.from || 0} to {applications.to || 0} of {applications.total} applications
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('page', String(applications.current_page - 1));
                      router.get(url.pathname + url.search);
                    }}
                    disabled={applications.current_page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {[...Array(applications.last_page)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrentPage = pageNum === applications.current_page;
                      const showPage =
                        pageNum === 1 ||
                        pageNum === applications.last_page ||
                        Math.abs(pageNum - applications.current_page) <= 2;

                      if (!showPage) {
                        if (pageNum === applications.current_page - 3 || pageNum === applications.current_page + 3) {
                          return <span key={pageNum} className="px-2">...</span>;
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={isCurrentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('page', String(pageNum));
                            router.get(url.pathname + url.search);
                          }}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>


                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('page', String(applications.current_page + 1));
                      router.get(url.pathname + url.search);
                    }}
                    disabled={applications.current_page >= applications.last_page}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
