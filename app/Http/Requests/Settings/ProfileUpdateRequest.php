<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = Auth::user();

        $baseRules = [
            'photo_id' => [
                'nullable',
                'file',
                'image',
                'mimes:jpeg,png,jpg',
                'max:5120',
                'dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000',
            ],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
        ];

        // Common base for email validation, ensuring it's required, a valid email, and unique (ignoring the current user)
        $emailValidationBase = ['required', 'string', 'email:rfc,dns', 'max:255', Rule::unique(User::class)->ignore($user->id)];

        if ($user->role === 'admin') {
            $adminRules = [
                'admin_id' => ['nullable', 'string', 'max:255'],
                'email' => $emailValidationBase, // Admins use the base email validation
            ];

            return array_merge($baseRules, $adminRules);

        } elseif ($user->role === 'osas_staff') {
            $osasStaffRules = [
                'staff_id' => [
                    Rule::unique('osas_staff_profiles', 'staff_id')->ignore($user->osasStaffProfile->id ?? null),
                ],
                'email' => $emailValidationBase, // OSAS Staff use the base email validation (no @minsu.edu.ph restriction)
            ];

            return array_merge($baseRules, $osasStaffRules);

        } else { // student
            $studentEmailValidation = array_merge($emailValidationBase, ['ends_with:@minsu.edu.ph']); // Students have the additional @minsu.edu.ph restriction

            $studentRules = [
                'student_id' => [
                    Rule::unique('student_profiles', 'student_id')->ignore($user->studentProfile->id ?? null),
                ],
                'course' => ['required', 'string', 'max:255'],
                'major' => ['nullable', 'string', 'max:255'],
                'year_level' => ['required', 'string', 'max:255'],
                'existing_scholarships' => ['nullable', 'string', 'max:255'],
                'civil_status' => ['required', 'string', 'max:255'],
                'sex' => ['required', 'string', 'max:255'],
                'date_of_birth' => ['required', 'date'],
                'place_of_birth' => ['required', 'string', 'max:255'],
                'street' => ['nullable', 'string', 'max:255'],
                'barangay' => ['nullable', 'string', 'max:255'],
                'city' => ['nullable', 'string', 'max:255'],
                'province' => ['nullable', 'string', 'max:255'],
                'mobile_number' => ['required', 'string', 'max:255'],
                'telephone_number' => ['nullable', 'string', 'max:255'],
                'is_pwd' => ['required', 'boolean'],
                'disability_type' => ['nullable', 'string', 'max:255'],
                'religion' => ['nullable', 'string', 'max:255'],
                'residence_type' => ['required', 'string', 'max:255'],
                'guardian_name' => ['nullable', 'string', 'max:255'],
                'email' => $studentEmailValidation, // Apply student-specific email validation

                // Family Background
                'status_of_parents' => ['nullable', 'string', 'max:255'],
                'father_name' => ['nullable', 'string', 'max:255'],
                'father_age' => ['nullable', 'integer', 'min:0', 'max:150'],
                'father_address' => ['nullable', 'string', 'max:500'],
                'father_telephone' => ['nullable', 'string', 'max:255'],
                'father_mobile' => ['nullable', 'string', 'max:255'],
                'father_email' => ['nullable', 'email', 'max:255'],
                'father_occupation' => ['nullable', 'string', 'max:255'],
                'father_company' => ['nullable', 'string', 'max:255'],
                'father_monthly_income' => ['nullable', 'numeric', 'min:0'],
                'father_years_service' => ['nullable', 'integer', 'min:0'],
                'father_education' => ['nullable', 'string', 'max:255'],
                'father_school' => ['nullable', 'string', 'max:255'],
                'father_unemployment_reason' => ['nullable', 'string', 'max:500'],

                'mother_name' => ['nullable', 'string', 'max:255'],
                'mother_age' => ['nullable', 'integer', 'min:0', 'max:150'],
                'mother_address' => ['nullable', 'string', 'max:500'],
                'mother_telephone' => ['nullable', 'string', 'max:255'],
                'mother_mobile' => ['nullable', 'string', 'max:255'],
                'mother_email' => ['nullable', 'email', 'max:255'],
                'mother_occupation' => ['nullable', 'string', 'max:255'],
                'mother_company' => ['nullable', 'string', 'max:255'],
                'mother_monthly_income' => ['nullable', 'numeric', 'min:0'],
                'mother_years_service' => ['nullable', 'integer', 'min:0'],
                'mother_education' => ['nullable', 'string', 'max:255'],
                'mother_school' => ['nullable', 'string', 'max:255'],
                'mother_unemployment_reason' => ['nullable', 'string', 'max:500'],

                'total_siblings' => ['nullable', 'integer', 'min:0'],

                // Income Information
                'combined_annual_pay_parents' => ['nullable', 'numeric', 'min:0'],
                'combined_annual_pay_siblings' => ['nullable', 'numeric', 'min:0'],
                'income_from_business' => ['nullable', 'numeric', 'min:0'],
                'income_from_land_rentals' => ['nullable', 'numeric', 'min:0'],
                'income_from_building_rentals' => ['nullable', 'numeric', 'min:0'],
                'retirement_benefits_pension' => ['nullable', 'numeric', 'min:0'],
                'commissions' => ['nullable', 'numeric', 'min:0'],
                'support_from_relatives' => ['nullable', 'numeric', 'min:0'],
                'bank_deposits' => ['nullable', 'numeric', 'min:0'],
                'other_income_description' => ['nullable', 'string', 'max:255'],
                'other_income_amount' => ['nullable', 'numeric', 'min:0'],
                'total_annual_income' => ['nullable', 'numeric', 'min:0'],

                // Appliances
                'has_tv' => ['nullable', 'boolean'],
                'has_radio_speakers_karaoke' => ['nullable', 'boolean'],
                'has_musical_instruments' => ['nullable', 'boolean'],
                'has_computer' => ['nullable', 'boolean'],
                'has_stove' => ['nullable', 'boolean'],
                'has_laptop' => ['nullable', 'boolean'],
                'has_refrigerator' => ['nullable', 'boolean'],
                'has_microwave' => ['nullable', 'boolean'],
                'has_air_conditioner' => ['nullable', 'boolean'],
                'has_electric_fan' => ['nullable', 'boolean'],
                'has_washing_machine' => ['nullable', 'boolean'],
                'has_cellphone' => ['nullable', 'boolean'],
                'has_gaming_box' => ['nullable', 'boolean'],
                'has_dslr_camera' => ['nullable', 'boolean'],

                // Monthly Expenses
                'house_rental' => ['nullable', 'numeric', 'min:0'],
                'food_grocery' => ['nullable', 'numeric', 'min:0'],
                'car_loan_details' => ['nullable', 'string', 'max:255'],
                'other_loan_details' => ['nullable', 'string', 'max:255'],
                'school_bus_payment' => ['nullable', 'numeric', 'min:0'],
                'transportation_expense' => ['nullable', 'numeric', 'min:0'],
                'education_plan_premiums' => ['nullable', 'numeric', 'min:0'],
                'insurance_policy_premiums' => ['nullable', 'numeric', 'min:0'],
                'health_insurance_premium' => ['nullable', 'numeric', 'min:0'],
                'sss_gsis_pagibig_loans' => ['nullable', 'numeric', 'min:0'],
                'clothing_expense' => ['nullable', 'numeric', 'min:0'],
                'utilities_expense' => ['nullable', 'numeric', 'min:0'],
                'communication_expense' => ['nullable', 'numeric', 'min:0'],
                'helper_details' => ['nullable', 'string', 'max:255'],
                'driver_details' => ['nullable', 'string', 'max:255'],
                'medicine_expense' => ['nullable', 'numeric', 'min:0'],
                'doctor_expense' => ['nullable', 'numeric', 'min:0'],
                'hospital_expense' => ['nullable', 'numeric', 'min:0'],
                'recreation_expense' => ['nullable', 'numeric', 'min:0'],
                'other_monthly_expense_details' => ['nullable', 'string', 'max:255'],
                'total_monthly_expenses' => ['nullable', 'numeric', 'min:0'],
                'annualized_monthly_expenses' => ['nullable', 'numeric', 'min:0'],

                'school_tuition_fee' => ['nullable', 'numeric', 'min:0'],
                'withholding_tax' => ['nullable', 'numeric', 'min:0'],
                'sss_gsis_pagibig_contribution' => ['nullable', 'numeric', 'min:0'],
                'other_annual_expense_details' => ['nullable', 'string', 'max:255'],
                'subtotal_annual_expenses' => ['nullable', 'numeric', 'min:0'],
                'total_annual_expenses' => ['nullable', 'numeric', 'min:0'],
            ];

            return array_merge($baseRules, $studentRules);
        }
    }
}
