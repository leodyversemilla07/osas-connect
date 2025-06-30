import React, { memo } from "react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
    steps: readonly string[];
    currentStep: number;
    totalSteps: number;
}

const StepProgress = memo<StepProgressProps>(({ steps, currentStep, totalSteps }) => {
    return (
        <div className="mb-0.5 sm:mb-1"> {/* Further reduced margin for even less space below progress bar */}
            {/* Current step indicator (moved to top) */}
            <div className="text-center bg-muted/30 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg mx-2 sm:mx-0 mb-2">
                <h2 className="text-sm sm:text-base font-medium text-foreground">
                    {steps[currentStep - 1]}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Step {currentStep} of {totalSteps}
                </p>
            </div>
            <div className="relative flex justify-between items-center mb-4 sm:mb-5">
                {/* Progress line background */}
                <div className="absolute top-[18px] sm:top-[22px] left-0 w-full h-0.5">
                    {/* Background line */}
                    <div className="absolute w-full h-full bg-border/30" />
                    {/* Progress line */}
                    <div
                        className="absolute h-full bg-primary/90 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="relative z-10 flex justify-between w-full">
                    {steps.map((title, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <div key={title} className="flex flex-col items-center flex-1 max-w-[120px] sm:max-w-none">
                                <div
                                    className={cn(
                                        "w-9 h-9 sm:w-11 sm:h-11 mb-1.5 sm:mb-2 rounded-lg flex items-center justify-center text-sm sm:text-base font-medium transition-all duration-300 border-2 shrink-0",
                                        {
                                            "bg-primary text-primary-foreground border-primary shadow-md": isActive,
                                            "bg-primary text-primary-foreground border-primary": isCompleted,
                                            "bg-background border-border/50 text-muted-foreground": !isActive && !isCompleted,
                                        }
                                    )}
                                    aria-current={isActive ? "step" : undefined}
                                >
                                    {isCompleted ? (
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <div className={cn(
                                    "text-xs sm:text-sm text-center transition-colors duration-200 px-1 sm:px-2 leading-tight",
                                    "min-w-0 max-w-full overflow-hidden",
                                    {
                                        "text-foreground font-medium": isActive,
                                        "text-muted-foreground font-normal": !isActive,
                                    }
                                )}>
                                    <span className="block sm:hidden">
                                        {title.split(' ').slice(0, 2).join(' ')}
                                        {title.split(' ').length > 2 && '...'}
                                    </span>
                                    <span className="hidden sm:block">
                                        {title}
                                    </span>
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
