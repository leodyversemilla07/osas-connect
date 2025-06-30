import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputError from "@/components/input-error";
import { cn } from "@/lib/utils";

interface RadioWithLabelOption {
    value: string;
    label: string;
    id?: string;
}

interface RadioWithLabelProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: RadioWithLabelOption[];
    required?: boolean;
    error?: string;
    className?: string;
    description?: string;
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
}

const RadioWithLabel: React.FC<RadioWithLabelProps> = ({
    id,
    label,
    value,
    onChange,
    options,
    required = false,
    error,
    description,
    orientation = "vertical",
    disabled = false,
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
        <div className="grid gap-2">
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            <RadioGroup
                value={value}
                onValueChange={onChange}
                disabled={disabled}
                className={cn(
                    "mt-2",
                    orientation === "horizontal" && "flex flex-wrap gap-4"
                )}
                aria-describedby={cn(errorId, descriptionId)}
                aria-invalid={!!error}
            >
                {options.map((option) => {
                    const optionId =
                        option.id ||
                        `${id}-${option.value.toLowerCase().replace(/\s+/g, "-")}`;
                    return (
                        <div
                            key={option.value}
                            className="flex items-center space-x-2"
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={optionId}
                                disabled={disabled}
                            />
                            <Label htmlFor={optionId}>{option.label}</Label>
                        </div>
                    );
                })}
            </RadioGroup>
            <InputError id={errorId} message={error} />
        </div>
    );
};

export default RadioWithLabel;
