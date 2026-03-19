<?php

use App\Models\Interview;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipNotification;
use App\Models\User;

describe('Interview authorization', function () {
    beforeEach(function () {
        $this->owner = User::factory()->withProfile()->create(['role' => 'student']);
        $this->otherStudent = User::factory()->withProfile()->create(['role' => 'student']);
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->staff = User::factory()->withProfile()->create(['role' => 'osas_staff']);

        $scholarship = Scholarship::factory()->create(['status' => 'active']);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $this->owner->id,
            'scholarship_id' => $scholarship->id,
            'status' => 'verified',
        ]);

        $this->interview = Interview::factory()->scheduled()->create([
            'application_id' => $application->id,
            'interviewer_id' => $this->staff->id,
        ]);
    });

    it('prevents students from viewing interviews they do not own', function () {
        $response = $this->actingAs($this->otherStudent)
            ->get(route('student.interviews.show', $this->interview));

        $response->assertForbidden();
    });

    it('prevents students from requesting reschedule for interviews they do not own', function () {
        $response = $this->actingAs($this->otherStudent)
            ->post(route('student.interviews.reschedule', $this->interview), [
                'reason' => 'Schedule conflict',
            ]);

        $response->assertForbidden();
    });

    it('allows the interview owner to view their interview', function () {
        $response = $this->actingAs($this->owner)
            ->get(route('student.interviews.show', $this->interview));

        $response->assertOk();
    });

    it('records student reschedule requests and notifies staff reviewers', function () {
        $response = $this->actingAs($this->owner)
            ->from(route('student.interviews.show', $this->interview))
            ->post(route('student.interviews.reschedule', $this->interview), [
                'reason' => 'I have a class conflict during the scheduled time.',
            ]);

        $response->assertRedirect(route('student.interviews.show', $this->interview))
            ->assertSessionHas('success', 'Reschedule request submitted successfully.');

        $interview = $this->interview->fresh();

        expect($interview->reschedule_history)->toHaveCount(1)
            ->and($interview->reschedule_history[0]['type'])->toBe('request')
            ->and($interview->reschedule_history[0]['reason'])->toBe('I have a class conflict during the scheduled time.')
            ->and($interview->reschedule_history[0]['requested_by'])->toBe($this->owner->id);

        $notifications = ScholarshipNotification::query()
            ->whereIn('user_id', [$this->admin->id, $this->staff->id])
            ->orderBy('user_id')
            ->get();

        expect($notifications)->toHaveCount(2)
            ->and($notifications->pluck('title')->all())->toBe([
                'Interview Reschedule Request',
                'Interview Reschedule Request',
            ])
            ->and($notifications->pluck('data')->map(fn (array $data) => $data['interview_id'])->unique()->all())->toBe([$this->interview->id]);
    });
});
