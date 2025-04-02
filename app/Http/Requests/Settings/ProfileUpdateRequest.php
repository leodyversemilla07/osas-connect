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
