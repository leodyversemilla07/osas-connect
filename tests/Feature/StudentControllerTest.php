<?php

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('StudentController Dashboard Stats', function () {
    beforeEach(function () {
        // Create a student user with profile
        $this->student = User::factory()->create([
            'role' => 'student',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@student.test',
        ]);

        $this->studentProfile = StudentProfile::factory()->create([
            'user_id' => $this->student->id,
            'student_id' => 'STU2025001',
            'course' => 'BSIT',
            'year_level' => '3rd Year',
            'current_gwa' => 1.5,
        ]);

        // Create some scholarships
        $this->scholarships = Scholarship::factory()->count(5)->create([
            'status' => 'active',
        ]);

        // Create some applications for the student
        $this->applications = ScholarshipApplication::factory()->count(3)->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarships->random()->id,
        ]);
    });

    test('dashboard stats endpoint returns correct data structure', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.dashboard.stats'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_applications',
            'pending_applications',
            'approved_applications',
            'draft_applications',
            'rejected_applications',
            'available_scholarships',
            'upcoming_deadlines',
            'recent_notifications_count',
            'current_gwa',
            'eligible_scholarships_count',
        ]);
    });
    test('dashboard stats calculates application counts correctly', function () {
        // Clear any existing applications for this student to ensure clean test data
        ScholarshipApplication::where('user_id', $this->student->id)->delete();

        // Create applications with different statuses
        ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarships->first()->id,
            'status' => 'approved',
        ]);

        ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarships->skip(1)->first()->id,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('student.dashboard.stats'));

        $data = $response->json();

        expect($data['total_applications'])->toBe(2);
        expect($data['approved_applications'])->toBe(1);
        expect($data['draft_applications'])->toBe(1);
    });
    test('non-student users cannot access dashboard stats', function () {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->get(route('student.dashboard.stats'));

        $response->assertStatus(302); // Redirected by middleware, not 403
    });

    test('unauthenticated users are redirected', function () {
        $response = $this->get(route('student.dashboard.stats'));

        $response->assertRedirect();
    });
});

describe('StudentController Recent Activity', function () {
    beforeEach(function () {
        $this->student = User::factory()->create(['role' => 'student']);
        $this->studentProfile = StudentProfile::factory()->create(['user_id' => $this->student->id]);
    });

    test('recent activity endpoint returns correct structure', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.dashboard.activity'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'recent_applications',
            'status_updates',
            'upcoming_deadlines',
            'notifications',
        ]);
    });
});

describe('StudentController Scholarship Search', function () {
    beforeEach(function () {
        $this->student = User::factory()->create(['role' => 'student']);
        $this->studentProfile = StudentProfile::factory()->create(['user_id' => $this->student->id]);

        // Clear existing scholarships to ensure clean test data
        Scholarship::truncate();

        // Create test scholarships
        $this->scholarships = collect([
            Scholarship::factory()->create([
                'name' => 'Academic Excellence Scholarship',
                'type' => 'academic_full',
                'status' => 'active',
            ]),
            Scholarship::factory()->create([
                'name' => 'Need-Based Assistance',
                'type' => 'economic_assistance',
                'status' => 'active',
            ]),
            Scholarship::factory()->create([
                'name' => 'Closed Scholarship',
                'type' => 'academic_partial',
                'status' => 'inactive',
            ]),
        ]);
    });

    test('search returns all active scholarships when no filters', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.search'));

        $response->assertStatus(200);
        $data = $response->json();

        expect($data['scholarships'])->toHaveCount(2); // Only active scholarships
    });

    test('search filters by scholarship type', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.search', ['type' => 'academic_full']));

        $response->assertStatus(200);
        $data = $response->json();

        expect($data['scholarships'])->toHaveCount(1);
        expect($data['scholarships'][0]['type'])->toBe('academic_full');
    });

    test('search filters by query text', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.search', ['q' => 'Academic Excellence']));

        $response->assertStatus(200);
        $data = $response->json();

        expect($data['scholarships'])->toHaveCount(1);
        expect($data['scholarships'][0]['name'])->toContain('Academic Excellence');
    });

    test('search respects pagination', function () {
        // Create more scholarships
        Scholarship::factory()->count(15)->create(['status' => 'active']);

        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.search', ['per_page' => 5]));

        $response->assertStatus(200);
        $data = $response->json();

        expect($data['scholarships'])->toHaveCount(5);
        expect($data)->toHaveKey('pagination');
    });
});

describe('StudentController Scholarship Details', function () {
    beforeEach(function () {
        $this->student = User::factory()->create(['role' => 'student']);
        $this->studentProfile = StudentProfile::factory()->create([
            'user_id' => $this->student->id,
            'current_gwa' => 1.5,
        ]);
        $this->scholarship = Scholarship::factory()->create([
            'status' => 'active',
            'eligibility_criteria' => [
                'minimum_gwa' => 1.75,
                'academic_standing' => 'good_standing',
            ],
        ]);
    });

    test('scholarship details endpoint returns complete information', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.details', $this->scholarship));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'scholarship' => [
                'id',
                'name',
                'description',
                'type',
                'requirements',
                'amount',
                'application_start_date',
                'deadline',
                'status',
            ],
            'eligibility' => [
                'can_apply',
                'is_eligible',
                'requirements',
                'reasons',
            ],
            'existing_application',
        ]);
    });

    test('eligibility check works correctly for qualified student', function () {
        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.details', $this->scholarship));

        $data = $response->json();

        expect($data['eligibility']['is_eligible'])->toBe(true);
        expect($data['eligibility']['can_apply'])->toBe(true);
    });

    test('eligibility check fails for unqualified student', function () {
        // Update student to have lower GWA using a direct database query
        \App\Models\StudentProfile::where('user_id', $this->student->id)->update(['current_gwa' => 2.0]);

        // Verify the update worked with a fresh query
        $updatedProfile = \App\Models\StudentProfile::where('user_id', $this->student->id)->first();
        expect((float) $updatedProfile->current_gwa)->toBe(2.0);

        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.details', $this->scholarship));

        $data = $response->json();

        expect($data['eligibility']['is_eligible'])->toBe(false);
        expect($data['eligibility']['reasons'])->toContain('GWA requirement not met');
    });

    test('shows existing application if student already applied', function () {
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('student.scholarships.details', $this->scholarship));

        $data = $response->json();

        expect($data['existing_application'])->not()->toBeNull();
        expect($data['existing_application']['id'])->toBe($application->id);
        expect($data['eligibility']['can_apply'])->toBe(false);
    });
});
