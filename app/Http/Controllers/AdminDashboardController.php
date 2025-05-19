<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StaffInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalStudents' => User::whereHas('studentProfile')->count(),
            'totalStaff' => User::whereHas('osasStaffProfile')->count(),
            'totalAdmins' => User::whereHas('adminProfile')->count(),
            'pendingInvitations' => StaffInvitation::where('status', 'pending')->whereNull('accepted_at')->count(),
        ];

        $recentLogins = User::with(['studentProfile', 'osasStaffProfile', 'adminProfile'])
            ->whereNotNull('last_login_at')
            ->orderBy('last_login_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'role' => $this->getUserRole($user),
                    'timestamp' => $user->last_login_at,
                ];
            });

        $pendingInvitations = StaffInvitation::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($invitation) {
                return [
                    'id' => $invitation->id,
                    'email' => $invitation->email,
                    'role' => $invitation->role,
                    'sentDate' => $invitation->created_at,
                    'status' => $invitation->status,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentLogins' => $recentLogins,
            'pendingInvitations' => $pendingInvitations,
        ]);
    }

    public function recentLogins()
    {
        $recentLogins = User::with(['studentProfile', 'osasStaffProfile', 'adminProfile'])
            ->whereNotNull('last_login_at')
            ->orderBy('last_login_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'role' => $this->getUserRole($user),
                    'timestamp' => $user->last_login_at,
                ];
            });

        return response()->json($recentLogins);
    }    public function pendingInvitations()
    {
        $pendingInvitations = StaffInvitation::where('status', 'pending')
            ->whereNull('accepted_at')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($invitation) {
                return [
                    'id' => $invitation->id,
                    'email' => $invitation->email,
                    'role' => $invitation->role,
                    'sentDate' => $invitation->created_at,
                    'status' => $invitation->status,
                ];
            });

        return response()->json($pendingInvitations);
    }

    public function resendInvitation(StaffInvitation $invitation)
    {
        if ($invitation->status !== 'pending') {
            return response()->json(['error' => 'Invitation is not in pending state'], 400);
        }        // Reset the invitation token and resend the email
        $invitation->update([
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
            'status' => 'pending',
        ]);

        // Dispatch the invitation email job
        Mail::to($invitation->email)->send(new \App\Mail\StaffInvitation($invitation));

        return response()->json(['message' => 'Invitation resent successfully']);
    }

    private function getUserRole(User $user)
    {
        if ($user->adminProfile) {
            return 'Admin';
        } elseif ($user->osasStaffProfile) {
            return 'OSAS Staff';
        } elseif ($user->studentProfile) {
            return 'Student';
        }
        return 'Unknown';
    }
}
