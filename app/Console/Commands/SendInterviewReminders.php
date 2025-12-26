<?php

namespace App\Console\Commands;

use App\Jobs\SendInterviewReminderEmail;
use App\Models\Interview;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendInterviewReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'interviews:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder emails for upcoming interviews (24 hours before)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for interviews that need reminders...');

        // Get interviews scheduled for tomorrow (24 hours from now, +/- 1 hour window)
        $tomorrow = Carbon::now()->addDay();
        $startWindow = $tomorrow->copy()->subHour();
        $endWindow = $tomorrow->copy()->addHour();

        $interviews = Interview::whereIn('status', ['scheduled', 'rescheduled'])
            ->whereBetween('scheduled_at', [$startWindow, $endWindow])
            ->with(['application.student', 'application.scholarship'])
            ->get();

        if ($interviews->isEmpty()) {
            $this->info('No interviews found that need reminders.');

            return 0;
        }

        $count = 0;
        foreach ($interviews as $interview) {
            // Check if student has email
            if (! $interview->application->student?->email) {
                $this->warn("Skipping interview #{$interview->id} - Student has no email");

                continue;
            }

            // Dispatch the email job
            SendInterviewReminderEmail::dispatch($interview);
            $count++;

            $this->info("Queued reminder for interview #{$interview->id} - {$interview->application->student->name}");
        }

        $this->info("Successfully queued {$count} interview reminder email(s).");

        return 0;
    }
}
