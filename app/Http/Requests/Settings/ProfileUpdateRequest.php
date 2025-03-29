<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Name components
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],

            // Email
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
            ],

            // Academic information
            'student_id' => ['required', 'string', 'max:20'],
            'course' => ['required', 'string', 'max:255'],
            'major' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'max:50'],

            // Personal information
            'civil_status' => ['required', 'string', 'max:50'],
            'sex' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['required', 'date'],
            'place_of_birth' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'mobile_number' => ['required', 'string', 'max:15'],
            'is_pwd' => ['required', 'string', 'max:3'],
            'disability_type' => ['nullable', 'string', 'max:255'],
            'religion' => ['required', 'string', 'max:100'],
        ];
    }
}
