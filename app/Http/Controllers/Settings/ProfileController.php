<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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

        // Load the appropriate profile based on user role
        $profile = null;
        $photoUrl = null;

        // Get photo URL from user record since photo_id is stored in users table
        $photoUrl = $user->photo_id ? asset('storage/'.$user->photo_id) : null;

        switch ($user->role) {
            case 'student':
                $profile = $user->studentProfile;
                break;
            case 'osas_staff':
                $profile = $user->osasStaffProfile;
                break;
            case 'admin':
                $profile = $user->adminProfile;
                break;
        }

        // Merge user data with profile data for the form
        $profileData = array_merge(
            $user->only(['first_name', 'middle_name', 'last_name', 'email']),
            $profile ? $profile->toArray() : [],
            ['photo_url' => $photoUrl]
        );

        // ✅ FIXED: Don't convert boolean to Yes/No - keep as boolean
        if (isset($profileData['is_pwd'])) {
            $profileData['is_pwd'] = (bool) $profileData['is_pwd'];
        }

        // ✅ Ensure other boolean fields are properly typed
        $booleanFields = [
            'has_tv', 'has_radio_speakers_karaoke', 'has_musical_instruments',
            'has_computer', 'has_stove', 'has_laptop', 'has_refrigerator',
            'has_microwave', 'has_air_conditioner', 'has_electric_fan',
            'has_washing_machine', 'has_cellphone', 'has_gaming_box', 'has_dslr_camera',
        ];

        foreach ($booleanFields as $field) {
            if (isset($profileData[$field])) {
                $profileData[$field] = (bool) $profileData[$field];
            }
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'photoUrl' => $photoUrl,
            'profile' => $profileData,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // ✅ Enhanced debug logging
        Log::info('=== PROFILE UPDATE DEBUG ===');
        Log::info('User role: '.$user->role);
        Log::info('Request method: '.$request->method());
        Log::info('Content-Type: '.$request->header('Content-Type'));
        Log::info('All request data: ', $request->all());
        Log::info('Individual fields:', [
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'admin_id' => $request->input('admin_id'),
        ]);
        Log::info('Has file: '.($request->hasFile('photo_id') ? 'yes' : 'no'));
        Log::info('=== END DEBUG ===');

        $validatedData = $request->validated();

        // ✅ Handle photo upload first if present
        if ($request->hasFile('photo_id')) {
            Log::info('Processing photo upload...');
            // Delete old photo if exists
            if ($user->photo_id) {
                Storage::disk('public')->delete($user->photo_id);
            }

            // Store new photo
            $photoPath = $request->file('photo_id')->store('profile-photos', 'public');
            $validatedData['photo_id'] = $photoPath;
            Log::info('Photo uploaded to: '.$photoPath);
        }

        // ✅ Update user basic information
        $userFields = ['first_name', 'middle_name', 'last_name', 'email'];
        if (isset($validatedData['photo_id'])) {
            $userFields[] = 'photo_id';
        }

        $userUpdateData = array_intersect_key($validatedData, array_flip($userFields));

        Log::info('Updating user with data: ', $userUpdateData);
        $user->update($userUpdateData);

        // ✅ Update role-specific profile data
        if ($user->role === 'admin') {
            $adminProfile = $user->adminProfile()->firstOrCreate(['user_id' => $user->id]);
            if (isset($validatedData['admin_id'])) {
                $adminProfile->update(['admin_id' => $validatedData['admin_id']]);
                Log::info('Updated admin profile with admin_id: '.$validatedData['admin_id']);
            }

        } elseif ($user->role === 'osas_staff') {
            $staffProfile = $user->osasStaffProfile()->firstOrCreate(['user_id' => $user->id]);
            if (isset($validatedData['staff_id'])) {
                $staffProfile->update(['staff_id' => $validatedData['staff_id']]);
                Log::info('Updated staff profile with staff_id: '.$validatedData['staff_id']);
            }

        } elseif ($user->role === 'student') {
            $studentProfile = $user->studentProfile()->firstOrCreate(['user_id' => $user->id]);

            // ✅ Filter out user fields and photo from student profile data
            $profileFields = array_diff_key(
                $validatedData,
                array_flip(['first_name', 'middle_name', 'last_name', 'email', 'photo_id'])
            );

            // ✅ Ensure boolean fields are properly handled
            $booleanFields = [
                'is_pwd', 'has_tv', 'has_radio_speakers_karaoke', 'has_musical_instruments',
                'has_computer', 'has_stove', 'has_laptop', 'has_refrigerator',
                'has_microwave', 'has_air_conditioner', 'has_electric_fan',
                'has_washing_machine', 'has_cellphone', 'has_gaming_box', 'has_dslr_camera',
            ];

            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $profileFields)) {
                    $profileFields[$field] = (bool) $profileFields[$field];
                }
            }

            $studentProfile->update($profileFields);
            Log::info('Updated student profile with fields: ', array_keys($profileFields));
        }

        Log::info('Profile update completed successfully for user: '.$user->id);

        return redirect()->back()->with('success', 'Profile updated successfully!');
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

        // Delete profile photo if exists
        if ($user->photo_id) {
            Storage::disk('public')->delete($user->photo_id);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
