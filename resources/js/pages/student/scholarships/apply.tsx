import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
        documents: {} as Record<string, File>,        // Add application_data fields to match Laravel model
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
    };      const handleSubmit = (e: React.FormEvent) => {
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
                description: validationErrors.join('. ')
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
                    description: 'Your scholarship application has been submitted and is under review.'
                });
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors);
                const errorMessages = Object.values(errors).flat();
                toast.error('Failed to submit application', {
                    description: errorMessages.length > 0 ? errorMessages.join('. ') : 'Please check your form and try again.'
                });
            },
            onFinish: () => {
                console.log('Form submission finished');
            }
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
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Parent/Guardian Consent *
                            </Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="parent_consent"
                                    checked={data.application_data.parent_consent_provided}
                                    onChange={(e) => setData('application_data', {
                                        ...data.application_data,
                                        parent_consent_provided: e.target.checked
                                    })}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                <Label htmlFor="parent_consent" className="text-sm">
                                    I have parental/guardian consent for this application
                                </Label>
                            </div>
                            {formErrors['application_data.parent_consent_provided'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.parent_consent_provided']}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Pre-hiring Screening Status *
                            </Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="pre_hiring"
                                    checked={data.application_data.pre_hiring_completed}
                                    onChange={(e) => setData('application_data', {
                                        ...data.application_data,
                                        pre_hiring_completed: e.target.checked
                                    })}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                <Label htmlFor="pre_hiring" className="text-sm">
                                    I have completed the pre-hiring screening process
                                </Label>
                            </div>
                            {formErrors['application_data.pre_hiring_completed'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.pre_hiring_completed']}</p>
                            )}
                        </div>
                    </>
                );

            case 'performing_arts_full':
            case 'performing_arts_partial':
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="membership_duration" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Membership Duration (months) *
                            </Label>
                            <Input
                                id="membership_duration"
                                type="number"
                                min="0"
                                value={data.application_data.membership_duration}
                                onChange={(e) => setData('application_data', {
                                    ...data.application_data,
                                    membership_duration: e.target.value
                                })}
                                className="mt-1 border-gray-200 dark:border-gray-800"
                            />
                            {formErrors['application_data.membership_duration'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.membership_duration']}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="major_activities" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Number of Major Activities Participated *
                            </Label>
                            <Input
                                id="major_activities"
                                type="number"
                                min="0"
                                value={data.application_data.major_activities_count}
                                onChange={(e) => setData('application_data', {
                                    ...data.application_data,
                                    major_activities_count: parseInt(e.target.value) || 0
                                })}
                                className="mt-1 border-gray-200 dark:border-gray-800"
                            />
                            {formErrors['application_data.major_activities_count'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.major_activities_count']}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Major Performances
                            </Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="major_performances"
                                    checked={data.application_data.major_performances}
                                    onChange={(e) => setData('application_data', {
                                        ...data.application_data,
                                        major_performances: e.target.checked
                                    })}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                <Label htmlFor="major_performances" className="text-sm">
                                    I have participated in major performances
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Coach Recommendation *
                            </Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="coach_recommendation"
                                    checked={data.application_data.coach_recommendation_provided}
                                    onChange={(e) => setData('application_data', {
                                        ...data.application_data,
                                        coach_recommendation_provided: e.target.checked
                                    })}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                <Label htmlFor="coach_recommendation" className="text-sm">
                                    I have coach recommendation for this application
                                </Label>
                            </div>
                            {formErrors['application_data.coach_recommendation_provided'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.coach_recommendation_provided']}</p>
                            )}
                        </div>
                    </>
                );

            case 'economic_assistance':
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="family_income" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Annual Family Income (₱) *
                            </Label>
                            <Input
                                id="family_income"
                                type="number"
                                min="0"
                                value={data.application_data.family_income}
                                onChange={(e) => setData('application_data', {
                                    ...data.application_data,
                                    family_income: e.target.value
                                })}
                                className="mt-1 border-gray-200 dark:border-gray-800"
                                placeholder="Enter your family's annual income"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Must be ₱250,000 or below to qualify for economic assistance
                            </p>
                            {formErrors['application_data.family_income'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.family_income']}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="indigency_date" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Indigency Certificate Issue Date *
                            </Label>
                            <Input
                                id="indigency_date"
                                type="date"
                                value={data.application_data.indigency_certificate_issue_date}
                                onChange={(e) => setData('application_data', {
                                    ...data.application_data,
                                    indigency_certificate_issue_date: e.target.value
                                })}
                                className="mt-1 border-gray-200 dark:border-gray-800"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Certificate must be issued within the last 6 months
                            </p>
                            {formErrors['application_data.indigency_certificate_issue_date'] && (
                                <p className="text-red-600 text-sm mt-1">{formErrors['application_data.indigency_certificate_issue_date']}</p>
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

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Apply for Scholarship</h1>
                        <p className="text-base text-gray-500 dark:text-gray-400">Complete the application form below to apply for this scholarship.</p>
                    </div>
                </div>                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Scholarship Details Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6 border-gray-200 dark:border-gray-800">                            <CardHeader>
                            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{scholarship.name}</CardTitle>
                            <CardDescription>
                                <Badge variant="secondary" className="mb-2">
                                    {scholarship.typeLabel || scholarship.type}
                                </Badge>
                            </CardDescription>
                        </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">{formatAmount(scholarship.stipendAmount)}</span>
                                </div>

                                {scholarship.availableSlots && (
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">{scholarship.availableSlots} slots available</span>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                                </div>                                {scholarship.description && (
                                    <div>
                                        <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Description</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{scholarship.description}</p>
                                    </div>
                                )}

                                {scholarship.requirements && scholarship.requirements.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Requirements</h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            {scholarship.requirements.map((req, index) => (
                                                <li key={index} className="flex items-start space-x-2">
                                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-gray-200 dark:border-gray-800">                            <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Application Form</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">
                                Please fill out all required fields to submit your application.
                            </CardDescription>
                        </CardHeader>
                            <CardContent>                                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                                {/* Personal Statement */}
                                <div className="space-y-2">
                                    <Label htmlFor="personal_statement" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Personal Statement *
                                    </Label>
                                    <Textarea
                                        id="personal_statement"
                                        placeholder="Tell us about yourself, your background, and why you're applying for this scholarship..."
                                        value={data.personal_statement}
                                        onChange={(e) => setData('personal_statement', e.target.value)}
                                        rows={4}
                                        className="mt-1 border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
                                    />
                                    {errors.personal_statement && (
                                        <p className="text-red-600 text-sm mt-1">{errors.personal_statement}</p>
                                    )}
                                </div>

                                {/* Academic Goals */}
                                <div className="space-y-2">
                                    <Label htmlFor="academic_goals" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Academic Goals *
                                    </Label>
                                    <Textarea
                                        id="academic_goals"
                                        placeholder="Describe your academic goals and how this scholarship will help you achieve them..."
                                        value={data.academic_goals}
                                        onChange={(e) => setData('academic_goals', e.target.value)}
                                        rows={3}
                                        className="mt-1 border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
                                    />
                                    {errors.academic_goals && (
                                        <p className="text-red-600 text-sm mt-1">{errors.academic_goals}</p>
                                    )}
                                </div>

                                {/* Financial Need Statement */}
                                <div className="space-y-2">
                                    <Label htmlFor="financial_need_statement" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Financial Need Statement *
                                    </Label>
                                    <Textarea
                                        id="financial_need_statement"
                                        placeholder="Explain your financial situation and why you need this scholarship..."
                                        value={data.financial_need_statement}
                                        onChange={(e) => setData('financial_need_statement', e.target.value)}
                                        rows={3}
                                        className="mt-1 border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
                                    />
                                    {errors.financial_need_statement && (
                                        <p className="text-red-600 text-sm mt-1">{errors.financial_need_statement}</p>
                                    )}
                                </div>                                    {/* Required Documents */}
                                {scholarship.requiredDocuments && formatDocuments(scholarship.requiredDocuments).length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Required Documents</h3>
                                        <div className="space-y-4">
                                            {formatDocuments(scholarship.requiredDocuments).map((doc, index) => (
                                                <div key={index} className="space-y-2">
                                                    <Label htmlFor={`document_${index}`} className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                                                        className="mt-1 border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600" />
                                                    {uploadedFiles[doc] && (
                                                        <p className="text-green-600 text-sm mt-1">
                                                            <CheckCircle className="h-4 w-4 inline mr-1" />
                                                            {uploadedFiles[doc]} uploaded
                                                        </p>
                                                    )}
                                                    {formErrors[`documents.${doc}`] && (
                                                        <p className="text-red-600 text-sm mt-1">{formErrors[`documents.${doc}`]}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Comments */}
                                <div className="space-y-2">
                                    <Label htmlFor="additional_comments" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Additional Comments
                                    </Label>
                                    <Textarea
                                        id="additional_comments"
                                        placeholder="Any additional information you'd like to share (optional)..."
                                        value={data.additional_comments}
                                        onChange={(e) => setData('additional_comments', e.target.value)}
                                        rows={2}
                                        className="mt-1 border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
                                    />
                                </div>

                                {/* Scholarship type-specific fields */}
                                {renderScholarshipSpecificFields() && (
                                    <div className="space-y-4 border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Additional Requirements for {scholarship.typeLabel || scholarship.type}
                                        </h3>
                                        {renderScholarshipSpecificFields()}
                                    </div>
                                )}

                                {/* Enhanced Student Profile Summary with eligibility checking */}
                                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                                    <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <AlertDescription className="text-gray-900 dark:text-gray-100">
                                        <strong>Application Summary:</strong><br />
                                        Student ID: {userProfile.student_profile?.student_id || 'N/A'}<br />
                                        Current GWA: {userProfile.student_profile?.current_gwa ? userProfile.student_profile.current_gwa.toFixed(2) : 'Not yet available'}<br />
                                        Course: {userProfile.student_profile?.course || 'N/A'}<br />
                                        Year Level: {userProfile.student_profile?.year_level || 'N/A'}<br />
                                        Enrollment Status: {userProfile.student_profile?.enrollment_status || 'N/A'}<br />
                                        Units Enrolled: {userProfile.student_profile?.units || 'N/A'}<br />
                                        <br />
                                        <strong>Eligibility Status:</strong><br />
                                        {userProfile.student_profile?.enrollment_status !== 'enrolled' && (
                                            <span className="text-red-600">⚠️ Must be currently enrolled</span>
                                        )}
                                        {(scholarship.type === 'academic_full' || scholarship.type === 'academic_partial') &&
                                            userProfile.student_profile?.units && userProfile.student_profile.units < 18 && (
                                                <span className="text-red-600">⚠️ Must be enrolled in at least 18 units</span>
                                            )}
                                        {scholarship.type === 'student_assistantship' &&
                                            userProfile.student_profile?.units && userProfile.student_profile.units > 21 && (
                                                <span className="text-red-600">⚠️ Must be enrolled in 21 units or less for student assistantship</span>
                                            )}
                                    </AlertDescription>
                                </Alert>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/student/scholarships">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
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
