<?php

use App\Models\ScholarshipNotification;
use App\Models\User;

describe('ScholarshipNotification Model', function () {
    it('has factory', function () {
        $notification = ScholarshipNotification::factory()->create();

        expect($notification)->toBeInstanceOf(ScholarshipNotification::class);
        expect($notification->id)->not()->toBeNull();
    });

    it('has working fillable attributes', function () {
        $user = User::factory()->create();

        $data = [
            'user_id' => $user->id,
            'title' => 'Test Notification',
            'message' => 'This is a test notification message',
            'type' => ScholarshipNotification::TYPE_APPLICATION_STATUS,
            'data' => ['key' => 'value'],
            'notifiable_type' => 'App\\Models\\ScholarshipApplication',
            'notifiable_id' => 1,
        ];

        $notification = ScholarshipNotification::create($data);

        expect($notification->user_id)->toBe($user->id);
        expect($notification->title)->toBe('Test Notification');
        expect($notification->message)->toBe('This is a test notification message');
        expect($notification->type)->toBe(ScholarshipNotification::TYPE_APPLICATION_STATUS);
        expect($notification->data)->toBe(['key' => 'value']);
    });

    it('has notification type constants', function () {
        expect(ScholarshipNotification::TYPE_APPLICATION_STATUS)->toBe('application_status');
        expect(ScholarshipNotification::TYPE_DOCUMENT_REQUEST)->toBe('document_request');
        expect(ScholarshipNotification::TYPE_INTERVIEW_SCHEDULE)->toBe('interview_schedule');
        expect(ScholarshipNotification::TYPE_STIPEND_RELEASE)->toBe('stipend_release');
        expect(ScholarshipNotification::TYPE_RENEWAL_REMINDER)->toBe('renewal_reminder');
    });

    it('has working user relationship', function () {
        $user = User::factory()->create();
        $notification = ScholarshipNotification::factory()->create(['user_id' => $user->id]);

        expect($notification->user)->toBeInstanceOf(User::class);
        expect($notification->user->id)->toBe($user->id);
    });

    it('can be marked as read', function () {
        $notification = ScholarshipNotification::factory()->create([
            'read_at' => null,
        ]);

        $notification->markAsRead();

        expect($notification->read_at)->not()->toBeNull();
    });

    it('ignores mark as read if already read', function () {
        $readAt = now()->subDay();
        $notification = ScholarshipNotification::factory()->create([
            'read_at' => $readAt,
        ]);

        $notification->markAsRead();

        expect($notification->read_at->timestamp)->toBe($readAt->timestamp);
    });

    it('has working unread scope', function () {
        ScholarshipNotification::factory()
            ->count(3)
            ->create(['read_at' => null]);
        ScholarshipNotification::factory()
            ->count(2)
            ->create(['read_at' => now()]);

        $unread = ScholarshipNotification::unread()->get();

        expect($unread)->toHaveCount(3);
    });

    it('has working attribute casts', function () {
        $data = ['key' => 'value'];
        $notification = ScholarshipNotification::factory()->create([
            'data' => $data,
            'read_at' => now(),
        ]);

        expect($notification->data)->toBe($data);
        expect($notification->read_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
    });
});
