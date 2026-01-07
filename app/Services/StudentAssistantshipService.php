<?php

namespace App\Services;

use App\Models\AssistantshipPayment;
use App\Models\ScholarshipApplication;
use App\Models\StudentAssistantshipAssignment;
use App\Models\UniversityOffice;
use App\Models\User;
use App\Models\WorkHourLog;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StudentAssistantshipService
{
    /**
     * Create an assignment for an approved assistantship application.
     */
    public function createAssignment(
        ScholarshipApplication $application,
        UniversityOffice $office,
        array $data = []
    ): StudentAssistantshipAssignment {
        return StudentAssistantshipAssignment::create([
            'application_id' => $application->id,
            'user_id' => $application->user_id,
            'office_id' => $office->id,
            'supervisor_id' => $data['supervisor_id'] ?? $office->supervisor_id,
            'status' => StudentAssistantshipAssignment::STATUS_PENDING_SCREENING,
            'hours_per_week' => $data['hours_per_week'] ?? 10,
            'hourly_rate' => $data['hourly_rate'] ?? 50.00,
            'academic_year' => $data['academic_year'] ?? $this->getCurrentAcademicYear(),
            'semester' => $data['semester'] ?? $this->getCurrentSemester(),
            'duties_responsibilities' => $data['duties_responsibilities'] ?? null,
        ]);
    }

    /**
     * Schedule pre-hiring screening.
     */
    public function scheduleScreening(
        StudentAssistantshipAssignment $assignment,
        Carbon $screeningDate,
        ?string $notes = null
    ): StudentAssistantshipAssignment {
        $assignment->update([
            'status' => StudentAssistantshipAssignment::STATUS_SCREENING_SCHEDULED,
            'screening_date' => $screeningDate,
            'remarks' => $notes,
        ]);

        return $assignment->fresh();
    }

    /**
     * Complete screening with results.
     */
    public function completeScreening(
        StudentAssistantshipAssignment $assignment,
        User $screener,
        float $score,
        string $notes,
        bool $passed
    ): StudentAssistantshipAssignment {
        $assignment->update([
            'status' => $passed
                ? StudentAssistantshipAssignment::STATUS_SCREENING_COMPLETED
                : StudentAssistantshipAssignment::STATUS_REJECTED,
            'screening_score' => $score,
            'screening_notes' => $notes,
            'screened_by' => $screener->id,
        ]);

        return $assignment->fresh();
    }

    /**
     * Approve assignment and set work schedule.
     */
    public function approveAssignment(
        StudentAssistantshipAssignment $assignment,
        array $workSchedule,
        Carbon $startDate,
        Carbon $endDate,
        ?string $dutiesResponsibilities = null
    ): StudentAssistantshipAssignment {
        $assignment->update([
            'status' => StudentAssistantshipAssignment::STATUS_APPROVED,
            'work_schedule' => $workSchedule,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duties_responsibilities' => $dutiesResponsibilities ?? $assignment->duties_responsibilities,
        ]);

        return $assignment->fresh();
    }

    /**
     * Activate assignment (student starts working).
     */
    public function activateAssignment(StudentAssistantshipAssignment $assignment): StudentAssistantshipAssignment
    {
        if ($assignment->status !== StudentAssistantshipAssignment::STATUS_APPROVED) {
            throw new \InvalidArgumentException('Assignment must be approved before activation.');
        }

        $assignment->update(['status' => StudentAssistantshipAssignment::STATUS_ACTIVE]);

        return $assignment->fresh();
    }

    /**
     * Log work hours.
     */
    public function logWorkHours(
        StudentAssistantshipAssignment $assignment,
        Carbon $workDate,
        string $timeIn,
        string $timeOut,
        ?string $tasksPerformed = null
    ): WorkHourLog {
        if (!$assignment->canLogHours()) {
            throw new \InvalidArgumentException('Cannot log hours for inactive assignment.');
        }

        // Check for duplicate entry
        $existing = WorkHourLog::where('assignment_id', $assignment->id)
            ->where('work_date', $workDate->toDateString())
            ->first();

        if ($existing) {
            throw new \InvalidArgumentException('Work hours already logged for this date.');
        }

        $log = WorkHourLog::create([
            'assignment_id' => $assignment->id,
            'user_id' => $assignment->user_id,
            'work_date' => $workDate,
            'time_in' => $timeIn,
            'time_out' => $timeOut,
            'tasks_performed' => $tasksPerformed,
            'status' => WorkHourLog::STATUS_PENDING,
        ]);

        // Auto-calculate hours
        $log->hours_worked = $log->calculateHoursWorked();
        $log->save();

        return $log;
    }

    /**
     * Approve work hours.
     */
    public function approveWorkHours(
        WorkHourLog $log,
        User $approver,
        ?float $hoursApproved = null,
        ?string $remarks = null
    ): WorkHourLog {
        $log->approve($approver, $hoursApproved, $remarks);
        return $log->fresh();
    }

    /**
     * Reject work hours.
     */
    public function rejectWorkHours(
        WorkHourLog $log,
        User $approver,
        string $reason
    ): WorkHourLog {
        $log->reject($approver, $reason);
        return $log->fresh();
    }

    /**
     * Generate payment for a period.
     */
    public function generatePayment(
        StudentAssistantshipAssignment $assignment,
        Carbon $periodStart,
        Carbon $periodEnd
    ): AssistantshipPayment {
        // Get approved but unpaid work hours in the period
        $logs = $assignment->workHourLogs()
            ->where('status', WorkHourLog::STATUS_APPROVED)
            ->whereBetween('work_date', [$periodStart, $periodEnd])
            ->get();

        if ($logs->isEmpty()) {
            throw new \InvalidArgumentException('No approved work hours found for this period.');
        }

        $totalHours = $logs->sum('hours_approved');
        $hourlyRate = $assignment->hourly_rate;
        $grossAmount = $totalHours * $hourlyRate;

        return AssistantshipPayment::create([
            'assignment_id' => $assignment->id,
            'user_id' => $assignment->user_id,
            'period_start' => $periodStart,
            'period_end' => $periodEnd,
            'total_hours' => $totalHours,
            'hourly_rate' => $hourlyRate,
            'gross_amount' => $grossAmount,
            'deductions' => 0,
            'net_amount' => $grossAmount,
            'status' => AssistantshipPayment::STATUS_PENDING,
        ]);
    }

    /**
     * Process bulk payments for all active assignments.
     */
    public function processBulkPayments(Carbon $periodStart, Carbon $periodEnd, User $processor): Collection
    {
        $payments = collect();

        $assignments = StudentAssistantshipAssignment::where('status', StudentAssistantshipAssignment::STATUS_ACTIVE)
            ->get();

        foreach ($assignments as $assignment) {
            try {
                $payment = $this->generatePayment($assignment, $periodStart, $periodEnd);
                $payment->process($processor);
                $payments->push($payment);
            } catch (\InvalidArgumentException $e) {
                // Skip assignments with no approved hours
                continue;
            }
        }

        return $payments;
    }

    /**
     * Release payment.
     */
    public function releasePayment(AssistantshipPayment $payment, ?string $reference = null): AssistantshipPayment
    {
        $payment->release($reference);
        return $payment->fresh();
    }

    /**
     * Get pending screenings.
     */
    public function getPendingScreenings(): Collection
    {
        return StudentAssistantshipAssignment::with(['user', 'office', 'application'])
            ->whereIn('status', [
                StudentAssistantshipAssignment::STATUS_PENDING_SCREENING,
                StudentAssistantshipAssignment::STATUS_SCREENING_SCHEDULED,
            ])
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Get active assignments for an office.
     */
    public function getOfficeAssignments(UniversityOffice $office): Collection
    {
        return $office->assignments()
            ->with(['user', 'supervisor'])
            ->where('status', StudentAssistantshipAssignment::STATUS_ACTIVE)
            ->get();
    }

    /**
     * Get pending work hour approvals for supervisor.
     */
    public function getPendingApprovals(User $supervisor): Collection
    {
        return WorkHourLog::with(['assignment.user', 'assignment.office'])
            ->whereHas('assignment', function ($query) use ($supervisor) {
                $query->where('supervisor_id', $supervisor->id)
                    ->orWhereHas('office', function ($q) use ($supervisor) {
                        $q->where('supervisor_id', $supervisor->id);
                    });
            })
            ->where('status', WorkHourLog::STATUS_PENDING)
            ->orderBy('work_date', 'desc')
            ->get();
    }

    /**
     * Get student's assignment summary.
     */
    public function getStudentSummary(User $student): array
    {
        $assignment = StudentAssistantshipAssignment::with(['office', 'supervisor'])
            ->where('user_id', $student->id)
            ->where('status', StudentAssistantshipAssignment::STATUS_ACTIVE)
            ->first();

        if (!$assignment) {
            return [
                'has_assignment' => false,
                'assignment' => null,
                'total_hours' => 0,
                'pending_hours' => 0,
                'total_earnings' => 0,
                'pending_earnings' => 0,
            ];
        }

        return [
            'has_assignment' => true,
            'assignment' => $assignment,
            'total_hours' => $assignment->getTotalHoursWorked(),
            'pending_hours' => $assignment->getPendingHours(),
            'total_earnings' => $assignment->getTotalEarnings(),
            'pending_earnings' => $assignment->getPendingEarnings(),
        ];
    }

    /**
     * Get assistantship statistics.
     */
    public function getStatistics(): array
    {
        $activeAssignments = StudentAssistantshipAssignment::where('status', StudentAssistantshipAssignment::STATUS_ACTIVE)->count();
        $pendingScreenings = StudentAssistantshipAssignment::whereIn('status', [
            StudentAssistantshipAssignment::STATUS_PENDING_SCREENING,
            StudentAssistantshipAssignment::STATUS_SCREENING_SCHEDULED,
        ])->count();
        $pendingApprovals = WorkHourLog::where('status', WorkHourLog::STATUS_PENDING)->count();
        $pendingPayments = AssistantshipPayment::where('status', AssistantshipPayment::STATUS_PENDING)->count();

        $totalHoursThisMonth = WorkHourLog::where('status', WorkHourLog::STATUS_APPROVED)
            ->whereMonth('work_date', now()->month)
            ->whereYear('work_date', now()->year)
            ->sum('hours_approved');

        $totalPaidThisMonth = AssistantshipPayment::where('status', AssistantshipPayment::STATUS_RELEASED)
            ->whereMonth('released_at', now()->month)
            ->whereYear('released_at', now()->year)
            ->sum('net_amount');

        return [
            'active_assignments' => $activeAssignments,
            'pending_screenings' => $pendingScreenings,
            'pending_approvals' => $pendingApprovals,
            'pending_payments' => $pendingPayments,
            'total_hours_this_month' => $totalHoursThisMonth,
            'total_paid_this_month' => $totalPaidThisMonth,
        ];
    }

    /**
     * Get current academic year.
     */
    protected function getCurrentAcademicYear(): int
    {
        $now = now();
        // Academic year starts in August
        return $now->month >= 8 ? $now->year : $now->year - 1;
    }

    /**
     * Get current semester.
     */
    protected function getCurrentSemester(): string
    {
        $month = now()->month;
        
        if ($month >= 8 && $month <= 12) {
            return '1st';
        } elseif ($month >= 1 && $month <= 5) {
            return '2nd';
        } else {
            return 'Summer';
        }
    }

    /**
     * Get all university offices with availability.
     */
    public function getAvailableOffices(): Collection
    {
        return UniversityOffice::active()
            ->withCount(['assignments as active_count' => function ($query) {
                $query->where('status', StudentAssistantshipAssignment::STATUS_ACTIVE);
            }])
            ->get()
            ->map(function ($office) {
                $office->remaining_slots = $office->max_assistants - $office->active_count;
                $office->has_slots = $office->remaining_slots > 0;
                return $office;
            });
    }
}
