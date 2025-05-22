export type ScholarshipType = 'Academic' | 'Student Assistantship' | 'Performing Arts' | 'Economic Assistance';

export interface GWARequirement {
    min?: number;
    max: number;
    description?: string;
}

export interface Scholarship {
    id: number;
    name: string;
    type: ScholarshipType;
    amount: string;
    stipendSchedule: 'monthly' | 'semestral';
    deadline: string;
    description: string;
    gwaRequirement?: GWARequirement;
    eligibility: string[];
    requirements: string[];
    renewalCriteria: string[];
    status: 'open' | 'closed';
}
