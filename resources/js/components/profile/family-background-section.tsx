import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Trash2 } from 'lucide-react';
import { FormField, NumberField, TextField } from '@/components/profile/form-fields';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SiblingInfo, ProfileSectionProps } from '@/types/profile';

/**
 * Family Background Section Component
 * Handles family information including parents, siblings, and family income
 */
export const FamilyBackgroundSection = React.memo<Pick<ProfileSectionProps, 'data' | 'errors' | 'updateField'>>(({
    data,
    errors,
    updateField
}) => {
    // Handle siblings operations
    const addSibling = React.useCallback(() => {
        const currentSiblings = data.siblings || [];
        const newSibling: SiblingInfo = {
            name: '',
            age: 0,
            civil_status: '',
            educational_attainment: '',
            occupation: '',
            monthly_income: 0
        };
        updateField('siblings', [...currentSiblings, newSibling]);
        updateField('total_siblings', currentSiblings.length + 1);
    }, [data.siblings, updateField]);

    const removeSibling = React.useCallback((index: number) => {
        const currentSiblings = data.siblings || [];
        const newSiblings = currentSiblings.filter((_, i) => i !== index);
        updateField('siblings', newSiblings);
        updateField('total_siblings', newSiblings.length);
    }, [data.siblings, updateField]);

    const updateSibling = React.useCallback((index: number, field: keyof SiblingInfo, value: string | number) => {
        const currentSiblings = data.siblings || [];
        const newSiblings = [...currentSiblings];
        newSiblings[index] = { ...newSiblings[index], [field]: value };
        updateField('siblings', newSiblings);
    }, [data.siblings, updateField]);

    return (
        <Card data-testid="family-background-section">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Family Background</CardTitle>
                </div>
                <CardDescription>Information about your family members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Parents Status */}
                <FormField label="Status of Parents" error={errors.status_of_parents}>
                    <Select
                        value={data.status_of_parents || ''}
                        onValueChange={(value) => updateField('status_of_parents', value)}
                    >
                        <SelectTrigger data-testid="parents-status-select">
                            <SelectValue placeholder="Select parents status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="separated">Separated</SelectItem>
                            <SelectItem value="single_parent">Single Parent</SelectItem>
                            <SelectItem value="both_deceased">Both Deceased</SelectItem>
                            <SelectItem value="father_deceased">Father Deceased</SelectItem>
                            <SelectItem value="mother_deceased">Mother Deceased</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>

                {/* Father's Information */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-foreground">Father's Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Father's Name"
                            id="father_name"
                            value={data.father_name || ''}
                            onChange={(value) => updateField('father_name', value)}
                            error={errors.father_name}
                            placeholder="Enter father's name"
                            data-testid="father-name-input"
                        />

                        <NumberField
                            label="Father's Age"
                            id="father_age" value={data.father_age}
                            onChange={(value) => updateField('father_age', value)}
                            error={errors.father_age}
                            placeholder="Enter father's age"
                            data-testid="father-age-input"
                        />
                    </div>

                    <TextField
                        label="Father's Address"
                        id="father_address"
                        value={data.father_address || ''}
                        onChange={(value) => updateField('father_address', value)}
                        error={errors.father_address}
                        placeholder="Enter father's address"
                        data-testid="father-address-input"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            label="Father's Telephone"
                            id="father_telephone"
                            value={data.father_telephone || ''}
                            onChange={(value) => updateField('father_telephone', value)}
                            error={errors.father_telephone}
                            placeholder="Enter telephone number"
                            data-testid="father-telephone-input"
                        />

                        <TextField
                            label="Father's Mobile"
                            id="father_mobile"
                            value={data.father_mobile || ''}
                            onChange={(value) => updateField('father_mobile', value)}
                            error={errors.father_mobile}
                            placeholder="Enter mobile number"
                            data-testid="father-mobile-input"
                        />

                        <TextField
                            label="Father's Email"
                            id="father_email"
                            type="email"
                            value={data.father_email || ''}
                            onChange={(value) => updateField('father_email', value)}
                            error={errors.father_email}
                            placeholder="Enter email address"
                            data-testid="father-email-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Father's Occupation"
                            id="father_occupation"
                            value={data.father_occupation || ''}
                            onChange={(value) => updateField('father_occupation', value)}
                            error={errors.father_occupation}
                            placeholder="Enter occupation"
                            data-testid="father-occupation-input"
                        />

                        <TextField
                            label="Father's Company"
                            id="father_company"
                            value={data.father_company || ''}
                            onChange={(value) => updateField('father_company', value)}
                            error={errors.father_company}
                            placeholder="Enter company name"
                            data-testid="father-company-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberField
                            label="Father's Monthly Income"
                            id="father_monthly_income" value={data.father_monthly_income}
                            onChange={(value) => updateField('father_monthly_income', value)}
                            error={errors.father_monthly_income}
                            placeholder="Enter monthly income"
                            data-testid="father-monthly-income-input"
                        />

                        <NumberField
                            label="Years of Service"
                            id="father_years_service" value={data.father_years_service}
                            onChange={(value) => updateField('father_years_service', value)}
                            error={errors.father_years_service}
                            placeholder="Enter years of service"
                            data-testid="father-years-service-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Father's Education"
                            id="father_education"
                            value={data.father_education || ''}
                            onChange={(value) => updateField('father_education', value)}
                            error={errors.father_education}
                            placeholder="Enter educational attainment"
                            data-testid="father-education-input"
                        />

                        <TextField
                            label="Father's School"
                            id="father_school"
                            value={data.father_school || ''}
                            onChange={(value) => updateField('father_school', value)}
                            error={errors.father_school}
                            placeholder="Enter school name"
                            data-testid="father-school-input"
                        />
                    </div>

                    {data.father_occupation?.toLowerCase().includes('unemployed') && (
                        <TextField
                            label="Reason for Unemployment"
                            id="father_unemployment_reason"
                            value={data.father_unemployment_reason || ''}
                            onChange={(value) => updateField('father_unemployment_reason', value)}
                            error={errors.father_unemployment_reason}
                            placeholder="Enter reason for unemployment"
                            data-testid="father-unemployment-reason-input"
                        />
                    )}
                </div>

                {/* Mother's Information */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-foreground">Mother's Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Mother's Name"
                            id="mother_name"
                            value={data.mother_name || ''}
                            onChange={(value) => updateField('mother_name', value)}
                            error={errors.mother_name}
                            placeholder="Enter mother's name"
                            data-testid="mother-name-input"
                        />

                        <NumberField
                            label="Mother's Age"
                            id="mother_age" value={data.mother_age}
                            onChange={(value) => updateField('mother_age', value)}
                            error={errors.mother_age}
                            placeholder="Enter mother's age"
                            data-testid="mother-age-input"
                        />
                    </div>

                    <TextField
                        label="Mother's Address"
                        id="mother_address"
                        value={data.mother_address || ''}
                        onChange={(value) => updateField('mother_address', value)}
                        error={errors.mother_address}
                        placeholder="Enter mother's address"
                        data-testid="mother-address-input"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            label="Mother's Telephone"
                            id="mother_telephone"
                            value={data.mother_telephone || ''}
                            onChange={(value) => updateField('mother_telephone', value)}
                            error={errors.mother_telephone}
                            placeholder="Enter telephone number"
                            data-testid="mother-telephone-input"
                        />

                        <TextField
                            label="Mother's Mobile"
                            id="mother_mobile"
                            value={data.mother_mobile || ''}
                            onChange={(value) => updateField('mother_mobile', value)}
                            error={errors.mother_mobile}
                            placeholder="Enter mobile number"
                            data-testid="mother-mobile-input"
                        />

                        <TextField
                            label="Mother's Email"
                            id="mother_email"
                            type="email"
                            value={data.mother_email || ''}
                            onChange={(value) => updateField('mother_email', value)}
                            error={errors.mother_email}
                            placeholder="Enter email address"
                            data-testid="mother-email-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Mother's Occupation"
                            id="mother_occupation"
                            value={data.mother_occupation || ''}
                            onChange={(value) => updateField('mother_occupation', value)}
                            error={errors.mother_occupation}
                            placeholder="Enter occupation"
                            data-testid="mother-occupation-input"
                        />

                        <TextField
                            label="Mother's Company"
                            id="mother_company"
                            value={data.mother_company || ''}
                            onChange={(value) => updateField('mother_company', value)}
                            error={errors.mother_company}
                            placeholder="Enter company name"
                            data-testid="mother-company-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberField
                            label="Mother's Monthly Income"
                            id="mother_monthly_income" value={data.mother_monthly_income}
                            onChange={(value) => updateField('mother_monthly_income', value)}
                            error={errors.mother_monthly_income}
                            placeholder="Enter monthly income"
                            data-testid="mother-monthly-income-input"
                        />

                        <NumberField
                            label="Years of Service"
                            id="mother_years_service" value={data.mother_years_service}
                            onChange={(value) => updateField('mother_years_service', value)}
                            error={errors.mother_years_service}
                            placeholder="Enter years of service"
                            data-testid="mother-years-service-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Mother's Education"
                            id="mother_education"
                            value={data.mother_education || ''}
                            onChange={(value) => updateField('mother_education', value)}
                            error={errors.mother_education}
                            placeholder="Enter educational attainment"
                            data-testid="mother-education-input"
                        />

                        <TextField
                            label="Mother's School"
                            id="mother_school"
                            value={data.mother_school || ''}
                            onChange={(value) => updateField('mother_school', value)}
                            error={errors.mother_school}
                            placeholder="Enter school name"
                            data-testid="mother-school-input"
                        />
                    </div>

                    {data.mother_occupation?.toLowerCase().includes('unemployed') && (
                        <TextField
                            label="Reason for Unemployment"
                            id="mother_unemployment_reason"
                            value={data.mother_unemployment_reason || ''}
                            onChange={(value) => updateField('mother_unemployment_reason', value)}
                            error={errors.mother_unemployment_reason}
                            placeholder="Enter reason for unemployment"
                            data-testid="mother-unemployment-reason-input"
                        />
                    )}
                </div>

                {/* Siblings Information */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-foreground">Siblings Information</h4>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addSibling}
                            className="flex items-center gap-2"
                            data-testid="add-sibling-button"
                        >
                            <Plus className="h-4 w-4" />
                            Add Sibling
                        </Button>
                    </div>

                    <NumberField
                        label="Total Number of Siblings"
                        id="total_siblings" value={data.total_siblings}
                        onChange={(value) => updateField('total_siblings', value)}
                        error={errors.total_siblings}
                        placeholder="Enter total number of siblings"
                        data-testid="total-siblings-input"
                    />

                    {data.siblings && data.siblings.length > 0 && (
                        <div className="space-y-4">
                            {data.siblings.map((sibling, index) => (
                                <Card key={index} className="border border-muted-foreground/20">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-medium text-sm">Sibling {index + 1}</h5>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeSibling(index)}
                                                data-testid={`remove-sibling-${index}-button`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TextField
                                                label="Name"
                                                id={`sibling_${index}_name`}
                                                value={sibling.name}
                                                onChange={(value) => updateSibling(index, 'name', value)}
                                                placeholder="Enter sibling's name"
                                                data-testid={`sibling-${index}-name-input`}
                                            />

                                            <NumberField
                                                label="Age"
                                                id={`sibling_${index}_age`} value={sibling.age}
                                                onChange={(value) => updateSibling(index, 'age', value)}
                                                placeholder="Enter age"
                                                data-testid={`sibling-${index}-age-input`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TextField
                                                label="Civil Status"
                                                id={`sibling_${index}_civil_status`}
                                                value={sibling.civil_status}
                                                onChange={(value) => updateSibling(index, 'civil_status', value)}
                                                placeholder="Enter civil status"
                                                data-testid={`sibling-${index}-civil-status-input`}
                                            />

                                            <TextField
                                                label="Educational Attainment"
                                                id={`sibling_${index}_education`}
                                                value={sibling.educational_attainment}
                                                onChange={(value) => updateSibling(index, 'educational_attainment', value)}
                                                placeholder="Enter educational attainment"
                                                data-testid={`sibling-${index}-education-input`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TextField
                                                label="Occupation"
                                                id={`sibling_${index}_occupation`}
                                                value={sibling.occupation}
                                                onChange={(value) => updateSibling(index, 'occupation', value)}
                                                placeholder="Enter occupation"
                                                data-testid={`sibling-${index}-occupation-input`}
                                            />

                                            <NumberField
                                                label="Monthly Income"
                                                id={`sibling_${index}_income`} value={sibling.monthly_income}
                                                onChange={(value) => updateSibling(index, 'monthly_income', value)}
                                                placeholder="Enter monthly income"
                                                data-testid={`sibling-${index}-income-input`}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

FamilyBackgroundSection.displayName = 'FamilyBackgroundSection';
