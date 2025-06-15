import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-scholarship-management/data-table';
import { createColumns } from '@/components/osas-scholarship-management/columns';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateScholarshipDialog from '@/components/osas-scholarship-management/create-scholarship-dialog';
import EditScholarshipDialog from '@/components/osas-scholarship-management/edit-scholarship-dialog';
import ViewScholarshipDialog from '@/components/osas-scholarship-management/view-scholarship-dialog';
import DeleteScholarshipDialog from '@/components/osas-scholarship-management/delete-scholarship-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
    },
    {
        title: 'Manage Scholarships',
        href: route('osas.manage.scholarships'),
    },
];

interface Scholarship {
    id: number;
    name: string;
    description: string;
    type: string;
    type_specification?: string;
    amount: number;
    status: 'active' | 'inactive' | 'upcoming' | 'draft';
    deadline: string | null;
    slots_available: number;
    total_applications: number;
    approved_applications: number;
    remaining_slots: number;
    criteria: string[] | null;
    required_documents: string[] | null;
    funding_source?: string;
    created_at: string;
    updated_at: string;
}

interface Statistics {
    total_scholarships: number;
    active_scholarships: number;
    total_applications: number;
    total_beneficiaries: number;
}

interface Filters {
    search?: string;
    status?: string;
    type?: string;
    sort_by: string;
    sort_direction: string;
}

interface ManageScholarshipsProps {
    scholarships: {
        data: Scholarship[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    statistics: Statistics;
    filters: Filters;
}

export default function ManageScholarships({ scholarships, statistics }: ManageScholarshipsProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

    const openEditDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsViewDialogOpen(true);
    };

    const openDeleteDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Scholarships" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-foreground">Scholarship Management</h1>
                            <p className="text-base text-muted-foreground">Manage scholarship programs and applications</p>
                        </div>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            variant="default"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Scholarship
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-card text-card-foreground border-border">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Total Scholarships
                            </CardDescription>
                            <CardTitle className="text-3xl font-semibold text-foreground">
                                {statistics.total_scholarships}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    
                    <Card className="bg-card text-card-foreground border-border">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Active Programs
                            </CardDescription>
                            <CardTitle className="text-3xl font-semibold text-foreground">
                                {statistics.active_scholarships}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    
                    <Card className="bg-card text-card-foreground border-border">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Total Applications
                            </CardDescription>
                            <CardTitle className="text-3xl font-semibold text-foreground">
                                {statistics.total_applications}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    
                    <Card className="bg-card text-card-foreground border-border">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Total Beneficiaries
                            </CardDescription>
                            <CardTitle className="text-3xl font-semibold text-foreground">
                                {statistics.total_beneficiaries}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Data Table */}
                <div className="bg-card border border-border rounded-lg">
                    <DataTable
                        columns={createColumns({
                            onEdit: openEditDialog,
                            onView: openViewDialog,
                            onDelete: openDeleteDialog
                        }) as ColumnDef<Scholarship, unknown>[]}
                        data={scholarships.data}
                    />
                </div>
            </div>

            {/* Dialog Components */}
            <CreateScholarshipDialog 
                isOpen={isCreateDialogOpen} 
                onClose={() => setIsCreateDialogOpen(false)} 
            />
            
            {selectedScholarship && (
                <>
                    <EditScholarshipDialog 
                        isOpen={isEditDialogOpen} 
                        onClose={() => setIsEditDialogOpen(false)}
                        scholarship={selectedScholarship}
                    />
                    
                    <ViewScholarshipDialog 
                        isOpen={isViewDialogOpen} 
                        onClose={() => setIsViewDialogOpen(false)}
                        scholarship={selectedScholarship}
                    />
                    
                    <DeleteScholarshipDialog 
                        isOpen={isDeleteDialogOpen} 
                        onClose={() => setIsDeleteDialogOpen(false)}
                        scholarship={selectedScholarship}
                    />
                </>
            )}
        </AppLayout>
    );
}
