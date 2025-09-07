<?php

namespace App\Listeners;

use App\Events\ScholarshipApplicationStatusChanged;
use App\Mail\ScholarshipApplicationStatusChanged as StatusChangedMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendApplicationStatusNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ScholarshipApplicationStatusChanged $event): void
    {
        $application = $event->application;
        $student = $application->student;

        // Don't send email for draft status
        if ($application->status === 'draft') {
            return;
        }

        // Check if student exists and has email
        if (! $student || ! $student->email) {
            return;
        }

        // Send email to the student
        Mail::to($student->email)->send(new StatusChangedMail($application, $event->previousStatus));

        // Optionally, also notify OSAS staff for certain status changes
        if (in_array($application->status, ['submitted', 'incomplete'])) {
            // Get OSAS staff emails
            $osasEmails = User::where('role', 'osas_staff')
                ->pluck('email')
                ->toArray();

            if (! empty($osasEmails)) {
                Mail::to($osasEmails)->send(new StatusChangedMail($application, $event->previousStatus));
            }
        }
    }
}
