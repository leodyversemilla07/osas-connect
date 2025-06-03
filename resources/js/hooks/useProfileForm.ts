import { useForm } from '@inertiajs/react';
import { FormEventHandler, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import type { ProfileFormData } from '@/types/profile';
import { NumberFormatter } from '@/utils/numberFormatter';/**
 * Custom hook for managing profile form state and operations
 * Provides form handling with Inertia.js integration
 */
export function useProfileForm(initialData: ProfileFormData, isStudent: boolean) {
    const { data, setData, errors, processing, progress } = useForm<ProfileFormData>(initialData);
    const calculationInProgress = useRef(false);

    // Calculate totals without causing infinite loops - removed setData from dependencies
    const calculateTotals = useCallback((currentData: ProfileFormData) => {
        if (!isStudent || calculationInProgress.current) return;

        calculationInProgress.current = true;

        // Calculate total annual income
        const totalIncome = (currentData.combined_annual_pay_parents || 0) +
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
        const totalMonthlyExpenses = (currentData.house_rental || 0) +
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

        const totalAnnualExpenses = annualizedMonthlyExpenses +
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
            setData(prevData => ({ ...prevData, ...updates }));
        }

        calculationInProgress.current = false;
    }, [isStudent, setData]);

    // Update field value
    const updateField = useCallback(<T extends keyof ProfileFormData>(field: T, value: ProfileFormData[T]) => {
        setData(prevData => {
            const newData = { ...prevData, [field]: value };
            // Trigger calculation with the new data
            setTimeout(() => calculateTotals(newData), 10);
            return newData;
        });
    }, [setData, calculateTotals]);

    // Submit form
    const submitForm: FormEventHandler = useCallback((e) => {
        e.preventDefault();

        // Process data
        const processedData = {
            ...data,
            first_name: data.first_name?.trim() || '',
            last_name: data.last_name?.trim() || '',
            middle_name: data.middle_name?.trim() || null,
            email: data.email?.trim() || '',
        };

        // Validate required fields
        const validationErrors: string[] = [];

        if (!processedData.first_name) {
            validationErrors.push('First name is required');
        }

        if (!processedData.last_name) {
            validationErrors.push('Last name is required');
        }

        if (!processedData.email) {
            validationErrors.push('Email is required');
        }

        if (validationErrors.length > 0) {
            console.error('Validation errors:', validationErrors);
            return;
        }

        router.post('/settings/profile', processedData, {
            forceFormData: true,
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            },
            onSuccess: () => {
                console.log('Profile updated successfully');
            }
        });
    }, [data]);

    return {
        data,
        setData,
        errors,
        processing,
        progress,
        updateField,
        submitForm,
        calculateTotals,
        NumberFormatter
    };
}
