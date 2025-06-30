import React, { memo } from "react";
import { SelectorWithLabel } from "@/components/selector-with-label";
import { InputWithLabel } from "@/components/input-with-label";
import CourseSelector from "@/components/course-selector";
import type { RegisterForm } from "@/hooks/use-registration-form";

interface AcademicInformationStepProps {
    data: RegisterForm;
    errors: Record<string, string>;
    onFieldChange: (field: keyof RegisterForm, value: string) => void;
    onCourseChange: (value: string) => void;
}

const AcademicInformationStep = memo<AcademicInformationStepProps>(({
    data,
    errors,
    onFieldChange,
    onCourseChange,
}) => {
    return (
        <div className="space-y-6">
            <div>
                <InputWithLabel
                    id="student_id"
                    label="Student ID"
                    required
                    value={data.student_id}
                    onChange={value => onFieldChange('student_id', value)}
                    placeholder="MBC2025-0001"
                    pattern="MBC[0-9]{4}-[0-9]{4}"
                    error={errors.student_id}
                    className="w-full"
                />
                <p className="mt-1 text-sm text-muted-foreground">Format: MBCYYYY-NNNN (e.g., MBC2025-0001)</p>
            </div>

            <div>
                <CourseSelector
                    value={data.course}
                    onChange={onCourseChange}
                    error={errors.course}
                    required
                    majorValue={data.major}
                    onMajorChange={value => onFieldChange('major', value)}
                    majorError={errors.major}
                    className="w-full"
                />
            </div>

            <div>
                <SelectorWithLabel
                    id="year_level"
                    label="Year Level"
                    required
                    value={data.year_level}
                    onChange={value => onFieldChange('year_level', value)}
                    options={[
                        { value: "1st Year", label: "1st Year" },
                        { value: "2nd Year", label: "2nd Year" },
                        { value: "3rd Year", label: "3rd Year" },
                        { value: "4th Year", label: "4th Year" },
                    ]}
                    placeholder="Select your year level"
                    error={errors.year_level}
                    className="w-full"
                />
            </div>

            <div>
                <InputWithLabel
                    id="scholarships"
                    label="Current Scholarships (Optional)"
                    value={data.scholarships}
                    onChange={value => onFieldChange('scholarships', value)}
                    placeholder="List any current scholarships (separate multiple with commas)"
                    error={errors.scholarships}
                    className="w-full"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                    If you have multiple scholarships, separate them with commas. Leave blank if none.
                </p>
            </div>
        </div>
    );
});

AcademicInformationStep.displayName = 'AcademicInformationStep';

export default AcademicInformationStep;
