<?php

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StaffInvitation;
use App\Models\User;

describe('AdminController Dashboard', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    it('shows dashboard for admin', function () {
        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/dashboard'));
    });

    it('prevents non-admin from accessing admin dashboard', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get(route('admin.dashboard'));

        expect($response->status())->toBeIn([302, 403]);
    });

    it('redirects guests to login', function () {
        $response = $this->get(route('admin.dashboard'));

        $response->assertRedirect(route('login'));
    });
});

describe('AdminController Staff Management', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    it('lists staff members', function () {
        // Create some staff members
        User::factory()->count(3)->create(['role' => 'osas_staff']);

        $response = $this->actingAs($this->admin)->get(route('admin.staff'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/manage-staff')
            ->has('staff')
        );
    });

    it('can search staff by name', function () {
        User::factory()->create([
            'role' => 'osas_staff',
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.staff', ['search' => 'John']));

        $response->assertStatus(200);
    });

    it('can send staff invitation', function () {
        $response = $this->actingAs($this->admin)->post(route('admin.invitations.store'), [
            'email' => 'newstaff@minsu.edu.ph',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('staff_invitations', [
            'email' => 'newstaff@minsu.edu.ph',
            'status' => 'pending',
        ]);
    });

    it('can revoke pending invitation', function () {
        $invitation = StaffInvitation::factory()->create([
            'invited_by' => $this->admin->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.invitations.revoke', $invitation));

        $response->assertRedirect();

        // The invitation is deleted, not status updated
        $this->assertDatabaseMissing('staff_invitations', [
            'id' => $invitation->id,
        ]);
    });
});

describe('AdminController Scholarships', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    it('lists all scholarships', function () {
        Scholarship::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.scholarships'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/scholarships/index')
            ->has('scholarships')
        );
    });

    it('shows scholarship details', function () {
        $scholarship = Scholarship::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.scholarships.show', $scholarship));

        $response->assertStatus(200);
    });
});

describe('AdminController Applications', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    it('lists all scholarship applications', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create();
        
        ScholarshipApplication::factory()->count(3)->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.scholarship.applications'));

        $response->assertStatus(200);
    });

    it('shows application details', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create();
        
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.scholarship.applications.show', $application));

        $response->assertStatus(200);
    });
});

describe('AdminController Recent Logins', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    it('shows recent logins page', function () {
        $response = $this->actingAs($this->admin)->get(route('admin.recent-logins'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/recent-logins'));
    });
});
