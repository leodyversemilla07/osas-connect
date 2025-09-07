<?php

use App\Models\ScholarshipNotification;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('NotificationController', function () {
    beforeEach(function () {
        $this->student = User::factory()->create([
            'role' => 'student',
            'email' => 'student@test.com',
        ]);

        $this->studentProfile = StudentProfile::factory()->create([
            'user_id' => $this->student->id,
        ]); // Create some notifications for the student
        $this->notifications = ScholarshipNotification::factory()
            ->count(5)
            ->create([
                'user_id' => $this->student->id,
                'read_at' => null,
            ]);

        // Create some read notifications
        $this->readNotifications = ScholarshipNotification::factory()
            ->count(3)
            ->create([
                'user_id' => $this->student->id,
                'read_at' => now(),
            ]);
    });

    test('index returns paginated notifications for authenticated user', function () {
        $response = $this->actingAs($this->student)->get(route('student.notifications.index'));

        $response->assertSuccessful();
        $response->assertJsonStructure([
            'notifications' => [
                'data' => ['*' => ['id', 'title', 'message', 'type', 'is_read', 'created_at']],
                'current_page',
                'per_page',
                'total',
            ],
        ]);

        $data = $response->json();
        expect($data['notifications']['total'])->toBe(8); // 5 unread + 3 read
    });

    test('unread count returns correct number', function () {
        $response = $this->actingAs($this->student)->get(route('student.notifications.unread-count'));

        $response->assertSuccessful();
        $data = $response->json();

        expect($data['unread_count'])->toBe(5);
    });

    test('mark as read updates notification status', function () {
        $notification = $this->notifications->first();

        $response = $this->actingAs($this->student)->post(route('student.notifications.read', $notification));

        $response->assertStatus(200);

        $notification->refresh();
        expect($notification->is_read)->toBe(true);
        expect($notification->read_at)->not()->toBeNull();
    });

    test('mark all as read updates all unread notifications', function () {
        $response = $this->actingAs($this->student)->post(route('student.notifications.read-all'));

        $response->assertStatus(200);
        $unreadCount = ScholarshipNotification::where('user_id', $this->student->id)->whereNull('read_at')->count();

        expect($unreadCount)->toBe(0);
    });

    test('delete notification removes it from database', function () {
        $notification = $this->notifications->first();
        $notificationId = $notification->id;

        $response = $this->actingAs($this->student)->delete(route('student.notifications.destroy', $notification));

        $response->assertStatus(200);

        $exists = ScholarshipNotification::where('id', $notificationId)->exists();
        expect($exists)->toBe(false);
    });

    test('bulk delete removes multiple notifications', function () {
        $notificationIds = $this->notifications->take(3)->pluck('id')->toArray();

        $response = $this->actingAs($this->student)->post(route('student.notifications.bulk-delete'), [
            'notification_ids' => $notificationIds,
        ]);

        $response->assertStatus(200);

        $remainingCount = ScholarshipNotification::whereIn('id', $notificationIds)->count();
        expect($remainingCount)->toBe(0);
    });

    test('users can only access their own notifications', function () {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $otherNotification = ScholarshipNotification::factory()->create([
            'user_id' => $otherStudent->id,
        ]);
        $response = $this->actingAs($this->student)->post(route('student.notifications.read', $otherNotification));

        $response->assertStatus(403);
    });

    test('non-student users cannot access notification endpoints', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get(route('student.notifications.index'));

        $response->assertStatus(302); // Redirected due to role middleware
    });

    test('unauthenticated users are redirected', function () {
        $response = $this->get(route('student.notifications.index'));

        $response->assertRedirect();
    });

    test('notifications are ordered by creation date desc', function () {
        $response = $this->actingAs($this->student)->get(route('student.notifications.index'));

        $data = $response->json();
        $notifications = $data['notifications']['data'];

        // Check that notifications are in descending order by created_at
        for ($i = 0; $i < count($notifications) - 1; $i++) {
            $current = strtotime($notifications[$i]['created_at']);
            $next = strtotime($notifications[$i + 1]['created_at']);

            expect($current)->toBeGreaterThanOrEqual($next);
        }
    });

    test('filter by unread works correctly', function () {
        $response = $this->actingAs($this->student)->get(route('student.notifications.index', ['filter' => 'unread']));

        $data = $response->json();
        $notifications = $data['notifications']['data'];

        // All returned notifications should be unread
        foreach ($notifications as $notification) {
            expect($notification['is_read'])->toBe(false);
        }

        expect(count($notifications))->toBe(5);
    });
});
