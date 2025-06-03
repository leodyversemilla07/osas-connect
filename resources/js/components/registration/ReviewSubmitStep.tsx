import React, { memo } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import type { RegisterForm } from "@/hooks/useRegistrationForm";

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
        return number ? `+63${number}` : '';
    };

    const formatAddress = () => {
        const parts = [data.street, data.barangay, data.city, data.province];
        const addressParts = parts.filter(Boolean).join(', ');
        return data.zip_code ? `${addressParts} ${data.zip_code}` : addressParts;
    };

    return (
        <div className="space-y-8">
            <div className="p-8 bg-muted/50 rounded-xl border shadow-sm">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-foreground">Review Your Information</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please review all the information you've entered. You can go back to previous steps to make changes if needed.
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* Personal Information */}
                    <div className="bg-background rounded-lg p-6 shadow-sm border">
                        <h4 className="font-medium text-base text-primary mb-4 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Full Name</span>
                                <p className="text-muted-foreground">
                                    {`${data.first_name} ${data.middle_name} ${data.last_name}`}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Sex</span>
                                <p className="text-muted-foreground">{data.sex}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Civil Status</span>
                                <p className="text-muted-foreground">{data.civil_status}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Date of Birth</span>
                                <p className="text-muted-foreground">{data.date_of_birth}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Place of Birth</span>
                                <p className="text-muted-foreground">{data.place_of_birth}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Religion</span>
                                <p className="text-muted-foreground">{data.religion}</p>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <span className="font-medium text-foreground">Address</span>
                                <p className="text-muted-foreground">{formatAddress()}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Mobile Number</span>
                                <p className="text-muted-foreground">{formatMobileNumber(data.mobile_number)}</p>
                            </div>
                            {data.telephone_number && (
                                <div className="space-y-1">
                                    <span className="font-medium text-foreground">Telephone</span>
                                    <p className="text-muted-foreground">{data.telephone_number}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Residence Type</span>
                                <p className="text-muted-foreground">{data.residence_type}</p>
                            </div>
                            {data.residence_type === 'With Guardian' && (
                                <div className="space-y-1">
                                    <span className="font-medium text-foreground">Guardian Name</span>
                                    <p className="text-muted-foreground">{data.guardian_name}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">PWD Status</span>
                                <p className="text-muted-foreground">
                                    {data.is_pwd}
                                    {data.is_pwd === 'Yes' && data.disability_type && ` - ${data.disability_type}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-background rounded-lg p-6 shadow-sm border">
                        <h4 className="font-medium text-base text-primary mb-4 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            Academic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div className="md:col-span-2 space-y-4">
                                <div className="space-y-1">
                                    <span className="font-medium text-foreground">Student ID</span>
                                    <p className="text-muted-foreground">{data.student_id}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-medium text-foreground">Course</span>
                                    <p className="text-muted-foreground">{data.course}</p>
                                </div>
                            </div>
                            {data.major !== 'None' && (
                                <div className="space-y-1">
                                    <span className="font-medium text-foreground">Major</span>
                                    <p className="text-muted-foreground">{data.major}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Year Level</span>
                                <p className="text-muted-foreground">{data.year_level}</p>
                            </div>
                            {data.scholarships && (
                                <div className="md:col-span-2 space-y-1">
                                    <span className="font-medium text-foreground">Scholarships</span>
                                    <p className="text-muted-foreground">{data.scholarships}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-background rounded-lg p-6 shadow-sm border">
                        <h4 className="font-medium text-base text-primary mb-4 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            Account Information
                        </h4>
                        <div className="text-sm">
                            <div className="space-y-1">
                                <span className="font-medium text-foreground">Email Address</span>
                                <p className="text-muted-foreground">{data.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="p-6 bg-background rounded-lg border space-y-4">
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
            </div>

            <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="font-medium text-primary mb-2">Ready to Submit?</h4>
                <p className="text-sm text-muted-foreground">
                    Once you submit this registration, you'll receive a confirmation email at <span className="font-medium text-foreground">{data.email}</span>.{' '}
                    Please check your email (including spam folder) and follow the instructions to verify your account.
                </p>
            </div>
        </div>
    );
});

ReviewSubmitStep.displayName = 'ReviewSubmitStep';

export default ReviewSubmitStep;
