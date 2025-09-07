<?php

namespace App\Services;

use App\Models\FundTracking;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipStipend;
use App\Models\StudentProfile;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StipendManagementService
{
    /**
     * MinSU Scholarship stipend amounts as per policy
     */
    const STIPEND_AMOUNTS = [
        Scholarship::TYPE_ACADEMIC_FULL => 500.00,           // ₱500/month for Full Scholars (President's Lister)
        Scholarship::TYPE_ACADEMIC_PARTIAL => 300.00,       // ₱300/month for Partial Scholars (Dean's Lister)
        Scholarship::TYPE_PERFORMING_ARTS_FULL => 500.00,   // ₱500/month for Full Performing Arts
        Scholarship::TYPE_PERFORMING_ARTS_PARTIAL => 300.00, // ₱300/month for Partial Performing Arts
        Scholarship::TYPE_ECONOMIC_ASSISTANCE => 400.00,    // ₱400/month for Economic Assistance
        Scholarship::TYPE_STUDENT_ASSISTANTSHIP => null,    // Variable based on work hours
    ];

    /**
     * Fund sources as per MinSU policy
     */
    const FUND_SOURCES = [
        'special_trust_fund' => 'Special Trust Fund',
        'student_development_fund' => 'Student Development Fund',
    ];

    /**
     * Calculate monthly stipend for a scholarship application
     */
    public function calculateMonthlyStipend(ScholarshipApplication $application): float
    {
        $scholarshipType = $application->scholarship->type;

        if ($scholarshipType === Scholarship::TYPE_STUDENT_ASSISTANTSHIP) {
            return $this->calculateAssistantshipStipend($application);
        }

        return self::STIPEND_AMOUNTS[$scholarshipType] ?? 0.00;
    }

    /**
     * Generate stipend schedule for an approved scholarship
     */
    public function generateStipendSchedule(ScholarshipApplication $application): Collection
    {
        if ($application->status !== ScholarshipApplication::STATUS_APPROVED) {
            throw new InvalidArgumentException('Can only generate schedule for approved applications');
        }

        $monthlyAmount = $this->calculateMonthlyStipend($application);
        $semester = $application->semester;
        $academicYear = $application->academic_year;

        $schedule = collect();
        $months = $this->getSemesterMonths($semester, $academicYear);

        foreach ($months as $month) {
            $schedule->push([
                'application_id' => $application->id,
                'amount' => $monthlyAmount,
                'month' => $month['name'],
                'academic_year' => $academicYear,
                'semester' => $semester,
                'due_date' => $month['due_date'],
                'status' => ScholarshipStipend::STATUS_PENDING,
                'fund_source' => $this->determineFundSource($application->scholarship),
            ]);
        }

        return $schedule;
    }

    /**
     * Process stipend release for a specific month
     */
    public function releaseStipend(
        ScholarshipApplication $application,
        string $month,
        string $academicYear,
        string $semester,
        ?string $remarks = null
    ): ScholarshipStipend {
        // Check if student is still eligible
        $eligibilityCheck = $this->checkContinuingEligibility($application);

        if (! $eligibilityCheck['eligible']) {
            throw new InvalidArgumentException('Student is no longer eligible for stipend: '.implode(', ', $eligibilityCheck['reasons']));
        }

        // Check if stipend already exists for this period
        $existingStipend = ScholarshipStipend::where('application_id', $application->id)
            ->where('month', $month)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->first();

        if ($existingStipend) {
            throw new InvalidArgumentException('Stipend for this period has already been processed');
        }

        $amount = $this->calculateMonthlyStipend($application);
        $fundSource = $this->determineFundSource($application->scholarship);

        // Check fund availability
        $fundTracking = FundTracking::getAvailableFunds($fundSource, $academicYear, $semester);
        if (! $fundTracking || ! $fundTracking->hasSufficientBalance($amount)) {
            throw new InvalidArgumentException('Insufficient funds available for disbursement');
        }

        DB::beginTransaction();
        try {
            // Disburse from fund tracking
            $fundTracking->disburseAmount($amount);

            // Create stipend record
            $stipend = ScholarshipStipend::create([
                'application_id' => $application->id,
                'processed_by' => Auth::id(),
                'amount' => $amount,
                'month' => $month,
                'academic_year' => $academicYear,
                'semester' => $semester,
                'status' => ScholarshipStipend::STATUS_RELEASED,
                'fund_source' => $fundSource,
                'remarks' => $remarks,
                'processed_at' => now(),
                'released_at' => now(),
            ]);

            // Update application with last stipend date and total amount
            $application->update([
                'last_stipend_date' => now(),
                'amount_received' => ($application->amount_received ?? 0) + $amount,
            ]);

            DB::commit();

            return $stipend;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get stipend history for a student
     */
    public function getStipendHistory(StudentProfile $student): Collection
    {
        return ScholarshipStipend::whereHas('application', function ($query) use ($student) {
            $query->where('user_id', $student->user_id);
        })
            ->with(['application.scholarship'])
            ->orderBy('academic_year', 'desc')
            ->orderBy('processed_at', 'desc')
            ->get();
    }

    /**
     * Get pending stipends for OSAS staff to process
     */
    public function getPendingStipends(?string $fundSource = null): Collection
    {
        $query = ScholarshipStipend::with(['application.scholarship', 'application.student'])
            ->where('status', ScholarshipStipend::STATUS_PENDING)
            ->whereHas('application', function ($q) {
                $q->where('status', ScholarshipApplication::STATUS_APPROVED);
            });

        if ($fundSource) {
            $query->where('fund_source', $fundSource);
        }

        return $query->orderBy('month')
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Get fund utilization report
     */
    public function getFundUtilizationReport(int $academicYear, string $semester): array
    {
        $stipends = ScholarshipStipend::where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('status', ScholarshipStipend::STATUS_RELEASED)
            ->with(['application.scholarship'])
            ->get();

        $report = [
            'total_disbursed' => 0,
            'by_scholarship_type' => [],
            'by_fund_source' => [],
            'beneficiaries_count' => 0,
            'monthly_breakdown' => [],
        ];

        $beneficiaries = collect();

        foreach ($stipends as $stipend) {
            $scholarshipType = $stipend->application->scholarship->type;
            $fundSource = $this->determineFundSource($stipend->application->scholarship);

            // Total disbursed
            $report['total_disbursed'] += $stipend->amount;

            // By scholarship type
            if (! isset($report['by_scholarship_type'][$scholarshipType])) {
                $report['by_scholarship_type'][$scholarshipType] = [
                    'name' => Scholarship::TYPES[$scholarshipType] ?? $scholarshipType,
                    'amount' => 0,
                    'count' => 0,
                ];
            }
            $report['by_scholarship_type'][$scholarshipType]['amount'] += $stipend->amount;
            $report['by_scholarship_type'][$scholarshipType]['count']++;

            // By fund source
            if (! isset($report['by_fund_source'][$fundSource])) {
                $report['by_fund_source'][$fundSource] = [
                    'name' => self::FUND_SOURCES[$fundSource] ?? $fundSource,
                    'amount' => 0,
                ];
            }
            $report['by_fund_source'][$fundSource]['amount'] += $stipend->amount;

            // Monthly breakdown
            if (! isset($report['monthly_breakdown'][$stipend->month])) {
                $report['monthly_breakdown'][$stipend->month] = 0;
            }
            $report['monthly_breakdown'][$stipend->month] += $stipend->amount;

            // Track unique beneficiaries
            $beneficiaries->push($stipend->application->user_id);
        }

        $report['beneficiaries_count'] = $beneficiaries->unique()->count();

        return $report;
    }

    /**
     * Check fund availability for stipend disbursements
     */
    public function checkFundAvailability(string $academicYear, string $semester): array
    {
        $availability = [];

        // Get all pending stipends grouped by fund source
        $pendingStipends = ScholarshipStipend::where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('status', ScholarshipStipend::STATUS_PENDING)
            ->get()
            ->groupBy('fund_source');

        foreach (self::FUND_SOURCES as $fundSource => $fundName) {
            $pendingAmount = $pendingStipends->get($fundSource, collect())->sum('amount');
            $fundTracking = FundTracking::getAvailableFunds($fundSource, $academicYear, $semester);

            $availability[$fundSource] = [
                'fund_name' => $fundName,
                'pending_amount' => $pendingAmount,
                'available_amount' => $fundTracking ? $fundTracking->remaining_budget : 0,
                'sufficient' => $fundTracking ? $fundTracking->hasSufficientBalance($pendingAmount) : false,
                'fund_status' => $fundTracking ? $fundTracking->status : 'not_available',
            ];
        }

        return $availability;
    }

    /**
     * Bulk process stipend disbursements
     */
    public function bulkDisbursStipends(array $stipendIds, User $processor): array
    {
        $results = [
            'successful' => [],
            'failed' => [],
            'total_amount' => 0,
        ];

        foreach ($stipendIds as $stipendId) {
            $stipend = ScholarshipStipend::find($stipendId);

            if (! $stipend) {
                $results['failed'][] = [
                    'stipend_id' => $stipendId,
                    'reason' => 'Stipend not found',
                ];

                continue;
            }

            try {
                $this->disburseSingleStipend($stipend, $processor);
                $results['successful'][] = $stipend;
                $results['total_amount'] += $stipend->amount;
            } catch (\Exception $e) {
                $results['failed'][] = [
                    'stipend_id' => $stipendId,
                    'reason' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Calculate assistantship stipend based on work hours
     */
    private function calculateAssistantshipStipend(ScholarshipApplication $application): float
    {
        // This would integrate with work tracking system
        // For now, return a base amount that can be overridden
        $hoursWorked = $application->application_data['hours_worked'] ?? 40; // Default 40 hours/month
        $hourlyRate = 50.00; // ₱50/hour student rate

        return $hoursWorked * $hourlyRate;
    }

    /**
     * Get semester months for stipend schedule
     */
    private function getSemesterMonths(string $semester, int $academicYear): array
    {
        $months = [];

        switch ($semester) {
            case ScholarshipApplication::SEMESTER_FIRST:
                // August to December
                $startMonth = 8;
                $endMonth = 12;
                break;
            case ScholarshipApplication::SEMESTER_SECOND:
                // January to May
                $startMonth = 1;
                $endMonth = 5;
                break;
            case ScholarshipApplication::SEMESTER_SUMMER:
                // June to July
                $startMonth = 6;
                $endMonth = 7;
                break;
            default:
                throw new InvalidArgumentException('Invalid semester');
        }

        for ($month = $startMonth; $month <= $endMonth; $month++) {
            $year = ($semester === ScholarshipApplication::SEMESTER_SECOND && $month <= 5)
                ? $academicYear + 1
                : $academicYear;

            $months[] = [
                'name' => Carbon::create($year, $month, 1)->format('F'),
                'due_date' => Carbon::create($year, $month, 1)->endOfMonth(),
            ];
        }

        return $months;
    }

    /**
     * Determine fund source for scholarship type
     */
    private function determineFundSource(Scholarship $scholarship): string
    {
        // MinSU policy specifies Special Trust Fund/Student Development Fund
        // This could be configurable per scholarship or automatically determined
        switch ($scholarship->type) {
            case Scholarship::TYPE_ACADEMIC_FULL:
            case Scholarship::TYPE_ACADEMIC_PARTIAL:
                return 'special_trust_fund';
            case Scholarship::TYPE_STUDENT_ASSISTANTSHIP:
                return 'student_development_fund';
            case Scholarship::TYPE_PERFORMING_ARTS_FULL:
            case Scholarship::TYPE_PERFORMING_ARTS_PARTIAL:
                return 'special_trust_fund';
            case Scholarship::TYPE_ECONOMIC_ASSISTANCE:
                return 'student_development_fund';
            default:
                return 'special_trust_fund';
        }
    }

    /**
     * Check if student maintains eligibility for continuing stipend
     */
    private function checkContinuingEligibility(ScholarshipApplication $application): array
    {
        $result = [
            'eligible' => true,
            'reasons' => [],
        ];

        $student = $application->user->studentProfile;

        if (! $student) {
            $result['eligible'] = false;
            $result['reasons'][] = 'Student profile not found';

            return $result;
        }

        // Check enrollment status
        if ($student->enrollment_status !== 'enrolled') {
            $result['eligible'] = false;
            $result['reasons'][] = 'Student is not currently enrolled';
        }

        // Check for academic requirements maintenance
        $scholarshipType = $application->scholarship->type;

        if (in_array($scholarshipType, [Scholarship::TYPE_ACADEMIC_FULL, Scholarship::TYPE_ACADEMIC_PARTIAL])) {
            // Academic scholarships require maintaining GWA
            $requiredGWA = $scholarshipType === Scholarship::TYPE_ACADEMIC_FULL ? 1.450 : 1.750;

            if (! $student->current_gwa || $student->current_gwa > $requiredGWA) {
                $result['eligible'] = false;
                $result['reasons'][] = "GWA requirement not maintained (required: {$requiredGWA}, current: {$student->current_gwa})";
            }
        }

        // Check for conflicting scholarships
        $otherScholarships = $student->scholarshipApplications()
            ->where('id', '!=', $application->id)
            ->where('status', ScholarshipApplication::STATUS_APPROVED)
            ->count();

        if ($otherScholarships > 0) {
            $result['eligible'] = false;
            $result['reasons'][] = 'Student has conflicting scholarship';
        }

        return $result;
    }

    /**
     * Process single stipend disbursement
     */
    private function disburseSingleStipend(ScholarshipStipend $stipend, User $processor): void
    {
        if ($stipend->status !== ScholarshipStipend::STATUS_PENDING) {
            throw new InvalidArgumentException('Stipend has already been processed');
        }

        // Check fund availability
        $fundTracking = FundTracking::getAvailableFunds($stipend->fund_source, $stipend->academic_year, $stipend->semester);
        if (! $fundTracking || ! $fundTracking->hasSufficientBalance($stipend->amount)) {
            throw new InvalidArgumentException('Insufficient funds available for disbursement');
        }

        DB::beginTransaction();
        try {
            // Disburse from fund tracking
            $fundTracking->disburseAmount($stipend->amount);

            // Update stipend status
            $stipend->update([
                'status' => ScholarshipStipend::STATUS_RELEASED,
                'processed_by' => $processor->id,
                'processed_at' => now(),
                'released_at' => now(),
            ]);

            // Update application with last stipend date and total amount
            $application = $stipend->application;
            $application->update([
                'last_stipend_date' => now(),
                'amount_received' => ($application->amount_received ?? 0) + $stipend->amount,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get current academic year
     */
    private function getCurrentAcademicYear(): int
    {
        $now = Carbon::now();

        // Academic year typically starts in August
        return $now->month >= 8 ? $now->year : $now->year - 1;
    }

    /**
     * Get current semester
     */
    private function getCurrentSemester(): string
    {
        $now = Carbon::now();
        $month = $now->month;

        if ($month >= 8 && $month <= 12) {
            return ScholarshipApplication::SEMESTER_FIRST;
        } elseif ($month >= 1 && $month <= 5) {
            return ScholarshipApplication::SEMESTER_SECOND;
        } else {
            return ScholarshipApplication::SEMESTER_SUMMER;
        }
    }
}
