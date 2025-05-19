import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Search, FileEdit, Trash2, Award, Calendar as CalendarIcon2, Eye, PenSquare, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff Dashboard',
        href: '/osas_staff/dashboard',
    },
    {
        title: 'Manage Scholarships',
        href: '/osas_staff/manage-scholarships',
    },
];

// Dummy scholarship data for demonstration
const scholarships = [
    {
        id: 1,
        name: 'Academic Excellence Scholarship',
        description: 'For students with outstanding academic performance.',
        amount: 10000,
        status: 'active',
        deadline: '2025-05-15',
        requirements: 'Minimum GPA of 3.5, recommendation letter',
        beneficiaries: 23,
        slots: 30,
        category: 'Merit-based',
        funding_source: 'University',
    },
    {
        id: 2,
        name: 'Financial Need Scholarship',
        description: 'For financially disadvantaged students.',
        amount: 15000,
        status: 'active',
        deadline: '2025-05-10',
        requirements: 'Income certificate, barangay indigency certificate',
        beneficiaries: 42,
        slots: 50,
        category: 'Need-based',
        funding_source: 'Government',
    },
    {
        id: 3,
        name: 'Student Assistantship Program',
        description: 'Work-study program for eligible students.',
        amount: 8000,
        status: 'active',
        deadline: '2025-04-30',
        requirements: 'Good academic standing, interview',
        beneficiaries: 18,
        slots: 25,
        category: 'Work-study',
        funding_source: 'University',
    },
    {
        id: 4,
        name: 'Sports Excellence Scholarship',
        description: 'For students with exceptional sports abilities.',
        amount: 12000,
        status: 'inactive',
        deadline: '2025-03-15',
        requirements: 'Sports achievements, coach recommendation',
        beneficiaries: 0,
        slots: 15,
        category: 'Sports',
        funding_source: 'Alumni Association',
    },
    {
        id: 5,
        name: 'Cultural Arts Scholarship',
        description: 'For students with talents in cultural arts.',
        amount: 9000,
        status: 'upcoming',
        deadline: '2025-06-20',
        requirements: 'Portfolio, audition',
        beneficiaries: 0,
        slots: 10,
        category: 'Arts',
        funding_source: 'Private Donor',
    },
];

// Dummy applications data for demonstration
const applications = [
    {
        id: 1,
        student_name: 'Maria Santos',
        student_id: 'MBC2023-0123',
        scholarship_name: 'Academic Excellence Scholarship',
        date_submitted: '2025-04-08',
        status: 'pending',
        course: 'BS Information Technology',
        year_level: '3rd Year',
    },
    {
        id: 2,
        student_name: 'Juan Cruz',
        student_id: 'MBC2022-0456',
        scholarship_name: 'Financial Need Scholarship',
        date_submitted: '2025-04-05',
        status: 'approved',
        course: 'BS Tourism Management',
        year_level: '2nd Year',
    },
    {
        id: 3,
        student_name: 'Ana Reyes',
        student_id: 'MBC2024-0789',
        scholarship_name: 'Student Assistantship Program',
        date_submitted: '2025-04-07',
        status: 'pending',
        course: 'BA Political Science',
        year_level: '1st Year',
    },
    {
        id: 4,
        student_name: 'Pedro Garcia',
        student_id: 'MBC2022-0234',
        scholarship_name: 'Academic Excellence Scholarship',
        date_submitted: '2025-04-06',
        status: 'rejected',
        course: 'BS Computer Engineering',
        year_level: '4th Year',
    },
    {
        id: 5,
        student_name: 'Sofia Lopez',
        student_id: 'MBC2023-0567',
        scholarship_name: 'Financial Need Scholarship',
        date_submitted: '2025-04-09',
        status: 'pending',
        course: 'BS Hospitality Management',
        year_level: '3rd Year',
    },
];

// Dummy scholarship categories
const categories = [
    'Merit-based',
    'Need-based',
    'Work-study',
    'Sports',
    'Arts',
    'Demographic-specific',
    'Field-specific',
];

// Status badge colors
const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400',
    inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-400',
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
};

export default function ManageScholarships() {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddScholarshipOpen, setIsAddScholarshipOpen] = useState(false);

    // Filter scholarships based on search term and filters
    const filteredScholarships = scholarships.filter(scholarship => {
        const matchesSearch = searchTerm === '' ||
            scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || scholarship.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || scholarship.status === statusFilter;
        const matchesDate = !dateFilter || scholarship.deadline === format(dateFilter, 'yyyy-MM-dd');

        return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });

    // Filter applications based on search term
    const filteredApplications = applications.filter(app =>
        searchTerm === '' ||
        app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.scholarship_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetFilters = () => {
        setSearchTerm('');
        setDateFilter(undefined);
        setCategoryFilter('all');
        setStatusFilter('all');
    };

    // Function to format currency values
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Scholarships" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Scholarship Management</h1>
                        <p className="text-muted-foreground">Manage scholarships, applications, and beneficiaries</p>
                    </div>

                    <Dialog open={isAddScholarshipOpen} onOpenChange={setIsAddScholarshipOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 px-4 py-2">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Scholarship
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle>Create New Scholarship</DialogTitle>
                                <DialogDescription>
                                    Add a new scholarship program to the system. Fill in all required details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="name">Scholarship Name</Label>
                                        <Input id="name" placeholder="Enter scholarship name" className="mt-1" />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" placeholder="Enter scholarship description" className="mt-1" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="amount">Amount (PHP)</Label>
                                        <Input id="amount" type="number" placeholder="0" className="mt-1" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="deadline">Application Deadline</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "mt-1 w-full justify-start text-left font-normal",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Select date</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <Label htmlFor="slots">Available Slots</Label>
                                        <Input id="slots" type="number" placeholder="0" className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="requirements">Requirements</Label>
                                    <Textarea id="requirements" placeholder="List all requirements" className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="funding_source">Funding Source</Label>
                                    <Input id="funding_source" placeholder="Enter funding source" className="mt-1" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddScholarshipOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Scholarship</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="scholarships" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="scholarships" className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Scholarships
                        </TabsTrigger>
                        <TabsTrigger value="applications" className="flex items-center gap-2">
                            <FileEdit className="h-4 w-4" />
                            Applications
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <CalendarIcon2 className="h-4 w-4" />
                            Calendar
                        </TabsTrigger>
                    </TabsList>

                    {/* Scholarships Tab */}
                    <TabsContent value="scholarships">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Scholarships</CardTitle>
                                <CardDescription>
                                    Manage all available scholarship programs
                                </CardDescription>
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search scholarships..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn(
                                                    "w-[150px] justify-start text-left font-normal",
                                                    !dateFilter && "text-muted-foreground"
                                                )}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dateFilter ? format(dateFilter, "PPP") : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateFilter}
                                                    onSelect={setDateFilter}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Button variant="outline" onClick={resetFilters} size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Deadline</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredScholarships.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                        No scholarships found matching your filters.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredScholarships.map((scholarship) => (
                                                    <TableRow key={scholarship.id}>
                                                        <TableCell className="font-medium">
                                                            {scholarship.name}
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {scholarship.description}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>{scholarship.category}</TableCell>
                                                        <TableCell>{formatCurrency(scholarship.amount)}</TableCell>
                                                        <TableCell>{new Date(scholarship.deadline).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Badge className={statusColors[scholarship.status as keyof typeof statusColors]}>
                                                                {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="flex justify-end items-center space-x-2">
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon">
                                                                <PenSquare className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {filteredScholarships.length} of {scholarships.length} scholarships
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Scholarship Applications</CardTitle>
                                <CardDescription>
                                    Review and manage student applications
                                </CardDescription>
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search applications by name, ID, or scholarship..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Application Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Scholarship" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Scholarships</SelectItem>
                                                {scholarships.map((scholarship) => (
                                                    <SelectItem key={scholarship.id} value={scholarship.name}>
                                                        {scholarship.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>Applicant</TableHead>
                                                <TableHead>Scholarship</TableHead>
                                                <TableHead>Date Submitted</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredApplications.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                        No applications found matching your search.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredApplications.map((application) => (
                                                    <TableRow key={application.id}>
                                                        <TableCell className="font-medium">
                                                            {application.student_name}
                                                            <p className="text-xs text-muted-foreground">
                                                                {application.student_id} • {application.course}, {application.year_level}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>{application.scholarship_name}</TableCell>
                                                        <TableCell>{new Date(application.date_submitted).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="flex justify-end items-center space-x-2">
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon">
                                                                <FileEdit className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {filteredApplications.length} of {applications.length} applications
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar">
                        <Card className="relative">
                            <CardHeader>
                                <CardTitle>Scholarship Calendar</CardTitle>
                                <CardDescription>
                                    Important deadlines and events related to scholarships
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center py-6">
                                <div className="w-full max-w-md">
                                    <Calendar
                                        mode="single"
                                        className="rounded-md border shadow"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full space-y-4">
                                    <h4 className="font-medium">Upcoming Deadlines</h4>
                                    <div className="space-y-2">
                                        {scholarships
                                            .filter(s => new Date(s.deadline) > new Date())
                                            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                                            .slice(0, 3)
                                            .map(scholarship => (
                                                <div key={scholarship.id} className="flex items-center justify-between border-b pb-2">
                                                    <div>
                                                        <p className="font-medium">{scholarship.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Due {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <Badge className={statusColors[scholarship.status as keyof typeof statusColors]}>
                                                        {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}