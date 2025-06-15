import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Plus, X, Loader2, CalendarIcon } from 'lucide-react';
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
    funding_source?: string;
    criteria: string[] | null;
    required_documents: string[] | null;
}

interface EditScholarshipForm {
    id: number;
    name: string;
    description: string;
    type: string;
    type_specification: string;
    amount: number | string;
    status: string;
    deadline: string;
    slots_available: number | string;
    funding_source: string;
    criteria: string[];
    required_documents: string[];
    [key: string]: string | number | string[] | undefined;
}

interface EditScholarshipDialogProps {
    isOpen: boolean;
    onClose: () => void;
    scholarship: Scholarship | null;
}

export default function EditScholarshipDialog({ isOpen, onClose, scholarship }: EditScholarshipDialogProps) {
    const [editCriterion, setEditCriterion] = useState('');
    const [editDocument, setEditDocument] = useState('');

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
    });

    // Initialize form data when scholarship changes
    useState(() => {
        if (scholarship && isOpen) {
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
                funding_source: scholarship.funding_source || '',
                criteria: scholarship.criteria || [],
                required_documents: scholarship.required_documents || [],
            });
        }
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('osas.scholarships.update', editData.id), {
            onSuccess: () => {
                onClose();
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

    const handleEditTypeChange = (type: string) => {
        setEditData('type', type);

        if (type !== 'others') {
            setEditData('type_specification', '');
        }

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
                setEditData('amount', '');
                setEditData('criteria', []);
                setEditData('required_documents', []);
                break;
            default:
                break;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle>Edit Scholarship</DialogTitle>
                    <DialogDescription>
                        Update the scholarship program details and requirements.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_name">Scholarship Name</Label>
                            <Input
                                id="edit_name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                placeholder="Enter scholarship name"
                                className={editErrors.name ? "border-destructive" : ""}
                                aria-invalid={editErrors.name ? "true" : undefined}
                                required
                            />
                            {editErrors.name && <InputError message={editErrors.name} />}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit_type">Type</Label>
                                <Select value={editData.type} onValueChange={handleEditTypeChange}>
                                    <SelectTrigger className={editErrors.type ? "border-destructive" : ""}>
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

                            <div className="space-y-2">
                                <Label htmlFor="edit_status">Status</Label>
                                <Select value={editData.status} onValueChange={(value) => setEditData('status', value)}>
                                    <SelectTrigger className={editErrors.status ? "border-destructive" : ""}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editErrors.status && <InputError message={editErrors.status} />}
                            </div>
                        </div>

                        {/* Conditional Type Specification Field */}
                        {editData.type === 'others' && (
                            <div className="space-y-2">
                                <Label htmlFor="edit_type_specification">Custom Scholarship Type</Label>
                                <Input
                                    id="edit_type_specification"
                                    value={editData.type_specification}
                                    onChange={(e) => setEditData('type_specification', e.target.value)}
                                    placeholder="Enter custom scholarship type name"
                                    className={editErrors.type_specification ? "border-destructive" : ""}
                                    required
                                />
                                {editErrors.type_specification && <InputError message={editErrors.type_specification} />}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                                rows={2}
                                placeholder="Describe the scholarship program, its purpose, and benefits..."
                                className={`resize-none ${editErrors.description ? "border-destructive" : ""}`}
                                required
                            />
                            {editErrors.description && <InputError message={editErrors.description} />}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_funding_source">Funding Source</Label>
                            <Input
                                key={`funding-source-${editData.id}`}
                                id="edit_funding_source"
                                value={editData.funding_source}
                                onChange={(e) => setEditData('funding_source', e.target.value)}
                                placeholder="Enter funding source (e.g., Government, Private Donor, University Fund)"
                                className={editErrors.funding_source ? "border-destructive" : ""}
                                required
                            />
                            {editErrors.funding_source && <InputError message={editErrors.funding_source} />}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="edit_amount">Amount (₱)</Label>
                                <Input
                                    id="edit_amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editData.amount}
                                    onChange={(e) => setEditData('amount', e.target.value)}
                                    placeholder="0.00"
                                    className={editErrors.amount ? "border-destructive" : ""}
                                    required
                                />
                                {editErrors.amount && <InputError message={editErrors.amount} />}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_slots_available">Available Slots</Label>
                                <Input
                                    id="edit_slots_available"
                                    type="number"
                                    min="1"
                                    value={editData.slots_available}
                                    onChange={(e) => setEditData('slots_available', e.target.value)}
                                    placeholder="1"
                                    className={editErrors.slots_available ? "border-destructive" : ""}
                                    required
                                />
                                {editErrors.slots_available && <InputError message={editErrors.slots_available} />}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_deadline">Application Deadline</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !editData.deadline && "text-muted-foreground",
                                                editErrors.deadline && "border-destructive"
                                            )}
                                        >
                                            {editData.deadline ? (
                                                format(new Date(editData.deadline), "PPP")
                                            ) : (
                                                <span>Pick a deadline date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={editData.deadline ? new Date(editData.deadline) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    setEditData('deadline', `${year}-${month}-${day}`);
                                                } else {
                                                    setEditData('deadline', '');
                                                }
                                            }}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {editErrors.deadline && <InputError message={editErrors.deadline} />}
                            </div>
                        </div>
                    </div>

                    {/* Criteria Section */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-base font-medium">Eligibility Criteria</Label>
                            <p className="text-sm text-muted-foreground">
                                Define the requirements for this scholarship
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={editCriterion}
                                onChange={(e) => setEditCriterion(e.target.value)}
                                placeholder="Enter a criterion (e.g., Minimum GPA of 2.5)"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditCriterion())}
                            />
                            <Button
                                type="button"
                                onClick={addEditCriterion}
                                size="sm"
                                variant="ghost"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {editData.criteria.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {editData.criteria.map((criterion, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {criterion}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
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
                            <Label className="text-base font-medium">Required Documents</Label>
                            <p className="text-sm text-muted-foreground">
                                List all documents applicants must submit
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={editDocument}
                                onChange={(e) => setEditDocument(e.target.value)}
                                placeholder="Enter a required document (e.g., Official Transcript of Records)"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditDocument())}
                            />
                            <Button
                                type="button"
                                onClick={addEditDocument}
                                size="sm"
                                variant="ghost"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {editData.required_documents.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {editData.required_documents.map((document, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {document}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
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
                            onClick={onClose}
                            disabled={editProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={editProcessing}
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
    );
}
