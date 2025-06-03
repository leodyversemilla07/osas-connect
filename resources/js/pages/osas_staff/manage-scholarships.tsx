import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-scholarship-management/data-table';
import { createColumns, getScholarshipTypeDisplay } from '@/components/osas-scholarship-management/columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Plus, X, Loader2, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { type ColumnDef } from '@tanstack/react-table';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

// Scholarship interface to match backend data
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
    funding_source?: string; // Add funding_source field
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

interface CreateScholarshipForm {
    name: string;
    description: string;
    type: string;
    type_specification: string; // For custom "Others" type
    amount: number | string;
    status: string;
    deadline: string;
    slots_available: number | string;
    funding_source: string;
    criteria: string[];
    required_documents: string[];
    [key: string]: string | number | string[] | undefined; // Add index signature for useForm compatibility
}

interface EditScholarshipForm extends CreateScholarshipForm {
    id: number;
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
    const [newCriterion, setNewCriterion] = useState('');
    const [newDocument, setNewDocument] = useState('');
    const [editCriterion, setEditCriterion] = useState('');
    const [editDocument, setEditDocument] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<CreateScholarshipForm>({
        name: '',
        description: '',
        type: '',
        type_specification: '',
        amount: '',
        status: 'upcoming',
        deadline: '',
        slots_available: '',
        funding_source: '',
        criteria: [],
        required_documents: [],
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm<EditScholarshipForm>({
        id: 0,
        name: '',
        description: '',
        type: '',
        type_specification: '',
        amount: '',
        status: 'upcoming',
        deadline: '',
        slots_available: '',
        funding_source: '',
        criteria: [],
        required_documents: [],
    }); const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('osas.scholarships.store'), {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                setNewCriterion('');
                setNewDocument('');
                toast.success('Scholarship created successfully!', {
                    description: `${data.name} has been added to the scholarship programs.`,
                });
            },
            onError: () => {
                toast.error('Failed to create scholarship', {
                    description: 'Please check the form and try again.',
                });
            },
        });
    };

    const addCriterion = () => {
        if (newCriterion.trim()) {
            setData('criteria', [...data.criteria, newCriterion.trim()]);
            setNewCriterion('');
        }
    };

    const removeCriterion = (index: number) => {
        setData('criteria', data.criteria.filter((_, i) => i !== index));
    };

    const addDocument = () => {
        if (newDocument.trim()) {
            setData('required_documents', [...data.required_documents, newDocument.trim()]);
            setNewDocument('');
        }
    }; const removeDocument = (index: number) => {
        setData('required_documents', data.required_documents.filter((_, i) => i !== index));
    };    // Edit functions
    const openEditDialog = (scholarship: Scholarship) => {
        setEditData({
            id: scholarship.id,
            name: scholarship.name,
            description: scholarship.description,
            type: scholarship.type,
            type_specification: scholarship.type_specification || '',
            amount: scholarship.amount.toString(),
            status: scholarship.status,
            deadline: scholarship.deadline || '',
            slots_available: scholarship.slots_available.toString(),
            funding_source: scholarship.funding_source || '', // Use the scholarship's funding_source
            criteria: scholarship.criteria || [],
            required_documents: scholarship.required_documents || [],
        });
        setIsEditDialogOpen(true);
    };

    const openViewDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsViewDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('osas.scholarships.update', editData.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                resetEdit();
                setEditCriterion('');
                setEditDocument('');
                toast.success('Scholarship updated successfully!', {
                    description: `${editData.name} has been updated.`,
                });
            },
            onError: () => {
                toast.error('Failed to update scholarship', {
                    description: 'Please check the form and try again.',
                });
            },
        });
    };

    const addEditCriterion = () => {
        if (editCriterion.trim()) {
            setEditData('criteria', [...editData.criteria, editCriterion.trim()]);
            setEditCriterion('');
        }
    };

    const removeEditCriterion = (index: number) => {
        setEditData('criteria', editData.criteria.filter((_, i) => i !== index));
    };

    const addEditDocument = () => {
        if (editDocument.trim()) {
            setEditData('required_documents', [...editData.required_documents, editDocument.trim()]);
            setEditDocument('');
        }
    };

    const removeEditDocument = (index: number) => {
        setEditData('required_documents', editData.required_documents.filter((_, i) => i !== index));
    };

    const openDeleteDialog = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedScholarship) {
            // Call the delete route with the scholarship ID
            post(route('osas.scholarships.destroy', selectedScholarship.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedScholarship(null);
                    toast.success('Scholarship deleted successfully!', {
                        description: `${selectedScholarship.name} has been removed from the scholarship programs.`,
                    });
                },
                onError: () => {
                    toast.error('Failed to delete scholarship', {
                        description: 'Please try again later.',
                    });
                },
            });
        }
    };

    // Function to handle scholarship type change and set default amount, criteria, and documents
    const handleTypeChange = (type: string) => {
        setData('type', type);

        // Clear type specification when not "others"
        if (type !== 'others') {
            setData('type_specification', '');
        }

        // Set default amounts, criteria, and documents based on MinSU scholarship types
        switch (type) {
            case 'academic_full':
                setData('amount', '500');
                setData('criteria', [
                    'General Weighted Average (GWA) between 1.000 - 1.450',
                    'No grade below 1.75 in any course',
                    'No Dropped/Deferred/Failed marks',
                    'Minimum of 18 units enrollment'
                ]);
                setData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Recent ID Picture (2x2)'
                ]);
                break;
            case 'academic_partial':
                setData('amount', '300');
                setData('criteria', [
                    'General Weighted Average (GWA) between 1.460 - 1.750',
                    'No grade below 1.75 in any course',
                    'No Dropped/Deferred/Failed marks',
                    'Minimum of 18 units enrollment'
                ]);
                setData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Recent ID Picture (2x2)'
                ]);
                break;
            case 'student_assistantship':
                setData('amount', '');
                setData('criteria', [
                    'General Weighted Average (GWA) not below 2.25',
                    'No failing grades',
                    'Available for minimum 15 hours/week work commitment',
                    'Enrolled in at least 12 units'
                ]);
                setData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Work Schedule Commitment Letter',
                    'Recommendation from Department Head'
                ]);
                break;
            case 'performing_arts_full':
                setData('amount', '500');
                setData('criteria', [
                    'Member of MinSU accredited performing arts group',
                    'Member for at least one (1) semester',
                    'Participated in at least two (2) major University activities',
                    'Recommended by group coach/adviser',
                    'Maintaining reasonable academic standing'
                ]);
                setData('required_documents', [
                    'Certificate of Group Membership',
                    'Recommendation Letter from Coach/Adviser',
                    'List of Performances/Activities',
                    'Official Transcript of Records',
                    'Certificate of Enrollment'
                ]);
                break;
            case 'performing_arts_partial':
                setData('amount', '300');
                setData('criteria', [
                    'Member of MinSU accredited performing arts group',
                    'Member for at least one (1) semester',
                    'Participated in at least two (2) major University activities',
                    'Recommended by group coach/adviser',
                    'Maintaining reasonable academic standing'
                ]);
                setData('required_documents', [
                    'Certificate of Group Membership',
                    'Recommendation Letter from Coach/Adviser',
                    'List of Performances/Activities',
                    'Official Transcript of Records',
                    'Certificate of Enrollment'
                ]);
                break;
            case 'economic_assistance':
                setData('amount', '400');
                setData('criteria', [
                    'General Weighted Average (GWA) of at least 2.25',
                    'From economically disadvantaged family',
                    'MSWDO Indigency Certificate required',
                    'Full-time student status'
                ]);
                setData('required_documents', [
                    'MSWDO Indigency Certificate',
                    'Income Tax Return or Certificate of Non-Filing',
                    'Barangay Certificate of Residency',
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Family Income Statement'
                ]);
                break;
            case 'others':
                // Clear defaults for custom types - let user define everything
                setData('amount', '');
                setData('criteria', []);
                setData('required_documents', []);
                break;
            default:
                // Clear defaults for unknown types
                setData('criteria', []);
                setData('required_documents', []);
                break;
        }
    };

    // Function to handle edit type change and set default amount, criteria, and documents
    const handleEditTypeChange = (type: string) => {
        setEditData('type', type);

        // Clear type specification when not "others"
        if (type !== 'others') {
            setEditData('type_specification', '');
        }

        // Set default amounts, criteria, and documents based on MinSU scholarship types
        switch (type) {
            case 'academic_full':
                setEditData('amount', '500');
                setEditData('criteria', [
                    'General Weighted Average (GWA) between 1.000 - 1.450',
                    'No grade below 1.75 in any course',
                    'No Dropped/Deferred/Failed marks',
                    'Minimum of 18 units enrollment'
                ]);
                setEditData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Recent ID Picture (2x2)'
                ]);
                break;
            case 'academic_partial':
                setEditData('amount', '300');
                setEditData('criteria', [
                    'General Weighted Average (GWA) between 1.460 - 1.750',
                    'No grade below 1.75 in any course',
                    'No Dropped/Deferred/Failed marks',
                    'Minimum of 18 units enrollment'
                ]);
                setEditData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Recent ID Picture (2x2)'
                ]);
                break;
            case 'student_assistantship':
                setEditData('amount', '');
                setEditData('criteria', [
                    'General Weighted Average (GWA) not below 2.25',
                    'No failing grades',
                    'Available for minimum 15 hours/week work commitment',
                    'Enrolled in at least 12 units'
                ]);
                setEditData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Work Schedule Commitment Letter',
                    'Recommendation from Department Head'
                ]);
                break;
            case 'performing_arts_full':
                setEditData('amount', '500');
                setEditData('criteria', [
                    'Member of MinSU accredited performing arts group',
                    'Member for at least one (1) semester',
                    'Participated in at least two (2) major University activities',
                    'Recommended by group coach/adviser',
                    'Maintaining reasonable academic standing'
                ]);
                setEditData('required_documents', [
                    'Certificate of Group Membership',
                    'Recommendation Letter from Coach/Adviser',
                    'List of Performances/Activities',
                    'Official Transcript of Records',
                    'Certificate of Enrollment'
                ]);
                break;
            case 'performing_arts_partial':
                setEditData('amount', '300');
                setEditData('criteria', [
                    'Member of MinSU accredited performing arts group',
                    'Member for at least one (1) semester',
                    'Participated in at least two (2) major University activities',
                    'Recommended by group coach/adviser',
                    'Maintaining reasonable academic standing'
                ]);
                setEditData('required_documents', [
                    'Certificate of Group Membership',
                    'Recommendation Letter from Coach/Adviser',
                    'List of Performances/Activities',
                    'Official Transcript of Records',
                    'Certificate of Enrollment'
                ]);
                break;
            case 'economic_assistance':
                setEditData('amount', '400');
                setEditData('criteria', [
                    'General Weighted Average (GWA) of at least 2.25',
                    'From economically disadvantaged family',
                    'MSWDO Indigency Certificate required',
                    'Full-time student status'
                ]);
                setEditData('required_documents', [
                    'MSWDO Indigency Certificate',
                    'Income Tax Return or Certificate of Non-Filing',
                    'Barangay Certificate of Residency',
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Family Income Statement'
                ]);
                break;
            case 'others':
                // Clear defaults for custom types - let user define everything
                setEditData('amount', '');
                setEditData('criteria', []);
                setEditData('required_documents', []);
                break;
            default:
                // Keep current values for unknown types
                break;
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Scholarships" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Scholarship Management</h1>
                            <p className="text-base text-gray-500 dark:text-gray-400">Manage scholarship programs and applications</p>
                        </div>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-1"
                        >
                            <Plus className="h-4 w-4 mr-2 inline" />
                            Add Scholarship
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Scholarships</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.total_scholarships}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Programs</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.active_scholarships}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Applications</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.total_applications}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Beneficiaries</p>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{statistics.total_beneficiaries}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <DataTable
                    columns={createColumns({
                        onEdit: openEditDialog,
                        onView: openViewDialog,
                        onDelete: openDeleteDialog
                    }) as ColumnDef<Scholarship, unknown>[]}
                    data={scholarships.data}
                />
            </div>
            {/* Create Scholarship Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-gray-900 dark:text-gray-100">Create New Scholarship</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Set up a new scholarship program with eligibility criteria and requirements.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Scholarship Name
                                </label>
                                <div className="mt-1.5">
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter scholarship name"
                                        className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.name ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                        aria-invalid={errors.name ? "true" : undefined}
                                        required
                                    />
                                    {errors.name && <InputError message={errors.name} />}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="type" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Type
                                    </label>
                                    <div className="mt-1.5">
                                        <Select value={data.type} onValueChange={handleTypeChange}>
                                            <SelectTrigger className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500 ${errors.type ? "border-red-300 focus:border-red-400" : ""}`}>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="academic_full">Academic (Full Scholarship)</SelectItem>
                                                <SelectItem value="academic_partial">Academic (Partial Scholarship)</SelectItem>
                                                <SelectItem value="student_assistantship">Student Assistantship</SelectItem>
                                                <SelectItem value="performing_arts_full">Performing Arts (Full Scholarship)</SelectItem>
                                                <SelectItem value="performing_arts_partial">Performing Arts (Partial Scholarship)</SelectItem>
                                                <SelectItem value="economic_assistance">Economic Assistance</SelectItem>
                                                <SelectItem value="others">Others (Custom Type)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <InputError message={errors.type} />}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="status" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Status
                                    </label>
                                    <div className="mt-1.5">
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500 ${errors.status ? "border-red-300 focus:border-red-400" : ""}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <InputError message={errors.status} />}
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Type Specification Field */}
                            {data.type === 'others' && (
                                <div>
                                    <label htmlFor="type_specification" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Custom Scholarship Type
                                    </label>
                                    <div className="mt-1.5">
                                        <Input
                                            id="type_specification"
                                            value={data.type_specification}
                                            onChange={(e) => setData('type_specification', e.target.value)}
                                            placeholder="Enter custom scholarship type name"
                                            className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.type_specification ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                            required
                                        />
                                        {errors.type_specification && <InputError message={errors.type_specification} />}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="description" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <div className="mt-1.5">
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={2}
                                        placeholder="Describe the scholarship program, its purpose, and benefits..."
                                        className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none ${errors.description ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                        required
                                    />
                                    {errors.description && <InputError message={errors.description} />}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="funding_source" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Funding Source
                                </label>
                                <div className="mt-1.5">
                                    <Input
                                        id="funding_source"
                                        value={data.funding_source}
                                        onChange={(e) => setData('funding_source', e.target.value)}
                                        placeholder="Enter funding source (e.g., Government, Private Donor, University Fund)"
                                        className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.funding_source ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                        required
                                    />
                                    {errors.funding_source && <InputError message={errors.funding_source} />}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label htmlFor="amount" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Amount (₱)
                                    </label>
                                    <div className="mt-1.5">
                                        <Input
                                            id="amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                            className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.amount ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                            required
                                        />
                                        {errors.amount && <InputError message={errors.amount} />}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="slots_available" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Available Slots
                                    </label>
                                    <div className="mt-1.5">
                                        <Input
                                            id="slots_available"
                                            type="number"
                                            min="1"
                                            value={data.slots_available}
                                            onChange={(e) => setData('slots_available', e.target.value)}
                                            placeholder="1"
                                            className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.slots_available ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                            required
                                        />
                                        {errors.slots_available && <InputError message={errors.slots_available} />}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="deadline" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Application Deadline
                                    </label>
                                    <div className="mt-1.5">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500",
                                                        !data.deadline && "text-muted-foreground",
                                                        errors.deadline && "border-red-300 focus-visible:border-red-400"
                                                    )}
                                                >
                                                    {data.deadline ? (
                                                        format(new Date(data.deadline), "PPP")
                                                    ) : (
                                                        <span>Pick a deadline date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.deadline ? new Date(data.deadline) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            // Format date as YYYY-MM-DD using local time to avoid timezone issues
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            setData('deadline', `${year}-${month}-${day}`);
                                                        } else {
                                                            setData('deadline', '');
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.deadline && <InputError message={errors.deadline} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Criteria Section */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Eligibility Criteria
                                </label>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Define the requirements for this scholarship
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={newCriterion}
                                    onChange={(e) => setNewCriterion(e.target.value)}
                                    placeholder="Enter a criterion (e.g., Minimum GPA of 2.5)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                <Button
                                    type="button"
                                    onClick={addCriterion}
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {data.criteria.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {data.criteria.map((criterion, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {criterion}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                onClick={() => removeCriterion(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Required Documents Section */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Required Documents
                                </label>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    List all documents applicants must submit
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={newDocument}
                                    onChange={(e) => setNewDocument(e.target.value)}
                                    placeholder="Enter a required document (e.g., Official Transcript of Records)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                <Button
                                    type="button"
                                    onClick={addDocument}
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {data.required_documents.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {data.required_documents.map((document, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {document}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                onClick={() => removeDocument(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={processing}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-blue-900/20"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Scholarship'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Scholarship Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Scholarship</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Update the scholarship program details and requirements.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit_name" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Scholarship Name
                                </label>
                                <div className="mt-1.5">
                                    <Input
                                        id="edit_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Enter scholarship name"
                                        className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${editErrors.name ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                        aria-invalid={editErrors.name ? "true" : undefined}
                                        required
                                    />
                                    {editErrors.name && <InputError message={editErrors.name} />}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="edit_type" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Type
                                    </label>
                                    <div className="mt-1.5">
                                        <Select key={`type-${editData.id}`} value={editData.type} onValueChange={handleEditTypeChange}>
                                            <SelectTrigger className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 ${editErrors.type ? "border-red-300 focus-visible:border-red-400" : ""}`}>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="academic_full">Academic (Full Scholarship)</SelectItem>
                                                <SelectItem value="academic_partial">Academic (Partial Scholarship)</SelectItem>
                                                <SelectItem value="student_assistantship">Student Assistantship</SelectItem>
                                                <SelectItem value="performing_arts_full">Performing Arts (Full Scholarship)</SelectItem>
                                                <SelectItem value="performing_arts_partial">Performing Arts (Partial Scholarship)</SelectItem>
                                                <SelectItem value="economic_assistance">Economic Assistance</SelectItem>
                                                <SelectItem value="others">Others (Custom Type)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {editErrors.type && <InputError message={editErrors.type} />}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit_status" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Status
                                    </label>
                                    <div className="mt-1.5">
                                        <Select key={`status-${editData.id}`} value={editData.status} onValueChange={(value) => setEditData('status', value)}>
                                            <SelectTrigger className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 ${editErrors.status ? "border-red-300 focus-visible:border-red-400" : ""}`}>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {editErrors.status && <InputError message={editErrors.status} />}
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Type Specification Field for Edit Form */}
                            {editData.type === 'others' && (
                                <div>
                                    <label htmlFor="edit_type_specification" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Custom Scholarship Type
                                    </label>
                                    <div className="mt-1.5">
                                        <Input
                                            id="edit_type_specification"
                                            value={editData.type_specification}
                                            onChange={(e) => setEditData('type_specification', e.target.value)}
                                            placeholder="Enter custom scholarship type name"
                                            className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${editErrors.type_specification ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                            required
                                        />
                                        {editErrors.type_specification && <InputError message={editErrors.type_specification} />}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="edit_description" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <div className="mt-1.5">
                                    <Textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) => setEditData('description', e.target.value)}
                                        rows={2}
                                        placeholder="Describe the scholarship program, its purpose, and benefits..."
                                        className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none ${editErrors.description ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                        required
                                    />
                                    {editErrors.description && <InputError message={editErrors.description} />}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit_funding_source" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Funding Source
                                </label>                                <div className="mt-1.5">
                                    <Input
                                        key={`funding-source-${editData.id}`}
                                        id="edit_funding_source"
                                        value={editData.funding_source}
                                        onChange={(e) => setEditData('funding_source', e.target.value)}
                                        placeholder="Enter funding source (e.g., Government, Private Donor, University Fund)"
                                        className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${editErrors.funding_source ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                        required
                                    />
                                    {editErrors.funding_source && <InputError message={editErrors.funding_source} />}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label htmlFor="edit_amount" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Amount (₱)
                                    </label>
                                    <div className="mt-1.5">
                                        <Input
                                            id="edit_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={editData.amount}
                                            onChange={(e) => setEditData('amount', e.target.value)}
                                            placeholder="0.00"
                                            className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${editErrors.amount ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                            required
                                        />
                                        {editErrors.amount && <InputError message={editErrors.amount} />}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit_slots_available" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Available Slots
                                    </label>
                                    <div className="mt-1.5">
                                        <Input
                                            id="edit_slots_available"
                                            type="number"
                                            min="1"
                                            value={editData.slots_available}
                                            onChange={(e) => setEditData('slots_available', e.target.value)}
                                            placeholder="1"
                                            className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${editErrors.slots_available ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                            required
                                        />
                                        {editErrors.slots_available && <InputError message={editErrors.slots_available} />}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit_deadline" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                        Application Deadline
                                    </label>
                                    <div className="mt-1.5">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 hover:bg-transparent focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500",
                                                        !editData.deadline && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editData.deadline ? format(new Date(editData.deadline), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={editData.deadline ? new Date(editData.deadline) : undefined}
                                                    onSelect={(date) => setEditData('deadline', date ? format(date, 'yyyy-MM-dd') : '')}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {editErrors.deadline && <InputError message={editErrors.deadline} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Criteria Section */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Eligibility Criteria
                                </label>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Define the requirements for this scholarship
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={editCriterion}
                                    onChange={(e) => setEditCriterion(e.target.value)}
                                    placeholder="Enter a criterion (e.g., Minimum GPA of 2.5)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditCriterion())}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                <Button
                                    type="button"
                                    onClick={addEditCriterion}
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {editData.criteria.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {editData.criteria.map((criterion, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {criterion}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                onClick={() => removeEditCriterion(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Required Documents Section */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                    Required Documents
                                </label>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    List all documents applicants must submit
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={editDocument}
                                    onChange={(e) => setEditDocument(e.target.value)}
                                    placeholder="Enter a required document (e.g., Official Transcript of Records)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditDocument())}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                <Button
                                    type="button"
                                    onClick={addEditDocument}
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {editData.required_documents.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {editData.required_documents.map((document, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {document}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                onClick={() => removeEditDocument(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={editProcessing}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editProcessing}
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-blue-900/20"
                            >
                                {editProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Scholarship'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Scholarship Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-gray-900 dark:text-gray-100">Scholarship Details</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            View complete information about this scholarship program.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedScholarship && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Scholarship Name</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">{selectedScholarship.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                        <p className="mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {getScholarshipTypeDisplay(selectedScholarship.type)}
                                            </Badge>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                            ₱{selectedScholarship.amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <p className="mt-1">
                                            <Badge
                                                variant={selectedScholarship.status === 'active' ? 'default' :
                                                    selectedScholarship.status === 'inactive' ? 'destructive' :
                                                        selectedScholarship.status === 'upcoming' ? 'outline' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {selectedScholarship.status.charAt(0).toUpperCase() + selectedScholarship.status.slice(1)}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {selectedScholarship.deadline ? format(new Date(selectedScholarship.deadline), 'MMM dd, yyyy') : 'No deadline set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Slots</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedScholarship.slots_available}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Funding Source</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {selectedScholarship.funding_source || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                                        {selectedScholarship.description}
                                    </p>
                                </div>
                            </div>

                            {/* Application Statistics */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Application Statistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Applications</p>
                                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{selectedScholarship.total_applications}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Approved Applications</p>
                                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{selectedScholarship.approved_applications}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remaining Slots</p>
                                                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{selectedScholarship.remaining_slots}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Eligibility Criteria */}
                            {selectedScholarship.criteria && selectedScholarship.criteria.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Eligibility Criteria</h4>
                                    <div className="space-y-2">
                                        {selectedScholarship.criteria.map((criterion, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{criterion}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Required Documents */}
                            {selectedScholarship.required_documents && selectedScholarship.required_documents.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Required Documents</h4>
                                    <div className="space-y-2">
                                        {selectedScholarship.required_documents.map((document, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{document}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="grid gap-4 md:grid-cols-2 text-xs text-gray-500 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">Created:</span> {format(new Date(selectedScholarship.created_at), 'MMM dd, yyyy HH:mm')}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span> {format(new Date(selectedScholarship.updated_at), 'MMM dd, yyyy HH:mm')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsViewDialogOpen(false)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Scholarship Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Scholarship</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        <p className="text-sm">
                            Are you sure you want to delete <span className="font-medium">{selectedScholarship?.name}</span>?
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
