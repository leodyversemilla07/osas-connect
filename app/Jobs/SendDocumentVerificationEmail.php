<?php

namespace App\Jobs;

use App\Mail\DocumentVerificationMail;
use App\Models\Document;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendDocumentVerificationEmail implements ShouldQueue
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
        public Document $document
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Only send email if document has been verified or rejected
        if (! in_array($this->document->verification_status, ['verified', 'rejected'])) {
            return;
        }

        $student = $this->document->application->student;

        if (! $student || ! $student->email) {
            return;
        }

        Mail::to($student->email)->send(new DocumentVerificationMail($this->document));
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [60, 120, 300]; // Retry after 1 min, 2 mins, 5 mins
    }
}
