import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar, DollarSign, Eye, GraduationCap, Users } from 'lucide-react';

interface Scholarship {
    id: number;
    name: string;
    type: string;
    amount: number;
    description?: string;
    requirements?: string;
    deadline?: string;
    status?: string;
    funding_source?: string;
    slots_available?: number;
    created_at: string;
    updated_at: string;
}

interface Statistics {
    total_applications: number;
    pending_applications: number;
    approved_applications: number;
    rejected_applications: number;
    total_disbursed: number;
}

interface Props {
    scholarship: Scholarship;
    statistics: Statistics;
}

const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Scholarships', href: '/admin/scholarships' },
    { title: 'Scholarship Details', href: '#' },
];

export default function ScholarshipShow({ scholarship, statistics }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${scholarship.name} - Admin`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">{scholarship.name}</h1>
                            <p className="text-muted-foreground">Type: {scholarship.type}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Scholarship Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Scholarship Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Name</label>
                                <p className="font-medium">{scholarship.name}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Type</label>
                                <p className="font-medium">{scholarship.type}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Amount</label>
                                <p className="flex items-center gap-2 font-medium">
                                    <DollarSign className="h-4 w-4" />
                                    {formatCurrency(scholarship.amount)}
                                </p>
                            </div>
                            {scholarship.status && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Status</label>
                                    <p className="font-medium">
                                        <Badge variant="outline">{scholarship.status}</Badge>
                                    </p>
                                </div>
                            )}{' '}
                            {scholarship.funding_source && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Funding Source</label>
                                    <p className="font-medium">{scholarship.funding_source}</p>
                                </div>
                            )}
                            {scholarship.slots_available && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Available Slots</label>
                                    <p className="font-medium">{scholarship.slots_available}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Created Date</label>
                                <p className="flex items-center gap-2 font-medium">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(scholarship.created_at)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Total Applications</label>
                                <p className="font-medium">{statistics.total_applications}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Pending Applications</label>
                                <p className="font-medium">{statistics.pending_applications}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Approved Applications</label>
                                <p className="font-medium">{statistics.approved_applications}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Rejected Applications</label>
                                <p className="font-medium">{statistics.rejected_applications}</p>
                            </div>
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">Total Disbursed</label>
                                <p className="font-medium">{formatCurrency(statistics.total_disbursed)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Description and Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {scholarship.description && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Description</label>
                                    <p className="mt-1 text-sm">{scholarship.description}</p>
                                </div>
                            )}
                            {scholarship.requirements && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Requirements</label>
                                    <p className="mt-1 text-sm">{scholarship.requirements}</p>
                                </div>
                            )}
                            {scholarship.deadline && (
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Application Deadline</label>
                                    <p className="font-medium">{formatDate(scholarship.deadline)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Manage this scholarship</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Users className="mr-2 h-4 w-4" />
                                View Applications
                            </Button>
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Edit Scholarship
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
