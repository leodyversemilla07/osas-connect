import Address from '@/components/address';
import CivilStatusSelector from '@/components/civil-status-selector';
import { DatePicker } from '@/components/date-picker';
import { InputWithLabel } from '@/components/input-with-label';
import PlaceOfBirth from '@/components/place-of-birth';
import PwdRadio from '@/components/pwd-radio';
import ReligionSelector from '@/components/religion-selector';
import ResidenceTypeSelector from '@/components/residence-type-selector';
import SexSelector from '@/components/sex-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileSectionProps } from '@/types/profile';
import { User } from 'lucide-react';
import React from 'react';

/**
 * Personal Information Section Component
 * Handles personal details like civil status, contact info, address, etc.
 */
export const PersonalInfoSection = React.memo<Pick<ProfileSectionProps, 'data' | 'errors' | 'updateField'>>(({ data, errors, updateField }) => {
    return (
        <Card data-testid="personal-info-section">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User className="text-primary h-5 w-5" />
                    <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Civil Status and Gender */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CivilStatusSelector
                        value={data.civil_status || ''}
                        onChange={(value) => updateField('civil_status', value)}
                        error={errors.civil_status}
                    />
                    <SexSelector value={data.sex || ''} onChange={(value) => updateField('sex', value)} error={errors.sex} />
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <PwdRadio
                    value={data.is_pwd ? 'Yes' : 'No'}
                    onChange={(value) => updateField('is_pwd', value === 'Yes')}
                    disabilityType={data.disability_type || ''}
                    onDisabilityTypeChange={(value) => updateField('disability_type', value)}
                    error={errors.is_pwd}
                    disabilityTypeError={errors.disability_type}
                />

                {/* Additional Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ReligionSelector
                        value={data.religion || ''}
                        onChange={(value: string) => updateField('religion', value)}
                        error={errors.religion}
                        className="w-full"
                    />
                    <ResidenceTypeSelector
                        value={data.residence_type || ''}
                        onChange={(value) => updateField('residence_type', value)}
                        error={errors.residence_type}
                        guardianName={data.guardian_name || ''}
                        onGuardianNameChange={(value) => updateField('guardian_name', value)}
                        guardianError={errors.guardian_name}
                    />
                </div>
            </CardContent>
        </Card>
    );
});

PersonalInfoSection.displayName = 'PersonalInfoSection';
