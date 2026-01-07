import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { RenewalDeadlines, RenewalStatistics } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Calendar,
    CheckCircle,
    Clock,
    Percent,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('osas.dashboard') },
    { title: 'Renewal Applications', href: route('renewal.staff.index') },
    { title: 'Statistics', href: '#' },
];

interface StatisticsByType {
    [scholarshipType: string]: RenewalStatistics;
}

interface Props {
    statistics: RenewalStatistics;
    statisticsByType: StatisticsByType;
    deadlines: RenewalDeadlines;
    selectedPeriod: {
        semester: string;
        year: number;
    };
}

export default function Statistics({ statistics, statisticsByType, deadlines, selectedPeriod }: Props) {
    const [semester, setSemester] = useState(selectedPeriod.semester);
    const [year, setYear] = useState(selectedPeriod.year.toString());

    const handlePeriodChange = (newSemester: string, newYear: string) => {
        setSemester(newSemester);
        setYear(newYear);
        router.get(
            route('renewal.staff.statistics'),
            { semester: newSemester, year: parseInt(newYear) },
            { preserveState: true }
        );
    };

    const getScholarshipTypeDisplay = (type: string): string => {
        const types: Record<string, string> = {
            academic_full: 'Academic (Full)',
            academic_partial: 'Academic (Partial)',
            student_assistantship: 'Student Assistantship',
            performing_arts_full: 'Performing Arts (Full)',
            performing_arts_partial: 'Performing Arts (Partial)',
            economic_assistance: 'Economic Assistance',
            others: 'Other Scholarships',
        };
        return types[type] || type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Renewal Statistics" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-2xl sm:text-3xl">Renewal Statistics</CardTitle>
                                <CardDescription className="mt-2">
                                    Overview of scholarship renewal applications
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={semester}
                                    onValueChange={(value) => handlePeriodChange(value, year)}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="First">First</SelectItem>
                                        <SelectItem value="Second">Second</SelectItem>
                                        <SelectItem value="Summer">Summer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={year}
                                    onValueChange={(value) => handlePeriodChange(semester, value)}
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y} value={y}>
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Current Period Info */}
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="font-semibold text-blue-800 dark:text-blue-200">
                                Viewing: {selectedPeriod.semester} Semester {selectedPeriod.year}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                                Current renewal deadline:{' '}
                                {new Date(deadlines.current_semester.deadline).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                                    <Users className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-2xl font-bold">{statistics.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold">{statistics.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Under Review</p>
                                    <p className="text-2xl font-bold">{statistics.under_review}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold">{statistics.approved}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Rejected</p>
                                    <p className="text-2xl font-bold">{statistics.rejected}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                                    <Percent className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Approval Rate</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.approval_rate.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Approval Rate Visualization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Approval Overview</CardTitle>
                        <CardDescription>Visual breakdown of renewal decisions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-gray-500">Overall Approval Rate</span>
                                    <span className="font-medium">{statistics.approval_rate.toFixed(1)}%</span>
                                </div>
                                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${statistics.approval_rate}%` }}
                                    />
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <ArrowUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">{statistics.approved}</p>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {statistics.total > 0
                                            ? ((statistics.approved / statistics.total) * 100).toFixed(1)
                                            : 0}
                                        % of total
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {statistics.pending + statistics.under_review}
                                    </p>
                                    <p className="text-sm text-gray-500">In Progress</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {statistics.total > 0
                                            ? (
                                                  ((statistics.pending + statistics.under_review) /
                                                      statistics.total) *
                                                  100
                                              ).toFixed(1)
                                            : 0}
                                        % of total
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                        <ArrowDown className="h-6 w-6 text-red-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-red-600">{statistics.rejected}</p>
                                    <p className="text-sm text-gray-500">Rejected</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {statistics.total > 0
                                            ? ((statistics.rejected / statistics.total) * 100).toFixed(1)
                                            : 0}
                                        % of total
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics by Scholarship Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics by Scholarship Type</CardTitle>
                        <CardDescription>
                            Breakdown of renewal applications by scholarship category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(statisticsByType).length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                No data available for the selected period
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(statisticsByType).map(([type, stats]) => (
                                    <div key={type} className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                {getScholarshipTypeDisplay(type)}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {stats.total} applications
                                            </span>
                                        </div>

                                        {/* Progress bar for this type */}
                                        <div className="mb-3">
                                            <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
                                                {stats.total > 0 && (
                                                    <>
                                                        <div
                                                            className="bg-green-500"
                                                            style={{
                                                                width: `${(stats.approved / stats.total) * 100}%`,
                                                            }}
                                                        />
                                                        <div
                                                            className="bg-yellow-500"
                                                            style={{
                                                                width: `${((stats.pending + stats.under_review) / stats.total) * 100}%`,
                                                            }}
                                                        />
                                                        <div
                                                            className="bg-red-500"
                                                            style={{
                                                                width: `${(stats.rejected / stats.total) * 100}%`,
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                            <div>
                                                <p className="font-medium text-yellow-600">{stats.pending}</p>
                                                <p className="text-xs text-gray-500">Pending</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-blue-600">
                                                    {stats.under_review}
                                                </p>
                                                <p className="text-xs text-gray-500">In Review</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-600">{stats.approved}</p>
                                                <p className="text-xs text-gray-500">Approved</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-red-600">{stats.rejected}</p>
                                                <p className="text-xs text-gray-500">Rejected</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
