<?php

use App\Models\AssistantshipPayment;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentAssistantshipAssignment;
use App\Models\UniversityOffice;
use App\Models\User;
use App\Models\WorkHourLog;
use App\Services\StudentAssistantshipService;
use Carbon\Carbon;

beforeEach(function () {
    $this->service = new StudentAssistantshipService();
});

describe('StudentAssistantshipService', function () {
    it('creates an assignment for approved application', function () {
        $student = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_STUDENT_ASSISTANTSHIP]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => 'approved',
        ]);
        $office = UniversityOffice::factory()->create();

        $assignment = $this->service->createAssignment($application, $office);

        expect($assignment)->toBeInstanceOf(StudentAssistantshipAssignment::class);
        expect($assignment->status)->toBe(StudentAssistantshipAssignment::STATUS_PENDING_SCREENING);
        expect($assignment->user_id)->toBe($student->id);
        expect($assignment->office_id)->toBe($office->id);
    });

    it('schedules screening for assignment', function () {
        $assignment = StudentAssistantshipAssignment::factory()->pendingScreening()->create();
        $screeningDate = Carbon::now()->addDays(3);

        $updated = $this->service->scheduleScreening($assignment, $screeningDate, 'Please arrive 15 mins early');

        expect($updated->status)->toBe(StudentAssistantshipAssignment::STATUS_SCREENING_SCHEDULED);
        expect($updated->screening_date->toDateString())->toBe($screeningDate->toDateString());
    });

    it('completes screening with pass result', function () {
        $screener = User::factory()->create(['role' => 'osas_staff']);
        $assignment = StudentAssistantshipAssignment::factory()->screeningScheduled()->create();

        $updated = $this->service->completeScreening($assignment, $screener, 85.5, 'Good performance', true);

        expect($updated->status)->toBe(StudentAssistantshipAssignment::STATUS_SCREENING_COMPLETED);
        expect((float) $updated->screening_score)->toBe(85.5);
        expect($updated->screened_by)->toBe($screener->id);
    });

    it('rejects assignment when screening fails', function () {
        $screener = User::factory()->create(['role' => 'osas_staff']);
        $assignment = StudentAssistantshipAssignment::factory()->screeningScheduled()->create();

        $updated = $this->service->completeScreening($assignment, $screener, 55.0, 'Did not meet requirements', false);

        expect($updated->status)->toBe(StudentAssistantshipAssignment::STATUS_REJECTED);
    });

    it('approves assignment with work schedule', function () {
        $assignment = StudentAssistantshipAssignment::factory()->screeningCompleted()->create();
        $schedule = ['monday' => '08:00-12:00', 'wednesday' => '13:00-17:00'];

        $updated = $this->service->approveAssignment(
            $assignment,
            $schedule,
            Carbon::now()->addWeek(),
            Carbon::now()->addMonths(4),
            'Filing and data entry'
        );

        expect($updated->status)->toBe(StudentAssistantshipAssignment::STATUS_APPROVED);
        expect($updated->work_schedule)->toBe($schedule);
        expect($updated->duties_responsibilities)->toBe('Filing and data entry');
    });

    it('activates approved assignment', function () {
        $assignment = StudentAssistantshipAssignment::factory()->approved()->create();

        $updated = $this->service->activateAssignment($assignment);

        expect($updated->status)->toBe(StudentAssistantshipAssignment::STATUS_ACTIVE);
    });

    it('throws exception when activating non-approved assignment', function () {
        $assignment = StudentAssistantshipAssignment::factory()->pendingScreening()->create();

        expect(fn () => $this->service->activateAssignment($assignment))
            ->toThrow(\InvalidArgumentException::class);
    });

    it('logs work hours for active assignment', function () {
        $student = User::factory()->create(['role' => 'student']);
        $assignment = StudentAssistantshipAssignment::factory()->active()->create(['user_id' => $student->id]);

        $log = $this->service->logWorkHours(
            $assignment,
            Carbon::today(),
            '08:00',
            '12:00',
            'Filed documents'
        );

        expect($log)->toBeInstanceOf(WorkHourLog::class);
        expect($log->status)->toBe(WorkHourLog::STATUS_PENDING);
        expect((float) $log->hours_worked)->toBe(4.0);
    });

    it('prevents logging hours for inactive assignment', function () {
        $assignment = StudentAssistantshipAssignment::factory()->pendingScreening()->create();

        expect(fn () => $this->service->logWorkHours(
            $assignment,
            Carbon::today(),
            '08:00',
            '12:00'
        ))->toThrow(\InvalidArgumentException::class);
    });

    it('prevents duplicate work hour entries for same date', function () {
        $student = User::factory()->create(['role' => 'student']);
        $assignment = StudentAssistantshipAssignment::factory()->active()->create(['user_id' => $student->id]);
        $date = Carbon::today();

        // First log should succeed
        $this->service->logWorkHours($assignment, $date, '08:00', '12:00');

        // Second log for same date should fail (either InvalidArgumentException or UniqueConstraintViolation)
        expect(fn () => $this->service->logWorkHours($assignment, $date, '13:00', '17:00'))
            ->toThrow(Exception::class);
    });

    it('approves work hours', function () {
        $approver = User::factory()->create(['role' => 'osas_staff']);
        $log = WorkHourLog::factory()->pending()->create(['hours_worked' => 4.0]);

        $updated = $this->service->approveWorkHours($log, $approver, 4.0, 'Good work');

        expect($updated->status)->toBe(WorkHourLog::STATUS_APPROVED);
        expect((float) $updated->hours_approved)->toBe(4.0);
        expect($updated->approved_by)->toBe($approver->id);
    });

    it('rejects work hours with reason', function () {
        $approver = User::factory()->create(['role' => 'osas_staff']);
        $log = WorkHourLog::factory()->pending()->create();

        $updated = $this->service->rejectWorkHours($log, $approver, 'Hours do not match timesheet');

        expect($updated->status)->toBe(WorkHourLog::STATUS_REJECTED);
        expect($updated->rejection_reason)->toBe('Hours do not match timesheet');
    });

    it('generates payment for approved hours', function () {
        $student = User::factory()->create(['role' => 'student']);
        $assignment = StudentAssistantshipAssignment::factory()->active()->create([
            'user_id' => $student->id,
            'hourly_rate' => 50.00,
        ]);

        // Create approved work hours
        WorkHourLog::factory()->approved()->create([
            'assignment_id' => $assignment->id,
            'user_id' => $student->id,
            'work_date' => Carbon::now()->subDays(5),
            'hours_approved' => 4.0,
        ]);
        WorkHourLog::factory()->approved()->create([
            'assignment_id' => $assignment->id,
            'user_id' => $student->id,
            'work_date' => Carbon::now()->subDays(3),
            'hours_approved' => 4.0,
        ]);

        $payment = $this->service->generatePayment(
            $assignment,
            Carbon::now()->subWeek(),
            Carbon::now()
        );

        expect($payment)->toBeInstanceOf(AssistantshipPayment::class);
        expect((float) $payment->total_hours)->toBe(8.0);
        expect((float) $payment->gross_amount)->toBe(400.0); // 8 hours * 50 rate
        expect($payment->status)->toBe(AssistantshipPayment::STATUS_PENDING);
    });

    it('throws exception when no approved hours for payment', function () {
        $assignment = StudentAssistantshipAssignment::factory()->active()->create();

        expect(fn () => $this->service->generatePayment(
            $assignment,
            Carbon::now()->subWeek(),
            Carbon::now()
        ))->toThrow(\InvalidArgumentException::class);
    });

    it('releases payment and marks hours as paid', function () {
        $student = User::factory()->create(['role' => 'student']);
        $assignment = StudentAssistantshipAssignment::factory()->active()->create(['user_id' => $student->id]);
        
        $log = WorkHourLog::factory()->approved()->create([
            'assignment_id' => $assignment->id,
            'user_id' => $student->id,
            'work_date' => Carbon::now()->subDays(5),
        ]);

        $payment = AssistantshipPayment::factory()->processing()->create([
            'assignment_id' => $assignment->id,
            'user_id' => $student->id,
            'period_start' => Carbon::now()->subWeek(),
            'period_end' => Carbon::now(),
        ]);

        $updated = $this->service->releasePayment($payment, 'PAY-123456');

        expect($updated->status)->toBe(AssistantshipPayment::STATUS_RELEASED);
        expect($updated->payment_reference)->toBe('PAY-123456');
        
        // Check that work hour was marked as paid
        $log->refresh();
        expect($log->status)->toBe(WorkHourLog::STATUS_PAID);
    });

    it('gets student summary with active assignment', function () {
        $student = User::factory()->create(['role' => 'student']);
        $assignment = StudentAssistantshipAssignment::factory()->active()->create(['user_id' => $student->id]);

        $summary = $this->service->getStudentSummary($student);

        expect($summary['has_assignment'])->toBeTrue();
        expect($summary['assignment']->id)->toBe($assignment->id);
    });

    it('gets student summary without assignment', function () {
        $student = User::factory()->create(['role' => 'student']);

        $summary = $this->service->getStudentSummary($student);

        expect($summary['has_assignment'])->toBeFalse();
        expect($summary['total_hours'])->toBe(0);
    });

    it('gets pending screenings', function () {
        StudentAssistantshipAssignment::factory()->pendingScreening()->count(3)->create();
        StudentAssistantshipAssignment::factory()->active()->count(2)->create();

        $pending = $this->service->getPendingScreenings();

        expect($pending)->toHaveCount(3);
    });

    it('gets statistics', function () {
        // Get baseline count
        $baseActiveCount = StudentAssistantshipAssignment::where('status', StudentAssistantshipAssignment::STATUS_ACTIVE)->count();

        // Create new active assignments
        StudentAssistantshipAssignment::factory()->active()->count(2)->create();

        $stats = $this->service->getStatistics();

        // Verify statistics returns expected keys and counts increased
        expect($stats)->toHaveKey('active_assignments');
        expect($stats)->toHaveKey('pending_screenings');
        expect($stats)->toHaveKey('pending_approvals');
        expect($stats)->toHaveKey('pending_payments');
        expect($stats['active_assignments'])->toBeGreaterThanOrEqual($baseActiveCount + 2);
    });

    it('gets available offices', function () {
        UniversityOffice::factory()->create(['max_assistants' => 5, 'is_active' => true]);
        UniversityOffice::factory()->create(['max_assistants' => 3, 'is_active' => true]);
        UniversityOffice::factory()->inactive()->create();

        $offices = $this->service->getAvailableOffices();

        expect($offices)->toHaveCount(2);
        expect($offices->first()->has_slots)->toBeTrue();
    });
});

describe('WorkHourLog Model', function () {
    it('calculates hours worked from time in/out', function () {
        $log = new WorkHourLog([
            'time_in' => '08:00',
            'time_out' => '12:00',
        ]);

        expect($log->calculateHoursWorked())->toBe(4.0);
    });

    it('handles overnight shifts', function () {
        $log = new WorkHourLog([
            'time_in' => '22:00',
            'time_out' => '02:00',
        ]);

        expect($log->calculateHoursWorked())->toBe(4.0);
    });
});

describe('UniversityOffice Model', function () {
    it('checks for available slots', function () {
        $office = UniversityOffice::factory()->create(['max_assistants' => 2]);
        
        // Create one active assignment
        StudentAssistantshipAssignment::factory()->active()->create(['office_id' => $office->id]);

        expect($office->hasAvailableSlots())->toBeTrue();
        expect($office->getRemainingSlots())->toBe(1);
    });

    it('returns no slots when full', function () {
        $office = UniversityOffice::factory()->create(['max_assistants' => 1]);
        
        StudentAssistantshipAssignment::factory()->active()->create(['office_id' => $office->id]);

        expect($office->hasAvailableSlots())->toBeFalse();
        expect($office->getRemainingSlots())->toBe(0);
    });
});
