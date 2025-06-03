import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputError from "@/components/input-error";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    className?: string;
    description?: string;
}

interface TextFieldProps extends BaseFieldProps {
    type?: "text" | "tel" | "email";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    prefix?: ReactNode;
    disabled?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
}

interface RadioFieldProps extends BaseFieldProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string; id?: string }[];
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
    id,
    label,
    required = false,
    error,
    className,
    description,
    type = "text",
    value,
    onChange,
    placeholder,
    prefix,
    disabled = false,
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            <div className="relative">
                {prefix ? (
                    <div className="flex">
                        {prefix}
                        <Input
                            id={id}
                            type={type}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="rounded-l-none"
                            aria-describedby={cn(errorId, descriptionId)}
                            aria-invalid={!!error}
                        />
                    </div>
                ) : (
                    <Input
                        id={id}
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-describedby={cn(errorId, descriptionId)}
                        aria-invalid={!!error}
                    />
                )}
            </div>
            {error && <InputError id={errorId} message={error} />}
        </div>
    );
};

export const SelectField: React.FC<SelectFieldProps> = ({
    id,
    label,
    required = false,
    error,
    className,
    description,
    value,
    onChange,
    placeholder = "Select an option",
    options,
    disabled = false,
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            <Select 
                value={value} 
                onValueChange={onChange} 
                disabled={disabled}
            >
                <SelectTrigger 
                    id={id}
                    aria-describedby={cn(errorId, descriptionId)}
                    aria-invalid={!!error}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <InputError id={errorId} message={error} />}
        </div>
    );
};

export const RadioField: React.FC<RadioFieldProps> = ({
    id,
    label,
    required = false,
    error,
    className,
    description,
    value,
    onChange,
    options,
    orientation = "vertical",
    disabled = false,
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
        <div className={cn("space-y-2", className)}>
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
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
                    const optionId = option.id || `${id}-${option.value.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                        <div key={option.value} className="flex items-center space-x-2">
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
            {error && <InputError id={errorId} message={error} />}
        </div>
    );
};
