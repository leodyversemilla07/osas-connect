import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
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
  Search,
  MoreHorizontal,
  Eye,
  Users
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
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

export default function ScholarshipApplicationsIndex({ applications }: Props) {
  // Format scholarship type for display
  const formatScholarshipType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Scholarship Applications - Admin" />

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold">Scholarship Applications</span>
            <div className="text-base text-muted-foreground mt-2">
              Review and manage all scholarship applications
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.visit('/admin/scholarships')}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Scholarships
            </Button>
          </div>
        </div>

        {/* Application Management */}
        <div>
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, ID, or email..."
                    className="pl-10 w-full"
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
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>Scholarship Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reviewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.data.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      {application.student.student_id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{application.student.name}</div>
                    </TableCell>
                    <TableCell>
                      {application.student.course}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{application.scholarship.name}</div>
                    </TableCell>
                    <TableCell>
                      {formatScholarshipType(application.scholarship.type)}
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 p-0">
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
            <Pagination className="py-4">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="text-sm text-muted-foreground">
                  Showing {applications.from || 0} to {applications.to || 0} of {applications.total} applications
                </div>
              </div>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (applications.current_page > 1) {
                        const url = new URL(window.location.href);
                        url.searchParams.set('page', String(applications.current_page - 1));
                        router.get(url.pathname + url.search);
                      }
                    }}
                    aria-disabled={applications.current_page <= 1}
                    tabIndex={applications.current_page <= 1 ? -1 : 0}
                  />
                </PaginationItem>
                {/* Page numbers with ellipsis */}
                {[...Array(applications.last_page)].map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === applications.current_page;
                  const showPage =
                    pageNum === 1 ||
                    pageNum === applications.last_page ||
                    Math.abs(pageNum - applications.current_page) <= 2;
                  if (!showPage) {
                    if (pageNum === applications.current_page - 3 || pageNum === applications.current_page + 3) {
                      return (
                        <PaginationItem key={`ellipsis-${pageNum}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={isCurrentPage}
                        onClick={e => {
                          e.preventDefault();
                          if (!isCurrentPage) {
                            const url = new URL(window.location.href);
                            url.searchParams.set('page', String(pageNum));
                            router.get(url.pathname + url.search);
                          }
                        }}
                        aria-current={isCurrentPage ? "page" : undefined}
                        tabIndex={isCurrentPage ? -1 : 0}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (applications.current_page < applications.last_page) {
                        const url = new URL(window.location.href);
                        url.searchParams.set('page', String(applications.current_page + 1));
                        router.get(url.pathname + url.search);
                      }
                    }}
                    aria-disabled={applications.current_page >= applications.last_page}
                    tabIndex={applications.current_page >= applications.last_page ? -1 : 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
