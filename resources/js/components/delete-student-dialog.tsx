import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Loader2, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface DeleteStudentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: { id: number; first_name: string; last_name: string; email: string };
}

export default function DeleteStudentDialog({ open, onOpenChange, user }: DeleteStudentDialogProps) {
    const [loading, setLoading] = useState(false);
    const handleDelete = () => {
        setLoading(true);
        router.delete(route('admin.students.destroy', user.id), {
            onFinish: () => {
                setLoading(false);
                onOpenChange(false);
            },
        });
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Student</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/20">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                                    <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    {user.first_name} {user.last_name}
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-300">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this student? This action cannot be undone and will permanently remove all user data.
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
