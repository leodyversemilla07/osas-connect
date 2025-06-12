import { useCallback, useMemo, useState } from "react";
import { VALIDATION } from "@/lib/validation";
import type { RegisterForm } from "./use-registration-form";

export const STEP_TITLES = [
    "Personal Information",
    "Academic Information", 
    "Account Setup",
    "Review & Submit"
] as const;

export function useRegistrationSteps() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // Field groups to validate for each step
    const STEP_FIELDS = useMemo(() => ({
        PERSONAL: [
            'first_name', 'last_name', 'middle_name', 'sex', 'civil_status',
            'date_of_birth', 'place_of_birth', 'street', 'barangay', 'city',
            'province', 'mobile_number', 'religion', 'residence_type'
        ] as const,
        ACADEMIC: ['student_id', 'course', 'year_level'] as const,
        ACCOUNT: ['email', 'password', 'password_confirmation'] as const
    }), []);

    const validateStep = useCallback((step: number, data: RegisterForm): boolean => {
        try {
            switch (step) {
                case 1: {
                    // Validate Personal Information fields
                    if (STEP_FIELDS.PERSONAL.some(field => !data[field])) {
                        return false;
                    }

                    if (data.residence_type === 'With Guardian' && !data.guardian_name) {
                        return false;
                    }

                    if (data.is_pwd === 'Yes' && !data.disability_type) {
                        return false;
                    }

                    return true;
                }

                case 2: {
                    // Validate Academic Information fields
                    return STEP_FIELDS.ACADEMIC.every(field => !!data[field]);
                }

                case 3: {
                    // Validate Account Setup fields
                    if (STEP_FIELDS.ACCOUNT.some(field => !data[field])) {
                        return false;
                    }

                    // Check email format
                    if (!data.email.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN)) {
                        return false;
                    }

                    // Check password confirmation
                    if (data.password !== data.password_confirmation) {
                        return false;
                    }

                    return true;
                }

                case 4: {
                    // Validate final review and terms agreement
                    return data.terms_agreement === true;
                }

                default:
                    return true;
            }
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }, [STEP_FIELDS]);

    const goToNextStep = useCallback((data: RegisterForm) => {
        if (currentStep < totalSteps && validateStep(currentStep, data)) {
            setCurrentStep(currentStep + 1);
            return true;
        }
        return false;
    }, [currentStep, totalSteps, validateStep]);

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    const validateAllSteps = useCallback((data: RegisterForm): boolean => {
        return [1, 2, 3, 4].every(step => validateStep(step, data));
    }, [validateStep]);

    const findFirstInvalidStep = useCallback((data: RegisterForm): number => {
        for (let step = 1; step <= totalSteps; step++) {
            if (!validateStep(step, data)) {
                return step;
            }
        }
        return 1;
    }, [totalSteps, validateStep]);

    return {
        currentStep,
        totalSteps,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        validateStep,
        validateAllSteps,
        findFirstInvalidStep,
    };
}
