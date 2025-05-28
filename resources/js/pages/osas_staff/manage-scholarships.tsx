import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-scholarship-management/data-table';
import { createColumns } from '@/components/osas-scholarship-management/columns';
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
    amount: number;
    status: 'open' | 'closed' | 'upcoming';
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
                _method: 'DELETE',
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
                        </div>                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(true)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Scholarship
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Total Scholarships</h3>
                            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H5a2 2 0 0 0-2 2v3" />
                                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                <circle cx="8" cy="16" r="6" />
                                <path d="m6 18 1.5-1.5L9 18l3-3" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.total_scholarships}</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Active Programs</h3>
                            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.active_scholarships}</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Total Applications</h3>
                            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.total_applications}</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Total Beneficiaries</h3>
                            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="m22 21-2-2" />
                                <path d="m18 19-2-2" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.total_beneficiaries}</div>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <DataTable
                    columns={createColumns({
                        onEdit: openEditDialog,
                        onView: openViewDialog,
                        onDelete: openDeleteDialog
                    })}
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
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500 ${errors.type ? "border-red-300 focus:border-red-400" : ""}`}>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Academic">Academic</SelectItem>
                                                <SelectItem value="Athletic">Athletic</SelectItem>
                                                <SelectItem value="Need-based">Need-based</SelectItem>
                                                <SelectItem value="Merit-based">Merit-based</SelectItem>
                                                <SelectItem value="Special">Special</SelectItem>
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
                                        <Select key={`type-${editData.id}`} value={editData.type} onValueChange={(value) => setEditData('type', value)}>
                                            <SelectTrigger className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 ${editErrors.type ? "border-red-300 focus-visible:border-red-400" : ""}`}>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Academic">Academic</SelectItem>
                                                <SelectItem value="Athletic">Athletic</SelectItem>
                                                <SelectItem value="Need-based">Need-based</SelectItem>
                                                <SelectItem value="Merit-based">Merit-based</SelectItem>
                                                <SelectItem value="Special">Special</SelectItem>
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
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                                                {selectedScholarship.type}
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
                                                variant={selectedScholarship.status === 'open' ? 'default' :
                                                    selectedScholarship.status === 'closed' ? 'destructive' : 'secondary'}
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
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {selectedScholarship.total_applications}
                                        </div>
                                        <div className="text-sm text-blue-600 dark:text-blue-400">Total Applications</div>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {selectedScholarship.approved_applications}
                                        </div>
                                        <div className="text-sm text-green-600 dark:text-green-400">Approved Applications</div>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {selectedScholarship.remaining_slots}
                                        </div>
                                        <div className="text-sm text-orange-600 dark:text-orange-400">Remaining Slots</div>
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
