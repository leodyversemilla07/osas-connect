<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate($this->getValidationRules(), $this->getValidationMessages());

        $userData = $this->prepareUserData($request);
        $user = $this->createUser($userData);

        event(new Registered($user));
        Auth::login($user);

        return to_route('dashboard');
    }

    private function getValidationRules(): array
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
                'unique:' . User::class,
                'ends_with:@minsu.edu.ph',
            ],
            'student_id' => ['required', 'string', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Academic information
            'course' => ['required', 'string', 'max:255'],
            'major' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'in:1st Year,2nd Year,3rd Year,4th Year'],

            // Personal information
            'civil_status' => ['required', 'string', 'in:Single,Married,Widowed,Separated,Annulled'],
            'sex' => ['required', 'string', 'in:Male,Female'],
            'date_of_birth' => ['required', 'date'],
            'place_of_birth' => ['required', 'string', 'max:255'],

            // Address components
            'street' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'residence_type' => ['required', 'string', 'in:Parent\'s House,Boarding House,With Guardian'],
            'guardian_name' => ['required', 'string', 'max:255', 'required_if:residence_type,With Guardian'],

            'scholarships' => ['nullable', 'string', 'max:255'],

            // Contact information
            'mobile_number' => ['required', 'string', 'regex:/^[0-9]{10}$/'],
            'telephone_number' => ['nullable', 'string', 'max:255'],

            // Additional information
            'is_pwd' => ['required', 'string', 'in:Yes,No'],
            'disability_type' => ['nullable', 'string', 'max:255', 'required_if:is_pwd,Yes'],
            'religion' => ['required', 'string', 'max:255'],
            'terms_agreement' => ['required', 'accepted'],
        ];
    }

    private function getValidationMessages(): array
    {
        return [
            'email.ends_with' => 'The email must be a valid university email address ending with @minsu.edu.ph.',
            'mobile_number.regex' => 'The mobile number must be exactly 10 digits.',
            'disability_type.required_if' => 'The disability type field is required when you are a Person with Disability.',
            'terms_agreement.accepted' => 'You must agree to the terms and conditions.',
            'guardian_name.required_if' => 'The guardian name field is required when residence type is With Guardian.',
        ];
    }

    private function prepareUserData(Request $request): array
    {
        return [
            'last_name' => $request->last_name,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'email' => $request->email,
            'student_id' => $request->student_id,
            'password' => Hash::make($request->password),
            'course' => $request->course,
            'major' => $request->major,
            'year_level' => $request->year_level,
            'civil_status' => $request->civil_status,
            'sex' => $request->sex,
            'date_of_birth' => $request->date_of_birth,
            'place_of_birth' => $request->place_of_birth,
            'street' => $request->street,
            'barangay' => $request->barangay,
            'city' => $request->city,
            'province' => $request->province,
            'mobile_number' => '+63' . $request->mobile_number,
            'telephone_number' => $request->telephone_number,
            'is_pwd' => $request->is_pwd,
            'disability_type' => $request->disability_type,
            'religion' => $request->religion,
            'scholarships' => $request->scholarships,
            'residence_type' => $request->residence_type,
            'guardian_name' => $request->residence_type === 'With Guardian'
                ? $request->guardian_name
                : 'Not Applicable',
        ];
    }

    private function createUser(array $userData): User
    {
        return User::create($userData);
    }
}
