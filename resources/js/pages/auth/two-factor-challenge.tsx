import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function TwoFactorChallenge() {
    const [recovery, setRecovery] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/two-factor-challenge');
    };

    return (
        <AuthLayout
            title="Two-Factor Authentication"
            description="Please confirm access to your account by entering the authentication code provided by your authenticator application."
        >
            <Head title="Two-Factor Authentication" />

            <form onSubmit={submit} className="space-y-4">
                <div className="mb-6 flex justify-center">
                    <div className="bg-primary/10 rounded-full p-4">
                        <ShieldCheck className="text-primary h-10 w-10" />
                    </div>
                </div>

                {recovery ? (
                    <div className="space-y-2">
                        <Label htmlFor="recovery_code">Recovery Code</Label>
                        <Input
                            id="recovery_code"
                            type="text"
                            value={data.recovery_code}
                            className="font-mono"
                            onChange={(e) => setData('recovery_code', e.target.value)}
                            placeholder="XXXXXXXX-XXXXXXXX"
                            autoComplete="one-time-code"
                            autoFocus
                        />
                        {errors.recovery_code && <p className="text-destructive text-sm">{errors.recovery_code}</p>}
                        <p className="text-muted-foreground text-xs">
                            Please confirm access to your account by entering one of your emergency recovery codes.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="code">Authentication Code</Label>
                        <div className="relative">
                            <Smartphone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={data.code}
                                className="pl-9 font-mono text-lg tracking-widest"
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="XXXXXX"
                                autoComplete="one-time-code"
                                autoFocus
                            />
                        </div>
                        {errors.code && <p className="text-destructive text-sm">{errors.code}</p>}
                        <p className="text-muted-foreground text-xs">
                            Open your authenticator app (Google Authenticator, Authy, etc.) to view your code.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-4">
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Verifying...' : 'Verify'}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setRecovery(!recovery);
                            setData({ code: '', recovery_code: '' });
                        }}
                        className="text-sm"
                    >
                        {recovery ? (
                            <span className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                Use an authentication code
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Use a recovery code
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
