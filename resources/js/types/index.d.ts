import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User & {
        student_profile?: StudentProfile;
    };
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[]; // Added roles property to control visibility based on user role
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface StudentProfile {
    id: number;
    user_id: number;
    student_id: string;
    course: string;
    major: string;
    year_level: string;
    current_gwa: number | null;
    enrollment_status: string;
    units: number | null;

    // Personal Information
    photo_id: string | null;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: string;
    mobile_number: string;
    telephone_number: string;
    is_pwd: boolean;
    disability_type: string | null;
    religion: string;
    residence_type: string;
    guardian_name: string;
    existing_scholarships: string | null;

    // Family Background
    status_of_parents: string;

    // Father's Information
    father_name: string;
    father_age: number;
    father_address: string;
    father_telephone: string | null;
    father_mobile: string | null;
    father_email: string | null;
    father_occupation: string;
    father_company: string | null;
    father_monthly_income: number;
    father_years_service: number;
    father_education: string;
    father_school: string | null;
    father_unemployment_reason: string | null;

    // Mother's Information
    mother_name: string;
    mother_age: number;
    mother_address: string;
    mother_telephone: string | null;
    mother_mobile: string | null;
    mother_email: string | null;
    mother_occupation: string;
    mother_company: string | null;
    mother_monthly_income: number;
    mother_years_service: number;
    mother_education: string;
    mother_school: string | null;
    mother_unemployment_reason: string | null;

    // Siblings Information
    total_siblings: number;
    siblings: Array<{
        name: string;
        age_civil_status: string;
        address: string;
    }>;

    // Income Information
    combined_annual_pay_parents: number;
    combined_annual_pay_siblings: number;
    income_from_business: number;
    income_from_land_rentals: number;
    income_from_building_rentals: number;
    retirement_benefits_pension: number;
    commissions: number;
    support_from_relatives: number;
    bank_deposits: number;
    other_income_description: string | null;
    other_income_amount: number;
    total_annual_income: number;

    // Appliances
    has_tv: boolean;
    has_radio_speakers_karaoke: boolean;
    has_musical_instruments: boolean;
    has_computer: boolean;
    has_stove: boolean;
    has_laptop: boolean;
    has_refrigerator: boolean;
    has_microwave: boolean;
    has_air_conditioner: boolean;
    has_electric_fan: boolean;
    has_washing_machine: boolean;
    has_cellphone: boolean;
    has_gaming_box: boolean;
    has_dslr_camera: boolean;

    // Monthly Expenses
    house_rental: number;
    food_grocery: number;
    car_loan_details: string | null;
    other_loan_details: string | null;
    school_bus_payment: number;
    transportation_expense: number;
    education_plan_premiums: number;
    insurance_policy_premiums: number;
    health_insurance_premium: number;
    sss_gsis_pagibig_loans: number;
    clothing_expense: number;
    utilities_expense: number;
    communication_expense: number;
    helper_details: string | null;
    driver_details: string | null;
    medicine_expense: number;
    doctor_expense: number;
    hospital_expense: number;
    recreation_expense: number;
    other_monthly_expense_details: string | null;
    total_monthly_expenses: number;
    annualized_monthly_expenses: number;

    // Annual Expenses
    school_tuition_fee: number;
    withholding_tax: number;
    sss_gsis_pagibig_contribution: number;
    other_annual_expense_details: string | null;
    subtotal_annual_expenses: number;
    total_annual_expenses: number;

    created_at: string;
    updated_at: string;
}

export interface OsasStaffProfile {
    id: number;
    staff_id: string;
}

export interface User {
    id: number;
    last_name: string;
    first_name: string;
    middle_name: string | null;
    role: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    email_verified_at: string | null;
    last_login_at: string | null;
    remember_token?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    student_profile?: StudentProfile;
    osas_staff_profile?: OsasStaffProfile;
    admin_profile?: AdminProfile;

    [key: string]: unknown;
}
