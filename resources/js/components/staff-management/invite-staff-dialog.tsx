import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';

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
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-3">
                    <DialogTitle>Invite OSAS Staff Member</DialogTitle>
                    <DialogDescription>
                        Send an invitation email to a new OSAS staff member. They will receive an email to join your team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium leading-6">
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
                                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                    aria-invalid={errors.email ? "true" : undefined}
                                    required
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                The invitation link will expire after 48 hours.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
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
