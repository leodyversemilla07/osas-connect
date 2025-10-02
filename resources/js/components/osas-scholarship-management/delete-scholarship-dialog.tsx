import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

interface DeleteScholarshipDialogProps {
    isOpen: boolean;
    onClose: () => void;
    scholarship: Scholarship | null;
}

export default function DeleteScholarshipDialog({ isOpen, onClose, scholarship }: DeleteScholarshipDialogProps) {
    const { post, processing } = useForm();

    const handleDelete = () => {
        if (scholarship) {
            post(route('osas.scholarships.destroy', scholarship.id), {
                onSuccess: () => {
                    onClose();
                    toast.success('Scholarship deleted successfully!', {
                        description: `${scholarship.name} has been removed from the scholarship programs.`,
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Scholarship</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <p className="text-sm">
                        Are you sure you want to delete <span className="font-medium">{scholarship?.name}</span>?
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={processing}>
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
    );
}
