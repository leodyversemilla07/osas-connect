<?php

namespace App\Http\Controllers;

use App\Models\StaffInvitation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'totalStaff' => $totalStaff,
                'totalAdmins' => $totalAdmins,
            ],
        ]);
    }

    /**
     * Display a listing of all students.
     */
    public function users(Request $request): Response
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
                'last_name' => $user->last_name,
                'email' => $user->email,
                'avatar' => $user->avatar, // This will utilize the getAvatarAttribute accessor from the User model
                'role' => 'Student', // Role is determined by the query context
                'student_profile' => $user->studentProfile ? [
                    'student_id' => $user->studentProfile->student_id,
                    'course' => $user->studentProfile->course,
                    'year_level' => $user->studentProfile->year_level,
                    // Add any other student_profile fields needed by the frontend here
                ] : null,
                'created_at' => $user->created_at,
                // Ensure all fields expected by student-management/columns.tsx are present
            ];
        });

        return Inertia::render('admin/students', [
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
        $user->load($user->role.'Profile');

        return Inertia::render('admin/user-profile', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing a user.
     */
    public function editUser(User $user): Response
    {
        // Load the appropriate profile based on user role
        $user->load($user->role.'Profile');

        // Make sure the profile exists
        if (! $user->profile()) {
            return Inertia::render('admin/users', [
                'error' => 'User profile not found.',
            ]);
        }

        // Redirect admin users back as they cannot be edited
        if ($user->isAdmin()) {
            return Inertia::render('admin/users', [
                'error' => 'Admin profiles cannot be edited.',
            ]);
        }

        return Inertia::render('admin/edit-user-profile', [
            'user' => $user,
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
            'mobile_number' => ['nullable', 'string', 'max:255'],
        ];

        // Add role-specific validation rules
        if ($user->role === 'student') {
            $rules = array_merge($commonRules, [
                'student_id' => ['required', 'string', 'max:255', 'unique:student_profiles,student_id,'.$user->studentProfile->id],
                'course' => ['required', 'string', 'max:255'],
                'major' => ['nullable', 'string', 'max:255'],
                'year_level' => ['required', 'string', 'in:1st Year,2nd Year,3rd Year,4th Year'],
                'civil_status' => ['required', 'string', 'in:Single,Married,Widowed,Separated,Annulled'],
                'sex' => ['required', 'string', 'in:Male,Female'],
                'street' => ['nullable', 'string', 'max:255'],
                'barangay' => ['nullable', 'string', 'max:255'],
                'city' => ['nullable', 'string', 'max:255'],
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
                $user->studentProfile->update([
                    'student_id' => $validatedData['student_id'],
                    'course' => $validatedData['course'],
                    'major' => $validatedData['major'] ?? 'None',
                    'year_level' => $validatedData['year_level'],
                    'civil_status' => $validatedData['civil_status'],
                    'sex' => $validatedData['sex'],
                    'mobile_number' => $validatedData['mobile_number'],
                    'street' => $validatedData['street'],
                    'barangay' => $validatedData['barangay'],
                    'city' => $validatedData['city'],
                ]);
            } elseif ($user->role === 'osas_staff' && $user->osasStaffProfile) {
                $user->osasStaffProfile->update([
                    'staff_id' => $validatedData['staff_id'],
                    'mobile_number' => $validatedData['mobile_number'],
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
     * Display a listing of all OSAS staff members.
     */
    public function staff(Request $request): Response
    {
        $search = $request->query('search');
        $currentUserId = Auth::id();

        // Query for OSAS staff members
        $query = User::with('osasStaffProfile')
            ->where('role', '=', 'osas_staff')
            ->where('id', '!=', $currentUserId)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });

        $staff = $query->orderBy('last_name')
            ->paginate(10)
            ->withQueryString();        // Transform each staff member to include relevant information
        $staff->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'avatar' => $user->avatar,
                'role' => 'OSAS Staff',
                'osas_staff_profile' => [
                    'staff_id' => $user->osasStaffProfile->staff_id ?? null,
                ],
            ];
        });

        // Get active invitations with pagination
        $invitations = StaffInvitation::with('inviter')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($invitation) {
                return [
                    'id' => $invitation->id,
                    'email' => $invitation->email,
                    'role' => $invitation->role,
                    'inviter' => [
                        'id' => $invitation->inviter->id,
                        'first_name' => $invitation->inviter->first_name,
                        'last_name' => $invitation->inviter->last_name,
                    ],
                    'created_at' => $invitation->created_at,
                    'expires_at' => $invitation->expires_at,
                    'status' => $invitation->status,
                ];
            });

        return Inertia::render('admin/manage-staff', [
            'staff' => $staff,
            'invitations' => $invitations,
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
     * Display all active staff invitations.
     */
    public function viewInvitations(): Response
    {
        $invitations = StaffInvitation::with('inviter')
            ->where('status', 'pending')
            ->where('accepted_at', null)
            ->where('expires_at', '>', Carbon::now())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/invitations', [
            'invitations' => $invitations,
        ]);
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
        $invitation->update(['status' => 'revoked']);

        return back()->with('success', 'Invitation revoked successfully.');
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
}
