import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, InfoIcon } from "lucide-react"

interface RequirementsListProps {
    title: string
    requirements: string[]
}

export function RequirementsList({ title, requirements }: RequirementsListProps) {
    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">{title}</p>
            </div>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
                {requirements.map((req, index) => (
                    <li key={index} className="leading-relaxed">{req}</li>
                ))}
            </ul>
        </div>
    )
}

export function GeneralRequirementsList() {
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
                        {[
                            'Bona fide student of MinSU',
                            'Has a regular load per semester',
                            'Has a good moral character',
                            'Has passed all subjects',
                            'Has no existing scholarship from private/public agencies',
                            'Must pass the Screening Committee interview'
                        ].map((req, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#febd12]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white/90">{req}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
