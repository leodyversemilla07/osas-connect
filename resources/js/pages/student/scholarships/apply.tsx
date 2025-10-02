import { TextareaWithLabel } from '@/components/textarea-with-label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Scholarship {
    id: number;
    name: string;
    type: string;
    typeLabel?: string;
    description: string;
    benefits?: string[];
    requirements?: string[];
    requiredDocuments?: Record<string, string> | string[];
    eligibilityCriteria?: string[];
    gwaRequirement?: { min?: number; max?: number } | null;
    stipendAmount?: number;
    applicationDeadline?: string;
    deadline: string;
    availableSlots?: number;
    canApply?: boolean;
}

interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    student_profile?: {
        student_id: string;
        current_gwa: number;
        enrollment_status: string;
        units: number;
        course?: string;
        year_level?: string;
    };
}

interface Props {
    scholarship: Scholarship;
    userProfile: UserProfile;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Browse Scholarships',
        href: '/student/scholarships',
    },
    {
        title: 'Apply',
        href: '#',
    },
];

export default function Apply({ scholarship, userProfile }: Props) {
    // Debug: Log the userProfile to see what data we're receiving
    console.log('userProfile:', userProfile);
    console.log('userProfile.student_profile:', userProfile.student_profile);

    const { data, setData, post, processing, errors } = useForm({
        personal_statement: '',
        academic_goals: '',
        financial_need_statement: '',
        additional_comments: '',
        documents: {} as Record<string, File>, // Add application_data fields to match Laravel model
        application_data: {
            family_income: '',
            membership_duration: '',
            major_performances: false as boolean,
            major_activities_count: 0,
            pre_hiring_completed: false as boolean,
            parent_consent_provided: false as boolean,
            coach_recommendation_provided: false as boolean,
            indigency_certificate_issue_date: '',
        },
    });

    // Type assertion for dynamic error access
    const formErrors = errors as Record<string, string>;

    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

    const handleFileUpload = (documentType: string, file: File) => {
        setData('documents', {
            ...data.documents,
            [documentType]: file,
        });
        setUploadedFiles({
            ...uploadedFiles,
            [documentType]: file.name,
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic client-side validation
        const validationErrors: string[] = [];

        if (!data.personal_statement || data.personal_statement.trim().length < 100) {
            validationErrors.push('Personal statement must be at least 100 characters');
        }
        if (!data.academic_goals || data.academic_goals.trim().length < 50) {
            validationErrors.push('Academic goals must be at least 50 characters');
        }
        if (!data.financial_need_statement || data.financial_need_statement.trim().length < 50) {
            validationErrors.push('Financial need statement must be at least 50 characters');
        }

        if (validationErrors.length > 0) {
            console.log('Client-side validation errors:', validationErrors);
            toast.error('Please fix the following errors', {
                description: validationErrors.join('. '),
            });
            return;
        }

        // Debug: Log the data being sent
        console.log('Form data being submitted:', data);
        console.log('Route URL:', route('student.scholarships.store', scholarship.id));

        // Use the correct route pattern that matches Laravel routes
        post(route('student.scholarships.store', scholarship.id), {
            forceFormData: true,
            onSuccess: (page) => {
                console.log('Form submitted successfully:', page);
                toast.success('Application submitted successfully!', {
                    description: 'Your scholarship application has been submitted and is under review.',
                });
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors);
                const errorMessages = Object.values(errors).flat();
                toast.error('Failed to submit application', {
                    description: errorMessages.length > 0 ? errorMessages.join('. ') : 'Please check your form and try again.',
                });
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const formatAmount = (amount?: number) => {
        if (!amount || amount === 0) return 'Amount varies';
        return `₱${amount.toLocaleString()}/month`;
    };

    const formatDocuments = (documents?: Record<string, string> | string[]) => {
        if (Array.isArray(documents)) {
            return documents;
        }
        if (documents && typeof documents === 'object') {
            return Object.values(documents);
        }
        return [];
    };

    // Add scholarship type-specific field renderer
    const renderScholarshipSpecificFields = () => {
        switch (scholarship.type) {
            case 'student_assistantship':
                return (
                    <>
                        <div className="space-y-3">
                            <Label className="text-foreground text-sm font-medium lg:text-base">Parent/Guardian Consent *</Label>
                            <div className="flex min-h-[44px] items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="parent_consent"
                                    checked={data.application_data.parent_consent_provided}
                                    onChange={(e) =>
                                        setData('application_data', {
                                            ...data.application_data,
                                            parent_consent_provided: e.target.checked,
                                        })
                                    }
                                    className="border-border h-4 w-4 rounded lg:h-5 lg:w-5"
                                />
                                <Label htmlFor="parent_consent" className="text-sm leading-relaxed lg:text-base">
                                    I have parental/guardian consent for this application
                                </Label>
                            </div>
                            {formErrors['application_data.parent_consent_provided'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">{formErrors['application_data.parent_consent_provided']}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-foreground text-sm font-medium lg:text-base">Pre-hiring Screening Status *</Label>
                            <div className="flex min-h-[44px] items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="pre_hiring"
                                    checked={data.application_data.pre_hiring_completed}
                                    onChange={(e) =>
                                        setData('application_data', {
                                            ...data.application_data,
                                            pre_hiring_completed: e.target.checked,
                                        })
                                    }
                                    className="border-border h-4 w-4 rounded lg:h-5 lg:w-5"
                                />
                                <Label htmlFor="pre_hiring" className="text-sm leading-relaxed lg:text-base">
                                    I have completed the pre-hiring screening process
                                </Label>
                            </div>
                            {formErrors['application_data.pre_hiring_completed'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">{formErrors['application_data.pre_hiring_completed']}</p>
                            )}
                        </div>
                    </>
                );

            case 'performing_arts_full':
            case 'performing_arts_partial':
                return (
                    <>
                        <div className="space-y-3">
                            <Label htmlFor="membership_duration" className="text-foreground text-sm font-medium lg:text-base">
                                Membership Duration (months) *
                            </Label>
                            <Input
                                id="membership_duration"
                                type="number"
                                min="0"
                                value={data.application_data.membership_duration}
                                onChange={(e) =>
                                    setData('application_data', {
                                        ...data.application_data,
                                        membership_duration: e.target.value,
                                    })
                                }
                                className="border-border min-h-[44px] lg:text-base"
                            />
                            {formErrors['application_data.membership_duration'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">{formErrors['application_data.membership_duration']}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="major_activities" className="text-foreground text-sm font-medium lg:text-base">
                                Number of Major Activities Participated *
                            </Label>
                            <Input
                                id="major_activities"
                                type="number"
                                min="0"
                                value={data.application_data.major_activities_count}
                                onChange={(e) =>
                                    setData('application_data', {
                                        ...data.application_data,
                                        major_activities_count: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="border-border min-h-[44px] lg:text-base"
                            />
                            {formErrors['application_data.major_activities_count'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">{formErrors['application_data.major_activities_count']}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-foreground text-sm font-medium lg:text-base">Major Performances</Label>
                            <div className="flex min-h-[44px] items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="major_performances"
                                    checked={data.application_data.major_performances}
                                    onChange={(e) =>
                                        setData('application_data', {
                                            ...data.application_data,
                                            major_performances: e.target.checked,
                                        })
                                    }
                                    className="border-border h-4 w-4 rounded lg:h-5 lg:w-5"
                                />
                                <Label htmlFor="major_performances" className="text-sm leading-relaxed lg:text-base">
                                    I have participated in major performances
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-foreground text-sm font-medium lg:text-base">Coach Recommendation *</Label>
                            <div className="flex min-h-[44px] items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="coach_recommendation"
                                    checked={data.application_data.coach_recommendation_provided}
                                    onChange={(e) =>
                                        setData('application_data', {
                                            ...data.application_data,
                                            coach_recommendation_provided: e.target.checked,
                                        })
                                    }
                                    className="border-border h-4 w-4 rounded lg:h-5 lg:w-5"
                                />
                                <Label htmlFor="coach_recommendation" className="text-sm leading-relaxed lg:text-base">
                                    I have coach recommendation for this application
                                </Label>
                            </div>
                            {formErrors['application_data.coach_recommendation_provided'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">
                                    {formErrors['application_data.coach_recommendation_provided']}
                                </p>
                            )}
                        </div>
                    </>
                );

            case 'economic_assistance':
                return (
                    <>
                        <div className="space-y-3">
                            <Label htmlFor="family_income" className="text-foreground text-sm font-medium lg:text-base">
                                Annual Family Income (₱) *
                            </Label>
                            <Input
                                id="family_income"
                                type="number"
                                min="0"
                                value={data.application_data.family_income}
                                onChange={(e) =>
                                    setData('application_data', {
                                        ...data.application_data,
                                        family_income: e.target.value,
                                    })
                                }
                                className="border-border min-h-[44px] lg:text-base"
                                placeholder="Enter your family's annual income"
                            />
                            <p className="text-muted-foreground text-sm lg:text-base">Must be ₱250,000 or below to qualify for economic assistance</p>
                            {formErrors['application_data.family_income'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">{formErrors['application_data.family_income']}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="indigency_date" className="text-foreground text-sm font-medium lg:text-base">
                                Indigency Certificate Issue Date *
                            </Label>
                            <Input
                                id="indigency_date"
                                type="date"
                                value={data.application_data.indigency_certificate_issue_date}
                                onChange={(e) =>
                                    setData('application_data', {
                                        ...data.application_data,
                                        indigency_certificate_issue_date: e.target.value,
                                    })
                                }
                                className="border-border min-h-[44px] lg:text-base"
                            />
                            <p className="text-muted-foreground text-sm lg:text-base">Certificate must be issued within the last 6 months</p>
                            {formErrors['application_data.indigency_certificate_issue_date'] && (
                                <p className="text-destructive mt-2 text-sm lg:text-base">
                                    {formErrors['application_data.indigency_certificate_issue_date']}
                                </p>
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Apply for ${scholarship.name}`} />

            <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
                <div className="border-border border-b pb-6 lg:pb-8">
                    <div>
                        <h1 className="text-foreground text-2xl font-semibold sm:text-3xl">Apply for Scholarship</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Complete the application form below to apply for this scholarship.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 xl:gap-8">
                    {/* Scholarship Details Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="border-border sticky top-6">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="text-foreground text-lg font-semibold lg:text-xl">{scholarship.name}</CardTitle>
                                <CardDescription>
                                    <Badge variant="secondary" className="mb-2">
                                        {scholarship.typeLabel || scholarship.type}
                                    </Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0 lg:space-y-6">
                                <div className="flex items-center space-x-3">
                                    <DollarSign className="h-4 w-4 text-emerald-600 lg:h-5 lg:w-5 dark:text-emerald-400" />
                                    <span className="text-foreground text-sm font-medium lg:text-base">
                                        {formatAmount(scholarship.stipendAmount)}
                                    </span>
                                </div>

                                {scholarship.availableSlots && (
                                    <div className="flex items-center space-x-3">
                                        <Users className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
                                        <span className="text-foreground text-sm lg:text-base">{scholarship.availableSlots} slots available</span>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <Clock className="text-destructive h-4 w-4 lg:h-5 lg:w-5" />
                                    <span className="text-foreground text-sm lg:text-base">
                                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                    </span>
                                </div>

                                {scholarship.description && (
                                    <div className="space-y-2">
                                        <h4 className="text-foreground mb-2 text-sm font-medium lg:text-base">Description</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed lg:text-base">{scholarship.description}</p>
                                    </div>
                                )}

                                {scholarship.requirements && scholarship.requirements.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-foreground mb-3 text-sm font-medium lg:text-base">Requirements</h4>
                                        <ul className="text-muted-foreground space-y-2 text-sm lg:text-base">
                                            {scholarship.requirements.map((req, index) => (
                                                <li key={index} className="flex items-start space-x-3">
                                                    <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-600 lg:mt-1 lg:h-4 lg:w-4 dark:text-emerald-400" />
                                                    <span className="leading-relaxed">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-border">
                            <CardHeader className="pb-4 lg:pb-6">
                                <CardTitle className="text-foreground text-lg font-semibold lg:text-xl">Application Form</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Please fill out all required fields to submit your application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <form
                                    onSubmit={handleSubmit}
                                    encType="multipart/form-data"
                                    className="bg-background text-foreground space-y-6 lg:space-y-8"
                                >
                                    {/* Personal Statement */}
                                    <div className="space-y-3">
                                        <TextareaWithLabel
                                            id="personal_statement"
                                            label="Personal Statement"
                                            value={data.personal_statement}
                                            onChange={(value: string) => setData('personal_statement', value)}
                                            placeholder="Write your personal statement here..."
                                            error={formErrors['personal_statement']}
                                            required
                                        />
                                    </div>

                                    {/* Academic Goals */}
                                    <div className="space-y-3">
                                        <TextareaWithLabel
                                            id="academic_goals"
                                            label="Academic Goals"
                                            value={data.academic_goals}
                                            onChange={(value: string) => setData('academic_goals', value)}
                                            placeholder="Describe your academic goals here..."
                                            error={formErrors['academic_goals']}
                                            required
                                        />
                                    </div>

                                    {/* Financial Need Statement */}
                                    <div className="space-y-3">
                                        <TextareaWithLabel
                                            id="financial_need_statement"
                                            label="Financial Need Statement"
                                            value={data.financial_need_statement}
                                            onChange={(value: string) => setData('financial_need_statement', value)}
                                            placeholder="Explain your financial need here..."
                                            error={formErrors['financial_need_statement']}
                                            required
                                        />
                                    </div>
                                    {/* Scholarship type-specific fields */}
                                    {renderScholarshipSpecificFields() && (
                                        <div className="border-border space-y-4 border-t pt-6 lg:space-y-6 lg:pt-8">
                                            <h3 className="text-foreground text-lg font-medium lg:text-xl">
                                                Additional Requirements for {scholarship.typeLabel || scholarship.type}
                                            </h3>
                                            <div className="space-y-4 lg:space-y-6">{renderScholarshipSpecificFields()}</div>
                                        </div>
                                    )}

                                    {/* Required Documents */}
                                    {scholarship.requiredDocuments && formatDocuments(scholarship.requiredDocuments).length > 0 && (
                                        <div className="border-border space-y-4 border-t pt-6 lg:space-y-6 lg:pt-8">
                                            <h3 className="text-foreground text-lg font-medium lg:text-xl">Required Documents</h3>
                                            <div className="space-y-4 lg:space-y-6">
                                                {formatDocuments(scholarship.requiredDocuments).map((doc, index) => (
                                                    <div key={index} className="space-y-3">
                                                        <Label
                                                            htmlFor={`document_${index}`}
                                                            className="text-foreground text-sm font-medium lg:text-base"
                                                        >
                                                            {doc} *
                                                        </Label>
                                                        <Input
                                                            id={`document_${index}`}
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleFileUpload(doc, file);
                                                                }
                                                            }}
                                                            className="border-border focus:border-ring file:bg-muted file:text-foreground min-h-[44px] file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium lg:text-base"
                                                        />
                                                        {uploadedFiles[doc] && (
                                                            <p className="mt-2 flex items-center text-sm text-emerald-600 lg:text-base dark:text-emerald-400">
                                                                <CheckCircle className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                                                                {uploadedFiles[doc]} uploaded
                                                            </p>
                                                        )}
                                                        {formErrors[`documents.${doc}`] && (
                                                            <p className="text-destructive mt-2 text-sm lg:text-base">
                                                                {formErrors[`documents.${doc}`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Comments */}
                                    <div className="border-border space-y-3 border-t pt-6 lg:pt-8">
                                        <Label htmlFor="additional_comments" className="text-foreground text-sm font-medium lg:text-base">
                                            Additional Comments
                                        </Label>
                                        <Textarea
                                            id="additional_comments"
                                            placeholder="Any additional information you'd like to share (optional)..."
                                            value={data.additional_comments}
                                            onChange={(e) => setData('additional_comments', e.target.value)}
                                            rows={2}
                                            className="border-border focus:border-ring min-h-[44px] lg:text-base"
                                        />
                                    </div>
                                    {/* Enhanced Student Profile Summary with eligibility checking */}
                                    <Alert className="border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10 p-4 lg:p-6">
                                        <AlertTriangle className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
                                        <AlertDescription className="text-foreground space-y-2 text-sm leading-relaxed lg:text-base">
                                            <div>
                                                <strong>Application Summary:</strong>
                                                <br />
                                                Student ID: {userProfile.student_profile?.student_id || 'N/A'}
                                                <br />
                                                Current GWA:{' '}
                                                {userProfile.student_profile?.current_gwa
                                                    ? Number(userProfile.student_profile.current_gwa).toFixed(2)
                                                    : 'Not yet available'}
                                                <br />
                                                Course: {userProfile.student_profile?.course || 'N/A'}
                                                <br />
                                                Year Level: {userProfile.student_profile?.year_level || 'N/A'}
                                                <br />
                                                Enrollment Status: {userProfile.student_profile?.enrollment_status || 'N/A'}
                                                <br />
                                                Units Enrolled: {userProfile.student_profile?.units || 'N/A'}
                                            </div>
                                            <div className="border-primary/20 border-t pt-2">
                                                <strong>Eligibility Status:</strong>
                                                <br />
                                                {userProfile.student_profile?.enrollment_status !== 'enrolled' && (
                                                    <span className="text-destructive font-medium">⚠️ Must be currently enrolled</span>
                                                )}
                                                {(scholarship.type === 'academic_full' || scholarship.type === 'academic_partial') &&
                                                    userProfile.student_profile?.units &&
                                                    userProfile.student_profile.units < 18 && (
                                                        <span className="text-destructive font-medium">⚠️ Must be enrolled in at least 18 units</span>
                                                    )}
                                                {scholarship.type === 'student_assistantship' &&
                                                    userProfile.student_profile?.units &&
                                                    userProfile.student_profile.units > 21 && (
                                                        <span className="text-destructive font-medium">
                                                            ⚠️ Must be enrolled in 21 units or less for student assistantship
                                                        </span>
                                                    )}
                                            </div>
                                        </AlertDescription>
                                    </Alert>

                                    {/* Submit Button */}
                                    <div className="border-border flex flex-col space-y-4 border-t pt-6 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4 lg:pt-8">
                                        <Button type="button" variant="outline" className="min-h-[44px] px-6 lg:px-8" asChild>
                                            <Link href="/student/scholarships">Cancel</Link>
                                        </Button>
                                        <Button type="submit" disabled={processing} className="min-h-[44px] px-6 lg:px-8">
                                            {processing ? 'Submitting...' : 'Submit Application'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
