import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import InputError from "@/components/input-error";

interface DatePickerFieldProps {
    id: string;
    label: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    description?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    id,
    label,
    value,
    onChange,
    required = false,
    error,
    placeholder = "Select a date",
    disabled = false,
    minDate = new Date("1900-01-01"),
    maxDate = new Date(),
    className,
    description,
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            // Adjust the date to local timezone to prevent date shifting
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            onChange(localDate);
        } else {
            onChange(undefined);
        }
    };

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
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                        aria-describedby={cn(errorId, descriptionId)}
                        aria-invalid={!!error}
                        aria-expanded="false"
                        aria-haspopup="dialog"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, "PPP") : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                            if (disabled) return true;
                            if (date < minDate || date > maxDate) return true;
                            return false;
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <InputError id={errorId} message={error} />}
        </div>
    );
};
