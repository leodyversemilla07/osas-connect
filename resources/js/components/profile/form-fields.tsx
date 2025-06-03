import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { NumberFormatter } from '@/utils/numberFormatter';

// Base form field component
interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export const FormField = memo<FormFieldProps>(({
    label,
    required,
    error,
    description,
    children,
    className = ''
}) => {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-red-500" aria-label="required">*</span>}
            </Label>
            {children}
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <InputError message={error} />
        </div>
    );
});

FormField.displayName = 'FormField';

// Number input component with enhanced functionality
interface NumberFieldProps {
    id: string;
    label?: string;
    value: number | null | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string;
    'data-testid'?: string;
}

export const NumberField = memo<NumberFieldProps>(({
    id,
    label,
    value,
    onChange,
    placeholder,
    min = 0,
    max = 999999999999,
    step = 0.01,
    readOnly = false,
    disabled = false,
    className = '',
    error,
    'data-testid': testId
}) => {
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!readOnly && !disabled) {
            onChange(NumberFormatter.parseInput(e.target.value));
        }
    }, [onChange, readOnly, disabled]);

    const inputElement = (
        <Input
            id={id}
            type="number"
            step={step}
            min={min}
            max={max}
            value={NumberFormatter.formatForInput(value)}
            onChange={handleChange}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            className={`${(readOnly || disabled) ? "bg-muted" : ""} ${className}`}
            data-testid={testId}
            aria-describedby={readOnly ? `${id}-readonly` : undefined}
        />
    );

    if (label) {
        return (
            <FormField label={label} error={error}>
                {inputElement}
            </FormField>
        );
    }

    return inputElement;
});

NumberField.displayName = 'NumberField';

// Text input with enhanced props
interface TextFieldProps {
    id: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel' | 'date';
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    className?: string;
    error?: string;
    'data-testid'?: string;
}

export const TextField = memo<TextFieldProps>(({
    id,
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    required,
    readOnly,
    autoComplete,
    className = '',
    error,
    'data-testid': testId
}) => {
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!readOnly) {
            onChange(e.target.value);
        }
    }, [onChange, readOnly]);

    const inputElement = (
        <Input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            className={`${readOnly ? "bg-muted" : ""} ${className}`}
            data-testid={testId}
        />
    );

    if (label) {
        return (
            <FormField label={label} error={error}>
                {inputElement}
            </FormField>
        );
    }

    return inputElement;
});

TextField.displayName = 'TextField';
