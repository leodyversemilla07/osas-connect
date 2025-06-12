import React, { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, TextField } from '@/components/profile/form-fields';
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Course/Program"
                        required
                        error={errors.course}
                    >
                        <div className='truncate'>
                            <Select
                                value={data.course ?? ''}
                                onValueChange={handleCourseChange || ((value) => updateField('course', value))}
                            >
                                <SelectTrigger data-testid="course-select">
                                    <SelectValue placeholder="Select your course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bachelor of Science in Information Technology">
                                        BSIT - Bachelor of Science in Information Technology
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Science in Computer Engineering">
                                        BSCpE - Bachelor of Science in Computer Engineering
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Science in Tourism Management">
                                        BSTM - Bachelor of Science in Tourism Management
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Science in Hospitality Management">
                                        BSHM - Bachelor of Science in Hospitality Management
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Science in Entrepreneurship">
                                        BSENTREP - Bachelor of Science in Entrepreneurship
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Arts in Political Science">
                                        ABPolSci - Bachelor of Arts in Political Science
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Science in Criminology">
                                        BSCrim - Bachelor of Science in Criminology
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Science in Fisheries">
                                        BSFI - Bachelor of Science in Fisheries
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Secondary Education">
                                        BSEd - Bachelor of Secondary Education
                                    </SelectItem>
                                    <SelectItem value="Bachelor of Elementary Education">
                                        BEEd - Bachelor of Elementary Education
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </FormField>
                    {(data.course === "Bachelor of Secondary Education" || data.course === "Bachelor of Science in Entrepreneurship") && (
                        <FormField
                            label={data.course === "Bachelor of Secondary Education" ? "Major" : "Specialization"}
                            required
                            error={errors.major}
                        >
                            <Select
                                value={data.major ?? ''}
                                onValueChange={(value) => updateField('major', value)}
                            >
                                <SelectTrigger data-testid="major-select">
                                    <SelectValue placeholder={data.course === "Bachelor of Secondary Education" ? "Select your major" : "Select your specialization"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.course === "Bachelor of Secondary Education" ? (
                                        <>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Science">Science</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="Farm Business">Farm Business</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </FormField>
                    )}
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
