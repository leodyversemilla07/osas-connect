import { FormEventHandler, useCallback, useState } from 'react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

// Profile components
import { BasicInfoSection } from '@/components/profile/basic-info-section';
import { AcademicInfoSection } from '@/components/profile/academic-info-section';
import { PersonalInfoSection } from '@/components/profile/personal-info-section';
import { FamilyBackgroundSection } from '@/components/profile/family-background-section';
import { FinancialInfoSection } from '@/components/profile/financial-info-section';
import { AssetsAppliancesSection } from '@/components/profile/assets-appliances-section';
import { SubmitSection } from '@/components/profile/submit-section';

// Types and hooks
import type { ProfileProps, UserRole } from '@/types/profile';
import { useProfileForm } from '@/hooks/use-profile-form';
import { useProfileInitialData } from '@/hooks/use-profile-initial-data';
import { useRoleInfo } from '@/hooks/use-role-info';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

/**
 * Enhanced Profile component with step-based navigation
 * Features:
 * - Step-based organization for better UX
 * - Save changes at any step
 * - No forced validation or review step
 * - Always accessible delete account section
 */
export default function Profile({
    photoUrl,
    profile
}: ProfileProps) {
    const { auth } = usePage<SharedData>().props;

    // Get role-specific information with proper type casting
    const userRole = auth.user.role as UserRole;
    const { roleIdField, roleDisplayName, isStudent } = useRoleInfo(userRole);

    // Step navigation state
    const [currentStep, setCurrentStep] = useState(1);

    const sectionTitles = isStudent ? [
        "Basic Information",
        "Academic Information",
        "Personal Details",
        "Family Background",
        "Financial Information"
    ] : ["Basic Information"];
    const totalSections = sectionTitles.length;

    const currentSectionTitle = sectionTitles[currentStep - 1];

    // Initialize form data and state management
    const initialData = useProfileInitialData(profile, auth.user, isStudent);

    const {
        data,
        errors,
        processing,
        updateField,
        handleCourseChange,
        submitForm
    } = useProfileForm(initialData, isStudent);

    // Simple navigation functions
    const goToNextStep = useCallback(() => {
        if (currentStep < totalSections) {
            setCurrentStep(currentStep + 1);
        }
    }, [currentStep, totalSections]);

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    // Form submission handler - can be called from any step
    const handleSubmit: FormEventHandler = useCallback((e) => {
        e.preventDefault();

        // Navigate to step with validation errors
        submitForm((errorStep: number) => {
            setCurrentStep(errorStep);
        });
    }, [submitForm, setCurrentStep]);

    // Render current step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoSection
                        data={data}
                        errors={errors}
                        updateField={updateField}
                        photoUrl={photoUrl}
                        roleIdField={roleIdField}
                        roleDisplayName={roleDisplayName}
                    />
                );

            case 2:
                return isStudent ? (
                    <AcademicInfoSection
                        data={data}
                        errors={errors}
                        updateField={updateField}
                        handleCourseChange={handleCourseChange}
                    />
                ) : null;

            case 3:
                return isStudent ? (
                    <PersonalInfoSection
                        data={data}
                        errors={errors}
                        updateField={updateField}
                    />
                ) : null;

            case 4:
                return isStudent ? (
                    <FamilyBackgroundSection
                        data={data}
                        errors={errors}
                        updateField={updateField}
                    />
                ) : null;

            case 5:
                return isStudent ? (
                    <>
                        <FinancialInfoSection
                            data={data}
                            errors={errors}
                            updateField={updateField}
                        />
                        <AssetsAppliancesSection
                            data={data}
                            errors={errors}
                            updateField={updateField}
                        />
                    </>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <SettingsLayout>
                {/* Current Section Title */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">
                        {currentSectionTitle}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Update your profile information
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" role="form">
                    {/* Error Summary - Show validation errors */}
                    {Object.keys(errors).length > 0 && (
                        <Card className="border-destructive/50 bg-destructive/5">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-destructive/10 p-2">
                                        <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-destructive mb-2">Please fix the following errors:</h3>
                                        <ul className="text-sm space-y-1">
                                            {Object.entries(errors).map(([field, message]) => (
                                                <li key={field} className="text-muted-foreground">
                                                    • <span className="font-medium">{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span> {message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-6">{renderStepContent()}

                        {/* Save Button - Always present */}
                        <SubmitSection
                            processing={processing}
                            progress={null}
                        />

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
                            {currentStep < totalSections && (
                                <Button
                                    type="button"
                                    onClick={goToNextStep}
                                    disabled={processing}
                                    aria-label="Go to next step"
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Delete Account Section - Always visible */}
                <Card className="border-destructive/50 mt-6">
                    <CardContent className="pt-6">
                        <DeleteUser />
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}
