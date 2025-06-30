import { useMemo } from "react";
import { SelectorWithLabel } from "@/components/selector-with-label";

export interface CivilStatusSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

const CIVIL_STATUS_OPTIONS = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
];

export default function CivilStatusSelector({
    value,
    onChange,
    error,
    required = false,
    className = "",
}: CivilStatusSelectorProps) {
    const options = useMemo(() => CIVIL_STATUS_OPTIONS, []);
    return (
        <SelectorWithLabel
            id="civil_status"
            label="Civil Status"
            required={required}
            value={value}
            onChange={onChange}
            placeholder="Select civil status"
            options={options}
            error={error}
            className={className}
        />
    );
}
