import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AddressForm from '@/components/address-form';
import { VALIDATION } from '@/lib/validation';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type RegisterForm = {
    last_name: string;
    first_name: string;
    middle_name: string;
    email: string;
    student_id: string;
    password: string;
    password_confirmation: string;
    course: string;
    major: string;
    year_level: string;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    mobile_number: string;
    telephone_number: string;
    is_pwd: string;
    disability_type: string;
    religion: string;
    residence_type: string;
    guardian_name: string;
    scholarships: string;
    terms_agreement: boolean;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        student_id: '',
        password: '',
        password_confirmation: '',
        course: '',
        major: 'None',
        year_level: '1st Year',
        civil_status: 'Single',
        sex: 'Male',
        date_of_birth: '',
        place_of_birth: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        mobile_number: '',
        telephone_number: '',
        is_pwd: 'No',
        disability_type: '',
        religion: 'Prefer not to say',
        residence_type: '',
        guardian_name: '',
        scholarships: '',
        terms_agreement: false,
    });

    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // Step titles for the progress indicator
    const stepTitles = [
        "Personal Information",
        "Academic Information",
        "Account Setup",
        "Review & Submit"
    ];

    // Validate current step before proceeding to next
    const validateStep = (step: number): boolean => {
        try {
            switch (step) {
                case 1: {
                    // Validate Personal Information fields
                    const personalFields = [
                        data.first_name,
                        data.last_name,
                        data.middle_name,
                        data.sex,
                        data.civil_status,
                        data.date_of_birth,
                        data.place_of_birth,
                        data.street,
                        data.barangay,
                        data.city,
                        data.province,
                        data.mobile_number,
                        data.religion,
                        data.residence_type
                    ];

                    if (personalFields.some(field => !field)) {
                        return false;
                    }

                    if (data.residence_type === 'With Guardian' && !data.guardian_name) {
                        return false;
                    }

                    if (data.is_pwd === 'Yes' && !data.disability_type) {
                        return false;
                    }

                    return true;
                }

                case 2: {
                    // Validate Academic Information fields
                    const academicFields = [data.student_id, data.course, data.year_level];
                    return academicFields.every(field => !!field);
                }

                case 3: {
                    // Validate Account Setup fields
                    const accountFields = [data.email, data.password, data.password_confirmation];
                    if (accountFields.some(field => !field)) {
                        return false;
                    }

                    // Check email format
                    if (!data.email.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN)) {
                        return false;
                    }

                    // Check password confirmation
                    if (data.password !== data.password_confirmation) {
                        return false;
                    }

                    return true;
                }

                case 4: {
                    // Validate final review and terms agreement
                    return data.terms_agreement === true;
                }

                default:
                    return true;
            }
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    };

    const goToNextStep = () => {
        if (currentStep < totalSteps && validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    interface ValidationErrors {
        [key: string]: string;
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Ensure we're on the final step
        if (currentStep === totalSteps) {
            // Validate all steps before submission
            const allStepsValid = [1, 2, 3, 4].every(step => validateStep(step));

            if (!allStepsValid) {
                // Find the first invalid step and go there
                for (let step = 1; step <= totalSteps; step++) {
                    if (!validateStep(step)) {
                        setCurrentStep(step);
                        break;
                    }
                }
                return;
            }

            // All validations passed, submit the form
            post(route('register'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('password', 'password_confirmation');
                },
                onError: (errors: ValidationErrors) => {
                    // Log errors for debugging
                    console.error('Registration errors:', errors);

                    // Navigate to the step with errors
                    if (errors.email || errors.password || errors.password_confirmation) {
                        setCurrentStep(3);
                    } else if (errors.student_id || errors.course || errors.year_level) {
                        setCurrentStep(2);
                    } else {
                        setCurrentStep(1);
                    }
                }
            });
        }
    };

    return (
        <AuthLayout title="Create a student account" description="Enter your details below to create your student account for OSAS Connect">
            <Head title="Student Registration" />

            {/* Progress indicator */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    {stepTitles.map((title, index) => (
                        <div
                            key={index}
                            className={`text-xs font-medium ${currentStep > index + 1 ? 'text-primary' : currentStep === index + 1 ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            Step {index + 1}
                        </div>
                    ))}
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-2 bg-primary rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
                <div className="mt-2 text-sm font-medium">
                    {stepTitles[currentStep - 1]}
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name" className="text-base">Last Name *</Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Doe"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="first_name" className="text-base">First Name *</Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="given-name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        disabled={processing}
                                        placeholder="John"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name" className="text-base">Middle Name *</Label>
                                <Input
                                    id="middle_name"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Enter your middle name"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-base">Sex *</Label>
                                    <RadioGroup
                                        id="sex"
                                        name="sex"
                                        value={data.sex}
                                        onValueChange={(value) => setData('sex', value)}
                                        className="flex gap-4"
                                        disabled={processing}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Male" id="male" />
                                            <Label htmlFor="male" className="cursor-pointer">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Female" id="female" />
                                            <Label htmlFor="female" className="cursor-pointer">Female</Label>
                                        </div>
                                    </RadioGroup>
                                    <InputError message={errors.sex} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="civil_status" className="text-base">Civil Status *</Label>
                                    <Select
                                        value={data.civil_status}
                                        onValueChange={(value) => setData('civil_status', value)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger tabIndex={4} id="civil_status">
                                            <SelectValue placeholder="Select civil status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Separated">Separated</SelectItem>
                                            <SelectItem value="Annulled">Annulled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.civil_status} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date_of_birth" className="text-base">Date of Birth *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !data.date_of_birth && "text-muted-foreground"
                                            )}
                                        >
                                            {data.date_of_birth ? (
                                                format(new Date(data.date_of_birth), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    // Format date as YYYY-MM-DD using local time to avoid timezone issues
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    setData('date_of_birth', `${year}-${month}-${day}`);
                                                } else {
                                                    setData('date_of_birth', '');
                                                }
                                            }}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.date_of_birth} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="place_of_birth" className="text-base">Place of Birth *</Label>
                                <Input
                                    id="place_of_birth"
                                    type="text"
                                    required
                                    tabIndex={6}
                                    value={data.place_of_birth}
                                    onChange={(e) => setData('place_of_birth', e.target.value)}
                                    disabled={processing}
                                    placeholder="City/Municipality, Province"
                                />
                                <InputError message={errors.place_of_birth} />
                            </div>

                            <AddressForm
                                data={{
                                    street: data.street,
                                    barangay: data.barangay,
                                    city: data.city,
                                    province: data.province,
                                }}
                                setData={(field, value) => setData(field, value)}
                                errors={errors}
                                processing={processing}
                            />

                            <div className="grid gap-2">
                                <Label className="text-base">Current Residence *</Label>
                                <div className="rounded-md border p-4 space-y-3">
                                    <RadioGroup
                                        value={data.residence_type}
                                        onValueChange={(value) => {
                                            setData('residence_type', value);
                                            // Set guardian_name to 'Not Applicable' if not With Guardian
                                            setData('guardian_name', value === 'With Guardian' ? '' : 'Not Applicable');
                                        }}
                                        className="grid gap-3"
                                        disabled={processing}
                                    >
                                        <Label
                                            htmlFor="parents-house"
                                            className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Parent's House" ? 'border-primary bg-muted/50' : ''}`}
                                        >
                                            <RadioGroupItem value="Parent's House" id="parents-house" />
                                            <div className="grid gap-0.5">
                                                <span className="font-medium">Parent's House</span>
                                                <span className="text-sm text-muted-foreground">Living with parents at family residence</span>
                                            </div>
                                        </Label>

                                        <Label
                                            htmlFor="boarding-house"
                                            className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Boarding House" ? 'border-primary bg-muted/50' : ''}`}
                                        >
                                            <RadioGroupItem value="Boarding House" id="boarding-house" />
                                            <div className="grid gap-0.5">
                                                <span className="font-medium">Boarding House</span>
                                                <span className="text-sm text-muted-foreground">Renting a room or apartment near campus</span>
                                            </div>
                                        </Label>

                                        <Label
                                            htmlFor="with-guardian"
                                            className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "With Guardian" ? 'border-primary bg-muted/50' : ''}`}
                                        >
                                            <RadioGroupItem value="With Guardian" id="with-guardian" />
                                            <div className="grid gap-0.5">
                                                <span className="font-medium">With Guardian</span>
                                                <span className="text-sm text-muted-foreground">Living with a legal guardian or relative</span>
                                            </div>
                                        </Label>
                                    </RadioGroup>
                                </div>
                                <InputError message={errors.residence_type} />
                            </div>

                            {data.residence_type === "With Guardian" ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="guardian_name" className="text-base">Guardian's Full Name *</Label>
                                    <Input
                                        id="guardian_name"
                                        type="text"
                                        required
                                        value={data.guardian_name}
                                        onChange={(e) => setData('guardian_name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Complete name of your guardian"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter the complete name of your legal guardian or relative
                                    </p>
                                    <InputError message={errors.guardian_name} />
                                </div>
                            ) : (
                                <Input
                                    type="hidden"
                                    name="guardian_name"
                                    value="Not Applicable"
                                />
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="scholarships" className="text-base">Existing Scholarship/s</Label>
                                <Input
                                    id="scholarships"
                                    type="text"
                                    value={data.scholarships}
                                    onChange={(e) => setData('scholarships', e.target.value)}
                                    disabled={processing}
                                    placeholder="Enter your scholarship/s (if any)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    If you have multiple scholarships, separate them with commas
                                </p>
                                <InputError message={errors.scholarships} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mobile_number" className="text-base">Mobile Number *</Label>
                                <div className="flex">
                                    <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
                                        {VALIDATION.MOBILE_NUMBER.PREFIX}
                                    </div>
                                    <Input
                                        id="mobile_number"
                                        type="tel"
                                        required
                                        tabIndex={11}
                                        className="rounded-l-none"
                                        value={data.mobile_number}
                                        onChange={(e) => {
                                            // Remove any non-digit characters and ensure it doesn't start with 0
                                            let value = e.target.value.replace(/\D/g, '');
                                            if (value.startsWith('0')) value = value.substring(1);
                                            // Limit to VALIDATION.MOBILE_NUMBER.LENGTH digits
                                            if (value.length > VALIDATION.MOBILE_NUMBER.LENGTH) value = value.substring(0, VALIDATION.MOBILE_NUMBER.LENGTH);
                                            // Store just the digits, the prefix will be added when submitting
                                            setData('mobile_number', value);
                                        }}
                                        disabled={processing}
                                        placeholder="9123456789"
                                        maxLength={VALIDATION.MOBILE_NUMBER.LENGTH}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Enter your number without the leading zero</p>
                                <InputError message={errors.mobile_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="telephone_number" className="text-base">Telephone Number</Label>
                                <Input
                                    id="telephone_number"
                                    type="tel"
                                    tabIndex={12}
                                    value={data.telephone_number}
                                    onChange={(e) => setData('telephone_number', e.target.value)}
                                    disabled={processing}
                                    placeholder="Telephone number (optional)"
                                />
                                <InputError message={errors.telephone_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="religion" className="text-base">Religion *</Label>
                                <Select
                                    value={data.religion}
                                    onValueChange={(value) => setData('religion', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger tabIndex={9} id="religion">
                                        <SelectValue placeholder="Select religion" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                        <SelectItem value="None">None</SelectItem>
                                        <SelectItem value="Roman Catholic">Roman Catholic</SelectItem>
                                        <SelectItem value="Islam">Islam</SelectItem>
                                        <SelectItem value="Iglesia ni Cristo">Iglesia ni Cristo</SelectItem>
                                        <SelectItem value="Iglesia Filipina Independiente">Iglesia Filipina Independiente</SelectItem>
                                        <SelectItem value="United Methodist Church">United Methodist Church</SelectItem>
                                        <SelectItem value="Seventh Day Adventist">Seventh Day Adventist</SelectItem>
                                        <SelectItem value="Buddhist">Buddhist</SelectItem>
                                        <SelectItem value="Jehovah's Witness">Jehovah's Witness</SelectItem>
                                        <SelectItem value="United Church of Christ">United Church of Christ</SelectItem>
                                        <SelectItem value="Aglipay">Aglipay</SelectItem>
                                        <SelectItem value="Baptist Conference">Baptist Conference</SelectItem>
                                        <SelectItem value="Bible Baptist Church">Bible Baptist Church</SelectItem>
                                        <SelectItem value="Church of Christ">Church of Christ</SelectItem>
                                        <SelectItem value="Church of Jesus Christ of Latter-Day Saints">Church of Jesus Christ of Latter-Day Saints</SelectItem>
                                        <SelectItem value="Evangelical Presbyterian Church">Evangelical Presbyterian Church</SelectItem>
                                        <SelectItem value="Foursquare Gospel Church">Foursquare Gospel Church</SelectItem>
                                        <SelectItem value="Jesus is Lord Church">Jesus is Lord Church</SelectItem>
                                        <SelectItem value="Lutheran Church">Lutheran Church</SelectItem>
                                        <SelectItem value="Presbyterian Church">Presbyterian Church</SelectItem>
                                        <SelectItem value="Salvation Army">Salvation Army</SelectItem>
                                        <SelectItem value="Southern Baptist Church">Southern Baptist Church</SelectItem>
                                        <SelectItem value="Tribal Religions">Tribal Religions</SelectItem>
                                        <SelectItem value="Alliance of Bible Christian Communities">Alliance of Bible Christian Communities</SelectItem>
                                        <SelectItem value="Assemblies of God">Assemblies of God</SelectItem>
                                        <SelectItem value="Bread of Life Ministries">Bread of Life Ministries</SelectItem>
                                        <SelectItem value="Christian and Missionary Alliance Church">Christian and Missionary Alliance Church</SelectItem>
                                        <SelectItem value="Evangelical Free Church">Evangelical Free Church</SelectItem>
                                        <SelectItem value="Victory Chapel Christian Fellowship">Victory Chapel Christian Fellowship</SelectItem>
                                        <SelectItem value="Word International Ministries">Word International Ministries</SelectItem>
                                        <SelectItem value="Other Evangelical Churches">Other Evangelical Churches</SelectItem>
                                        <SelectItem value="Other Baptist Denominations">Other Baptist Denominations</SelectItem>
                                        <SelectItem value="Other Methodist Denominations">Other Methodist Denominations</SelectItem>
                                        <SelectItem value="Other Protestant Denominations">Other Protestant Denominations</SelectItem>
                                        <SelectItem value="Other Religious Affiliations">Other Religious Affiliations</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.religion} />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-base">Person with Disability (PWD) *</Label>
                                <RadioGroup
                                    value={data.is_pwd}
                                    onValueChange={(value) => setData('is_pwd', value)}
                                    className="flex gap-4"
                                    disabled={processing}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="pwd-yes" />
                                        <Label htmlFor="pwd-yes" className="cursor-pointer">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="pwd-no" />
                                        <Label htmlFor="pwd-no" className="cursor-pointer">No</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.is_pwd} />
                            </div>

                            {data.is_pwd === 'Yes' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="disability_type" className="text-base">Type of Disability *</Label>
                                    <Input
                                        id="disability_type"
                                        type="text"
                                        required
                                        tabIndex={10}
                                        value={data.disability_type}
                                        onChange={(e) => setData('disability_type', e.target.value)}
                                        disabled={processing}
                                        placeholder="Visual Impairment, Hearing Impairment, etc."
                                    />
                                    <InputError message={errors.disability_type} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Academic Information */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="student_id" className="text-base">Student ID *</Label>
                                <Input
                                    id="student_id"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    disabled={processing}
                                    placeholder={VALIDATION.STUDENT_ID.FORMAT}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: {VALIDATION.STUDENT_ID.FORMAT} (e.g., MBC2025-0001)
                                </p>
                                <InputError message={errors.student_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="course" className="text-base">Course *</Label>
                                <Select
                                    value={data.course}
                                    onValueChange={(value) => {
                                        setData('course', value);
                                        // Reset major if not education course
                                        if (value !== "Bachelor of Secondary Education" && value !== "Bachelor of Elementary Education") {
                                            setData('major', 'None');
                                        }
                                    }}
                                    disabled={processing}
                                >
                                    <SelectTrigger tabIndex={2} id="course">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bachelor of Arts in Political Science">Bachelor of Arts in Political Science</SelectItem>
                                        <SelectItem value="Bachelor of Science in Tourism Management">Bachelor of Science in Tourism Management</SelectItem>
                                        <SelectItem value="Bachelor of Science in Hospitality Management">Bachelor of Science in Hospitality Management</SelectItem>
                                        <SelectItem value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</SelectItem>
                                        <SelectItem value="Bachelor of Science in Computer Engineering">Bachelor of Science in Computer Engineering</SelectItem>
                                        <SelectItem value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</SelectItem>
                                        <SelectItem value="Bachelor of Secondary Education">Bachelor of Secondary Education</SelectItem>
                                        <SelectItem value="Bachelor of Elementary Education">Bachelor of Elementary Education</SelectItem>
                                        <SelectItem value="Bachelor of Science in Fisheries">Bachelor of Science in Fisheries</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.course} />
                            </div>

                            {(data.course === "Bachelor of Secondary Education" || data.course === "Bachelor of Elementary Education") && (
                                <div className="grid gap-2">
                                    <Label htmlFor="major" className="text-base">Major *</Label>
                                    <Select
                                        value={data.major || (data.course === "Bachelor of Secondary Education" ? "English" : "General Education")}
                                        onValueChange={(value) => setData('major', value)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger tabIndex={3} id="major">
                                            <SelectValue>
                                                Select a major
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data.course === "Bachelor of Secondary Education" ? (
                                                <>
                                                    <SelectItem value="English">English</SelectItem>
                                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                                    <SelectItem value="Science">Science</SelectItem>
                                                    <SelectItem value="Filipino">Filipino</SelectItem>
                                                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                                                </>
                                            ) : (
                                                <>
                                                    <SelectItem value="General Education">General Education</SelectItem>
                                                    <SelectItem value="Special Education">Special Education</SelectItem>
                                                    <SelectItem value="Pre-School Education">Pre-School Education</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.major} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="year_level" className="text-base">Year Level *</Label>
                                <Select
                                    value={data.year_level}
                                    onValueChange={(value) => setData('year_level', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger tabIndex={3} id="year_level">
                                        <SelectValue placeholder="Select year level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st Year">1st Year</SelectItem>
                                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                                        <SelectItem value="4th Year">4th Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.year_level} />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Account Setup */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-base">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setData('email', value);
                                        // Clear any manually set error if the email is now valid
                                        if (value.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN) && errors.email) {
                                            errors.email = '';
                                        }
                                    }}
                                    disabled={processing}
                                    placeholder="doe.john@minsu.edu.ph"
                                    className={data.email && !data.email.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN) ? 'border-red-500' : ''}
                                />
                                <p className={`text-xs ${data.email && !data.email.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN) ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                    Must be your university email ending with {VALIDATION.EMAIL.DOMAIN}
                                </p>
                                {data.email && !data.email.toLowerCase().endsWith(VALIDATION.EMAIL.DOMAIN) && (
                                    <p className="text-xs text-red-500">Please use your {VALIDATION.EMAIL.DOMAIN} email address</p>
                                )}
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-base">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum {VALIDATION.PASSWORD.MIN_LENGTH} characters with at least one uppercase letter, one lowercase letter,
                                    one number, and one special character ({VALIDATION.PASSWORD.SPECIAL_CHARS})
                                </p>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-base">Confirm Password *</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* CAPTCHA placeholder - would need to be implemented with a real CAPTCHA component */}
                            <div className="border rounded p-4 flex items-center justify-center h-16 bg-muted">
                                <p className="text-muted-foreground text-sm">CAPTCHA verification would appear here</p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review & Submit */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="rounded-lg border p-4 space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm">Personal Information</h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <p className="text-muted-foreground">Name:</p>
                                        <p>{`${data.last_name}, ${data.first_name} ${data.middle_name ? data.middle_name : ''}`}</p>

                                        <p className="text-muted-foreground">Sex:</p>
                                        <p>{data.sex}</p>

                                        <p className="text-muted-foreground">Civil Status:</p>
                                        <p>{data.civil_status}</p>

                                        <p className="text-muted-foreground">Date of Birth:</p>
                                        <p>{new Date(data.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                                        <p className="text-muted-foreground">Place of Birth:</p>
                                        <p>{data.place_of_birth}</p>

                                        <p className="text-muted-foreground">Address:</p>
                                        <p>{`${data.street}, ${data.barangay}, ${data.city}, ${data.province}`}</p>

                                        <p className="text-muted-foreground">Residence Type:</p>
                                        <p>{data.residence_type}</p>

                                        <p className="text-muted-foreground">Guardian Name:</p>
                                        <p>{data.guardian_name}</p>

                                        <p className="text-muted-foreground">Mobile Number:</p>
                                        <p>{data.mobile_number ? `${VALIDATION.MOBILE_NUMBER.PREFIX}${data.mobile_number}` : 'Not provided'}</p>

                                        <p className="text-muted-foreground">Telephone Number:</p>
                                        <p>{data.telephone_number ? `${VALIDATION.MOBILE_NUMBER.PREFIX}${data.telephone_number}` : 'Not provided'}</p>

                                        <p className="text-muted-foreground">Religion:</p>
                                        <p>{data.religion}</p>

                                        <p className="text-muted-foreground">PWD:</p>
                                        <p>{data.is_pwd} {data.is_pwd === 'Yes' && `(${data.disability_type})`}</p>

                                        <p className="text-muted-foreground">Scholarships:</p>
                                        <p>{data.scholarships || 'None'}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-sm">Academic Information</h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <p className="text-muted-foreground">Student ID:</p>
                                        <p>{data.student_id}</p>

                                        <p className="text-muted-foreground">Course:</p>
                                        <p>{data.course}</p>

                                        <p className="text-muted-foreground">Major:</p>
                                        <p>{data.major && data.major !== 'None' ? data.major : 'Not applicable'}</p>

                                        <p className="text-muted-foreground">Year Level:</p>
                                        <p>{data.year_level}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-sm">Account Information</h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <p className="text-muted-foreground">Email:</p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger><p className="truncate">{data.email}</p></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{data.email}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 pt-2">
                                <Checkbox
                                    id="terms_agreement"
                                    checked={data.terms_agreement}
                                    onCheckedChange={(checked) =>
                                        setData('terms_agreement', checked === true)}
                                    disabled={processing}
                                    tabIndex={1}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms_agreement"
                                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the OSAS Connect Terms of Use and Privacy Policy *
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        By checking this box, you agree to our{" "}
                                        <TextLink href="/terms" className="underline">Terms of Use</TextLink> and{" "}
                                        <TextLink href="/privacy" className="underline">Privacy Policy</TextLink>.
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.terms_agreement} />

                            <Button
                                type="submit"
                                className="w-full"
                                tabIndex={2}
                                disabled={processing || !data.terms_agreement}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Create Student Account
                            </Button>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-4">
                        {currentStep > 1 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goToPreviousStep}
                                disabled={processing}
                            >
                                Previous
                            </Button>
                        ) : (
                            <div></div> // Empty div to maintain layout
                        )}

                        {currentStep < totalSteps && (
                            <Button
                                type="button"
                                onClick={goToNextStep}
                                disabled={processing || !validateStep(currentStep)}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={currentStep === totalSteps ? 3 : 4}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
