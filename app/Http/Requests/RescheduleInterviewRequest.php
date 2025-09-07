<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RescheduleInterviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = Auth::user();

        // Both students and staff can use this request
        return $user && in_array($user->role, ['student', 'admin', 'osas_staff']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = Auth::user();

        $rules = [
            'reason' => ['required', 'string', 'max:500'],
        ];

        // Only staff needs to provide new schedule
        if (in_array($user->role, ['admin', 'osas_staff'])) {
            $rules['new_schedule'] = ['required', 'date', 'after:now'];
            $rules['location'] = ['nullable', 'string', 'max:255'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'reason.required' => 'Please provide a reason for rescheduling.',
            'reason.max' => 'The reason cannot exceed 500 characters.',
            'new_schedule.required' => 'Please select a new date and time.',
            'new_schedule.date' => 'Please provide a valid date and time.',
            'new_schedule.after' => 'The new schedule must be in the future.',
        ];
    }
}
