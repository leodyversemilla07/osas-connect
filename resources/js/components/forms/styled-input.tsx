import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const baseInputStyles = "border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500";

interface StyledInputProps extends React.ComponentProps<typeof Input> {
    as?: 'input';
}

interface StyledTextareaProps extends React.ComponentProps<typeof Textarea> {
    as: 'textarea';
}

type StyledFieldProps = StyledInputProps | StyledTextareaProps;

export function StyledInput({ className, as = 'input', ...props }: StyledFieldProps) {
    if (as === 'textarea') {
        return (
            <Textarea
                className={cn(
                    baseInputStyles,
                    "min-h-[40px] resize-none",
                    className
                )}
                {...(props as React.ComponentProps<typeof Textarea>)}
            />
        );
    }
    
    return (
        <Input
            className={cn(baseInputStyles, className)}
            {...(props as React.ComponentProps<typeof Input>)}
        />
    );
}
