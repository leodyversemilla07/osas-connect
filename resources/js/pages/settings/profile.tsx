import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
    User, GraduationCap, Info, Home, Users,
    PhilippinePeso, Smartphone, Save
} from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AddressForm from '@/components/address-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoIdUpload } from '@/components/profile/photo-id-upload';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Enhanced utility functions for number handling
class NumberFormatter {
    private static readonly MAX_VALUE = 999999999999;
    private static readonly MIN_VALUE = 0;

    static formatForInput(value: number | null | undefined): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }

        const clampedValue = Math.max(
            this.MIN_VALUE,
            Math.min(this.MAX_VALUE, value)
        );

        return clampedValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            useGrouping: false
        });
    }

    static parseInput(value: string): number {
        if (!value || value.trim() === '') return 0;

        const cleanValue = value.replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleanValue);

        if (isNaN(parsed)) return 0;

        return Math.max(
            this.MIN_VALUE,
            Math.min(this.MAX_VALUE, Math.round(parsed * 100) / 100)
        );
    }
}

// Reusable form field component
interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    description?: string;
    children: React.ReactNode;
}

function FormField({ label, required, error, description, children }: FormFieldProps) {
    return (
        <div className="grid gap-2">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            {children}
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <InputError message={error} />
        </div>
    );
}

// Number input component
interface NumberFieldProps {
    id: string;
    value: number | null | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    readOnly?: boolean;
}

function NumberField({
    id,
    value,
    onChange,
    placeholder,
    min = 0,
    max = 999999999999,
    step = 0.01,
    readOnly = false
}: NumberFieldProps) {
    return (
        <Input
            id={id}
            type="number"
            step={step}
            min={min}
            max={max}
            value={NumberFormatter.formatForInput(value)}
            onChange={(e) => !readOnly && onChange(NumberFormatter.parseInput(e.target.value))}
            placeholder={placeholder}
            readOnly={readOnly}
            className={readOnly ? "bg-muted" : ""}
        />
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileFormData {
    // Basic Information (required for all users)
    photo_id: File | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;

    // Role-specific IDs
    student_id?: string;
    staff_id?: string;
    admin_id?: string;

    // Academic Information
    course?: string;
    major?: string;
    year_level?: string;
    existing_scholarships?: string | null;

    // Personal Information
    civil_status?: string;
    sex?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    street?: string;
    barangay?: string;
    city?: string;
    province?: string;
    mobile_number?: string;
    telephone_number?: string | null;
    is_pwd?: boolean;
    disability_type?: string | null;
    religion?: string;
    residence_type?: string;
    guardian_name?: string | null;

    // Family Background
    status_of_parents?: string | null;

    // Father's Information
    father_name?: string | null;
    father_age?: number | null;
    father_address?: string | null;
    father_telephone?: string | null;
    father_mobile?: string | null;
    father_email?: string | null;
    father_occupation?: string | null;
    father_company?: string | null;
    father_monthly_income?: number | null;
    father_years_service?: number | null;
    father_education?: string | null;
    father_school?: string | null;
    father_unemployment_reason?: string | null;

    // Mother's Information
    mother_name?: string | null;
    mother_age?: number | null;
    mother_address?: string | null;
    mother_telephone?: string | null;
    mother_mobile?: string | null;
    mother_email?: string | null;
    mother_occupation?: string | null;
    mother_company?: string | null;
    mother_monthly_income?: number | null;
    mother_years_service?: number | null;
    mother_education?: string | null;
    mother_school?: string | null;
    mother_unemployment_reason?: string | null;

    // Siblings Information
    total_siblings?: number;
    siblings?: Array<{
        name: string;
        age: number;
        civil_status: string;
        educational_attainment: string;
        occupation: string;
        monthly_income: number;
    }> | null;

    // Income Information
    combined_annual_pay_parents?: number;
    combined_annual_pay_siblings?: number;
    income_from_business?: number;
    income_from_land_rentals?: number;
    income_from_building_rentals?: number;
    retirement_benefits_pension?: number;
    commissions?: number;
    support_from_relatives?: number;
    bank_deposits?: number;
    other_income_description?: string | null;
    other_income_amount?: number;
    total_annual_income?: number;

    // Appliances
    has_tv?: boolean;
    has_radio_speakers_karaoke?: boolean;
    has_musical_instruments?: boolean;
    has_computer?: boolean;
    has_stove?: boolean;
    has_laptop?: boolean;
    has_refrigerator?: boolean;
    has_microwave?: boolean;
    has_air_conditioner?: boolean;
    has_electric_fan?: boolean;
    has_washing_machine?: boolean;
    has_cellphone?: boolean;
    has_gaming_box?: boolean;
    has_dslr_camera?: boolean;

    // Monthly Expenses
    house_rental?: number;
    food_grocery?: number;
    car_loan_details?: string | null;
    other_loan_details?: string | null;
    school_bus_payment?: number;
    transportation_expense?: number;
    education_plan_premiums?: number;
    insurance_policy_premiums?: number;
    health_insurance_premium?: number;
    sss_gsis_pagibig_loans?: number;
    clothing_expense?: number;
    utilities_expense?: number;
    communication_expense?: number;
    helper_details?: string | null;
    driver_details?: string | null;
    medicine_expense?: number;
    doctor_expense?: number;
    hospital_expense?: number;
    recreation_expense?: number;
    other_monthly_expense_details?: string | null;
    total_monthly_expenses?: number;
    annualized_monthly_expenses?: number;

    // Annual Expenses
    school_tuition_fee?: number;
    withholding_tax?: number;
    sss_gsis_pagibig_contribution?: number;
    other_annual_expense_details?: string | null;
    subtotal_annual_expenses?: number;
    total_annual_expenses?: number;

    [key: string]: string | number | boolean | File | Blob | Date | null | undefined | Array<string | number | boolean | null | undefined> | Array<{ [key: string]: string | number }> | null;
}

export default function Profile({
    photoUrl,
    profile
}: {
    photoUrl?: string;
    profile: ProfileFormData;
    mustVerifyEmail?: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const isStudent = auth.user.role === 'student';

    const initialData = useMemo(() => {
        // Helper function for safe data extraction
        const safeString = (value: unknown, fallback: string = ''): string => {
            if (value === null || value === undefined) return fallback;
            return String(value).trim() || fallback;
        };

        const safeNumber = (value: unknown, fallback: number = 0): number => {
            if (value === null || value === undefined || isNaN(Number(value))) return fallback;
            return Number(value);
        };

        const safeBoolean = (value: unknown, fallback: boolean = false): boolean => {
            if (value === null || value === undefined) return fallback;
            return Boolean(value);
        };

        const safeNullableString = (value: unknown, fallback: string | null = null): string | null => {
            if (value === null || value === undefined) return fallback;
            const str = String(value).trim();
            return str === '' ? fallback : str;
        };

        const safeDate = (value: unknown, fallback: string = ''): string => {
            if (value === null || value === undefined) return fallback;
            const dateStr = String(value).trim();
            // Handle different date formats
            if (dateStr && dateStr !== '') {
                try {
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime())) {
                        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                    }
                } catch {
                    // Invalid date, return fallback
                }
            }
            return fallback;
        };

        return {
            // Basic Information with better fallbacks
            photo_id: null,
            first_name: safeString(profile.first_name, auth.user.first_name || ''),
            middle_name: profile.middle_name || auth.user.middle_name || null,
            last_name: safeString(profile.last_name, auth.user.last_name || ''),
            email: safeString(profile.email, auth.user.email || ''),

            // Role-specific fields with better handling
            student_id: safeString(profile.student_id,
                auth.user.role === 'student' ? auth.user.student_profile?.student_id || '' : ''
            ),
            staff_id: safeString(profile.staff_id,
                auth.user.role === 'osas_staff' ? auth.user.osas_staff_profile?.staff_id || '' : ''
            ),
            admin_id: safeString(profile.admin_id,
                auth.user.role === 'admin' ? (auth.user.admin_profile?.admin_id || auth.user.id?.toString()) || '' : ''
            ),

            // Student-specific data
            ...(isStudent && {
                course: safeString(profile.course),
                major: safeString(profile.major),
                year_level: safeString(profile.year_level),
                existing_scholarships: safeNullableString(profile.existing_scholarships),

                // Personal Information
                civil_status: safeString(profile.civil_status),
                sex: safeString(profile.sex),
                date_of_birth: safeDate(profile.date_of_birth),
                place_of_birth: safeString(profile.place_of_birth),
                street: safeString(profile.street),
                barangay: safeString(profile.barangay),
                city: safeString(profile.city),
                province: safeString(profile.province),
                mobile_number: safeString(profile.mobile_number),
                telephone_number: safeNullableString(profile.telephone_number),
                is_pwd: safeBoolean(profile.is_pwd),
                disability_type: safeNullableString(profile.disability_type),
                religion: safeString(profile.religion),
                residence_type: safeString(profile.residence_type),
                guardian_name: safeNullableString(profile.guardian_name),

                // Family Background
                status_of_parents: safeNullableString(profile.status_of_parents),

                // Father's Information
                father_name: safeNullableString(profile.father_name),
                father_age: profile.father_age ?? null,
                father_address: safeNullableString(profile.father_address),
                father_telephone: safeNullableString(profile.father_telephone),
                father_mobile: safeNullableString(profile.father_mobile),
                father_email: safeNullableString(profile.father_email),
                father_occupation: safeNullableString(profile.father_occupation),
                father_company: safeNullableString(profile.father_company),
                father_monthly_income: profile.father_monthly_income ?? null,
                father_years_service: profile.father_years_service ?? null,
                father_education: safeNullableString(profile.father_education),
                father_school: safeNullableString(profile.father_school),
                father_unemployment_reason: safeNullableString(profile.father_unemployment_reason),

                // Mother's Information
                mother_name: safeNullableString(profile.mother_name),
                mother_age: profile.mother_age ?? null,
                mother_address: safeNullableString(profile.mother_address),
                mother_telephone: safeNullableString(profile.mother_telephone),
                mother_mobile: safeNullableString(profile.mother_mobile),
                mother_email: safeNullableString(profile.mother_email),
                mother_occupation: safeNullableString(profile.mother_occupation),
                mother_company: safeNullableString(profile.mother_company),
                mother_monthly_income: profile.mother_monthly_income ?? null,
                mother_years_service: profile.mother_years_service ?? null,
                mother_education: safeNullableString(profile.mother_education),
                mother_school: safeNullableString(profile.mother_school),
                mother_unemployment_reason: safeNullableString(profile.mother_unemployment_reason),

                // Siblings Information
                total_siblings: safeNumber(profile.total_siblings),
                siblings: profile.siblings ?? null,

                // Income Information
                combined_annual_pay_parents: safeNumber(profile.combined_annual_pay_parents),
                combined_annual_pay_siblings: safeNumber(profile.combined_annual_pay_siblings),
                income_from_business: safeNumber(profile.income_from_business),
                income_from_land_rentals: safeNumber(profile.income_from_land_rentals),
                income_from_building_rentals: safeNumber(profile.income_from_building_rentals),
                retirement_benefits_pension: safeNumber(profile.retirement_benefits_pension),
                commissions: safeNumber(profile.commissions),
                support_from_relatives: safeNumber(profile.support_from_relatives),
                bank_deposits: safeNumber(profile.bank_deposits),
                other_income_description: safeNullableString(profile.other_income_description),
                other_income_amount: safeNumber(profile.other_income_amount),
                total_annual_income: safeNumber(profile.total_annual_income),

                // Appliances
                has_tv: safeBoolean(profile.has_tv),
                has_radio_speakers_karaoke: safeBoolean(profile.has_radio_speakers_karaoke),
                has_musical_instruments: safeBoolean(profile.has_musical_instruments),
                has_computer: safeBoolean(profile.has_computer),
                has_stove: safeBoolean(profile.has_stove),
                has_laptop: safeBoolean(profile.has_laptop),
                has_refrigerator: safeBoolean(profile.has_refrigerator),
                has_microwave: safeBoolean(profile.has_microwave),
                has_air_conditioner: safeBoolean(profile.has_air_conditioner),
                has_electric_fan: safeBoolean(profile.has_electric_fan),
                has_washing_machine: safeBoolean(profile.has_washing_machine),
                has_cellphone: safeBoolean(profile.has_cellphone),
                has_gaming_box: safeBoolean(profile.has_gaming_box),
                has_dslr_camera: safeBoolean(profile.has_dslr_camera),

                // Monthly Expenses
                house_rental: safeNumber(profile.house_rental),
                food_grocery: safeNumber(profile.food_grocery),
                car_loan_details: safeNullableString(profile.car_loan_details),
                other_loan_details: safeNullableString(profile.other_loan_details),
                school_bus_payment: safeNumber(profile.school_bus_payment),
                transportation_expense: safeNumber(profile.transportation_expense),
                education_plan_premiums: safeNumber(profile.education_plan_premiums),
                insurance_policy_premiums: safeNumber(profile.insurance_policy_premiums),
                health_insurance_premium: safeNumber(profile.health_insurance_premium),
                sss_gsis_pagibig_loans: safeNumber(profile.sss_gsis_pagibig_loans),
                clothing_expense: safeNumber(profile.clothing_expense),
                utilities_expense: safeNumber(profile.utilities_expense),
                communication_expense: safeNumber(profile.communication_expense),
                helper_details: safeNullableString(profile.helper_details),
                driver_details: safeNullableString(profile.driver_details),
                medicine_expense: safeNumber(profile.medicine_expense),
                doctor_expense: safeNumber(profile.doctor_expense),
                hospital_expense: safeNumber(profile.hospital_expense),
                recreation_expense: safeNumber(profile.recreation_expense),
                other_monthly_expense_details: safeNullableString(profile.other_monthly_expense_details),
                total_monthly_expenses: safeNumber(profile.total_monthly_expenses),
                annualized_monthly_expenses: safeNumber(profile.annualized_monthly_expenses),

                // Annual Expenses
                school_tuition_fee: safeNumber(profile.school_tuition_fee),
                withholding_tax: safeNumber(profile.withholding_tax),
                sss_gsis_pagibig_contribution: safeNumber(profile.sss_gsis_pagibig_contribution),
                other_annual_expense_details: safeNullableString(profile.other_annual_expense_details),
                subtotal_annual_expenses: safeNumber(profile.subtotal_annual_expenses),
                total_annual_expenses: safeNumber(profile.total_annual_expenses),
            })
        };
    }, [profile, auth.user, isStudent]);

    const { data, setData, errors, processing, progress } = useForm<ProfileFormData>(initialData);

    // Auto-calculate totals when relevant fields change
    useEffect(() => {
        if (isStudent) {
            const totalIncome = (data.combined_annual_pay_parents || 0) +
                (data.combined_annual_pay_siblings || 0) +
                (data.income_from_business || 0) +
                (data.income_from_land_rentals || 0) +
                (data.income_from_building_rentals || 0) +
                (data.retirement_benefits_pension || 0) +
                (data.commissions || 0) +
                (data.support_from_relatives || 0) +
                (data.bank_deposits || 0) +
                (data.other_income_amount || 0);

            if (data.total_annual_income !== totalIncome) {
                setData('total_annual_income', totalIncome);
            }

            const totalMonthlyExpenses = (data.house_rental || 0) +
                (data.food_grocery || 0) +
                (data.school_bus_payment || 0) +
                (data.transportation_expense || 0) +
                (data.education_plan_premiums || 0) +
                (data.insurance_policy_premiums || 0) +
                (data.health_insurance_premium || 0) +
                (data.sss_gsis_pagibig_loans || 0) +
                (data.clothing_expense || 0) +
                (data.utilities_expense || 0) +
                (data.communication_expense || 0) +
                (data.medicine_expense || 0) +
                (data.doctor_expense || 0) +
                (data.hospital_expense || 0) +
                (data.recreation_expense || 0);

            if (data.total_monthly_expenses !== totalMonthlyExpenses) {
                setData('total_monthly_expenses', totalMonthlyExpenses);
            }

            const annualizedMonthlyExpenses = totalMonthlyExpenses * 12;
            if (data.annualized_monthly_expenses !== annualizedMonthlyExpenses) {
                setData('annualized_monthly_expenses', annualizedMonthlyExpenses);
            }

            const totalAnnualExpenses = annualizedMonthlyExpenses +
                (data.school_tuition_fee || 0) +
                (data.withholding_tax || 0) +
                (data.sss_gsis_pagibig_contribution || 0) +
                (data.subtotal_annual_expenses || 0);

            if (data.total_annual_expenses !== totalAnnualExpenses) {
                setData('total_annual_expenses', totalAnnualExpenses);
            }
        }
    }, [
        data.combined_annual_pay_parents,
        data.combined_annual_pay_siblings,
        data.income_from_business,
        data.income_from_land_rentals,
        data.income_from_building_rentals,
        data.retirement_benefits_pension,
        data.commissions,
        data.support_from_relatives,
        data.bank_deposits,
        data.other_income_amount,
        data.house_rental,
        data.food_grocery,
        data.school_bus_payment,
        data.transportation_expense,
        data.education_plan_premiums,
        data.insurance_policy_premiums,
        data.health_insurance_premium,
        data.sss_gsis_pagibig_loans,
        data.clothing_expense,
        data.utilities_expense,
        data.communication_expense,
        data.medicine_expense,
        data.doctor_expense,
        data.hospital_expense,
        data.recreation_expense,
        data.school_tuition_fee,
        data.withholding_tax,
        data.sss_gsis_pagibig_contribution,
        data.subtotal_annual_expenses,
        isStudent,
        data.total_annual_income,
        data.total_monthly_expenses,
        data.annualized_monthly_expenses,
        data.total_annual_expenses,
        setData
    ]);

    const getRoleIdField = useCallback(() => {
        switch (auth.user.role) {
            case 'student': return 'student_id';
            case 'osas_staff': return 'staff_id';
            case 'admin': return 'admin_id';
            default: return 'student_id';
        }
    }, [auth.user.role]);

    const getRoleDisplayName = useCallback(() => {
        switch (auth.user.role) {
            case 'student': return 'Student ID';
            case 'osas_staff': return 'Staff ID';
            case 'admin': return 'Admin ID';
            default: return 'ID';
        }
    }, [auth.user.role]);

    // ✅ FIXED: Proper form submission with FormData handling
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Process data
        const processedData = {
            ...data,
            first_name: data.first_name?.trim() || '',
            last_name: data.last_name?.trim() || '',
            middle_name: data.middle_name?.trim() || null,
            email: data.email?.trim() || '',
        };

        // Validate required fields
        const validationErrors: string[] = [];

        if (!processedData.first_name) validationErrors.push('First name is required');
        if (!processedData.last_name) validationErrors.push('Last name is required');
        if (!processedData.email) validationErrors.push('Email is required');

        if (validationErrors.length > 0) {
            toast.error(validationErrors.join(', '));
            return;
        }

        // Prepare submission data
        let submitData: Partial<ProfileFormData> & { _method?: string }; // Add _method to type

        if (auth.user.role === 'admin') {
            submitData = {
                _method: 'PATCH', // Add this
                photo_id: processedData.photo_id,
                first_name: processedData.first_name,
                middle_name: processedData.middle_name,
                last_name: processedData.last_name,
                email: processedData.email,
                admin_id: processedData.admin_id || auth.user.id?.toString()
            };
        } else if (auth.user.role === 'osas_staff') {
            submitData = {
                _method: 'PATCH', // Add this
                photo_id: processedData.photo_id,
                first_name: processedData.first_name,
                middle_name: processedData.middle_name,
                last_name: processedData.last_name,
                email: processedData.email,
                staff_id: processedData.staff_id
            };
        } else { // student
            submitData = {
                _method: 'PATCH', // Add this
                ...processedData
            };
        }

        // ✅ KEY FIX: Only use FormData if there's actually a file
        const hasFile = submitData.photo_id instanceof File;

        console.log('=== SUBMISSION DEBUG ===');
        console.log('Has file:', hasFile);
        console.log('Will use FormData:', hasFile);
        console.log('Submit data:', submitData);

        router.post(route('profile.update'), submitData, { // Changed to router.post
            // ✅ KEY FIX: Only use FormData if there's actually a file
            // forceFormData: hasFile, // Removed to rely on Inertia's automatic FormData detection
            preserveScroll: true,
            onBefore: () => {
                console.log('Submitting with FormData:', hasFile);
            },
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: (serverErrors) => {
                console.error('Server validation errors:', serverErrors);

                const errorMessages = Object.entries(serverErrors).map(([field, message]) => {
                    const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return `${fieldName}: ${message}`;
                });

                toast.error(`Validation failed:\n${errorMessages.join('\n')}`, {
                    duration: 10000
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                {/* ✅ REMOVED encType - Inertia handles this automatically */}
                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Information Section - Always visible */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                            <CardDescription>Your core identity details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="First Name" required error={errors.first_name}>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        autoComplete="given-name"
                                        placeholder="Enter your first name"
                                    />
                                </FormField>

                                <FormField label="Last Name" required error={errors.last_name}>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                        autoComplete="family-name"
                                        placeholder="Enter your last name"
                                    />
                                </FormField>
                            </div>

                            <FormField label="Middle Name" error={errors.middle_name}>
                                <Input
                                    id="middle_name"
                                    value={data.middle_name ?? ''}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    autoComplete="additional-name"
                                    placeholder="Enter your middle name (if any)"
                                />
                            </FormField>

                            <FormField label="Email" required error={errors.email}>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="Enter your email address"
                                />
                            </FormField>

                            <FormField
                                label={getRoleDisplayName()}
                                required
                                error={errors[getRoleIdField()]}
                            >
                                <Input
                                    id={getRoleIdField()}
                                    value={data[getRoleIdField() as keyof ProfileFormData] as string}
                                    disabled
                                    className="bg-muted"
                                />
                            </FormField>

                            <FormField
                                label="1x1 ID Photo"
                                description="Upload a recent 1x1 ID picture with white background"
                                error={errors.photo_id}
                            >
                                <PhotoIdUpload
                                    onChange={(file) => setData('photo_id', file)}
                                    existingPhotoUrl={photoUrl}
                                />
                                {progress && (
                                    <progress
                                        value={progress.percentage}
                                        max="100"
                                        className="w-full h-2"
                                    >
                                        {progress.percentage}%
                                    </progress>
                                )}
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Student-specific sections */}
                    {isStudent && (
                        <>
                            {/* Academic Information */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                        <CardTitle>Academic Information</CardTitle>
                                    </div>
                                    <CardDescription>Your academic details and status</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Course" required error={errors.course}>
                                            <Input
                                                id="course"
                                                value={data.course}
                                                onChange={(e) => setData('course', e.target.value)}
                                                required
                                                placeholder="Enter your course"
                                            />
                                        </FormField>

                                        <FormField label="Major/Specialization" error={errors.major}>
                                            <Input
                                                id="major"
                                                value={data.major}
                                                onChange={(e) => setData('major', e.target.value)}
                                                placeholder="Enter your specialization (if any)"
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Year Level" required error={errors.year_level}>
                                            <Select
                                                value={data.year_level}
                                                onValueChange={(value) => setData('year_level', value)}
                                            >
                                                <SelectTrigger id="year_level">
                                                    <SelectValue placeholder="Select your year level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField
                                            label="Existing Scholarship/s"
                                            error={errors.existing_scholarships}
                                            description="If you have multiple scholarships, separate them with commas"
                                        >
                                            <Input
                                                id="existing_scholarships"
                                                value={data.existing_scholarships ?? ''}
                                                onChange={(e) => setData('existing_scholarships', e.target.value)}
                                                placeholder="Enter your scholarship/s (if any)"
                                            />
                                        </FormField>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Personal Information */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        <CardTitle>Personal Information</CardTitle>
                                    </div>
                                    <CardDescription>Your personal details and background</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Sex" required error={errors.sex}>
                                            <Select
                                                value={data.sex}
                                                onValueChange={(value) => setData('sex', value)}
                                            >
                                                <SelectTrigger id="sex">
                                                    <SelectValue placeholder="Select sex" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField label="Civil Status" required error={errors.civil_status}>
                                            <Select
                                                value={data.civil_status}
                                                onValueChange={(value) => setData('civil_status', value)}
                                            >
                                                <SelectTrigger id="civil_status">
                                                    <SelectValue placeholder="Select civil status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Single">Single</SelectItem>
                                                    <SelectItem value="Married">Married</SelectItem>
                                                    <SelectItem value="Separated">Separated</SelectItem>
                                                    <SelectItem value="Widowed">Widowed</SelectItem>
                                                    <SelectItem value="Annulled">Annulled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Date of Birth" required error={errors.date_of_birth}>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                required
                                            />
                                        </FormField>

                                        <FormField label="Place of Birth" required error={errors.place_of_birth}>
                                            <Input
                                                id="place_of_birth"
                                                value={data.place_of_birth}
                                                onChange={(e) => setData('place_of_birth', e.target.value)}
                                                required
                                                placeholder="Enter your place of birth"
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Mobile Number" required error={errors.mobile_number}>
                                            <Input
                                                id="mobile_number"
                                                type="tel"
                                                value={data.mobile_number}
                                                onChange={(e) => setData('mobile_number', e.target.value)}
                                                required
                                                placeholder="Enter your mobile number"
                                            />
                                        </FormField>

                                        <FormField label="Telephone Number" error={errors.telephone_number}>
                                            <Input
                                                id="telephone_number"
                                                type="tel"
                                                value={data.telephone_number ?? ''}
                                                onChange={(e) => setData('telephone_number', e.target.value)}
                                                placeholder="Enter your telephone number (if any)"
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Religion" error={errors.religion}>
                                            <Input
                                                id="religion"
                                                value={data.religion}
                                                onChange={(e) => setData('religion', e.target.value)}
                                                placeholder="Enter your religion"
                                            />
                                        </FormField>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_pwd"
                                                checked={data.is_pwd}
                                                onCheckedChange={(checked) => setData('is_pwd', checked as boolean)}
                                            />
                                            <Label htmlFor="is_pwd">Person with Disability (PWD)</Label>
                                        </div>
                                    </div>

                                    {data.is_pwd && (
                                        <FormField label="Disability Type" error={errors.disability_type}>
                                            <Input
                                                id="disability_type"
                                                value={data.disability_type ?? ''}
                                                onChange={(e) => setData('disability_type', e.target.value)}
                                                placeholder="Enter type of disability"
                                            />
                                        </FormField>
                                    )}

                                    <Separator />

                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Home className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold">Current Address</h3>
                                        </div>

                                        <AddressForm
                                            data={{
                                                street: data.street ?? '',
                                                barangay: data.barangay ?? '',
                                                city: data.city ?? '',
                                                province: data.province ?? '',
                                            }}
                                            setData={(field, value) => setData(field as keyof ProfileFormData, value)}
                                            errors={{
                                                street: errors.street ?? '',
                                                barangay: errors.barangay ?? '',
                                                city: errors.city ?? '',
                                                province: errors.province ?? ''
                                            }}
                                            processing={processing}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <FormField label="Type of Residence" required error={errors.residence_type}>
                                                <Select
                                                    value={data.residence_type}
                                                    onValueChange={(value) => {
                                                        setData('residence_type', value);
                                                        if (value !== 'With Guardian') {
                                                            setData('guardian_name', null);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger id="residence_type">
                                                        <SelectValue placeholder="Select type of residence" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Parent's House">Parent's House</SelectItem>
                                                        <SelectItem value="Boarding House">Boarding House</SelectItem>
                                                        <SelectItem value="With Guardian">With Guardian</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormField>

                                            {data.residence_type === 'With Guardian' && (
                                                <FormField label="Guardian's Name" required error={errors.guardian_name}>
                                                    <Input
                                                        id="guardian_name"
                                                        value={data.guardian_name?.toString() || ''}
                                                        onChange={(e) => setData('guardian_name', e.target.value)}
                                                        required
                                                        placeholder="Enter guardian's name"
                                                    />
                                                </FormField>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Family Background */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <CardTitle>Family Background</CardTitle>
                                    </div>
                                    <CardDescription>Information about your family members</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField label="Status of Parents" error={errors.status_of_parents}>
                                        <Select
                                            value={data.status_of_parents ?? ''}
                                            onValueChange={(value) => setData('status_of_parents', value)}
                                        >
                                            <SelectTrigger id="status_of_parents">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Living Together">Living Together</SelectItem>
                                                <SelectItem value="Separated">Separated</SelectItem>
                                                <SelectItem value="Father Deceased">Father Deceased</SelectItem>
                                                <SelectItem value="Mother Deceased">Mother Deceased</SelectItem>
                                                <SelectItem value="Both Deceased">Both Deceased</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    {/* Father's Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <Label className="text-base font-semibold">Father's Information</Label>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="father_name"
                                                    placeholder="Father's Name"
                                                    value={data.father_name ?? ''}
                                                    onChange={(e) => setData('father_name', e.target.value)}
                                                />
                                                <Input
                                                    id="father_age"
                                                    type="number"
                                                    placeholder="Age"
                                                    value={data.father_age ?? ''}
                                                    onChange={(e) => setData('father_age', parseInt(e.target.value) || null)}
                                                />
                                            </div>
                                            <Input
                                                id="father_address"
                                                placeholder="Complete Address"
                                                value={data.father_address ?? ''}
                                                onChange={(e) => setData('father_address', e.target.value)}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="father_telephone"
                                                    placeholder="Telephone Number"
                                                    value={data.father_telephone ?? ''}
                                                    onChange={(e) => setData('father_telephone', e.target.value)}
                                                />
                                                <Input
                                                    id="father_mobile"
                                                    placeholder="Mobile Number"
                                                    value={data.father_mobile ?? ''}
                                                    onChange={(e) => setData('father_mobile', e.target.value)}
                                                />
                                            </div>
                                            <Input
                                                id="father_email"
                                                type="email"
                                                placeholder="Email Address"
                                                value={data.father_email ?? ''}
                                                onChange={(e) => setData('father_email', e.target.value)}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="father_occupation"
                                                    placeholder="Occupation"
                                                    value={data.father_occupation ?? ''}
                                                    onChange={(e) => setData('father_occupation', e.target.value)}
                                                />
                                                <Input
                                                    id="father_company"
                                                    placeholder="Company Name"
                                                    value={data.father_company ?? ''}
                                                    onChange={(e) => setData('father_company', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <NumberField
                                                    id="father_monthly_income"
                                                    value={data.father_monthly_income}
                                                    onChange={(value) => setData('father_monthly_income', value)}
                                                    placeholder="Monthly Income"
                                                />
                                                <Input
                                                    id="father_years_service"
                                                    type="number"
                                                    placeholder="Years of Service"
                                                    value={data.father_years_service ?? ''}
                                                    onChange={(e) => setData('father_years_service', parseInt(e.target.value) || null)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="father_education"
                                                    placeholder="Educational Attainment"
                                                    value={data.father_education ?? ''}
                                                    onChange={(e) => setData('father_education', e.target.value)}
                                                />
                                                <Input
                                                    id="father_school"
                                                    placeholder="School Attended"
                                                    value={data.father_school ?? ''}
                                                    onChange={(e) => setData('father_school', e.target.value)}
                                                />
                                            </div>
                                            <Input
                                                id="father_unemployment_reason"
                                                placeholder="Reason for Unemployment (if applicable)"
                                                value={data.father_unemployment_reason ?? ''}
                                                onChange={(e) => setData('father_unemployment_reason', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Mother's Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <Label className="text-base font-semibold">Mother's Information</Label>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="mother_name"
                                                    placeholder="Mother's Name"
                                                    value={data.mother_name ?? ''}
                                                    onChange={(e) => setData('mother_name', e.target.value)}
                                                />
                                                <Input
                                                    id="mother_age"
                                                    type="number"
                                                    placeholder="Age"
                                                    value={data.mother_age ?? ''}
                                                    onChange={(e) => setData('mother_age', parseInt(e.target.value) || null)}
                                                />
                                            </div>
                                            <Input
                                                id="mother_address"
                                                placeholder="Complete Address"
                                                value={data.mother_address ?? ''}
                                                onChange={(e) => setData('mother_address', e.target.value)}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="mother_telephone"
                                                    placeholder="Telephone Number"
                                                    value={data.mother_telephone ?? ''}
                                                    onChange={(e) => setData('mother_telephone', e.target.value)}
                                                />
                                                <Input
                                                    id="mother_mobile"
                                                    placeholder="Mobile Number"
                                                    value={data.mother_mobile ?? ''}
                                                    onChange={(e) => setData('mother_mobile', e.target.value)}
                                                />
                                            </div>
                                            <Input
                                                id="mother_email"
                                                type="email"
                                                placeholder="Email Address"
                                                value={data.mother_email ?? ''}
                                                onChange={(e) => setData('mother_email', e.target.value)}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="mother_occupation"
                                                    placeholder="Occupation"
                                                    value={data.mother_occupation ?? ''}
                                                    onChange={(e) => setData('mother_occupation', e.target.value)}
                                                />
                                                <Input
                                                    id="mother_company"
                                                    placeholder="Company Name"
                                                    value={data.mother_company ?? ''}
                                                    onChange={(e) => setData('mother_company', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <NumberField
                                                    id="mother_monthly_income"
                                                    value={data.mother_monthly_income}
                                                    onChange={(value) => setData('mother_monthly_income', value)}
                                                    placeholder="Monthly Income"
                                                />
                                                <Input
                                                    id="mother_years_service"
                                                    type="number"
                                                    placeholder="Years of Service"
                                                    value={data.mother_years_service ?? ''}
                                                    onChange={(e) => setData('mother_years_service', parseInt(e.target.value) || null)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    id="mother_education"
                                                    placeholder="Educational Attainment"
                                                    value={data.mother_education ?? ''}
                                                    onChange={(e) => setData('mother_education', e.target.value)}
                                                />
                                                <Input
                                                    id="mother_school"
                                                    placeholder="School Attended"
                                                    value={data.mother_school ?? ''}
                                                    onChange={(e) => setData('mother_school', e.target.value)}
                                                />
                                            </div>
                                            <Input
                                                id="mother_unemployment_reason"
                                                placeholder="Reason for Unemployment (if applicable)"
                                                value={data.mother_unemployment_reason ?? ''}
                                                onChange={(e) => setData('mother_unemployment_reason', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Siblings Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-primary" />
                                            <Label className="text-base font-semibold">Siblings Information</Label>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <FormField label="Number of Siblings" error={errors.total_siblings}>
                                                <Input
                                                    id="total_siblings"
                                                    type="number"
                                                    min="0"
                                                    value={data.total_siblings}
                                                    onChange={(e) => setData('total_siblings', parseInt(e.target.value) || 0)}
                                                    placeholder="Enter number of siblings"
                                                />
                                            </FormField>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Financial Information */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="h-5 w-5 text-primary" />
                                        <CardTitle>Financial Information</CardTitle>
                                    </div>
                                    <CardDescription>Details about your household's income and expenses</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Income Sources */}
                                    <div className="space-y-4">
                                        <CardTitle className="text-lg">Income Sources</CardTitle>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Parents' Combined Annual Income" error={errors.combined_annual_pay_parents}>
                                                    <NumberField
                                                        id="combined_annual_pay_parents"
                                                        value={data.combined_annual_pay_parents}
                                                        onChange={(value) => setData('combined_annual_pay_parents', value)}
                                                        placeholder="Enter parents' combined annual income"
                                                    />
                                                </FormField>

                                                <FormField label="Siblings' Combined Annual Income" error={errors.combined_annual_pay_siblings}>
                                                    <NumberField
                                                        id="combined_annual_pay_siblings"
                                                        value={data.combined_annual_pay_siblings}
                                                        onChange={(value) => setData('combined_annual_pay_siblings', value)}
                                                        placeholder="Enter siblings' combined annual income"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Income from Business" error={errors.income_from_business}>
                                                    <NumberField
                                                        id="income_from_business"
                                                        value={data.income_from_business}
                                                        onChange={(value) => setData('income_from_business', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Income from Land Rentals" error={errors.income_from_land_rentals}>
                                                    <NumberField
                                                        id="income_from_land_rentals"
                                                        value={data.income_from_land_rentals}
                                                        onChange={(value) => setData('income_from_land_rentals', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Income from Building Rentals" error={errors.income_from_building_rentals}>
                                                    <NumberField
                                                        id="income_from_building_rentals"
                                                        value={data.income_from_building_rentals}
                                                        onChange={(value) => setData('income_from_building_rentals', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Retirement Benefits/Pension" error={errors.retirement_benefits_pension}>
                                                    <NumberField
                                                        id="retirement_benefits_pension"
                                                        value={data.retirement_benefits_pension}
                                                        onChange={(value) => setData('retirement_benefits_pension', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Commissions" error={errors.commissions}>
                                                    <NumberField
                                                        id="commissions"
                                                        value={data.commissions}
                                                        onChange={(value) => setData('commissions', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Support from Relatives" error={errors.support_from_relatives}>
                                                    <NumberField
                                                        id="support_from_relatives"
                                                        value={data.support_from_relatives}
                                                        onChange={(value) => setData('support_from_relatives', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Bank Deposits" error={errors.bank_deposits}>
                                                    <NumberField
                                                        id="bank_deposits"
                                                        value={data.bank_deposits}
                                                        onChange={(value) => setData('bank_deposits', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Other Income Description" error={errors.other_income_description}>
                                                    <Input
                                                        id="other_income_description"
                                                        value={data.other_income_description ?? ''}
                                                        onChange={(e) => setData('other_income_description', e.target.value)}
                                                        placeholder="Enter description"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Other Income Amount" error={errors.other_income_amount}>
                                                    <NumberField
                                                        id="other_income_amount"
                                                        value={data.other_income_amount}
                                                        onChange={(value) => setData('other_income_amount', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Total Annual Income" error={errors.total_annual_income}>
                                                    <NumberField
                                                        id="total_annual_income"
                                                        value={data.total_annual_income}
                                                        onChange={() => { }} // Read-only
                                                        readOnly
                                                    />
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Monthly Expenses */}
                                    <div className="space-y-4">
                                        <CardTitle className="text-lg">Monthly Expenses</CardTitle>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Monthly House Rental" error={errors.house_rental}>
                                                    <NumberField
                                                        id="house_rental"
                                                        value={data.house_rental}
                                                        onChange={(value) => setData('house_rental', value)}
                                                        placeholder="Enter monthly house rental"
                                                    />
                                                </FormField>

                                                <FormField label="Food and Grocery Expenses" error={errors.food_grocery}>
                                                    <NumberField
                                                        id="food_grocery"
                                                        value={data.food_grocery}
                                                        onChange={(value) => setData('food_grocery', value)}
                                                        placeholder="Enter food and grocery expenses"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Transportation Expense" error={errors.transportation_expense}>
                                                    <NumberField
                                                        id="transportation_expense"
                                                        value={data.transportation_expense}
                                                        onChange={(value) => setData('transportation_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="School Bus Payment" error={errors.school_bus_payment}>
                                                    <NumberField
                                                        id="school_bus_payment"
                                                        value={data.school_bus_payment}
                                                        onChange={(value) => setData('school_bus_payment', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Education Plan Premiums" error={errors.education_plan_premiums}>
                                                    <NumberField
                                                        id="education_plan_premiums"
                                                        value={data.education_plan_premiums}
                                                        onChange={(value) => setData('education_plan_premiums', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Insurance Policy Premiums" error={errors.insurance_policy_premiums}>
                                                    <NumberField
                                                        id="insurance_policy_premiums"
                                                        value={data.insurance_policy_premiums}
                                                        onChange={(value) => setData('insurance_policy_premiums', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Health Insurance Premium" error={errors.health_insurance_premium}>
                                                    <NumberField
                                                        id="health_insurance_premium"
                                                        value={data.health_insurance_premium}
                                                        onChange={(value) => setData('health_insurance_premium', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="SSS/GSIS/Pag-IBIG Loans" error={errors.sss_gsis_pagibig_loans}>
                                                    <NumberField
                                                        id="sss_gsis_pagibig_loans"
                                                        value={data.sss_gsis_pagibig_loans}
                                                        onChange={(value) => setData('sss_gsis_pagibig_loans', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Clothing Expense" error={errors.clothing_expense}>
                                                    <NumberField
                                                        id="clothing_expense"
                                                        value={data.clothing_expense}
                                                        onChange={(value) => setData('clothing_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Utilities Expense" error={errors.utilities_expense}>
                                                    <NumberField
                                                        id="utilities_expense"
                                                        value={data.utilities_expense}
                                                        onChange={(value) => setData('utilities_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Communication Expense" error={errors.communication_expense}>
                                                    <NumberField
                                                        id="communication_expense"
                                                        value={data.communication_expense}
                                                        onChange={(value) => setData('communication_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Medicine Expense" error={errors.medicine_expense}>
                                                    <NumberField
                                                        id="medicine_expense"
                                                        value={data.medicine_expense}
                                                        onChange={(value) => setData('medicine_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Doctor's Fee" error={errors.doctor_expense}>
                                                    <NumberField
                                                        id="doctor_expense"
                                                        value={data.doctor_expense}
                                                        onChange={(value) => setData('doctor_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Hospital Expense" error={errors.hospital_expense}>
                                                    <NumberField
                                                        id="hospital_expense"
                                                        value={data.hospital_expense}
                                                        onChange={(value) => setData('hospital_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Recreation Expense" error={errors.recreation_expense}>
                                                    <NumberField
                                                        id="recreation_expense"
                                                        value={data.recreation_expense}
                                                        onChange={(value) => setData('recreation_expense', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Total Monthly Expenses" error={errors.total_monthly_expenses}>
                                                    <NumberField
                                                        id="total_monthly_expenses"
                                                        value={data.total_monthly_expenses}
                                                        onChange={() => { }} // Read-only
                                                        readOnly
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Car Loan Details" error={errors.car_loan_details}>
                                                    <Input
                                                        id="car_loan_details"
                                                        value={data.car_loan_details ?? ''}
                                                        onChange={(e) => setData('car_loan_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </FormField>

                                                <FormField label="Other Loan Details" error={errors.other_loan_details}>
                                                    <Input
                                                        id="other_loan_details"
                                                        value={data.other_loan_details ?? ''}
                                                        onChange={(e) => setData('other_loan_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Helper Details" error={errors.helper_details}>
                                                    <Input
                                                        id="helper_details"
                                                        value={data.helper_details ?? ''}
                                                        onChange={(e) => setData('helper_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </FormField>

                                                <FormField label="Driver Details" error={errors.driver_details}>
                                                    <Input
                                                        id="driver_details"
                                                        value={data.driver_details ?? ''}
                                                        onChange={(e) => setData('driver_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </FormField>
                                            </div>

                                            <FormField label="Other Monthly Expense Details" error={errors.other_monthly_expense_details}>
                                                <Input
                                                    id="other_monthly_expense_details"
                                                    value={data.other_monthly_expense_details ?? ''}
                                                    onChange={(e) => setData('other_monthly_expense_details', e.target.value)}
                                                    placeholder="Enter details"
                                                />
                                            </FormField>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Annual Expenses */}
                                    <div className="space-y-4">
                                        <CardTitle className="text-lg">Annual Expenses</CardTitle>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="School Tuition Fee" error={errors.school_tuition_fee}>
                                                    <NumberField
                                                        id="school_tuition_fee"
                                                        value={data.school_tuition_fee}
                                                        onChange={(value) => setData('school_tuition_fee', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Withholding Tax" error={errors.withholding_tax}>
                                                    <NumberField
                                                        id="withholding_tax"
                                                        value={data.withholding_tax}
                                                        onChange={(value) => setData('withholding_tax', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="SSS/GSIS/Pag-IBIG Contribution" error={errors.sss_gsis_pagibig_contribution}>
                                                    <NumberField
                                                        id="sss_gsis_pagibig_contribution"
                                                        value={data.sss_gsis_pagibig_contribution}
                                                        onChange={(value) => setData('sss_gsis_pagibig_contribution', value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </FormField>

                                                <FormField label="Other Annual Expense Details" error={errors.other_annual_expense_details}>
                                                    <Input
                                                        id="other_annual_expense_details"
                                                        value={data.other_annual_expense_details ?? ''}
                                                        onChange={(e) => setData('other_annual_expense_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </FormField>
                                            </div>

                                            <FormField label="Subtotal Annual Expenses" error={errors.subtotal_annual_expenses}>
                                                <NumberField
                                                    id="subtotal_annual_expenses"
                                                    value={data.subtotal_annual_expenses}
                                                    onChange={(value) => setData('subtotal_annual_expenses', value)}
                                                    placeholder="Enter amount"
                                                />
                                            </FormField>

                                            <FormField label="Total Annual Expenses" error={errors.total_annual_expenses}>
                                                <NumberField
                                                    id="total_annual_expenses"
                                                    value={data.total_annual_expenses}
                                                    onChange={() => { }} // Read-only
                                                    readOnly
                                                />
                                            </FormField>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Assets & Appliances */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-5 w-5 text-primary" />
                                        <CardTitle>Assets & Appliances</CardTitle>
                                    </div>
                                    <CardDescription>Select which appliances your household owns</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_tv"
                                                checked={data.has_tv}
                                                onCheckedChange={(checked) => setData('has_tv', checked as boolean)}
                                            />
                                            <Label htmlFor="has_tv" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Television
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_radio_speakers_karaoke"
                                                checked={data.has_radio_speakers_karaoke}
                                                onCheckedChange={(checked) => setData('has_radio_speakers_karaoke', checked as boolean)}
                                            />
                                            <Label htmlFor="has_radio_speakers_karaoke" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Radio/Speakers/Karaoke
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_musical_instruments"
                                                checked={data.has_musical_instruments}
                                                onCheckedChange={(checked) => setData('has_musical_instruments', checked as boolean)}
                                            />
                                            <Label htmlFor="has_musical_instruments" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Musical Instruments
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_computer"
                                                checked={data.has_computer}
                                                onCheckedChange={(checked) => setData('has_computer', checked as boolean)}
                                            />
                                            <Label htmlFor="has_computer" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Desktop Computer
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_laptop"
                                                checked={data.has_laptop}
                                                onCheckedChange={(checked) => setData('has_laptop', checked as boolean)}
                                            />
                                            <Label htmlFor="has_laptop" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Laptop
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_gaming_box"
                                                checked={data.has_gaming_box}
                                                onCheckedChange={(checked) => setData('has_gaming_box', checked as boolean)}
                                            />
                                            <Label htmlFor="has_gaming_box" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Gaming Console
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_stove"
                                                checked={data.has_stove}
                                                onCheckedChange={(checked) => setData('has_stove', checked as boolean)}
                                            />
                                            <Label htmlFor="has_stove" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Stove
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_refrigerator"
                                                checked={data.has_refrigerator}
                                                onCheckedChange={(checked) => setData('has_refrigerator', checked as boolean)}
                                            />
                                            <Label htmlFor="has_refrigerator" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Refrigerator
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_microwave"
                                                checked={data.has_microwave}
                                                onCheckedChange={(checked) => setData('has_microwave', checked as boolean)}
                                            />
                                            <Label htmlFor="has_microwave" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Microwave
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_air_conditioner"
                                                checked={data.has_air_conditioner}
                                                onCheckedChange={(checked) => setData('has_air_conditioner', checked as boolean)}
                                            />
                                            <Label htmlFor="has_air_conditioner" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Air Conditioner
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_electric_fan"
                                                checked={data.has_electric_fan}
                                                onCheckedChange={(checked) => setData('has_electric_fan', checked as boolean)}
                                            />
                                            <Label htmlFor="has_electric_fan" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Electric Fan
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_washing_machine"
                                                checked={data.has_washing_machine}
                                                onCheckedChange={(checked) => setData('has_washing_machine', checked as boolean)}
                                            />
                                            <Label htmlFor="has_washing_machine" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Washing Machine
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_cellphone"
                                                checked={data.has_cellphone}
                                                onCheckedChange={(checked) => setData('has_cellphone', checked as boolean)}
                                            />
                                            <Label htmlFor="has_cellphone" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Cellphone
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="has_dslr_camera"
                                                checked={data.has_dslr_camera}
                                                onCheckedChange={(checked) => setData('has_dslr_camera', checked as boolean)}
                                            />
                                            <Label htmlFor="has_dslr_camera" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                DSLR Camera
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Submit Button */}
                    <Card className="bg-card/50 hover:bg-card/75 transition-colors">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 justify-between">
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Delete Account Section */}
                <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                        <DeleteUser />
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}
