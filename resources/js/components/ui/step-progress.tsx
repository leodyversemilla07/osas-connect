import React, { memo } from "react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
    steps: readonly string[];
    currentStep: number;
    totalSteps: number;
}

const StepProgress = memo<StepProgressProps>(({ steps, currentStep, totalSteps }) => {
    return (
        <div className="mb-8">
            <div className="relative flex justify-between items-center mb-8">
                {/* Progress line background */}
                <div className="absolute top-[22px] left-0 w-full h-0.5">
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
                            <div key={title} className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-11 h-11 mb-2 rounded-lg flex items-center justify-center text-base font-medium transition-all duration-300 border-2",
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
                                            className="w-5 h-5"
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
                                    "text-sm text-center min-w-[100px] max-w-[140px] transition-colors duration-200 px-2",
                                    {
                                        "text-foreground font-medium": isActive,
                                        "text-muted-foreground font-normal": !isActive,
                                    }
                                )}>
                                    {title}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current step indicator */}
            <div className="text-center bg-muted/30 py-2.5 px-4 rounded-lg">
                <h2 className="text-base font-medium text-foreground">
                    {steps[currentStep - 1]}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Step {currentStep} of {totalSteps}
                </p>
            </div>
        </div>
    );
});

StepProgress.displayName = 'StepProgress';

export default StepProgress;
