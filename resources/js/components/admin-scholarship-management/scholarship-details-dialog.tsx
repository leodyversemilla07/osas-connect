import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Calendar, 
    DollarSign, 
    Users, 
    FileText, 
    Award,
    CheckCircle,
    AlertCircle,
    Eye
} from "lucide-react";
import { DataTable } from '@/components/application-management/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';

interface Application {
    id: number;
    student_name: string;
    student_id: string;
    status: string;
    applied_at: string | null;
    approved_at: string | null;
    amount_received: number;
}

interface Scholarship {
    id: number;
    name: string;
    type: string;
    description: string;
    status: 'open' | 'closed' | 'upcoming';
    amount: number;
    deadline: string | null;
    slots: number;
    slots_available: number;
    beneficiaries: number;
    funding_source: string;
    eligibility_criteria: string[] | null;
    required_documents: string[] | null;
    criteria: string[] | null;
    renewal_criteria: string[] | null;
    admin_remarks: string | null;
    created_at: string;
    updated_at: string;
    applications: Application[];
}

interface ScholarshipDetailsDialogProps {
    scholarship: Scholarship | null;
    isOpen: boolean;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        case 'closed':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
        case 'upcoming':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
};

const getApplicationStatusColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        case 'rejected':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
        case 'submitted':
        case 'under_verification':
        case 'under_evaluation':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'verified':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export function ScholarshipDetailsDialog({ scholarship, isOpen, onClose }: ScholarshipDetailsDialogProps) {
    if (!scholarship) return null;

    // Ensure all properties exist and arrays are properly initialized
    const safeScholarship = {
        id: scholarship.id || 0,
        name: scholarship.name || 'Unknown Scholarship',
        type: scholarship.type || 'general',
        description: scholarship.description || 'No description available',
        status: scholarship.status || 'closed',
        amount: scholarship.amount || 0,
        deadline: scholarship.deadline || null,
        slots: scholarship.slots || 0,
        slots_available: scholarship.slots_available || 0,
        beneficiaries: scholarship.beneficiaries || 0,
        funding_source: scholarship.funding_source || 'Unknown',
        admin_remarks: scholarship.admin_remarks || null,
        created_at: scholarship.created_at || new Date().toISOString(),
        updated_at: scholarship.updated_at || new Date().toISOString(),
        eligibility_criteria: Array.isArray(scholarship.eligibility_criteria) ? scholarship.eligibility_criteria : [],
        required_documents: Array.isArray(scholarship.required_documents) ? scholarship.required_documents : [],
        criteria: Array.isArray(scholarship.criteria) ? scholarship.criteria : [],
        renewal_criteria: Array.isArray(scholarship.renewal_criteria) ? scholarship.renewal_criteria : [],
        applications: Array.isArray(scholarship.applications) ? scholarship.applications : []
    };

    const applicationColumns: ColumnDef<Application>[] = [
        {
            accessorKey: 'student_name',
            header: 'Student',
            cell: ({ row }) => {
                const application = row.original;
                return (
                    <div className="space-y-1">
                        <div className="font-medium">{application?.student_name || 'Unknown Student'}</div>
                        <div className="text-sm text-muted-foreground">ID: {application?.student_id || 'N/A'}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string || 'unknown';
                return (
                    <Badge className={getApplicationStatusColor(status)}>
                        {status.replace('_', ' ').toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'applied_at',
            header: 'Applied Date',
            cell: ({ row }) => {
                const date = row.getValue('applied_at') as string | null;
                return <span className="text-sm">{formatDate(date)}</span>;
            },
        },
        {
            accessorKey: 'approved_at',
            header: 'Approved Date',
            cell: ({ row }) => {
                const date = row.getValue('approved_at') as string | null;
                return <span className="text-sm">{formatDate(date)}</span>;
            },
        },
        {
            accessorKey: 'amount_received',
            header: 'Amount Received',
            cell: ({ row }) => {
                const amount = row.getValue('amount_received') as number || 0;
                return <span className="font-medium">{formatCurrency(amount)}</span>;
            },
        },
    ];    const applications = safeScholarship.applications;
    const approvedApplications = applications.filter(app => app && app.status === 'approved').length;
    const rejectedApplications = applications.filter(app => app && app.status === 'rejected').length;
    const pendingApplications = applications.filter(app => 
        app && ['submitted', 'under_verification', 'under_evaluation', 'verified'].includes(app.status)
    ).length;return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-none w-[98vw] h-[98vh] max-h-[98vh] overflow-y-auto p-8 m-0">
                <DialogHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                {safeScholarship.name}
                            </DialogTitle>
                            <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(safeScholarship.status)}>
                                    {safeScholarship.status.charAt(0).toUpperCase() + safeScholarship.status.slice(1)}
                                </Badge>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{safeScholarship.type}</span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.scholarship.applications', { scholarship_type: safeScholarship.type })}>
                                    <Users className="h-4 w-4 mr-2" />
                                    View All Applications
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {safeScholarship.description}
                    </DialogDescription>
                </DialogHeader>                <div className="space-y-8 px-2">
                    {/* Key Metrics */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Scholarship Amount</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(safeScholarship.amount)}</div>
                                <p className="text-xs text-muted-foreground">Monthly stipend</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{safeScholarship.slots_available}</div>
                                <p className="text-xs text-muted-foreground">of {safeScholarship.slots} total slots</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>                            <CardContent>
                                <div className="text-2xl font-bold">{applications.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    {approvedApplications} approved • {pendingApplications} pending • {rejectedApplications} rejected
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Deadline</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatDate(safeScholarship.deadline)}</div>
                                <p className="text-xs text-muted-foreground">Application deadline</p>
                            </CardContent>
                        </Card>
                    </div>                    {/* Scholarship Details */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-8">
                            {/* Scholarship Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Scholarship Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">                                    <div className="grid gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Scholarship Type</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">{safeScholarship.type}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Funding Source</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{safeScholarship.funding_source}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Beneficiaries</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{safeScholarship.beneficiaries} students</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(safeScholarship.created_at)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(safeScholarship.updated_at)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>                            {/* Eligibility Criteria */}
                            {safeScholarship.criteria && safeScholarship.criteria.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Eligibility Criteria
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {safeScholarship.criteria.map((criterion, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{criterion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Additional Eligibility Criteria */}
                            {safeScholarship.eligibility_criteria && safeScholarship.eligibility_criteria.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Additional Eligibility Requirements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {safeScholarship.eligibility_criteria.map((criterion, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{criterion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-8">                            {/* Required Documents */}
                            {safeScholarship.required_documents && safeScholarship.required_documents.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Required Documents
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {safeScholarship.required_documents.map((document, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{document}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Renewal Criteria */}
                            {safeScholarship.renewal_criteria && safeScholarship.renewal_criteria.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Award className="h-5 w-5" />
                                            Renewal Criteria
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {safeScholarship.renewal_criteria.map((criterion, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{criterion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Admin Remarks */}
                            {safeScholarship.admin_remarks && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Admin Remarks
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{safeScholarship.admin_remarks}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Applications Data Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Applications ({applications.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Recent applications for this scholarship
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {applications.length > 0 ? (
                                <DataTable
                                    columns={applicationColumns}
                                    data={applications.slice(0, 10)} // Show only first 10 applications
                                />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No applications found for this scholarship.</p>
                                </div>
                            )}
                            {applications.length > 10 && (
                                <div className="mt-4 text-center">
                                    <Button variant="outline" asChild>
                                        <Link href={route('admin.scholarship.applications', { scholarship_type: safeScholarship.type })}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View All {applications.length} Applications
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
