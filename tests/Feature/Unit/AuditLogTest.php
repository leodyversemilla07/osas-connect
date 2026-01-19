<?php

use App\Models\AuditLog;
use App\Models\Scholarship;
use App\Models\ScholarshipStipend;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

test('can create audit log', function () {
    $audit = AuditLog::factory()->create();

    expect($audit->id)->not->toBeNull()
        ->and($audit->action)->toBeString()
        ->and($audit->entity_type)->toBeString()
        ->and($audit->description)->toBeString();
});

test('tracks scholarship approval', function () {
    $scholarship = Scholarship::factory()->create(['status' => 'active']);
    $user = \App\Models\User::factory()->admin()->create();

    $audit = AuditLog::factory()->create([
        'action' => 'scholarship_approval',
        'entity_type' => Scholarship::class,
        'entity_id' => $scholarship->id,
        'user_id' => $user->id,
        'new_values' => ['status' => 'approved'],
        'description' => 'Approved scholarship application #'.$scholarship->id,
    ]);

    expect($audit->action)->toBe('scholarship_approval')
        ->and($audit->entity_type)->toBe(Scholarship::class)
        ->and($audit->entity_id)->toBe($scholarship->id);
});

test('tracks stipend release', function () {
    $stipend = \App\Models\ScholarshipStipend::factory()->create(['status' => 'released']);
    $user = \App\Models\User::factory()->osasStaff()->create();

    $audit = AuditLog::factory()->create([
        'action' => 'stipend_release',
        'entity_type' => \App\Models\ScholarshipStipend::class,
        'entity_id' => $stipend->id,
        'user_id' => $user->id,
        'new_values' => ['status' => 'released'],
        'description' => 'Released stipend #'.$stipend->id,
    ]);

    expect($audit->action)->toBe('stipend_release')
        ->and($audit->entity_type)->toBe(\App\Models\ScholarshipStipend::class)
        ->and($audit->entity_id)->toBe($stipend->id);
});

test('can filter audit logs by action', function () {
    AuditLog::factory()->create(['action' => 'scholarship_approval']);
    AuditLog::factory()->create(['action' => 'stipend_release']);
    AuditLog::factory()->create(['action' => 'user_management']);

    // Use scopes to filter by action type
    $approvals = AuditLog::forScholarshipApproval()->get();
    $stipendReleases = AuditLog::forStipendRelease()->get();
    $userManagement = AuditLog::forUserManagement()->get();

    expect($approvals)->toHaveCount(1)
        ->and($stipendReleases)->toHaveCount(1)
        ->and($userManagement)->toHaveCount(1);
});

test('tracks user management', function () {
    $user = \App\Models\User::factory()->student()->create();

    $audit = AuditLog::factory()->create([
        'action' => 'user_management',
        'entity_type' => \App\Models\User::class,
        'entity_id' => $user->id,
        'user_id' => $user->id,
        'old_values' => ['role' => 'student'],
        'new_values' => ['is_active' => false],
        'description' => 'Deactivated user account #'.$user->id,
    ]);

    expect($audit->action)->toBe('user_management')
        ->and($audit->entity_type)->toBe(\App\Models\User::class);
});

test('stores ip address and user agent', function () {
    $audit = AuditLog::factory()->create([
        'ip_address' => '192.168.1.1',
        'user_agent' => 'Mozilla/5.0',
    ]);

    expect($audit->ip_address)->toBe('192.168.1.1')
        ->and($audit->user_agent)->toBe('Mozilla/5.0');
});

test('stores old and new values as json', function () {
    $oldValues = ['status' => 'pending', 'role' => 'student'];
    $newValues = ['status' => 'approved', 'role' => 'admin'];

    $audit = AuditLog::factory()->create([
        'old_values' => $oldValues,
        'new_values' => $newValues,
    ]);

    expect($audit->old_values)->toBe($oldValues)
        ->and($audit->new_values)->toBe($newValues);
});
