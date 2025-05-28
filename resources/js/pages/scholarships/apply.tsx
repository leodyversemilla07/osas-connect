import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileUp, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Scholarship {
    id: number;
    name: string;
    type: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string[];
    requirements: string[];
}

interface ApplicationFormProps {
    scholarship: Scholarship;
}

interface FormData {
    purpose_letter: string;
    parent_consent: boolean;
    agreement: boolean;
    academic_year: number;
    semester: string;
    uploaded_documents: { [key: string]: File | null };
}

const requiredDocuments = [
    { key: 'grades', label: 'Official Transcript of Records', description: 'Latest copy from registrar' },
    { key: 'birth_certificate', label: 'Birth Certificate', description: 'PSA-issued copy' },
    { key: 'good_moral', label: 'Certificate of Good Moral Character', description: 'From previous school' },
    { key: 'income_statement', label: 'Family Income Statement', description: 'BIR Form or Certificate of Indigency' },
    { key: 'enrollment_certificate', label: 'Certificate of Enrollment', description: 'Current semester' },
];

export default function ScholarshipApplicationForm({ scholarship }: ApplicationFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
    
    const { data, setData, post, processing, errors, progress } = useForm<FormData>({
        purpose_letter: '',
        parent_consent: false,
        agreement: false,
        academic_year: new Date().getFullYear(),
        semester: '',
        uploaded_documents: {},
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Scholarships', href: '/student/scholarships' },
        { title: scholarship.name, href: '#' },
        { title: 'Apply', href: '#' },
    ];

    const handleFileUpload = (documentType: string, file: File | null) => {
        const newUploadedFiles = { ...uploadedFiles, [documentType]: file };
        setUploadedFiles(newUploadedFiles);
        setData('uploaded_documents', newUploadedFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            post(`/scholarships/${scholarship.id}/apply`, {
                onSuccess: () => {
                    // Redirect will be handled by the controller
                },
            });
        }
    };

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1:
                return data.purpose_letter.length >= 100;
            case 2:
                return requiredDocuments.every(doc => uploadedFiles[doc.key]);
            case 3:
                return data.academic_year && data.semester;
            case 4:
                return data.parent_consent && data.agreement;
            default:
                return false;
        }
    };

    const getStepProgress = () => (currentStep / 4) * 100;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="purpose_letter" className="text-base font-semibold">
                                Statement of Purpose *
                            </Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Explain why you deserve this scholarship and how it will help your studies (minimum 100 words)
                            </p>
                            <Textarea
                                id="purpose_letter"
                                value={data.purpose_letter}
                                onChange={(e) => setData('purpose_letter', e.target.value)}
                                placeholder="Write your statement of purpose here..."
                                rows={8}
                                className="resize-none"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>Minimum 100 characters required</span>
                                <span className={data.purpose_letter.length >= 100 ? 'text-green-600' : 'text-red-500'}>
                                    {data.purpose_letter.length} characters
                                </span>
                            </div>
                            {errors.purpose_letter && (
                                <p className="text-red-500 text-sm mt-1">{errors.purpose_letter}</p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Please upload all required documents. Files must be in PDF format and no larger than 5MB each.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {requiredDocuments.map((doc) => (
                                <Card key={doc.key} className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Label className="font-medium">{doc.label}</Label>
                                                {uploadedFiles[doc.key] && (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {doc.description}
                                            </p>
                                            
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                                                    className="hidden"
                                                    id={`file-${doc.key}`}
                                                />
                                                <Label
                                                    htmlFor={`file-${doc.key}`}
                                                    className="flex items-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    Choose File
                                                </Label>
                                                
                                                {uploadedFiles[doc.key] && (
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {uploadedFiles[doc.key]?.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Please provide your current academic details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="academic_year" className="text-base font-medium">
                                    Academic Year *
                                </Label>
                                <Input
                                    id="academic_year"
                                    type="number"
                                    value={data.academic_year}
                                    onChange={(e) => setData('academic_year', parseInt(e.target.value))}
                                    min="2023"
                                    max="2030"
                                    className="mt-2"
                                />
                                {errors.academic_year && (
                                    <p className="text-red-500 text-sm mt-1">{errors.academic_year}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="semester" className="text-base font-medium">
                                    Semester *
                                </Label>
                                <Select value={data.semester} onValueChange={(value) => setData('semester', value)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Select semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st">1st Semester</SelectItem>
                                        <SelectItem value="2nd">2nd Semester</SelectItem>
                                        <SelectItem value="Summer">Summer</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.semester && (
                                    <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Terms and Agreement</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Please read and accept the following terms before submitting your application.
                            </p>
                        </div>

                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="parent_consent"
                                        checked={data.parent_consent}
                                        onCheckedChange={(checked) => setData('parent_consent', checked as boolean)}
                                    />
                                    <Label htmlFor="parent_consent" className="text-sm leading-relaxed">
                                        I have obtained consent from my parent/guardian to apply for this scholarship, 
                                        and they are aware of the requirements and commitments involved.
                                    </Label>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="agreement"
                                        checked={data.agreement}
                                        onCheckedChange={(checked) => setData('agreement', checked as boolean)}
                                    />
                                    <Label htmlFor="agreement" className="text-sm leading-relaxed">
                                        I agree to the scholarship terms and conditions, understand that providing 
                                        false information may result in disqualification, and commit to maintaining 
                                        the required academic performance throughout the scholarship period.
                                    </Label>
                                </div>
                            </div>
                        </Card>

                        {(errors.parent_consent || errors.agreement) && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Please accept all terms and agreements to proceed with your application.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Apply for {scholarship.name}</title>
                <meta name="description" content={`Apply for ${scholarship.name} scholarship`} />
            </Head>

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Apply for {scholarship.name}
                    </h1>
                    <div className="flex justify-center">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {scholarship.type}
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {scholarship.description}
                    </p>
                </div>

                {/* Progress Bar */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Application Progress</h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Step {currentStep} of 4
                            </span>
                        </div>
                        <Progress value={getStepProgress()} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Purpose</span>
                            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Documents</span>
                            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Academic Info</span>
                            <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Agreement</span>
                        </div>
                    </div>
                </Card>

                {/* Application Form */}
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={!canProceedToNextStep() || processing}
                                className={currentStep === 4 ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                {processing ? 'Processing...' : currentStep === 4 ? 'Submit Application' : 'Next'}
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Help Information */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Need help with your application? Contact the OSAS office at osas@minsu.edu.ph or visit us during office hours.
                    </AlertDescription>
                </Alert>
            </div>
        </AppLayout>
    );
}
