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
        $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'student_id' => 'required|string|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'course' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'year_level' => 'required|string|max:255',
            'civil_status' => 'required|string|max:255',
            'sex' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'mobile_number' => 'nullable|string|max:255',
            'is_pwd' => 'required|string|max:255',
            'disability_type' => 'nullable|string|max:255|required_if:is_pwd,Yes',
            'religion' => 'required|string|max:255',
            'terms_agreement' => 'required|accepted',
        ]);

        // Format mobile number with +63 prefix if provided
        $mobileNumber = $request->mobile_number ? '+63' . $request->mobile_number : null;

        $user = User::create([
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
            'address' => $request->address,
            'mobile_number' => $mobileNumber,
            'is_pwd' => $request->is_pwd,
            'disability_type' => $request->disability_type,
            'religion' => $request->religion,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
