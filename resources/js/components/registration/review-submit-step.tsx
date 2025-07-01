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
                <CardHeader className="text-center pb-4 mb-4">
                    <CardTitle className="text-xl font-semibold text-foreground">Review Your Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please review all the information you've entered. You can go back to previous steps to make changes if needed.
                    </p>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <div className="pb-2 border-b border-border">
                            <Label className="text-lg font-semibold text-primary">Personal Information</Label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Full Name</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {[data.first_name, data.middle_name, data.last_name]
                                            .filter((v) => v && v.trim() !== '' && v !== 'N/A')
                                            .join(' ') || 'N/A'}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Sex</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.sex)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Civil Status</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.civil_status)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Date of Birth</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.date_of_birth)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Place of Birth</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.place_of_birth)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Religion</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.religion)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Address</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted leading-relaxed">
                                        {formatAddress()}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Mobile Number</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {formatMobileNumber(data.mobile_number)}
                                    </p>
                                </div>

                                {data.telephone_number && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-sm font-semibold text-foreground">Telephone</Label>
                                        <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                            {displayValue(data.telephone_number)}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Residence Type</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.residence_type)}
                                    </p>
                                </div>

                                {data.residence_type === 'With Guardian' && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-sm font-semibold text-foreground">Guardian Name</Label>
                                        <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                            {displayValue(data.guardian_name)}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">PWD Status</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
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
                        <div className="pb-2 border-b border-border">
                            <Label className="text-lg font-semibold text-primary">Academic Information</Label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Student ID</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.student_id)}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Course</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.course)}
                                    </p>
                                </div>

                                {data.major && data.major !== 'None' && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-sm font-semibold text-foreground">Major</Label>
                                        <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                            {displayValue(data.major)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Year Level</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
                                        {displayValue(data.year_level)}
                                    </p>
                                </div>

                                {data.scholarships && (
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-sm font-semibold text-foreground">Scholarships</Label>
                                        <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
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
                        <div className="pb-2 border-b border-border">
                            <Label className="text-lg font-semibold text-primary">Account Information</Label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm font-semibold text-foreground">Email Address</Label>
                                    <p className="text-sm text-muted-foreground pl-2 py-1 rounded border-l-2 border-muted">
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
            <Card className="border border-border">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <Checkbox
                            id="terms_agreement"
                            checked={data.terms_agreement}
                            onCheckedChange={(checked) => onFieldChange('terms_agreement', checked === true)}
                            aria-describedby={errors.terms_agreement ? "terms-error" : "terms-description"}
                            className="h-5 w-5 mt-0.5 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="flex-1 space-y-2">
                            <Label
                                htmlFor="terms_agreement"
                                className="text-sm font-semibold leading-relaxed cursor-pointer"
                            >
                                I agree to the Terms and Conditions and Privacy Policy{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <p id="terms-description" className="text-xs text-muted-foreground leading-relaxed">
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
                    <InputError id="terms-error" message={errors.terms_agreement} className="mt-3" />
                </CardContent>
            </Card>

            <Card className="border border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span>Ready to Submit?</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="bg-muted/20 rounded-lg p-4 border border-muted/40">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Once you submit this registration, you'll receive a confirmation email at{' '}
                            <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{data.email}</span>.{' '}
                            Please check your email (including spam folder) and follow the instructions to verify your account.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
});

ReviewSubmitStep.displayName = 'ReviewSubmitStep';

export default ReviewSubmitStep;
