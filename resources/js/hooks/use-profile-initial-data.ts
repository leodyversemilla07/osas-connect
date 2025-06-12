import { useMemo } from 'react';
import type { ProfileFormData, SiblingInfo } from '@/types/profile';
import type { User } from '@/types';

/**
 * Custom hook to initialize profile form data
 * Transforms server data into a consistent format for the form
 */
export function useProfileInitialData(
    profile: Record<string, unknown>,
    user: User,
    isStudent: boolean
): ProfileFormData {
    const initialData = useMemo(() => {
        // Helper function for safe data extraction
        const safeString = (value: unknown, fallback: string = ''): string => {
            if (value === null || value === undefined) return fallback;
            return String(value).trim() || fallback;
        };

        const safeNumber = (value: unknown, fallback: number = 0): number => {
            if (value === null || value === undefined || isNaN(Number(value))) return fallback;
            return Number(value);
        };

        const safeBoolean = (value: unknown, fallback: boolean = false): boolean => {
            if (value === null || value === undefined) return fallback;
            return Boolean(value);
        };

        const safeNullableString = (value: unknown, fallback: string | null = null): string | null => {
            if (value === null || value === undefined) return fallback;
            const str = String(value).trim();
            return str === '' ? fallback : str;
        };

        const safeNullableNumber = (value: unknown, fallback: number | null = null): number | null => {
            if (value === null || value === undefined || isNaN(Number(value))) return fallback;
            const num = Number(value);
            return num === 0 && fallback === null ? null : num;
        };

        const safeSiblings = (value: unknown): SiblingInfo[] | null => {
            if (!Array.isArray(value)) return null;
            return value.map(sibling => ({
                name: safeString(sibling?.name),
                age: safeNumber(sibling?.age),
                civil_status: safeString(sibling?.civil_status),
                educational_attainment: safeString(sibling?.educational_attainment),
                occupation: safeString(sibling?.occupation),
                monthly_income: safeNumber(sibling?.monthly_income)
            }));
        };

        const safeDate = (value: unknown, fallback: string = ''): string => {
            if (value === null || value === undefined) return fallback;
            const dateStr = String(value).trim();
            // Handle different date formats
            if (dateStr && dateStr !== '') {
                try {
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime())) {
                        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                    }
                } catch {
                    // Invalid date, return fallback
                }
            }
            return fallback;
        };

        return {
            // Basic Information with better fallbacks
            photo_id: null,
            first_name: safeString(profile.first_name, user.first_name || ''),
            middle_name: safeNullableString(profile.middle_name, user.middle_name || null),
            last_name: safeString(profile.last_name, user.last_name || ''),
            email: safeString(profile.email, user.email || ''),

            // Role-specific fields with better handling
            student_id: safeString(profile.student_id,
                user.role === 'student' ? user.student_profile?.student_id || '' : ''
            ),
            staff_id: safeString(profile.staff_id,
                user.role === 'osas_staff' ? user.osas_staff_profile?.staff_id || '' : ''
            ),
            admin_id: safeString(profile.admin_id,
                user.role === 'admin' ? (user.admin_profile?.admin_id || user.id?.toString()) || '' : ''
            ),

            // Student-specific data
            ...(isStudent && {
                course: safeString(profile.course),
                major: safeString(profile.major), year_level: safeString(profile.year_level), current_gwa: safeNullableNumber(profile.current_gwa),
                enrollment_status: safeString(profile.enrollment_status),
                units: safeNullableNumber(profile.units), existing_scholarships: safeNullableString(profile.existing_scholarships),

                // Personal Information
                civil_status: safeString(profile.civil_status),
                sex: safeString(profile.sex),
                date_of_birth: safeDate(profile.date_of_birth),
                place_of_birth: safeString(profile.place_of_birth),
                street: safeString(profile.street),
                barangay: safeString(profile.barangay),
                city: safeString(profile.city),
                province: safeString(profile.province),
                zip_code: safeString(profile.zip_code),
                mobile_number: safeString(profile.mobile_number),
                telephone_number: safeNullableString(profile.telephone_number),
                is_pwd: safeBoolean(profile.is_pwd),
                disability_type: safeNullableString(profile.disability_type),
                religion: safeString(profile.religion),
                residence_type: safeString(profile.residence_type),
                guardian_name: safeNullableString(profile.guardian_name),

                // Family Background
                status_of_parents: safeNullableString(profile.status_of_parents),

                // Father's Information
                father_name: safeNullableString(profile.father_name),
                father_age: safeNullableNumber(profile.father_age),
                father_address: safeNullableString(profile.father_address),
                father_telephone: safeNullableString(profile.father_telephone),
                father_mobile: safeNullableString(profile.father_mobile),
                father_email: safeNullableString(profile.father_email),
                father_occupation: safeNullableString(profile.father_occupation),
                father_company: safeNullableString(profile.father_company),
                father_monthly_income: safeNullableNumber(profile.father_monthly_income),
                father_years_service: safeNullableNumber(profile.father_years_service),
                father_education: safeNullableString(profile.father_education),
                father_school: safeNullableString(profile.father_school),
                father_unemployment_reason: safeNullableString(profile.father_unemployment_reason),

                // Mother's Information
                mother_name: safeNullableString(profile.mother_name),
                mother_age: safeNullableNumber(profile.mother_age),
                mother_address: safeNullableString(profile.mother_address),
                mother_telephone: safeNullableString(profile.mother_telephone),
                mother_mobile: safeNullableString(profile.mother_mobile),
                mother_email: safeNullableString(profile.mother_email), mother_occupation: safeNullableString(profile.mother_occupation),
                mother_company: safeNullableString(profile.mother_company),
                mother_monthly_income: safeNullableNumber(profile.mother_monthly_income),
                mother_years_service: safeNullableNumber(profile.mother_years_service),
                mother_education: safeNullableString(profile.mother_education),
                mother_school: safeNullableString(profile.mother_school),
                mother_unemployment_reason: safeNullableString(profile.mother_unemployment_reason),                // Siblings Information
                total_siblings: safeNumber(profile.total_siblings),
                siblings: safeSiblings(profile.siblings),

                // Income Information
                combined_annual_pay_parents: safeNumber(profile.combined_annual_pay_parents),
                combined_annual_pay_siblings: safeNumber(profile.combined_annual_pay_siblings),
                income_from_business: safeNumber(profile.income_from_business),
                income_from_land_rentals: safeNumber(profile.income_from_land_rentals),
                income_from_building_rentals: safeNumber(profile.income_from_building_rentals),
                retirement_benefits_pension: safeNumber(profile.retirement_benefits_pension),
                commissions: safeNumber(profile.commissions),
                support_from_relatives: safeNumber(profile.support_from_relatives),
                bank_deposits: safeNumber(profile.bank_deposits),
                other_income_description: safeNullableString(profile.other_income_description),
                other_income_amount: safeNumber(profile.other_income_amount),
                total_annual_income: safeNumber(profile.total_annual_income),

                // Appliances
                has_tv: safeBoolean(profile.has_tv),
                has_radio_speakers_karaoke: safeBoolean(profile.has_radio_speakers_karaoke),
                has_musical_instruments: safeBoolean(profile.has_musical_instruments),
                has_computer: safeBoolean(profile.has_computer),
                has_stove: safeBoolean(profile.has_stove),
                has_laptop: safeBoolean(profile.has_laptop),
                has_refrigerator: safeBoolean(profile.has_refrigerator),
                has_microwave: safeBoolean(profile.has_microwave),
                has_air_conditioner: safeBoolean(profile.has_air_conditioner),
                has_electric_fan: safeBoolean(profile.has_electric_fan),
                has_washing_machine: safeBoolean(profile.has_washing_machine),
                has_cellphone: safeBoolean(profile.has_cellphone),
                has_gaming_box: safeBoolean(profile.has_gaming_box),
                has_dslr_camera: safeBoolean(profile.has_dslr_camera),

                // Monthly Expenses
                house_rental: safeNumber(profile.house_rental),
                food_grocery: safeNumber(profile.food_grocery),
                car_loan_details: safeNullableString(profile.car_loan_details),
                other_loan_details: safeNullableString(profile.other_loan_details),
                school_bus_payment: safeNumber(profile.school_bus_payment),
                transportation_expense: safeNumber(profile.transportation_expense),
                education_plan_premiums: safeNumber(profile.education_plan_premiums),
                insurance_policy_premiums: safeNumber(profile.insurance_policy_premiums),
                health_insurance_premium: safeNumber(profile.health_insurance_premium),
                sss_gsis_pagibig_loans: safeNumber(profile.sss_gsis_pagibig_loans),
                clothing_expense: safeNumber(profile.clothing_expense),
                utilities_expense: safeNumber(profile.utilities_expense),
                communication_expense: safeNumber(profile.communication_expense),
                helper_details: safeNullableString(profile.helper_details),
                driver_details: safeNullableString(profile.driver_details),
                medicine_expense: safeNumber(profile.medicine_expense),
                doctor_expense: safeNumber(profile.doctor_expense),
                hospital_expense: safeNumber(profile.hospital_expense),
                recreation_expense: safeNumber(profile.recreation_expense),
                other_monthly_expense_details: safeNullableString(profile.other_monthly_expense_details),
                total_monthly_expenses: safeNumber(profile.total_monthly_expenses),
                annualized_monthly_expenses: safeNumber(profile.annualized_monthly_expenses),

                // Annual Expenses
                school_tuition_fee: safeNumber(profile.school_tuition_fee),
                withholding_tax: safeNumber(profile.withholding_tax),
                sss_gsis_pagibig_contribution: safeNumber(profile.sss_gsis_pagibig_contribution),
                other_annual_expense_details: safeNullableString(profile.other_annual_expense_details),
                subtotal_annual_expenses: safeNumber(profile.subtotal_annual_expenses),
                total_annual_expenses: safeNumber(profile.total_annual_expenses),
            })
        };
    }, [profile, user, isStudent]);

    return initialData;
}
