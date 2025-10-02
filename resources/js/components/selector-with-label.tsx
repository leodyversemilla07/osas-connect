import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectorWithLabelProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    description?: string;
}

export function SelectorWithLabel({
    id,
    label,
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    error,
    required = false,
    disabled = false,
    className = '',
    description,
}: SelectorWithLabelProps) {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p id={descriptionId} className="text-muted-foreground text-sm">
                    {description}
                </p>
            )}
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger
                    id={id}
                    aria-describedby={[errorId, descriptionId].filter(Boolean).join(' ')}
                    aria-invalid={!!error}
                    className="mt-0 w-full max-w-full truncate"
                >
                    <SelectValue placeholder={placeholder} className="w-full max-w-full truncate" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="truncate">
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError id={errorId} message={error} className="mt-1" />
        </div>
    );
}
