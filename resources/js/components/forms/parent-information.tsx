import { FormField } from './form-field';
import { StyledInput } from './styled-input';
import { memo } from 'react';

interface ParentInformationProps {
    parentType: 'father' | 'mother';
    data: {
        name: string;
        age: number;
        address: string;
        telephone: string;
        mobile: string;
        email: string;
        occupation: string;
        company: string;
        monthly_income: number;
        education: string;
        school: string;
    };
    onDataChange: (field: string, value: string | number) => void;
    errors: Record<string, string>;
}

export const ParentInformation = memo(function ParentInformation({ parentType, data, onDataChange, errors }: ParentInformationProps) {
    const prefix = parentType;
    const capitalizedType = parentType.charAt(0).toUpperCase() + parentType.slice(1);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Full Name" error={errors[`${prefix}_name`]}>
                    <StyledInput
                        id={`${prefix}_name`}
                        value={data.name}
                        onChange={(e) => onDataChange(`${prefix}_name`, e.target.value)}
                        placeholder={`${capitalizedType}'s full name`}
                    />
                </FormField>                <FormField label="Age" error={errors[`${prefix}_age`]}>
                    <StyledInput
                        id={`${prefix}_age`}
                        type="number"
                        min="0"
                        max="120"
                        value={data.age?.toString() || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                onDataChange(`${prefix}_age`, 0);
                            } else {
                                const numValue = parseInt(value, 10);
                                if (!isNaN(numValue)) {
                                    onDataChange(`${prefix}_age`, numValue);
                                }
                            }
                        }}
                        placeholder="Age"
                    />
                </FormField>

                <FormField label="Address" error={errors[`${prefix}_address`]}>
                    <StyledInput
                        id={`${prefix}_address`}
                        value={data.address}
                        onChange={(e) => onDataChange(`${prefix}_address`, e.target.value)}
                        placeholder="Home address"
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Telephone" error={errors[`${prefix}_telephone`]}>
                    <StyledInput
                        id={`${prefix}_telephone`}
                        value={data.telephone}
                        onChange={(e) => onDataChange(`${prefix}_telephone`, e.target.value)}
                        placeholder="(02) 123-4567"
                    />
                </FormField>

                <FormField label="Mobile Number" error={errors[`${prefix}_mobile`]}>
                    <StyledInput
                        id={`${prefix}_mobile`}
                        value={data.mobile}
                        onChange={(e) => onDataChange(`${prefix}_mobile`, e.target.value)}
                        placeholder="+639123456789"
                    />
                </FormField>

                <FormField label="Email Address" error={errors[`${prefix}_email`]}>
                    <StyledInput
                        id={`${prefix}_email`}
                        type="email"
                        value={data.email}
                        onChange={(e) => onDataChange(`${prefix}_email`, e.target.value)}
                        placeholder={`${parentType}@email.com`}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Occupation" error={errors[`${prefix}_occupation`]}>
                    <StyledInput
                        id={`${prefix}_occupation`}
                        value={data.occupation}
                        onChange={(e) => onDataChange(`${prefix}_occupation`, e.target.value)}
                        placeholder="Job title"
                    />
                </FormField>

                <FormField label="Company" error={errors[`${prefix}_company`]}>
                    <StyledInput
                        id={`${prefix}_company`}
                        value={data.company}
                        onChange={(e) => onDataChange(`${prefix}_company`, e.target.value)}
                        placeholder="Company name"
                    />
                </FormField>                <FormField label="Monthly Income" error={errors[`${prefix}_monthly_income`]}>
                    <StyledInput
                        id={`${prefix}_monthly_income`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.monthly_income?.toString() || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                onDataChange(`${prefix}_monthly_income`, 0);
                            } else {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                    onDataChange(`${prefix}_monthly_income`, numValue);
                                }
                            }
                        }}
                        placeholder="0.00"
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Education" error={errors[`${prefix}_education`]}>
                    <StyledInput
                        id={`${prefix}_education`}
                        value={data.education}
                        onChange={(e) => onDataChange(`${prefix}_education`, e.target.value)}
                        placeholder="Educational attainment"
                    />
                </FormField>

                <FormField label="School" error={errors[`${prefix}_school`]}>
                    <StyledInput
                        id={`${prefix}_school`}
                        value={data.school}
                        onChange={(e) => onDataChange(`${prefix}_school`, e.target.value)}
                        placeholder="School attended"
                    />
                </FormField>
            </div>
        </>
    );
});
