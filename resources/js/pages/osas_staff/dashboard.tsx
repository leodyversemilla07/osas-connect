import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { ClipboardList, FileCheck, BookOpen, FileText } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    const { auth: pageAuth, pendingApplications = [], recentDocuments = [] } = usePage<SharedData & {
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

            <div className="flex h-full flex-1 flex-col space-y-8 p-6 lg:p-8">
                {/* Header Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-medium text-foreground">
                                Welcome, {user.first_name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                OSAS Staff Dashboard
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-none">
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Pending Applications</p>
                                <p className="text-3xl font-light text-foreground">
                                    {pendingApplications?.length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none">
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Active Scholarships</p>
                                <p className="text-3xl font-light text-foreground">24</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none">
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Recent Documents</p>
                                <p className="text-3xl font-light text-foreground">
                                    {recentDocuments?.length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="border-border/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium text-foreground">Recent Activity</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {pendingApplications?.map((app) => (
                                <div key={app.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">{app.studentName}</p>
                                        <p className="text-xs text-muted-foreground">{app.scholarshipName}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={getStatusVariant(app.status)} className="text-xs">
                                            {app.status}
                                        </Badge>
                                        <Button variant="ghost" size="sm">Review</Button>
                                    </div>
                                </div>
                            ))}

                            {pendingApplications?.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="text-sm">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-medium text-foreground">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="border-border/50 hover:border-border transition-colors">
                                <CardContent className="p-4">
                                    <Button variant="ghost" className="w-full h-auto p-0 min-h-[60px]" asChild>
                                        <a href="/applications" className="flex items-center gap-3">
                                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm">Review Applications</span>
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-border transition-colors">
                                <CardContent className="p-4">
                                    <Button variant="ghost" className="w-full h-auto p-0 min-h-[60px]" asChild>
                                        <a href="/documents" className="flex items-center gap-3">
                                            <FileCheck className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm">Manage Documents</span>
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-border transition-colors">
                                <CardContent className="p-4">
                                    <Button variant="ghost" className="w-full h-auto p-0 min-h-[60px]" asChild>
                                        <a href="/scholarships" className="flex items-center gap-3">
                                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm">Manage Scholarships</span>
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-border transition-colors">
                                <CardContent className="p-4">
                                    <Button variant="ghost" className="w-full h-auto p-0 min-h-[60px]" asChild>
                                        <a href="/reports" className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm">Generate Reports</span>
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}