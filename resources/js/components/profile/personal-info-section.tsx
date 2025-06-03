import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { FormField, TextField } from '@/components/profile/form-fields';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
                    <FormField label="Civil Status" error={errors.civil_status}>
                        <Select
                            value={data.civil_status || ''}
                            onValueChange={(value) => updateField('civil_status', value)}
                        >
                            <SelectTrigger data-testid="civil-status-select">
                                <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                                <SelectItem value="separated">Separated</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="Sex" error={errors.sex}>
                        <Select
                            value={data.sex || ''}
                            onValueChange={(value) => updateField('sex', value)}
                        >
                            <SelectTrigger data-testid="sex-select">
                                <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>

                {/* Birth Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Date of Birth" error={errors.date_of_birth}>
                        <TextField
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth || ''}
                            onChange={(value) => updateField('date_of_birth', value)}
                            placeholder="Select date of birth"
                            data-testid="date-of-birth-input"
                        />
                    </FormField>

                    <TextField
                        label="Place of Birth"
                        id="place_of_birth"
                        value={data.place_of_birth || ''}
                        onChange={(value) => updateField('place_of_birth', value)}
                        error={errors.place_of_birth}
                        placeholder="Enter place of birth"
                        data-testid="place-of-birth-input"
                    />
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-foreground">Address Information</h4>

                    <TextField
                        label="Street Address"
                        id="street"
                        value={data.street || ''}
                        onChange={(value) => updateField('street', value)}
                        error={errors.street}
                        placeholder="Enter street address"
                        data-testid="street-input"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Barangay"
                            id="barangay"
                            value={data.barangay || ''}
                            onChange={(value) => updateField('barangay', value)}
                            error={errors.barangay}
                            placeholder="Enter barangay"
                            data-testid="barangay-input"
                        />

                        <TextField
                            label="City"
                            id="city"
                            value={data.city || ''}
                            onChange={(value) => updateField('city', value)}
                            error={errors.city}
                            placeholder="Enter city"
                            data-testid="city-input"
                        />
                    </div>

                    <TextField
                        label="Province"
                        id="province"
                        value={data.province || ''}
                        onChange={(value) => updateField('province', value)}
                        error={errors.province}
                        placeholder="Enter province"
                        data-testid="province-input"
                    />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-foreground">Contact Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Mobile Number"
                            id="mobile_number"
                            value={data.mobile_number || ''}
                            onChange={(value) => updateField('mobile_number', value)}
                            error={errors.mobile_number}
                            placeholder="Enter mobile number"
                            data-testid="mobile-number-input"
                        />

                        <TextField
                            label="Telephone Number"
                            id="telephone_number"
                            value={data.telephone_number || ''}
                            onChange={(value) => updateField('telephone_number', value)}
                            error={errors.telephone_number}
                            placeholder="Enter telephone number (optional)"
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
                        <TextField
                            label="Disability Type"
                            id="disability_type"
                            value={data.disability_type || ''}
                            onChange={(value) => updateField('disability_type', value)}
                            error={errors.disability_type}
                            placeholder="Specify disability type"
                            data-testid="disability-type-input"
                        />
                    )}
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Religion"
                        id="religion"
                        value={data.religion || ''}
                        onChange={(value) => updateField('religion', value)}
                        error={errors.religion}
                        placeholder="Enter religion"
                        data-testid="religion-input"
                    />

                    <FormField label="Residence Type" error={errors.residence_type}>
                        <Select
                            value={data.residence_type || ''}
                            onValueChange={(value) => updateField('residence_type', value)}
                        >
                            <SelectTrigger data-testid="residence-type-select">
                                <SelectValue placeholder="Select residence type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="owned">Owned</SelectItem>
                                <SelectItem value="rented">Rented</SelectItem>
                                <SelectItem value="boarding">Boarding</SelectItem>
                                <SelectItem value="with_relatives">With Relatives</SelectItem>
                                <SelectItem value="dormitory">Dormitory</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>

                <TextField
                    label="Guardian Name"
                    id="guardian_name"
                    value={data.guardian_name || ''}
                    onChange={(value) => updateField('guardian_name', value)}
                    error={errors.guardian_name}
                    placeholder="Enter guardian name (if applicable)"
                    data-testid="guardian-name-input"
                />
            </CardContent>
        </Card>
    );
});

PersonalInfoSection.displayName = 'PersonalInfoSection';
