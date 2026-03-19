<?php

namespace App\Http\Controllers\Osas;

use App\Http\Controllers\Controller;
use App\Models\ApplicationComment;
use App\Models\Document;
use App\Models\ScholarshipApplication;
use App\Services\DocumentVerificationService;
use App\Services\ScholarshipApplicationPresenter;
use App\Services\ScholarshipService;
use App\Services\ScholarshipWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipApplicationController extends Controller
{
    public function __construct(
        private readonly ScholarshipWorkflowService $workflowService,
        private readonly DocumentVerificationService $documentVerificationService,
        private readonly ScholarshipApplicationPresenter $applicationPresenter,
        private readonly ScholarshipService $scholarshipService,
    ) {}

    public function index(Request $request): Response
    {
        $query = ScholarshipApplication::with([
            'user.studentProfile',
            'scholarship',
            'documents.verifiedBy',
            'interview.interviewer',
            'reviewer',
        ])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->scholarship_type) {
            $query->whereHas('scholarship', function ($query) use ($request) {
                $query->where('type', $request->scholarship_type);
            });
        }

        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->search) {
            $query->where(function ($query) use ($request) {
                $query
                    ->whereHas('user', function ($userQuery) use ($request) {
                        $userQuery->where('first_name', 'like', '%' . $request->search . '%')
                            ->orWhere('last_name', 'like', '%' . $request->search . '%')
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

        $sortBy = $request->sort_by ?? 'applied_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $applications = $query->orderBy($sortBy, $sortDirection)->get()
            ->map(fn (ScholarshipApplication $application) => $this->applicationPresenter->presentStaffList($application));

        $totalApplications = ScholarshipApplication::count();
        $thisMonthCount = ScholarshipApplication::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $lastMonthCount = ScholarshipApplication::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $completedApplications = ScholarshipApplication::whereIn('status', ['approved', 'rejected'])->count();
        $completionRate = $totalApplications > 0 ? ($completedApplications / $totalApplications) * 100 : 0;

        return Inertia::render('osas-staff/applications', [
            'applications' => $applications,
            'statistics' => [
                'total' => $totalApplications,
                'submitted' => ScholarshipApplication::where('status', 'submitted')->count(),
                'under_verification' => ScholarshipApplication::where('status', 'under_verification')->count(),
                'incomplete' => ScholarshipApplication::where('status', 'incomplete')->count(),
                'verified' => ScholarshipApplication::where('status', 'verified')->count(),
                'under_evaluation' => ScholarshipApplication::where('status', 'under_evaluation')->count(),
                'approved' => ScholarshipApplication::where('status', 'approved')->count(),
                'rejected' => ScholarshipApplication::where('status', 'rejected')->count(),
                'this_month_count' => $thisMonthCount,
                'last_month_count' => $lastMonthCount,
                'completion_rate' => round($completionRate, 1),
            ],
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

    public function review(ScholarshipApplication $application): Response
    {
        $application->load([
            'user.studentProfile',
            'scholarship',
            'documents.verifiedBy',
            'comments.user',
            'interview.interviewer',
            'reviewer',
        ]);

        return Inertia::render('osas-staff/application-review', [
            'application' => $this->applicationPresenter->presentStaffReview($application, Auth::user()),
        ]);
    }

    public function updateStatus(Request $request, ScholarshipApplication $application): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:submitted,under_verification,verified,under_evaluation,approved,rejected,incomplete'],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->workflowService->transitionApplicationStatus(
                $application,
                $request->status,
                $request->user(),
                $request->feedback,
            );
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['status' => $exception->getMessage()]);
        }

        return back()->with('success', 'Application status updated successfully.');
    }

    public function verifyDocument(Request $request, Document $document): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:verified,rejected'],
            'remarks' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $this->documentVerificationService->verifyDocument(
                $document,
                $request->user(),
                $request->status,
                $request->remarks,
            );
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['status' => $exception->getMessage()]);
        }

        return back()->with('success', 'Document verification updated successfully.');
    }

    public function addComment(Request $request, ScholarshipApplication $application): RedirectResponse
    {
        $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
            'type' => ['nullable', 'in:internal,student_visible'],
        ]);

        ApplicationComment::create([
            'application_id' => $application->id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'type' => $request->type ?? 'internal',
            'created_at' => now(),
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    public function export(Request $request)
    {
        $query = ScholarshipApplication::with(['user.studentProfile', 'scholarship', 'documents'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->scholarship_type) {
            $query->whereHas('scholarship', function ($query) use ($request) {
                $query->where('type', $request->scholarship_type);
            });
        }

        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->search) {
            $query->where(function ($query) use ($request) {
                $query
                    ->whereHas('user', function ($userQuery) use ($request) {
                        $userQuery->where('first_name', 'like', '%' . $request->search . '%')
                            ->orWhere('last_name', 'like', '%' . $request->search . '%')
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

        $applications = $query->get();
        $filename = 'scholarship_applications_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return response()->stream(function () use ($applications) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
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
            ]);

            foreach ($applications as $application) {
                fputcsv($file, [
                    $application->id,
                    $application->user->name,
                    $application->user->studentProfile->student_id ?? $application->user->studentProfile->id,
                    $application->user->email,
                    $application->user->studentProfile->course ?? 'N/A',
                    $application->user->studentProfile->year_level ?? 'N/A',
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
                ]);
            }

            fclose($file);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function scheduleInterviewForm(ScholarshipApplication $application): Response|RedirectResponse
    {
        $application->load(['user.studentProfile', 'scholarship', 'interview']);

        if (! in_array($application->status, ['verified', 'under_evaluation'], true)) {
            return redirect()
                ->route('osas.applications.review', $application)
                ->with('error', 'Interview can only be scheduled for verified or under evaluation applications.');
        }

        return Inertia::render('osas-staff/interview-schedule', [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'student' => [
                    'id' => $application->user->id,
                    'name' => $application->user->full_name,
                    'student_id' => $application->user->studentProfile->student_id,
                    'email' => $application->user->email,
                    'phone' => $application->user->studentProfile->mobile_number,
                    'course' => $application->user->studentProfile->course,
                    'year_level' => $application->user->studentProfile->year_level,
                ],
                'scholarship' => [
                    'id' => $application->scholarship->id,
                    'name' => $application->scholarship->name,
                    'type' => $application->scholarship->type,
                ],
                'interview_scheduled' => $application->interview !== null || $application->interview_schedule !== null,
                'interview_date' => $application->interview?->schedule?->format('Y-m-d H:i:s')
                    ?? $application->interview_schedule?->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function scheduleInterview(Request $request, ScholarshipApplication $application): RedirectResponse
    {
        $validated = $request->validate([
            'interview_date' => ['required', 'date', 'after_or_equal:today'],
            'interview_time' => ['required', 'date_format:H:i'],
            'location' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->scholarshipService->scheduleInterview($application, $validated);
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['interview_date' => $exception->getMessage()]);
        }

        return redirect()
            ->route('osas.applications.review', $application)
            ->with('success', 'Interview scheduled successfully.');
    }

    public function recordStipend(Request $request, ScholarshipApplication $application): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'disbursement_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->scholarshipService->recordStipend($application, $validated);
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['amount' => $exception->getMessage()]);
        }

        return back()->with('success', 'Stipend recorded successfully.');
    }
}
