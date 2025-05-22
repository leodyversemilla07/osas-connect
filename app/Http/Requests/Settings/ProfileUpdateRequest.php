<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Validation\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $user = Auth::user();
        $baseRules = [
            // Photo ID
            'photo_id' => [
                'nullable',
                'file',
                'image',
                'mimes:jpeg,png,jpg',
                'max:5120', // 5MB max
                'dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000'
            ],

            // Name components
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],

            // Email
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
                'ends_with:@minsu.edu.ph',
            ],
        ];

        // Add role-specific validation rules
        if ($user->role === 'student') {
            $studentRules = [
                'student_id' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('student_profiles', 'student_id')->ignore($user->studentProfile->id ?? null),
                    'regex:/^MBC\d{4}-\d{4}$/'
                ],

                // Academic information
                'course' => ['required', 'string', 'max:255'],
                'major' => ['required', 'string', 'max:255'],
                'year_level' => ['required', 'string', 'max:255', 'in:1st Year,2nd Year,3rd Year,4th Year'],

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
                'residence_type' => ['required', 'string', 'max:255', 'in:Boarding House,Parent\'s House,With Guardian'],
                'guardian_name' => [
                    'required_if:residence_type,With Guardian',
                    'string', 
                    'max:255',
                    'nullable'
                ],

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
                'is_pwd' => ['required', 'string', 'in:Yes,No'],
                'disability_type' => [
                    'required_if:is_pwd,Yes',
                    'string',
                    'max:255',
                    'nullable'
                ],
                'religion' => ['required', 'string', 'max:255'],

                // Family Background
                'status_of_parents' => ['required', 'string', 'max:255', 'in:Living Together,Separated,Single Parent,Mother Deceased,Father Deceased'],
                'father_name' => ['nullable', 'string', 'max:255'],
                'father_age' => ['nullable', 'integer', 'min:0', 'max:150'],
                'father_address' => ['nullable', 'string', 'max:255'],
                'father_telephone' => ['nullable', 'string', 'max:255'],
                'father_mobile' => ['nullable', 'string', 'max:255', 'regex:/^[0-9]{10}$/'],
                'father_email' => ['nullable', 'email', 'max:255'],
                'father_occupation' => ['nullable', 'string', 'max:255'],
                'father_company' => ['nullable', 'string', 'max:255'],
                'father_monthly_income' => ['nullable', 'numeric', 'min:0'],
                'father_years_service' => ['nullable', 'integer', 'min:0'],
                'father_education' => ['nullable', 'string', 'max:255'],
                'father_school' => ['nullable', 'string', 'max:255'],
                'father_unemployment_reason' => ['nullable', 'string', 'max:255'],

                // Only make the father's information required if they are living together or father is alive
                'father_name' => ['required_unless:status_of_parents,Father Deceased,Both Deceased', 'string', 'max:255', 'nullable'],
                'father_occupation' => ['required_unless:status_of_parents,Father Deceased,Both Deceased', 'string', 'max:255', 'nullable'],
                'father_monthly_income' => ['required_unless:status_of_parents,Father Deceased,Both Deceased', 'numeric', 'min:0', 'nullable'],

                'mother_name' => ['nullable', 'string', 'max:255'],
                'mother_age' => ['nullable', 'integer', 'min:0', 'max:150'],
                'mother_address' => ['nullable', 'string', 'max:255'],
                'mother_telephone' => ['nullable', 'string', 'max:255'],
                'mother_mobile' => ['nullable', 'string', 'max:255', 'regex:/^[0-9]{10}$/'],
                'mother_email' => ['nullable', 'email', 'max:255'],
                'mother_occupation' => ['nullable', 'string', 'max:255'],
                'mother_company' => ['nullable', 'string', 'max:255'],
                'mother_monthly_income' => ['nullable', 'numeric', 'min:0'],
                'mother_years_service' => ['nullable', 'integer', 'min:0'],
                'mother_education' => ['nullable', 'string', 'max:255'],
                'mother_school' => ['nullable', 'string', 'max:255'],
                'mother_unemployment_reason' => ['nullable', 'string', 'max:255'],

                // Only make the mother's information required if they are living together or mother is alive
                'mother_name' => ['required_unless:status_of_parents,Mother Deceased,Both Deceased', 'string', 'max:255', 'nullable'],
                'mother_occupation' => ['required_unless:status_of_parents,Mother Deceased,Both Deceased', 'string', 'max:255', 'nullable'],
                'mother_monthly_income' => ['required_unless:status_of_parents,Mother Deceased,Both Deceased', 'numeric', 'min:0', 'nullable'],

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
            $rulesToReturn = array_merge($baseRules, $studentRules);
            Log::debug('ProfileUpdateRequest rules for student: ', $rulesToReturn);
            return $rulesToReturn;

        } elseif ($user->role === 'osas_staff') {
            $osasStaffRules = [
                'staff_id' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('osas_staff_profiles', 'staff_id')->ignore($user->osasStaffProfile->id ?? null)
                ]
            ];
            $rulesToReturn = array_merge($baseRules, $osasStaffRules);
            Log::debug('ProfileUpdateRequest rules for osas_staff: ', $rulesToReturn);
            return $rulesToReturn;

        } elseif ($user->role === 'admin') {
            $adminRules = [
                'admin_id' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('admin_profiles', 'admin_id')->ignore($user->adminProfile->id ?? null)
                ]
            ];
            $rulesToReturn = array_merge($baseRules, $adminRules);
            Log::debug('ProfileUpdateRequest rules for admin: ', ['photo_id_rules' => $rulesToReturn['photo_id'] ?? 'not_found']);
            return $rulesToReturn;
        }
        
        Log::debug('ProfileUpdateRequest fallback rules: ', ['photo_id_rules' => $baseRules['photo_id'] ?? 'not_found']);
        return $baseRules;
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
            'guardian_name.required_if' => 'The guardian name is required when your residence type is "With Guardian".',
            'year_level.in' => 'The year level must be one of: 1st Year, 2nd Year, 3rd Year, 4th Year.',
            'student_id.regex' => 'The student ID must be in the format MBCyyyy-nnnn (e.g., MBC2025-0001).',
            'residence_type.in' => 'The residence type must be one of: Boarding House, Parent\'s House, With Guardian.',
            'father_name.required_unless' => 'The father\'s name is required unless indicated as deceased.',
            'father_occupation.required_unless' => 'The father\'s occupation is required unless indicated as deceased.',
            'father_monthly_income.required_unless' => 'The father\'s monthly income is required unless indicated as deceased.',
            'mother_name.required_unless' => 'The mother\'s name is required unless indicated as deceased.',
            'mother_occupation.required_unless' => 'The mother\'s occupation is required unless indicated as deceased.',
            'mother_monthly_income.required_unless' => 'The mother\'s monthly income is required unless indicated as deceased.',
        ];
    }
}
