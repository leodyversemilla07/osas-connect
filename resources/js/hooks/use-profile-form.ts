import { NumberFormatter } from '@/lib/number-formatter';
import type { ProfileFormData } from '@/types/profile';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for managing profile form state and operations
 * Provides form handling with Inertia.js integration
 */
export function useProfileForm(initialData: ProfileFormData, isStudent: boolean) {
    const { data, setData, errors, processing, progress } = useForm<ProfileFormData>(initialData);
    const calculationInProgress = useRef(false);

    // Calculate totals without causing infinite loops - removed setData from dependencies
    const calculateTotals = useCallback(
        (currentData: ProfileFormData) => {
            if (!isStudent || calculationInProgress.current) return;

            calculationInProgress.current = true;

            // Calculate total annual income
            const totalIncome =
                (currentData.combined_annual_pay_parents || 0) +
                (currentData.combined_annual_pay_siblings || 0) +
                (currentData.income_from_business || 0) +
                (currentData.income_from_land_rentals || 0) +
                (currentData.income_from_building_rentals || 0) +
                (currentData.retirement_benefits_pension || 0) +
                (currentData.commissions || 0) +
                (currentData.support_from_relatives || 0) +
                (currentData.bank_deposits || 0) +
                (currentData.other_income_amount || 0);

            // Calculate total monthly expenses
            const totalMonthlyExpenses =
                (currentData.house_rental || 0) +
                (currentData.food_grocery || 0) +
                (currentData.school_bus_payment || 0) +
                (currentData.transportation_expense || 0) +
                (currentData.education_plan_premiums || 0) +
                (currentData.insurance_policy_premiums || 0) +
                (currentData.health_insurance_premium || 0) +
                (currentData.sss_gsis_pagibig_loans || 0) +
                (currentData.clothing_expense || 0) +
                (currentData.utilities_expense || 0) +
                (currentData.communication_expense || 0) +
                (currentData.medicine_expense || 0) +
                (currentData.doctor_expense || 0) +
                (currentData.hospital_expense || 0) +
                (currentData.recreation_expense || 0);

            const annualizedMonthlyExpenses = totalMonthlyExpenses * 12;

            const totalAnnualExpenses =
                annualizedMonthlyExpenses +
                (currentData.school_tuition_fee || 0) +
                (currentData.withholding_tax || 0) +
                (currentData.sss_gsis_pagibig_contribution || 0) +
                (currentData.subtotal_annual_expenses || 0);

            // Update all calculated fields at once to prevent multiple re-renders
            const updates: Partial<ProfileFormData> = {};

            let hasUpdates = false;

            if (currentData.total_annual_income !== totalIncome) {
                updates.total_annual_income = totalIncome;
                hasUpdates = true;
            }

            if (currentData.total_monthly_expenses !== totalMonthlyExpenses) {
                updates.total_monthly_expenses = totalMonthlyExpenses;
                hasUpdates = true;
            }

            if (currentData.annualized_monthly_expenses !== annualizedMonthlyExpenses) {
                updates.annualized_monthly_expenses = annualizedMonthlyExpenses;
                hasUpdates = true;
            }

            if (currentData.total_annual_expenses !== totalAnnualExpenses) {
                updates.total_annual_expenses = totalAnnualExpenses;
                hasUpdates = true;
            }

            if (hasUpdates) {
                setData((prevData) => ({ ...prevData, ...updates }));
            }

            calculationInProgress.current = false;
        },
        [isStudent, setData],
    );

    // Update field value
    const updateField = useCallback(
        <T extends keyof ProfileFormData>(field: T, value: ProfileFormData[T]) => {
            setData((prevData) => {
                const newData = { ...prevData, [field]: value };
                // Trigger calculation with the new data
                setTimeout(() => calculateTotals(newData), 10);
                return newData;
            });
        },
        [setData, calculateTotals],
    );

    // Handle course changes with intelligent major field management (like registration)
    const handleCourseChange = useCallback(
        (courseValue: string) => {
            setData((prevData) => {
                // Determine if the new course requires a major (education courses and entrepreneurship)
                const requiresMajor = courseValue === 'Bachelor of Secondary Education' || courseValue === 'Bachelor of Science in Entrepreneurship';

                // Auto-adjust major field based on course type
                const newMajor = requiresMajor
                    ? prevData.major || '' // Keep existing major for courses that require majors
                    : 'None'; // Reset to 'None' for courses that don't require majors

                const newData = {
                    ...prevData,
                    course: courseValue,
                    major: newMajor,
                };

                // Trigger calculation with the new data
                setTimeout(() => calculateTotals(newData), 10);
                return newData;
            });
        },
        [setData, calculateTotals],
    );

    interface ValidationErrors {
        [key: string]: string;
    }

    const submitForm = useCallback(
        (onStepError: (step: number) => void) => {
            // Process data - ensure all fields are properly trimmed and formatted
            const processedData = {
                ...data,
                // Basic user fields
                first_name: data.first_name?.trim() || '',
                last_name: data.last_name?.trim() || '',
                middle_name: data.middle_name?.trim() || null,
                email: data.email?.trim() || '',

                // Ensure critical student fields are present
                student_id: data.student_id?.trim() || '',
                course: data.course?.trim() || '',
                major: data.major?.trim() || 'None',
                year_level: data.year_level?.trim() || '',
                civil_status: data.civil_status?.trim() || '',
                sex: data.sex?.trim() || '',
                date_of_birth: data.date_of_birth || '',
                place_of_birth: data.place_of_birth?.trim() || '',
                mobile_number: data.mobile_number?.trim() || '',
                is_pwd: Boolean(data.is_pwd),
                religion: data.religion?.trim() || '',
                residence_type: data.residence_type?.trim() || '',

                // Address fields
                street: data.street?.trim() || '',
                barangay: data.barangay?.trim() || '',
                city: data.city?.trim() || '',
                province: data.province?.trim() || '',
                zip_code: data.zip_code?.trim() || '',
            };
            return router.patch('/settings/profile', processedData, {
                onStart: () => {
                    // Form submission started - show loading toast
                    toast.loading('Saving your profile...', {
                        description: 'Please wait while we update your information.',
                    });
                },
                onError: (errors: ValidationErrors) => {
                    // Navigate to the step with errors
                    if (errors.total_annual_income || errors.total_monthly_expenses || errors.house_rental || errors.food_grocery) {
                        onStepError(5); // Financial Information
                    } else if (errors.father_name || errors.mother_name || errors.status_of_parents) {
                        onStepError(4); // Family Background
                    } else if (
                        errors.civil_status ||
                        errors.sex ||
                        errors.date_of_birth ||
                        errors.mobile_number ||
                        errors.religion ||
                        errors.street ||
                        errors.barangay ||
                        errors.city ||
                        errors.province ||
                        errors.zip_code ||
                        errors.place_of_birth ||
                        errors.residence_type
                    ) {
                        onStepError(3); // Personal Details
                    } else if (errors.student_id || errors.course || errors.year_level) {
                        onStepError(2); // Academic Information
                    } else {
                        onStepError(1); // Basic Information
                    }
                },
                onSuccess: () => {
                    // Profile updated successfully - show toast notification
                    toast.success('Profile updated successfully!', {
                        description: 'Your profile information has been saved.',
                    });
                },
                onFinish: () => {
                    // Form submission finished - dismiss any loading toasts
                    toast.dismiss();
                },
            });
        },
        [data],
    );

    return {
        data,
        setData,
        errors,
        processing,
        progress,
        updateField,
        handleCourseChange,
        submitForm,
        calculateTotals,
        NumberFormatter,
    };
}
