import { useMemo } from "react";
import { VALIDATION } from "@/lib/validation";
import type { RegisterForm } from "./use-registration-form";

export function useFormValidation() {
    // Validation rules as a memoized object
    const validationRules = useMemo(() => ({
        email: (value: string) => {
            if (!value) return "Email is required";
            if (!value.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN)) {
                return `Email must end with ${VALIDATION.EMAIL.DOMAIN}`;
            }
            return null;
        },

        password: (value: string) => {
            if (!value) return "Password is required";
            if (value.length < VALIDATION.PASSWORD.MIN_LENGTH) {
                return `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
            }
            return null;
        },

        passwordConfirmation: (password: string, confirmation: string) => {
            if (!confirmation) return "Password confirmation is required";
            if (password !== confirmation) return "Passwords do not match";
            return null;
        },

        studentId: (value: string) => {
            if (!value) return "Student ID is required";
            // Add additional format validation if needed
            return null;
        },

        mobileNumber: (value: string) => {
            if (!value) return "Mobile number is required";
            if (value.length !== VALIDATION.MOBILE_NUMBER.LENGTH) {
                return `Mobile number must be ${VALIDATION.MOBILE_NUMBER.LENGTH} digits`;
            }
            return null;
        },        required: (value: string | boolean, fieldName: string) => {
            if (!value || value === '') return `${fieldName} is required`;
            return null;
        }
    }), []);    
    
    // Real-time validation function
    const validateField = (field: keyof RegisterForm, value: string | boolean, data?: RegisterForm) => {
        // Handle boolean fields (like terms_agreement)
        if (typeof value === 'boolean') {
            return field === 'terms_agreement' && !value ? 'You must agree to the terms' : null;
        }

        // Handle string fields
        const stringValue = value as string;
        switch (field) {
            case 'email':
                return validationRules.email(stringValue);
            case 'password':
                return validationRules.password(stringValue);
            case 'password_confirmation':
                return data ? validationRules.passwordConfirmation(data.password, stringValue) : null;
            case 'student_id':
                return validationRules.studentId(stringValue);
            case 'mobile_number':
                return validationRules.mobileNumber(stringValue);
            case 'first_name':
            case 'last_name':
            case 'middle_name':
                return validationRules.required(stringValue, field.replace('_', ' '));
            default:
                return null;
        }
    };    // Get validation state for a field
    const getFieldState = (field: keyof RegisterForm, value: string | boolean, data?: RegisterForm) => {
        const error = validateField(field, value, data);
        return {
            isValid: !error,
            isInvalid: !!error,
            error,
        };
    };

    return {
        validateField,
        getFieldState,
        validationRules,
    };
}
