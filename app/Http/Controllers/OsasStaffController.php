<?php

namespace App\Http\Controllers;

use App\Models\OsasStaffProfile;
use App\Models\Scholarship;
use App\Models\StaffInvitation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // Sample announcements - replace with actual data from database
        $announcements = [
            [
                'id' => 1,
                'title' => 'Staff Meeting',
                'date' => '2025-04-10',
                'content' => 'Monthly staff meeting at 2:00 PM in the Conference Room.'
            ],
            [
                'id' => 2,
                'title' => 'Upcoming Training',
                'date' => '2025-04-18',
                'content' => 'Mandatory training session on the new student support system.'
            ]
        ];

        // Sample pending applications - replace with actual data from database
        $pendingApplications = [
            [
                'id' => 1,
                'studentName' => 'Maria Santos',
                'scholarshipName' => 'Academic Merit Scholarship',
                'dateSubmitted' => '2025-04-05',
                'status' => 'pending',
                'studentId' => 'ST-2025-1001'
            ],
            [
                'id' => 2,
                'studentName' => 'Juan Cruz',
                'scholarshipName' => 'Need-Based Financial Aid',
                'dateSubmitted' => '2025-04-03',
                'status' => 'pending',
                'studentId' => 'ST-2025-1042'
            ],
            [
                'id' => 3,
                'studentName' => 'Ana Reyes',
                'scholarshipName' => 'Student Assistantship Program',
                'dateSubmitted' => '2025-04-01',
                'status' => 'pending',
                'studentId' => 'ST-2025-1089'
            ]
        ];

        // Sample document submissions - replace with actual data from database
        $recentDocuments = [
            [
                'id' => 1,
                'studentName' => 'Pedro Garcia',
                'documentType' => 'Transcript of Records',
                'submissionDate' => '2025-04-07',
                'status' => 'pending'
            ],
            [
                'id' => 2,
                'studentName' => 'Sofia Lopez',
                'documentType' => 'Certificate of Registration',
                'submissionDate' => '2025-04-06',
                'status' => 'approved'
            ],
            [
                'id' => 3,
                'studentName' => 'Carlo Tan',
                'documentType' => 'Income Tax Return',
                'submissionDate' => '2025-04-05',
                'status' => 'rejected'
            ]
        ];

        return Inertia::render('osas_staff/dashboard', [
            'announcements' => $announcements,
            'pendingApplications' => $pendingApplications,
            'recentDocuments' => $recentDocuments,
        ]);
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
    public function scholarshipRecords(Request $request): Response
    {
        $query = \App\Models\Scholarship::withCount(['applications as total_applications'])
            ->withCount(['applications as approved_applications' => function ($query) {
                $query->where('status', 'approved');
            }]);

        // Apply search filter
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('type', 'like', '%' . $request->search . '%');
            });
        }

        // Apply status filter
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply type filter
        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        $scholarships = $query->paginate(15);

        // Transform scholarships data
        $scholarships->getCollection()->transform(function($scholarship) {
            return [
            'id' => $scholarship->id,
            'name' => $scholarship->name,
            'description' => $scholarship->description,
            'type' => $scholarship->type,
            'amount' => $scholarship->amount,
            'status' => $scholarship->status,
            'deadline' => $scholarship->deadline ? $scholarship->deadline->format('Y-m-d') : null,
            'slots' => $scholarship->slots,
            'slots_available' => $scholarship->slots_available,
            'beneficiaries' => $scholarship->beneficiaries,
            'funding_source' => $scholarship->funding_source,
            'eligibility_criteria' => $scholarship->eligibility_criteria,
            'required_documents' => $scholarship->required_documents,
            'stipend_schedule' => $scholarship->stipend_schedule,
            'criteria' => $scholarship->criteria,
            'renewal_criteria' => $scholarship->renewal_criteria,
            'formatted_criteria' => $scholarship->getFormattedEligibilityCriteria(),
            'total_applications' => $scholarship->total_applications,
            'approved_applications' => $scholarship->approved_applications,
            'remaining_slots' => $scholarship->getRemainingSlots(),
            'is_accepting_applications' => $scholarship->isAcceptingApplications(),
            'admin_remarks' => $scholarship->admin_remarks,
            'created_at' => $scholarship->created_at,
            'updated_at' => $scholarship->updated_at,
            ];
        });

        // Get statistics
        $totalScholarships = \App\Models\Scholarship::count();
        $activeScholarships = \App\Models\Scholarship::where('status', 'open')->count();
        $totalApplications = \App\Models\ScholarshipApplication::count();
        $totalBeneficiaries = \App\Models\ScholarshipApplication::where('status', 'approved')->count();

        $statistics = [
            'total_scholarships' => $totalScholarships,
            'active_scholarships' => $activeScholarships,
            'total_applications' => $totalApplications,
            'total_beneficiaries' => $totalBeneficiaries,
        ];

        return Inertia::render('osas_staff/manage-scholarships', [
            'scholarships' => $scholarships,
            'statistics' => $statistics,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'type' => $request->type,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the create scholarship form.
     */
    /**
     * Store a new scholarship.
     */
    public function storeScholarship(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,inactive,upcoming',
            'deadline' => 'nullable|date|after:today',
            'slots_available' => 'required|integer|min:1',
            'funding_source' => 'required|string|max:255',
            'criteria' => 'nullable|array',
            'criteria.*' => 'string',
            'required_documents' => 'nullable|array',
            'required_documents.*' => 'string',
        ]);

        $scholarship = Scholarship::create([
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'amount' => $request->amount,
            'status' => $request->status,
            'deadline' => $request->deadline,
            'slots' => $request->slots_available, // Map slots_available to slots
            'beneficiaries' => 0, // Default value
            'funding_source' => $request->funding_source,
            'eligibility_criteria' => $request->criteria, // Map criteria to eligibility_criteria
            'required_documents' => $request->required_documents,
            'stipend_schedule' => 'monthly', // Default value
            'slots_available' => $request->slots_available,
            'criteria' => $request->criteria, // Keep both for compatibility
        ]);

        return redirect()->route('osas.manage.scholarships')
            ->with('success', 'Scholarship created successfully!');
    }

    /**
     * Update an existing scholarship.
     */
    public function updateScholarship(Request $request, Scholarship $scholarship)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,inactive,upcoming',
            'deadline' => 'nullable|date',
            'slots_available' => 'required|integer|min:1',
            'funding_source' => 'required|string|max:255',
            'criteria' => 'nullable|array',
            'criteria.*' => 'string',
            'required_documents' => 'nullable|array',
            'required_documents.*' => 'string',
        ]);

        $scholarship->update([
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'amount' => $request->amount,
            'status' => $request->status,
            'deadline' => $request->deadline,
            'slots' => $request->slots_available, // Map slots_available to slots
            'funding_source' => $request->funding_source,
            'eligibility_criteria' => $request->criteria, // Map criteria to eligibility_criteria
            'required_documents' => $request->required_documents,
            'slots_available' => $request->slots_available,
            'criteria' => $request->criteria, // Keep both for compatibility
        ]);

        return redirect()->route('osas.manage.scholarships')
            ->with('success', 'Scholarship updated successfully!');
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

    /**
     * Show scholarship applications for review
     */
    public function scholarshipApplications(Request $request): Response
    {
        $query = \App\Models\ScholarshipApplication::with(['student.user', 'scholarship', 'documents'])
            ->latest();

        // Apply filters
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->scholarship_type) {
            $query->whereHas('scholarship', function($q) use ($request) {
                $q->where('type', $request->scholarship_type);
            });
        }

        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->search) {
            $query->whereHas('student.user', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            })->orWhereHas('student', function($q) use ($request) {
                $q->where('student_id', 'like', '%' . $request->search . '%');
            })->orWhereHas('scholarship', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'submitted_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        $applications = $query->paginate(15);

        // Transform applications data
        $applications->getCollection()->transform(function($application) {
            return [
                'id' => $application->id,
                'student' => [
                    'id' => $application->student->id,
                    'name' => $application->student->user->name,
                    'student_id' => $application->student->student_id,
                    'email' => $application->student->user->email,
                    'course' => $application->student->course,
                    'year_level' => $application->student->year_level,
                ],
                'scholarship' => [
                    'id' => $application->scholarship->id,
                    'name' => $application->scholarship->name,
                    'type' => $application->scholarship->type,
                    'amount' => $application->scholarship->amount,
                ],
                'status' => $application->status,
                'submitted_at' => $application->applied_at?->format('Y-m-d H:i:s') ?? $application->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $application->updated_at->format('Y-m-d H:i:s'),
                'priority' => $application->priority ?? 'medium',
                'documents_count' => $application->documents->count(),
                'verified_documents_count' => $application->documents->where('status', 'verified')->count(),
                'interview_scheduled' => $application->interview_schedule !== null,
                'deadline' => $application->scholarship->deadline,
                'reviewer' => $application->reviewer ? [
                    'name' => $application->reviewer->name,
                    'id' => $application->reviewer->id,
                ] : null,
            ];
        });

        // Get statistics with additional metrics
        $totalApplications = \App\Models\ScholarshipApplication::count();
        $thisMonthCount = \App\Models\ScholarshipApplication::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)->count();
        $lastMonthCount = \App\Models\ScholarshipApplication::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)->count();
        
        $completedApplications = \App\Models\ScholarshipApplication::whereIn('status', ['approved', 'rejected'])->count();
        $completionRate = $totalApplications > 0 ? ($completedApplications / $totalApplications) * 100 : 0;

        $statistics = [
            'total' => $totalApplications,
            'pending' => \App\Models\ScholarshipApplication::where('status', 'submitted')->count(),
            'under_review' => \App\Models\ScholarshipApplication::where('status', 'under_verification')->count(),
            'approved' => \App\Models\ScholarshipApplication::where('status', 'approved')->count(),
            'rejected' => \App\Models\ScholarshipApplication::where('status', 'rejected')->count(),
            'on_hold' => \App\Models\ScholarshipApplication::where('status', 'on_hold')->count(),
            'this_month_count' => $thisMonthCount,
            'last_month_count' => $lastMonthCount,
            'completion_rate' => round($completionRate, 1),
        ];

        return Inertia::render('osas_staff/applications', [
            'applications' => $applications,
            'statistics' => $statistics,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'scholarship_type' => $request->scholarship_type,
                'priority' => $request->priority,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
        ]);
    }

    /**
     * Show detailed application for review
     */
    public function reviewApplication(\App\Models\ScholarshipApplication $application): Response
    {
        $application->load(['student.user', 'scholarship', 'documents.verifiedBy', 'comments.user']);

        // Get application history/timeline
        $timeline = $this->buildApplicationTimeline($application);

        return Inertia::render('osas_staff/application-review', [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'priority' => $application->priority ?? 'medium',
                'submitted_at' => $application->applied_at?->format('Y-m-d H:i:s') ?? $application->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $application->updated_at->format('Y-m-d H:i:s'),
                'deadline' => $application->scholarship->deadline,
                'purpose_letter' => $application->purpose_letter,
                'academic_year' => $application->academic_year,
                'semester' => $application->semester,
                'verifier_comments' => $application->verifier_comments,
                'interview_scheduled' => $application->interview_schedule !== null,
                'interview_date' => $application->interview_schedule?->format('Y-m-d H:i:s'),
                'interview_notes' => $application->interview_notes,
                'student' => [
                    'id' => $application->student->id,
                    'name' => $application->student->user->name,
                    'student_id' => $application->student->student_id,
                    'email' => $application->student->user->email,
                    'phone' => $application->student->phone,
                    'course' => $application->student->course,
                    'year_level' => $application->student->year_level,
                    'major' => $application->student->major,
                    'gpa' => $application->student->gpa,
                    'address' => $application->student->address,
                    'photo_url' => $application->student->photo_url,
                ],
                'scholarship' => [
                    'id' => $application->scholarship->id,
                    'name' => $application->scholarship->name,
                    'type' => $application->scholarship->type,
                    'amount' => $application->scholarship->amount,
                    'description' => $application->scholarship->description,
                    'eligibility' => explode("\n", $application->scholarship->eligibility ?? ''),
                    'requirements' => explode("\n", $application->scholarship->requirements ?? ''),
                    'deadline' => $application->scholarship->deadline,
                ],
                'documents' => $application->documents->map(function($doc) {
                    return [
                        'id' => $doc->id,
                        'name' => $doc->type,
                        'type' => $doc->type,
                        'file_path' => $doc->file_path,
                        'original_name' => $doc->original_name,
                        'file_size' => $doc->file_size ?? 0,
                        'mime_type' => $doc->mime_type ?? 'application/pdf',
                        'is_verified' => $doc->status === 'verified',
                        'verified_at' => $doc->verified_at?->format('Y-m-d H:i:s'),
                        'verified_by' => $doc->verifiedBy ? [
                            'name' => $doc->verifiedBy->name ?? 'Unknown',
                            'id' => $doc->verifiedBy->id ?? 0,
                        ] : null,
                        'uploaded_at' => $doc->created_at->format('Y-m-d H:i:s'),
                        'status' => $doc->status ?? 'pending',
                        'comments' => $doc->verification_remarks,
                    ];
                }),
                'timeline' => $timeline,
                'progress' => [
                    'submitted' => true,
                    'documents_verified' => $application->documents->every(fn($doc) => $doc->status === 'verified'),
                    'interview_completed' => $application->interview_schedule !== null && $application->interview_notes !== null,
                    'review_completed' => in_array($application->status, ['approved', 'rejected']),
                ],
                'reviewer' => Auth::user() ? [
                    'name' => Auth::user()->name,
                    'id' => Auth::user()->id,
                ] : null,
                'comments' => $application->comments->map(function($comment) {
                    return [
                        'id' => $comment->id,
                        'comment' => $comment->comment,
                        'type' => $comment->type,
                        'user' => [
                            'name' => $comment->user->name,
                            'id' => $comment->user->id,
                        ],
                        'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
                        'created_at_human' => $comment->created_at->diffForHumans(),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update application status
     */
    public function updateApplicationStatus(Request $request, \App\Models\ScholarshipApplication $application)
    {
        $request->validate([
            'status' => ['required', 'in:submitted,under_verification,verified,under_evaluation,approved,rejected,incomplete'],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ]);

        $application->update([
            'status' => $request->status,
            'verifier_comments' => $request->feedback,
        ]);

        return back()->with('success', 'Application status updated successfully.');
    }

    /**
     * Verify document
     */
    public function verifyDocument(Request $request, \App\Models\Document $document)
    {
        $request->validate([
            'status' => ['required', 'in:verified,rejected'],
            'remarks' => ['nullable', 'string', 'max:500'],
        ]);

        $document->update([
            'status' => $request->status,
            'verification_remarks' => $request->remarks,
            'verified_at' => now(),
            'verified_by' => Auth::id(),
        ]);

        // Check if all documents are verified, update application status
        $application = $document->application;
        $allDocumentsVerified = $application->documents->every(function($doc) {
            return $doc->status === 'verified';
        });

        if ($allDocumentsVerified && $application->status === 'under_verification') {
            $application->update(['status' => 'verified']);
        }

        return back()->with('success', 'Document verification updated successfully.');
    }

    /**
     * Add comment to application
     */
    public function addApplicationComment(Request $request, \App\Models\ScholarshipApplication $application)
    {
        $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
            'type' => ['nullable', 'in:internal,student_visible'],
        ]);

        // Create application comment
        \App\Models\ApplicationComment::create([
            'application_id' => $application->id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'type' => $request->type ?? 'internal',
            'created_at' => now(),
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    /**
     * Export applications to CSV/Excel
     */
    public function exportApplications(Request $request)
    {
        $query = \App\Models\ScholarshipApplication::with(['student.user', 'scholarship', 'documents'])
            ->latest();

        // Apply same filters as the main applications page
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->scholarship_type) {
            $query->whereHas('scholarship', function($q) use ($request) {
                $q->where('type', $request->scholarship_type);
            });
        }

        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->search) {
            $query->whereHas('student.user', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            })->orWhereHas('student', function($q) use ($request) {
                $q->where('student_id', 'like', '%' . $request->search . '%');
            })->orWhereHas('scholarship', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $applications = $query->get();

        $filename = 'scholarship_applications_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $columns = [
            'Application ID',
            'Student Name',
            'Student ID',
            'Email',
            'Course',
            'Year Level',
            'Scholarship Name',
            'Scholarship Type',
            'Amount',
            'Status',
            'Priority',
            'Documents Count',
            'Verified Documents',
            'Submitted Date',
            'Last Updated',
            'Deadline',
        ];

        $callback = function() use ($applications, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($applications as $application) {
                $row = [
                    $application->id,
                    $application->student->user->name,
                    $application->student->student_id,
                    $application->student->user->email,
                    $application->student->course,
                    $application->student->year_level,
                    $application->scholarship->name,
                    $application->scholarship->type,
                    $application->scholarship->amount,
                    ucfirst(str_replace('_', ' ', $application->status)),
                    ucfirst($application->priority ?? 'medium'),
                    $application->documents->count(),
                    $application->documents->where('status', 'verified')->count(),
                    $application->applied_at?->format('Y-m-d H:i:s') ?? $application->created_at->format('Y-m-d H:i:s'),
                    $application->updated_at->format('Y-m-d H:i:s'),
                    $application->scholarship->deadline,
                ];
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function buildApplicationTimeline($application): array
    {
        $timeline = [
            [
                'title' => 'Application Created',
                'description' => 'Student started the application process.',
                'date' => $application->created_at->format('F j, Y'),
                'status' => 'completed',
                'icon' => 'document-plus',
            ],
        ];

        if ($application->applied_at) {
            $timeline[] = [
                'title' => 'Application Submitted',
                'description' => 'Application submitted for review.',
                'date' => $application->applied_at->format('F j, Y'),
                'status' => 'completed',
                'icon' => 'check-circle',
            ];
        }

        if (in_array($application->status, ['under_verification', 'verified', 'under_evaluation', 'approved', 'rejected'])) {
            $timeline[] = [
                'title' => 'Under Verification',
                'description' => 'Documents are being verified by OSAS staff.',
                'date' => null,
                'status' => $application->status === 'under_verification' ? 'current' : 'completed',
                'icon' => 'eye',
            ];
        }

        if (in_array($application->status, ['verified', 'under_evaluation', 'approved', 'rejected'])) {
            $timeline[] = [
                'title' => 'Documents Verified',
                'description' => 'All documents have been verified.',
                'date' => null,
                'status' => $application->status === 'verified' ? 'current' : 'completed',
                'icon' => 'document-check',
            ];
        }

        if (in_array($application->status, ['under_evaluation', 'approved', 'rejected'])) {
            $timeline[] = [
                'title' => 'Under Evaluation',
                'description' => 'Application is being evaluated by the committee.',
                'date' => null,
                'status' => $application->status === 'under_evaluation' ? 'current' : 'completed',
                'icon' => 'academic-cap',
            ];
        }

        if ($application->status === 'approved') {
            $timeline[] = [
                'title' => 'Application Approved',
                'description' => 'Application has been approved for scholarship.',
                'date' => null,
                'status' => 'completed',
                'icon' => 'check-badge',
            ];
        } elseif ($application->status === 'rejected') {
            $timeline[] = [
                'title' => 'Application Rejected',
                'description' => 'Application was not approved.',
                'date' => null,
                'status' => 'completed',
                'icon' => 'x-circle',
            ];
        }

        return $timeline;
    }
}
