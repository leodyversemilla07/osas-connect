<?php

use App\Models\AdminProfile;
use App\Models\OsasStaffProfile;
use App\Models\ScholarshipNotification;
use App\Models\StudentProfile;
use App\Models\User;

describe('User Model', function () {
    it('has scholarship notifications relationship', function () {
        $user = User::factory()->create(['role' => 'student']);

        // Create some notifications for the user
        $notifications = ScholarshipNotification::factory()
            ->count(3)
            ->create([
                'user_id' => $user->id,
            ]);

        expect($user->scholarshipNotifications()->count())->toBe(3);
        expect($user->scholarshipNotifications->first())->toBeInstanceOf(ScholarshipNotification::class);
    });

    it('has working role checking methods', function () {
        $student = User::factory()->create(['role' => 'student']);
        $osasStaff = User::factory()->create(['role' => 'osas_staff']);
        $admin = User::factory()->create(['role' => 'admin']);

        // Test student role
        expect($student->isStudent())->toBe(true);
        expect($student->isOsasStaff())->toBe(false);
        expect($student->isAdmin())->toBe(false);

        // Test OSAS staff role
        expect($osasStaff->isStudent())->toBe(false);
        expect($osasStaff->isOsasStaff())->toBe(true);
        expect($osasStaff->isAdmin())->toBe(false);

        // Test admin role
        expect($admin->isStudent())->toBe(false);
        expect($admin->isOsasStaff())->toBe(false);
        expect($admin->isAdmin())->toBe(true);
    });
    
    it('has correct profile relationships', function () {
        $student = User::factory()->create(['role' => 'student']);
        $osasStaff = User::factory()->create(['role' => 'osas_staff']);
        $admin = User::factory()->create(['role' => 'admin']);

        // UserFactory automatically creates profiles, so we just verify they exist and are correct type
        expect($student->studentProfile)->toBeInstanceOf(StudentProfile::class);
        expect($student->studentProfile->user_id)->toBe($student->id);

        expect($osasStaff->osasStaffProfile)->toBeInstanceOf(OsasStaffProfile::class);
        expect($osasStaff->osasStaffProfile->user_id)->toBe($osasStaff->id);

        expect($admin->adminProfile)->toBeInstanceOf(AdminProfile::class);
        expect($admin->adminProfile->user_id)->toBe($admin->id);
    });
    it('returns correct profile based on role', function () {
        $student = User::factory()->create(['role' => 'student']);

        // UserFactory automatically creates the profile
        expect($student->profile())->toBeInstanceOf(StudentProfile::class);
        expect($student->profile()->user_id)->toBe($student->id);

        // Test OSAS staff profile
        $osasStaff = User::factory()->create(['role' => 'osas_staff']);
        expect($osasStaff->profile())->toBeInstanceOf(OsasStaffProfile::class);
        expect($osasStaff->profile()->user_id)->toBe($osasStaff->id);

        // Test admin profile
        $admin = User::factory()->create(['role' => 'admin']);
        expect($admin->profile())->toBeInstanceOf(AdminProfile::class);
        expect($admin->profile()->user_id)->toBe($admin->id);
    });

    it('has working full name attribute', function () {
        $user = User::factory()->create([
            'first_name' => 'John',
            'middle_name' => 'Middle',
            'last_name' => 'Doe',
        ]);

        expect($user->full_name)->toBe('John Middle Doe');

        $userNoMiddle = User::factory()->create([
            'first_name' => 'Jane',
            'middle_name' => null,
            'last_name' => 'Smith',
        ]);

        expect($userNoMiddle->full_name)->toBe('Jane Smith');
    });

    it('returns null avatar when no photo_id', function () {
        $user = User::factory()->create(['photo_id' => null]);

        expect($user->avatar)->toBeNull();
    });

    it('supports mass assignment correctly', function () {
        $userData = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'middle_name' => 'Middle',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'student',
            'is_active' => true,
        ];

        $user = User::create($userData);

        expect($user->first_name)->toBe('Test');
        expect($user->last_name)->toBe('User');
        expect($user->middle_name)->toBe('Middle');
        expect($user->email)->toBe('test@example.com');
        expect($user->role)->toBe('student');
        expect($user->is_active)->toBe(true);
    });

    it('hides sensitive attributes in array', function () {
        $user = User::factory()->create();
        $userArray = $user->toArray();

        expect($userArray)->not()->toHaveKey('password');
        expect($userArray)->not()->toHaveKey('remember_token');
    });
    it('includes appended attributes in array', function () {
        $user = User::factory()->create([
            'first_name' => 'John',
            'middle_name' => null, // Explicitly set to null to avoid faker middle names
            'last_name' => 'Doe',
        ]);

        $userArray = $user->toArray();

        expect($userArray)->toHaveKey('avatar');
        expect($userArray)->toHaveKey('full_name');
        expect($userArray['full_name'])->toBe('John Doe');
    });

    it('has working attribute casts', function () {
        $user = User::factory()->create([
            'is_active' => '1',
            'last_login_at' => '2024-01-01 12:00:00',
        ]);

        expect($user->is_active)->toBe(true);
        expect($user->last_login_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
    });
});
