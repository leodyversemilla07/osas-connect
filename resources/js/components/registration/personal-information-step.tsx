import { memo, useCallback, useMemo } from "react";
import { DatePicker } from "@/components/date-picker";
import Address from "@/components/address";
import PlaceOfBirth from "@/components/place-of-birth";
import type { RegisterForm } from "@/hooks/use-registration-form";
import { InputWithLabel } from "@/components/input-with-label";
import { SelectorWithLabel } from "@/components/selector-with-label";
import RadioWithLabel from "@/components/radio-with-label";
import ReligionSelector from "@/components/religion-selector";

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

const CIVIL_STATUS_OPTIONS = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
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

        const sexOptions = useMemo(() => SEX_OPTIONS, []);
        const civilStatusOptions = useMemo(() => CIVIL_STATUS_OPTIONS, []);
        const residenceTypeOptions = useMemo(() => RESIDENCE_TYPE_OPTIONS, []);
        const pwdOptions = useMemo(() => PWD_OPTIONS, []);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectorWithLabel
                        id="sex"
                        label="Sex"
                        required
                        value={data.sex}
                        onChange={handleFieldChange("sex")}
                        placeholder="Select sex"
                        options={sexOptions}
                        error={errors.sex}
                        className="w-full"
                    />

                    <SelectorWithLabel
                        id="civil_status"
                        label="Civil Status"
                        required
                        value={data.civil_status}
                        onChange={handleFieldChange("civil_status")}
                        placeholder="Select civil status"
                        options={civilStatusOptions}
                        error={errors.civil_status}
                        className="w-full"
                    />
                </div>

                <DatePicker
                    id="date_of_birth"
                    label="Date of Birth"
                    required
                    value={data.date_of_birth ? new Date(new Date(data.date_of_birth).getTime()) : undefined}
                    onChange={onDateOfBirthSelect}
                    placeholder="Select date of birth"
                    error={errors.date_of_birth}
                    maxDate={new Date()}
                    className="w-full md:w-1/2"
                />

                <PlaceOfBirth
                    data={placeOfBirthData}
                    setData={handlePlaceOfBirthChange}
                    errors={errors}
                    processing={processing}
                />

                <Address
                    data={addressData}
                    setData={handleAddressChange}
                    errors={errors}
                    processing={processing}
                />

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReligionSelector
                        value={data.religion}
                        onChange={handleFieldChange("religion")}
                        error={errors.religion}
                        required
                        className="w-full"
                    />

                    <SelectorWithLabel
                        id="residence_type"
                        label="Residence Type"
                        required
                        value={data.residence_type}
                        onChange={onResidenceTypeChange}
                        placeholder="Select residence type"
                        options={residenceTypeOptions}
                        error={errors.residence_type}
                        className="w-full"
                    />
                </div>

                {data.residence_type === "With Guardian" && (
                    <InputWithLabel
                        id="guardian_name"
                        label="Guardian Name"
                        required
                        value={data.guardian_name}
                        onChange={handleFieldChange("guardian_name")}
                        placeholder="Enter guardian's full name"
                        error={errors.guardian_name}
                        className="w-full"
                    />
                )}

                <RadioWithLabel
                    id="is_pwd"
                    label="Person with Disability (PWD)"
                    required
                    value={data.is_pwd}
                    onChange={onPwdChange}
                    options={pwdOptions}
                    orientation="horizontal"
                    error={errors.is_pwd}
                />

                {data.is_pwd === "Yes" && (
                    <InputWithLabel
                        id="disability_type"
                        label="Type of Disability"
                        required
                        value={data.disability_type}
                        onChange={handleFieldChange("disability_type")}
                        placeholder="Specify type of disability"
                        error={errors.disability_type}
                        className="w-full"
                    />
                )}
            </div>
        );
    }
);

PersonalInformationStep.displayName = "PersonalInformationStep";

export default PersonalInformationStep;
