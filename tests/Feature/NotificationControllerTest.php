<?php

use App\Models\ScholarshipNotification;
use App\Models\StudentProfile;
use App\Models\User;

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

    it('returns paginated notifications for authenticated user', function () {
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

    it('returns correct unread count', function () {
        $response = $this->actingAs($this->student)->get(route('student.notifications.unread-count'));

        $response->assertSuccessful();
        $data = $response->json();

        expect($data['unread_count'])->toBe(5);
    });

    it('marks notification as read', function () {
        $notification = $this->notifications->first();

        $response = $this->actingAs($this->student)->post(route('student.notifications.read', $notification));

        $response->assertOk();

        $notification->refresh();
        expect($notification->is_read)->toBe(true);
        expect($notification->read_at)->not()->toBeNull();
    });

    it('marks all notifications as read', function () {
        $response = $this->actingAs($this->student)->post(route('student.notifications.read-all'));

        $response->assertOk();
        $unreadCount = ScholarshipNotification::where('user_id', $this->student->id)->whereNull('read_at')->count();

        expect($unreadCount)->toBe(0);
    });

    it('deletes notification', function () {
        $notification = $this->notifications->first();
        $notificationId = $notification->id;

        $response = $this->actingAs($this->student)->delete(route('student.notifications.destroy', $notification));

        $response->assertOk();

        $exists = ScholarshipNotification::where('id', $notificationId)->exists();
        expect($exists)->toBe(false);
    });

    it('bulk deletes multiple notifications', function () {
        $notificationIds = $this->notifications->take(3)->pluck('id')->toArray();

        $response = $this->actingAs($this->student)->post(route('student.notifications.bulk-delete'), [
            'notification_ids' => $notificationIds,
        ]);

        $response->assertOk();

        $remainingCount = ScholarshipNotification::whereIn('id', $notificationIds)->count();
        expect($remainingCount)->toBe(0);
    });

    it('prevents users from accessing other users notifications', function () {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $otherNotification = ScholarshipNotification::factory()->create([
            'user_id' => $otherStudent->id,
        ]);
        $response = $this->actingAs($this->student)->post(route('student.notifications.read', $otherNotification));

        $response->assertStatus(403);
    });

    it('prevents non-student users from accessing notification endpoints', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get(route('student.notifications.index'));

        $response->assertStatus(302); // Redirected due to role middleware
    });

    it('redirects unauthenticated users', function () {
        $response = $this->get(route('student.notifications.index'));

        $response->assertRedirect();
    });

    it('orders notifications by creation date descending', function () {
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

    it('filters notifications by unread status', function () {
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
