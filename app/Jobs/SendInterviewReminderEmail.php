<?php

namespace App\Jobs;

use App\Mail\InterviewReminderMail;
use App\Models\Interview;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendInterviewReminderEmail implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Interview $interview
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Only send reminder if interview is scheduled and hasn't been completed/cancelled
        if (! in_array($this->interview->status, ['scheduled', 'rescheduled'])) {
            return;
        }

        // Don't send reminder if interview is more than 48 hours away or has already passed
        $hoursUntil = now()->diffInHours($this->interview->scheduled_at, false);
        if ($hoursUntil < 0 || $hoursUntil > 48) {
            return;
        }

        $student = $this->interview->application->student;

        if (! $student || ! $student->email) {
            return;
        }

        Mail::to($student->email)->send(new InterviewReminderMail($this->interview));
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [60, 120, 300]; // Retry after 1 min, 2 mins, 5 mins
    }
}
