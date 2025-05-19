import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import TaskCard from '@/components/task-card';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, AlertCircle, Users, ClipboardList, Upload, FileCheck, Clock } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff Dashboard',
        href: '/osas_staff/dashboard',
    },
];

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
} as const;

export default function StaffDashboard() {
    const { auth: pageAuth } = usePage<SharedData>().props;
    const user = pageAuth.user;

    // Sample staff tasks
    const upcomingTasks = [
        { id: 1, title: 'Review Scholarship Applications', dueDate: '2025-04-15', priority: 'high' },
        { id: 2, title: 'Student Organization Meeting', dueDate: '2025-04-12', priority: 'medium' },
        { id: 3, title: 'File Monthly Report', dueDate: '2025-04-30', priority: 'high' },
        { id: 4, title: 'Event Planning Committee', dueDate: '2025-04-20', priority: 'medium' }
    ];

    // Sample announcements
    const announcements = [
        { id: 1, title: 'Staff Meeting', date: '2025-04-10', content: 'Monthly staff meeting at 2:00 PM in the Conference Room.' },
        { id: 2, title: 'Upcoming Training', date: '2025-04-18', content: 'Mandatory training session on the new student support system.' }
    ];

    // Sample pending applications
    const pendingApplications = [
        {
            id: 1,
            studentName: 'Maria Santos',
            scholarshipName: 'Academic Merit Scholarship',
            dateSubmitted: '2025-04-05',
            status: 'pending',
            studentId: 'ST-2025-1001'
        },
        {
            id: 2,
            studentName: 'Juan Cruz',
            scholarshipName: 'Need-Based Financial Aid',
            dateSubmitted: '2025-04-03',
            status: 'pending',
            studentId: 'ST-2025-1042'
        },
        {
            id: 3,
            studentName: 'Ana Reyes',
            scholarshipName: 'Student Assistantship Program',
            dateSubmitted: '2025-04-01',
            status: 'pending',
            studentId: 'ST-2025-1089'
        }
    ];

    // Sample document submissions
    const recentDocuments = [
        { id: 1, studentName: 'Pedro Garcia', documentType: 'Transcript of Records', submissionDate: '2025-04-07', status: 'pending' },
        { id: 2, studentName: 'Sofia Lopez', documentType: 'Certificate of Registration', submissionDate: '2025-04-06', status: 'approved' },
        { id: 3, studentName: 'Carlo Tan', documentType: 'Income Tax Return', submissionDate: '2025-04-05', status: 'rejected' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OSAS Staff Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Welcome, {user.first_name}!</h1>
                        <p className="text-muted-foreground">Manage scholarship applications and student support services</p>
                    </CardContent>
                </Card>

                {/* Main Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{pendingApplications.length}</p>
                            <p className="text-sm text-muted-foreground">Pending Applications</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50/80 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">24</p>
                            <p className="text-sm text-muted-foreground">Active Scholarships</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50/80 dark:bg-green-900/20 border-green-100 dark:border-green-800/30">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400">86%</p>
                            <p className="text-sm text-muted-foreground">Tasks Completed</p>
                            <Progress value={86} className="mt-2 bg-green-100 dark:bg-green-900/40" />
                        </CardContent>
                    </Card>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        {/* Pending Applications */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Pending Applications
                                </CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/applications">View All</a>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {pendingApplications.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Scholarship</TableHead>
                                                    <TableHead>Submitted</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pendingApplications.map((app) => (
                                                    <TableRow key={app.id} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">
                                                            <div>
                                                                {app.studentName}
                                                                <p className="text-xs text-muted-foreground">{app.studentId}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{app.scholarshipName}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">
                                                                    {new Date(app.dateSubmitted).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={`/applications/${app.id}/review`}
                                                                    className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                    title="Review Application"
                                                                >
                                                                    Review
                                                                </a>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="mt-2">No pending applications</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tasks Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Tasks & Responsibilities
                                </CardTitle>
                                <Button variant="outline" size="sm">Add Task</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingTasks.map(task => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Recent Document Submissions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentDocuments.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-medium">{doc.studentName}</p>
                                                <p className="text-sm text-muted-foreground">{doc.documentType}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(doc.submissionDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={statusColors[doc.status as keyof typeof statusColors]}>
                                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                </Badge>
                                                <Button size="sm" variant="outline">Review</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                        {/* Calendar Card */}
                        <Card className="aspect-square">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Calendar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center flex-1">
                                <Calendar className="w-full" />
                            </CardContent>
                        </Card>

                        {/* Announcements */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Announcements
                                </CardTitle>
                                <Button variant="outline" size="sm">New Announcement</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {announcements.map(announcement => (
                                        <div key={announcement.id} className="border-b pb-3 last:border-0 last:pb-0">
                                            <h4 className="font-medium">{announcement.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-1">{announcement.date}</p>
                                            <p>{announcement.content}</p>
                                            <div className="mt-2 flex justify-end gap-2">
                                                <Button size="sm" variant="ghost">Edit</Button>
                                                <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400">Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href="#" className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition text-center">
                                        <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">New Report</span>
                                    </a>
                                    <a href="#" className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition text-center">
                                        <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.022A4.978 4.978 0 0012 12a4.979 4.979 0 00-3-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Student Info</span>
                                    </a>
                                    <a href="#" className="flex flex-col items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition text-center">
                                        <Users className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2" />
                                        <span className="text-sm">Schedule Meeting</span>
                                    </a>
                                    <a href="#" className="flex flex-col items-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition text-center">
                                        <Upload className="h-6 w-6 text-rose-600 dark:text-rose-400 mb-2" />
                                        <span className="text-sm">Upload Forms</span>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Student Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Active Scholarship Recipients</span>
                                            <span className="font-semibold">78/120</span>
                                        </div>
                                        <Progress value={65} className="bg-emerald-100 dark:bg-emerald-900/40" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Application Approval Rate</span>
                                            <span className="font-semibold">72%</span>
                                        </div>
                                        <Progress value={72} className="bg-amber-100 dark:bg-amber-900/40" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Document Verification Rate</span>
                                            <span className="font-semibold">93%</span>
                                        </div>
                                        <Progress value={93} className="bg-green-100 dark:bg-green-900/40" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}