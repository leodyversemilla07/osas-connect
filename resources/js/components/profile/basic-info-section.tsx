import React, { memo } from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputWithLabel } from '@/components/input-with-label';
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
                    <InputWithLabel
                        id="first_name"
                        label="First Name"
                        value={data.first_name}
                        onChange={(value) => updateField('first_name', value)}
                        placeholder="Enter your first name"
                        error={errors.first_name}
                        data-testid="first-name-input"
                    />
                    <InputWithLabel
                        id="middle_name"
                        label="Middle Name"
                        value={data.middle_name ?? ''}
                        onChange={(value) => updateField('middle_name', value)}
                        placeholder="Enter your middle name (if any)"
                        error={errors.middle_name}
                        data-testid="middle-name-input"
                    />
                    <InputWithLabel
                        id="last_name"
                        label="Last Name"
                        value={data.last_name}
                        onChange={(value) => updateField('last_name', value)}
                        placeholder="Enter your last name"
                        error={errors.last_name}
                        data-testid="last-name-input"
                    />
                    <InputWithLabel
                        id="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(value) => updateField('email', value)}
                        placeholder="Enter your email address"
                        error={errors.email}
                        data-testid="email-input"
                    />
                </div>
                <InputWithLabel
                    id={roleIdField}
                    label={roleDisplayName}
                    value={data[roleIdField as keyof typeof data] as string}
                    onChange={() => { }} // Read-only
                    error={errors[roleIdField]}
                    disabled
                    data-testid="role-id-input"
                />
                <PhotoIdUpload
                    onChange={(file) => updateField('photo_id', file)}
                    existingPhotoUrl={photoUrl}
                />
            </CardContent>
        </Card>
    );
});

BasicInfoSection.displayName = 'BasicInfoSection';
