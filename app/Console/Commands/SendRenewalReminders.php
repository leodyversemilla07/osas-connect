<?php

namespace App\Console\Commands;

use App\Jobs\SendRenewalReminderEmail;
use App\Models\ScholarshipApplication;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendRenewalReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scholarships:send-renewal-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send renewal reminder emails to students with scholarships expiring soon';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for scholarships that need renewal reminders...');

        // Send reminders at 30, 14, 7, and 3 days before semester end
        $reminderDays = [30, 14, 7, 3];
        $totalQueued = 0;

        foreach ($reminderDays as $days) {
            $applications = $this->getApplicationsNeedingReminder($days);

            foreach ($applications as $application) {
                if (! $application->student?->email) {
                    $this->warn("Skipping application #{$application->id} - Student has no email");

                    continue;
                }

                SendRenewalReminderEmail::dispatch($application, $days);
                $totalQueued++;

                $this->info("Queued {$days}-day reminder for {$application->student->name} - {$application->scholarship->name}");
            }
        }

        $this->info("Successfully queued {$totalQueued} renewal reminder email(s).");

        return 0;
    }

    /**
     * Get applications that need renewal reminders
     */
    private function getApplicationsNeedingReminder(int $daysBeforeDeadline): \Illuminate\Database\Eloquent\Collection
    {
        // Calculate the approximate end of current semester
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Semester deadlines (approximate):
        // First Semester (Aug-Dec): Deadline around mid-December
        // Second Semester (Jan-May): Deadline around mid-May
        // Summer (Jun-Jul): Deadline around end of July

        if ($currentMonth >= 8 && $currentMonth <= 12) {
            // First semester - deadline December 15
            $deadline = Carbon::create($currentYear, 12, 15);
        } elseif ($currentMonth >= 1 && $currentMonth <= 5) {
            // Second semester - deadline May 15
            $deadline = Carbon::create($currentYear, 5, 15);
        } else {
            // Summer - deadline July 31
            $deadline = Carbon::create($currentYear, 7, 31);
        }

        // Check if today is exactly X days before deadline
        $reminderDate = $deadline->copy()->subDays($daysBeforeDeadline);

        if (! Carbon::today()->isSameDay($reminderDate)) {
            return collect();
        }

        // Get approved applications from the current academic year
        return ScholarshipApplication::where('status', 'approved')
            ->whereYear('created_at', '>=', $currentYear - 1)
            ->with(['student', 'scholarship'])
            ->get();
    }
}
