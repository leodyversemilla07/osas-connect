import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { RegisterForm } from '@/hooks/use-registration-form';
import { memo } from 'react';

interface ReviewSubmitStepProps {
    data: RegisterForm;
    errors: Record<string, string>;
    onFieldChange: (field: keyof RegisterForm, value: string | boolean) => void;
}

const ReviewSubmitStep = memo<ReviewSubmitStepProps>(({ data, errors, onFieldChange }) => {
    const formatMobileNumber = (number: string) => {
        return number ? `+63${number}` : 'N/A';
    };

    const formatAddress = () => {
        const parts = [data.street, data.barangay, data.city, data.province].filter(Boolean);
        if (parts.length === 0 && !data.zip_code) return 'N/A';
        const addressParts = parts.join(', ');
        return data.zip_code ? `${addressParts}${addressParts ? ' ' : ''}${data.zip_code}` : addressParts;
    };

    const displayValue = (value: string | undefined | null) => {
        return value && value.trim() !== '' ? value : 'N/A';
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="mb-4 pb-4 text-center">
                    <CardTitle className="text-foreground text-xl font-semibold">Review Your Information</CardTitle>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Please review all the information you've entered. You can go back to previous steps to make changes if needed.
                    </p>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <div className="border-border border-b pb-2">
                            <Label className="text-primary text-lg font-semibold">Personal Information</Label>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Full Name</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {[data.first_name, data.middle_name, data.last_name]
                                            .filter((v) => v && v.trim() !== '' && v !== 'N/A')
                                            .join(' ') || 'N/A'}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Sex</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.sex)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Civil Status</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.civil_status)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Date of Birth</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.date_of_birth)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Place of Birth</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.place_of_birth)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Religion</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.religion)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Address</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm leading-relaxed">
                                        {formatAddress()}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Mobile Number</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {formatMobileNumber(data.mobile_number)}
                                    </p>
                                </div>

                                {data.telephone_number && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-foreground text-sm font-semibold">Telephone</Label>
                                        <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                            {displayValue(data.telephone_number)}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Residence Type</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.residence_type)}
                                    </p>
                                </div>

                                {data.residence_type === 'With Guardian' && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-foreground text-sm font-semibold">Guardian Name</Label>
                                        <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                            {displayValue(data.guardian_name)}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">PWD Status</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.is_pwd)}
                                        {data.is_pwd === 'Yes' && data.disability_type && ` - ${displayValue(data.disability_type)}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Academic Information Section */}
                    <div className="space-y-6">
                        <div className="border-border border-b pb-2">
                            <Label className="text-primary text-lg font-semibold">Academic Information</Label>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Student ID</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.student_id)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Course</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.course)}
                                    </p>
                                </div>

                                {data.major && data.major !== 'None' && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-foreground text-sm font-semibold">Major</Label>
                                        <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                            {displayValue(data.major)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Year Level</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.year_level)}
                                    </p>
                                </div>

                                {data.scholarships && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-foreground text-sm font-semibold">Scholarships</Label>
                                        <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                            {displayValue(data.scholarships)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Account Information Section */}
                    <div className="space-y-6">
                        <div className="border-border border-b pb-2">
                            <Label className="text-primary text-lg font-semibold">Account Information</Label>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-foreground text-sm font-semibold">Email Address</Label>
                                    <p className="text-muted-foreground border-muted rounded border-l-2 py-1 pl-2 text-sm">
                                        {displayValue(data.email)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-4" />

            {/* Terms and Conditions */}
            <Card className="border-border border">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <Checkbox
                            id="terms_agreement"
                            checked={data.terms_agreement}
                            onCheckedChange={(checked) => onFieldChange('terms_agreement', checked === true)}
                            aria-describedby={errors.terms_agreement ? 'terms-error' : 'terms-description'}
                            className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5 h-5 w-5"
                        />
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="terms_agreement" className="cursor-pointer text-sm leading-relaxed font-semibold">
                                I agree to the Terms and Conditions and Privacy Policy <span className="text-red-500">*</span>
                            </Label>
                            <p id="terms-description" className="text-muted-foreground text-xs leading-relaxed">
                                By checking this box, you acknowledge that you have read, understood, and agree to be bound by our{' '}
                                <TextLink href="/terms" target="_blank" className="hover:text-primary underline transition-colors">
                                    Terms and Conditions
                                </TextLink>{' '}
                                and{' '}
                                <TextLink href="/privacy" target="_blank" className="hover:text-primary underline transition-colors">
                                    Privacy Policy
                                </TextLink>
                                .
                            </p>
                        </div>
                    </div>
                    <InputError id="terms-error" message={errors.terms_agreement} className="mt-3" />
                </CardContent>
            </Card>

            <Card className="border-border border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-primary flex items-center gap-2 text-lg font-semibold">
                        <span>Ready to Submit?</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="bg-muted/20 border-muted/40 rounded-lg border p-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Once you submit this registration, you'll receive a confirmation email at{' '}
                            <span className="text-foreground bg-muted rounded px-2 py-0.5 font-semibold">{data.email}</span>. Please check your email
                            (including spam folder) and follow the instructions to verify your account.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

ReviewSubmitStep.displayName = 'ReviewSubmitStep';

export default ReviewSubmitStep;
