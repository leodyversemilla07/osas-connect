import React, { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputWithLabel } from "@/components/input-with-label";
import CourseSelector from "@/components/course-selector";
import { SelectorWithLabel } from "@/components/selector-with-label";
import type { ProfileSectionProps } from '@/types/profile';

// Academic level options
const YEAR_LEVELS = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' }
] as const;

export const AcademicInfoSection = memo<ProfileSectionProps>(({
    data,
    errors,
    updateField,
    handleCourseChange
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Academic Information
                </CardTitle>
                <CardDescription>Your educational background details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <CourseSelector
                    value={data.course ?? ''}
                    onChange={handleCourseChange || ((value) => updateField('course', value))}
                    error={errors.course}
                    majorValue={data.major ?? ''}
                    onMajorChange={(value) => updateField('major', value)}
                    majorError={errors.major}
                    className="truncate"
                />

                <SelectorWithLabel
                    id="year_level"
                    label="Year Level"
                    value={data.year_level ?? ''}
                    onChange={(value) => updateField('year_level', value)}
                    options={[...YEAR_LEVELS]}
                    error={errors.year_level}
                    placeholder="Select your current year level"
                    className="w-full"
                />

                {/* Existing Scholarships Field */}
                <div className="space-y-1">
                    <InputWithLabel
                        id="existing_scholarships"
                        label="Existing Scholarships"
                        value={data.existing_scholarships ?? ''}
                        onChange={(value) => updateField('existing_scholarships', value)}
                        placeholder="e.g., Academic Excellence Scholarship, DOST Scholarship"
                        error={errors.existing_scholarships}
                        className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">List any current scholarships or financial aid you're receiving</p>
                </div>
            </CardContent>
        </Card>
    );
});

AcademicInfoSection.displayName = 'AcademicInfoSection';
