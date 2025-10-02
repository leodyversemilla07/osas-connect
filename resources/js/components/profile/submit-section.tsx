import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { memo } from 'react';

interface SubmitSectionProps {
    processing: boolean;
    progress?: { percentage: number } | null;
}

export const SubmitSection = memo<SubmitSectionProps>(({ processing, progress }) => {
    return (
        <Card className="bg-card/50 hover:bg-card/75 transition-colors">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-muted-foreground text-sm">
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
                                {progress ? `Uploading... ${progress.percentage}%` : 'Saving profile...'}
                            </span>
                        ) : (
                            'Make sure all required fields are filled before saving.'
                        )}
                    </div>

                    <Button type="submit" disabled={processing} className="min-w-[140px]" data-testid="submit-button">
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Saving...' : 'Save Profile'}
                    </Button>
                </div>

                {progress && (
                    <div className="mt-4">
                        <div className="h-2 w-full rounded-full bg-gray-200">
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
