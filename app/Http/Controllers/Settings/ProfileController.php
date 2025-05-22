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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
        $photoUrl = $user->photo_id ? asset('storage/' . $user->photo_id) : null;
        
        switch($user->role) {
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

        // Convert boolean is_pwd back to Yes/No for student profiles
        if (isset($profileData['is_pwd'])) {
            $profileData['is_pwd'] = $profileData['is_pwd'] ? 'Yes' : 'No';
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
        $user = Auth::user();
        $validatedData = $request->validated();

        try {
            // The data is already validated by ProfileUpdateRequest
            $userData = [
                'first_name' => $validatedData['first_name'],
                'middle_name' => $validatedData['middle_name'] ?? null,
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
            ];

            // Handle photo upload if provided
            if ($request->hasFile('photo_id')) {
                if ($user->photo_id) {
                    Storage::disk('public')->delete($user->photo_id);
                }
                
                $path = $request->file('photo_id')->store('profile-photos', 'public');
                $userData['photo_id'] = $path;
            }
            
            // Update the user record with all changes at once
            $user->update($userData);

            // Handle profile updates based on role
            switch($user->role) {
                case 'student':
                    $this->updateStudentProfile($user, $validatedData);
                    break;
                case 'osas_staff':
                    $this->updateStaffProfile($user, $validatedData);
                    break;
                case 'admin':
                    $this->updateAdminProfile($user, $validatedData);
                    break;
                default:
                    // Optional: Log or handle unexpected role
            }

            return to_route('profile.edit')->with('message', 'Profile updated successfully.');
            
        } catch (\Exception $e) {
            Log::error('Profile update failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $validatedData
            ]);
            
            return back()->withInput()->withErrors(['error' => $e->getMessage()]);
        }
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

    /**
     * Update the user's student profile.
     */
    private function updateStudentProfile($user, array $validatedData)
    {
        // Explicitly select student-specific fields based on StudentProfile model's fillable attributes
        // This list should be comprehensive and match the StudentProfile model's $fillable array
        $studentProfileFields = [
            'student_id', 'course', 'major', 'year_level', 'existing_scholarships',
            'civil_status', 'sex', 'date_of_birth', 'place_of_birth', 'street',
            'barangay', 'city', 'province', 'mobile_number', 'telephone_number',
            'is_pwd', 'disability_type', 'religion', 'residence_type', 'guardian_name',
            'status_of_parents',
            'father_name', 'father_age', 'father_address', 'father_telephone', 'father_mobile',
            'father_email', 'father_occupation', 'father_company', 'father_monthly_income',
            'father_years_service', 'father_education', 'father_school', 'father_unemployment_reason',
            'mother_name', 'mother_age', 'mother_address', 'mother_telephone', 'mother_mobile',
            'mother_email', 'mother_occupation', 'mother_company', 'mother_monthly_income',
            'mother_years_service', 'mother_education', 'mother_school', 'mother_unemployment_reason',
            'total_siblings', 'siblings', // 'siblings' might need special handling if it's JSON/array
            'combined_annual_pay_parents', 'combined_annual_pay_siblings', 'income_from_business',
            'income_from_land_rentals', 'income_from_building_rentals', 'retirement_benefits_pension',
            'commissions', 'support_from_relatives', 'bank_deposits', 'other_income_description',
            'other_income_amount', 'total_annual_income',
            'has_tv', 'has_radio_speakers_karaoke', 'has_musical_instruments', 'has_computer',
            'has_stove', 'has_laptop', 'has_refrigerator', 'has_microwave', 'has_air_conditioner',
            'has_electric_fan', 'has_washing_machine', 'has_cellphone', 'has_gaming_box', 'has_dslr_camera',
            'house_rental', 'food_grocery', 'car_loan_details', 'other_loan_details',
            'school_bus_payment', 'transportation_expense', 'education_plan_premiums',
            'insurance_policy_premiums', 'health_insurance_premium', 'sss_gsis_pagibig_loans',
            'clothing_expense', 'utilities_expense', 'communication_expense', 'helper_details',
            'driver_details', 'medicine_expense', 'doctor_expense', 'hospital_expense',
            'recreation_expense', 'other_monthly_expense_details', 'total_monthly_expenses',
            'annualized_monthly_expenses', 'school_tuition_fee', 'withholding_tax',
            'sss_gsis_pagibig_contribution', 'other_annual_expense_details',
            'subtotal_annual_expenses', 'total_annual_expenses',
            // Ensure all relevant fields from ProfileUpdateRequest and StudentProfile model are listed
            // For example, if 'water_expense', 'electricity_expense' etc. are separate, list them.
        ];
        
        $studentData = collect($validatedData)->only($studentProfileFields)->all();

        // Add special handling for boolean fields
        if (isset($studentData['is_pwd'])) {
            $studentData['is_pwd'] = $studentData['is_pwd'] === 'Yes';
        }
        
        // Handle 'siblings' if it's expected to be JSON
        if (isset($studentData['siblings']) && is_array($studentData['siblings'])) {
            $studentData['siblings'] = json_encode($studentData['siblings']);
        }

        // Update or create student profile
        $user->studentProfile()->updateOrCreate(['user_id' => $user->id], $studentData);
    }

    /**
     * Update the user's OSAS staff profile.
     */
    private function updateStaffProfile($user, array $validatedData)
    {
        $staffData = collect($validatedData)->only(['staff_id'])->all();
        
        // Update or create OSAS staff profile
        $user->osasStaffProfile()->updateOrCreate(['user_id' => $user->id], $staffData);
    }

    /**
     * Update the user's admin profile.
     */
    private function updateAdminProfile($user, array $validatedData)
    {
        $adminData = collect($validatedData)->only(['admin_id'])->all();

        if (!isset($adminData['admin_id'])) {
            // This check might be redundant if 'admin_id' is required by ProfileUpdateRequest for admins
            throw new \Exception('The admin ID field is required.');
        }

        // Update or create admin profile
        $user->adminProfile()->updateOrCreate(['user_id' => $user->id], $adminData);
    }
}
