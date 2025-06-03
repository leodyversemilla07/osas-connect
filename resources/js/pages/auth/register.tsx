import { Head } from "@inertiajs/react";
import { FormEventHandler, useCallback } from "react";
import { route } from "ziggy-js";
import AuthLayout from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import TextLink from "@/components/text-link";
import { LoaderCircle } from "lucide-react";
import StepProgress from "@/components/ui/step-progress";
import PersonalInformationStep from "@/components/registration/PersonalInformationStep";
import AcademicInformationStep from "@/components/registration/AcademicInformationStep";
import AccountSetupStep from "@/components/registration/AccountSetupStep";
import ReviewSubmitStep from "@/components/registration/ReviewSubmitStep";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { useRegistrationSteps, STEP_TITLES } from "@/hooks/useRegistrationSteps";

export default function Register() {
    // Custom hooks for cleaner state management
    const {
        data,
        processing,
        errors,
        updateField,
        handleMobileNumberChange,
        handleCourseChange,
        handleResidenceTypeChange,
        handlePwdChange,
        handleDateOfBirthSelect,
        submitForm,
    } = useRegistrationForm();

    const {
        currentStep,
        totalSteps,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        validateAllSteps,
        findFirstInvalidStep,
    } = useRegistrationSteps();

    // Simplified form submission
    const submit: FormEventHandler = useCallback((e) => {
        e.preventDefault();

        if (currentStep === totalSteps) {
            if (!validateAllSteps(data)) {
                const invalidStep = findFirstInvalidStep(data);
                setCurrentStep(invalidStep);
                return;
            }

            submitForm(setCurrentStep);
        }
    }, [currentStep, totalSteps, validateAllSteps, data, findFirstInvalidStep, setCurrentStep, submitForm]);

    // Handle next step navigation
    const handleNextStep = useCallback(() => {
        goToNextStep(data);
    }, [goToNextStep, data]);

    // Render current step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInformationStep
                        data={data}
                        errors={errors}
                        onFieldChange={updateField}
                        onMobileNumberChange={handleMobileNumberChange}
                        onResidenceTypeChange={handleResidenceTypeChange}
                        onPwdChange={handlePwdChange}
                        onDateOfBirthSelect={handleDateOfBirthSelect}
                    />
                );

            case 2:
                return (
                    <AcademicInformationStep
                        data={data}
                        errors={errors}
                        onFieldChange={updateField}
                        onCourseChange={handleCourseChange}
                    />
                );

            case 3:
                return (
                    <AccountSetupStep
                        data={data}
                        errors={errors}
                        onFieldChange={updateField}
                    />
                );

            case 4:
                return (
                    <ReviewSubmitStep
                        data={data}
                        errors={errors}
                        onFieldChange={updateField}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <AuthLayout
            title="Create a student account"
            description="Enter your details below to create your student account for OSAS Connect"
        >
            <Head title="Student Registration" />

            <StepProgress
                steps={STEP_TITLES}
                currentStep={currentStep}
                totalSteps={totalSteps}
            />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {renderStepContent()}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-6">
                        {currentStep > 1 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goToPreviousStep}
                                disabled={processing}
                                aria-label="Go to previous step"
                            >
                                Previous
                            </Button>
                        ) : (
                            <div />
                        )}

                        {currentStep < totalSteps ? (
                            <Button
                                type="button"
                                onClick={handleNextStep}
                                disabled={processing}
                                aria-label="Go to next step"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={processing || !data.terms_agreement}
                                aria-label="Submit registration"
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={currentStep === totalSteps ? 3 : 4}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
