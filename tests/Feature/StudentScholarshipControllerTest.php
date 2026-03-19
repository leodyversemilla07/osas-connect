<?php

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;

describe('Student Scholarship Controllers', function () {
    beforeEach(function () {
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        $this->scholarship = Scholarship::factory()->create([
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);
        $this->application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'under_verification',
        ]);
    });

    it('renders the canonical scholarship application list route', function () {
        $response = $this->actingAs($this->student)->get(route('student.scholarships.applications.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('student/scholarships/my-applications')
            ->has('applications', 1)
            ->has('applications.0.status_label')
            ->has('applications.0.scholarship')
            ->has('applications.0.document_summary')
        );
    });

    it('renders the canonical scholarship application detail route', function () {
        $response = $this->actingAs($this->student)->get(route('student.scholarships.applications.show', $this->application));

        $response->assertInertia(fn ($page) => $page
            ->component('student/scholarships/application-status')
            ->has('application.status_label')
            ->has('application.timeline')
            ->has('application.document_summary')
            ->has('application.next_steps')
        );
    });

    it('redirects the scholarship status alias route to the canonical detail route', function () {
        $response = $this->actingAs($this->student)->get(route('student.scholarships.applications.status', $this->application));

        $response->assertRedirect(route('student.scholarships.applications.show', $this->application));
    });

    it('renders the scholarship catalog page route', function () {
        $response = $this->actingAs($this->student)->get(route('student.scholarships.show', $this->scholarship));

        $response->assertInertia(fn ($page) => $page
            ->component('student/scholarships/show')
            ->has('scholarship')
            ->has('eligibility')
        );
    });

    it('renders the incomplete application edit route', function () {
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'incomplete',
        ]);

        $response = $this->actingAs($this->student)->get(route('student.scholarships.applications.edit', $application));

        $response->assertInertia(fn ($page) => $page
            ->component('student/scholarships/apply')
            ->where('editing', true)
            ->has('application')
            ->has('scholarship')
        );
    });
});
