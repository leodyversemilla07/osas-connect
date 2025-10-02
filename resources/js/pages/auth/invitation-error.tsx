import { Head } from '@inertiajs/react';
import { AlertCircle, Home } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

interface InvitationErrorProps {
    message?: string;
}

export default function InvitationError({ message }: InvitationErrorProps) {
    const defaultMessage = 'This invitation is either invalid, expired, or has already been used.';

    return (
        <AuthLayout title="Invitation Error" description="There was an issue with your staff invitation.">
            <Head title="Invitation Error" />

            <div className="space-y-6 text-center">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-left">{message || defaultMessage}</AlertDescription>
                </Alert>

                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        If you believe this is an error, please contact your administrator to request a new invitation.
                    </p>

                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Button variant="outline" asChild>
                            <TextLink href={route('home')} className="gap-2">
                                <Home className="h-4 w-4" />
                                Return Home
                            </TextLink>
                        </Button>

                        <Button variant="secondary" asChild>
                            <TextLink href={route('login')}>Sign In</TextLink>
                        </Button>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
