<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Validation\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Photo ID
            'photo_id' => ['nullable', 'file', 'image', 'max:5120'], // 5MB max

            // Name components
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],

            // Email and Student ID
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
                'ends_with:@minsu.edu.ph',
            ],
            'student_id' => [
                'required',
                'string',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
            ],

            // Academic information
            'course' => ['required', 'string', 'max:255'],
            'major' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'max:255'],

            // Personal information
            'civil_status' => ['required', 'string', 'max:255', 'in:Single,Married,Widowed,Separated,Annulled'],
            'sex' => ['required', 'string', 'max:255', 'in:Male,Female'],
            'date_of_birth' => ['required', 'date'],
            'place_of_birth' => ['required', 'string', 'max:255'],

            // Address components
            'street' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'residence_type' => ['required', 'string', 'max:255'],
            'guardian_name' => ['required', 'string', 'max:255'],

            'scholarships' => ['nullable', 'string', 'max:255'],

            // Contact information
            'mobile_number' => [
                'required',
                'string',
                'max:255',
                'regex:/^[0-9]{10}$/',
            ],
            'telephone_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            // Additional information
            'is_pwd' => ['required', 'string', 'max:255', 'in:Yes,No'],
            'disability_type' => [
                'nullable',
                'string',
                'max:255',
                'required_if:is_pwd,Yes'
            ],
            'religion' => ['required', 'string', 'max:255'],

            // Family Background
            'status_of_parents' => ['required', 'string', 'max:255', 'in:Living Together,Separated,Single Parent,Mother Deceased,Father Deceased'],
            'father_name' => ['required', 'string', 'max:255'],
            'father_age' => ['required', 'integer', 'min:0', 'max:150'],
            'father_address' => ['required', 'string', 'max:255'],
            'father_telephone' => ['nullable', 'string', 'max:255'],
            'father_mobile' => ['nullable', 'string', 'max:255', 'regex:/^[0-9]{10}$/'],
            'father_email' => ['nullable', 'email', 'max:255'],
            'father_occupation' => ['required', 'string', 'max:255'],
            'father_company' => ['nullable', 'string', 'max:255'],
            'father_monthly_income' => ['required', 'numeric', 'min:0'],
            'father_years_service' => ['required', 'integer', 'min:0'],
            'father_education' => ['required', 'string', 'max:255'],
            'father_school' => ['nullable', 'string', 'max:255'],
            'father_unemployment_reason' => ['nullable', 'string', 'max:255'],

            'mother_name' => ['required', 'string', 'max:255'],
            'mother_age' => ['required', 'integer', 'min:0', 'max:150'],
            'mother_address' => ['required', 'string', 'max:255'],
            'mother_telephone' => ['nullable', 'string', 'max:255'],
            'mother_mobile' => ['nullable', 'string', 'max:255', 'regex:/^[0-9]{10}$/'],
            'mother_email' => ['nullable', 'email', 'max:255'],
            'mother_occupation' => ['required', 'string', 'max:255'],
            'mother_company' => ['nullable', 'string', 'max:255'],
            'mother_monthly_income' => ['required', 'numeric', 'min:0'],
            'mother_years_service' => ['required', 'integer', 'min:0'],
            'mother_education' => ['required', 'string', 'max:255'],
            'mother_school' => ['nullable', 'string', 'max:255'],
            'mother_unemployment_reason' => ['nullable', 'string', 'max:255'],

            // Siblings
            'total_siblings' => ['required', 'integer', 'min:0'],
            'siblings' => ['nullable', 'array'],
            'siblings.*.name' => ['required', 'string', 'max:255'],
            'siblings.*.age_civil_status' => ['required', 'string', 'max:255'],
            'siblings.*.address' => ['required', 'string', 'max:255'],
            'siblings.*.occupation' => ['required', 'string', 'max:255'],
            'siblings.*.monthly_income' => ['required', 'numeric', 'min:0'],
            'siblings.*.education' => ['required', 'string', 'max:255'],
            'siblings.*.school' => ['nullable', 'string', 'max:255'],
            'siblings.*.living_together' => ['required', 'boolean'],
            'siblings.*.school_fees' => ['nullable', 'numeric', 'min:0'],

            // Income
            'parents_annual_income' => ['required', 'numeric', 'min:0'],
            'siblings_annual_income' => ['required', 'numeric', 'min:0'],
            'business_income' => ['nullable', 'numeric', 'min:0'],
            'land_rental_income' => ['nullable', 'numeric', 'min:0'],
            'building_rental_income' => ['nullable', 'numeric', 'min:0'],
            'pension_income' => ['nullable', 'numeric', 'min:0'],
            'commission_income' => ['nullable', 'numeric', 'min:0'],
            'relatives_support' => ['nullable', 'numeric', 'min:0'],
            'bank_deposits' => ['nullable', 'numeric', 'min:0'],
            'other_income_description' => ['nullable', 'string', 'max:255'],
            'other_income_amount' => ['nullable', 'numeric', 'min:0'],

            // Appliances
            'has_tv' => ['required', 'boolean'],
            'has_radio' => ['required', 'boolean'],
            'has_musical_instruments' => ['required', 'boolean'],
            'has_computer' => ['required', 'boolean'],
            'has_stove' => ['required', 'boolean'],
            'has_laptop' => ['required', 'boolean'],
            'has_refrigerator' => ['required', 'boolean'],
            'has_microwave' => ['required', 'boolean'],
            'has_aircon' => ['required', 'boolean'],
            'has_electric_fan' => ['required', 'boolean'],
            'has_washing_machine' => ['required', 'boolean'],
            'has_cellphone' => ['required', 'boolean'],
            'has_gaming_console' => ['required', 'boolean'],
            'has_camera' => ['required', 'boolean'],
            'has_air_conditioner' => ['required', 'boolean'],
            'has_car' => ['required', 'boolean'],
            'has_motorcycle' => ['required', 'boolean'],
            'has_wifi' => ['required', 'boolean'],

            // Monthly Expenses
            'rent_expense' => ['nullable', 'numeric', 'min:0'],
            'food_expense' => ['required', 'numeric', 'min:0'],
            'car_loan_details' => ['nullable', 'string', 'max:255'],
            'other_loan_details' => ['nullable', 'string', 'max:255'],
            'school_bus_expense' => ['nullable', 'numeric', 'min:0'],
            'transportation_expense' => ['required', 'numeric', 'min:0'],
            'education_plan_expense' => ['nullable', 'numeric', 'min:0'],
            'insurance_expense' => ['nullable', 'numeric', 'min:0'],
            'health_insurance_expense' => ['nullable', 'numeric', 'min:0'],
            'government_loans' => ['nullable', 'numeric', 'min:0'],
            'clothing_expense' => ['required', 'numeric', 'min:0'],
            'utilities_expense' => ['required', 'numeric', 'min:0'],
            'communication_expense' => ['required', 'numeric', 'min:0'],
            'helper_details' => ['nullable', 'string', 'max:255'],
            'driver_details' => ['nullable', 'string', 'max:255'],
            'medicine_expense' => ['nullable', 'numeric', 'min:0'],
            'doctor_expense' => ['nullable', 'numeric', 'min:0'],
            'hospital_expense' => ['nullable', 'numeric', 'min:0'],
            'recreation_expense' => ['nullable', 'numeric', 'min:0'],
            'other_monthly_expense_details' => ['nullable', 'string', 'max:255'],
            'water_expense' => ['required', 'numeric', 'min:0'],
            'electricity_expense' => ['required', 'numeric', 'min:0'],
            'education_expense' => ['required', 'numeric', 'min:0'],
            'other_expenses' => ['nullable', 'array'],
            'other_expenses.*.description' => ['required', 'string', 'max:255'],
            'other_expenses.*.amount' => ['required', 'numeric', 'min:0'],

            // Annual Expenses
            'tuition_expense' => ['required', 'numeric', 'min:0'],
            'tax_expense' => ['nullable', 'numeric', 'min:0'],
            'government_contributions' => ['nullable', 'numeric', 'min:0'],
            'other_annual_expense_details' => ['nullable', 'string', 'max:255'],
            'tuition_fee' => ['required', 'numeric', 'min:0'],
            'books_expense' => ['required', 'numeric', 'min:0'],
            'school_supplies_expense' => ['required', 'numeric', 'min:0'],
            'school_projects_expense' => ['required', 'numeric', 'min:0'],
            'miscellaneous_expense' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'email' => 'university email address',
            'student_id' => 'student ID',
            'mobile_number' => 'mobile number',
            'telephone_number' => 'telephone number',
            'is_pwd' => 'PWD status',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.ends_with' => 'The email must be a valid university email address ending with @minsu.edu.ph.',
            'mobile_number.regex' => 'The mobile number must be exactly 10 digits.',
            'disability_type.required_if' => 'The disability type field is required when you are a Person with Disability.',
        ];
    }
}
