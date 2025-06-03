import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { VALIDATION } from "@/lib/validation";
import type { RegisterForm } from "@/hooks/useRegistrationForm";

interface AccountSetupStepProps {
    data: RegisterForm;
    errors: Record<string, string>;
    onFieldChange: (field: keyof RegisterForm, value: string) => void;
}

const AccountSetupStep = memo<AccountSetupStepProps>(({
    data,
    errors,
    onFieldChange,
}) => {
    const isEmailValid = data.email && data.email.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN);
    const doPasswordsMatch = data.password && data.password_confirmation && 
                            data.password === data.password_confirmation;

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => onFieldChange('email', e.target.value)}
                    className="mt-1"
                    placeholder={`Enter your email (must end with ${VALIDATION.EMAIL.DOMAIN})`}
                    aria-describedby={errors.email ? "email-error" : "email-help"}
                />
                {!errors.email && (
                    <p id="email-help" className="mt-1 text-sm text-muted-foreground">
                        Must be a valid university email ending with {VALIDATION.EMAIL.DOMAIN}
                    </p>
                )}
                <InputError id="email-error" message={errors.email} className="mt-1" />
                {data.email && !isEmailValid && !errors.email && (
                    <p className="mt-1 text-sm text-amber-600">
                        Email must end with {VALIDATION.EMAIL.DOMAIN}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => onFieldChange('password', e.target.value)}
                    className="mt-1"
                    placeholder="Create a strong password"
                    aria-describedby={errors.password ? "password-error" : "password-help"}
                />
                {!errors.password && (
                    <p id="password-help" className="mt-1 text-sm text-muted-foreground">
                        Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                    </p>
                )}
                <InputError id="password-error" message={errors.password} className="mt-1" />
            </div>

            <div>
                <Label htmlFor="password_confirmation" className="text-sm font-medium">
                    Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => onFieldChange('password_confirmation', e.target.value)}
                    className="mt-1"
                    placeholder="Re-enter your password"
                    aria-describedby={errors.password_confirmation ? "password_confirmation-error" : undefined}
                />
                <InputError id="password_confirmation-error" message={errors.password_confirmation} className="mt-1" />
                {data.password && data.password_confirmation && !doPasswordsMatch && !errors.password_confirmation && (
                    <p className="mt-1 text-sm text-amber-600">
                        Passwords do not match
                    </p>
                )}
                {data.password && data.password_confirmation && doPasswordsMatch && (
                    <p className="mt-1 text-sm text-green-600">
                        Passwords match ✓
                    </p>
                )}
            </div>

            <div className="p-4 bg-muted rounded-lg border">
                <h4 className="font-medium text-foreground mb-2">Account Security Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use a unique password that you don't use elsewhere</li>
                    <li>• Include uppercase letters, lowercase letters, numbers, and symbols</li>
                    <li>• Avoid using personal information like your name or birthdate</li>
                    <li>• Keep your login credentials secure and don't share them</li>
                </ul>
            </div>
        </div>
    );
});

AccountSetupStep.displayName = 'AccountSetupStep';

export default AccountSetupStep;
