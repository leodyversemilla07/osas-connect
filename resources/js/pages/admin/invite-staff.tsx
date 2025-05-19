import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Loader2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface InviteFormData {
    [key: string]: string;
    email: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'Invite Staff',
        href: '/admin/invite',
    },
];

export default function InviteStaff() {
    const { data, setData, post, processing, errors, reset } = useForm<InviteFormData>({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.invite.send'), {
            onSuccess: () => {
                reset('email');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Invite Staff | OSAS Connect</title>
                <meta name="description" content="Invite new staff members to join the OSAS team" />
            </Head>

            <div className="container max-w-xl py-8 mx-auto">
                <Card className="shadow-sm">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-semibold">Invite OSAS Staff</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Send an invitation to a new staff member to join the OSAS team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-base font-medium">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="staff@example.com"
                                        className={cn(
                                            "h-11 text-base",
                                            errors.email && "border-destructive focus-visible:ring-destructive"
                                        )}
                                        aria-invalid={errors.email ? "true" : undefined}
                                    />
                                    {errors.email && (
                                        <p className="text-destructive text-sm font-medium">{errors.email}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base font-medium mt-6"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Sending Invitation...
                                        </>
                                    ) : (
                                        'Send Invitation'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}