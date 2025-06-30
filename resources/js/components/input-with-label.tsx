import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";

interface InputWithLabelProps {
    id: string;
    label: string;
    type?: "text" | "email" | "tel" | "password";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    prefix?: React.ReactNode;
    className?: string;
    pattern?: string;
}

export function InputWithLabel({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    prefix,
    className = "",
    pattern,
}: InputWithLabelProps) {
    const errorId = error ? `${id}-error` : undefined;

    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>
                {label}{required && <span className="text-red-500">*</span>}
            </Label>
            <div className={prefix ? "flex" : undefined}>
                {prefix}
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-describedby={errorId}
                    aria-invalid={!!error}
                    required={required}
                    className={prefix ? "rounded-l-none" : undefined}
                    pattern={pattern}
                />
            </div>
            <InputError id={errorId} message={error} />
        </div>
    );
}
