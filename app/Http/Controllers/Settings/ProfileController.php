<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        // Load the student profile with all related data
        $user->load('studentProfile');

        $photoUrl = $user->studentProfile && $user->studentProfile->photo_id 
            ? asset('storage/' . $user->studentProfile->photo_id) 
            : null;

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'photoUrl' => $photoUrl,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $validatedData = $request->validated();

        if ($request->hasFile('photo_id')) {
            $path = $request->file('photo_id')->store('photo-ids', 'public');
            $user->studentProfile->photo_id = $path;
            $user->studentProfile->save();
        }

        // Separate user data from student profile data
        $userData = [
            'first_name' => $validatedData['first_name'],
            'middle_name' => $validatedData['middle_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
        ];

        // Update user model
        $user->fill($userData);
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();

        // Remove user and photo_id fields from student profile data
        unset(
            $validatedData['first_name'],
            $validatedData['middle_name'],
            $validatedData['last_name'],
            $validatedData['email'],
            $validatedData['photo_id']
        );

        // Add special handling for boolean fields
        $validatedData['is_pwd'] = $validatedData['is_pwd'] === 'Yes';

        // Update student profile
        $user->studentProfile->fill($validatedData);
        $user->studentProfile->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
