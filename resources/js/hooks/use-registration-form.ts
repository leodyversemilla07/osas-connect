import { VALIDATION } from '@/lib/validation';
import { useForm } from '@inertiajs/react';
import { useCallback } from 'react';
import { route } from 'ziggy-js';

export type RegisterForm = {
    last_name: string;
    first_name: string;
    middle_name: string;
    email: string;
    student_id: string;
    password: string;
    password_confirmation: string;
    course: string;
    major: string;
    year_level: string;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: string;
    mobile_number: string;
    telephone_number: string;
    is_pwd: string;
    disability_type: string;
    religion: string;
    residence_type: string;
    guardian_name: string;
    scholarships: string;
    terms_agreement: boolean;
};

const INITIAL_DATA: Required<RegisterForm> = {
    last_name: '',
    first_name: '',
    middle_name: '',
    email: '',
    student_id: '',
    password: '',
    password_confirmation: '',
    course: '',
    major: 'None',
    year_level: '1st Year',
    civil_status: 'Single',
    sex: 'Male',
    date_of_birth: '',
    place_of_birth: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zip_code: '',
    mobile_number: '',
    telephone_number: '',
    is_pwd: 'No',
    disability_type: '',
    religion: 'Prefer not to say',
    residence_type: '',
    guardian_name: 'Not Applicable',
    scholarships: '',
    terms_agreement: false,
};

export function useRegistrationForm() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>(INITIAL_DATA); // Optimized handlers that don't need useCallback since setData is stable
    const updateField = useCallback(
        (field: keyof RegisterForm, value: string | boolean) => {
            setData(field, value);
        },
        [setData],
    );

    const updateMultipleFields = useCallback(
        (updates: Partial<RegisterForm>) => {
            setData((prevData) => ({ ...prevData, ...updates }));
        },
        [setData],
    );

    // Specialized handlers for complex field interactions
    const handleMobileNumberChange = useCallback(
        (value: string) => {
            // Remove any non-digit characters and ensure it doesn't start with 0
            let cleanValue = value.replace(/\D/g, '');
            if (cleanValue.startsWith('0')) cleanValue = cleanValue.substring(1);
            // Limit to VALIDATION.MOBILE_NUMBER.LENGTH digits
            if (cleanValue.length > VALIDATION.MOBILE_NUMBER.LENGTH) {
                cleanValue = cleanValue.substring(0, VALIDATION.MOBILE_NUMBER.LENGTH);
            }
            setData('mobile_number', cleanValue);
        },
        [setData],
    );

    const handleCourseChange = useCallback(
        (courseValue: string) => {
            const newMajor =
                courseValue !== 'Bachelor of Secondary Education' && courseValue !== 'Bachelor of Elementary Education' ? 'None' : data.major;
            updateMultipleFields({ course: courseValue, major: newMajor });
        },
        [data.major, updateMultipleFields],
    );

    const handleResidenceTypeChange = useCallback(
        (residenceType: string) => {
            const guardianName = residenceType === 'With Guardian' ? '' : 'Not Applicable';
            updateMultipleFields({ residence_type: residenceType, guardian_name: guardianName });
        },
        [updateMultipleFields],
    );

    const handlePwdChange = useCallback(
        (isPwd: string) => {
            const disabilityType = isPwd === 'No' ? '' : data.disability_type;
            updateMultipleFields({ is_pwd: isPwd, disability_type: disabilityType });
        },
        [data.disability_type, updateMultipleFields],
    );

    const handleDateOfBirthSelect = useCallback(
        (date: Date | undefined) => {
            const dateString = date ? date.toISOString().split('T')[0] : '';
            setData('date_of_birth', dateString);
        },
        [setData],
    );

    interface ValidationErrors {
        [key: string]: string;
    }

    const submitForm = useCallback(
        (onStepError: (step: number) => void) => {
            return post(route('register'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('password', 'password_confirmation');
                },
                onError: (errors: ValidationErrors) => {
                    console.error('Registration errors:', errors);

                    // Navigate to the step with errors
                    if (errors.email || errors.password || errors.password_confirmation) {
                        onStepError(3);
                    } else if (errors.student_id || errors.course || errors.year_level) {
                        onStepError(2);
                    } else {
                        onStepError(1);
                    }
                },
            });
        },
        [post, reset],
    );

    return {
        data,
        processing,
        errors,
        updateField,
        updateMultipleFields,
        handleMobileNumberChange,
        handleCourseChange,
        handleResidenceTypeChange,
        handlePwdChange,
        handleDateOfBirthSelect,
        submitForm,
    };
}
