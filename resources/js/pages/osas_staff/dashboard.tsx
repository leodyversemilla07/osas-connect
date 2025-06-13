import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { AlertCircle, ClipboardList, FileCheck, BookOpen, FileText, Calendar } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
        pending: 'outline',
        approved: 'default',
        rejected: 'destructive'
    };
    return variants[status] || 'secondary';
};

export default function StaffDashboard() {
    const { auth: pageAuth, announcements = [], pendingApplications = [], recentDocuments = [] } = usePage<SharedData & {
        announcements: Array<{
            id: number;
            title: string;
            date: string;
            content: string;
        }>;
        pendingApplications: Array<{
            id: number;
            studentName: string;
            scholarshipName: string;
            dateSubmitted: string;
            status: string;
            studentId: string;
        }>;
        recentDocuments: Array<{
            id: number;
            studentName: string;
            documentType: string;
            submissionDate: string;
            status: string;
        }>;
    }>().props;
    const user = pageAuth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OSAS Staff Dashboard" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:space-y-8 sm:p-6 lg:space-y-10 lg:p-8">
                {/* Header Section */}
                <div className="pb-6 lg:pb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center ring-2 ring-emerald-200 dark:ring-emerald-800">
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                                    Welcome, {user.first_name}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base font-medium">
                                    OSAS Staff • Scholarship Management
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Button variant="outline" size="sm" className="min-h-[44px] px-4 font-medium">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Alerts</span>
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6 lg:mt-8">
                        <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                            <p className="text-emerald-800 dark:text-emerald-400 font-medium">
                                Manage scholarship applications and student support services
                            </p>
                        </div>
                    </div>
                    <Separator className="mt-6 lg:mt-8" />
                </div>

                {/* Main Stats */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Pending Applications
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                                {pendingApplications?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Awaiting review
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Active Scholarships
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                                24
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Current semester
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Recent Documents
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                                {recentDocuments?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Last 7 days
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Announcements Section */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">Announcements</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Recent announcements and updates
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="min-h-[44px] px-4">
                            New Announcement
                        </Button>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                        {announcements?.map((announcement) => (
                            <Card key={announcement.id} className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
                                <CardContent className="p-4 lg:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{announcement.title}</h4>
                                                <Badge variant="outline">
                                                    {new Date(announcement.date).toLocaleDateString()}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {announcement.content}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="min-h-[44px] px-4"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="min-h-[44px] px-4 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {announcements?.length === 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="text-center py-12 lg:py-16 text-gray-500 dark:text-gray-400">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="mb-2 text-base font-medium">No announcements yet.</p>
                                    <p className="text-sm">Create your first announcement to get started.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Recent Documents Section */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">Recent Document Submissions</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Documents submitted for review
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="min-h-[44px] px-4">
                            View All
                        </Button>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                        {recentDocuments?.map((doc) => (
                            <Card key={doc.id} className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4 lg:p-6">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{doc.studentName}</h4>
                                                <Badge variant={getStatusVariant(doc.status)}>
                                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{doc.documentType}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Submitted: {new Date(doc.submissionDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-end">
                                        <Button variant="outline" size="sm" className="min-h-[44px] px-4">
                                            Review
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {recentDocuments?.length === 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="text-center py-12 lg:py-16 text-gray-500 dark:text-gray-400">
                                    <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="mb-2 text-base font-medium">No recent document submissions.</p>
                                    <p className="text-sm">Documents will appear here when submitted.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Pending Applications Section */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">Pending Applications</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Applications awaiting review
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="min-h-[44px] px-4">
                            View All
                        </Button>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                        {pendingApplications?.map((app) => (
                            <Card key={app.id} className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4 lg:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{app.studentName}</h4>
                                                <Badge variant={getStatusVariant(app.status)}>
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {app.scholarshipName}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5">
                                                    <ClipboardList className="h-3 w-3" />
                                                    ID: {app.studentId}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    Submitted: {new Date(app.dateSubmitted).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="min-h-[44px] px-4 sm:mt-0"
                                        >
                                            Review
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {pendingApplications?.length === 0 && (
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardContent className="text-center py-12 lg:py-16 text-gray-500 dark:text-gray-400">
                                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="mb-2 text-base font-medium">No pending applications.</p>
                                    <p className="text-sm">Applications awaiting review will appear here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <Card className="border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-4 lg:pb-6">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 lg:text-xl">Quick Actions</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            Common tasks and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 pt-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 lg:p-6">
                                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                                    <a href="/applications" className="flex flex-col items-center gap-3 text-center">
                                        <ClipboardList className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                                        <div>
                                            <div className="font-medium text-sm lg:text-base">Review Applications</div>
                                            <div className="text-xs text-muted-foreground mt-1">Process submissions</div>
                                        </div>
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 lg:p-6">
                                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                                    <a href="/documents" className="flex flex-col items-center gap-3 text-center">
                                        <FileCheck className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                                        <div>
                                            <div className="font-medium text-sm lg:text-base">Manage Documents</div>
                                            <div className="text-xs text-muted-foreground mt-1">Review submissions</div>
                                        </div>
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 lg:p-6">
                                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                                    <a href="/scholarships" className="flex flex-col items-center gap-3 text-center">
                                        <BookOpen className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                                        <div>
                                            <div className="font-medium text-sm lg:text-base">Manage Scholarships</div>
                                            <div className="text-xs text-muted-foreground mt-1">Edit programs</div>
                                        </div>
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
                            <CardContent className="p-4 lg:p-6">
                                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                                    <a href="/reports" className="flex flex-col items-center gap-3 text-center">
                                        <FileText className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                                        <div>
                                            <div className="font-medium text-sm lg:text-base">Generate Reports</div>
                                            <div className="text-xs text-muted-foreground mt-1">View analytics</div>
                                        </div>
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}