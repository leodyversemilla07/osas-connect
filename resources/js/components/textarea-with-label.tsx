import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";

interface TextareaWithLabelProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export function TextareaWithLabel({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = "",
}: TextareaWithLabelProps) {
    const errorId = error ? `${id}-error` : undefined;

    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>
                {label}{required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                aria-describedby={errorId}
                aria-invalid={!!error}
                required={required}
                className="min-h-[100px] border-border"
            />
            <InputError id={errorId} message={error} />
        </div>
    );
}
