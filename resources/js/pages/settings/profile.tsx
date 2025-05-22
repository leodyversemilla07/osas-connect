import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
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
import { PhotoIdUpload } from '@/components/PhotoIdUpload';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Utility functions for number handling
const formatNumberForInput = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return ''; // Fixed

    // Enforce a maximum of 2 decimal places and handle scientific notation
    const num = Math.abs(value) > 999999999999 ? 999999999999 : value;
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false
    });
};

const parseNumberInput = (value: string): number => {
    // Remove any non-numeric characters except decimal point and minus
    const cleanValue = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanValue || '0');

    if (isNaN(parsed)) return 0; // Fixed

    // Limit to 12 digits before decimal and 2 after
    const parts = parsed.toString().split('.');
    const wholeNumber = parts[0].slice(0, 12);
    const decimals = parts[1]?.slice(0, 2) || '';

    const result = parseFloat(`${wholeNumber}${decimals ? '.' + decimals : ''}`);
    return Math.min(999999999999, Math.max(-999999999999, result));
};

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

export default function Profile({ photoUrl, profile, mustVerifyEmail, status }: { photoUrl?: string, profile: ProfileFormData, mustVerifyEmail?: boolean, status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const isStudent = auth.user.role === 'student';

    const { data, setData, put, errors, clearErrors, processing } = useForm<ProfileFormData>({
        // Basic Information
        photo_id: null,
        first_name: profile.first_name || auth.user.first_name || '',
        middle_name: profile.middle_name || auth.user.middle_name || null,
        last_name: profile.last_name || auth.user.last_name || '',
        email: profile.email || auth.user.email || '',

        // Role-specific fields
        student_id: profile.student_id || (auth.user.role === 'student' ? auth.user.student_profile?.student_id : '') || '',
        staff_id: profile.staff_id || (auth.user.role === 'osas_staff' ? auth.user.osas_staff_profile?.staff_id : '') || '',
        admin_id: profile.admin_id || (auth.user.role === 'admin' ? auth.user.admin_profile?.admin_id : '') || '',

        // Academic Information
        course: (isStudent ? profile.course : undefined) ?? '',
        major: (isStudent ? profile.major : undefined) ?? '',
        year_level: (isStudent ? profile.year_level : undefined) ?? '',
        existing_scholarships: (isStudent ? profile.existing_scholarships : null) ?? null,

        // Personal Information
        civil_status: (isStudent ? profile.civil_status : undefined) ?? '',
        sex: (isStudent ? profile.sex : undefined) ?? '',
        date_of_birth: (isStudent ? profile.date_of_birth : undefined) ?? '',
        place_of_birth: (isStudent ? profile.place_of_birth : undefined) ?? '',
        street: (isStudent ? profile.street : undefined) ?? '',
        barangay: (isStudent ? profile.barangay : undefined) ?? '',
        city: (isStudent ? profile.city : undefined) ?? '',
        province: (isStudent ? profile.province : undefined) ?? '',
        mobile_number: (isStudent ? profile.mobile_number : undefined) ?? '',
        telephone_number: (isStudent ? profile.telephone_number : null) ?? null,
        is_pwd: (isStudent ? profile.is_pwd : undefined) ?? false,
        disability_type: (isStudent ? profile.disability_type : null) ?? null,
        religion: (isStudent ? profile.religion : undefined) ?? '',
        residence_type: (isStudent ? profile.residence_type : undefined) ?? '',

        // Family Background
        status_of_parents: (isStudent ? profile.status_of_parents : null) ?? null,

        // Father's Information
        father_name: (isStudent ? profile.father_name : null) ?? null,
        father_age: (isStudent ? profile.father_age : null) ?? null,
        father_address: (isStudent ? profile.father_address : null) ?? null,
        father_telephone: (isStudent ? profile.father_telephone : null) ?? null,
        father_mobile: (isStudent ? profile.father_mobile : null) ?? null,
        father_email: (isStudent ? profile.father_email : null) ?? null,
        father_occupation: (isStudent ? profile.father_occupation : null) ?? null,
        father_company: (isStudent ? profile.father_company : null) ?? null,
        father_monthly_income: (isStudent ? profile.father_monthly_income : null) ?? null,
        father_years_service: (isStudent ? profile.father_years_service : null) ?? null,
        father_education: (isStudent ? profile.father_education : null) ?? null,
        father_school: (isStudent ? profile.father_school : null) ?? null,
        father_unemployment_reason: (isStudent ? profile.father_unemployment_reason : null) ?? null,

        // Mother's Information
        mother_name: (isStudent ? profile.mother_name : null) ?? null,
        mother_age: (isStudent ? profile.mother_age : null) ?? null,
        mother_address: (isStudent ? profile.mother_address : null) ?? null,
        mother_telephone: (isStudent ? profile.mother_telephone : null) ?? null,
        mother_mobile: (isStudent ? profile.mother_mobile : null) ?? null,
        mother_email: (isStudent ? profile.mother_email : null) ?? null,
        mother_occupation: (isStudent ? profile.mother_occupation : null) ?? null,
        mother_company: (isStudent ? profile.mother_company : null) ?? null,
        mother_monthly_income: (isStudent ? profile.mother_monthly_income : null) ?? null,
        mother_years_service: (isStudent ? profile.mother_years_service : null) ?? null,
        mother_education: (isStudent ? profile.mother_education : null) ?? null,
        mother_school: (isStudent ? profile.mother_school : null) ?? null,
        mother_unemployment_reason: (isStudent ? profile.mother_unemployment_reason : null) ?? null,

        // Siblings Information
        total_siblings: (isStudent ? profile.total_siblings : undefined) ?? 0,
        siblings: (isStudent ? profile.siblings : null) ?? null,

        // Income Information
        combined_annual_pay_parents: (isStudent ? profile.combined_annual_pay_parents : undefined) ?? 0,
        combined_annual_pay_siblings: (isStudent ? profile.combined_annual_pay_siblings : undefined) ?? 0,
        income_from_business: (isStudent ? profile.income_from_business : undefined) ?? 0,
        income_from_land_rentals: (isStudent ? profile.income_from_land_rentals : undefined) ?? 0,
        income_from_building_rentals: (isStudent ? profile.income_from_building_rentals : undefined) ?? 0,
        retirement_benefits_pension: (isStudent ? profile.retirement_benefits_pension : undefined) ?? 0,
        commissions: (isStudent ? profile.commissions : undefined) ?? 0,
        support_from_relatives: (isStudent ? profile.support_from_relatives : undefined) ?? 0,
        bank_deposits: (isStudent ? profile.bank_deposits : undefined) ?? 0,
        other_income_description: (isStudent ? profile.other_income_description : null) ?? null,
        other_income_amount: (isStudent ? profile.other_income_amount : undefined) ?? 0,
        total_annual_income: (isStudent ? profile.total_annual_income : undefined) ?? 0,

        // Appliances
        has_tv: (isStudent ? profile.has_tv : undefined) ?? false,
        has_radio_speakers_karaoke: (isStudent ? profile.has_radio_speakers_karaoke : undefined) ?? false,
        has_musical_instruments: (isStudent ? profile.has_musical_instruments : undefined) ?? false,
        has_computer: (isStudent ? profile.has_computer : undefined) ?? false,
        has_stove: (isStudent ? profile.has_stove : undefined) ?? false,
        has_laptop: (isStudent ? profile.has_laptop : undefined) ?? false,
        has_refrigerator: (isStudent ? profile.has_refrigerator : undefined) ?? false,
        has_microwave: (isStudent ? profile.has_microwave : undefined) ?? false,
        has_air_conditioner: (isStudent ? profile.has_air_conditioner : undefined) ?? false,
        has_electric_fan: (isStudent ? profile.has_electric_fan : undefined) ?? false,
        has_washing_machine: (isStudent ? profile.has_washing_machine : undefined) ?? false,
        has_cellphone: (isStudent ? profile.has_cellphone : undefined) ?? false,
        has_gaming_box: (isStudent ? profile.has_gaming_box : undefined) ?? false,
        has_dslr_camera: (isStudent ? profile.has_dslr_camera : undefined) ?? false,

        // Monthly Expenses
        house_rental: (isStudent ? profile.house_rental : undefined) ?? 0,
        food_grocery: (isStudent ? profile.food_grocery : undefined) ?? 0,
        car_loan_details: (isStudent ? profile.car_loan_details : null) ?? null,
        other_loan_details: (isStudent ? profile.other_loan_details : null) ?? null,
        school_bus_payment: (isStudent ? profile.school_bus_payment : undefined) ?? 0,
        transportation_expense: (isStudent ? profile.transportation_expense : undefined) ?? 0,
        education_plan_premiums: (isStudent ? profile.education_plan_premiums : undefined) ?? 0,
        insurance_policy_premiums: (isStudent ? profile.insurance_policy_premiums : undefined) ?? 0,
        health_insurance_premium: (isStudent ? profile.health_insurance_premium : undefined) ?? 0,
        sss_gsis_pagibig_loans: (isStudent ? profile.sss_gsis_pagibig_loans : undefined) ?? 0,
        clothing_expense: (isStudent ? profile.clothing_expense : undefined) ?? 0,
        utilities_expense: (isStudent ? profile.utilities_expense : undefined) ?? 0,
        communication_expense: (isStudent ? profile.communication_expense : undefined) ?? 0,
        helper_details: (isStudent ? profile.helper_details : null) ?? null,
        driver_details: (isStudent ? profile.driver_details : null) ?? null,
        medicine_expense: (isStudent ? profile.medicine_expense : undefined) ?? 0,
        doctor_expense: (isStudent ? profile.doctor_expense : undefined) ?? 0,
        hospital_expense: (isStudent ? profile.hospital_expense : undefined) ?? 0,
        recreation_expense: (isStudent ? profile.recreation_expense : undefined) ?? 0,
        other_monthly_expense_details: (isStudent ? profile.other_monthly_expense_details : null) ?? null,
        total_monthly_expenses: (isStudent ? profile.total_monthly_expenses : undefined) ?? 0,
        annualized_monthly_expenses: (isStudent ? profile.annualized_monthly_expenses : undefined) ?? 0,

        // Annual Expenses
        school_tuition_fee: (isStudent ? profile.school_tuition_fee : undefined) ?? 0,
        withholding_tax: (isStudent ? profile.withholding_tax : undefined) ?? 0,
        sss_gsis_pagibig_contribution: (isStudent ? profile.sss_gsis_pagibig_contribution : undefined) ?? 0,
        other_annual_expense_details: (isStudent ? profile.other_annual_expense_details : null) ?? null,
        subtotal_annual_expenses: (isStudent ? profile.subtotal_annual_expenses : undefined) ?? 0,
        total_annual_expenses: (isStudent ? profile.total_annual_expenses : undefined) ?? 0,
    });

    // Effect to update form data if the profile prop changes (e.g., after successful save and page reload)
    useEffect(() => {
        setData({
            photo_id: null,
            first_name: profile.first_name || auth.user.first_name || '',
            middle_name: profile.middle_name || auth.user.middle_name || null,
            last_name: profile.last_name || auth.user.last_name || '',
            email: profile.email || auth.user.email || '',
            student_id: profile.student_id || (auth.user.role === 'student' ? auth.user.student_profile?.student_id : '') || '',
            staff_id: profile.staff_id || (auth.user.role === 'osas_staff' ? auth.user.osas_staff_profile?.staff_id : '') || '',
            admin_id: profile.admin_id || (auth.user.role === 'admin' ? (auth.user.admin_profile?.admin_id || auth.user.id?.toString()) : '') || '',
            course: (isStudent ? profile.course : undefined) ?? '',
            major: (isStudent ? profile.major : undefined) ?? '',
            year_level: (isStudent ? profile.year_level : undefined) ?? '',
            existing_scholarships: (isStudent ? profile.existing_scholarships : null) ?? null,
            civil_status: (isStudent ? profile.civil_status : undefined) ?? '',
            sex: (isStudent ? profile.sex : undefined) ?? '',
            date_of_birth: (isStudent ? profile.date_of_birth : undefined) ?? '',
            place_of_birth: (isStudent ? profile.place_of_birth : undefined) ?? '',
            mobile_number: (isStudent ? profile.mobile_number : undefined) ?? '',
            telephone_number: (isStudent ? profile.telephone_number : null) ?? null,
            is_pwd: (isStudent ? profile.is_pwd : undefined) ?? false,
            disability_type: (isStudent ? profile.disability_type : null) ?? null,
            religion: (isStudent ? profile.religion : undefined) ?? '',
            street: (isStudent ? profile.street : undefined) ?? '',
            barangay: (isStudent ? profile.barangay : undefined) ?? '',
            city: (isStudent ? profile.city : undefined) ?? '',
            province: (isStudent ? profile.province : undefined) ?? '',
            residence_type: (isStudent ? profile.residence_type : undefined) ?? '',
            guardian_name: (isStudent ? profile.guardian_name : undefined) ?? '',
            status_of_parents: (isStudent ? profile.status_of_parents : null) ?? null,
            father_name: (isStudent ? profile.father_name : null) ?? null,
            // ... (repeat for all father fields as above)
            father_age: (isStudent ? profile.father_age : null) ?? null,
            father_address: (isStudent ? profile.father_address : null) ?? null,
            father_telephone: (isStudent ? profile.father_telephone : null) ?? null,
            father_mobile: (isStudent ? profile.father_mobile : null) ?? null,
            father_email: (isStudent ? profile.father_email : null) ?? null,
            father_occupation: (isStudent ? profile.father_occupation : null) ?? null,
            father_company: (isStudent ? profile.father_company : null) ?? null,
            father_monthly_income: (isStudent ? profile.father_monthly_income : null) ?? null,
            father_years_service: (isStudent ? profile.father_years_service : null) ?? null,
            father_education: (isStudent ? profile.father_education : null) ?? null,
            father_school: (isStudent ? profile.father_school : null) ?? null,
            father_unemployment_reason: (isStudent ? profile.father_unemployment_reason : null) ?? null,
            // ... (repeat for all mother fields as above)
            mother_name: (isStudent ? profile.mother_name : null) ?? null,
            mother_age: (isStudent ? profile.mother_age : null) ?? null,
            mother_address: (isStudent ? profile.mother_address : null) ?? null,
            mother_telephone: (isStudent ? profile.mother_telephone : null) ?? null,
            mother_mobile: (isStudent ? profile.mother_mobile : null) ?? null,
            mother_email: (isStudent ? profile.mother_email : null) ?? null,
            mother_occupation: (isStudent ? profile.mother_occupation : null) ?? null,
            mother_company: (isStudent ? profile.mother_company : null) ?? null,
            mother_monthly_income: (isStudent ? profile.mother_monthly_income : null) ?? null,
            mother_years_service: (isStudent ? profile.mother_years_service : null) ?? null,
            mother_education: (isStudent ? profile.mother_education : null) ?? null,
            mother_school: (isStudent ? profile.mother_school : null) ?? null,
            mother_unemployment_reason: (isStudent ? profile.mother_unemployment_reason : null) ?? null,
            total_siblings: (isStudent ? profile.total_siblings : undefined) ?? 0,
            siblings: (isStudent ? profile.siblings : null) ?? null,
            combined_annual_pay_parents: (isStudent ? profile.combined_annual_pay_parents : undefined) ?? 0,
            combined_annual_pay_siblings: (isStudent ? profile.combined_annual_pay_siblings : undefined) ?? 0,
            income_from_business: (isStudent ? profile.income_from_business : undefined) ?? 0,
            income_from_land_rentals: (isStudent ? profile.income_from_land_rentals : undefined) ?? 0,
            income_from_building_rentals: (isStudent ? profile.income_from_building_rentals : undefined) ?? 0,
            retirement_benefits_pension: (isStudent ? profile.retirement_benefits_pension : undefined) ?? 0,
            commissions: (isStudent ? profile.commissions : undefined) ?? 0,
            support_from_relatives: (isStudent ? profile.support_from_relatives : undefined) ?? 0,
            bank_deposits: (isStudent ? profile.bank_deposits : undefined) ?? 0,
            other_income_description: (isStudent ? profile.other_income_description : null) ?? null,
            other_income_amount: (isStudent ? profile.other_income_amount : undefined) ?? 0,
            has_tv: (isStudent ? profile.has_tv : undefined) ?? false,
            has_radio_speakers_karaoke: (isStudent ? profile.has_radio_speakers_karaoke : undefined) ?? false,
            has_musical_instruments: (isStudent ? profile.has_musical_instruments : undefined) ?? false,
            has_computer: (isStudent ? profile.has_computer : undefined) ?? false,
            has_stove: (isStudent ? profile.has_stove : undefined) ?? false,
            has_laptop: (isStudent ? profile.has_laptop : undefined) ?? false,
            has_refrigerator: (isStudent ? profile.has_refrigerator : undefined) ?? false,
            has_microwave: (isStudent ? profile.has_microwave : undefined) ?? false,
            has_air_conditioner: (isStudent ? profile.has_air_conditioner : undefined) ?? false,
            has_electric_fan: (isStudent ? profile.has_electric_fan : undefined) ?? false,
            has_washing_machine: (isStudent ? profile.has_washing_machine : undefined) ?? false,
            has_cellphone: (isStudent ? profile.has_cellphone : undefined) ?? false,
            has_gaming_box: (isStudent ? profile.has_gaming_box : undefined) ?? false,
            has_dslr_camera: (isStudent ? profile.has_dslr_camera : undefined) ?? false,
            house_rental: (isStudent ? profile.house_rental : undefined) ?? 0,
            food_grocery: (isStudent ? profile.food_grocery : undefined) ?? 0,
            car_loan_details: (isStudent ? profile.car_loan_details : null) ?? null,
            other_loan_details: (isStudent ? profile.other_loan_details : null) ?? null,
            school_bus_payment: (isStudent ? profile.school_bus_payment : undefined) ?? 0,
            transportation_expense: (isStudent ? profile.transportation_expense : undefined) ?? 0,
            education_plan_premiums: (isStudent ? profile.education_plan_premiums : undefined) ?? 0,
            insurance_policy_premiums: (isStudent ? profile.insurance_policy_premiums : undefined) ?? 0,
            health_insurance_premium: (isStudent ? profile.health_insurance_premium : undefined) ?? 0,
            sss_gsis_pagibig_loans: (isStudent ? profile.sss_gsis_pagibig_loans : undefined) ?? 0,
            clothing_expense: (isStudent ? profile.clothing_expense : undefined) ?? 0,
            utilities_expense: (isStudent ? profile.utilities_expense : undefined) ?? 0,
            communication_expense: (isStudent ? profile.communication_expense : undefined) ?? 0,
            helper_details: (isStudent ? profile.helper_details : null) ?? null,
            driver_details: (isStudent ? profile.driver_details : null) ?? null,
            medicine_expense: (isStudent ? profile.medicine_expense : undefined) ?? 0,
            doctor_expense: (isStudent ? profile.doctor_expense : undefined) ?? 0,
            hospital_expense: (isStudent ? profile.hospital_expense : undefined) ?? 0,
            recreation_expense: (isStudent ? profile.recreation_expense : undefined) ?? 0,
            other_monthly_expense_details: (isStudent ? profile.other_monthly_expense_details : null) ?? null,
            total_monthly_expenses: (isStudent ? profile.total_monthly_expenses : undefined) ?? 0,
            annualized_monthly_expenses: (isStudent ? profile.annualized_monthly_expenses : undefined) ?? 0,
            school_tuition_fee: (isStudent ? profile.school_tuition_fee : undefined) ?? 0,
            withholding_tax: (isStudent ? profile.withholding_tax : undefined) ?? 0,
            sss_gsis_pagibig_contribution: (isStudent ? profile.sss_gsis_pagibig_contribution : undefined) ?? 0,
            other_annual_expense_details: (isStudent ? profile.other_annual_expense_details : null) ?? null,
            subtotal_annual_expenses: (isStudent ? profile.subtotal_annual_expenses : undefined) ?? 0,
            total_annual_expenses: (isStudent ? profile.total_annual_expenses : undefined) ?? 0
        });
    }, [profile, auth.user, isStudent, setData]); // Added dependencies

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors(); // Clear previous errors

        // Use 'put' for update operations, Inertia handles _method spoofing for FormData
        put(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: (formErrors) => {
                console.error('Form submission errors: ', formErrors);
                toast.error('Failed to update profile. Please check the form for errors.');
            },
            onFinish: () => {
                // Any cleanup or final actions
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
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
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">First Name *</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        autoComplete="given-name"
                                        placeholder="Enter your first name"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last Name *</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                        autoComplete="family-name"
                                        placeholder="Enter your last name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name">Middle Name</Label>
                                <Input
                                    id="middle_name"
                                    value={data.middle_name ?? ''}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    autoComplete="additional-name"
                                    placeholder="Enter your middle name (if any)"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="Enter your email address"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="id_field">{auth.user.role === 'student' ? 'Student ID' : 
                                    auth.user.role === 'osas_staff' ? 'Staff ID' : 'Admin ID'} *</Label>
                                <Input
                                    id="id_field"
                                    value={data[`${auth.user.role === 'student' ? 'student' : 
                                        auth.user.role === 'osas_staff' ? 'staff' : 'admin'}_id`]}
                                    disabled
                                    className="bg-muted"
                                />
                                <InputError message={errors[`${auth.user.role === 'student' ? 'student' : 
                                    auth.user.role === 'osas_staff' ? 'staff' : 'admin'}_id`]} />
                            </div>

                            <div className="grid gap-2">
                                <Label>1x1 ID Photo</Label>
                                <PhotoIdUpload
                                    onChange={(file) => setData('photo_id', file)}
                                    existingPhotoUrl={photoUrl}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload a recent 1x1 ID picture with white background
                                </p>
                                <InputError message={errors.photo_id} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conditional rendering of student-specific sections */}
                    {isStudent ? (
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="course">Course *</Label>
                                            <Input
                                                id="course"
                                                type="text"
                                                value={data.course}
                                                onChange={(e) => setData('course', e.target.value)}
                                                required
                                                placeholder="Enter your course"
                                            />
                                            <InputError message={errors.course} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="major">Major/Specialization</Label>
                                            <Input
                                                id="major"
                                                type="text"
                                                value={data.major}
                                                onChange={(e) => setData('major', e.target.value)}
                                                placeholder="Enter your specialization (if any)"
                                            />
                                            <InputError message={errors.major} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="year_level">Year Level *</Label>
                                            <Select value={data.year_level} onValueChange={(value) => setData('year_level', value)}>
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
                                            <InputError message={errors.year_level} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="existing_scholarships">Existing Scholarship/s</Label>
                                            <Input
                                                id="existing_scholarships"
                                                type="text"
                                                value={data.existing_scholarships ?? ''}
                                                onChange={(e) => setData('existing_scholarships', e.target.value)}
                                                placeholder="Enter your scholarship/s (if any)"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                If you have multiple scholarships, separate them with commas
                                            </p>
                                            <InputError message={errors.existing_scholarships} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Personal Information Section */}
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="sex">Sex *</Label>
                                            <Select value={data.sex} onValueChange={(value) => setData('sex', value)}>
                                                <SelectTrigger id="sex">
                                                    <SelectValue placeholder="Select sex" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.sex} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="civil_status">Civil Status *</Label>
                                            <Select value={data.civil_status} onValueChange={(value) => setData('civil_status', value)}>
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
                                            <InputError message={errors.civil_status} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="date_of_birth">Date of Birth *</Label>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.date_of_birth} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="place_of_birth">Place of Birth *</Label>
                                            <Input
                                                id="place_of_birth"
                                                type="text"
                                                value={data.place_of_birth}
                                                onChange={(e) => setData('place_of_birth', e.target.value)}
                                                required
                                                placeholder="Enter your place of birth"
                                            />
                                            <InputError message={errors.place_of_birth} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="mobile_number">Mobile Number *</Label>
                                            <Input
                                                id="mobile_number"
                                                type="tel"
                                                value={data.mobile_number}
                                                onChange={(e) => setData('mobile_number', e.target.value)}
                                                required
                                                placeholder="Enter your mobile number"
                                            />
                                            <InputError message={errors.mobile_number} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="telephone_number">Telephone Number</Label>
                                            <Input
                                                id="telephone_number"
                                                type="tel"
                                                value={data.telephone_number ?? ''}
                                                onChange={(e) => setData('telephone_number', e.target.value)}
                                                placeholder="Enter your telephone number (if any)"
                                            />
                                            <InputError message={errors.telephone_number} />
                                        </div>
                                    </div>

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
                                            <div className="grid gap-2">
                                                <Label htmlFor="residence_type">Type of Residence *</Label>
                                                <Select
                                                    value={data.residence_type}
                                                    onValueChange={(value) => {
                                                        setData('residence_type', value);
                                                        if (value !== 'With Guardian') {
                                                            setData('guardian_name', 'Not Applicable');
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
                                                <InputError message={errors.residence_type} />
                                            </div>

                                            {data.residence_type === 'With Guardian' && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="guardian_name">Guardian's Name *</Label>
                                                    <Input
                                                        id="guardian_name"
                                                        type="text"
                                                        value={data.guardian_name}
                                                        onChange={(e) => setData('guardian_name', e.target.value)}
                                                        required
                                                        placeholder="Enter guardian's name"
                                                    />
                                                    <InputError message={errors.guardian_name} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Family Background Section */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <CardTitle>Family Background</CardTitle>
                                    </div>
                                    <CardDescription>Information about your family members</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Status of Parents */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="status_of_parents">Status of Parents</Label>
                                        <Select value={data.status_of_parents ?? ''} onValueChange={(value) => setData('status_of_parents', value)}>
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
                                        <InputError message={errors.status_of_parents} />
                                    </div>

                                    {/* Father's Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <Label className="text-base">Father's Information</Label>
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
                                                    onChange={(e) => setData('father_age', parseInt(e.target.value))}
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
                                                <div className="grid gap-2">
                                                    <Input
                                                        id="father_monthly_income"
                                                        type="number"
                                                        placeholder="Monthly Income"
                                                        value={data.father_monthly_income ?? ''}
                                                        onChange={(e) => setData('father_monthly_income', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Input
                                                        id="father_years_service"
                                                        type="number"
                                                        placeholder="Years of Service"
                                                        value={data.father_years_service ?? ''}
                                                        onChange={(e) => setData('father_years_service', parseInt(e.target.value))}
                                                    />
                                                </div>
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
                                        </div>
                                    </div>

                                    {/* Mother's Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <Label className="text-base">Mother's Information</Label>
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
                                                    onChange={(e) => setData('mother_age', parseInt(e.target.value))}
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
                                                <div className="grid gap-2">
                                                    <Input
                                                        id="mother_monthly_income"
                                                        type="number"
                                                        placeholder="Monthly Income"
                                                        value={data.mother_monthly_income ?? ''}
                                                        onChange={(e) => setData('mother_monthly_income', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Input
                                                        id="mother_years_service"
                                                        type="number"
                                                        placeholder="Years of Service"
                                                        value={data.mother_years_service ?? ''}
                                                        onChange={(e) => setData('mother_years_service', parseInt(e.target.value))}
                                                    />
                                                </div>
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
                                        </div>
                                    </div>

                                    {/* Siblings Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-primary" />
                                            <Label className="text-base">Siblings Information</Label>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="total_siblings">Number of Siblings</Label>
                                                <Input
                                                    id="total_siblings"
                                                    type="number"
                                                    min="0"
                                                    value={data.total_siblings}
                                                    onChange={(e) => setData('total_siblings', parseInt(e.target.value))}
                                                    placeholder="Enter number of siblings"
                                                />
                                            </div>
                                            {/* Siblings details component would go here */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Income Information Section */}
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
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">Income Sources</CardTitle>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="combined_annual_pay_parents">Parents' Combined Annual Income</Label>
                                                    <Input
                                                        id="combined_annual_pay_parents"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.combined_annual_pay_parents)}
                                                        onChange={(e) => setData('combined_annual_pay_parents', parseNumberInput(e.target.value))}
                                                        placeholder="Enter parents' combined annual income"
                                                    />
                                                    <InputError message={errors.combined_annual_pay_parents} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="combined_annual_pay_siblings">Siblings' Combined Annual Income</Label>
                                                    <Input
                                                        id="combined_annual_pay_siblings"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.combined_annual_pay_siblings)}
                                                        onChange={(e) => setData('combined_annual_pay_siblings', parseNumberInput(e.target.value))}
                                                        placeholder="Enter siblings' combined annual income"
                                                    />
                                                    <InputError message={errors.combined_annual_pay_siblings} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="income_from_business">Income from Business</Label>
                                                    <Input
                                                        id="income_from_business"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.income_from_business)}
                                                        onChange={(e) => setData('income_from_business', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                    <InputError message={errors.income_from_business} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="income_from_land_rentals">Income from Land Rentals</Label>
                                                    <Input
                                                        id="income_from_land_rentals"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.income_from_land_rentals)}
                                                        onChange={(e) => setData('income_from_land_rentals', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="income_from_building_rentals">Income from Building Rentals</Label>
                                                    <Input
                                                        id="income_from_building_rentals"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.income_from_building_rentals)}
                                                        onChange={(e) => setData('income_from_building_rentals', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="retirement_benefits_pension">Retirement Benefits/Pension</Label>
                                                    <Input
                                                        id="retirement_benefits_pension"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.retirement_benefits_pension)}
                                                        onChange={(e) => setData('retirement_benefits_pension', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="commissions">Commissions</Label>
                                                    <Input
                                                        id="commissions"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.commissions)}
                                                        onChange={(e) => setData('commissions', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="support_from_relatives">Support from Relatives</Label>
                                                    <Input
                                                        id="support_from_relatives"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.support_from_relatives)}
                                                        onChange={(e) => setData('support_from_relatives', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="bank_deposits">Bank Deposits</Label>
                                                    <Input
                                                        id="bank_deposits"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.bank_deposits)}
                                                        onChange={(e) => setData('bank_deposits', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="other_income_description">Other Income Description</Label>
                                                    <Input
                                                        id="other_income_description"
                                                        type="text"
                                                        value={data.other_income_description ?? ''}
                                                        onChange={(e) => setData('other_income_description', e.target.value)}
                                                        placeholder="Enter description"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="other_income_amount">Other Income Amount</Label>
                                                    <Input
                                                        id="other_income_amount"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.other_income_amount)}
                                                        onChange={(e) => setData('other_income_amount', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="total_annual_income">Total Annual Income</Label>
                                                    <Input
                                                        id="total_annual_income"
                                                        type="number"
                                                        value={formatNumberForInput(data.total_annual_income)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Monthly Expenses */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">Monthly Expenses</CardTitle>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="house_rental">Monthly House Rental</Label>
                                                    <Input
                                                        id="house_rental"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.house_rental)}
                                                        onChange={(e) => setData('house_rental', parseNumberInput(e.target.value))}
                                                        placeholder="Enter monthly house rental"
                                                    />
                                                    <InputError message={errors.house_rental} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="food_grocery">Food and Grocery Expenses</Label>
                                                    <Input
                                                        id="food_grocery"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.food_grocery)}
                                                        onChange={(e) => setData('food_grocery', parseNumberInput(e.target.value))}
                                                        placeholder="Enter food and grocery expenses"
                                                    />
                                                    <InputError message={errors.food_grocery} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="car_loan_details">Car Loan Details</Label>
                                                    <Input
                                                        id="car_loan_details"
                                                        type="text"
                                                        value={data.car_loan_details ?? ''}
                                                        onChange={(e) => setData('car_loan_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="other_loan_details">Other Loan Details</Label>
                                                    <Input
                                                        id="other_loan_details"
                                                        type="text"
                                                        value={data.other_loan_details ?? ''}
                                                        onChange={(e) => setData('other_loan_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="transportation_expense">Transportation Expense</Label>
                                                    <Input
                                                        id="transportation_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.transportation_expense)}
                                                        onChange={(e) => setData('transportation_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="education_plan_premiums">Education Plan Premiums</Label>
                                                    <Input
                                                        id="education_plan_premiums"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.education_plan_premiums)}
                                                        onChange={(e) => setData('education_plan_premiums', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="insurance_policy_premiums">Insurance Policy Premiums</Label>
                                                    <Input
                                                        id="insurance_policy_premiums"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.insurance_policy_premiums)}
                                                        onChange={(e) => setData('insurance_policy_premiums', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="health_insurance_premium">Health Insurance Premium</Label>
                                                    <Input
                                                        id="health_insurance_premium"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.health_insurance_premium)}
                                                        onChange={(e) => setData('health_insurance_premium', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="sss_gsis_pagibig_loans">SSS/GSIS/Pag-IBIG Loans</Label>
                                                    <Input
                                                        id="sss_gsis_pagibig_loans"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.sss_gsis_pagibig_loans)}
                                                        onChange={(e) => setData('sss_gsis_pagibig_loans', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="clothing_expense">Clothing Expense</Label>
                                                    <Input
                                                        id="clothing_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.clothing_expense)}
                                                        onChange={(e) => setData('clothing_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="utilities_expense">Utilities Expense</Label>
                                                    <Input
                                                        id="utilities_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.utilities_expense)}
                                                        onChange={(e) => setData('utilities_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="communication_expense">Communication Expense</Label>
                                                    <Input
                                                        id="communication_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.communication_expense)}
                                                        onChange={(e) => setData('communication_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="medicine_expense">Medicine Expense</Label>
                                                    <Input
                                                        id="medicine_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.medicine_expense)}
                                                        onChange={(e) => setData('medicine_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="doctor_expense">Doctor's Fee</Label>
                                                    <Input
                                                        id="doctor_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.doctor_expense)}
                                                        onChange={(e) => setData('doctor_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="hospital_expense">Hospital Expense</Label>
                                                    <Input
                                                        id="hospital_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.hospital_expense)}
                                                        onChange={(e) => setData('hospital_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="recreation_expense">Recreation Expense</Label>
                                                    <Input
                                                        id="recreation_expense"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.recreation_expense)}
                                                        onChange={(e) => setData('recreation_expense', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="total_monthly_expenses">Total Monthly Expenses</Label>
                                                    <Input
                                                        id="total_monthly_expenses"
                                                        type="number"
                                                        value={formatNumberForInput(data.total_monthly_expenses)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Annual Expenses */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">Annual Expenses</CardTitle>
                                        </div>
                                        <div className="grid gap-4 border rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="school_tuition_fee">School Tuition Fee</Label>
                                                    <Input
                                                        id="school_tuition_fee"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.school_tuition_fee)}
                                                        onChange={(e) => setData('school_tuition_fee', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="withholding_tax">Withholding Tax</Label>
                                                    <Input
                                                        id="withholding_tax"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.withholding_tax)}
                                                        onChange={(e) => setData('withholding_tax', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="sss_gsis_pagibig_contribution">SSS/GSIS/Pag-IBIG Contribution</Label>
                                                    <Input
                                                        id="sss_gsis_pagibig_contribution"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max={Number.MAX_SAFE_INTEGER}
                                                        value={formatNumberForInput(data.sss_gsis_pagibig_contribution)}
                                                        onChange={(e) => setData('sss_gsis_pagibig_contribution', parseNumberInput(e.target.value))}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="other_annual_expense_details">Other Annual Expense Details</Label>
                                                    <Input
                                                        id="other_annual_expense_details"
                                                        type="text"
                                                        value={data.other_annual_expense_details ?? ''}
                                                        onChange={(e) => setData('other_annual_expense_details', e.target.value)}
                                                        placeholder="Enter details"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="subtotal_annual_expenses">Subtotal Annual Expenses</Label>
                                                <Input
                                                    id="subtotal_annual_expenses"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max={Number.MAX_SAFE_INTEGER}
                                                    value={formatNumberForInput(data.subtotal_annual_expenses)}
                                                    onChange={(e) => setData('subtotal_annual_expenses', parseNumberInput(e.target.value))}
                                                    placeholder="Enter amount"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="total_annual_expenses">Total Annual Expenses</Label>
                                                <Input
                                                    id="total_annual_expenses"
                                                    type="number"
                                                    value={formatNumberForInput(data.total_annual_expenses)}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Appliances Section */}
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

                                        {/* Add more appliance checkboxes */}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : null}

                    {/* Submit button card */}
                    <Card className="bg-card/50 hover:bg-card/75 transition-colors">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 justify-between">
                                <Button disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
