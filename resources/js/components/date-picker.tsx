import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import InputError from "@/components/input-error";

export interface DatePickerProps {
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

export const DatePicker: React.FC<DatePickerProps> = ({
    id,
    label,
    value,
    onChange,
    required = false,
    error,
    placeholder = "Select date",
    disabled = false,
    minDate = new Date("1900-01-01"),
    maxDate = new Date(),
    className,
    description,
}) => {
    const [open, setOpen] = React.useState(false);
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
        setOpen(false);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between font-normal",
                            !value && "text-muted-foreground"
                        )}
                        aria-describedby={cn(errorId, descriptionId)}
                        aria-invalid={!!error}
                        aria-expanded={open}
                        aria-haspopup="dialog"
                    >
                        {value ? value.toLocaleDateString() : placeholder}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
            <InputError id={errorId} message={error} />
        </div>
    );
};
