<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StaffInvitation;
use App\Models\User;
use App\Services\UserAgentParser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        return Inertia::render('admin/dashboard');
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
                    $query
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });

        $staffMembers = $staffQuery->orderBy('last_name')->get();

        // Query for all staff invitations (regardless of status)
        $invitationsQuery = StaffInvitation::with('inviter')->when($search, function ($query) use ($search) {
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
                'id' => 'invitation_' . $invitation->id,
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
        $request->validate(
            [
                'email' => 'required|email|unique:users,email|unique:staff_invitations,email,NULL,id,accepted_at,NULL',
            ],
            [
                'email.unique' => 'This email is already associated with an existing user or has a pending invitation.',
            ],
        ); // Generate invitation token with 48-hour expiry
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
            ->with([
                'applications' => function ($query) {
                    $query->where('status', 'approved');
                },
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
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
                default => 'closed',
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
        $totalApplications = ScholarshipApplication::count();
        $approvedApplications = ScholarshipApplication::where('status', 'approved')->count();

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
                'total_applications' => $totalApplications,
                'approved_applications' => $approvedApplications,
            ],
        ]);
    }

    /**
     * Display a listing of all scholarship applications for admin overview.
     */
    public function scholarshipApplications(Request $request)
    {
        $query = ScholarshipApplication::with([
            'user.studentProfile', // Fix: Should be 'user.studentProfile' not 'user.user.studentProfile'
            'scholarship',
            'documents',
            'reviewer',
        ]);

        // Apply filters
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery
                        ->where('first_name', 'like', '%' . $request->search . '%')
                        ->orWhere('last_name', 'like', '%' . $request->search . '%')
                        ->orWhere('middle_name', 'like', '%' . $request->search . '%')
                        ->orWhere('email', 'like', '%' . $request->search . '%');
                })
                    ->orWhereHas('user.studentProfile', function ($profileQuery) use ($request) {
                        $profileQuery->where('student_id', 'like', '%' . $request->search . '%');
                    })
                    ->orWhereHas('scholarship', function ($scholarshipQuery) use ($request) {
                        $scholarshipQuery->where('name', 'like', '%' . $request->search . '%');
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

        // Use proper pagination like applications.tsx
        $applications = $query->paginate(15);

        // Transform the data for the frontend
        $applications->getCollection()->transform(function ($application) {
            return [
                'id' => $application->id,
                'student' => [
                    'id' => $application->user->id,
                    'name' => $application->user->full_name, // Changed from name to full_name
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
                'reviewer' => $application->reviewer
                    ? [
                        'name' => $application->reviewer->full_name, // Changed from name to full_name
                        'email' => $application->reviewer->email,
                    ]
                    : null,
                'created_at' => $application->created_at->toISOString(),
                'updated_at' => $application->updated_at->toISOString(),
            ];
        });

        // Get statistics
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->subMonth()->endOfMonth();

        $statistics = [
            'total_applications' => \App\Models\ScholarshipApplication::count(),
            'pending_applications' => \App\Models\ScholarshipApplication::whereIn('status', [
                'submitted',
                'under_verification',
                'verified',
                'under_evaluation',
            ])->count(),
            'approved_applications' => \App\Models\ScholarshipApplication::where('status', 'approved')->count(),
            'rejected_applications' => \App\Models\ScholarshipApplication::where('status', 'rejected')->count(),
            'this_month_count' => \App\Models\ScholarshipApplication::where('created_at', '>=', $thisMonth)->count(),
            'last_month_count' => \App\Models\ScholarshipApplication::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count(),
        ];

        // Calculate completion rate
        $totalProcessed = $statistics['approved_applications'] + $statistics['rejected_applications'];
        $statistics['completion_rate'] = $statistics['total_applications'] > 0 ? ($totalProcessed / $statistics['total_applications']) * 100 : 0;

        return Inertia::render('admin/scholarship-applications/index', [
            'applications' => $applications,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display recent user login activity.
     */
    public function recentLogins(Request $request): Response
    {
        $currentUserId = Auth::id();
        $perPage = $request->get('per_page', 10); // Default 10 items per page

        // Get recent login activity by querying users with their most recent sessions
        // We need to get the most recent session for each user
        $recentLoginsQuery = User::with(['studentProfile', 'osasStaffProfile', 'adminProfile'])
            ->leftJoin('sessions', function ($join) {
                $join
                    ->on('users.id', '=', 'sessions.user_id')
                    ->whereRaw('sessions.last_activity = (SELECT MAX(s2.last_activity) FROM sessions s2 WHERE s2.user_id = users.id)');
            })
            ->whereNotNull('users.updated_at')
            ->where('users.id', '!=', $currentUserId)
            ->select('users.*', 'sessions.ip_address', 'sessions.user_agent', 'sessions.last_activity as session_last_activity')
            ->orderBy('users.updated_at', 'desc');

        $paginatedUsers = $recentLoginsQuery->paginate($perPage);

        $recentLogins = $paginatedUsers->getCollection()->map(function ($user) {
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
                    'department' => 'Office of Student Affairs & Services',
                ];
            } elseif ($user->role === 'admin' && $user->adminProfile) {
                $profileInfo = [
                    'department' => 'Administration',
                ];
            }

            // Parse user agent to extract browser and device info
            $userAgentInfo = UserAgentParser::parse($user->user_agent);

            // Format role display name properly
            $roleDisplay = match ($user->role) {
                'admin' => 'Administrator',
                'osas_staff' => 'OSAS Staff',
                'student' => 'Student',
                default => ucwords(str_replace('_', ' ', $user->role)),
            };

            return [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'role' => $roleDisplay,
                'avatar' => $user->avatar,
                'last_activity' => $user->updated_at,
                'is_active' => $user->is_active,
                'profile_info' => $profileInfo,
                'ip_address' => $user->ip_address,
                'device' => $userAgentInfo['device'],
                'browser' => $userAgentInfo['browser'],
            ];
        });

        return Inertia::render('admin/recent-logins', [
            'recentLogins' => [
                'data' => $recentLogins,
                'current_page' => $paginatedUsers->currentPage(),
                'last_page' => $paginatedUsers->lastPage(),
                'per_page' => $paginatedUsers->perPage(),
                'total' => $paginatedUsers->total(),
                'from' => $paginatedUsers->firstItem(),
                'to' => $paginatedUsers->lastItem(),
                'links' => $paginatedUsers->linkCollection()->toArray(),
            ],
        ]);
    }

    /**
     * Display a specific scholarship application for admin view.
     */
    public function showScholarshipApplication(ScholarshipApplication $application): Response
    {
        // Fix: Load the correct relationships
        $application->load([
            'user.studentProfile', // Fix: Use 'user' instead of 'student.user'
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
                'reviewer' => $application->reviewer
                    ? [
                        'id' => $application->reviewer->id,
                        'name' => $application->reviewer->name, // Use 'name' instead of 'full_name'
                        'email' => $application->reviewer->email,
                    ]
                    : null,
                'created_at' => $application->created_at,
                'updated_at' => $application->updated_at,
            ],
        ]);
    }

    /**
     * Display the specified scholarship.
     */
    public function showScholarship(Scholarship $scholarship): Response
    {
        // Load the scholarship with related data
        $scholarship->load([
            'applications' => function ($query) {
                $query->with(['user.studentProfile', 'reviewer'])->latest();
            },
        ]);

        // Get application statistics for this scholarship
        $totalApplications = $scholarship->applications()->count();
        $pendingApplications = $scholarship->applications()->where('status', 'submitted')->count();
        $approvedApplications = $scholarship->applications()->where('status', 'approved')->count();
        $rejectedApplications = $scholarship->applications()->where('status', 'rejected')->count();

        // Calculate total amount disbursed
        $totalDisbursed = $scholarship->applications()->where('status', 'approved')->sum('amount_received') ?? 0;

        // Transform scholarship data for frontend
        $scholarshipData = [
            'id' => $scholarship->id,
            'name' => $scholarship->name,
            'description' => $scholarship->description,
            'type' => $scholarship->type,
            'amount' => $scholarship->amount,
            'status' => $scholarship->status,
            'deadline' => $scholarship->deadline?->format('Y-m-d'),
            'slots_available' => $scholarship->slots_available,
            'requirements' => $scholarship->requirements,
            'funding_source' => $scholarship->funding_source,
            'created_at' => $scholarship->created_at->toISOString(),
            'updated_at' => $scholarship->updated_at->toISOString(),
        ];

        return Inertia::render('admin/scholarships/show', [
            'scholarship' => $scholarshipData,
            'statistics' => [
                'total_applications' => $totalApplications,
                'pending_applications' => $pendingApplications,
                'approved_applications' => $approvedApplications,
                'rejected_applications' => $rejectedApplications,
                'total_disbursed' => $totalDisbursed,
            ],
        ]);
    }
}
