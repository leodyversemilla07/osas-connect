<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\OsasStaffProfile;
use App\Models\StaffInvitation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
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
     * Display a listing of all users, including course, year level, and created date.
     */
    public function users(Request $request): Response
    {
        $role = $request->query('role', 'all');
        $search = $request->query('search');
        $currentUserId = Auth::id();

        // Always eager‐load the student profile
        $query = User::with('studentProfile')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role !== 'all', function ($query) use ($role) {
                $query->where('role', $role);
            })
            ->where('id', '!=', $currentUserId); // Exclude the current user from the listing

        $users = $query->orderBy('last_name')
            ->paginate(10)
            ->withQueryString();

        // Transform each user to include course, year_level, created_at and a human‑readable role
        $users->getCollection()->transform(function ($user) {
            $roleLabels = [
                'admin' => 'Admin',
                'osas_staff' => 'Osas Staff',
                'student' => 'Student',
            ];
            $label = $roleLabels[$user->role] ?? ucfirst(str_replace('_', ' ', $user->role));

            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $label,
                'course' => $user->studentProfile->course ?? 'None',
                'year_level' => $user->studentProfile->year_level ?? 'N/A',
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => [
                'role' => $role,
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
        $user->load($user->role . 'Profile');

        return Inertia::render('admin/user-profile', [
            'user' => $user,
        ]);
    }

    /**
     * Remove a user from the system.
     */
    public function destroyUser(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users')
            ->with('message', 'User successfully deleted.');
    }

    /**
     * Show the staff invitation form.
     */
    public function showInvitationForm(): Response
    {
        return Inertia::render('admin/invite-staff', [
            'departments' => [
                'OSAS Main Office',
                'Student Affairs',
                'Guidance and Counseling',
                'Health Services',
                'Student Organizations',
                'Scholarships and Financial Aid',
                'Cultural Affairs',
                'Sports and Recreation',
            ],
            'positions' => [
                'Director',
                'Assistant Director',
                'Coordinator',
                'Officer',
                'Counselor',
                'Staff',
                'Secretary',
                'Assistant',
            ],
        ]);
    }

    /**
     * Send an invitation to a new OSAS staff member.
     */
    public function sendInvitation(Request $request)
    {        $request->validate([
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
    {        $invitations = StaffInvitation::with('inviter')
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
     * Revoke a staff invitation.
     */    public function revokeInvitation(StaffInvitation $invitation)
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