import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RegisterForm } from "@/hooks/use-registration-form";

interface ReviewSubmitStepProps {
    data: RegisterForm;
    errors: Record<string, string>;
    onFieldChange: (field: keyof RegisterForm, value: string | boolean) => void;
}

const ReviewSubmitStep = memo<ReviewSubmitStepProps>(({
    data,
    errors,
    onFieldChange,
}) => {
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
                <CardHeader className="text-center mb-8">
                    <CardTitle className="text-xl font-semibold text-foreground">Review Your Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please review all the information you've entered. You can go back to previous steps to make changes if needed.
                    </p>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div className="mb-2">
                        <Label className="font-medium text-base text-primary">Personal Information</Label>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Full Name:
                                <span className="block text-muted-foreground font-normal">{
                                    [data.first_name, data.middle_name, data.last_name]
                                        .filter((v) => v && v.trim() !== '' && v !== 'N/A')
                                        .join(' ') || 'N/A'
                                }</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Sex:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.sex)}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Civil Status:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.civil_status)}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Date of Birth:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.date_of_birth)}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Place of Birth:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.place_of_birth)}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Religion:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.religion)}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Address:
                                <span className="block text-muted-foreground font-normal">{formatAddress()}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Mobile Number:
                                <span className="block text-muted-foreground font-normal">{formatMobileNumber(data.mobile_number)}</span>
                            </Label>
                        </div>
                        {data.telephone_number && (
                            <div className="space-y-1">
                                <Label className="font-medium text-foreground">Telephone:
                                    <span className="block text-muted-foreground font-normal">{displayValue(data.telephone_number)}</span>
                                </Label>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Residence Type:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.residence_type)}</span>
                            </Label>
                        </div>
                        {data.residence_type === 'With Guardian' && (
                            <div className="space-y-1">
                                <Label className="font-medium text-foreground">Guardian Name:
                                    <span className="block text-muted-foreground font-normal">{displayValue(data.guardian_name)}</span>
                                </Label>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">PWD Status:
                                <span className="block text-muted-foreground font-normal">
                                    {displayValue(data.is_pwd)}
                                    {data.is_pwd === 'Yes' && data.disability_type && ` - ${displayValue(data.disability_type)}`}
                                </span>
                            </Label>
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="mb-4 flex items-center gap-2">
                        <Label className="font-medium text-base text-primary">Academic Information</Label>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Student ID:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.student_id)}</span>
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Course:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.course)}</span>
                            </Label>
                        </div>
                        {data.major && data.major !== 'None' && (
                            <div className="space-y-1">
                                <Label className="font-medium text-foreground">Major:
                                    <span className="block text-muted-foreground font-normal">{displayValue(data.major)}</span>
                                </Label>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Year Level:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.year_level)}</span>
                            </Label>
                        </div>
                        {data.scholarships && (
                            <div className="space-y-1">
                                <Label className="font-medium text-foreground">Scholarships:
                                    <span className="block text-muted-foreground font-normal">{displayValue(data.scholarships)}</span>
                                </Label>
                            </div>
                        )}
                    </div>

                    <Separator className="my-2" />

                    <div className="mb-4 flex items-center gap-2">
                        <Label className="font-medium text-base text-primary">Account Information</Label>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="space-y-1">
                            <Label className="font-medium text-foreground">Email Address:
                                <span className="block text-muted-foreground font-normal">{displayValue(data.email)}</span>
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-4" />

            {/* Terms and Conditions */}
            <Card>
                <CardContent>
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="terms_agreement"
                            checked={data.terms_agreement}
                            onCheckedChange={(checked) => onFieldChange('terms_agreement', checked === true)}
                            aria-describedby={errors.terms_agreement ? "terms-error" : "terms-description"}
                            className="h-4 w-4 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="terms_agreement"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I agree to the Terms and Conditions and Privacy Policy{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <p id="terms-description" className="text-xs text-muted-foreground">
                                By checking this box, you acknowledge that you have read, understood, and agree to be bound by our{' '}
                                <TextLink href="/terms" target="_blank" className="underline hover:text-primary transition-colors">
                                    Terms and Conditions
                                </TextLink>
                                {' '}and{' '}
                                <TextLink href="/privacy" target="_blank" className="underline hover:text-primary transition-colors">
                                    Privacy Policy
                                </TextLink>.
                            </p>
                        </div>
                    </div>
                    <InputError id="terms-error" message={errors.terms_agreement} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-medium text-primary mb-2">Ready to Submit?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Once you submit this registration, you'll receive a confirmation email at <span className="font-medium text-foreground">{data.email}</span>.{' '}
                        Please check your email (including spam folder) and follow the instructions to verify your account.
                    </p>
                </CardContent>
            </Card>
        </div >
    );
});

ReviewSubmitStep.displayName = 'ReviewSubmitStep';

export default ReviewSubmitStep;
