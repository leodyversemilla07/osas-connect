import React from 'react';
import type { ProfileSectionProps } from '@/types/profile';

interface ReviewSubmitStepProps extends ProfileSectionProps {
    roleDisplayName: string;
    isStudent: boolean;
}

export default function ReviewSubmitStep({
    data,
    roleDisplayName,
    isStudent
}: ReviewSubmitStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-medium">Review Your Information</h3>
                <p className="text-muted-foreground">
                    Please review all your information before submitting.
                </p>
            </div>
            
            {/* Summary sections */}
            <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Name:</span> {data.first_name} {data.middle_name} {data.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Email:</span> {data.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Role:</span> {roleDisplayName}
                        </p>
                    </div>
                </div>
                
                {isStudent && data.student_id && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Academic Information</h4>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Student ID:</span> {data.student_id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Course:</span> {data.course}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Year Level:</span> {data.year_level}
                            </p>
                            {data.major && data.major !== 'None' && (
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Major:</span> {data.major}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {isStudent && data.civil_status && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Personal Information</h4>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Civil Status:</span> {data.civil_status}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Sex:</span> {data.sex}
                            </p>
                            {data.date_of_birth && (
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Date of Birth:</span> {new Date(data.date_of_birth).toLocaleDateString()}
                                </p>
                            )}
                            {data.mobile_number && (
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Mobile Number:</span> {data.mobile_number}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {isStudent && data.status_of_parents && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Family Background</h4>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Status of Parents:</span> {data.status_of_parents}
                            </p>
                            {data.father_name && (
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Father:</span> {data.father_name}
                                </p>
                            )}
                            {data.mother_name && (
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Mother:</span> {data.mother_name}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {isStudent && data.total_annual_income !== undefined && data.total_annual_income > 0 && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Financial Information</h4>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Total Annual Income:</span> ₱{data.total_annual_income?.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Total Monthly Expenses:</span> ₱{data.total_monthly_expenses?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
