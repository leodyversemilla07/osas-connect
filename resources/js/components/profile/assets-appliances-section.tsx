import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { FinancialData, ProfileSectionProps } from '@/types/profile';
import { Home } from 'lucide-react';
import React from 'react';

/**
 * Assets & Appliances Section Component
 * Handles household appliances and assets information
 */
export const AssetsAppliancesSection = React.memo<Pick<ProfileSectionProps, 'data' | 'errors' | 'updateField'>>(({ data, errors, updateField }) => {
    const appliances: Array<{
        key: keyof FinancialData;
        label: string;
        testId: string;
    }> = [
        { key: 'has_tv', label: 'TV', testId: 'has-tv' },
        { key: 'has_radio_speakers_karaoke', label: 'Radio/Speakers/Karaoke', testId: 'has-radio-speakers-karaoke' },
        { key: 'has_musical_instruments', label: 'Musical Instruments', testId: 'has-musical-instruments' },
        { key: 'has_computer', label: 'Computer', testId: 'has-computer' },
        { key: 'has_stove', label: 'Stove', testId: 'has-stove' },
        { key: 'has_laptop', label: 'Laptop', testId: 'has-laptop' },
        { key: 'has_refrigerator', label: 'Refrigerator', testId: 'has-refrigerator' },
        { key: 'has_microwave', label: 'Microwave', testId: 'has-microwave' },
        { key: 'has_air_conditioner', label: 'Air Conditioner', testId: 'has-air-conditioner' },
        { key: 'has_electric_fan', label: 'Electric Fan', testId: 'has-electric-fan' },
        { key: 'has_washing_machine', label: 'Washing Machine', testId: 'has-washing-machine' },
        { key: 'has_cellphone', label: 'Cellphone', testId: 'has-cellphone' },
        { key: 'has_gaming_box', label: 'Gaming Box', testId: 'has-gaming-box' },
        { key: 'has_dslr_camera', label: 'DSLR Camera', testId: 'has-dslr-camera' },
    ];
    const handleApplianceChange = React.useCallback(
        (key: keyof FinancialData, checked: boolean) => {
            updateField(key, checked);
        },
        [updateField],
    );

    return (
        <Card data-testid="assets-appliances-section">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Home className="text-primary h-5 w-5" />
                    <CardTitle>Assets & Appliances</CardTitle>
                </div>
                <CardDescription>Household appliances and assets owned by the family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-foreground text-sm font-semibold">Household Appliances</h4>
                    <p className="text-muted-foreground text-sm">Please check all appliances that your family currently owns.</p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {appliances.map(({ key, label, testId }) => (
                            <div key={key} className="flex items-center space-x-2">
                                {' '}
                                <Checkbox
                                    id={key}
                                    checked={Boolean(data[key]) || false}
                                    onCheckedChange={(checked) => handleApplianceChange(key, checked as boolean)}
                                    data-testid={`${testId}-checkbox`}
                                />
                                <label
                                    htmlFor={key}
                                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {label}
                                </label>
                                {errors[key] && <span className="text-destructive ml-2 text-sm">{errors[key]}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="text-foreground mb-2 text-sm font-medium">Note</h5>
                    <p className="text-muted-foreground text-sm">
                        This information helps assess the household's economic status and standard of living. Please be honest and accurate in your
                        responses as this may be verified during the scholarship application process.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});

AssetsAppliancesSection.displayName = 'AssetsAppliancesSection';
