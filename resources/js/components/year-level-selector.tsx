import { useMemo } from "react";
import { SelectorWithLabel } from "@/components/selector-with-label";

export interface YearLevelSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

const YEAR_LEVEL_OPTIONS = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
];

export default function YearLevelSelector({
    value,
    onChange,
    error,
    required = false,
    className = "",
}: YearLevelSelectorProps) {
    const options = useMemo(() => YEAR_LEVEL_OPTIONS, []);
    return (
        <SelectorWithLabel
            id="year_level"
            label="Year Level"
            required={required}
            value={value}
            onChange={onChange}
            options={options}
            placeholder="Select your year level"
            error={error}
            className={className}
        />
    );
}
