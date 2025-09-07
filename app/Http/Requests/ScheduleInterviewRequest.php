<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ScheduleInterviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = Auth::user();

        return $user && in_array($user->role, ['admin', 'osas_staff']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_id' => ['required', 'exists:scholarship_applications,id'],
            'interviewer_id' => ['required', 'exists:users,id'],
            'schedule' => ['required', 'date', 'after:now'],
            'location' => ['nullable', 'string', 'max:255'],
            'interview_type' => ['required', 'in:in_person,online,phone'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'interviewer_id.required' => 'Please select an interviewer.',
            'interviewer_id.exists' => 'The selected interviewer is invalid.',
            'schedule.required' => 'Please select an interview date and time.',
            'schedule.date' => 'Please provide a valid date and time.',
            'schedule.after' => 'The interview must be scheduled for a future date.',
            'interview_type.required' => 'Please select the interview type.',
            'interview_type.in' => 'Please select a valid interview type.',
        ];
    }
}
