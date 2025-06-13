<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StaffInvitation;
use App\Models\User;
use App\Services\StorageService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        // Get counts for dashboard stats
        $totalStudents = User::where('role', 'student')->count();
        $totalStaff = User::where('role', 'osas_staff')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $pendingInvitations = StaffInvitation::where('status', 'pending')->count();

        // Get scholarship and application stats
        $totalScholarships = Scholarship::count();
        $totalApplications = ScholarshipApplication::count();
        $pendingApplications = ScholarshipApplication::where('status', 'submitted')->count();
        $approvedApplications = ScholarshipApplication::where('status', 'approved')->count();
        $rejectedApplications = ScholarshipApplication::where('status', 'rejected')->count();

        // Calculate funding and success rate
        $totalFundsAllocated = ScholarshipApplication::where('status', 'approved')
            ->sum('amount_received') ?? 0;
        $applicationSuccessRate = $totalApplications > 0
            ? round(($approvedApplications / $totalApplications) * 100)
            : 0;

        // Documents needing verification (you may need to adjust this based on your actual document system)
        $documentsNeedingVerification = 0; // Placeholder - implement based on your document verification system

        // Get recent logins (last 10)
        $recentLogins = User::whereNotNull('updated_at')
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => (string) $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => ucfirst(str_replace('_', ' ', $user->role)),
                    'timestamp' => $user->updated_at->toISOString(),
                ];
            });

        // Get pending invitations (last 10)
        $pendingInvitationsList = StaffInvitation::where('status', 'pending')
            ->with('inviter')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($invitation) {
                return [
                    'id' => (string) $invitation->id,
                    'email' => $invitation->email,
                    'role' => ucfirst(str_replace('_', ' ', $invitation->role)),
                    'sentDate' => $invitation->created_at->toISOString(),
                    'status' => $invitation->status,
                ];
            });

        // Get recent applications (last 10)
        $recentApplications = ScholarshipApplication::with(['user', 'scholarship'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => (string) $application->id,
                    'student' => $application->user->full_name,
                    'scholarshipName' => $application->scholarship->name,
                    'status' => ucfirst($application->status),
                    'submittedDate' => $application->created_at->toISOString(),
                ];
            });

        // Generate pending tasks based on actual system data
        $pendingTasks = collect();

        if ($pendingApplications > 0) {
            $pendingTasks->push([
                'id' => 'task_applications',
                'type' => 'Application Review',
                'description' => "Review {$pendingApplications} pending scholarship applications",
                'deadline' => null,
                'priority' => 'high',
            ]);
        }

        if ($documentsNeedingVerification > 0) {
            $pendingTasks->push([
                'id' => 'task_documents',
                'type' => 'Document Verification',
                'description' => "Verify {$documentsNeedingVerification} submitted documents",
                'deadline' => null,
                'priority' => 'medium',
            ]);
        }

        if ($pendingInvitations > 0) {
            $pendingTasks->push([
                'id' => 'task_invitations',
                'type' => 'Staff Invitations',
                'description' => "Follow up on {$pendingInvitations} pending staff invitations",
                'deadline' => null,
                'priority' => 'low',
            ]);
        }

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'totalStaff' => $totalStaff,
                'totalAdmins' => $totalAdmins,
                'pendingInvitations' => $pendingInvitations,
                'totalScholarships' => $totalScholarships,
                'totalApplications' => $totalApplications,
                'pendingApplications' => $pendingApplications,
                'approvedApplications' => $approvedApplications,
                'rejectedApplications' => $rejectedApplications,
                'totalFundsAllocated' => $totalFundsAllocated,
                'applicationSuccessRate' => $applicationSuccessRate,
                'documentsNeedingVerification' => $documentsNeedingVerification,
            ],
            'recentLogins' => $recentLogins->toArray(),
            'pendingInvitations' => $pendingInvitationsList->toArray(),
            'recentApplications' => $recentApplications->toArray(),
            'pendingTasks' => $pendingTasks->toArray(),
        ]);
    }

    /**
     * Display a listing of all students.
     */
    public function students(Request $request): Response
    {
        $search = $request->query('search');
        $currentUserId = Auth::id();

        // Always eager‐load the student profile
        $query = User::with('studentProfile')
            ->where('role', '=', 'student')  // Only show students
            ->where('id', '!=', $currentUserId)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('studentProfile', function ($query) use ($search) {
                            $query->where('student_id', 'like', "%{$search}%")
                                ->orWhere('course', 'like', "%{$search}%");
                        });
                });
            });

        $users = $query->orderBy('last_name')
            ->paginate(10)
            ->withQueryString();

        // Transform each user to include course, year_level, created_at, avatar, and student_profile details
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'avatar' => $user->avatar, // This will utilize the getAvatarAttribute accessor from the User model
                'role' => 'Student', // Role is determined by the query context
                'student_profile' => $user->studentProfile ? [
                    'student_id' => $user->studentProfile->student_id,
                    'course' => $user->studentProfile->course,
                    'major' => $user->studentProfile->major,
                    'year_level' => $user->studentProfile->year_level,
                    'mobile_number' => $user->studentProfile->mobile_number,
                    // Add any other student_profile fields needed by the frontend here
                ] : null,
                'created_at' => $user->created_at,
                // Ensure all fields expected by student-management/columns.tsx are present
            ];
        });

        return Inertia::render('admin/manage-students', [
            'students' => $users, // Changed from 'users' to 'students'
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show a specific user's profile.
     */
    public function showUser(User $user): Response
    {
        // Load the appropriate profile based on user role
        if ($user->role === 'student') {
            // For students, load the student profile with all necessary details
            $user->load('studentProfile');

            // Sanitize monetary fields before accessing them to prevent decimal casting errors
            if ($user->studentProfile) {
                $monetaryFields = [
                    'father_monthly_income',
                    'mother_monthly_income',
                    'combined_annual_pay_parents',
                    'combined_annual_pay_siblings',
                    'income_from_business',
                    'income_from_land_rentals',
                    'income_from_building_rentals',
                    'retirement_benefits_pension',
                    'commissions',
                    'support_from_relatives',
                    'bank_deposits',
                    'other_income_amount',
                    'total_annual_income',
                    'house_rental',
                    'food_grocery',
                    'school_bus_payment',
                    'transportation_expense',
                    'education_plan_premiums',
                    'insurance_policy_premiums',
                    'health_insurance_premium',
                    'sss_gsis_pagibig_loans',
                    'clothing_expense',
                    'utilities_expense',
                    'communication_expense',
                    'medicine_expense',
                    'doctor_expense',
                    'hospital_expense',
                    'recreation_expense',
                    'total_monthly_expenses',
                    'annualized_monthly_expenses',
                    'school_tuition_fee',
                    'withholding_tax',
                    'sss_gsis_pagibig_contribution',
                    'subtotal_annual_expenses',
                    'total_annual_expenses',
                ];

                // Get raw attributes and sanitize them
                $attributes = $user->studentProfile->getAttributes();
                $sanitizedAttributes = [];

                foreach ($attributes as $key => $value) {
                    if (in_array($key, $monetaryFields)) {
                        // Convert non-numeric values to 0 to prevent decimal casting errors
                        if (is_null($value) || $value === '' || ! is_numeric($value)) {
                            $sanitizedAttributes[$key] = '0.00';
                        } else {
                            $sanitizedAttributes[$key] = number_format((float) $value, 2, '.', '');
                        }
                    } else {
                        $sanitizedAttributes[$key] = $value;
                    }
                }

                // Handle boolean fields
                $booleanFields = [
                    'is_pwd',
                    'has_tv',
                    'has_radio_speakers_karaoke',
                    'has_musical_instruments',
                    'has_computer',
                    'has_stove',
                    'has_laptop',
                    'has_refrigerator',
                    'has_microwave',
                    'has_air_conditioner',
                    'has_electric_fan',
                    'has_washing_machine',
                    'has_cellphone',
                    'has_gaming_box',
                    'has_dslr_camera',
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
                } elseif (! isset($sanitizedAttributes['siblings'])) {
                    $sanitizedAttributes['siblings'] = [];
                }
            }
        } else {
            // For staff members, load the appropriate profile
            if ($user->role === 'osas_staff') {
                $user->load('osasStaffProfile');
            } elseif ($user->role === 'admin') {
                $user->load('adminProfile');
            } else {
                // Fallback for any other role types - construct the relationship name carefully
                $relationshipName = $user->role.'Profile';
                if (method_exists($user, $relationshipName)) {
                    $user->load($relationshipName);
                }
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

        // Organize data by sections for better frontend structure
        if ($user->role === 'student' && $user->studentProfile && isset($sanitizedAttributes)) {
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
                'father_monthly_income' => $attrs['father_monthly_income'] ?? '0.00',
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
                'mother_monthly_income' => $attrs['mother_monthly_income'] ?? '0.00',
                'mother_years_service' => $attrs['mother_years_service'] ?? null,
                'mother_education' => $attrs['mother_education'] ?? null,
                'mother_school' => $attrs['mother_school'] ?? null,
                'mother_unemployment_reason' => $attrs['mother_unemployment_reason'] ?? null,
            ];

            // Income Information section
            $incomeInfo = [
                'combined_annual_pay_parents' => $attrs['combined_annual_pay_parents'] ?? '0.00',
                'combined_annual_pay_siblings' => $attrs['combined_annual_pay_siblings'] ?? '0.00',
                'income_from_business' => $attrs['income_from_business'] ?? '0.00',
                'income_from_land_rentals' => $attrs['income_from_land_rentals'] ?? '0.00',
                'income_from_building_rentals' => $attrs['income_from_building_rentals'] ?? '0.00',
                'retirement_benefits_pension' => $attrs['retirement_benefits_pension'] ?? '0.00',
                'commissions' => $attrs['commissions'] ?? '0.00',
                'support_from_relatives' => $attrs['support_from_relatives'] ?? '0.00',
                'bank_deposits' => $attrs['bank_deposits'] ?? '0.00',
                'other_income_description' => $attrs['other_income_description'] ?? null,
                'other_income_amount' => $attrs['other_income_amount'] ?? '0.00',
                'total_annual_income' => $attrs['total_annual_income'] ?? '0.00',
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
                'house_rental' => $attrs['house_rental'] ?? '0.00',
                'food_grocery' => $attrs['food_grocery'] ?? '0.00',
                'car_loan_details' => $attrs['car_loan_details'] ?? null,
                'other_loan_details' => $attrs['other_loan_details'] ?? null,
                'school_bus_payment' => $attrs['school_bus_payment'] ?? '0.00',
                'transportation_expense' => $attrs['transportation_expense'] ?? '0.00',
                'education_plan_premiums' => $attrs['education_plan_premiums'] ?? '0.00',
                'insurance_policy_premiums' => $attrs['insurance_policy_premiums'] ?? '0.00',
                'health_insurance_premium' => $attrs['health_insurance_premium'] ?? '0.00',
                'sss_gsis_pagibig_loans' => $attrs['sss_gsis_pagibig_loans'] ?? '0.00',
                'clothing_expense' => $attrs['clothing_expense'] ?? '0.00',
                'utilities_expense' => $attrs['utilities_expense'] ?? '0.00',
                'communication_expense' => $attrs['communication_expense'] ?? '0.00',
                'helper_details' => $attrs['helper_details'] ?? null,
                'driver_details' => $attrs['driver_details'] ?? null,
                'medicine_expense' => $attrs['medicine_expense'] ?? '0.00',
                'doctor_expense' => $attrs['doctor_expense'] ?? '0.00',
                'hospital_expense' => $attrs['hospital_expense'] ?? '0.00',
                'recreation_expense' => $attrs['recreation_expense'] ?? '0.00',
                'other_monthly_expense_details' => $attrs['other_monthly_expense_details'] ?? null,
                'total_monthly_expenses' => $attrs['total_monthly_expenses'] ?? '0.00',
                'annualized_monthly_expenses' => $attrs['annualized_monthly_expenses'] ?? '0.00',
                'school_tuition_fee' => $attrs['school_tuition_fee'] ?? '0.00',
                'withholding_tax' => $attrs['withholding_tax'] ?? '0.00',
                'sss_gsis_pagibig_contribution' => $attrs['sss_gsis_pagibig_contribution'] ?? '0.00',
                'other_annual_expense_details' => $attrs['other_annual_expense_details'] ?? null,
                'subtotal_annual_expenses' => $attrs['subtotal_annual_expenses'] ?? '0.00',
                'total_annual_expenses' => $attrs['total_annual_expenses'] ?? '0.00',
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
        } elseif ($user->role === 'osas_staff' && $user->osasStaffProfile) {
            // For OSAS staff members, organize data by sections
            $staffInfo = [
                'staff_id' => $user->osasStaffProfile->staff_id,
            ];

            // Merge organized sections into user data
            $userData = array_merge($userData, [
                'staffInfo' => $staffInfo,

                // Also add top-level fields for backward compatibility
                'staff_id' => $user->osasStaffProfile->staff_id,
                'osasStaffProfile' => $user->osasStaffProfile,
            ]);
        } elseif ($user->role === 'admin' && $user->adminProfile) {
            // For admin users, organize data by sections
            $adminInfo = [
                'admin_id' => $user->adminProfile->admin_id,
            ];

            // Merge organized sections into user data
            $userData = array_merge($userData, [
                'adminInfo' => $adminInfo,

                // Also add top-level fields for backward compatibility
                'admin_id' => $user->adminProfile->admin_id,
                'adminProfile' => $user->adminProfile,
            ]);
        }

        return Inertia::render('admin/user-profile', [
            'user' => $userData,
        ]);
    }

    /**
     * Show the form for editing a user.
     */
    public function editUser(User $user): Response|RedirectResponse
    {
        // Redirect admin users back as they cannot be edited
        if ($user->isAdmin()) {
            return redirect()->back()->withErrors(['error' => 'Admin profiles cannot be edited.']);
        }

        // Load the appropriate profile based on user role
        switch ($user->role) {
            case 'student':
                $user->load('studentProfile');
                break;
            case 'osas_staff':
                $user->load('osasStaffProfile');
                break;
            case 'admin':
                $user->load('adminProfile');
                break;
        }

        // Get photo URL from user record since photo_id is stored in users table
        $photoUrl = $user->photo_id ? StorageService::url($user->photo_id) : null;

        // Prepare the base user data
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

        if ($user->role === 'student' && $user->studentProfile) {
            // Ensure boolean fields are properly typed for student profiles
            $studentProfileData = $user->studentProfile->toArray();

            $booleanFields = [
                'is_pwd',
                'has_tv',
                'has_radio_speakers_karaoke',
                'has_musical_instruments',
                'has_computer',
                'has_stove',
                'has_laptop',
                'has_refrigerator',
                'has_microwave',
                'has_air_conditioner',
                'has_electric_fan',
                'has_washing_machine',
                'has_cellphone',
                'has_gaming_box',
                'has_dslr_camera',
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
            } elseif (! isset($studentProfileData['siblings'])) {
                $studentProfileData['siblings'] = [];
            }

            $userData['studentProfile'] = $studentProfileData;
        } elseif ($user->role === 'osas_staff' && $user->osasStaffProfile) {
            $userData['osasStaffProfile'] = $user->osasStaffProfile->toArray();
        } elseif ($user->role === 'admin' && $user->adminProfile) {
            $userData['adminProfile'] = $user->adminProfile->toArray();
        } else {
            // Profile not found for the user role
            return redirect()->back()->withErrors(['error' => 'User profile not found.']);
        }

        return Inertia::render('admin/edit-user-profile', [
            'user' => $userData,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function updateUser(Request $request, User $user): RedirectResponse
    {
        // Don't allow updating admin users
        if ($user->isAdmin()) {
            return back()->withErrors(['error' => 'Admin profiles cannot be edited.']);
        }

        // Validate common user data
        $commonRules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ];

        // Add role-specific validation rules
        if ($user->role === 'student') {
            $rules = array_merge($commonRules, [
                // Academic Information
                'student_id' => ['required', 'string', 'max:255', 'unique:student_profiles,student_id,'.$user->studentProfile->id],
                'course' => ['required', 'string', 'max:255'],
                'major' => ['nullable', 'string', 'max:255'],
                'year_level' => ['required', 'string', 'in:1st Year,2nd Year,3rd Year,4th Year'],
                'existing_scholarships' => ['nullable', 'string'],

                // Personal Information
                'civil_status' => ['required', 'string', 'in:Single,Married,Widowed,Separated,Annulled'],
                'sex' => ['required', 'string', 'in:Male,Female'],
                'date_of_birth' => ['nullable', 'date'],
                'place_of_birth' => ['nullable', 'string', 'max:255'],
                'mobile_number' => ['nullable', 'string', 'max:255'],
                'telephone_number' => ['nullable', 'string', 'max:255'],
                'is_pwd' => ['nullable', 'boolean'],
                'disability_type' => ['nullable', 'string', 'max:255'],
                'religion' => ['nullable', 'string', 'max:255'],
                'residence_type' => ['nullable', 'string', 'max:255'],
                'guardian_name' => ['nullable', 'string', 'max:255'],

                // Address Information
                'street' => ['nullable', 'string', 'max:255'],
                'barangay' => ['nullable', 'string', 'max:255'],
                'city' => ['nullable', 'string', 'max:255'],
                'province' => ['nullable', 'string', 'max:255'],

                // Family Background
                'status_of_parents' => ['nullable', 'string', 'max:255'],
                'total_siblings' => ['nullable', 'integer', 'min:0'],

                // Father's Information
                'father_name' => ['nullable', 'string', 'max:255'],
                'father_age' => ['nullable', 'integer', 'min:0', 'max:120'],
                'father_address' => ['nullable', 'string', 'max:255'],
                'father_telephone' => ['nullable', 'string', 'max:255'],
                'father_mobile' => ['nullable', 'string', 'max:255'],
                'father_email' => ['nullable', 'email', 'max:255'],
                'father_occupation' => ['nullable', 'string', 'max:255'],
                'father_company' => ['nullable', 'string', 'max:255'],
                'father_monthly_income' => ['nullable', 'numeric', 'min:0'],
                'father_education' => ['nullable', 'string', 'max:255'],
                'father_school' => ['nullable', 'string', 'max:255'],

                // Mother's Information
                'mother_name' => ['nullable', 'string', 'max:255'],
                'mother_age' => ['nullable', 'integer', 'min:0', 'max:120'],
                'mother_address' => ['nullable', 'string', 'max:255'],
                'mother_telephone' => ['nullable', 'string', 'max:255'],
                'mother_mobile' => ['nullable', 'string', 'max:255'],
                'mother_email' => ['nullable', 'email', 'max:255'],
                'mother_occupation' => ['nullable', 'string', 'max:255'],
                'mother_company' => ['nullable', 'string', 'max:255'],
                'mother_monthly_income' => ['nullable', 'numeric', 'min:0'],
                'mother_education' => ['nullable', 'string', 'max:255'],
                'mother_school' => ['nullable', 'string', 'max:255'],
            ]);
        } elseif ($user->role === 'osas_staff') {
            $rules = array_merge($commonRules, [
                'staff_id' => ['required', 'string', 'max:255', 'unique:osas_staff_profiles,staff_id,'.$user->osasStaffProfile->id],
            ]);
        } else {
            return back()->withErrors(['error' => 'Invalid user role.']);
        }

        // Validate request data
        $validatedData = $request->validate($rules);

        // Begin transaction
        DB::beginTransaction();
        try {
            // Update user record
            $user->update([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'middle_name' => $validatedData['middle_name'] ?? null,
                'email' => $validatedData['email'],
            ]);

            // Update profile record based on role
            if ($user->role === 'student' && $user->studentProfile) {
                // Filter out user fields from student profile data
                $profileFields = array_diff_key(
                    $validatedData,
                    array_flip(['first_name', 'middle_name', 'last_name', 'email'])
                );

                // Ensure boolean fields are properly handled
                $booleanFields = ['is_pwd'];
                foreach ($booleanFields as $field) {
                    if (array_key_exists($field, $profileFields)) {
                        $profileFields[$field] = (bool) $profileFields[$field];
                    }
                }

                // Update the student profile with all comprehensive fields
                $user->studentProfile->update($profileFields);
            } elseif ($user->role === 'osas_staff' && $user->osasStaffProfile) {
                $user->osasStaffProfile->update([
                    'staff_id' => $validatedData['staff_id'],
                ]);
            }

            DB::commit();

            // Redirect to the appropriate show route
            $routeName = $user->role === 'student' ? 'admin.students.show' : 'admin.staff.show';

            return redirect()->route($routeName, $user)
                ->with('message', 'User profile updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Failed to update user: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove a user from the system.
     */
    public function destroyUser(User $user)
    {
        $user->delete();

        // Redirect to the appropriate page based on user role
        $redirectRoute = $user->role === 'student' ? 'admin.students' : 'admin.staff';

        return redirect()->route($redirectRoute)
            ->with('message', 'User successfully deleted.');
    }

    /**
     * Display a listing of all OSAS staff members and pending invitations.
     */
    public function staff(Request $request): Response
    {
        $search = $request->query('search');
        $currentUserId = Auth::id();

        // Query for OSAS staff members
        $staffQuery = User::with('osasStaffProfile')
            ->where('role', '=', 'osas_staff')
            ->where('id', '!=', $currentUserId)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });

        $staffMembers = $staffQuery->orderBy('last_name')->get();

        // Query for all staff invitations (regardless of status)
        $invitationsQuery = StaffInvitation::with('inviter')
            ->when($search, function ($query) use ($search) {
                $query->where('email', 'like', "%{$search}%");
            });

        $allInvitations = $invitationsQuery->orderBy('created_at', 'desc')->get();

        // Combine staff and invitations into unified collection
        $combinedData = collect();

        // Add staff members
        foreach ($staffMembers as $user) {
            $combinedData->push([
                'id' => $user->id,
                'type' => 'staff',
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'avatar' => $user->avatar,
                'status' => 'active',
                'osas_staff_profile' => [
                    'staff_id' => $user->osasStaffProfile->staff_id ?? null,
                ],
            ]);
        }

        // Add all invitations (regardless of status)
        foreach ($allInvitations as $invitation) {
            $combinedData->push([
                'id' => 'invitation_'.$invitation->id,
                'type' => 'invitation',
                'first_name' => null,
                'last_name' => null,
                'email' => $invitation->email,
                'created_at' => $invitation->created_at,
                'avatar' => null,
                'status' => $invitation->status,
                'expires_at' => $invitation->expires_at,
                'invitation_id' => $invitation->id,
                'inviter' => [
                    'id' => $invitation->inviter->id,
                    'first_name' => $invitation->inviter->first_name,
                    'last_name' => $invitation->inviter->last_name,
                ],
            ]);
        }

        // Sort combined data by creation date (newest first)
        $combinedData = $combinedData->sortByDesc('created_at')->values();

        // Manual pagination for combined data
        $perPage = 10;
        $currentPage = $request->get('page', 1);
        $total = $combinedData->count();
        $offset = ($currentPage - 1) * $perPage;
        $paginatedData = $combinedData->slice($offset, $perPage)->values();

        $paginationData = [
            'data' => $paginatedData,
            'current_page' => $currentPage,
            'from' => $offset + 1,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'to' => min($offset + $perPage, $total),
            'total' => $total,
        ];

        return Inertia::render('admin/manage-staff', [
            'staff' => $paginationData,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Send an invitation to a new OSAS staff member.
     */
    public function sendInvitation(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email|unique:staff_invitations,email,NULL,id,accepted_at,NULL',
        ], [
            'email.unique' => 'This email is already associated with an existing user or has a pending invitation.',
        ]);        // Generate invitation token with 48-hour expiry
        $invitation = StaffInvitation::create([
            'email' => $request->email,
            'token' => StaffInvitation::generateToken(),
            'invited_by' => Auth::id(),
            'role' => 'osas_staff',
            'expires_at' => Carbon::now()->addHours(48),
            'status' => 'pending',
        ]);

        // Send invitation email
        Mail::to($request->email)->send(new \App\Mail\StaffInvitation($invitation));

        return back()->with('success', 'Invitation sent successfully.');
    }

    /**
     * Permanently delete a staff invitation.
     */
    public function destroyInvitation(StaffInvitation $invitation)
    {
        $invitation->delete();

        return back()->with('success', 'Invitation deleted successfully.');
    }

    /**
     * Revoke a staff invitation.
     */
    public function revokeInvitation(StaffInvitation $invitation)
    {
        $invitation->delete();

        return back()->with('success', 'Invitation revoked and removed successfully.');
    }

    /**
     * Resend a staff invitation.
     */
    public function resendInvitation(StaffInvitation $invitation)
    {
        // Update expiration date
        $invitation->update([
            'expires_at' => Carbon::now()->addHours(48),
        ]);

        // Resend invitation email
        Mail::to($invitation->email)->send(new \App\Mail\StaffInvitation($invitation));

        return back()->with('success', 'Invitation resent successfully.');
    }

    /**
     * Display a listing of all scholarships for admin overview.
     */
    public function scholarships(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $type = $request->query('type');

        $query = Scholarship::withCount(['applications'])
            ->with(['applications' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('type', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($type, function ($query) use ($type) {
                $query->where('type', $type);
            });

        $scholarships = $query->latest()->paginate(15)->withQueryString();

        $scholarships->getCollection()->transform(function ($scholarship) {
            // Map database status to frontend expected status
            $frontendStatus = match ($scholarship->status) {
                'active' => 'open',
                'inactive' => 'closed',
                'draft' => 'closed',
                'upcoming' => 'upcoming',
                default => 'closed'
            };

            return [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'type' => $scholarship->type,
                'status' => $frontendStatus,
                'amount' => $scholarship->amount,
                'deadline' => $scholarship->deadline?->format('Y-m-d'),
                'slots_available' => $scholarship->slots_available,
                'total_applications' => $scholarship->applications_count,
                'approved_applications' => $scholarship->applications->count(),
                'funding_source' => $scholarship->funding_source,
                'created_at' => $scholarship->created_at->toISOString(),
                'updated_at' => $scholarship->updated_at->toISOString(),
            ];
        });

        // Get summary statistics
        $totalScholarships = Scholarship::count();
        $activeScholarships = Scholarship::where('status', 'active')->count();
        $draftScholarships = Scholarship::where('status', 'draft')->count();
        $closedScholarships = Scholarship::where('status', 'inactive')->count();

        return Inertia::render('admin/scholarships/index', [
            'scholarships' => $scholarships,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'type' => $type,
            ],
            'statistics' => [
                'total_scholarships' => $totalScholarships,
                'active_scholarships' => $activeScholarships,
                'draft_scholarships' => $draftScholarships,
                'closed_scholarships' => $closedScholarships,
            ],
        ]);
    }

    /**
     * Display a listing of all scholarship applications for admin overview.
     */
    public function scholarshipApplications(Request $request)
    {
        $query = ScholarshipApplication::with([
            'user.studentProfile',  // Fix: Should be 'user.studentProfile' not 'user.user.studentProfile'
            'scholarship',
            'documents',
            'reviewer',
        ]);

        // Apply filters
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%'.$request->search.'%')
                        ->orWhere('email', 'like', '%'.$request->search.'%');
                })
                    ->orWhereHas('user.studentProfile', function ($profileQuery) use ($request) {
                        $profileQuery->where('student_id', 'like', '%'.$request->search.'%');
                    })
                    ->orWhereHas('scholarship', function ($scholarshipQuery) use ($request) {
                        $scholarshipQuery->where('name', 'like', '%'.$request->search.'%');
                    });
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->scholarship_type && $request->scholarship_type !== 'all') {
            $query->whereHas('scholarship', function ($q) use ($request) {
                $q->where('type', $request->scholarship_type);
            });
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        $applications = $query->paginate(15);

        // Transform the data for the frontend
        $applications->getCollection()->transform(function ($application) {
            return [
                'id' => $application->id,
                'student' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,  // Changed from full_name to name
                    'email' => $application->user->email,
                    'student_id' => $application->user->studentProfile->student_id ?? 'N/A',
                    'course' => $application->user->studentProfile->course ?? 'N/A',
                    'year_level' => $application->user->studentProfile->year_level ?? 'N/A',
                ],
                'scholarship' => [
                    'id' => $application->scholarship->id,
                    'name' => $application->scholarship->name,
                    'type' => $application->scholarship->type,
                    'amount' => $application->scholarship->amount,
                ],
                'status' => $application->status,
                'applied_at' => $application->applied_at ?? $application->created_at->toISOString(),
                'approved_at' => $application->approved_at,
                'rejected_at' => $application->rejected_at,
                'amount_received' => $application->amount_received,
                'reviewer' => $application->reviewer ? [
                    'name' => $application->reviewer->name,
                    'email' => $application->reviewer->email,
                ] : null,
                'created_at' => $application->created_at->toISOString(),
                'updated_at' => $application->updated_at->toISOString(),
            ];
        });

        // Get statistics
        $statistics = [
            'total_applications' => \App\Models\ScholarshipApplication::count(),
            'pending_applications' => \App\Models\ScholarshipApplication::whereIn('status', ['submitted', 'under_verification', 'verified', 'under_evaluation'])->count(),
            'approved_applications' => \App\Models\ScholarshipApplication::where('status', 'approved')->count(),
            'rejected_applications' => \App\Models\ScholarshipApplication::where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/scholarship-applications/index', [
            'applications' => $applications,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status ?? 'all',
                'scholarship_type' => $request->scholarship_type ?? 'all',
            ],
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display recent user login activity.
     */
    public function recentLogins(Request $request): Response
    {
        $currentUserId = Auth::id();

        // Get recent login activity by querying users with their last login times
        // Exclude the current admin user from the list
        $recentLogins = User::with(['studentProfile', 'osasStaffProfile', 'adminProfile'])
            ->whereNotNull('updated_at')
            ->where('id', '!=', $currentUserId)
            ->orderBy('updated_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($user) {
                $profileInfo = null;

                if ($user->role === 'student' && $user->studentProfile) {
                    $profileInfo = [
                        'student_id' => $user->studentProfile->student_id,
                        'course' => $user->studentProfile->course,
                        'year_level' => $user->studentProfile->year_level,
                    ];
                } elseif ($user->role === 'osas_staff' && $user->osasStaffProfile) {
                    $profileInfo = [
                        'staff_id' => $user->osasStaffProfile->staff_id,
                        'department' => 'OSAS',
                    ];
                } elseif ($user->role === 'admin' && $user->adminProfile) {
                    $profileInfo = [
                        'department' => 'Administration',
                    ];
                }

                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => ucfirst(str_replace('_', ' ', $user->role)),
                    'avatar' => $user->avatar,
                    'last_activity' => $user->updated_at,
                    'is_active' => $user->is_active,
                    'profile_info' => $profileInfo,
                ];
            });

        return Inertia::render('admin/recent-logins', [
            'recentLogins' => $recentLogins,
        ]);
    }

    /**
     * Display pages management
     */
    public function pages(): Response
    {
        $pages = Page::orderBy('title')->get();

        return Inertia::render('admin/pages/Index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Show the form for creating a new page
     */
    public function createPage(): Response
    {
        return Inertia::render('admin/pages/Create');
    }

    /**
     * Store a newly created page
     */
    public function storePage(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'required|string',
        ]);

        Page::create([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
        ]);

        return redirect()->route('admin.pages')->with('success', 'Page created successfully.');
    }

    /**
     * Show the form for editing a page
     */
    public function editPage(Page $page): Response
    {
        return Inertia::render('admin/pages/Edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified page
     */
    public function updatePage(Request $request, Page $page): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,'.$page->id,
            'content' => 'required|string',
        ]);

        $page->update([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
        ]);

        return redirect()->route('admin.pages')->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified page
     */
    public function destroyPage(Page $page): RedirectResponse
    {
        $page->delete();

        return redirect()->route('admin.pages')->with('success', 'Page deleted successfully.');
    }

    /**
     * Display announcements management
     */
    public function announcements(): Response
    {
        $announcements = Page::getAnnouncements();

        return Inertia::render('admin/announcements/Index', [
            'announcements' => $announcements->map(function ($page) {
                return array_merge($page->getAnnouncementData(), [
                    'slug' => $page->slug,
                    'created_at' => $page->created_at,
                    'updated_at' => $page->updated_at,
                ]);
            }),
        ]);
    }

    /**
     * Show the form for creating a new announcement
     */
    public function createAnnouncement(): Response
    {
        return Inertia::render('admin/announcements/Create');
    }

    /**
     * Store a newly created announcement
     */
    public function storeAnnouncement(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|in:Scholarship,Deadlines,Events,Requirements',
            'priority' => 'required|string|in:high,medium,low',
            'date' => 'nullable|date',
        ]);

        $slug = \Illuminate\Support\Str::slug($request->title.'-'.now()->format('Y-m-d-H-i-s'));

        Page::create([
            'title' => $request->title,
            'slug' => $slug,
            'content' => [
                'type' => 'announcement',
                'description' => $request->description,
                'category' => $request->category,
                'priority' => $request->priority,
                'date' => $request->date ?? now()->format('Y-m-d'),
            ],
        ]);

        return redirect()->route('admin.announcements')->with('success', 'Announcement created successfully.');
    }

    /**
     * Show the form for editing an announcement
     */
    public function editAnnouncement(Page $page): Response
    {
        if (! $page->isAnnouncement()) {
            abort(404, 'Page is not an announcement');
        }

        return Inertia::render('admin/announcements/Edit', [
            'announcement' => array_merge($page->getAnnouncementData(), [
                'slug' => $page->slug,
            ]),
        ]);
    }

    /**
     * Update the specified announcement
     */
    public function updateAnnouncement(Request $request, Page $page): RedirectResponse
    {
        if (! $page->isAnnouncement()) {
            abort(404, 'Page is not an announcement');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|in:Scholarship,Deadlines,Events,Requirements',
            'priority' => 'required|string|in:high,medium,low',
            'date' => 'nullable|date',
        ]);

        $content = $page->content;
        $content['description'] = $request->description;
        $content['category'] = $request->category;
        $content['priority'] = $request->priority;
        $content['date'] = $request->date ?? $content['date'] ?? now()->format('Y-m-d');

        $page->update([
            'title' => $request->title,
            'content' => $content,
        ]);

        return redirect()->route('admin.announcements')->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified announcement
     */
    public function destroyAnnouncement(Page $page): RedirectResponse
    {
        if (! $page->isAnnouncement()) {
            abort(404, 'Page is not an announcement');
        }

        $page->delete();

        return redirect()->route('admin.announcements')->with('success', 'Announcement deleted successfully.');
    }

    /**
     * Display CMS scholarships management
     */
    public function cmsScholarships(): Response
    {
        $scholarships = Page::getScholarships();

        return Inertia::render('admin/cms-scholarships/Index', [
            'scholarships' => $scholarships->map(function ($page) {
                return array_merge($page->getScholarshipData(), [
                    'slug' => $page->slug,
                    'created_at' => $page->created_at,
                    'updated_at' => $page->updated_at,
                ]);
            }),
        ]);
    }

    /**
     * Show the form for creating a new CMS scholarship
     */
    public function createCmsScholarship(): Response
    {
        return Inertia::render('admin/cms-scholarships/Create');
    }

    /**
     * Store a newly created CMS scholarship
     */
    public function storeCmsScholarship(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'amount' => 'required|string|max:255',
            'deadline' => 'required|date',
            'type' => 'required|string|in:Academic Scholarship,Student Assistantship Program,Performing Arts Scholarship,Economic Assistance',
            'requirements' => 'required|array',
            'requirements.*' => 'required|string',
        ]);

        $slug = Str::slug($request->name.'-'.now()->format('Y-m-d-H-i-s'));

        // Calculate days remaining
        $deadline = Carbon::parse($request->deadline);
        $daysRemaining = max(0, Carbon::now()->diffInDays($deadline, false));

        Page::create([
            'title' => $request->name,
            'slug' => $slug,
            'content' => [
                'type' => 'scholarship',
                'description' => $request->description,
                'amount' => $request->amount,
                'deadline' => $request->deadline,
                'daysRemaining' => $daysRemaining,
                'scholarshipType' => $request->type,
                'requirements' => $request->requirements,
            ],
        ]);

        return redirect()->route('admin.cms-scholarships')->with('success', 'Scholarship created successfully.');
    }

    /**
     * Show the form for editing a CMS scholarship
     */
    public function editCmsScholarship(Page $page): Response
    {
        if (! $page->isScholarship()) {
            abort(404, 'Page is not a scholarship');
        }

        return Inertia::render('admin/cms-scholarships/Edit', [
            'scholarship' => array_merge($page->getScholarshipData(), [
                'slug' => $page->slug,
            ]),
        ]);
    }

    /**
     * Update the specified CMS scholarship
     */
    public function updateCmsScholarship(Request $request, Page $page): RedirectResponse
    {
        if (! $page->isScholarship()) {
            abort(404, 'Page is not a scholarship');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'amount' => 'required|string|max:255',
            'deadline' => 'required|date',
            'type' => 'required|string|in:Academic Scholarship,Student Assistantship Program,Performing Arts Scholarship,Economic Assistance',
            'requirements' => 'required|array',
            'requirements.*' => 'required|string',
        ]);

        // Calculate days remaining
        $deadline = Carbon::parse($request->deadline);
        $daysRemaining = max(0, Carbon::now()->diffInDays($deadline, false));

        // Preserve existing content structure while updating fields
        $content = $page->content;
        $content['description'] = $request->description;
        $content['amount'] = $request->amount;
        $content['deadline'] = $request->deadline;
        $content['daysRemaining'] = $daysRemaining;
        $content['scholarshipType'] = $request->type;
        $content['requirements'] = $request->requirements;

        $page->update([
            'title' => $request->name,
            'slug' => Str::slug($request->name.'-'.now()->format('Y-m-d-H-i-s')),
            'content' => array_merge($content, [
                'type' => 'scholarship',
                'updated_at' => now()->toDateTimeString(),
            ]),
        ]);

        return redirect()->route('admin.cms-scholarships')->with('success', 'Scholarship updated successfully.');
    }

    /**
     * Remove the specified CMS scholarship
     */
    public function destroyCmsScholarship(Page $page): RedirectResponse
    {
        if (! $page->isScholarship()) {
            abort(404, 'Page is not a scholarship');
        }

        $page->delete();

        return redirect()->route('admin.cms-scholarships')->with('success', 'Scholarship deleted successfully.');
    }

    /**
     * Display a specific scholarship application for admin view.
     */
    public function showScholarshipApplication(ScholarshipApplication $application): Response
    {
        // Fix: Load the correct relationships
        $application->load([
            'user.studentProfile',  // Fix: Use 'user' instead of 'student.user'
            'scholarship',
            'reviewer',
            'documents',
        ]);

        return Inertia::render('admin/scholarship-applications/show', [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'applied_at' => $application->applied_at,
                'verified_at' => $application->verified_at,
                'approved_at' => $application->approved_at,
                'rejected_at' => $application->rejected_at,
                'amount_received' => $application->amount_received,
                'last_stipend_date' => $application->last_stipend_date,
                'stipend_status' => $application->stipend_status,
                'interview_schedule' => $application->interview_schedule,
                'interview_notes' => $application->interview_notes,
                'verifier_comments' => $application->verifier_comments,
                'purpose_letter' => $application->purpose_letter,
                'application_data' => $application->application_data,
                'documents' => $application->documents,
                'uploaded_documents' => $application->uploaded_documents,
                // Fix: Access student data through the 'user' relationship
                'student' => [
                    'id' => $application->user->id,
                    'student_id' => $application->user->studentProfile->student_id ?? 'N/A',
                    'name' => $application->user->name, // Use 'name' instead of 'full_name'
                    'email' => $application->user->email,
                    'course' => $application->user->studentProfile->course ?? 'N/A',
                    'year_level' => $application->user->studentProfile->year_level ?? 'N/A',
                    'current_gwa' => $application->user->studentProfile->current_gwa ?? null,
                    'units' => $application->user->studentProfile->units ?? null,
                ],
                'scholarship' => [
                    'id' => $application->scholarship->id,
                    'name' => $application->scholarship->name,
                    'type' => $application->scholarship->type,
                    'description' => $application->scholarship->description,
                    'amount' => $application->scholarship->amount,
                    'eligibility_criteria' => $application->scholarship->eligibility_criteria,
                    'required_documents' => $application->scholarship->required_documents,
                ],
                'reviewer' => $application->reviewer ? [
                    'id' => $application->reviewer->id,
                    'name' => $application->reviewer->name, // Use 'name' instead of 'full_name'
                    'email' => $application->reviewer->email,
                ] : null,
                'created_at' => $application->created_at,
                'updated_at' => $application->updated_at,
            ],
        ]);
    }
}
