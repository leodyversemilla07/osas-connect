<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteInterviewRequest;
use App\Http\Requests\RescheduleInterviewRequest;
use App\Http\Requests\ScheduleInterviewRequest;
use App\Models\Interview;
use App\Models\ScholarshipApplication;
use App\Services\InterviewManagementService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterviewController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly InterviewManagementService $interviewService
    ) {}

    /**
     * Display interviews for students
     */
    public function index()
    {
        $this->authorize('viewAny', Interview::class);
        $user = Auth::user();

        $interviews = Interview::whereHas('application', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['application.scholarship', 'interviewer'])
            ->orderBy('schedule', 'desc')
            ->get();

        return Inertia::render('student/interviews/index', [
            'interviews' => $interviews,
        ]);
    }

    /**
     * Display interviews for staff
     */
    public function staffIndex()
    {
        $this->authorize('create', Interview::class);
        $interviews = Interview::with(['application.student.studentProfile', 'application.scholarship', 'interviewer'])
            ->orderBy('schedule', 'desc')
            ->paginate(15);

        return Inertia::render('osas-staff/interviews', [
            'interviews' => $interviews,
        ]);
    }

    /**
     * Show interview dashboard with statistics
     */
    public function dashboard()
    {
        $this->authorize('create', Interview::class);
        $statistics = $this->interviewService->getStatistics();
        $upcomingInterviews = $this->interviewService->getUpcomingInterviews(Auth::user(), 10);
        $todayInterviews = $this->interviewService->getTodayInterviews();

        return Inertia::render('osas-staff/interview-dashboard', [
            'statistics' => $statistics,
            'upcomingInterviews' => $upcomingInterviews,
            'todayInterviews' => $todayInterviews,
        ]);
    }

    /**
     * Show the form for creating a new interview
     */
    public function create()
    {
        $this->authorize('create', Interview::class);
        $applications = ScholarshipApplication::with(['student.studentProfile', 'scholarship'])
            ->where('status', 'verified')
            ->whereDoesntHave('interview')
            ->get();

        return Inertia::render('osas-staff/interview-create', [
            'applications' => $applications,
        ]);
    }

    /**
     * Store a newly created interview
     */
    public function store(ScheduleInterviewRequest $request)
    {
        $this->authorize('create', Interview::class);
        $application = ScholarshipApplication::findOrFail($request->validated()['application_id']);

        $interview = $this->interviewService->scheduleInterview(
            $application,
            Auth::user(),
            $request->validated()['schedule'],
            $request->validated()['location'],
            $request->validated()['notes'] ?? null
        );

        return redirect()->route('osas.interviews.show', $interview)
            ->with('success', 'Interview scheduled successfully.');
    }

    /**
     * Display a specific interview
     */
    public function show(Interview $interview)
    {
        $this->authorize('view', $interview);
        $interview->load(['application.student.studentProfile', 'application.scholarship', 'interviewer']);

        if (Auth::user()->role === 'student') {
            return Inertia::render('student/interviews/show', [
                'interview' => $interview,
            ]);
        }

        return Inertia::render('osas-staff/interview-details', [
            'interview' => $interview,
        ]);
    }

    /**
     * Show the form for editing an interview
     */
    public function edit(Interview $interview)
    {
        $this->authorize('update', $interview);
        $interview->load(['application.student.studentProfile', 'application.scholarship', 'interviewer']);

        return Inertia::render('osas-staff/interview-edit', [
            'interview' => $interview,
        ]);
    }

    /**
     * Update an interview
     */
    public function update(Request $request, Interview $interview)
    {
        $this->authorize('update', $interview);
        $request->validate([
            'schedule' => ['required', 'date', 'after:now'],
            'location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $interview->update([
            'schedule' => $request->schedule,
            'location' => $request->location,
            'notes' => $request->notes,
        ]);

        return redirect()->route('osas.interviews.show', $interview)
            ->with('success', 'Interview updated successfully.');
    }

    /**
     * Reschedule an interview (staff action)
     */
    public function reschedule(RescheduleInterviewRequest $request, Interview $interview)
    {
        $this->authorize('update', $interview);
        $rescheduledInterview = $this->interviewService->rescheduleInterview(
            $interview,
            $request->validated()['new_schedule'],
            $request->validated()['reason'],
            $request->validated()['location'] ?? null
        );

        return redirect()->route('osas.interviews.show', $rescheduledInterview)
            ->with('success', 'Interview rescheduled successfully.');
    }

    /**
     * Complete an interview
     */
    public function complete(CompleteInterviewRequest $request, Interview $interview)
    {
        $this->authorize('update', $interview);
        $completedInterview = $this->interviewService->completeInterview(
            $interview,
            $request->validated()['scores'],
            $request->validated()['recommendation'],
            $request->validated()['notes'] ?? null
        );

        return redirect()->route('osas.interviews.show', $completedInterview)
            ->with('success', 'Interview completed successfully.');
    }

    /**
     * Cancel an interview
     */
    public function cancel(Request $request, Interview $interview)
    {
        $this->authorize('update', $interview);
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $cancelledInterview = $this->interviewService->cancelInterview(
            $interview,
            $request->validated()['reason']
        );

        return redirect()->route('osas.interviews.show', $cancelledInterview)
            ->with('success', 'Interview cancelled successfully.');
    }

    /**
     * Mark interview as no-show
     */
    public function markAsNoShow(Interview $interview)
    {
        $this->authorize('update', $interview);
        $noShowInterview = $this->interviewService->markAsNoShow($interview);

        return redirect()->route('osas.interviews.show', $noShowInterview)
            ->with('success', 'Interview marked as no-show.');
    }

    /**
     * Get statistics overview
     */
    public function statisticsOverview()
    {
        $this->authorize('create', Interview::class);
        $statistics = $this->interviewService->getStatistics();

        return response()->json($statistics);
    }

    /**
     * Student request to reschedule interview
     */
    public function requestReschedule(Request $request, Interview $interview)
    {
        $this->authorize('requestReschedule', $interview);
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        if (! $interview->canBeRescheduled()) {
            return back()->withErrors([
                'interview' => 'This interview cannot be rescheduled.',
            ]);
        }

        // Add reschedule request to history without changing schedule
        $rescheduleHistory = $interview->reschedule_history ?? [];
        $rescheduleHistory[] = [
            'type' => 'request',
            'reason' => $request->reason,
            'requested_by' => Auth::id(),
            'requested_at' => now()->toISOString(),
            'status' => 'pending',
        ];

        $interview->update([
            'reschedule_history' => $rescheduleHistory,
        ]);

        // Create notification for staff
        $interview->application->notifications()->create([
            'type' => 'interview_reschedule_request',
            'message' => "Student requested interview reschedule: {$request->reason}",
        ]);

        return back()->with('success', 'Reschedule request submitted successfully.');
    }

    /**
     * Get upcoming interviews for dashboard
     */
    public function upcoming()
    {
        $this->authorize('viewAny', Interview::class);
        $user = Auth::user();

        if ($user->role === 'student') {
            $interviews = Interview::whereHas('application', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
                ->where('status', 'scheduled')
                ->where('schedule', '>', now())
                ->with(['application.scholarship', 'interviewer'])
                ->orderBy('schedule')
                ->limit(5)
                ->get();
        } else {
            $interviews = $this->interviewService->getUpcomingInterviews($user);
        }

        return response()->json(['interviews' => $interviews]);
    }
}
