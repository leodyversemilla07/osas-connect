import { SelectorWithLabel } from '@/components/selector-with-label';
import { useMemo } from 'react';

export interface CivilStatusSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

const CIVIL_STATUS_OPTIONS = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Separated', label: 'Separated' },
    { value: 'Civil Union', label: 'Civil Union' },
    { value: 'Domestic Partnership', label: 'Domestic Partnership' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
];

export default function CivilStatusSelector({ value, onChange, error, required = false, className = '' }: CivilStatusSelectorProps) {
    const options = useMemo(() => CIVIL_STATUS_OPTIONS, []);
    return (
        <SelectorWithLabel
            id="civil_status"
            label="Civil Status"
            required={required}
            value={value}
            onChange={onChange}
            placeholder="Select civil status"
            options={options}
            error={error}
            className={className}
        />
    );
}
