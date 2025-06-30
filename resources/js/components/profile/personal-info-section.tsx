import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectorWithLabel } from '@/components/selector-with-label';
import { InputWithLabel } from '@/components/input-with-label';
import { DatePicker } from '@/components/date-picker';
import Address from '@/components/address';
import PlaceOfBirth from '@/components/place-of-birth';
import ReligionSelector from '@/components/religion-selector';
import type { ProfileSectionProps } from '@/types/profile';

/**
 * Personal Information Section Component
 * Handles personal details like civil status, contact info, address, etc.
 */
export const PersonalInfoSection = React.memo<Pick<ProfileSectionProps, 'data' | 'errors' | 'updateField'>>(({
    data,
    errors,
    updateField
}) => {
    const handlePWDChange = React.useCallback((checked: boolean) => {
        updateField('is_pwd', checked);
        if (!checked) {
            updateField('disability_type', null);
        }
    }, [updateField]);

    return (
        <Card data-testid="personal-info-section">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Civil Status and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectorWithLabel
                        id="civil_status"
                        label="Civil Status"
                        value={data.civil_status || ''}
                        onChange={(value) => updateField('civil_status', value)}
                        options={[
                            { value: 'Single', label: 'Single' },
                            { value: 'Married', label: 'Married' },
                            { value: 'Widowed', label: 'Widowed' },
                            { value: 'Separated', label: 'Separated' },
                            { value: 'Divorced', label: 'Divorced' },
                        ]}
                        placeholder="Select civil status"
                        error={errors.civil_status}
                    />
                    <SelectorWithLabel
                        id="sex"
                        label="Sex"
                        value={data.sex || ''}
                        onChange={(value) => updateField('sex', value)}
                        options={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                        ]}
                        placeholder="Select sex"
                        error={errors.sex}
                    />
                </div>

                {/* Birth Information */}
                <DatePicker
                    id="date_of_birth"
                    label="Date of Birth"
                    value={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
                    onChange={(date) => updateField('date_of_birth', date ? date.toISOString().slice(0, 10) : '')}
                    error={errors.date_of_birth}
                    className="w-full"
                />

                <PlaceOfBirth
                    data={{ place_of_birth: data.place_of_birth || '' }}
                    setData={(field, value) => updateField(field, value)}
                    errors={{ place_of_birth: errors.place_of_birth || '' }}
                    processing={false}
                />
                <Address
                    data={{
                        street: data.street || '',
                        barangay: data.barangay || '',
                        city: data.city || '',
                        province: data.province || '',
                        zip_code: data.zip_code || '',
                    }}
                    setData={(field, value) => updateField(field, value)}
                    errors={{
                        street: errors.street || '',
                        barangay: errors.barangay || '',
                        city: errors.city || '',
                        province: errors.province || '',
                        zip_code: errors.zip_code || '',
                    }}
                    processing={false}
                />


                {/* Contact Information */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputWithLabel
                            id="mobile_number"
                            label="Mobile Number"
                            value={data.mobile_number || ''}
                            onChange={(value: string) => updateField('mobile_number', value)}
                            error={errors.mobile_number}
                            placeholder="Enter mobile number"
                            className="w-full"
                            data-testid="mobile-number-input"
                        />
                        <InputWithLabel
                            id="telephone_number"
                            label="Telephone Number"
                            value={data.telephone_number || ''}
                            onChange={(value: string) => updateField('telephone_number', value)}
                            error={errors.telephone_number}
                            placeholder="Enter telephone number (optional)"
                            className="w-full"
                            data-testid="telephone-number-input"
                        />
                    </div>
                </div>

                {/* PWD Information */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_pwd"
                            checked={data.is_pwd || false}
                            onCheckedChange={handlePWDChange}
                            data-testid="is-pwd-checkbox"
                        />
                        <label
                            htmlFor="is_pwd"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Person with Disability (PWD)
                        </label>
                    </div>

                    {data.is_pwd && (
                        <InputWithLabel
                            id="disability_type"
                            label="Disability Type"
                            value={data.disability_type || ''}
                            onChange={(value: string) => updateField('disability_type', value)}
                            error={errors.disability_type}
                            placeholder="Specify disability type"
                            className="w-full"
                            data-testid="disability-type-input"
                        />
                    )}
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReligionSelector
                        value={data.religion || ''}
                        onChange={(value: string) => updateField('religion', value)}
                        error={errors.religion}
                        className="w-full"
                    />
                    <SelectorWithLabel
                        id="residence_type"
                        label="Residence Type"
                        value={data.residence_type || ''}
                        onChange={(value) => updateField('residence_type', value)}
                        options={[
                            { value: "Parent's House", label: "Parent's House" },
                            { value: "Boarding House", label: "Boarding House" },
                            { value: "With Guardian", label: "With Guardian" },
                        ]}
                        placeholder="Select residence type"
                        error={errors.residence_type}
                    />
                </div>

                {/* Guardian Name - Only show when residence type is "With Guardian" */}
                {data.residence_type === 'With Guardian' && (
                    <InputWithLabel
                        id="guardian_name"
                        label="Guardian Name"
                        value={data.guardian_name || ''}
                        onChange={(value: string) => updateField('guardian_name', value)}
                        error={errors.guardian_name}
                        placeholder="Enter guardian's full name"
                        className="w-full"
                        data-testid="guardian-name-input"
                    />
                )}
            </CardContent>
        </Card>
    );
});

PersonalInfoSection.displayName = 'PersonalInfoSection';
