import { useMemo } from "react";
import { SelectorWithLabel } from "@/components/selector-with-label";
import { InputWithLabel } from "@/components/input-with-label";

export interface ResidenceTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
    guardianName?: string;
    onGuardianNameChange?: (value: string) => void;
    guardianError?: string;
}

const RESIDENCE_TYPE_OPTIONS = [
    { value: "Parent's House", label: "Parent's House" },
    { value: "Boarding House", label: "Boarding House" },
    { value: "With Guardian", label: "With Guardian" },
];

export default function ResidenceTypeSelector({
    value,
    onChange,
    error,
    required = false,
    className = "",
    guardianName = "",
    onGuardianNameChange,
    guardianError,
}: ResidenceTypeSelectorProps) {
    const options = useMemo(() => RESIDENCE_TYPE_OPTIONS, []);
    return (
        <>
            <SelectorWithLabel
                id="residence_type"
                label="Residence Type"
                required={required}
                value={value}
                onChange={onChange}
                placeholder="Select residence type"
                options={options}
                error={error}
                className={className}
            />
            {(value === "With Guardian") && (
                <InputWithLabel
                    id="guardian_name"
                    label="Guardian Name"
                    required
                    value={guardianName}
                    onChange={onGuardianNameChange ?? (() => {})}
                    error={guardianError}
                    placeholder="Enter guardian's full name"
                    className="w-full"
                />
            )}
        </>
    );
}
