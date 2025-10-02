import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { Clock, Info, Loader2, Mail, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface InviteStaffDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InviteStaffDialog({ open, onOpenChange }: InviteStaffDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role: 'osas_staff',
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
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                            <UserPlus className="text-primary h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Invite Staff Member</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1 text-sm">
                                Send an invitation to join your OSAS team
                            </DialogDescription>
                        </div>
                    </div>

                    <Separator />
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email Input Section */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4" />
                                Email Address
                                <Badge variant="outline" className="text-xs">
                                    Required
                                </Badge>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter staff member's email address"
                                className={errors.email ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                                aria-invalid={errors.email ? 'true' : undefined}
                                required
                                disabled={processing}
                            />
                            {errors.email && <InputError message={errors.email} />}
                        </div>

                        {/* Information Alert */}
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <div className="space-y-1">
                                    <p>The invitation will include:</p>
                                    <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-xs">
                                        <li>A secure link to create their account</li>
                                        <li>Instructions to complete setup</li>
                                        <li>Access to OSAS staff features</li>
                                    </ul>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Expiry Notice */}
                        <div className="text-muted-foreground bg-muted/30 flex items-center gap-2 rounded-md p-3 text-sm">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>
                                Invitation link expires in <strong>48 hours</strong>
                            </span>
                        </div>
                    </div>

                    <Separator />

                    <DialogFooter className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.email} className="flex-1 sm:flex-none">
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Invitation...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Invitation
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
