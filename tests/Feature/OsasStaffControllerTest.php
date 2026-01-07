<?php

use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;

describe('OsasStaffController Dashboard', function () {
    beforeEach(function () {
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('shows dashboard with stats for osas staff', function () {
        $response = $this->actingAs($this->staff)->get(route('osas.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('osas_staff/dashboard')
            ->has('stats')
            ->has('pendingApplications')
            ->has('recentDocuments')
            ->has('announcements')
        );
    });

    it('shows correct pending applications count in stats', function () {
        // Create some applications
        $student = User::factory()->withProfile()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['status' => 'active']);
        
        ScholarshipApplication::factory()->count(3)->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => 'submitted',
        ]);
        
        ScholarshipApplication::factory()->count(2)->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => 'approved',
        ]);

        $response = $this->actingAs($this->staff)->get(route('osas.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('stats.pending_applications', 3)
        );
    });

    it('prevents non-staff from accessing osas dashboard', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get(route('osas.dashboard'));

        // Should redirect or return forbidden
        expect($response->status())->toBeIn([302, 403]);
    });

    it('redirects guests to login', function () {
        $response = $this->get(route('osas.dashboard'));

        $response->assertRedirect(route('login'));
    });
});

describe('OsasStaffController Applications', function () {
    beforeEach(function () {
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('shows applications list for staff', function () {
        $response = $this->actingAs($this->staff)->get(route('osas.applications'));

        $response->assertStatus(200);
    });

    it('allows filtering applications by status', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['status' => 'active']);
        
        ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->staff)->get(route('osas.applications', ['status' => 'submitted']));

        $response->assertStatus(200);
    });
});

describe('OsasStaffController Reports', function () {
    beforeEach(function () {
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('shows reports page with statistics', function () {
        $response = $this->actingAs($this->staff)->get(route('osas.analytics.reports'));

        $response->assertStatus(200);
    });
});

describe('OsasStaffController Events', function () {
    beforeEach(function () {
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('shows events page', function () {
        $response = $this->actingAs($this->staff)->get(route('osas.events'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('osas_staff/events')
            ->has('events')
        );
    });
});
