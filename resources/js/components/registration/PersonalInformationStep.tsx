import React, { memo, useCallback, useMemo } from "react";
import { TextField, SelectField, RadioField } from "@/components/ui/form-field";
import { DatePickerField } from "@/components/ui/date-picker-field";
import AddressForm from "@/components/address-form";
import PlaceOfBirthForm from "@/components/place-of-birth-form";
import type { RegisterForm } from "@/hooks/useRegistrationForm";

interface PersonalInformationStepProps {
    data: RegisterForm;
    errors: Record<string, string>;
    onFieldChange: (field: keyof RegisterForm, value: string | boolean) => void;
    onMobileNumberChange: (value: string) => void;
    onResidenceTypeChange: (value: string) => void;
    onPwdChange: (value: string) => void;
    onDateOfBirthSelect: (date: Date | undefined) => void;
    processing?: boolean;
}

// Constants for select options
const CIVIL_STATUS_OPTIONS = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
];

const RELIGION_OPTIONS = [
    { value: "Christianity", label: "Christianity" },
    { value: "Islam", label: "Islam" },
    { value: "Buddhism", label: "Buddhism" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Judaism", label: "Judaism" },
    { value: "Other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" },
];

const SEX_OPTIONS = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const RESIDENCE_TYPE_OPTIONS = [
    { value: "Parent's House", label: "Parent's House" },
    { value: "Boarding House", label: "Boarding House" },
    { value: "With Guardian", label: "With Guardian" },
];

const PWD_OPTIONS = [
    { value: "No", label: "No" },
    { value: "Yes", label: "Yes" },
];

/**
 * PersonalInformationStep - Refactored registration form component
 * 
 * Features:
 * - Uses reusable form field components for consistency
 * - Optimized with React.memo and useCallback for performance
 * - Proper TypeScript interfaces for type safety
 * - Accessible form fields with ARIA attributes
 * - Conditional field rendering based on user selections
 * - Integrated with existing AddressForm and PlaceOfBirthForm components
 */
const PersonalInformationStep = memo<PersonalInformationStepProps>(({
    data,
    errors,
    onFieldChange,
    onMobileNumberChange,
    onResidenceTypeChange,
    onPwdChange,
    onDateOfBirthSelect,
    processing = false,
}) => {
    // Memoized field change handlers
    const handleFieldChange = useCallback((field: keyof RegisterForm) => (value: string) => {
        onFieldChange(field, value);
    }, [onFieldChange]);

    // Address form data adapter
    const addressData = {
        street: data.street,
        barangay: data.barangay,
        city: data.city,
        province: data.province,
        zip_code: data.zip_code,
    };

    const handleAddressChange = useCallback((field: 'street' | 'barangay' | 'city' | 'province' | 'zip_code', value: string) => {
        onFieldChange(field, value);
    }, [onFieldChange]);

    // Place of birth form data adapter
    const placeOfBirthData = {
        place_of_birth: data.place_of_birth,
    };

    const handlePlaceOfBirthChange = useCallback((field: 'place_of_birth', value: string) => {
        onFieldChange(field, value);
    }, [onFieldChange]);    // Mobile number prefix component - memoized to prevent re-renders
    const mobilePrefix = useMemo(() => (
        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
            +63
        </span>
    ), []);

    // Memoized options to prevent unnecessary re-renders
    const sexOptions = useMemo(() => SEX_OPTIONS, []);
    const civilStatusOptions = useMemo(() => CIVIL_STATUS_OPTIONS, []);
    const religionOptions = useMemo(() => RELIGION_OPTIONS, []);
    const residenceTypeOptions = useMemo(() => RESIDENCE_TYPE_OPTIONS, []);
    const pwdOptions = useMemo(() => PWD_OPTIONS, []);

    return (
        <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                    id="last_name"
                    label="Last Name"
                    required
                    value={data.last_name}
                    onChange={handleFieldChange('last_name')}
                    placeholder="Enter your last name"
                    error={errors.last_name}
                />

                <TextField
                    id="first_name"
                    label="First Name"
                    required
                    value={data.first_name}
                    onChange={handleFieldChange('first_name')}
                    placeholder="Enter your first name"
                    error={errors.first_name}
                />

                <TextField
                    id="middle_name"
                    label="Middle Name"
                    required
                    value={data.middle_name}
                    onChange={handleFieldChange('middle_name')}
                    placeholder="Enter your middle name"
                    error={errors.middle_name}
                />
            </div>            {/* Sex and Civil Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                    id="sex"
                    label="Sex"
                    required
                    value={data.sex}
                    onChange={handleFieldChange('sex')}
                    placeholder="Select sex"
                    options={sexOptions}
                    error={errors.sex}
                />

                <SelectField
                    id="civil_status"
                    label="Civil Status"
                    required
                    value={data.civil_status}
                    onChange={handleFieldChange('civil_status')}
                    placeholder="Select civil status"
                    options={civilStatusOptions}
                    error={errors.civil_status}
                />
            </div>            {/* Date of Birth */}
            <DatePickerField
                id="date_of_birth"
                label="Date of Birth"
                required
                value={data.date_of_birth ? new Date(new Date(data.date_of_birth).getTime()) : undefined}
                onChange={onDateOfBirthSelect}
                placeholder="Select date of birth"
                error={errors.date_of_birth}
                maxDate={new Date()}
            />

            {/* Place of Birth */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Place of Birth <span className="text-red-500">*</span>
                </label>
                <PlaceOfBirthForm
                    data={placeOfBirthData}
                    setData={handlePlaceOfBirthChange}
                    errors={errors}
                    processing={processing}
                />
            </div>{/* Address */}
            <div>
                <label className="text-sm font-medium">
                    Address <span className="text-red-500">*</span>
                </label>
                <AddressForm
                    data={addressData}
                    setData={handleAddressChange}
                    errors={errors}
                    processing={processing}
                />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    id="mobile_number"
                    label="Mobile Number"
                    type="tel"
                    required
                    value={data.mobile_number}
                    onChange={onMobileNumberChange}
                    placeholder="9123456789"
                    prefix={mobilePrefix}
                    error={errors.mobile_number}
                />                <TextField
                    id="telephone_number"
                    label="Telephone Number"
                    value={data.telephone_number}
                    onChange={handleFieldChange('telephone_number')}
                    placeholder="Enter telephone number"
                    error={errors.telephone_number}
                />
            </div>            
            
            {/* Religion and Residence Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                    id="religion"
                    label="Religion"
                    required
                    value={data.religion}
                    onChange={handleFieldChange('religion')}
                    placeholder="Select religion"
                    options={religionOptions}
                    error={errors.religion}
                />

                <SelectField
                    id="residence_type"
                    label="Residence Type"
                    required
                    value={data.residence_type}
                    onChange={onResidenceTypeChange}
                    placeholder="Select residence type"
                    options={residenceTypeOptions}
                    error={errors.residence_type}
                />
            </div>

            {/* Guardian Name - Conditional */}
            {data.residence_type === 'With Guardian' && (
                <TextField
                    id="guardian_name"
                    label="Guardian Name"
                    required
                    value={data.guardian_name}
                    onChange={handleFieldChange('guardian_name')}
                    placeholder="Enter guardian's full name"
                    error={errors.guardian_name}
                />
            )}            {/* PWD Status */}
            <RadioField
                id="is_pwd"
                label="Person with Disability (PWD)"
                required
                value={data.is_pwd}
                onChange={onPwdChange}
                options={pwdOptions}
                orientation="horizontal"
                error={errors.is_pwd}
            />

            {/* Disability Type - Conditional */}
            {data.is_pwd === 'Yes' && (
                <TextField
                    id="disability_type"
                    label="Type of Disability"
                    required
                    value={data.disability_type}
                    onChange={handleFieldChange('disability_type')}
                    placeholder="Specify type of disability"
                    error={errors.disability_type}
                />
            )}
        </div>
    );
});

PersonalInformationStep.displayName = 'PersonalInformationStep';

export default PersonalInformationStep;
