import React, { memo } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SubmitSectionProps {
    processing: boolean;
    progress?: { percentage: number } | null;
}

export const SubmitSection = memo<SubmitSectionProps>(({ 
    processing, 
    progress 
}) => {
    return (
        <Card className="bg-card/50 hover:bg-card/75 transition-colors">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                {progress ? `Uploading... ${progress.percentage}%` : 'Saving profile...'}
                            </span>
                        ) : (
                            'Make sure all required fields are filled before saving.'
                        )}
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="min-w-[140px]"
                        data-testid="submit-button"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Saving...' : 'Save Profile'}
                    </Button>
                </div>
                
                {progress && (
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

SubmitSection.displayName = 'SubmitSection';
