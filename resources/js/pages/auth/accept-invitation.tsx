import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface AcceptInvitationProps {
    invitation: {
        email: string;
        token: string;
    };
}

type InvitationForm = {
    first_name: string;
    last_name: string;
    middle_name: string;
    staff_id: string;
    password: string;
    password_confirmation: string;
    token: string;
};

export default function AcceptInvitation({ invitation }: AcceptInvitationProps) {
    const { data, setData, post, processing, errors } = useForm<Required<InvitationForm>>({
        first_name: '',
        last_name: '',
        middle_name: '',
        staff_id: '',
        password: '',
        password_confirmation: '',
        token: invitation.token,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('staff.accept-invitation.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthLayout title="Complete your registration" description="Welcome to OSAS Connect! Please complete your profile to activate your account.">
            <Head title="Accept Staff Invitation" />

            <form onSubmit={submit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                type="text"
                                required
                                autoFocus
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                disabled={processing}
                                placeholder="Doe"
                            />
                            <InputError message={errors.last_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                type="text"
                                required
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                disabled={processing}
                                placeholder="John"
                            />
                            <InputError message={errors.first_name} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="middle_name">Middle Name</Label>
                        <Input
                            id="middle_name"
                            type="text"
                            value={data.middle_name}
                            onChange={(e) => setData('middle_name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your middle name"
                        />
                        <InputError message={errors.middle_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff_id">Staff ID</Label>
                        <Input
                            id="staff_id"
                            type="text"
                            required
                            value={data.staff_id}
                            onChange={(e) => setData('staff_id', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your staff ID"
                        />
                        <InputError message={errors.staff_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" value={invitation.email} disabled className="bg-muted" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm your password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                </Button>
            </form>
        </AuthLayout>
    );
}
