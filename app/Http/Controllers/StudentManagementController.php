<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\StorageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StudentManagementController extends Controller
{
    /**
     * Display a listing of the students.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $currentUserId = Auth::id();

        // Always eager‐load the student profile
        $query = User::with('studentProfile')
            ->where('role', '=', 'student') // Only show students
            ->where('id', '!=', $currentUserId)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('studentProfile', function ($query) use ($search) {
                            $query->where('student_id', 'like', "%{$search}%")->orWhere('course', 'like', "%{$search}%");
                        });
                });
            });

        $users = $query->orderBy('last_name')->get(); // Get all students instead of paginating

        // Create a manual pagination-like structure for frontend compatibility
        $paginatedUsers = new \Illuminate\Pagination\LengthAwarePaginator(
            $users,
            $users->count(),
            $users->count(), // Show all items per page
            1, // Current page
            [
                'path' => $request->url(),
                'pageName' => 'page',
            ],
        );
        $paginatedUsers->appends($request->query());

        // Transform each user to include course, year_level, created_at, avatar, and student_profile details
        $paginatedUsers->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'student' => $user->id, // For Ziggy route parameter compatibility
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'avatar' => $user->avatar, // This will utilize the getAvatarAttribute accessor from the User model
                'role' => 'Student', // Role is determined by the query context
                'student_profile' => $user->studentProfile
                    ? [
                        'student_id' => $user->studentProfile->student_id,
                        'course' => $user->studentProfile->course,
                        'major' => $user->studentProfile->major,
                        'year_level' => $user->studentProfile->year_level,
                        'mobile_number' => $user->studentProfile->mobile_number,
                        // Add any other student_profile fields needed by the frontend here
                    ]
                    : null,
                'created_at' => $user->created_at,
                // Ensure all fields expected by student-management/columns.tsx are present
            ];
        });

        return Inertia::render('admin/manage-students', [
            'students' => $paginatedUsers, // Send all students with pagination structure
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the specified student profile.
     */
    public function show(User $student): Response
    {
        // Only allow for students
        if ($student->role !== 'student') {
            abort(404);
        }
        // --- Begin showUser logic ---
        $student->load('studentProfile');
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
        $attributes = $student->studentProfile ? $student->studentProfile->getAttributes() : [];
        $sanitizedAttributes = [];
        foreach ($attributes as $key => $value) {
            if (in_array($key, $monetaryFields)) {
                $sanitizedAttributes[$key] = (is_null($value) || $value === '' || !is_numeric($value)) ? '0.00' : number_format((float)$value, 2, '.', '');
            } else {
                $sanitizedAttributes[$key] = $value;
            }
        }
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
            $sanitizedAttributes[$field] = array_key_exists($field, $sanitizedAttributes) ? (bool)$sanitizedAttributes[$field] : false;
        }
        if (isset($sanitizedAttributes['date_of_birth']) && $sanitizedAttributes['date_of_birth']) {
            try {
                $sanitizedAttributes['date_of_birth'] = \Carbon\Carbon::parse($sanitizedAttributes['date_of_birth'])->format('Y-m-d');
            } catch (\Exception $e) {
                $sanitizedAttributes['date_of_birth'] = null;
            }
        }
        if (isset($sanitizedAttributes['siblings']) && is_string($sanitizedAttributes['siblings'])) {
            $sanitizedAttributes['siblings'] = json_decode($sanitizedAttributes['siblings'], true) ?? [];
        } elseif (!isset($sanitizedAttributes['siblings'])) {
            $sanitizedAttributes['siblings'] = [];
        }
        $userData = [
            'id' => $student->id,
            'first_name' => $student->first_name,
            'middle_name' => $student->middle_name,
            'last_name' => $student->last_name,
            'email' => $student->email,
            'role' => $student->role,
            'is_active' => $student->is_active,
            'avatar' => $student->avatar,
            'created_at' => $student->created_at,
            'full_name' => $student->full_name,
            'studentProfile' => (object)$sanitizedAttributes,
        ];
        return Inertia::render('admin/user-profile', ['user' => $userData]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create(): Response
    {
        return Inertia::render('admin/create-student');
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'student_id' => ['required', 'string', 'max:255', 'unique:student_profiles,student_id'],
            'course' => ['required', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'in:1st Year,2nd Year,3rd Year,4th Year'],
            'existing_scholarships' => ['nullable', 'string'],
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
            'street' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'status_of_parents' => ['nullable', 'string', 'max:255'],
            'total_siblings' => ['nullable', 'integer', 'min:0'],
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
        ];
        $validatedData = $request->validate($rules);
        DB::beginTransaction();
        try {
            $user = User::create([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'middle_name' => $validatedData['middle_name'] ?? null,
                'email' => $validatedData['email'],
                'role' => 'student',
                'is_active' => true,
            ]);
            $profileFields = array_diff_key($validatedData, array_flip(['first_name', 'middle_name', 'last_name', 'email']));
            $booleanFields = ['is_pwd'];
            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $profileFields)) {
                    $profileFields[$field] = (bool)$profileFields[$field];
                }
            }
            $user->studentProfile()->create($profileFields);
            DB::commit();
            return redirect()->route('admin.students.show', $user)->with('message', 'Student created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create student: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Show the form for editing the specified student.
     */
    public function edit(User $student): Response|RedirectResponse
    {
        if ($student->role !== 'student') {
            abort(404);
        }
        // --- Begin editUser logic ---
        $student->load('studentProfile');
        $photoUrl = $student->photo_id ? StorageService::url($student->photo_id) : null;
        $userData = [
            'id' => $student->id,
            'first_name' => $student->first_name,
            'middle_name' => $student->middle_name,
            'last_name' => $student->last_name,
            'email' => $student->email,
            'role' => $student->role,
            'photo_url' => $photoUrl,
            'avatar' => $student->avatar,
            'full_name' => $student->full_name,
        ];
        if ($student->studentProfile) {
            $studentProfileData = $student->studentProfile->toArray();
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
                    $studentProfileData[$field] = (bool)$studentProfileData[$field];
                }
            }
            if (isset($studentProfileData['date_of_birth']) && $studentProfileData['date_of_birth']) {
                try {
                    $studentProfileData['date_of_birth'] = \Carbon\Carbon::parse($studentProfileData['date_of_birth'])->format('Y-m-d');
                } catch (\Exception $e) {
                    $studentProfileData['date_of_birth'] = null;
                }
            }
            if (isset($studentProfileData['siblings']) && is_string($studentProfileData['siblings'])) {
                $studentProfileData['siblings'] = json_decode($studentProfileData['siblings'], true) ?? [];
            } elseif (!isset($studentProfileData['siblings'])) {
                $studentProfileData['siblings'] = [];
            }
            $userData['studentProfile'] = $studentProfileData;
        } else {
            return redirect()->back()->withErrors(['error' => 'Student profile not found.']);
        }
        return Inertia::render('admin/edit-user-profile', ['user' => $userData]);
    }

    /**
     * Update the specified student.
     */
    public function update(Request $request, User $student): RedirectResponse
    {
        if ($student->role !== 'student') {
            abort(404);
        }
        // --- Begin updateUser logic ---
        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $student->id],
            'student_id' => ['required', 'string', 'max:255', 'unique:student_profiles,student_id,' . $student->studentProfile->id],
            'course' => ['required', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'in:1st Year,2nd Year,3rd Year,4th Year'],
            'existing_scholarships' => ['nullable', 'string'],
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
            'street' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'status_of_parents' => ['nullable', 'string', 'max:255'],
            'total_siblings' => ['nullable', 'integer', 'min:0'],
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
        ];
        $validatedData = $request->validate($rules);
        DB::beginTransaction();
        try {
            $student->update([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'middle_name' => $validatedData['middle_name'] ?? null,
                'email' => $validatedData['email'],
            ]);
            $profileFields = array_diff_key($validatedData, array_flip(['first_name', 'middle_name', 'last_name', 'email']));
            $booleanFields = ['is_pwd'];
            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $profileFields)) {
                    $profileFields[$field] = (bool)$profileFields[$field];
                }
            }
            $student->studentProfile->update($profileFields);
            DB::commit();
            return redirect()->route('admin.students.show', $student)->with('message', 'Student profile updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update student: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified student from the system.
     */
    public function destroy(User $student)
    {
        if ($student->role !== 'student') {
            abort(404);
        }
        $student->delete();
        return redirect()->route('admin.students.index')->with('message', 'Student successfully deleted.');
    }
}
