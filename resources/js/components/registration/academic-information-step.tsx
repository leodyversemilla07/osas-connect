import React, { memo } from "react";
import { SelectorWithLabel } from "@/components/selector-with-label";
import { InputWithLabel } from "@/components/input-with-label";
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
                <SelectorWithLabel
                    id="course"
                    label="Course"
                    required
                    value={data.course}
                    onChange={onCourseChange}
                    options={[
                        { value: "Bachelor of Science in Information Technology", label: "BSIT - Bachelor of Science in Information Technology" },
                        { value: "Bachelor of Science in Computer Engineering", label: "BSCpE - Bachelor of Science in Computer Engineering" },
                        { value: "Bachelor of Science in Tourism Management", label: "BSTM - Bachelor of Science in Tourism Management" },
                        { value: "Bachelor of Science in Hospitality Management", label: "BSHM - Bachelor of Science in Hospitality Management" },
                        { value: "Bachelor of Science in Entrepreneurship", label: "BSENTREP - Bachelor of Science in Entrepreneurship" },
                        { value: "Bachelor of Arts in Political Science", label: "ABPolSci - Bachelor of Arts in Political Science" },
                        { value: "Bachelor of Science in Criminology", label: "BSCrim - Bachelor of Science in Criminology" },
                        { value: "Bachelor of Science in Fisheries", label: "BSFI - Bachelor of Science in Fisheries" },
                        { value: "Bachelor of Secondary Education", label: "BSEd - Bachelor of Secondary Education" },
                        { value: "Bachelor of Elementary Education", label: "BEEd - Bachelor of Elementary Education" },
                    ]}
                    placeholder="Select your course"
                    error={errors.course}
                    className="w-full"
                />
            </div>
            {(data.course === "Bachelor of Secondary Education" || data.course === "Bachelor of Science in Entrepreneurship") && (
                <div>
                    <SelectorWithLabel
                        id="major"
                        label={data.course === "Bachelor of Secondary Education" ? "Major" : "Specialization"}
                        required
                        value={data.major}
                        onChange={value => onFieldChange('major', value)}
                        options={data.course === "Bachelor of Secondary Education"
                            ? [
                                { value: "Mathematics", label: "Mathematics" },
                                { value: "English", label: "English" },
                                { value: "Science", label: "Science" },
                            ]
                            : [
                                { value: "Farm Business", label: "Farm Business" },
                            ]}
                        placeholder={data.course === "Bachelor of Secondary Education" ? "Select your major" : "Select your specialization"}
                        error={errors.major}
                        className="w-full"
                    />
                </div>
            )}

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
