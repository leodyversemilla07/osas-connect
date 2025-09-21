<?php

use App\Models\Interview;
use App\Models\ScholarshipApplication;
use App\Models\User;
use App\Services\InterviewManagementService;
use Carbon\Carbon;

beforeEach(function () {
    $this->service = app(InterviewManagementService::class);
    $this->interviewer = User::factory()->create(['role' => 'osas_staff']);
    $this->student = User::factory()->create(['role' => 'student']);
    $this->application = ScholarshipApplication::factory()->create(['user_id' => $this->student->id]);
});

it('can schedule an interview', function () {
    $schedule = Carbon::now()->addDays(3);

    $interview = $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $schedule,
        'Conference Room A',
        'in_person'
    );

    expect($interview)
        ->toBeInstanceOf(Interview::class)
        ->and($interview->application_id)->toBe($this->application->id)
        ->and($interview->interviewer_id)->toBe($this->interviewer->id)
        ->and($interview->schedule->format('Y-m-d H:i'))->toBe($schedule->format('Y-m-d H:i'))
        ->and($interview->location)->toBe('Conference Room A')
        ->and($interview->interview_type)->toBe('in_person')
        ->and($interview->status)->toBe('scheduled');

    expect($this->application->fresh()->status)->toBe('under_evaluation');
});

it('can reschedule an interview', function () {
    $originalSchedule = Carbon::now()->addDays(3);
    $newSchedule = Carbon::now()->addDays(5);

    $interview = $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $originalSchedule
    );

    $rescheduledInterview = $this->service->rescheduleInterview(
        $interview,
        $newSchedule,
        'Student request'
    );

    expect($rescheduledInterview->schedule->format('Y-m-d H:i'))->toBe($newSchedule->format('Y-m-d H:i'))
        ->and($rescheduledInterview->status)->toBe('rescheduled')
        ->and($rescheduledInterview->reschedule_history)->toHaveCount(1)
        ->and($rescheduledInterview->reschedule_history[0]['reason'])->toBe('Student request');
});

it('cannot reschedule a completed interview', function () {
    $schedule = Carbon::now()->addDays(3);

    $interview = $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $schedule
    );

    // Complete the interview first - but update directly since service might have enum issues
    $interview->update([
        'status' => 'completed',
        'completed_at' => now(),
    ]);

    expect(fn () => $this->service->rescheduleInterview(
        $interview->fresh(),
        Carbon::now()->addDays(5),
        'Test reason'
    ))->toThrow(InvalidArgumentException::class);
});

it('can complete an interview with scores and recommendation', function () {
    $schedule = Carbon::now()->addDays(3);

    $interview = $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $schedule
    );

    $scores = ['communication' => 85, 'technical' => 90, 'attitude' => 88];
    $expectedTotal = 87.67; // average of scores

    $completedInterview = $this->service->completeInterview(
        $interview,
        $scores,
        'approved',
        'Excellent candidate'
    );

    expect($completedInterview->status)->toBe('completed')
        ->and($completedInterview->interview_scores)->toBe($scores)
        ->and((float) $completedInterview->total_score)->toBe($expectedTotal)
        ->and($completedInterview->recommendation)->toBe('approved')
        ->and($completedInterview->interviewer_notes)->toBe('Excellent candidate')
        ->and($completedInterview->completed_at)->not->toBeNull();

    expect($this->application->fresh()->status)->toBe('approved');
});

it('can cancel an interview', function () {
    $schedule = Carbon::now()->addDays(3);

    $interview = $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $schedule
    );

    $cancelledInterview = $this->service->cancelInterview($interview, 'Student withdrew');

    expect($cancelledInterview->status)->toBe('cancelled')
        ->and($cancelledInterview->remarks)->toBe('Cancelled: Student withdrew');

    expect($this->application->fresh()->status)->toBe('submitted');
});

it('can mark interview as no-show', function () {
    $schedule = Carbon::now()->addDays(3);

    $interview = $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $schedule
    );

    $noShowInterview = $this->service->markAsNoShow($interview);

    expect($noShowInterview->status)->toBe('no_show')
        ->and($noShowInterview->remarks)->toBe('Student did not attend the scheduled interview');

    expect($this->application->fresh()->status)->toBe('rejected');
});

it('can detect scheduling conflicts', function () {
    $schedule = Carbon::now()->addDays(3)->setTime(14, 0);

    // Schedule first interview
    $this->service->scheduleInterview(
        $this->application,
        $this->interviewer,
        $schedule
    );

    // Try to schedule another interview 15 minutes later (within buffer)
    $conflictingSchedule = $schedule->copy()->addMinutes(15);

    expect($this->service->hasConflict($this->interviewer, $conflictingSchedule))->toBeTrue();

    // Schedule 1 hour later (outside buffer)
    $nonConflictingSchedule = $schedule->copy()->addHour();

    expect($this->service->hasConflict($this->interviewer, $nonConflictingSchedule))->toBeFalse();
});

it('can get upcoming interviews for interviewer', function () {
    $tomorrow = Carbon::now()->addDay()->setTime(10, 0);
    $nextWeek = Carbon::now()->addWeek();

    // Create interviews
    $this->service->scheduleInterview($this->application, $this->interviewer, $tomorrow);

    $anotherApplication = ScholarshipApplication::factory()->create();
    $this->service->scheduleInterview($anotherApplication, $this->interviewer, $nextWeek);

    $upcomingInterviews = $this->service->getUpcomingInterviews($this->interviewer);

    expect($upcomingInterviews)->toHaveCount(2)
        ->and($upcomingInterviews->first()->schedule->format('Y-m-d'))->toBe($tomorrow->format('Y-m-d'));
});

it('calculates interview statistics correctly', function () {
    $yesterday = Carbon::yesterday();
    $tomorrow = Carbon::tomorrow();

    // Create various interviews
    $interview1 = $this->service->scheduleInterview($this->application, $this->interviewer, $tomorrow);

    $application2 = ScholarshipApplication::factory()->create();
    $interview2 = $this->service->scheduleInterview($application2, $this->interviewer, $yesterday);
    $this->service->completeInterview($interview2, ['score' => 85], 'approved');

    $application3 = ScholarshipApplication::factory()->create();
    $interview3 = $this->service->scheduleInterview($application3, $this->interviewer, $yesterday);
    $this->service->cancelInterview($interview3, 'Test cancellation');

    $stats = $this->service->getInterviewStatistics();

    expect($stats['total_interviews'])->toBe(3)
        ->and($stats['scheduled'])->toBe(1)
        ->and($stats['completed'])->toBe(1)
        ->and($stats['cancelled'])->toBe(1)
        ->and($stats['no_show'])->toBe(0)
        ->and($stats['average_score'])->toBe(85.0);
});
