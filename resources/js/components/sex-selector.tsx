import { useMemo } from "react";
import { SelectorWithLabel } from "@/components/selector-with-label";

export interface SexSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

const SEX_OPTIONS = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

export default function SexSelector({
    value,
    onChange,
    error,
    required = false,
    className = "",
}: SexSelectorProps) {
    const options = useMemo(() => SEX_OPTIONS, []);
    return (
        <SelectorWithLabel
            id="sex"
            label="Sex"
            required={required}
            value={value}
            onChange={onChange}
            placeholder="Select sex"
            options={options}
            error={error}
            className={className}
        />
    );
}
