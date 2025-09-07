<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CompleteInterviewRequest extends FormRequest
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
            'scores' => ['required', 'array', 'min:1'],
            'scores.*' => ['required', 'numeric', 'min:0', 'max:100'],
            'recommendation' => ['required', 'in:approved,rejected,pending'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'scores.required' => 'Please provide interview scores.',
            'scores.array' => 'Scores must be provided as an array.',
            'scores.min' => 'At least one score is required.',
            'scores.*.required' => 'All score fields are required.',
            'scores.*.numeric' => 'Scores must be numeric values.',
            'scores.*.min' => 'Scores cannot be negative.',
            'scores.*.max' => 'Scores cannot exceed 100.',
            'recommendation.required' => 'Please select a recommendation.',
            'recommendation.in' => 'Please select a valid recommendation.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'scores.*' => 'score',
        ];
    }
}
