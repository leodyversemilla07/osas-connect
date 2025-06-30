import { memo } from "react";
import { InputWithLabel } from "@/components/input-with-label";
import InputError from "@/components/input-error";
import { VALIDATION } from "@/lib/validation";
import type { RegisterForm } from "@/hooks/use-registration-form";

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
                <InputWithLabel
                    id="email"
                    label="Email Address"
                    type="email"
                    required
                    value={data.email}
                    onChange={value => onFieldChange('email', value)}
                    placeholder={`Enter your email (must end with ${VALIDATION.EMAIL.DOMAIN})`}
                    error={errors.email}
                    className="mt-1"
                    pattern={`^[A-Za-z0-9._%+-]+${VALIDATION.EMAIL.DOMAIN}$`}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                    Must be a valid university email ending with {VALIDATION.EMAIL.DOMAIN}
                </p>
                <InputError id="email-error" message={errors.email} className="mt-1" />
                {data.email && !isEmailValid && !errors.email && (
                    <p className="mt-1 text-sm text-amber-600">
                        Email must end with {VALIDATION.EMAIL.DOMAIN}
                    </p>
                )}
            </div>

            <div>
                <InputWithLabel
                    id="password"
                    label="Password"
                    type="password"
                    required
                    value={data.password}
                    onChange={value => onFieldChange('password', value)}
                    placeholder="Create a strong password"
                    error={errors.password}
                    className="mt-1"
                />
                {!errors.password && (
                    <p id="password-help" className="mt-1 text-sm text-muted-foreground">
                        Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                    </p>
                )}
                <InputError id="password-error" message={errors.password} className="mt-1" />
            </div>

            <div>
                <InputWithLabel
                    id="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    required
                    value={data.password_confirmation}
                    onChange={value => onFieldChange('password_confirmation', value)}
                    placeholder="Re-enter your password"
                    error={errors.password_confirmation}
                    className="mt-1"
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
