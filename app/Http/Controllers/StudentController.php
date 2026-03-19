<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Services\ScholarshipApplicationPresenter;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ScholarshipApplicationPresenter $applicationPresenter
    ) {}

    /**
     * Display the student dashboard.
     */
    public function index(): Response
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get count of active/approved scholarships and add it to student data
        $studentData = $student->toArray();

        // Count both existing scholarships and approved applications
        $existingScholarships = ! empty($student->existing_scholarships) ? 1 : 0;
        $approvedApplications = $student->scholarshipApplications()->where('status', 'approved')->count();

        $studentData['scholarships'] = $existingScholarships + $approvedApplications;

        // Get available scholarships
        $availableScholarships = Scholarship::where('status', 'active')
            ->where('deadline', '>=', now())
            ->get()
            ->map(function ($scholarship) {
                return [
                    'id' => $scholarship->id,
                    'name' => $scholarship->name,
                    'type' => $scholarship->type,
                    'amount' => $scholarship->getStipendAmount() ? '₱' . number_format($scholarship->getStipendAmount(), 0) . '/month' : 'Amount TBD',
                    'deadline' => $scholarship->deadline->format('Y-m-d'),
                    'status' => $scholarship->status,
                    'description' => $scholarship->description,
                ];
            });

        // Get recent applications
        $recentApplications = $student
            ->scholarshipApplications()
            ->with(['scholarship', 'documents', 'interview', 'reviewer'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($application) {
                $presented = $this->applicationPresenter->presentStudentList($application);

                return [
                    'id' => $presented['id'],
                    'scholarship_name' => $presented['scholarship']['name'],
                    'status' => $presented['status'],
                    'submitted_at' => $presented['submitted_at'],
                    'progress' => $presented['progress'],
                ];
            });

        // Get statistics
        $totalApplications = $student->scholarshipApplications()->count();
        $approvedScholarships = $student->scholarshipApplications()->where('status', 'approved')->count();

        return Inertia::render('student/dashboard', [
            'student' => $studentData,
            'availableScholarships' => $availableScholarships,
            'recentApplications' => $recentApplications,
            'totalApplications' => $totalApplications,
            'approvedScholarships' => $approvedScholarships,
        ]);
    }

    /**
     * Get comprehensive dashboard statistics
     */
    public function getDashboardStats()
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return response()->json(['error' => 'Student profile not found'], 404);
        }

        $applications = $student->scholarshipApplications;

        // Calculate total stipend received for the student
        $approvedApplicationIds = $applications->where('status', 'approved')->pluck('id');
        $totalStipendReceived = \App\Models\ScholarshipStipend::whereIn('application_id', $approvedApplicationIds)
            ->where('status', 'released')
            ->sum('amount');

        $stats = [
            'total_applications' => $applications->count(),
            'pending_applications' => $applications->whereIn('status', ['submitted', 'under_verification', 'under_evaluation'])->count(),
            'approved_applications' => $applications->where('status', 'approved')->count(),
            'draft_applications' => $applications->where('status', 'draft')->count(),
            'rejected_applications' => $applications->where('status', 'rejected')->count(),
            'available_scholarships' => Scholarship::where('status', 'active')->where('deadline', '>=', now())->count(),
            'upcoming_deadlines' => Scholarship::where('status', 'active')
                ->where('deadline', '>=', now())
                ->where('deadline', '<=', now()->addDays(30))
                ->count(),
            'recent_notifications_count' => Auth::user()
                ->scholarshipNotifications()
                ->where('created_at', '>=', now()->subDays(7))
                ->count(),
            'current_gwa' => $student->current_gwa,
            'eligible_scholarships_count' => $this->getEligibleScholarshipsCount($student),
            'total_stipend_received' => (float) $totalStipendReceived,
        ];

        return response()->json($stats);
    }

    /**
     * Get recent activity for dashboard
     */
    public function getRecentActivity()
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return response()->json(['error' => 'Student profile not found'], 404);
        }

        $recentApplications = $student
            ->scholarshipApplications()
            ->with(['scholarship'])
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => $application->id,
                    'scholarship_name' => $application->scholarship->name,
                    'status' => $application->status,
                    'updated_at' => is_string($application->updated_at)
                        ? \Carbon\Carbon::parse($application->updated_at)->format('Y-m-d H:i:s')
                        : $application->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        $statusUpdates = Auth::user()
            ->scholarshipNotifications()
            ->where('type', 'application_status')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'date' => is_string($notification->created_at)
                        ? \Carbon\Carbon::parse($notification->created_at)->format('Y-m-d H:i:s')
                        : $notification->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $upcomingDeadlines = Scholarship::where('status', 'active')
            ->where('deadline', '>=', now())
            ->where('deadline', '<=', now()->addDays(30))
            ->orderBy('deadline')
            ->take(5)
            ->get()
            ->map(function ($scholarship) {
                return [
                    'id' => $scholarship->id,
                    'name' => $scholarship->name,
                    'deadline' => $scholarship->deadline->format('Y-m-d'),
                ];
            });

        $notifications = Auth::user()
            ->scholarshipNotifications()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'date' => is_string($notification->created_at)
                        ? \Carbon\Carbon::parse($notification->created_at)->format('Y-m-d H:i:s')
                        : $notification->created_at->format('Y-m-d H:i:s'),
                    'read' => $notification->read_at !== null,
                ];
            });

        $activity = [
            'recent_applications' => $recentApplications,
            'status_updates' => $statusUpdates,
            'upcoming_deadlines' => $upcomingDeadlines,
            'notifications' => $notifications,
        ];

        return response()->json($activity);
    }

    /**
     * Get count of scholarships student is eligible for
     */
    private function getEligibleScholarshipsCount($student): int
    {
        return Scholarship::where('status', 'active')
            ->where('deadline', '>=', now())
            ->get()
            ->filter(function ($scholarship) {
                return $this->canStudentApply($scholarship);
            })
            ->count();
    }

    /**
     * Search and filter scholarships
     */
    public function searchScholarships(Request $request)
    {
        $query = Scholarship::where('status', 'active')->where('deadline', '>=', now());

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Also support 'q' parameter for search (used by tests)
        if ($request->has('q') && $request->q) {
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by amount range
        if ($request->has('min_amount') && $request->min_amount) {
            $query->where('amount', '>=', $request->min_amount);
        }
        if ($request->has('max_amount') && $request->max_amount) {
            $query->where('amount', '<=', $request->max_amount);
        }

        // Filter by deadline
        if ($request->has('deadline_within') && $request->deadline_within) {
            $days = (int) $request->deadline_within;
            $query->where('deadline', '<=', now()->addDays($days));
        }

        // Sort
        $sortBy = $request->get('sort_by', 'deadline');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 12);
        $scholarships = $query->paginate($perPage);

        $scholarships->getCollection()->transform(function ($scholarship) {
            return [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'type' => $scholarship->type,
                'typeLabel' => ucfirst(str_replace('_', ' ', $scholarship->type)),
                'description' => $scholarship->description,
                'amount' => $scholarship->getStipendAmount(),
                'deadline' => $scholarship->deadline ? $scholarship->deadline->format('Y-m-d') : null,
                'status' => $scholarship->status,
                'can_apply' => $this->canStudentApply($scholarship),
                'eligibility_met' => $this->checkEligibility($scholarship),
            ];
        });

        return response()->json([
            'scholarships' => $scholarships->items(),
            'pagination' => [
                'current_page' => $scholarships->currentPage(),
                'last_page' => $scholarships->lastPage(),
                'per_page' => $scholarships->perPage(),
                'total' => $scholarships->total(),
                'from' => $scholarships->firstItem(),
                'to' => $scholarships->lastItem(),
            ],
        ]);
    }

    /**
     * Check if student can apply for scholarship
     */
    private function canStudentApply(Scholarship $scholarship): bool
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return false;
        }

        // Check if already applied
        $existingApplication = $student->scholarshipApplications()->where('scholarship_id', $scholarship->id)->exists();

        if ($existingApplication) {
            return false;
        }

        // Check deadline
        if ($scholarship->deadline < now()) {
            return false;
        }

        // Check if scholarship is open
        if ($scholarship->status !== 'active') {
            return false;
        }

        return true;
    }

    /**
     * Check eligibility for scholarship
     */
    private function checkEligibility(Scholarship $scholarship): array
    {
        $userId = Auth::id();
        $student = \App\Models\StudentProfile::where('user_id', $userId)->first();

        $eligibility = ['met' => true, 'requirements' => []];

        if (! $student) {
            $eligibility['met'] = false;
            $eligibility['requirements'][] = 'Student profile not found';

            return $eligibility;
        }

        // Check GWA requirement from either direct property or eligibility criteria
        // Note: In Philippines GWA system, lower numbers are better (1.0 is highest)
        $requiredGwa = null;

        // Get eligibility criteria - ensure it's properly decoded if stored as JSON
        $criteria = $scholarship->eligibility_criteria;
        if (is_string($criteria)) {
            $criteria = json_decode($criteria, true) ?? [];
        } elseif (! is_array($criteria)) {
            $criteria = [];
        }

        // Check for GWA requirement in either location
        if (isset($scholarship->min_gwa)) {
            $requiredGwa = (float) $scholarship->min_gwa;
        } elseif (isset($criteria['minimum_gwa'])) {
            $requiredGwa = (float) $criteria['minimum_gwa'];
        }

        if ($requiredGwa && $student->current_gwa) {
            // Student GWA must be less than or equal to required GWA (lower is better)
            // Convert both to float for proper comparison since current_gwa might be a decimal cast
            $studentGwa = (float) $student->current_gwa;
            if ($studentGwa > $requiredGwa) {
                $eligibility['met'] = false;
                $eligibility['requirements'][] = 'GWA requirement not met';
            }
        }

        // Type-specific eligibility checks would be added here if needed
        // These are informational for now and don't affect eligibility status
        // Additional checks can be implemented when more student profile data is available

        return $eligibility;
    }

    /**
     * Get scholarship details with eligibility check
     */
    public function getScholarshipDetails(Scholarship $scholarship)
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return response()->json(['error' => 'Student profile not found'], 404);
        }

        // Check eligibility
        $eligibilityCheck = $this->checkEligibility($scholarship);
        $canApply = $this->canStudentApply($scholarship) && $eligibilityCheck['met'];

        // Check for existing application
        $existingApplication = $student->scholarshipApplications()->where('scholarship_id', $scholarship->id)->first();

        // Build eligibility reasons array
        $reasons = [];
        if (! $eligibilityCheck['met']) {
            $reasons = $eligibilityCheck['requirements'];
        }

        $responseData = [
            'scholarship' => [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'description' => $scholarship->description,
                'type' => $scholarship->type,
                'requirements' => $scholarship->required_documents ?? [],
                'amount' => $scholarship->getStipendAmount(),
                'application_start_date' => $scholarship->application_start_date ? $scholarship->application_start_date->format('Y-m-d') : null,
                'deadline' => $scholarship->deadline ? $scholarship->deadline->format('Y-m-d') : null,
                'status' => $scholarship->status,
            ],
            'eligibility' => [
                'can_apply' => $canApply,
                'is_eligible' => $eligibilityCheck['met'],
                'requirements' => $eligibilityCheck['requirements'],
                'reasons' => $reasons,
            ],
            'existing_application' => $existingApplication
                ? [
                    'id' => $existingApplication->id,
                    'status' => $existingApplication->status,
                    'submitted_at' => $existingApplication->applied_at
                        ? (is_string($existingApplication->applied_at)
                            ? \Carbon\Carbon::parse($existingApplication->applied_at)->format('Y-m-d')
                            : $existingApplication->applied_at->format('Y-m-d'))
                        : null,
                    'created_at' => is_string($existingApplication->created_at)
                        ? \Carbon\Carbon::parse($existingApplication->created_at)->format('Y-m-d')
                        : $existingApplication->created_at->format('Y-m-d'),
                ]
                : null,
        ];

        return response()->json($responseData);
    }
}
