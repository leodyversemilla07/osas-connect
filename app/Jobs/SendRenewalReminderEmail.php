<?php

namespace App\Jobs;

use App\Mail\RenewalReminderMail;
use App\Models\ScholarshipApplication;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendRenewalReminderEmail implements ShouldQueue
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
        public ScholarshipApplication $application,
        public int $daysUntilDeadline
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Only send reminder if application is approved
        if ($this->application->status !== 'approved') {
            return;
        }

        $student = $this->application->student;

        if (! $student || ! $student->email) {
            return;
        }

        Mail::to($student->email)->send(
            new RenewalReminderMail($this->application, $this->daysUntilDeadline)
        );
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [60, 120, 300]; // Retry after 1 min, 2 mins, 5 mins
    }
}
