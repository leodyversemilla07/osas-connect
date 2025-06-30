import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputError from "@/components/input-error";

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
    placeholder = "Select an option",
    error,
    required = false,
    disabled = false,
    className = "",
    description,
}: SelectorWithLabelProps) {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label}{required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger
                    id={id}
                    aria-describedby={[errorId, descriptionId].filter(Boolean).join(" ")}
                    aria-invalid={!!error}
                    className="mt-1 truncate w-full max-w-full"
                >
                    <SelectValue placeholder={placeholder} className="truncate w-full max-w-full" />
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
