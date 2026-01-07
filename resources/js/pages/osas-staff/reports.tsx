import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router } from '@inertiajs/react';
import { BarChart3Icon, DownloadIcon, FileTextIcon, FilterIcon } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ScholarshipDistribution {
    total_recipients: number;
    by_scholarship_type: Record<string, number>;
    by_course: Record<string, number>;
    by_year_level: Record<string, number>;
    gender_distribution: Record<string, number>;
    total_amount_distributed: number;
}

interface FundUtilization {
    scholarship_name: string;
    scholarship_type: string;
    total_budget: number;
    total_disbursed: number;
    utilization_rate: number;
    recipients_count: number;
    average_per_recipient: number;
}

interface Props {
    scholarship_distribution: ScholarshipDistribution;
    fund_utilization: FundUtilization[];
    available_years: number[];
    scholarship_types: string[];
    current_filters: {
        year?: string;
        scholarship_type?: string;
    };
}

export default function Reports({ scholarship_distribution, fund_utilization, available_years, scholarship_types, current_filters }: Props) {
    const [filters, setFilters] = useState(current_filters);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        router.get('/osas-staff/analytics/reports', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilters({});
        router.get(
            '/osas-staff/analytics/reports',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const exportApplications = () => {
        const params = new URLSearchParams(filters);
        window.open(`/osas-staff/analytics/export/applications?${params.toString()}`);
    };

    // Prepare chart data
    const scholarshipTypeData = Object.entries(scholarship_distribution.by_scholarship_type).map(([type, count]) => ({
        name: type,
        value: count,
    }));

    const courseData = Object.entries(scholarship_distribution.by_course).map(([course, count]) => ({
        name: course,
        value: count,
    }));

    const genderData = Object.entries(scholarship_distribution.gender_distribution).map(([gender, count]) => ({
        name: gender,
        value: count,
    }));

    const utilizationData = fund_utilization.map((item) => ({
        name: item.scholarship_name,
        budget: item.total_budget,
        disbursed: item.total_disbursed,
        utilization: item.utilization_rate,
    }));

    return (
        <>
            <Head title="Reports & Analytics" />

            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground">Detailed reports and data analysis for scholarship programs</p>
                    </div>

                    <Button onClick={exportApplications} className="flex items-center gap-2">
                        <DownloadIcon className="h-4 w-4" />
                        Export Data
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FilterIcon className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Year:</label>
                                <Select value={filters.year || ''} onValueChange={(value) => handleFilterChange('year', value)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="All years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All years</SelectItem>
                                        {available_years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Scholarship Type:</label>
                                <Select
                                    value={filters.scholarship_type || ''}
                                    onValueChange={(value) => handleFilterChange('scholarship_type', value)}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All types</SelectItem>
                                        {scholarship_types.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {(filters.year || filters.scholarship_type) && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
                            <FileTextIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(scholarship_distribution.total_recipients)}</div>
                            <p className="text-muted-foreground text-xs">Scholarship recipients</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Distributed</CardTitle>
                            <BarChart3Icon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(scholarship_distribution.total_amount_distributed)}</div>
                            <p className="text-muted-foreground text-xs">In scholarship funds</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
                            <BarChart3Icon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {fund_utilization.length > 0
                                    ? (fund_utilization.reduce((sum, item) => sum + item.utilization_rate, 0) / fund_utilization.length).toFixed(1)
                                    : 0}
                                %
                            </div>
                            <p className="text-muted-foreground text-xs">Fund utilization rate</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Distribution Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recipients by Scholarship Type</CardTitle>
                            <CardDescription>Distribution of recipients across scholarship programs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={scholarshipTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {scholarshipTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recipients by Course</CardTitle>
                            <CardDescription>Distribution across academic programs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={courseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gender Distribution</CardTitle>
                            <CardDescription>Recipients by gender</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {genderData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fund Utilization</CardTitle>
                            <CardDescription>Budget vs disbursed amounts by scholarship</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={utilizationData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                                    <Legend />
                                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                                    <Bar dataKey="disbursed" fill="#82ca9d" name="Disbursed" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Fund Utilization Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Fund Utilization</CardTitle>
                        <CardDescription>Complete breakdown of scholarship fund usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-3 text-left">Scholarship</th>
                                        <th className="p-3 text-left">Type</th>
                                        <th className="p-3 text-right">Budget</th>
                                        <th className="p-3 text-right">Disbursed</th>
                                        <th className="p-3 text-center">Utilization</th>
                                        <th className="p-3 text-center">Recipients</th>
                                        <th className="p-3 text-right">Avg per Recipient</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fund_utilization.map((item, index) => (
                                        <tr key={index} className="hover:bg-muted/50 border-b">
                                            <td className="p-3 font-medium">{item.scholarship_name}</td>
                                            <td className="p-3">
                                                <Badge variant="outline">{item.scholarship_type}</Badge>
                                            </td>
                                            <td className="p-3 text-right">{formatCurrency(item.total_budget)}</td>
                                            <td className="p-3 text-right">{formatCurrency(item.total_disbursed)}</td>
                                            <td className="p-3 text-center">
                                                <Badge
                                                    variant={
                                                        item.utilization_rate >= 80
                                                            ? 'default'
                                                            : item.utilization_rate >= 50
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                >
                                                    {item.utilization_rate}%
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center">{item.recipients_count}</td>
                                            <td className="p-3 text-right">{formatCurrency(item.average_per_recipient)}</td>
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
