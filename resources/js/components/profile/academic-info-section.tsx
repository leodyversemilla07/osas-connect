import React, { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, TextField } from '@/components/profile/form-fields';
import type { ProfileSectionProps } from '@/types/profile';

// Academic level options
const YEAR_LEVELS = [
    { value: '1st_year', label: '1st Year' },
    { value: '2nd_year', label: '2nd Year' },
    { value: '3rd_year', label: '3rd Year' },
    { value: '4th_year', label: '4th Year' }
] as const;

export const AcademicInfoSection = memo<ProfileSectionProps>(({
    data,
    errors,
    updateField
}) => {
    // Debug logging to see what data is being passed
    console.log('AcademicInfoSection - Full data object:', data);
    console.log('AcademicInfoSection - year_level:', data.year_level);
    console.log('AcademicInfoSection - existing_scholarships:', data.existing_scholarships);
    
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="Course/Program" 
                        required 
                        error={errors.course}
                    >
                        <TextField
                            id="course"
                            value={data.course ?? ''}
                            onChange={(value) => updateField('course', value)}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            data-testid="course-input"
                        />
                    </FormField>

                    <FormField 
                        label="Major/Specialization" 
                        error={errors.major}
                    >
                        <TextField
                            id="major"
                            value={data.major ?? ''}
                            onChange={(value) => updateField('major', value)}
                            placeholder="e.g., Software Engineering"
                            data-testid="major-input"
                        />
                    </FormField>
                </div>

                <FormField 
                    label="Year Level" 
                    required 
                    error={errors.year_level}
                >
                    <Select 
                        value={data.year_level ?? ''} 
                        onValueChange={(value) => updateField('year_level', value)}
                    >
                        <SelectTrigger data-testid="year-level-select">
                            <SelectValue placeholder="Select your current year level" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEAR_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField 
                    label="Existing Scholarships" 
                    error={errors.existing_scholarships}
                    description="List any current scholarships or financial aid you're receiving"
                >
                    <TextField
                        id="existing_scholarships"
                        value={data.existing_scholarships ?? ''}
                        onChange={(value) => updateField('existing_scholarships', value)}
                        placeholder="e.g., Academic Excellence Scholarship, DOST Scholarship"
                        data-testid="existing-scholarships-input"
                    />
                </FormField>
            </CardContent>
        </Card>
    );
});

AcademicInfoSection.displayName = 'AcademicInfoSection';
