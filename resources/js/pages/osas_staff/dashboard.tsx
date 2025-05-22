import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { AlertCircle, ClipboardList, FileCheck, BookOpen, FileText } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    const user = pageAuth.user;    // Sample announcements
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
                            <div className="flex items-center gap-4">
                                <ClipboardList className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{pendingApplications.length}</p>
                                    <p className="text-sm text-muted-foreground">Pending Applications</p>
                                    <p className="text-xs text-muted-foreground mt-1">As of {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50/80 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                                <div>
                                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">24</p>
                                    <p className="text-sm text-muted-foreground">Active Scholarships</p>
                                    <p className="text-xs text-muted-foreground mt-1">Current semester</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50/80 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{recentDocuments.length}</p>
                                    <p className="text-sm text-muted-foreground">Recent Documents</p>
                                    <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Left Column - Applications and Documents */}
                    <div className="flex flex-col gap-4">
                        {/* Announcements */}
                        <Card className="bg-white dark:bg-slate-950">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Announcements
                                </CardTitle>
                                <Button variant="outline" size="sm">New Announcement</Button>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    {announcements.map(announcement => (
                                        <div key={announcement.id} className="rounded-lg border p-4 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-lg">{announcement.title}</h4>
                                                <Badge variant="outline">{new Date(announcement.date).toLocaleDateString()}</Badge>
                                            </div>
                                            <p className="text-muted-foreground">{announcement.content}</p>
                                            <div className="mt-3 flex justify-end gap-2">
                                                <Button size="sm" variant="ghost">Edit</Button>
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 dark:text-red-400">Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>                        
                        </Card>

                        {/* Recent Documents */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <FileCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Recent Document Submissions
                                </CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/documents">View All</a>
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-4">
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

                    {/* Right Column - Pending Applications */}
                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    Pending Applications
                                </CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/applications">View All</a>
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-4">
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
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={`/applications/${app.id}/review`}
                                                                    className="text-sm"
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}