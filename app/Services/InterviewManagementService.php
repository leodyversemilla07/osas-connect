<?php

namespace App\Services;

use App\Models\Interview;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InterviewManagementService
{
    /**
     * Schedule a new interview for an application
     */
    public function scheduleInterview(
        ScholarshipApplication $application,
        User $interviewer,
        Carbon $schedule,
        ?string $location = null,
        string $type = 'in_person'
    ): Interview {
        DB::beginTransaction();

        try {
            $interview = Interview::create([
                'application_id' => $application->id,
                'interviewer_id' => $interviewer->id,
                'schedule' => $schedule,
                'location' => $location,
                'interview_type' => $type,
                'status' => 'scheduled',
                'reschedule_history' => [],
            ]);

            // Update application status
            $application->update(['status' => 'under_evaluation']);

            DB::commit();

            Log::info('Interview scheduled', [
                'interview_id' => $interview->id,
                'application_id' => $application->id,
                'interviewer_id' => $interviewer->id,
                'schedule' => $schedule->toISOString(),
            ]);

            return $interview;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to schedule interview', [
                'error' => $e->getMessage(),
                'application_id' => $application->id,
                'interviewer_id' => $interviewer->id,
            ]);
            throw $e;
        }
    }

    /**
     * Reschedule an existing interview
     */
    public function rescheduleInterview(
        Interview $interview,
        Carbon $newSchedule,
        ?string $reason = null,
        ?User $rescheduledBy = null
    ): Interview {
        if (! $interview->canBeRescheduled()) {
            throw new \InvalidArgumentException('Interview cannot be rescheduled');
        }

        DB::beginTransaction();

        try {
            $oldSchedule = $interview->schedule;
            $rescheduleHistory = $interview->reschedule_history ?? [];

            // Add to reschedule history
            $rescheduleHistory[] = [
                'old_schedule' => $oldSchedule->toISOString(),
                'new_schedule' => $newSchedule->toISOString(),
                'reason' => $reason,
                'rescheduled_by' => $rescheduledBy?->id,
                'rescheduled_at' => now()->toISOString(),
            ];

            $interview->update([
                'schedule' => $newSchedule,
                'status' => 'rescheduled',
                'reschedule_history' => $rescheduleHistory,
            ]);

            DB::commit();

            Log::info('Interview rescheduled', [
                'interview_id' => $interview->id,
                'old_schedule' => $oldSchedule->toISOString(),
                'new_schedule' => $newSchedule->toISOString(),
                'reason' => $reason,
            ]);

            return $interview->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to reschedule interview', [
                'error' => $e->getMessage(),
                'interview_id' => $interview->id,
            ]);
            throw $e;
        }
    }

    /**
     * Complete an interview with scores and recommendation
     */
    public function completeInterview(
        Interview $interview,
        array $scores,
        string $recommendation,
        ?string $notes = null
    ): Interview {
        if ($interview->status === 'completed') {
            throw new \InvalidArgumentException('Interview is already completed');
        }

        DB::beginTransaction();

        try {
            $totalScore = $this->calculateTotalScore($scores);

            $interview->update([
                'status' => 'completed',
                'interview_scores' => $scores,
                'total_score' => $totalScore,
                'recommendation' => $recommendation,
                'interviewer_notes' => $notes,
                'completed_at' => now(),
            ]);

            // Update application status based on recommendation
            $applicationStatus = match ($recommendation) {
                'approved' => 'approved',
                'rejected' => 'rejected',
                'pending' => 'under_review',
                default => 'under_review',
            };

            $interview->application->update(['status' => $applicationStatus]);

            DB::commit();

            Log::info('Interview completed', [
                'interview_id' => $interview->id,
                'total_score' => $totalScore,
                'recommendation' => $recommendation,
            ]);

            return $interview->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to complete interview', [
                'error' => $e->getMessage(),
                'interview_id' => $interview->id,
            ]);
            throw $e;
        }
    }

    /**
     * Cancel an interview
     */
    public function cancelInterview(Interview $interview, ?string $reason = null): Interview
    {
        if ($interview->status === 'completed') {
            throw new \InvalidArgumentException('Cannot cancel a completed interview');
        }

        DB::beginTransaction();

        try {
            $interview->update([
                'status' => 'cancelled',
                'remarks' => $reason ? "Cancelled: {$reason}" : 'Cancelled',
            ]);

            // Update application status back to pending
            $interview->application->update(['status' => 'submitted']);

            DB::commit();

            Log::info('Interview cancelled', [
                'interview_id' => $interview->id,
                'reason' => $reason,
            ]);

            return $interview->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to cancel interview', [
                'error' => $e->getMessage(),
                'interview_id' => $interview->id,
            ]);
            throw $e;
        }
    }

    /**
     * Mark interview as no-show
     */
    public function markAsNoShow(Interview $interview): Interview
    {
        if ($interview->status === 'completed') {
            throw new \InvalidArgumentException('Cannot mark completed interview as no-show');
        }

        DB::beginTransaction();

        try {
            $interview->update([
                'status' => 'no_show',
                'remarks' => 'Student did not attend the scheduled interview',
            ]);

            // Update application status
            $interview->application->update(['status' => 'rejected']);

            DB::commit();

            Log::info('Interview marked as no-show', [
                'interview_id' => $interview->id,
            ]);

            return $interview->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to mark interview as no-show', [
                'error' => $e->getMessage(),
                'interview_id' => $interview->id,
            ]);
            throw $e;
        }
    }

    /**
     * Get upcoming interviews for an interviewer
     */
    public function getUpcomingInterviews(User $interviewer, int $days = 7): Collection
    {
        return Interview::with(['application.student'])
            ->where('interviewer_id', $interviewer->id)
            ->where('status', 'scheduled')
            ->whereBetween('schedule', [now(), now()->addDays($days)])
            ->orderBy('schedule')
            ->get();
    }

    /**
     * Get interview statistics for reporting
     */
    public function getInterviewStatistics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = Interview::query();

        if ($startDate && $endDate) {
            $query->whereBetween('schedule', [$startDate, $endDate]);
        }

        // Get total count before applying groupBy
        $totalCount = $query->count();

        $stats = $query->selectRaw('
            status,
            COUNT(*) as count,
            AVG(total_score) as avg_score
        ')
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        return [
            'total_interviews' => $totalCount,
            'completed' => $stats->get('completed')?->count ?? 0,
            'scheduled' => $stats->get('scheduled')?->count ?? 0,
            'cancelled' => $stats->get('cancelled')?->count ?? 0,
            'no_show' => $stats->get('no_show')?->count ?? 0,
            'average_score' => $stats->get('completed')?->avg_score ?? 0,
        ];
    }

    /**
     * Calculate total score from individual scores
     */
    private function calculateTotalScore(array $scores): float
    {
        $numericScores = array_filter($scores, 'is_numeric');

        if (empty($numericScores)) {
            return 0.0;
        }

        return round(array_sum($numericScores) / count($numericScores), 2);
    }

    /**
     * Check for interview conflicts for an interviewer
     */
    public function hasConflict(User $interviewer, Carbon $schedule, int $bufferMinutes = 30): bool
    {
        $startTime = $schedule->copy()->subMinutes($bufferMinutes);
        $endTime = $schedule->copy()->addMinutes($bufferMinutes);

        return Interview::where('interviewer_id', $interviewer->id)
            ->whereIn('status', ['scheduled', 'rescheduled'])
            ->whereBetween('schedule', [$startTime, $endTime])
            ->exists();
    }

    /**
     * Get comprehensive statistics (alias for getInterviewStatistics)
     */
    public function getStatistics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        return $this->getInterviewStatistics($startDate, $endDate);
    }

    /**
     * Get today's interviews
     */
    public function getTodayInterviews(): Collection
    {
        return Interview::with(['application.student.studentProfile', 'application.scholarship', 'interviewer'])
            ->whereDate('schedule', today())
            ->whereIn('status', ['scheduled', 'rescheduled'])
            ->orderBy('schedule')
            ->get();
    }
}
