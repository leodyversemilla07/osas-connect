import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Filter,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Download
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  student_id: string;
  course: string;
  year_level: string;
}

interface Scholarship {
  id: number;
  name: string;
  type: string;
  amount: number;
}

interface Reviewer {
  name: string;
  email: string;
}

interface Application {
  id: number;
  student: Student;
  scholarship: Scholarship;
  status: string;
  applied_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  amount_received: number | null;
  reviewer: Reviewer | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedApplications {
  data: Application[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface Filters {
  search: string;
  status: string;
  scholarship_type: string;
}

interface Statistics {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
}

interface Props {
  applications: PaginatedApplications;
  filters: Filters;
  statistics: Statistics;
}

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  under_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  verified: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
  under_evaluation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  on_hold: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

const breadcrumbs = [
  { title: 'Admin Dashboard', href: '/admin' },
  { title: 'Scholarship Applications', href: '/admin/scholarship-applications' },
];

export default function ScholarshipApplicationsIndex({ applications, filters, statistics }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [typeFilter, setTypeFilter] = useState(filters.scholarship_type || 'all');

  // Unified filter function
  const applyFilters = (searchValue?: string, statusValue?: string, typeValue?: string) => {
    router.get('/admin/scholarship-applications', {
      search: searchValue ?? searchTerm,
      status: (statusValue ?? statusFilter) === 'all' ? '' : (statusValue ?? statusFilter),
      scholarship_type: (typeValue ?? typeFilter) === 'all' ? '' : (typeValue ?? typeFilter),
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(undefined, value);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    applyFilters(undefined, undefined, value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    router.get('/admin/scholarship-applications');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Scholarship Applications - Admin</title>
        <meta name="description" content="Manage and review scholarship applications" />
      </Head>

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Scholarship Applications
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Review and manage all scholarship applications
              </p>
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
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Applications
              </div>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
              {statistics.total_applications}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All time submissions</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pending Review
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-yellow-600 dark:text-yellow-500 mt-2">
              {statistics.pending_applications}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Awaiting verification</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Approved
              </div>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-green-600 dark:text-green-500 mt-2">
              {statistics.approved_applications}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Successfully approved</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rejected
              </div>
              <XCircle className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-red-600 dark:text-red-500 mt-2">
              {statistics.rejected_applications}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Not approved</p>
          </div>
        </div>
        {/* Filters and Search */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Filters & Search
            </h3>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search by student name, email, or scholarship..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-base border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-48 h-10 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500">
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
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-full sm:w-48 h-10 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="need-based">Need-Based</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
              >
                <Filter className="mr-2 h-4 w-4 inline" />
                Filter
              </button>
              {(searchTerm || (statusFilter && statusFilter !== 'all') || (typeFilter && typeFilter !== 'all')) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
        {/* Applications Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Applications ({applications.total})
            </h3>
          </div>

          {applications.data.length > 0 ? (
            <div className="border-b border-gray-100 dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scholarship</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied Date</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reviewer</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.data.map((application) => (
                    <TableRow
                      key={application.id}
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-medium">{application.student.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.student.student_id} • {application.student.course}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <div className="font-medium">{application.scholarship.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.scholarship.type} • {formatCurrency(application.scholarship.amount)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                          {getStatusText(application.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">{formatDate(application.applied_at)}</TableCell>
                      <TableCell className="py-4">
                        {application.amount_received
                          ? formatCurrency(application.amount_received)
                          : '—'
                        }
                      </TableCell>
                      <TableCell className="py-4">
                        {application.reviewer
                          ? application.reviewer.name
                          : '—'
                        }
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
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
            </div>) : (
            <div className="border-b border-gray-100 dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scholarship</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied Date</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reviewer</TableHead>
                    <TableHead className="h-12 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-base text-gray-500 dark:text-gray-400"
                    >
                      {(searchTerm || (statusFilter && statusFilter !== 'all') || (typeFilter && typeFilter !== 'all'))
                        ? 'No applications found matching your criteria.'
                        : 'No applications found. Applications will appear here when students submit them.'
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {applications.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {applications.from} to {applications.to} of {applications.total} applications
            </div>
            <div className="flex gap-2">
              {applications.current_page > 1 && (
                <button
                  onClick={() => router.get(`/admin/scholarship-applications?page=${applications.current_page - 1}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              {applications.current_page < applications.last_page && (
                <button
                  onClick={() => router.get(`/admin/scholarship-applications?page=${applications.current_page + 1}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
