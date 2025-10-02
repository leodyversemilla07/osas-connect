import { cn } from '@/lib/utils';
import { memo } from 'react';

interface StepProgressProps {
    steps: readonly string[];
    currentStep: number;
    totalSteps: number;
}

const StepProgress = memo<StepProgressProps>(({ steps, currentStep, totalSteps }) => {
    return (
        <div className="mb-0.5 sm:mb-1">
            {' '}
            {/* Further reduced margin for even less space below progress bar */}
            {/* Current step indicator (moved to top) */}
            <div className="bg-muted/30 mx-2 mb-2 rounded-lg px-3 py-2 text-center sm:mx-0 sm:px-4 sm:py-2.5">
                <h2 className="text-foreground text-sm font-medium sm:text-base">{steps[currentStep - 1]}</h2>
                <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                    Step {currentStep} of {totalSteps}
                </p>
            </div>
            <div className="relative mb-4 flex items-center justify-between sm:mb-5">
                {/* Progress line background */}
                <div className="absolute top-[18px] left-0 h-0.5 w-full sm:top-[22px]">
                    {/* Background line */}
                    <div className="bg-border/30 absolute h-full w-full" />
                    {/* Progress line */}
                    <div
                        className="bg-primary/90 absolute h-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="relative z-10 flex w-full justify-between">
                    {steps.map((title, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <div key={title} className="flex max-w-[120px] flex-1 flex-col items-center sm:max-w-none">
                                <div
                                    className={cn(
                                        'mb-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all duration-300 sm:mb-2 sm:h-11 sm:w-11 sm:text-base',
                                        {
                                            'bg-primary text-primary-foreground border-primary shadow-md': isActive,
                                            'bg-primary text-primary-foreground border-primary': isCompleted,
                                            'bg-background border-border/50 text-muted-foreground': !isActive && !isCompleted,
                                        },
                                    )}
                                    aria-current={isActive ? 'step' : undefined}
                                >
                                    {isCompleted ? (
                                        <svg
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        'px-1 text-center text-xs leading-tight transition-colors duration-200 sm:px-2 sm:text-sm',
                                        'max-w-full min-w-0 overflow-hidden',
                                        {
                                            'text-foreground font-medium': isActive,
                                            'text-muted-foreground font-normal': !isActive,
                                        },
                                    )}
                                >
                                    <span className="block sm:hidden">
                                        {title.split(' ').slice(0, 2).join(' ')}
                                        {title.split(' ').length > 2 && '...'}
                                    </span>
                                    <span className="hidden sm:block">{title}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

StepProgress.displayName = 'StepProgress';

export default StepProgress;
