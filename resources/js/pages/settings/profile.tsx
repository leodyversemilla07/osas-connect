import React, { FormEventHandler } from 'react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
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
import { useProfileForm } from '@/hooks/useProfileForm';
import { useProfileInitialData } from '@/hooks/useProfileInitialData';
import { useRoleInfo } from '@/hooks/useRoleInfo';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

/**
 * Enhanced Profile component with improved performance and maintainability
 * Features:
 * - Memoized section components to prevent unnecessary re-renders
 * - Extracted reusable form components
 * - Better TypeScript types
 * - Improved accessibility
 * - Enhanced error handling
 */
export default function Profile({
    photoUrl,
    profile
}: ProfileProps) {
    const { auth } = usePage<SharedData>().props;
    
    // Get role-specific information with proper type casting
    const userRole = auth.user.role as UserRole;
    const { roleIdField, roleDisplayName, isStudent } = useRoleInfo(userRole);

    // Initialize form data and state management
    const initialData = useProfileInitialData(profile, auth.user, isStudent);
    const {
        data,
        errors,
        processing,
        progress,
        updateField,
        submitForm
    } = useProfileForm(initialData, isStudent);    // Form submission handler with proper event handling
    const handleSubmit: FormEventHandler = React.useCallback((e) => {
        e.preventDefault();
        submitForm(e);
    }, [submitForm]);

    // Transform progress data for UI consistency
    const transformedProgress = React.useMemo(() => {
        if (!progress) return null;
        return {
            percentage: progress.percentage || 0
        };
    }, [progress]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <form onSubmit={handleSubmit} className="space-y-6" role="form">
                    {/* Basic Information Section - Always visible */}
                    <BasicInfoSection
                        data={data}
                        errors={errors}
                        updateField={updateField}
                        photoUrl={photoUrl}
                        roleIdField={roleIdField}
                        roleDisplayName={roleDisplayName}
                    />                    {/* Student-specific sections */}
                    {isStudent && (
                        <>
                            <AcademicInfoSection
                                data={data}
                                errors={errors}
                                updateField={updateField}
                            />

                            <PersonalInfoSection
                                data={data}
                                errors={errors}
                                updateField={updateField}
                            />

                            <FamilyBackgroundSection
                                data={data}
                                errors={errors}
                                updateField={updateField}
                            />

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
                    )}                    {/* Submit Button Section */}
                    <SubmitSection 
                        processing={processing} 
                        progress={transformedProgress} 
                    />
                </form>

                {/* Delete Account Section */}
                <Card className="border-destructive/50 mt-6">
                    <CardContent className="pt-6">
                        <DeleteUser />
                    </CardContent>
                </Card>
            </SettingsLayout>        </AppLayout>
    );
}
