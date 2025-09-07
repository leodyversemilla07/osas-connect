import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { format } from "date-fns";
import { CalendarDays, Users, GraduationCap, DollarSign, FileText, CheckCircle } from 'lucide-react';

// Shorter mappings for badges and table display
const SCHOLARSHIP_TYPES = {
    'academic_full': 'Academic (Full)',
    'academic_partial': 'Academic (Partial)',
    'student_assistantship': 'Student Assistantship',
    'performing_arts_full': 'Performing Arts (Full)',
    'performing_arts_partial': 'Performing Arts (Partial)',
    'economic_assistance': 'Economic Assistance',
    'others': 'Custom Type',
} as const;

const getScholarshipTypeDisplay = (type: string): string => {
    return SCHOLARSHIP_TYPES[type as keyof typeof SCHOLARSHIP_TYPES] || type;
};

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

interface ViewScholarshipDialogProps {
    isOpen: boolean;
    onClose: () => void;
    scholarship: Scholarship | null;
}

export default function ViewScholarshipDialog({ isOpen, onClose, scholarship }: ViewScholarshipDialogProps) {
    if (!scholarship) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Scholarship Details
                    </DialogTitle>
                    <DialogDescription>
                        View complete information about this scholarship program.
                    </DialogDescription>
                </DialogHeader>                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scholarship Name</p>
                                    </div>
                                    <p className="text-foreground font-medium">{scholarship.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Type</p>
                                    </div>
                                    <p className="text-foreground font-medium">
                                        {getScholarshipTypeDisplay(scholarship.type)}
                                        {scholarship.type_specification && ` - ${scholarship.type_specification}`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Amount</p>
                                    </div>
                                    <p className="text-foreground font-semibold text-lg">
                                        ₱{scholarship.amount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                                    </div>
                                    <Badge
                                        variant={scholarship.status === 'active' ? 'default' :
                                            scholarship.status === 'inactive' ? 'destructive' :
                                                scholarship.status === 'upcoming' ? 'outline' : 'secondary'}
                                        className="text-xs"
                                    >
                                        {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Deadline</p>
                                    </div>
                                    <p className="text-foreground">
                                        {scholarship.deadline ? format(new Date(scholarship.deadline), 'MMM dd, yyyy') : 'No deadline set'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Slots</p>
                                    </div>
                                    <p className="text-foreground font-medium">{scholarship.slots_available}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Funding Source</p>
                                    </div>
                                    <p className="text-foreground">
                                        {scholarship.funding_source || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                                <p className="text-foreground leading-relaxed">
                                    {scholarship.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Statistics Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Application Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{scholarship.total_applications}</p>
                                            <p className="text-sm text-muted-foreground">Total Applications</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{scholarship.approved_applications}</p>
                                            <p className="text-sm text-muted-foreground">Approved Applications</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{scholarship.remaining_slots}</p>
                                            <p className="text-sm text-muted-foreground">Remaining Slots</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Eligibility Criteria Card */}
                    {scholarship.criteria && scholarship.criteria.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Eligibility Criteria
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {scholarship.criteria.map((criterion, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-foreground leading-relaxed">{criterion}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Required Documents Card */}
                    {scholarship.required_documents && scholarship.required_documents.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Required Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {scholarship.required_documents.map((document, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-foreground leading-relaxed">{document}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                                    <p className="text-foreground">{format(new Date(scholarship.created_at), 'MMM dd, yyyy HH:mm')}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                    <p className="text-foreground">{format(new Date(scholarship.updated_at), 'MMM dd, yyyy HH:mm')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
