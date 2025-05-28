import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    FileText, 
    Download, 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    Users, 
    DollarSign,
    Calendar,
    Filter
} from "lucide-react";

interface ReportData {
    applications: {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
    };
    scholarships: {
        total_amount: number;
        active_recipients: number;
        completion_rate: number;
    };
    monthly_trends: Array<{
        month: string;
        applications: number;
        approvals: number;
    }>;
}

interface ReportsPageProps {
    reports: ReportData;
}

export default function Reports({ reports }: ReportsPageProps) {
    const defaultReports: ReportData = {
        applications: {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0
        },
        scholarships: {
            total_amount: 0,
            active_recipients: 0,
            completion_rate: 0
        },
        monthly_trends: []
    };

    const reportData = reports || defaultReports;

    const statisticsCards = [
        {
            title: "Total Applications",
            value: reportData.applications.total.toLocaleString(),
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Active Recipients",
            value: reportData.scholarships.active_recipients.toLocaleString(),
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Total Amount Disbursed",
            value: `₱${reportData.scholarships.total_amount.toLocaleString()}`,
            icon: DollarSign,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Completion Rate",
            value: `${reportData.scholarships.completion_rate}%`,
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        }
    ];

    const reportCategories = [
        {
            title: "Application Summary",
            description: "Overview of scholarship applications by status",
            icon: FileText,
            actions: ["Export PDF", "Export Excel"]
        },
        {
            title: "Financial Report",
            description: "Scholarship disbursements and budget analysis",
            icon: DollarSign,
            actions: ["Generate Report", "Export Data"]
        },
        {
            title: "Student Performance",
            description: "Academic performance of scholarship recipients",
            icon: BarChart3,
            actions: ["View Report", "Download"]
        },
        {
            title: "Monthly Analytics",
            description: "Monthly trends and application patterns",
            icon: TrendingUp,
            actions: ["View Trends", "Export Chart"]
        }
    ];

    return (
        <AppLayout>
            <Head title="Reports & Analytics" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Reports & Analytics
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Comprehensive reports and insights on scholarship programs
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter Period
                        </Button>
                        <Button variant="outline" size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Date Range
                        </Button>
                    </div>
                </div>

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statisticsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                            <Icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Reports Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="financial">Financial</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reportCategories.map((category, index) => {
                                const Icon = category.icon;
                                return (
                                    <Card key={index}>
                                        <CardHeader>
                                            <div className="flex items-center">
                                                <Icon className="h-5 w-5 text-gray-600 mr-2" />
                                                <CardTitle className="text-lg">{category.title}</CardTitle>
                                            </div>
                                            <CardDescription>{category.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex space-x-2">
                                                {category.actions.map((action, actionIndex) => (
                                                    <Button 
                                                        key={actionIndex}
                                                        variant={actionIndex === 0 ? "default" : "outline"}
                                                        size="sm"
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        {action}
                                                    </Button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="applications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Status Distribution</CardTitle>
                                <CardDescription>
                                    Breakdown of scholarship applications by current status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {reportData.applications.approved}
                                        </div>
                                        <div className="text-sm text-gray-600">Approved</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {reportData.applications.pending}
                                        </div>
                                        <div className="text-sm text-gray-600">Pending</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">
                                            {reportData.applications.rejected}
                                        </div>
                                        <div className="text-sm text-gray-600">Rejected</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {reportData.applications.total}
                                        </div>
                                        <div className="text-sm text-gray-600">Total</div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Application Report
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="financial" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Summary</CardTitle>
                                <CardDescription>
                                    Scholarship disbursements and budget allocation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Financial charts and reports will be displayed here</p>
                                    <Button className="mt-4">
                                        <Download className="mr-2 h-4 w-4" />
                                        Generate Financial Report
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trends & Analytics</CardTitle>
                                <CardDescription>
                                    Application trends and performance metrics over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Analytics charts and trends will be displayed here</p>
                                    <Button className="mt-4">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Analytics Report
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
