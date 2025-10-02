import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Requirement {
    id: string;
    title: string;
    description: string;
    type: 'required' | 'optional' | 'recommended';
    status?: 'completed' | 'pending' | 'missing';
}

interface RequirementsListProps {
    requirements: Requirement[];
    title?: string;
    description?: string;
}

interface GeneralRequirementsListProps {
    className?: string;
}

const getRequirementIcon = (status?: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'pending':
            return <Clock className="h-4 w-4 text-yellow-600" />;
        case 'missing':
            return <AlertCircle className="h-4 w-4 text-red-600" />;
        default:
            return <Clock className="h-4 w-4 text-gray-400" />;
    }
};

const getRequirementBadge = (type: string) => {
    switch (type) {
        case 'required':
            return (
                <Badge variant="destructive" className="text-xs">
                    Required
                </Badge>
            );
        case 'optional':
            return (
                <Badge variant="secondary" className="text-xs">
                    Optional
                </Badge>
            );
        case 'recommended':
            return (
                <Badge variant="outline" className="text-xs">
                    Recommended
                </Badge>
            );
        default:
            return null;
    }
};

export function RequirementsList({ requirements, title = 'Requirements', description }: RequirementsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {requirements.map((requirement) => (
                        <div key={requirement.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                            {getRequirementIcon(requirement.status)}
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{requirement.title}</h4>
                                    {getRequirementBadge(requirement.type)}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{requirement.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function GeneralRequirementsList({ className }: GeneralRequirementsListProps) {
    const generalRequirements: Requirement[] = [
        {
            id: 'enrollment',
            title: 'Current Enrollment',
            description: 'Must be currently enrolled as a regular student at the university',
            type: 'required',
        },
        {
            id: 'gpa',
            title: 'Academic Standing',
            description: 'Maintain a minimum GPA of 2.5 (may vary by scholarship type)',
            type: 'required',
        },
        {
            id: 'financial-need',
            title: 'Financial Need Assessment',
            description: 'Demonstrate financial need through required documentation',
            type: 'required',
        },
        {
            id: 'documents',
            title: 'Supporting Documents',
            description: 'Submit all required documents including transcripts, certificates, and recommendations',
            type: 'required',
        },
        {
            id: 'interview',
            title: 'Interview',
            description: 'Participate in an interview process when requested',
            type: 'recommended',
        },
        {
            id: 'community-service',
            title: 'Community Service',
            description: 'Active participation in community service or university activities',
            type: 'optional',
        },
    ];

    return (
        <div className={className}>
            <RequirementsList
                requirements={generalRequirements}
                title="General Scholarship Requirements"
                description="Basic requirements that apply to most scholarship programs"
            />
        </div>
    );
}
