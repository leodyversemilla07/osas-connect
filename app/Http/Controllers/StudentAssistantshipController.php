<?php

namespace App\Http\Controllers;

use App\Models\AssistantshipPayment;
use App\Models\StudentAssistantshipAssignment;
use App\Models\UniversityOffice;
use App\Models\WorkHourLog;
use App\Services\StudentAssistantshipService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAssistantshipController extends Controller
{
    public function __construct(
        protected StudentAssistantshipService $assistantshipService
    ) {}

    /**
     * Display assistantship dashboard for students.
     */
    public function studentDashboard(Request $request)
    {
        $user = $request->user();
        $summary = $this->assistantshipService->getStudentSummary($user);

        $recentLogs = [];
        $recentPayments = [];

        if ($summary['has_assignment']) {
            $recentLogs = WorkHourLog::where('assignment_id', $summary['assignment']->id)
                ->orderBy('work_date', 'desc')
                ->limit(10)
                ->get();

            $recentPayments = AssistantshipPayment::where('assignment_id', $summary['assignment']->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        }

        return Inertia::render('student/assistantship/dashboard', [
            'summary' => $summary,
            'recentLogs' => $recentLogs,
            'recentPayments' => $recentPayments,
        ]);
    }

    /**
     * Show work hour logging form for students.
     */
    public function logHoursForm(Request $request)
    {
        $user = $request->user();
        $summary = $this->assistantshipService->getStudentSummary($user);

        if (!$summary['has_assignment']) {
            return redirect()->route('student.assistantship.dashboard')
                ->with('error', 'You do not have an active assistantship assignment.');
        }

        return Inertia::render('student/assistantship/log-hours', [
            'assignment' => $summary['assignment'],
        ]);
    }

    /**
     * Store work hour log.
     */
    public function storeHours(Request $request)
    {
        $validated = $request->validate([
            'work_date' => 'required|date|before_or_equal:today',
            'time_in' => 'required|date_format:H:i',
            'time_out' => 'required|date_format:H:i|after:time_in',
            'tasks_performed' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $summary = $this->assistantshipService->getStudentSummary($user);

        if (!$summary['has_assignment']) {
            return back()->with('error', 'You do not have an active assistantship assignment.');
        }

        try {
            $this->assistantshipService->logWorkHours(
                $summary['assignment'],
                Carbon::parse($validated['work_date']),
                $validated['time_in'],
                $validated['time_out'],
                $validated['tasks_performed'] ?? null
            );

            return redirect()->route('student.assistantship.dashboard')
                ->with('success', 'Work hours logged successfully.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * View work hour history for students.
     */
    public function hoursHistory(Request $request)
    {
        $user = $request->user();
        $summary = $this->assistantshipService->getStudentSummary($user);

        $logs = collect();
        if ($summary['has_assignment']) {
            $logs = WorkHourLog::where('assignment_id', $summary['assignment']->id)
                ->orderBy('work_date', 'desc')
                ->paginate(20);
        }

        return Inertia::render('student/assistantship/hours-history', [
            'logs' => $logs,
            'summary' => $summary,
        ]);
    }

    /**
     * View payment history for students.
     */
    public function paymentHistory(Request $request)
    {
        $user = $request->user();
        $summary = $this->assistantshipService->getStudentSummary($user);

        $payments = collect();
        if ($summary['has_assignment']) {
            $payments = AssistantshipPayment::where('assignment_id', $summary['assignment']->id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
        }

        return Inertia::render('student/assistantship/payment-history', [
            'payments' => $payments,
            'summary' => $summary,
        ]);
    }

    // ==================== OSAS STAFF METHODS ====================

    /**
     * Display assistantship management dashboard for staff.
     */
    public function staffDashboard()
    {
        $statistics = $this->assistantshipService->getStatistics();
        $pendingScreenings = $this->assistantshipService->getPendingScreenings();
        $offices = $this->assistantshipService->getAvailableOffices();

        return Inertia::render('osas-staff/assistantship/dashboard', [
            'statistics' => $statistics,
            'pendingScreenings' => $pendingScreenings,
            'offices' => $offices,
        ]);
    }

    /**
     * List all assistantship assignments.
     */
    public function assignments(Request $request)
    {
        $query = StudentAssistantshipAssignment::with(['user', 'office', 'supervisor']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('office_id')) {
            $query->where('office_id', $request->office_id);
        }

        $assignments = $query->orderBy('created_at', 'desc')->paginate(20);
        $offices = UniversityOffice::active()->get();

        return Inertia::render('osas-staff/assistantship/assignments', [
            'assignments' => $assignments,
            'offices' => $offices,
            'statuses' => StudentAssistantshipAssignment::STATUSES,
            'filters' => $request->only(['status', 'office_id']),
        ]);
    }

    /**
     * Show assignment details.
     */
    public function showAssignment(StudentAssistantshipAssignment $assignment)
    {
        $assignment->load(['user', 'office', 'supervisor', 'application', 'screener']);

        $workLogs = $assignment->workHourLogs()
            ->orderBy('work_date', 'desc')
            ->limit(20)
            ->get();

        $payments = $assignment->payments()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('osas-staff/assistantship/assignment-details', [
            'assignment' => $assignment,
            'workLogs' => $workLogs,
            'payments' => $payments,
        ]);
    }

    /**
     * Schedule screening for an assignment.
     */
    public function scheduleScreening(Request $request, StudentAssistantshipAssignment $assignment)
    {
        $validated = $request->validate([
            'screening_date' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ]);

        $this->assistantshipService->scheduleScreening(
            $assignment,
            Carbon::parse($validated['screening_date']),
            $validated['notes'] ?? null
        );

        return back()->with('success', 'Screening scheduled successfully.');
    }

    /**
     * Complete screening for an assignment.
     */
    public function completeScreening(Request $request, StudentAssistantshipAssignment $assignment)
    {
        $validated = $request->validate([
            'score' => 'required|numeric|min:0|max:100',
            'notes' => 'required|string|max:1000',
            'passed' => 'required|boolean',
        ]);

        $this->assistantshipService->completeScreening(
            $assignment,
            $request->user(),
            $validated['score'],
            $validated['notes'],
            $validated['passed']
        );

        return back()->with('success', 'Screening completed.');
    }

    /**
     * Approve assignment and set schedule.
     */
    public function approveAssignment(Request $request, StudentAssistantshipAssignment $assignment)
    {
        $validated = $request->validate([
            'work_schedule' => 'required|array',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'duties_responsibilities' => 'nullable|string|max:2000',
        ]);

        $this->assistantshipService->approveAssignment(
            $assignment,
            $validated['work_schedule'],
            Carbon::parse($validated['start_date']),
            Carbon::parse($validated['end_date']),
            $validated['duties_responsibilities'] ?? null
        );

        return back()->with('success', 'Assignment approved.');
    }

    /**
     * Activate assignment.
     */
    public function activateAssignment(StudentAssistantshipAssignment $assignment)
    {
        try {
            $this->assistantshipService->activateAssignment($assignment);
            return back()->with('success', 'Assignment activated. Student can now log work hours.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * List pending work hour approvals.
     */
    public function pendingApprovals(Request $request)
    {
        $user = $request->user();

        // For staff, show all pending approvals or filter by office
        $query = WorkHourLog::with(['assignment.user', 'assignment.office'])
            ->where('status', WorkHourLog::STATUS_PENDING);

        if ($request->filled('office_id')) {
            $query->whereHas('assignment', function ($q) use ($request) {
                $q->where('office_id', $request->office_id);
            });
        }

        $pendingLogs = $query->orderBy('work_date', 'desc')->paginate(20);
        $offices = UniversityOffice::active()->get();

        return Inertia::render('osas-staff/assistantship/pending-approvals', [
            'pendingLogs' => $pendingLogs,
            'offices' => $offices,
            'filters' => $request->only(['office_id']),
        ]);
    }

    /**
     * Approve work hours.
     */
    public function approveHours(Request $request, WorkHourLog $log)
    {
        $validated = $request->validate([
            'hours_approved' => 'nullable|numeric|min:0|max:24',
            'remarks' => 'nullable|string|max:500',
        ]);

        $this->assistantshipService->approveWorkHours(
            $log,
            $request->user(),
            $validated['hours_approved'] ?? null,
            $validated['remarks'] ?? null
        );

        return back()->with('success', 'Work hours approved.');
    }

    /**
     * Reject work hours.
     */
    public function rejectHours(Request $request, WorkHourLog $log)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $this->assistantshipService->rejectWorkHours(
            $log,
            $request->user(),
            $validated['reason']
        );

        return back()->with('success', 'Work hours rejected.');
    }

    /**
     * List payments.
     */
    public function payments(Request $request)
    {
        $query = AssistantshipPayment::with(['user', 'assignment.office']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('osas-staff/assistantship/payments', [
            'payments' => $payments,
            'statuses' => AssistantshipPayment::STATUSES,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Generate payments for a period.
     */
    public function generatePayments(Request $request)
    {
        $validated = $request->validate([
            'period_start' => 'required|date',
            'period_end' => 'required|date|after:period_start',
        ]);

        $payments = $this->assistantshipService->processBulkPayments(
            Carbon::parse($validated['period_start']),
            Carbon::parse($validated['period_end']),
            $request->user()
        );

        return back()->with('success', "Generated {$payments->count()} payments.");
    }

    /**
     * Release a payment.
     */
    public function releasePayment(Request $request, AssistantshipPayment $payment)
    {
        $validated = $request->validate([
            'payment_reference' => 'nullable|string|max:100',
        ]);

        $this->assistantshipService->releasePayment(
            $payment,
            $validated['payment_reference'] ?? null
        );

        return back()->with('success', 'Payment released.');
    }

    // ==================== OFFICE MANAGEMENT ====================

    /**
     * List university offices.
     */
    public function offices()
    {
        $offices = UniversityOffice::with('supervisor')
            ->withCount(['assignments as active_count' => function ($query) {
                $query->where('status', StudentAssistantshipAssignment::STATUS_ACTIVE);
            }])
            ->paginate(20);

        return Inertia::render('osas-staff/assistantship/offices', [
            'offices' => $offices,
        ]);
    }

    /**
     * Create a new office.
     */
    public function createOffice(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:university_offices,code',
            'description' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'supervisor_id' => 'nullable|exists:users,id',
            'max_assistants' => 'required|integer|min:1|max:50',
        ]);

        UniversityOffice::create($validated);

        return back()->with('success', 'Office created successfully.');
    }

    /**
     * Update an office.
     */
    public function updateOffice(Request $request, UniversityOffice $office)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:university_offices,code,' . $office->id,
            'description' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'supervisor_id' => 'nullable|exists:users,id',
            'max_assistants' => 'required|integer|min:1|max:50',
            'is_active' => 'boolean',
        ]);

        $office->update($validated);

        return back()->with('success', 'Office updated successfully.');
    }
}
