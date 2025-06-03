import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputError from "@/components/input-error";
import type { RegisterForm } from "@/hooks/useRegistrationForm";

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
    const isEducationCourse = data.course === "Bachelor of Secondary Education" || 
                             data.course === "Bachelor of Elementary Education";

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="student_id" className="text-sm font-medium">
                    Student ID <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="student_id"
                    value={data.student_id}
                    onChange={(e) => onFieldChange('student_id', e.target.value)}
                    className="mt-1"
                    placeholder="Enter your student ID"
                    aria-describedby={errors.student_id ? "student_id-error" : undefined}
                />
                <InputError id="student_id-error" message={errors.student_id} className="mt-1" />
            </div>

            <div>
                <Label htmlFor="course" className="text-sm font-medium">
                    Course <span className="text-red-500">*</span>
                </Label>
                <Select value={data.course} onValueChange={onCourseChange}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Bachelor of Science in Information Technology">
                            Bachelor of Science in Information Technology
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Computer Science">
                            Bachelor of Science in Computer Science
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Business Administration">
                            Bachelor of Science in Business Administration
                        </SelectItem>
                        <SelectItem value="Bachelor of Arts in Communication">
                            Bachelor of Arts in Communication
                        </SelectItem>
                        <SelectItem value="Bachelor of Secondary Education">
                            Bachelor of Secondary Education
                        </SelectItem>
                        <SelectItem value="Bachelor of Elementary Education">
                            Bachelor of Elementary Education
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Psychology">
                            Bachelor of Science in Psychology
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Criminology">
                            Bachelor of Science in Criminology
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Engineering">
                            Bachelor of Science in Engineering
                        </SelectItem>
                        <SelectItem value="Bachelor of Science in Nursing">
                            Bachelor of Science in Nursing
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.course} className="mt-1" />
            </div>

            {isEducationCourse && (
                <div>
                    <Label htmlFor="major" className="text-sm font-medium">
                        Major <span className="text-red-500">*</span>
                    </Label>
                    <Select value={data.major} onValueChange={(value) => onFieldChange('major', value)}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Social Studies">Social Studies</SelectItem>
                            <SelectItem value="Physical Education">Physical Education</SelectItem>
                            <SelectItem value="Technology and Livelihood Education">
                                Technology and Livelihood Education
                            </SelectItem>
                            <SelectItem value="General Education">General Education</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.major} className="mt-1" />
                </div>
            )}

            <div>
                <Label htmlFor="year_level" className="text-sm font-medium">
                    Year Level <span className="text-red-500">*</span>
                </Label>
                <Select value={data.year_level} onValueChange={(value) => onFieldChange('year_level', value)}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your year level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.year_level} className="mt-1" />
            </div>

            <div>
                <Label htmlFor="scholarships" className="text-sm font-medium">
                    Current Scholarships (Optional)
                </Label>
                <Input
                    id="scholarships"
                    value={data.scholarships}
                    onChange={(e) => onFieldChange('scholarships', e.target.value)}
                    className="mt-1"
                    placeholder="List any current scholarships (separate multiple with commas)"
                />
                <InputError message={errors.scholarships} className="mt-1" />
                <p className="mt-1 text-sm text-muted-foreground">
                    If you have multiple scholarships, separate them with commas. Leave blank if none.
                </p>
            </div>
        </div>
    );
});

AcademicInformationStep.displayName = 'AcademicInformationStep';

export default AcademicInformationStep;
