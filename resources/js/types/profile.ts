// Core profile data types
export interface BasicProfileData {
    photo_id: File | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
}

export interface RoleSpecificData {
    student_id?: string;
    staff_id?: string;
    admin_id?: string;
}

export interface AcademicData {
    course?: string;
    major?: string;
    year_level?: string;
    existing_scholarships?: string | null;
}

export interface PersonalData {
    civil_status?: string;
    sex?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    street?: string;
    barangay?: string;
    city?: string;
    province?: string;
    zip_code?: string;
    mobile_number?: string;
    telephone_number?: string | null;
    is_pwd?: boolean;
    disability_type?: string | null;
    religion?: string;
    residence_type?: string;
    guardian_name?: string | null;
}

export interface FamilyData {
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
    mother_unemployment_reason?: string | null;    // Siblings Information
    total_siblings?: number;
    siblings?: SiblingInfo[] | null;
}

export interface FinancialData {
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
}

// Complete profile data interface
export interface ProfileFormData extends 
    BasicProfileData, 
    RoleSpecificData, 
    AcademicData, 
    PersonalData, 
    FamilyData, 
    FinancialData {
    [key: string]: string | number | boolean | File | Blob | Date | null | undefined | Array<string | number | boolean | null | undefined> | Array<{ [key: string]: string | number }> | SiblingInfo[] | null;
}

// Error handling types
export type ProfileFormErrors = Partial<Record<keyof ProfileFormData, string>>;

// Sibling information type
export interface SiblingInfo {
    name: string;
    age: number;
    civil_status: string;
    educational_attainment: string;
    occupation: string;
    monthly_income: number;
    [key: string]: string | number;
}

// User role types
export type UserRole = 'student' | 'osas_staff' | 'admin';

// Progress type for file uploads
export interface UploadProgress {
    percentage: number;
}

// Props interfaces
export interface ProfileProps {
    photoUrl?: string;
    profile: ProfileFormData;
    mustVerifyEmail?: boolean;
    status?: string;
}

export interface ProfileSectionProps {
    data: ProfileFormData;
    errors: ProfileFormErrors;
    updateField: <T extends keyof ProfileFormData>(field: T, value: ProfileFormData[T]) => void;
    processing?: boolean;
    handleCourseChange?: (courseValue: string) => void;
}
