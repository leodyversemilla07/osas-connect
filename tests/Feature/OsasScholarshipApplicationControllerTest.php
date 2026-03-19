<?php

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;

describe('Osas Scholarship Application Controller', function () {
    beforeEach(function () {
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        $this->scholarship = Scholarship::factory()->create(['status' => 'active']);
        $this->application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'verified',
        ]);
    });

    it('renders the interview scheduling form from the extracted staff controller', function () {
        $response = $this->actingAs($this->staff)->get(route('osas.applications.interview', $this->application));

        $response->assertInertia(fn ($page) => $page
            ->component('osas-staff/interview-schedule')
            ->where('application.id', $this->application->id)
            ->has('application.student')
            ->has('application.scholarship')
        );
    });

    it('schedules an interview through the extracted staff controller route', function () {
        $response = $this->actingAs($this->staff)->post(route('osas.scholarships.interview.store', $this->application), [
            'interview_date' => now()->addDays(2)->format('Y-m-d'),
            'interview_time' => '09:00',
            'location' => 'OSAS Office',
            'notes' => 'Bring original documents.',
        ]);

        $response->assertRedirect(route('osas.applications.review', $this->application));

        $this->assertDatabaseHas('interviews', [
            'application_id' => $this->application->id,
            'location' => 'OSAS Office',
            'status' => 'scheduled',
        ]);
    });
});
