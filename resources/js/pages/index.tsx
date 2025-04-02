import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Eye, Download, Search, Calendar, Filter, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'My Applications',
    href: '/applications',
  },
];

// Mock data - will be replaced by actual API data
const mockApplications = [
  {
    id: 1,
    scholarshipName: 'Need-Based Scholarship',
    type: 'Financial Assistantship',
    amount: 'PHP 3,000',
    status: 'pending',
    dateSubmitted: '2025-03-25',
    decisionDate: null,
    comments: 'Your application is being reviewed by the committee.',
    documents: ['Application Form', 'Income Certificate', 'Grade Report'],
  },
  {
    id: 2,
    scholarshipName: 'Academic Excellence Award',
    type: 'Scholarship',
    amount: 'PHP 6,000',
    status: 'approved',
    dateSubmitted: '2025-02-10',
    decisionDate: '2025-02-28',
    comments: 'Congratulations! Your application has been approved.',
    documents: ['Application Form', 'Grade Report', 'Dean\'s Recommendation'],
  },
  {
    id: 3,
    scholarshipName: 'Community Service Grant',
    type: 'Scholarship',
    amount: 'PHP 4,000',
    status: 'rejected',
    dateSubmitted: '2025-01-15',
    decisionDate: '2025-02-01',
    comments: 'Unfortunately, your application was not selected for this round of funding.',
    documents: ['Application Form', 'Service Certificates', 'Recommendation Letter'],
  },
  {
    id: 4,
    scholarshipName: 'Research Assistant Program',
    type: 'Student Assistantship Program',
    amount: 'PHP 5,000',
    status: 'pending',
    dateSubmitted: '2025-03-10',
    decisionDate: null,
    comments: 'Your application is being reviewed by the department head.',
    documents: ['Application Form', 'CV', 'Research Proposal'],
  },
  {
    id: 5,
    scholarshipName: 'Sports Excellence Scholarship',
    type: 'Scholarship',
    amount: 'PHP 5,500',
    status: 'approved',
    dateSubmitted: '2025-01-20',
    decisionDate: '2025-02-15',
    comments: 'Congratulations! Your sports achievements have earned you this scholarship.',
    documents: ['Application Form', 'Sports Certificates', 'Coach Recommendation'],
  },
  {
    id: 6,
    scholarshipName: 'Library Work-Study Program',
    type: 'Student Assistantship Program',
    amount: 'PHP 3,500',
    status: 'rejected',
    dateSubmitted: '2025-02-05',
    decisionDate: '2025-03-01',
    comments: 'All positions have been filled for this semester.',
    documents: ['Application Form', 'Work Experience', 'Schedule Availability'],
  },
  {
    id: 7,
    scholarshipName: 'First-Generation College Student Grant',
    type: 'Financial Assistantship',
    amount: 'PHP 4,500',
    status: 'pending',
    dateSubmitted: '2025-03-15',
    decisionDate: null,
    comments: 'Verification of eligibility in progress.',
    documents: ['Application Form', 'Parent Education Declaration', 'Financial Statement'],
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const variantMap = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
  } as const;
  
  const variant = variantMap[status as keyof typeof variantMap] || "secondary";
  
  return (
      <Badge variant={variant}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const variantMap = {
      'Scholarship': "default",
      'Financial Assistantship': "outline",
      'Student Assistantship Program': "secondary"
  } as const;
  
  const variant = variantMap[type as keyof typeof variantMap] || "default";
  
  return (
      <Badge variant={variant}>
          {type}
      </Badge>
  );
};

export default function ApplicationsIndex() {
  // const { auth } = usePage<SharedData>().props;
  // const user = auth.user;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter the applications based on search query and filters
  const filteredApplications = mockApplications.filter(app => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      app.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Applications | OSAS Connect" />
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all your scholarship and assistantship applications here.
          </p>
        </div>
        
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>All Applications</CardTitle>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Scholarship">Scholarship</SelectItem>
                        <SelectItem value="Financial Assistantship">Financial Aid</SelectItem>
                        <SelectItem value="Student Assistantship Program">Assistantship</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scholarship Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Decision Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.scholarshipName}</TableCell>
                        <TableCell><TypeBadge type={application.type} /></TableCell>
                        <TableCell>{application.amount}</TableCell>
                        <TableCell><StatusBadge status={application.status} /></TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            {application.dateSubmitted}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {application.decisionDate ? (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {application.decisionDate}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                              <a href={`/applications/${application.id}/download`} title="Download Application">
                                <span className="sr-only">Download</span>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                              <a href={`/applications/${application.id}`} title="View Details">
                                <span className="sr-only">View</span>
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No applications found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-center border-t px-4 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
