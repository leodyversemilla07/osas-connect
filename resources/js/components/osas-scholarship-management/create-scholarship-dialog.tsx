import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateScholarshipForm {
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

interface CreateScholarshipDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateScholarshipDialog({ isOpen, onClose }: CreateScholarshipDialogProps) {
    const [newCriterion, setNewCriterion] = useState('');
    const [newDocument, setNewDocument] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('osas.scholarships.store'), {
            onSuccess: () => {
                onClose();
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
        setData(
            'criteria',
            data.criteria.filter((_, i) => i !== index),
        );
    };

    const addDocument = () => {
        if (newDocument.trim()) {
            setData('required_documents', [...data.required_documents, newDocument.trim()]);
            setNewDocument('');
        }
    };

    const removeDocument = (index: number) => {
        setData(
            'required_documents',
            data.required_documents.filter((_, i) => i !== index),
        );
    };

    const handleTypeChange = (type: string) => {
        setData('type', type);

        if (type !== 'others') {
            setData('type_specification', '');
        }

        switch (type) {
            case 'academic_full':
                setData('amount', '500');
                setData('criteria', [
                    'General Weighted Average (GWA) between 1.000 - 1.450',
                    'No grade below 1.75 in any course',
                    'No Dropped/Deferred/Failed marks',
                    'Minimum of 18 units enrollment',
                ]);
                setData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Recent ID Picture (2x2)',
                ]);
                break;
            case 'academic_partial':
                setData('amount', '300');
                setData('criteria', [
                    'General Weighted Average (GWA) between 1.460 - 1.750',
                    'No grade below 1.75 in any course',
                    'No Dropped/Deferred/Failed marks',
                    'Minimum of 18 units enrollment',
                ]);
                setData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Recent ID Picture (2x2)',
                ]);
                break;
            case 'student_assistantship':
                setData('amount', '');
                setData('criteria', [
                    'General Weighted Average (GWA) not below 2.25',
                    'No failing grades',
                    'Available for minimum 15 hours/week work commitment',
                    'Enrolled in at least 12 units',
                ]);
                setData('required_documents', [
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Certificate of Good Moral Character',
                    'Work Schedule Commitment Letter',
                    'Recommendation from Department Head',
                ]);
                break;
            case 'performing_arts_full':
                setData('amount', '500');
                setData('criteria', [
                    'Member of MinSU accredited performing arts group',
                    'Member for at least one (1) semester',
                    'Participated in at least two (2) major University activities',
                    'Recommended by group coach/adviser',
                    'Maintaining reasonable academic standing',
                ]);
                setData('required_documents', [
                    'Certificate of Group Membership',
                    'Recommendation Letter from Coach/Adviser',
                    'List of Performances/Activities',
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                ]);
                break;
            case 'performing_arts_partial':
                setData('amount', '300');
                setData('criteria', [
                    'Member of MinSU accredited performing arts group',
                    'Member for at least one (1) semester',
                    'Participated in at least two (2) major University activities',
                    'Recommended by group coach/adviser',
                    'Maintaining reasonable academic standing',
                ]);
                setData('required_documents', [
                    'Certificate of Group Membership',
                    'Recommendation Letter from Coach/Adviser',
                    'List of Performances/Activities',
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                ]);
                break;
            case 'economic_assistance':
                setData('amount', '400');
                setData('criteria', [
                    'General Weighted Average (GWA) of at least 2.25',
                    'From economically disadvantaged family',
                    'MSWDO Indigency Certificate required',
                    'Full-time student status',
                ]);
                setData('required_documents', [
                    'MSWDO Indigency Certificate',
                    'Income Tax Return or Certificate of Non-Filing',
                    'Barangay Certificate of Residency',
                    'Official Transcript of Records',
                    'Certificate of Enrollment',
                    'Family Income Statement',
                ]);
                break;
            case 'others':
                setData('amount', '');
                setData('criteria', []);
                setData('required_documents', []);
                break;
            default:
                setData('criteria', []);
                setData('required_documents', []);
                break;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle>Create New Scholarship</DialogTitle>
                    <DialogDescription>Set up a new scholarship program with eligibility criteria and requirements.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Scholarship Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter scholarship name"
                                className={errors.name ? 'border-destructive' : ''}
                                aria-invalid={errors.name ? 'true' : undefined}
                                required
                            />
                            {errors.name && <InputError message={errors.name} />}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={data.type} onValueChange={handleTypeChange}>
                                    <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
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

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
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

                        {/* Conditional Type Specification Field */}
                        {data.type === 'others' && (
                            <div className="space-y-2">
                                <Label htmlFor="type_specification">Custom Scholarship Type</Label>
                                <Input
                                    id="type_specification"
                                    value={data.type_specification}
                                    onChange={(e) => setData('type_specification', e.target.value)}
                                    placeholder="Enter custom scholarship type name"
                                    className={errors.type_specification ? 'border-destructive' : ''}
                                    required
                                />
                                {errors.type_specification && <InputError message={errors.type_specification} />}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={2}
                                placeholder="Describe the scholarship program, its purpose, and benefits..."
                                className={`resize-none ${errors.description ? 'border-destructive' : ''}`}
                                required
                            />
                            {errors.description && <InputError message={errors.description} />}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="funding_source">Funding Source</Label>
                            <Input
                                id="funding_source"
                                value={data.funding_source}
                                onChange={(e) => setData('funding_source', e.target.value)}
                                placeholder="Enter funding source (e.g., Government, Private Donor, University Fund)"
                                className={errors.funding_source ? 'border-destructive' : ''}
                                required
                            />
                            {errors.funding_source && <InputError message={errors.funding_source} />}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (₱)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.amount ? 'border-destructive' : ''}
                                    required
                                />
                                {errors.amount && <InputError message={errors.amount} />}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slots_available">Available Slots</Label>
                                <Input
                                    id="slots_available"
                                    type="number"
                                    min="1"
                                    value={data.slots_available}
                                    onChange={(e) => setData('slots_available', e.target.value)}
                                    placeholder="1"
                                    className={errors.slots_available ? 'border-destructive' : ''}
                                    required
                                />
                                {errors.slots_available && <InputError message={errors.slots_available} />}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deadline">Application Deadline</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !data.deadline && 'text-muted-foreground',
                                                errors.deadline && 'border-destructive',
                                            )}
                                        >
                                            {data.deadline ? format(new Date(data.deadline), 'PPP') : <span>Pick a deadline date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={data.deadline ? new Date(data.deadline) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    setData('deadline', `${year}-${month}-${day}`);
                                                } else {
                                                    setData('deadline', '');
                                                }
                                            }}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.deadline && <InputError message={errors.deadline} />}
                            </div>
                        </div>
                    </div>

                    {/* Criteria Section */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-base font-medium">Eligibility Criteria</Label>
                            <p className="text-muted-foreground text-sm">Define the requirements for this scholarship</p>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={newCriterion}
                                onChange={(e) => setNewCriterion(e.target.value)}
                                placeholder="Enter a criterion (e.g., Minimum GPA of 2.5)"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                            />
                            <Button type="button" onClick={addCriterion} size="sm" variant="ghost">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {data.criteria.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {data.criteria.map((criterion, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {criterion}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground ml-1 h-auto p-0"
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
                            <Label className="text-base font-medium">Required Documents</Label>
                            <p className="text-muted-foreground text-sm">List all documents applicants must submit</p>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={newDocument}
                                onChange={(e) => setNewDocument(e.target.value)}
                                placeholder="Enter a required document (e.g., Official Transcript of Records)"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                            />
                            <Button type="button" onClick={addDocument} size="sm" variant="ghost">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {data.required_documents.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {data.required_documents.map((document, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {document}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground ml-1 h-auto p-0"
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
                        <Button type="button" variant="ghost" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
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
    );
}
