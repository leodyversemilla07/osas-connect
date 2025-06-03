<?php

namespace Database\Factories;

use App\Models\ScholarshipApplication;
use App\Models\ScholarshipNotification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ScholarshipNotification>
 */
class ScholarshipNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $notificationTypes = [
            ScholarshipNotification::TYPE_APPLICATION_STATUS,
            ScholarshipNotification::TYPE_DOCUMENT_REQUEST,
            ScholarshipNotification::TYPE_INTERVIEW_SCHEDULE,
            ScholarshipNotification::TYPE_STIPEND_RELEASE,
            ScholarshipNotification::TYPE_RENEWAL_REMINDER,
        ];

        $type = $this->faker->randomElement($notificationTypes);
        $application = ScholarshipApplication::factory()->create();

        $titles = [
            ScholarshipNotification::TYPE_APPLICATION_STATUS => 'Application Status Update',
            ScholarshipNotification::TYPE_DOCUMENT_REQUEST => 'Document Request',
            ScholarshipNotification::TYPE_INTERVIEW_SCHEDULE => 'Interview Schedule',
            ScholarshipNotification::TYPE_STIPEND_RELEASE => 'Stipend Release',
            ScholarshipNotification::TYPE_RENEWAL_REMINDER => 'Scholarship Renewal Reminder',
        ];

        $statusOptions = ['under review', 'approved', 'rejected'];
        $selectedStatus = $this->faker->randomElement($statusOptions);

        $messages = [
            ScholarshipNotification::TYPE_APPLICATION_STATUS => 'Your application status has been updated to '.$selectedStatus,
            ScholarshipNotification::TYPE_DOCUMENT_REQUEST => 'Please submit additional documents for your application',
            ScholarshipNotification::TYPE_INTERVIEW_SCHEDULE => 'You have been scheduled for an interview on '.$this->faker->date(),
            ScholarshipNotification::TYPE_STIPEND_RELEASE => 'Your stipend has been released',
            ScholarshipNotification::TYPE_RENEWAL_REMINDER => 'Please renew your scholarship before the deadline',
        ];

        return [
            'user_id' => function () {
                return User::factory()->create(['role' => 'student'])->id;
            },
            'title' => $titles[$type],
            'message' => $messages[$type],
            'type' => $type,
            'data' => [
                'scholarship_id' => $application->scholarship_id,
                'application_id' => $application->id,
            ],
            'read_at' => $this->faker->boolean(30) ? now() : null,
            'notifiable_type' => 'App\Models\ScholarshipApplication',
            'notifiable_id' => $application->id,
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Set the notification as read
     */
    public function read()
    {
        return $this->state(function (array $attributes) {
            return [
                'read_at' => now(),
            ];
        });
    }

    /**
     * Set the notification as unread
     */
    public function unread()
    {
        return $this->state(function (array $attributes) {
            return [
                'read_at' => null,
            ];
        });
    }
}
