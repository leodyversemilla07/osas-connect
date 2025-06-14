import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormField({
    label,
    required = false,
    error,
    children,
    className
}: FormFieldProps) {
    return (
        <div className={cn("space-y-1", className)}>
            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}
