import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UsersIcon, DollarSignIcon, GraduationCapIcon, ClipboardListIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface Statistics {
    overview: {
        total_students: number;
        active_scholarships: number;
        total_applications: number;
        pending_applications: number;
        approved_applications: number;
        total_disbursed: number;
        students_with_scholarships: number;
    };
    applications: {
        total: number;
        by_status: Record<string, number>;
        by_scholarship_type: Record<string, number>;
        monthly_trend: Record<string, number>;
        approval_rate: number;
        completion_rate: number;
        average_processing_time: number;
    };
    scholarships: {
        total_scholarships: number;
        active_scholarships: number;
        scholarship_breakdown: Array<{
            name: string;
            type: string;
            total_applications: number;
            approved_applications: number;
            approval_rate: number;
            total_stipend_budget: number;
            disbursed_amount: number;
        }>;
        most_popular: {
            name: string;
            type: string;
            total_applications: number;
            approved_applications: number;
            approval_rate: number;
            total_stipend_budget: number;
            disbursed_amount: number;
        } | null;
        highest_approval_rate: {
            name: string;
            type: string;
            total_applications: number;
            approved_applications: number;
            approval_rate: number;
            total_stipend_budget: number;
            disbursed_amount: number;
        } | null;
    };
    interviews: {
        total: number;
        by_status: Record<string, number>;
        monthly_trend: Record<string, number>;
        completion_rate: number;
        no_show_rate: number;
        average_score: number;
        by_type: Record<string, number>;
    };
    stipends: {
        total_amount: number;
        disbursed_amount: number;
        pending_amount: number;
        disbursement_rate: number;
        by_scholarship_type: Record<string, number>;
        monthly_disbursements: Record<string, number>;
        average_stipend_amount: number;
        recipients_count: number;
    };
    trends: {
        applications_growth: number;
        disbursements_growth: number;
        current_year: number;
        previous_year: number;
    };
    monthly_breakdown: Array<{
        month: string;
        applications: number;
        approvals: number;
        interviews: number;
        disbursements: number;
    }>;
    performance_metrics: {
        avg_application_processing_time: number;
        approval_rate_trend: Array<{ month: string; rate: number }>;
        student_satisfaction_score: number;
        fund_utilization_rate: number;
    };
}

interface Props {
    statistics: Statistics;
    current_year: string;
    available_years: number[];
    scholarship_types: string[];
}

export default function AnalyticsDashboard({ statistics, current_year, available_years, scholarship_types }: Props) {
    const [selectedYear, setSelectedYear] = useState<string>(current_year);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        router.get('/osas-staff/analytics', { year }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Prepare chart data
    const monthlyTrendData = Object.entries(statistics.applications.monthly_trend).map(([month, applications]) => ({
        month,
        applications,
        approvals: statistics.applications.by_status.approved || 0,
        interviews: statistics.interviews.monthly_trend[month] || 0,
    }));

    const applicationStatusData = Object.entries(statistics.applications.by_status).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
    }));

    const scholarshipTypeData = Object.entries(statistics.applications.by_scholarship_type).map(([type, count]) => ({
        name: type,
        value: count,
    }));

    const monthlyDisbursementData = Object.entries(statistics.stipends.monthly_disbursements).map(([month, amount]) => ({
        month,
        amount,
    }));

    return (
        <>
            <Head title="Analytics Dashboard" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Comprehensive insights into scholarship management performance
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Select value={selectedYear} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {available_years.map(year => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/osas-staff/analytics/export/applications')}
                        >
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistics.overview.total_students)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(statistics.overview.students_with_scholarships)} with scholarships
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Applications</CardTitle>
                            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistics.applications.total)}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.applications.approval_rate}% approval rate
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(statistics.overview.total_disbursed)}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.stipends.disbursement_rate}% of total budget
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
                            <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(statistics.overview.active_scholarships)}</div>
                            <p className="text-xs text-muted-foreground">
                                Out of {statistics.scholarships.total_scholarships} total
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trend Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Year-over-Year Growth</CardTitle>
                            <CardDescription>
                                Comparing {statistics.trends.current_year} vs {statistics.trends.previous_year}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Applications Growth</span>
                                <Badge variant={statistics.trends.applications_growth >= 0 ? "default" : "destructive"}>
                                    {statistics.trends.applications_growth >= 0 ? '+' : ''}{statistics.trends.applications_growth}%
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Disbursements Growth</span>
                                <Badge variant={statistics.trends.disbursements_growth >= 0 ? "default" : "destructive"}>
                                    {statistics.trends.disbursements_growth >= 0 ? '+' : ''}{statistics.trends.disbursements_growth}%
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Key performance indicators</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Avg. Processing Time</span>
                                <span className="text-sm font-bold">{statistics.applications.average_processing_time} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Interview Completion Rate</span>
                                <span className="text-sm font-bold">{statistics.interviews.completion_rate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Student Satisfaction</span>
                                <span className="text-sm font-bold">{statistics.performance_metrics.student_satisfaction_score}/5</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Application Trends</CardTitle>
                            <CardDescription>Applications and approvals over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="applications" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        name="Applications"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="interviews" 
                                        stroke="#82ca9d" 
                                        strokeWidth={2}
                                        name="Interviews"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Application Status Distribution</CardTitle>
                            <CardDescription>Current application statuses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={applicationStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {applicationStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Scholarship Type Distribution</CardTitle>
                            <CardDescription>Applications by scholarship type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={scholarshipTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Disbursements</CardTitle>
                            <CardDescription>Stipend disbursements by month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyDisbursementData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#82ca9d" 
                                        fill="#82ca9d" 
                                        fillOpacity={0.6}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Scholarship Performance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Scholarship Performance</CardTitle>
                        <CardDescription>Detailed breakdown by scholarship program</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Scholarship Name</th>
                                        <th className="text-left p-2">Type</th>
                                        <th className="text-center p-2">Applications</th>
                                        <th className="text-center p-2">Approved</th>
                                        <th className="text-center p-2">Approval Rate</th>
                                        <th className="text-right p-2">Budget</th>
                                        <th className="text-right p-2">Disbursed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.scholarships.scholarship_breakdown.map((scholarship, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2 font-medium">{scholarship.name}</td>
                                            <td className="p-2">
                                                <Badge variant="outline">{scholarship.type}</Badge>
                                            </td>
                                            <td className="text-center p-2">{scholarship.total_applications}</td>
                                            <td className="text-center p-2">{scholarship.approved_applications}</td>
                                            <td className="text-center p-2">{scholarship.approval_rate}%</td>
                                            <td className="text-right p-2">{formatCurrency(scholarship.total_stipend_budget)}</td>
                                            <td className="text-right p-2">{formatCurrency(scholarship.disbursed_amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
