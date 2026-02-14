<?php

use App\Models\Interview;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;

describe('Interview authorization', function () {
    beforeEach(function () {
        $this->owner = User::factory()->withProfile()->create(['role' => 'student']);
        $this->otherStudent = User::factory()->withProfile()->create(['role' => 'student']);
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
});
