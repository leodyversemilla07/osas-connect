import React, { memo } from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, TextField } from '@/components/profile/form-fields';
import { PhotoIdUpload } from '@/components/profile/photo-id-upload';
import type { ProfileSectionProps } from '@/types/profile';

interface BasicInfoSectionProps extends ProfileSectionProps {
    photoUrl?: string;
    roleIdField: string;
    roleDisplayName: string;
}

export const BasicInfoSection = memo<BasicInfoSectionProps>(({
    data,
    errors,
    updateField,
    photoUrl,
    roleIdField,
    roleDisplayName
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
                </CardTitle>
                <CardDescription>Your core identity details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="First Name" 
                        required 
                        error={errors.first_name}
                    >
                        <TextField
                            id="first_name"
                            value={data.first_name}
                            onChange={(value) => updateField('first_name', value)}
                            required
                            autoComplete="given-name"
                            placeholder="Enter your first name"
                            data-testid="first-name-input"
                        />
                    </FormField>

                    <FormField 
                        label="Last Name" 
                        required 
                        error={errors.last_name}
                    >
                        <TextField
                            id="last_name"
                            value={data.last_name}
                            onChange={(value) => updateField('last_name', value)}
                            required
                            autoComplete="family-name"
                            placeholder="Enter your last name"
                            data-testid="last-name-input"
                        />
                    </FormField>
                </div>

                <FormField label="Middle Name" error={errors.middle_name}>
                    <TextField
                        id="middle_name"
                        value={data.middle_name ?? ''}
                        onChange={(value) => updateField('middle_name', value)}
                        autoComplete="additional-name"
                        placeholder="Enter your middle name (if any)"
                        data-testid="middle-name-input"
                    />
                </FormField>

                <FormField label="Email" required error={errors.email}>
                    <TextField
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(value) => updateField('email', value)}
                        required
                        autoComplete="email"
                        placeholder="Enter your email address"
                        data-testid="email-input"
                    />
                </FormField>

                <FormField
                    label={roleDisplayName}
                    required
                    error={errors[roleIdField]}
                >
                    <TextField
                        id={roleIdField}
                        value={data[roleIdField as keyof typeof data] as string}
                        onChange={() => {}} // Read-only
                        readOnly
                        data-testid="role-id-input"
                    />
                </FormField>

                <FormField
                    label="1x1 ID Photo"
                    description="Upload a recent 1x1 ID picture with white background"
                    error={errors.photo_id}
                >
                    <PhotoIdUpload
                        onChange={(file) => updateField('photo_id', file)}
                        existingPhotoUrl={photoUrl}
                    />
                </FormField>
            </CardContent>
        </Card>
    );
});

BasicInfoSection.displayName = 'BasicInfoSection';
