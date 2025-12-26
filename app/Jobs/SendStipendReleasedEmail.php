<?php

namespace App\Jobs;

use App\Mail\StipendReleasedMail;
use App\Models\ScholarshipStipend;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendStipendReleasedEmail implements ShouldQueue
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
        public ScholarshipStipend $stipend
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Only send email if stipend has been released
        if ($this->stipend->status !== 'released') {
            return;
        }

        $student = $this->stipend->application->student;

        if (! $student || ! $student->email) {
            return;
        }

        Mail::to($student->email)->send(new StipendReleasedMail($this->stipend));
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [60, 120, 300]; // Retry after 1 min, 2 mins, 5 mins
    }
}
