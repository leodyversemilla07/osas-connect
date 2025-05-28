<?php

namespace App\Http\Controllers;

use App\Models\OsasStaffProfile;
use App\Models\StaffInvitation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class OsasStaffController extends Controller
{
    /**
     * Show the staff dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('osas_staff/dashboard');
    }

    /**
     * Show the invitation acceptance form.
     */
    public function showAcceptInvitationForm(Request $request, $token)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired invitation link.');
        }

        $invitation = StaffInvitation::where('token', $token)
            ->where('accepted_at', null)
            ->where('expires_at', '>', Carbon::now())
            ->firstOrFail();

        return Inertia::render('auth/accept-invitation', [
            'invitation' => [
                'email' => $invitation->email,
                'token' => $invitation->token,
            ],
        ]);
    }

    /**
     * Process the invitation acceptance.
     */
    public function acceptInvitation(Request $request)
    {
        $invitation = StaffInvitation::where('token', $request->token)
            ->where('accepted_at', null)
            ->where('expires_at', '>', Carbon::now())
            ->firstOrFail();

        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'staff_id' => ['required', 'string', 'max:255', 'unique:osas_staff_profiles'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_name' => $request->middle_name,
                'email' => $invitation->email,
                'password' => Hash::make($request->password),
                'role' => 'osas_staff',
            ]);

            // Create the staff profile
            OsasStaffProfile::create([
                'user_id' => $user->id,
                'staff_id' => $request->staff_id,
            ]);
            // Mark invitation as accepted
            $invitation->update([
                'accepted_at' => Carbon::now(),
                'status' => 'accepted',
            ]);

            DB::commit();

            // Log the user in
            \Illuminate\Support\Facades\Auth::login($user);

            return redirect()->route('osas.dashboard')->with('success', 'Welcome to OSAS Connect! Your account has been created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to process invitation: '.$e->getMessage()]);
        }
    }

    /**
     * Show the student records page.
     */
    public function studentRecords(Request $request): Response
    {
        $query = User::with('studentProfile')
            ->where('role', 'student');

        // Apply filters if provided
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhereHas('studentProfile', function ($q) use ($search) {
                        $q->where('student_id', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->course) {
            $query->whereHas('studentProfile', function ($q) use ($request) {
                $q->where('course', $request->course);
            });
        }

        if ($request->year_level) {
            $query->whereHas('studentProfile', function ($q) use ($request) {
                $q->where('year_level', $request->year_level);
            });
        }

        $students = $query->latest()
            ->paginate(10)
            ->withQueryString();

        // Transform each user to include avatar and student_profile details (similar to AdminController)
        $students->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'avatar' => $user->avatar, // This will utilize the getAvatarAttribute accessor from the User model
                'role' => 'Student',
                'student_profile' => $user->studentProfile ? [
                    'student_id' => $user->studentProfile->student_id,
                    'course' => $user->studentProfile->course,
                    'major' => $user->studentProfile->major,
                    'year_level' => $user->studentProfile->year_level,
                    'mobile_number' => $user->studentProfile->mobile_number,
                ] : null,
                'created_at' => $user->created_at,
            ];
        });

        $courses = [
            'Bachelor of Arts in Political Science',
            'Bachelor of Science in Tourism Management',
            'Bachelor of Science in Hospitality Management',
            'Bachelor of Science in Information Technology',
            'Bachelor of Science in Computer Engineering',
            'Bachelor of Science in Criminology',
            'Bachelor of Secondary Education',
            'Bachelor of Elementary Education',
            'Bachelor of Science in Fisheries',
        ];

        $yearLevels = [
            '1st Year',
            '2nd Year',
            '3rd Year',
            '4th Year',
        ];

        return Inertia::render('osas_staff/student-records', [
            'students' => $students,
            'filters' => [
                'search' => $request->search,
                'course' => $request->course,
                'year_level' => $request->year_level,
            ],
            'courses' => $courses,
            'yearLevels' => $yearLevels,
        ]);
    }

    /**
     * Show a specific user's profile.
     */
    public function getStudentDetails(User $user): Response
    {
        // Ensure the user is a student
        if ($user->role !== 'student') {
            abort(404, 'User not found or not a student.');
        }

        // Load the student profile with all necessary details
        $user->load('studentProfile');
        
        // Sanitize monetary fields before accessing them to prevent decimal casting errors
        if ($user->studentProfile) {
            $monetaryFields = [
                'father_monthly_income', 'mother_monthly_income',
                'combined_annual_pay_parents', 'combined_annual_pay_siblings',
                'income_from_business', 'income_from_land_rentals', 'income_from_building_rentals',
                'retirement_benefits_pension', 'commissions', 'support_from_relatives',
                'bank_deposits', 'other_income_amount', 'total_annual_income',
                'house_rental', 'food_grocery', 'school_bus_payment', 'transportation_expense',
                'education_plan_premiums', 'insurance_policy_premiums', 'health_insurance_premium',
                'sss_gsis_pagibig_loans', 'clothing_expense', 'utilities_expense',
                'communication_expense', 'medicine_expense', 'doctor_expense',
                'hospital_expense', 'recreation_expense', 'total_monthly_expenses',
                'annualized_monthly_expenses', 'school_tuition_fee', 'withholding_tax',
                'sss_gsis_pagibig_contribution', 'subtotal_annual_expenses', 'total_annual_expenses'
            ];
            
            // Get raw attributes and sanitize them
            $attributes = $user->studentProfile->getAttributes();
            $sanitizedAttributes = [];
            
            foreach ($attributes as $key => $value) {
                if (in_array($key, $monetaryFields)) {
                    // Convert non-numeric values to 0 to prevent decimal casting errors
                    if (is_null($value) || $value === '' || !is_numeric($value)) {
                        $sanitizedAttributes[$key] = '0.00';
                    } else {
                        $sanitizedAttributes[$key] = number_format((float)$value, 2, '.', '');
                    }
                } else {
                    $sanitizedAttributes[$key] = $value;
                }
            }
            
            // Handle boolean fields
            $booleanFields = [
                'is_pwd', 'has_tv', 'has_radio_speakers_karaoke', 'has_musical_instruments',
                'has_computer', 'has_stove', 'has_laptop', 'has_refrigerator',
                'has_microwave', 'has_air_conditioner', 'has_electric_fan',
                'has_washing_machine', 'has_cellphone', 'has_gaming_box', 'has_dslr_camera',
            ];
            
            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $sanitizedAttributes)) {
                    $sanitizedAttributes[$field] = (bool) $sanitizedAttributes[$field];
                } else {
                    $sanitizedAttributes[$field] = false;
                }
            }
            
            // Handle date fields
            if (isset($sanitizedAttributes['date_of_birth']) && $sanitizedAttributes['date_of_birth']) {
                try {
                    $sanitizedAttributes['date_of_birth'] = \Carbon\Carbon::parse($sanitizedAttributes['date_of_birth'])->format('Y-m-d');
                } catch (\Exception $e) {
                    $sanitizedAttributes['date_of_birth'] = null;
                }
            }
            
            // Handle siblings array data if exists
            if (isset($sanitizedAttributes['siblings']) && is_string($sanitizedAttributes['siblings'])) {
                $sanitizedAttributes['siblings'] = json_decode($sanitizedAttributes['siblings'], true) ?? [];
            } elseif (!isset($sanitizedAttributes['siblings'])) {
                $sanitizedAttributes['siblings'] = [];
            }
        }
        
        // Prepare base user data with all required fields
        $userData = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'avatar' => $user->avatar,
            'created_at' => $user->created_at,
            'full_name' => $user->full_name,
        ];
        
        // Organize student data by sections
        if ($user->studentProfile && isset($sanitizedAttributes)) {
            // Use sanitized attributes instead of model accessors to avoid casting errors
            $attrs = $sanitizedAttributes;
            
            // Academic Information section
            $academicInfo = [
                'student_id' => $attrs['student_id'] ?? null,
                'course' => $attrs['course'] ?? null,
                'major' => $attrs['major'] ?? null,
                'year_level' => $attrs['year_level'] ?? null,
                'scholarships' => $attrs['existing_scholarships'] ?? null,
            ];
            
            // Personal Information section
            $personalInfo = [
                'civil_status' => $attrs['civil_status'] ?? null,
                'sex' => $attrs['sex'] ?? null,
                'date_of_birth' => $attrs['date_of_birth'] ?? null,
                'place_of_birth' => $attrs['place_of_birth'] ?? null,
                'is_pwd' => $attrs['is_pwd'] ?? false,
                'disability_type' => $attrs['disability_type'] ?? null,
                'religion' => $attrs['religion'] ?? null,
                'residence_type' => $attrs['residence_type'] ?? null,
            ];
            
            // Contact Information section
            $contactInfo = [
                'mobile_number' => $attrs['mobile_number'] ?? null,
                'telephone_number' => $attrs['telephone_number'] ?? null,
                'email' => $user->email,
                'residence_type' => $attrs['residence_type'] ?? null,
            ];
            
            // Address Information section
            $addressInfo = [
                'street' => $attrs['street'] ?? null,
                'barangay' => $attrs['barangay'] ?? null,
                'city' => $attrs['city'] ?? null,
                'province' => $attrs['province'] ?? null,
            ];
            
            // Family Background section
            $familyInfo = [
                'status_of_parents' => $attrs['status_of_parents'] ?? null,
                'total_siblings' => $attrs['total_siblings'] ?? 0,
                'siblings' => $attrs['siblings'] ?? [],
                'guardian_name' => $attrs['guardian_name'] ?? null,
            ];
            
            // Father's Information section
            $fatherInfo = [
                'father_name' => $attrs['father_name'] ?? null,
                'father_age' => $attrs['father_age'] ?? null,
                'father_address' => $attrs['father_address'] ?? null,
                'father_telephone' => $attrs['father_telephone'] ?? null,
                'father_mobile' => $attrs['father_mobile'] ?? null,
                'father_email' => $attrs['father_email'] ?? null,
                'father_occupation' => $attrs['father_occupation'] ?? null,
                'father_company' => $attrs['father_company'] ?? null,
                'father_monthly_income' => $attrs['father_monthly_income'] ?? "0.00",
                'father_years_service' => $attrs['father_years_service'] ?? null,
                'father_education' => $attrs['father_education'] ?? null,
                'father_school' => $attrs['father_school'] ?? null,
                'father_unemployment_reason' => $attrs['father_unemployment_reason'] ?? null,
            ];
            
            // Mother's Information section
            $motherInfo = [
                'mother_name' => $attrs['mother_name'] ?? null,
                'mother_age' => $attrs['mother_age'] ?? null,
                'mother_address' => $attrs['mother_address'] ?? null,
                'mother_telephone' => $attrs['mother_telephone'] ?? null,
                'mother_mobile' => $attrs['mother_mobile'] ?? null,
                'mother_email' => $attrs['mother_email'] ?? null,
                'mother_occupation' => $attrs['mother_occupation'] ?? null,
                'mother_company' => $attrs['mother_company'] ?? null,
                'mother_monthly_income' => $attrs['mother_monthly_income'] ?? "0.00",
                'mother_years_service' => $attrs['mother_years_service'] ?? null,
                'mother_education' => $attrs['mother_education'] ?? null,
                'mother_school' => $attrs['mother_school'] ?? null,
                'mother_unemployment_reason' => $attrs['mother_unemployment_reason'] ?? null,
            ];
            
            // Income Information section
            $incomeInfo = [
                'combined_annual_pay_parents' => $attrs['combined_annual_pay_parents'] ?? "0.00",
                'combined_annual_pay_siblings' => $attrs['combined_annual_pay_siblings'] ?? "0.00",
                'income_from_business' => $attrs['income_from_business'] ?? "0.00",
                'income_from_land_rentals' => $attrs['income_from_land_rentals'] ?? "0.00",
                'income_from_building_rentals' => $attrs['income_from_building_rentals'] ?? "0.00",
                'retirement_benefits_pension' => $attrs['retirement_benefits_pension'] ?? "0.00",
                'commissions' => $attrs['commissions'] ?? "0.00",
                'support_from_relatives' => $attrs['support_from_relatives'] ?? "0.00",
                'bank_deposits' => $attrs['bank_deposits'] ?? "0.00",
                'other_income_description' => $attrs['other_income_description'] ?? null,
                'other_income_amount' => $attrs['other_income_amount'] ?? "0.00",
                'total_annual_income' => $attrs['total_annual_income'] ?? "0.00",
            ];
            
            // Home Appliances Information section
            $appliancesInfo = [
                'has_tv' => $attrs['has_tv'] ?? false,
                'has_radio_speakers_karaoke' => $attrs['has_radio_speakers_karaoke'] ?? false,
                'has_musical_instruments' => $attrs['has_musical_instruments'] ?? false,
                'has_computer' => $attrs['has_computer'] ?? false,
                'has_stove' => $attrs['has_stove'] ?? false,
                'has_laptop' => $attrs['has_laptop'] ?? false,
                'has_refrigerator' => $attrs['has_refrigerator'] ?? false,
                'has_microwave' => $attrs['has_microwave'] ?? false,
                'has_air_conditioner' => $attrs['has_air_conditioner'] ?? false,
                'has_electric_fan' => $attrs['has_electric_fan'] ?? false,
                'has_washing_machine' => $attrs['has_washing_machine'] ?? false,
                'has_cellphone' => $attrs['has_cellphone'] ?? false,
                'has_gaming_box' => $attrs['has_gaming_box'] ?? false,
                'has_dslr_camera' => $attrs['has_dslr_camera'] ?? false,
            ];
            
            // Expenses Information section
            $expensesInfo = [
                'house_rental' => $attrs['house_rental'] ?? "0.00",
                'food_grocery' => $attrs['food_grocery'] ?? "0.00",
                'car_loan_details' => $attrs['car_loan_details'] ?? null,
                'other_loan_details' => $attrs['other_loan_details'] ?? null,
                'school_bus_payment' => $attrs['school_bus_payment'] ?? "0.00",
                'transportation_expense' => $attrs['transportation_expense'] ?? "0.00",
                'education_plan_premiums' => $attrs['education_plan_premiums'] ?? "0.00",
                'insurance_policy_premiums' => $attrs['insurance_policy_premiums'] ?? "0.00",
                'health_insurance_premium' => $attrs['health_insurance_premium'] ?? "0.00",
                'sss_gsis_pagibig_loans' => $attrs['sss_gsis_pagibig_loans'] ?? "0.00",
                'clothing_expense' => $attrs['clothing_expense'] ?? "0.00",
                'utilities_expense' => $attrs['utilities_expense'] ?? "0.00",
                'communication_expense' => $attrs['communication_expense'] ?? "0.00",
                'helper_details' => $attrs['helper_details'] ?? null,
                'driver_details' => $attrs['driver_details'] ?? null,
                'medicine_expense' => $attrs['medicine_expense'] ?? "0.00",
                'doctor_expense' => $attrs['doctor_expense'] ?? "0.00",
                'hospital_expense' => $attrs['hospital_expense'] ?? "0.00",
                'recreation_expense' => $attrs['recreation_expense'] ?? "0.00",
                'other_monthly_expense_details' => $attrs['other_monthly_expense_details'] ?? null,
                'total_monthly_expenses' => $attrs['total_monthly_expenses'] ?? "0.00",
                'annualized_monthly_expenses' => $attrs['annualized_monthly_expenses'] ?? "0.00",
                'school_tuition_fee' => $attrs['school_tuition_fee'] ?? "0.00",
                'withholding_tax' => $attrs['withholding_tax'] ?? "0.00",
                'sss_gsis_pagibig_contribution' => $attrs['sss_gsis_pagibig_contribution'] ?? "0.00",
                'other_annual_expense_details' => $attrs['other_annual_expense_details'] ?? null,
                'subtotal_annual_expenses' => $attrs['subtotal_annual_expenses'] ?? "0.00",
                'total_annual_expenses' => $attrs['total_annual_expenses'] ?? "0.00",
            ];
            
            // Create a safe student profile object using sanitized attributes
            $safeStudentProfile = (object) $attrs;
            
            // Merge organized sections into user data
            $userData = array_merge($userData, [
                // Add sections to user data
                'academicInfo' => $academicInfo,
                'personalInfo' => $personalInfo,
                'contactInfo' => $contactInfo,
                'addressInfo' => $addressInfo,
                'familyInfo' => $familyInfo,
                'fatherInfo' => $fatherInfo,
                'motherInfo' => $motherInfo,
                'incomeInfo' => $incomeInfo,
                'appliancesInfo' => $appliancesInfo,
                'expensesInfo' => $expensesInfo,
                
                // Also add top-level fields for backward compatibility
                'student_id' => $attrs['student_id'] ?? null,
                'course' => $attrs['course'] ?? null,
                'major' => $attrs['major'] ?? null,
                'year_level' => $attrs['year_level'] ?? null,
                'scholarships' => $attrs['existing_scholarships'] ?? null,
                'civil_status' => $attrs['civil_status'] ?? null,
                'sex' => $attrs['sex'] ?? null,
                'mobile_number' => $attrs['mobile_number'] ?? null,
                'street' => $attrs['street'] ?? null,
                'barangay' => $attrs['barangay'] ?? null,
                'city' => $attrs['city'] ?? null,
                
                // Include the safe student profile for complete access
                'studentProfile' => $safeStudentProfile,
            ]);
        }

        return Inertia::render('osas_staff/student-details', [
            'user' => $userData,
        ]);
    }

    /**
     * Show the form for editing a student profile
     */
    public function editStudent(User $user): Response|RedirectResponse
    {
        // Ensure the user is a student
        if ($user->role !== 'student') {
            return redirect()->back()->withErrors(['error' => 'Only student profiles can be edited.']);
        }

        // Load the student profile
        $user->load('studentProfile');

        // Check if student profile exists
        if (!$user->studentProfile) {
            return redirect()->back()->withErrors(['error' => 'Student profile not found.']);
        }

        // Get photo URL from user record since photo_id is stored in users table
        $photoUrl = $user->photo_id ? \App\Services\StorageService::url($user->photo_id) : null;

        // Prepare the user data for student editing
        $userData = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'photo_url' => $photoUrl,
            'avatar' => $user->avatar,
            'full_name' => $user->full_name,
        ];

        // Process student profile data
        $studentProfileData = $user->studentProfile->toArray();
        
        // Ensure boolean fields are properly typed
        $booleanFields = [
            'is_pwd', 'has_tv', 'has_radio_speakers_karaoke', 'has_musical_instruments',
            'has_computer', 'has_stove', 'has_laptop', 'has_refrigerator',
            'has_microwave', 'has_air_conditioner', 'has_electric_fan',
            'has_washing_machine', 'has_cellphone', 'has_gaming_box', 'has_dslr_camera',
        ];

        foreach ($booleanFields as $field) {
            if (isset($studentProfileData[$field])) {
                $studentProfileData[$field] = (bool) $studentProfileData[$field];
            }
        }
        
        // Handle date fields
        if (isset($studentProfileData['date_of_birth']) && $studentProfileData['date_of_birth']) {
            try {
                $studentProfileData['date_of_birth'] = \Carbon\Carbon::parse($studentProfileData['date_of_birth'])->format('Y-m-d');
            } catch (\Exception $e) {
                $studentProfileData['date_of_birth'] = null;
            }
        }
        
        // Handle siblings array data if exists
        if (isset($studentProfileData['siblings']) && is_string($studentProfileData['siblings'])) {
            $studentProfileData['siblings'] = json_decode($studentProfileData['siblings'], true) ?? [];
        } elseif (!isset($studentProfileData['siblings'])) {
            $studentProfileData['siblings'] = [];
        }
        
        $userData['studentProfile'] = $studentProfileData;

        return Inertia::render('osas_staff/student-edit', [
            'user' => $userData,
        ]);
    }

    /**
     * Update the student profile
     */
    public function updateStudent(Request $request, User $user): RedirectResponse
    {
        // Ensure the user is a student
        if ($user->role !== 'student') {
            return redirect()->back()->withErrors(['error' => 'Only student profiles can be edited.']);
        }

        // Load the student profile
        $user->load('studentProfile');

        // Check if student profile exists
        if (!$user->studentProfile) {
            return redirect()->back()->withErrors(['error' => 'Student profile not found.']);
        }

        // Validate the request
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'student_id' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'major' => 'nullable|string|max:255',
            'year_level' => 'required|string|max:255',
            'existing_scholarships' => 'nullable|string',
            'civil_status' => 'required|string|max:255',
            'sex' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'place_of_birth' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:255',
            'telephone_number' => 'nullable|string|max:255',
            'is_pwd' => 'boolean',
            'disability_type' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'residence_type' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'status_of_parents' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'father_age' => 'nullable|integer|min:0|max:200',
            'father_address' => 'nullable|string|max:255',
            'father_telephone' => 'nullable|string|max:255',
            'father_mobile' => 'nullable|string|max:255',
            'father_email' => 'nullable|email|max:255',
            'father_occupation' => 'nullable|string|max:255',
            'father_company' => 'nullable|string|max:255',
            'father_monthly_income' => 'nullable|numeric|min:0',
            'father_education' => 'nullable|string|max:255',
            'father_school' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'mother_age' => 'nullable|integer|min:0|max:200',
            'mother_address' => 'nullable|string|max:255',
            'mother_telephone' => 'nullable|string|max:255',
            'mother_mobile' => 'nullable|string|max:255',
            'mother_email' => 'nullable|email|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'mother_company' => 'nullable|string|max:255',
            'mother_monthly_income' => 'nullable|numeric|min:0',
            'mother_education' => 'nullable|string|max:255',
            'mother_school' => 'nullable|string|max:255',
            'total_siblings' => 'nullable|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Update user basic information
            $user->update([
                'first_name' => $validatedData['first_name'],
                'middle_name' => $validatedData['middle_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
            ]);

            // Prepare student profile data
            $studentProfileData = array_filter($validatedData, function($key) {
                return !in_array($key, ['first_name', 'middle_name', 'last_name', 'email']);
            }, ARRAY_FILTER_USE_KEY);

            // Handle boolean fields
            $studentProfileData['is_pwd'] = $request->boolean('is_pwd');

            // Update student profile
            $user->studentProfile->update($studentProfileData);

            DB::commit();

            return redirect()->route('osas.students.details', $user->id)
                ->with('success', 'Student profile updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Failed to update student profile: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Show the scholarship records page.
     */
    public function scholarshipRecords(): Response
    {
        return Inertia::render('osas_staff/manage-scholarships');
    }

    /**
     * Show the events page for OSAS staff.
     */
    public function events(): Response
    {
        // You can load events data here as needed
        $events = [];

        return Inertia::render('osas_staff/events', [
            'events' => $events,
        ]);
    }

    /**
     * Show the reports page for OSAS staff.
     */
    public function reports(): Response
    {
        // You can load reports data here as needed
        $reports = [];

        return Inertia::render('osas_staff/reports', [
            'reports' => $reports,
        ]);
    }
}
