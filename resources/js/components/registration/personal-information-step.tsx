import { memo, useCallback, useMemo } from "react";
import { DatePicker } from "@/components/date-picker";
import Address from "@/components/address";
import PlaceOfBirth from "@/components/place-of-birth";
import type { RegisterForm } from "@/hooks/use-registration-form";
import { InputWithLabel } from "@/components/input-with-label";
import CivilStatusSelector from "@/components/civil-status-selector";
import ReligionSelector from "@/components/religion-selector";
import ResidenceTypeSelector from "@/components/residence-type-selector";
import SexSelector from "@/components/sex-selector";
import PwdRadio from "@/components/pwd-radio";

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

const PersonalInformationStep = memo<PersonalInformationStepProps>(
    ({
        data,
        errors,
        onFieldChange,
        onMobileNumberChange,
        onResidenceTypeChange,
        onPwdChange,
        onDateOfBirthSelect,
        processing = false,
    }) => {
        const handleFieldChange = useCallback(
            (field: keyof RegisterForm) => (value: string) => {
                onFieldChange(field, value);
            },
            [onFieldChange]
        );

        const addressData = {
            street: data.street,
            barangay: data.barangay,
            city: data.city,
            province: data.province,
            zip_code: data.zip_code,
        };

        const handleAddressChange = useCallback(
            (field: "street" | "barangay" | "city" | "province" | "zip_code", value: string) => {
                onFieldChange(field, value);
            },
            [onFieldChange]
        );

        const placeOfBirthData = {
            place_of_birth: data.place_of_birth,
        };

        const handlePlaceOfBirthChange = useCallback(
            (field: "place_of_birth", value: string) => {
                onFieldChange(field, value);
            },
            [onFieldChange]
        );
        const mobilePrefix = useMemo(
            () => (
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                    +63
                </span>
            ),
            []
        );

        return (
            <div className="space-y-6">
                {/* Row 1: First Name | Middle Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithLabel
                        id="first_name"
                        label="First Name"
                        required
                        value={data.first_name}
                        onChange={handleFieldChange("first_name")}
                        placeholder="Enter your first name"
                        error={errors.first_name}
                        className="w-full"
                    />
                    <InputWithLabel
                        id="middle_name"
                        label="Middle Name"
                        required
                        value={data.middle_name}
                        onChange={handleFieldChange("middle_name")}
                        placeholder="Enter your middle name"
                        error={errors.middle_name}
                        className="w-full"
                    />
                </div>

                {/* Row 2: Last Name | Sex */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithLabel
                        id="last_name"
                        label="Last Name"
                        required
                        value={data.last_name}
                        onChange={handleFieldChange("last_name")}
                        placeholder="Enter your last name"
                        error={errors.last_name}
                        className="w-full"
                    />
                    <SexSelector
                        value={data.sex}
                        onChange={handleFieldChange("sex")}
                        error={errors.sex}
                        required
                        className="w-full"
                    />
                </div>

                {/* Row 3: Civil Status | Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CivilStatusSelector
                        value={data.civil_status}
                        onChange={handleFieldChange("civil_status")}
                        error={errors.civil_status}
                        required
                        className="w-full"
                    />
                    <DatePicker
                        id="date_of_birth"
                        label="Date of Birth"
                        required
                        value={data.date_of_birth ? new Date(new Date(data.date_of_birth).getTime()) : undefined}
                        onChange={onDateOfBirthSelect}
                        placeholder="Select date of birth"
                        error={errors.date_of_birth}
                        maxDate={new Date()}
                        className="w-full"
                    />
                </div>

                {/* Place of Birth */}
                <PlaceOfBirth
                    data={placeOfBirthData}
                    setData={handlePlaceOfBirthChange}
                    errors={errors}
                    processing={processing}
                />

                {/* Address */}
                <Address
                    data={addressData}
                    setData={handleAddressChange}
                    errors={errors}
                    processing={processing}
                />

                {/* Mobile and Telephone Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithLabel
                        id="mobile_number"
                        label="Mobile Number"
                        type="tel"
                        required
                        value={data.mobile_number}
                        onChange={onMobileNumberChange}
                        placeholder="9123456789"
                        prefix={mobilePrefix}
                        error={errors.mobile_number}
                        className="w-full"
                    />
                    <InputWithLabel
                        id="telephone_number"
                        label="Telephone Number"
                        value={data.telephone_number}
                        onChange={handleFieldChange("telephone_number")}
                        placeholder="Enter telephone number"
                        error={errors.telephone_number}
                        className="w-full"
                    />
                </div>

                {/* Religion and Residence Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReligionSelector
                        value={data.religion}
                        onChange={handleFieldChange("religion")}
                        error={errors.religion}
                        required
                        className="w-full"
                    />
                    <ResidenceTypeSelector
                        value={data.residence_type}
                        onChange={onResidenceTypeChange}
                        error={errors.residence_type}
                        required
                        className="w-full"
                        guardianName={data.guardian_name}
                        onGuardianNameChange={handleFieldChange("guardian_name")}
                        guardianError={errors.guardian_name}
                    />
                </div>

                {/* PWD Radio */}
                <PwdRadio
                    value={data.is_pwd}
                    onChange={onPwdChange}
                    disabilityType={data.disability_type}
                    onDisabilityTypeChange={handleFieldChange("disability_type")}
                    error={errors.is_pwd}
                    disabilityTypeError={errors.disability_type}
                    required
                />
            </div>
        );
    }
);

PersonalInformationStep.displayName = "PersonalInformationStep";

export default PersonalInformationStep;
