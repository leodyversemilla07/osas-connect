/** @jsxImportSource react */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, GraduationCap } from 'lucide-react';

interface RequirementsListProps {
    title: string;
    requirements: string[];
}

export const RequirementsList: React.FC<RequirementsListProps> = ({ title, requirements }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <div className="mt-1">
                            <div className="w-1 h-1 rounded-full bg-[#febd12]" />
                        </div>
                        <span className="text-sm text-muted-foreground">{requirement}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const generalRequirements = [
    'Must be a bona fide student of MinSU',
    'Must be enrolled with a regular load per semester',
    'Must have good moral character',
    'Must have no failing subjects',
    'Must have complete grades from the previous semester',
    'Must not have any existing scholarship or grant from private/public agencies',
    'Must pass the Scholarship Committee interview',
    'Must submit complete application requirements'
] as const;

const importantNotes = [
    'All scholarships are awarded on a per-semester basis and require renewal.',
    'Applications must be submitted within the announced application period.',
    'Students can only avail one scholarship program at a time.',
    'Failure to maintain eligibility requirements will result in scholarship termination.'
] as const;

export function GeneralRequirementsList(): React.ReactElement {
    return (
        <div className="mt-12 mb-12">
            <Card className="bg-gradient-to-r from-[#005a2d]/95 to-[#008040]/90 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <pattern id="pattern-circles-req" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                            <circle id="pattern-circle-req" cx="10" cy="10" r="1.6" fill="#fff"></circle>
                        </pattern>
                        <rect id="rect-req" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-req)"></rect>
                    </svg>
                </div>

                <CardContent className="relative z-10 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-[#febd12] p-2">
                            <GraduationCap className="h-6 w-6 text-[#005a2d]" />
                        </div>
                        <Badge variant="outline" className="bg-[#febd12]/20 text-[#febd12] border-[#febd12]">
                            <InfoIcon className="w-3 h-3 mr-1" />
                            Required for All Scholarships
                        </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-4">General Qualification Requirements</h3>
                    <p className="mb-6 text-white/90">
                        To be eligible for any MinSU Scholarship and Financial Assistantship Program, all applicants must meet these basic requirements:
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        {generalRequirements.map((req, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white/90">{req}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h4 className="font-semibold mb-3">Important Notes:</h4>
                        <ul className="space-y-2">
                            {importantNotes.map((note, index) => (
                                <li key={index} className="flex items-start gap-2 text-white/90 text-sm">
                                    <div className="mt-1.5">
                                        <div className="w-1 h-1 rounded-full bg-[#febd12]" />
                                    </div>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
