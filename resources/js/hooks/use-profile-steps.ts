import { useCallback, useState } from "react";

export const PROFILE_STEP_TITLES = [
    "Basic Information",
    "Academic Information", 
    "Personal Details",
    "Family Background",
    "Financial Information"
] as const;

export function useProfileSteps(isStudent: boolean = true) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = isStudent ? 5 : 1; // No review step, non-students only get basic info

    // Simple navigation without validation blocking
    const goToNextStep = useCallback(() => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            return true;
        }
        return false;
    }, [currentStep, totalSteps]);

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    const goToStep = useCallback((step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
        }
    }, [totalSteps]);

    return {
        currentStep,
        totalSteps,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
    };
}
