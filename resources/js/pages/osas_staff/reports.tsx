import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { BarChart, PieChart, LineChart, Download, Filter, ChevronDown, FileText, Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/osas-staff/dashboard',
    },
    {
        title: 'Reports',
        href: '/osas-staff/reports',
    },
];

// Sample data for scholarship statistics
const scholarshipData = {
    totalApplicants: 412,
    approved: 210,
    rejected: 87,
    pending: 115,
    byCategory: [
        { name: 'Academic Merit', count: 145, color: 'bg-emerald-500' },
        { name: 'Financial Need', count: 132, color: 'bg-blue-500' },
        { name: 'Athletic', count: 65, color: 'bg-amber-500' },
        { name: 'Cultural', count: 48, color: 'bg-purple-500' },
        { name: 'Special', count: 22, color: 'bg-red-500' },
    ],
    monthlyApplications: [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 32 },
        { month: 'Mar', count: 67 },
        { month: 'Apr', count: 76 },
        { month: 'May', count: 24 },
        { month: 'Jun', count: 18 },
        { month: 'Jul', count: 15 },
        { month: 'Aug', count: 32 },
        { month: 'Sep', count: 39 },
        { month: 'Oct', count: 27 },
        { month: 'Nov', count: 21 },
        { month: 'Dec', count: 16 },
    ]
};

// Sample data for student organization reports
const orgData = {
    totalOrgs: 28,
    activeMembers: 1547,
    byCategory: [
        { name: 'Academic', count: 12, color: 'bg-emerald-500' },
        { name: 'Cultural', count: 7, color: 'bg-blue-500' },
        { name: 'Sports', count: 5, color: 'bg-amber-500' },
        { name: 'Religious', count: 4, color: 'bg-purple-500' },
    ],
    topOrgs: [
        { name: 'Computer Science Society', members: 124, events: 12 },
        { name: 'Student Council', members: 78, events: 20 },
        { name: 'Engineering Club', members: 112, events: 8 },
        { name: 'Cultural Dance Troupe', members: 56, events: 15 },
        { name: 'Debate Society', members: 45, events: 10 },
    ],
};

// Sample data for event reports
const eventData = {
    totalEvents: 87,
    upcomingEvents: 24,
    pastEvents: 63,
    attendanceRate: 78,
    byCategory: [
        { name: 'Workshops', count: 28, color: 'bg-emerald-500' },
        { name: 'Seminars', count: 24, color: 'bg-blue-500' },
        { name: 'Cultural', count: 18, color: 'bg-amber-500' },
        { name: 'Sports', count: 9, color: 'bg-purple-500' },
        { name: 'Academic', count: 8, color: 'bg-red-500' },
    ],
    recentEvents: [
        { name: 'Career Fair 2025', attendees: 342, date: '2025-03-12' },
        { name: 'Leadership Workshop', attendees: 78, date: '2025-03-18' },
        { name: 'Student Mixer Night', attendees: 156, date: '2025-03-25' },
        { name: 'Financial Aid Seminar', attendees: 124, date: '2025-04-02' },
        { name: 'Cultural Awareness Day', attendees: 267, date: '2025-04-08' },
    ],
};

// Sample generated reports list
const generatedReports = [
    { id: 1, title: 'Scholarship Distribution Q1 2025', date: '2025-03-31', type: 'Scholarship', format: 'PDF' },
    { id: 2, title: 'Student Activities Report - March 2025', date: '2025-04-01', type: 'Event', format: 'Excel' },
    { id: 3, title: 'Organization Membership Analysis', date: '2025-03-25', type: 'Organization', format: 'PDF' },
    { id: 4, title: 'Annual Scholarship Impact Report 2024', date: '2025-03-15', type: 'Scholarship', format: 'PDF' },
    { id: 5, title: 'Student Engagement Metrics Q1 2025', date: '2025-04-05', type: 'General', format: 'Excel' },
];

export default function ReportsPage() {
    // Removing unused auth variable since it's not being used

    // Calculate percentages for scholarship status
    const total = scholarshipData.totalApplicants;
    const approvedPercent = Math.round((scholarshipData.approved / total) * 100);
    const rejectedPercent = Math.round((scholarshipData.rejected / total) * 100);
    const pendingPercent = Math.round((scholarshipData.pending / total) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OSAS Staff - Reports" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header with action buttons */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Reports Dashboard</h1>

                    <div className="flex space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate Report
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Scholarship Report</DropdownMenuItem>
                                <DropdownMenuItem>Student Organizations Report</DropdownMenuItem>
                                <DropdownMenuItem>Events Report</DropdownMenuItem>
                                <DropdownMenuItem>Comprehensive Summary</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                                <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                                <DropdownMenuItem>This Quarter</DropdownMenuItem>
                                <DropdownMenuItem>This Year</DropdownMenuItem>
                                <DropdownMenuItem>Custom Range</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <GraduationCap className="h-8 w-8 text-emerald-600 mb-2" />
                            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{scholarshipData.totalApplicants}</p>
                            <p className="text-sm text-muted-foreground">Scholarship Applications</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50/80 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <Users className="h-8 w-8 text-blue-600 mb-2" />
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{orgData.totalOrgs}</p>
                            <p className="text-sm text-muted-foreground">Student Organizations</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50/80 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <Calendar className="h-8 w-8 text-amber-600 mb-2" />
                            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{eventData.totalEvents}</p>
                            <p className="text-sm text-muted-foreground">Events Organized</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50/80 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">12</p>
                            <p className="text-sm text-muted-foreground">Report Templates</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Reports Content Tabs */}
                <Tabs defaultValue="scholarships" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                        <TabsTrigger value="organizations">Student Organizations</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>

                    {/* Scholarships Tab */}
                    <TabsContent value="scholarships">
                        <div className="grid gap-4 lg:grid-cols-3">
                            {/* Scholarship Status */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Application Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Approved</span>
                                                <span className="font-semibold">{scholarshipData.approved} ({approvedPercent}%)</span>
                                            </div>
                                            <Progress value={approvedPercent} className="bg-muted h-2" style={{ "--progress-foreground": "rgb(34, 197, 94)" } as React.CSSProperties} />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Pending</span>
                                                <span className="font-semibold">{scholarshipData.pending} ({pendingPercent}%)</span>
                                            </div>
                                            <Progress value={pendingPercent} className="bg-muted h-2" style={{ "--progress-foreground": "rgb(245, 158, 11)" } as React.CSSProperties} />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Rejected</span>
                                                <span className="font-semibold">{scholarshipData.rejected} ({rejectedPercent}%)</span>
                                            </div>
                                            <Progress value={rejectedPercent} className="bg-muted h-2" style={{ "--progress-foreground": "rgb(239, 68, 68)" } as React.CSSProperties} />
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-medium mb-3">By Category</h4>
                                            <div className="space-y-2">
                                                {scholarshipData.byCategory.map((category, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                                                        <span className="text-sm">{category.name}</span>
                                                        <span className="text-sm text-muted-foreground ml-auto">{category.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Data
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Monthly Applications Chart */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Monthly Scholarship Applications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-end gap-2 pt-5 pb-2">
                                        {scholarshipData.monthlyApplications.map((item, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1">
                                                <div
                                                    className="w-full bg-emerald-500 rounded-t-sm"
                                                    style={{ height: `${(item.count / 80) * 100}%` }}
                                                ></div>
                                                <span className="text-xs mt-2">{item.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Total Applications: {scholarshipData.totalApplicants}</p>
                                        <p className="text-xs text-muted-foreground">Average per month: {Math.round(scholarshipData.totalApplicants / 12)}</p>
                                    </div>
                                    <Select defaultValue="year">
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="year">Year 2025</SelectItem>
                                            <SelectItem value="q1">Q1 2025</SelectItem>
                                            <SelectItem value="q2">Q2 2025</SelectItem>
                                            <SelectItem value="q3">Q3 2025</SelectItem>
                                            <SelectItem value="q4">Q4 2025</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Organizations Tab */}
                    <TabsContent value="organizations">
                        <div className="grid gap-4 lg:grid-cols-3">
                            {/* Organization Categories */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Organization Categories
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 pb-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{orgData.totalOrgs}</span>
                                                <span className="text-xs text-muted-foreground">Total Organizations</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">{orgData.activeMembers}</span>
                                                <span className="text-xs text-muted-foreground">Active Members</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-medium mb-3">By Category</h4>
                                            <div className="space-y-3">
                                                {orgData.byCategory.map((category, index) => (
                                                    <div key={index}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm">{category.name}</span>
                                                            <span className="text-sm font-medium">{category.count}</span>
                                                        </div>
                                                        <Progress
                                                            value={(category.count / orgData.totalOrgs) * 100}
                                                            className="h-2"
                                                            style={{ "--progress-foreground": category.color } as React.CSSProperties}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Data
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Top Organizations */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Top Active Organizations
                                    </CardTitle>
                                    <CardDescription>Based on membership numbers and event participation</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Organization Name</TableHead>
                                                    <TableHead>Members</TableHead>
                                                    <TableHead>Events Held</TableHead>
                                                    <TableHead>Activity Score</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {orgData.topOrgs.map((org, index) => {
                                                    // Calculate an "activity score" based on members and events
                                                    const activityScore = Math.round((org.members * 0.6) + (org.events * 4));
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">{org.name}</TableCell>
                                                            <TableCell>{org.members}</TableCell>
                                                            <TableCell>{org.events}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <span>{activityScore}</span>
                                                                    <Progress value={(activityScore / 100) * 100} className="w-20 h-2"
                                                                        style={{
                                                                            "--progress-foreground": activityScore > 80 ? "rgb(34, 197, 94)" :
                                                                                activityScore > 60 ? "rgb(16, 185, 129)" :
                                                                                    activityScore > 40 ? "rgb(245, 158, 11)" : "rgb(239, 68, 68)"
                                                                        } as React.CSSProperties} />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Organization Membership Summary</p>
                                        <p className="text-xs text-muted-foreground">Average members per organization: {Math.round(orgData.activeMembers / orgData.totalOrgs)}</p>
                                    </div>
                                    <Button variant="outline" size="sm">View All Organizations</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Events Tab */}
                    <TabsContent value="events">
                        <div className="grid gap-4 lg:grid-cols-3">
                            {/* Event Statistics */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Event Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 pb-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{eventData.totalEvents}</span>
                                                <span className="text-xs text-muted-foreground">Total Events</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">{eventData.attendanceRate}%</span>
                                                <span className="text-xs text-muted-foreground">Attendance Rate</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Past Events</span>
                                                <span className="font-semibold">{eventData.pastEvents}</span>
                                            </div>
                                            <Progress value={(eventData.pastEvents / eventData.totalEvents) * 100} className="bg-muted h-2"
                                                style={{ "--progress-foreground": "rgb(37, 99, 235)" } as React.CSSProperties} />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Upcoming Events</span>
                                                <span className="font-semibold">{eventData.upcomingEvents}</span>
                                            </div>
                                            <Progress value={(eventData.upcomingEvents / eventData.totalEvents) * 100} className="bg-muted h-2"
                                                style={{ "--progress-foreground": "rgb(16, 185, 129)" } as React.CSSProperties} />
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-medium mb-3">By Category</h4>
                                            <div className="space-y-2">
                                                {eventData.byCategory.map((category, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                                                        <span className="text-sm">{category.name}</span>
                                                        <span className="text-sm text-muted-foreground ml-auto">{category.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Data
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Recent Events */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Recent Events Performance
                                    </CardTitle>
                                    <CardDescription>Attendance and engagement metrics for recent events</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Event Name</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Attendees</TableHead>
                                                    <TableHead>Attendance Rate</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {eventData.recentEvents.map((event, index) => {
                                                    // Calculate a random "expected" attendance and the rate
                                                    const expected = Math.round(event.attendees * (100 / (60 + Math.random() * 30)));
                                                    const rate = Math.round((event.attendees / expected) * 100);

                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">{event.name}</TableCell>
                                                            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                                            <TableCell>{event.attendees}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <span>{rate}%</span>
                                                                    <Progress value={rate} className="w-20 h-2"
                                                                        style={{
                                                                            "--progress-foreground": rate > 90 ? "rgb(34, 197, 94)" :
                                                                                rate > 70 ? "rgb(16, 185, 129)" :
                                                                                    rate > 50 ? "rgb(245, 158, 11)" : "rgb(239, 68, 68)"
                                                                        } as React.CSSProperties} />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Total Attendance: 967</p>
                                        <p className="text-xs text-muted-foreground">Average per event: 193</p>
                                    </div>
                                    <Button variant="outline" size="sm">View All Events</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Generated Reports Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            Generated Reports
                        </CardTitle>
                        <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Report Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date Generated</TableHead>
                                        <TableHead>Format</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {generatedReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">{report.title}</TableCell>
                                            <TableCell>{report.type}</TableCell>
                                            <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{report.format}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost">
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}