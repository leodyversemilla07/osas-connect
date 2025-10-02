import { InputWithLabel } from '@/components/input-with-label';
import RadioWithLabel from '@/components/radio-with-label';
import { memo, useMemo } from 'react';

interface PwdRadioProps {
    value: string;
    onChange: (value: string) => void;
    disabilityType: string;
    onDisabilityTypeChange: (value: string) => void;
    error?: string;
    disabilityTypeError?: string;
    required?: boolean;
}

const PWD_OPTIONS = [
    { value: 'No', label: 'No' },
    { value: 'Yes', label: 'Yes' },
];

const PwdRadio = memo<PwdRadioProps>(({ value, onChange, disabilityType, onDisabilityTypeChange, error, disabilityTypeError, required = false }) => {
    const pwdOptions = useMemo(() => PWD_OPTIONS, []);
    return (
        <div className="space-y-2">
            <RadioWithLabel
                id="is_pwd"
                label="Person with Disability (PWD)"
                required={required}
                value={value}
                onChange={onChange}
                options={pwdOptions}
                orientation="horizontal"
                error={error}
            />
            {value === 'Yes' && (
                <InputWithLabel
                    id="disability_type"
                    label="Type of Disability"
                    required={required}
                    value={disabilityType}
                    onChange={onDisabilityTypeChange}
                    placeholder="Specify type of disability"
                    error={disabilityTypeError}
                    className="w-full"
                />
            )}
        </div>
    );
});

PwdRadio.displayName = 'PwdRadio';

export default PwdRadio;
