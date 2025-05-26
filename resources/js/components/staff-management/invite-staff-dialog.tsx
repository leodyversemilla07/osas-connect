import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { toast } from 'sonner';

interface InviteStaffDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InviteStaffDialog({ open, onOpenChange }: InviteStaffDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role: 'osas_staff'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.invitations.store'), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success('Invitation sent successfully!', {
                    description: `An invitation has been sent to ${data.email}`,
                });
            },
            onError: () => {
                toast.error('Failed to send invitation', {
                    description: 'Please try again later.',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-gray-900 dark:text-gray-100">Invite OSAS Staff Member</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Send an invitation email to a new OSAS staff member. They will receive an email to join your team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1.5">
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="staff@example.com"
                                    className={`border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.email ? "border-red-300 focus-visible:border-red-400" : ""}`}
                                    aria-invalid={errors.email ? "true" : undefined}
                                    required
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                The invitation link will expire after 48 hours.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Invitation'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
