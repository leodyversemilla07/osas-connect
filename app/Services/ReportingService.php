<?php

namespace App\Services;

use App\Models\Interview;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipStipend;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportingService
{
    /**
     * Get comprehensive dashboard statistics
     */
    public function getDashboardStatistics(): array
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        return [
            'overview' => $this->getOverviewStatistics(),
            'applications' => $this->getApplicationStatistics($currentYear),
            'scholarships' => $this->getScholarshipStatistics($currentYear),
            'interviews' => $this->getInterviewStatistics($currentYear),
            'stipends' => $this->getStipendStatistics($currentYear),
            'trends' => $this->getTrendAnalysis(),
            'monthly_breakdown' => $this->getMonthlyBreakdown($currentYear),
            'performance_metrics' => $this->getPerformanceMetrics(),
        ];
    }

    /**
     * Get overview statistics
     */
    private function getOverviewStatistics(): array
    {
        return [
            'total_students' => User::where('role', 'student')->count(),
            'active_scholarships' => Scholarship::where('status', 'active')->count(),
            'total_applications' => ScholarshipApplication::count(),
            'pending_applications' => ScholarshipApplication::where('status', 'submitted')->count(),
            'approved_applications' => ScholarshipApplication::where('status', 'approved')->count(),
            'total_disbursed' => ScholarshipStipend::where('status', 'released')
                ->sum('amount'),
            'students_with_scholarships' => ScholarshipApplication::where('status', 'approved')
                ->distinct('user_id')
                ->count(),
        ];
    }

    /**
     * Get application statistics for a given year
     */
    public function getApplicationStatistics(int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;
        
        $baseQuery = ScholarshipApplication::whereYear('scholarship_applications.created_at', $year);
        
        $total = $baseQuery->count();
        $byStatus = $baseQuery->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $byScholarshipType = ScholarshipApplication::whereYear('scholarship_applications.created_at', $year)
            ->join('scholarships', 'scholarship_applications.scholarship_id', '=', 'scholarships.id')
            ->select('scholarships.type', DB::raw('count(*) as count'))
            ->groupBy('scholarships.type')
            ->pluck('count', 'type')
            ->toArray();

        // Use SQLite-compatible date functions
        $monthlyTrend = ScholarshipApplication::whereYear('scholarship_applications.created_at', $year)
            ->select(
                DB::raw("CAST(strftime('%m', scholarship_applications.created_at) AS INTEGER) as month"),
                DB::raw('count(*) as count')
            )
            ->groupBy(DB::raw("strftime('%m', scholarship_applications.created_at)"))
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [Carbon::create()->month($item->month)->format('M') => $item->count];
            })
            ->toArray();

        // Fill missing months with 0
        $allMonths = collect(range(1, 12))->mapWithKeys(function ($month) {
            return [Carbon::create()->month($month)->format('M') => 0];
        });
        $monthlyTrend = $allMonths->merge($monthlyTrend)->toArray();

        return [
            'total' => $total,
            'by_status' => $byStatus,
            'by_scholarship_type' => $byScholarshipType,
            'monthly_trend' => $monthlyTrend,
            'approval_rate' => $total > 0 ? round(($byStatus['approved'] ?? 0) / $total * 100, 2) : 0,
            'completion_rate' => $this->getApplicationCompletionRate($year),
            'average_processing_time' => $this->getAverageProcessingTime($year),
        ];
    }

    /**
     * Get scholarship statistics
     */
    public function getScholarshipStatistics(int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;

        $scholarships = Scholarship::with(['applications' => function ($query) use ($year) {
            $query->whereYear('created_at', $year);
        }])->get();

        $scholarshipData = $scholarships->map(function ($scholarship) {
            $applications = $scholarship->applications;
            return [
                'name' => $scholarship->name,
                'type' => $scholarship->type,
                'total_applications' => $applications->count(),
                'approved_applications' => $applications->where('status', 'approved')->count(),
                'approval_rate' => $applications->count() > 0 
                    ? round($applications->where('status', 'approved')->count() / $applications->count() * 100, 2) 
                    : 0,
                'total_stipend_budget' => $scholarship->amount ?? 0,
                'disbursed_amount' => $applications->where('status', 'approved')
                    ->sum(function ($app) {
                        return $app->stipends->where('status', 'released')->sum('amount');
                    }),
            ];
        });

        return [
            'total_scholarships' => $scholarships->count(),
            'active_scholarships' => $scholarships->where('status', 'active')->count(),
            'scholarship_breakdown' => $scholarshipData->toArray(),
            'most_popular' => $scholarshipData->sortByDesc('total_applications')->first(),
            'highest_approval_rate' => $scholarshipData->sortByDesc('approval_rate')->first(),
        ];
    }

    /**
     * Get interview statistics
     */
    public function getInterviewStatistics(int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;
        
        $query = Interview::whereYear('interviews.created_at', $year);
        
        $total = $query->count();
        $byStatus = $query->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Use SQLite-compatible date functions
        $monthlyTrend = $query->select(
            DB::raw("CAST(strftime('%m', interviews.created_at) AS INTEGER) as month"),
            DB::raw('count(*) as count')
        )
            ->groupBy('status', DB::raw("strftime('%m', interviews.created_at)"))
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [Carbon::create()->month($item->month)->format('M') => $item->count];
            })
            ->toArray();

        // Fill missing months with 0
        $allMonths = collect(range(1, 12))->mapWithKeys(function ($month) {
            return [Carbon::create()->month($month)->format('M') => 0];
        });
        $monthlyTrend = $allMonths->merge($monthlyTrend)->toArray();

        return [
            'total' => $total,
            'by_status' => $byStatus,
            'monthly_trend' => $monthlyTrend,
            'completion_rate' => $total > 0 ? round(($byStatus['completed'] ?? 0) / $total * 100, 2) : 0,
            'no_show_rate' => $total > 0 ? round(($byStatus['no_show'] ?? 0) / $total * 100, 2) : 0,
            'average_score' => $this->getAverageInterviewScore($year),
            'by_type' => $this->getInterviewsByType($year),
        ];
    }

    /**
     * Get stipend statistics
     */
    public function getStipendStatistics(int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;
        
        $baseQuery = ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year);
        
        $totalAmount = $baseQuery->sum('amount');
        $disbursedAmount = ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year)
            ->where('status', 'released')->sum('amount');
        $pendingAmount = ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year)
            ->where('status', 'pending')->sum('amount');

        $byScholarshipType = ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year)
            ->join('scholarship_applications', 'scholarship_stipends.application_id', '=', 'scholarship_applications.id')
            ->join('scholarships', 'scholarship_applications.scholarship_id', '=', 'scholarships.id')
            ->select('scholarships.type', DB::raw('sum(scholarship_stipends.amount) as total_amount'))
            ->where('scholarship_stipends.status', 'released')
            ->groupBy('scholarships.type')
            ->pluck('total_amount', 'type')
            ->toArray();

        $monthlyDisbursements = ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year)
            ->where('status', 'released')
            ->select(
                DB::raw("CAST(strftime('%m', scholarship_stipends.updated_at) AS INTEGER) as month"),
                DB::raw('sum(amount) as total_amount')
            )
            ->groupBy(DB::raw("strftime('%m', scholarship_stipends.updated_at)"))
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [Carbon::create()->month($item->month)->format('M') => $item->total_amount];
            })
            ->toArray();

        // Fill missing months with 0
        $allMonths = collect(range(1, 12))->mapWithKeys(function ($month) {
            return [Carbon::create()->month($month)->format('M') => 0];
        });
        $monthlyDisbursements = $allMonths->merge($monthlyDisbursements)->toArray();

        return [
            'total_amount' => $totalAmount,
            'disbursed_amount' => $disbursedAmount,
            'pending_amount' => $pendingAmount,
            'disbursement_rate' => $totalAmount > 0 ? round($disbursedAmount / $totalAmount * 100, 2) : 0,
            'by_scholarship_type' => $byScholarshipType,
            'monthly_disbursements' => $monthlyDisbursements,
            'average_stipend_amount' => ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year)
                ->where('status', 'released')->avg('amount') ?? 0,
            'recipients_count' => ScholarshipStipend::whereYear('scholarship_stipends.created_at', $year)
                ->where('status', 'released')
                ->distinct('application_id')
                ->count(),
        ];
    }

    /**
     * Get trend analysis
     */
    private function getTrendAnalysis(): array
    {
        $currentYear = Carbon::now()->year;
        $previousYear = $currentYear - 1;

        $currentYearApps = ScholarshipApplication::whereYear('created_at', $currentYear)->count();
        $previousYearApps = ScholarshipApplication::whereYear('created_at', $previousYear)->count();

        $currentYearDisbursements = ScholarshipStipend::whereYear('created_at', $currentYear)
            ->where('status', 'disbursed')
            ->sum('amount');
        $previousYearDisbursements = ScholarshipStipend::whereYear('created_at', $previousYear)
            ->where('status', 'disbursed')
            ->sum('amount');

        return [
            'applications_growth' => $this->calculateGrowthRate($previousYearApps, $currentYearApps),
            'disbursements_growth' => $this->calculateGrowthRate($previousYearDisbursements, $currentYearDisbursements),
            'current_year' => $currentYear,
            'previous_year' => $previousYear,
        ];
    }

    /**
     * Get monthly breakdown for current year
     */
    private function getMonthlyBreakdown(int $year): array
    {
        $months = collect(range(1, 12))->map(function ($month) use ($year) {
            $monthName = Carbon::create($year, $month, 1)->format('M');
            
            return [
                'month' => $monthName,
                'applications' => ScholarshipApplication::whereYear('scholarship_applications.created_at', $year)
                    ->whereMonth('scholarship_applications.created_at', $month)
                    ->count(),
                'approvals' => ScholarshipApplication::whereYear('scholarship_applications.created_at', $year)
                    ->whereMonth('scholarship_applications.created_at', $month)
                    ->where('status', 'approved')
                    ->count(),
                'interviews' => Interview::whereYear('interviews.created_at', $year)
                    ->whereMonth('interviews.created_at', $month)
                    ->count(),
                'disbursements' => ScholarshipStipend::whereYear('scholarship_stipends.updated_at', $year)
                    ->whereMonth('scholarship_stipends.updated_at', $month)
                    ->where('status', 'released')
                    ->sum('amount'),
            ];
        });

        return $months->toArray();
    }

    /**
     * Get performance metrics
     */
    private function getPerformanceMetrics(): array
    {
        return [
            'avg_application_processing_time' => $this->getAverageProcessingTime(),
            'approval_rate_trend' => $this->getApprovalRateTrend(),
            'student_satisfaction_score' => $this->getStudentSatisfactionScore(),
            'fund_utilization_rate' => $this->getFundUtilizationRate(),
        ];
    }

    /**
     * Generate scholarship distribution report
     */
    public function getScholarshipDistributionReport(array $filters = []): array
    {
        $query = ScholarshipApplication::with(['scholarship', 'user.studentProfile'])
            ->where('status', 'approved');

        if (isset($filters['year'])) {
            $query->whereYear('scholarship_applications.created_at', $filters['year']);
        }

        if (isset($filters['scholarship_type'])) {
            $query->whereHas('scholarship', function ($q) use ($filters) {
                $q->where('type', $filters['scholarship_type']);
            });
        }

        $applications = $query->get();

        return [
            'total_recipients' => $applications->count(),
            'by_scholarship_type' => $applications->groupBy('scholarship.type')->map->count(),
            'by_course' => $applications->groupBy('user.studentProfile.course')->map->count(),
            'by_year_level' => $applications->groupBy('user.studentProfile.year_level')->map->count(),
            'gender_distribution' => $applications->groupBy('user.studentProfile.sex')->map->count(),
            'total_amount_distributed' => $applications->sum(function ($app) {
                return $app->stipends->where('status', 'released')->sum('amount');
            }),
        ];
    }

    /**
     * Generate fund utilization report
     */
    public function getFundUtilizationReport(int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;

        $scholarships = Scholarship::with(['applications' => function ($query) use ($year) {
            $query->whereYear('scholarship_applications.created_at', $year)->where('status', 'approved');
        }])->get();

        return $scholarships->map(function ($scholarship) {
            $applications = $scholarship->applications;
            $totalDisbursed = $applications->sum(function ($app) {
                return $app->stipends->where('status', 'released')->sum('amount');
            });

            return [
                'scholarship_name' => $scholarship->name,
                'scholarship_type' => $scholarship->type,
                'total_budget' => $scholarship->amount ?? 0,
                'total_disbursed' => $totalDisbursed,
                'utilization_rate' => $scholarship->amount > 0 
                    ? round($totalDisbursed / $scholarship->amount * 100, 2) 
                    : 0,
                'recipients_count' => $applications->count(),
                'average_per_recipient' => $applications->count() > 0 
                    ? round($totalDisbursed / $applications->count(), 2) 
                    : 0,
            ];
        })->toArray();
    }

    /**
     * Helper methods
     */
    private function getApplicationCompletionRate(int $year): float
    {
        $total = ScholarshipApplication::whereYear('scholarship_applications.created_at', $year)->count();
        $completed = ScholarshipApplication::whereYear('scholarship_applications.created_at', $year)
            ->whereIn('status', ['approved', 'rejected'])
            ->count();

        return $total > 0 ? round($completed / $total * 100, 2) : 0;
    }

    private function getAverageProcessingTime(int $year = null): float
    {
        $query = ScholarshipApplication::whereNotNull('updated_at')
            ->whereIn('status', ['approved', 'rejected']);

        if ($year) {
            $query->whereYear('scholarship_applications.created_at', $year);
        }

        $applications = $query->get();

        if ($applications->isEmpty()) {
            return 0;
        }

        $totalDays = $applications->sum(function ($app) {
            return Carbon::parse($app->created_at)->diffInDays(Carbon::parse($app->updated_at));
        });

        return round($totalDays / $applications->count(), 1);
    }

    private function getAverageInterviewScore(int $year): float
    {
        $interviews = Interview::whereYear('interviews.created_at', $year)
            ->where('status', 'completed')
            ->whereNotNull('interview_scores')
            ->get();

        if ($interviews->isEmpty()) {
            return 0;
        }

        $totalScore = 0;
        $scoreCount = 0;

        foreach ($interviews as $interview) {
            if (is_array($interview->interview_scores)) {
                $avgScore = array_sum($interview->interview_scores) / count($interview->interview_scores);
                $totalScore += $avgScore;
                $scoreCount++;
            }
        }

        return $scoreCount > 0 ? round($totalScore / $scoreCount, 2) : 0;
    }

    private function getInterviewsByType(int $year): array
    {
        return Interview::whereYear('interviews.created_at', $year)
            ->select('interview_type', DB::raw('count(*) as count'))
            ->groupBy('interview_type')
            ->pluck('count', 'interview_type')
            ->toArray();
    }

    private function calculateGrowthRate($previous, $current): float
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }

    private function getApprovalRateTrend(): array
    {
        return collect(range(1, 12))->map(function ($month) {
            $total = ScholarshipApplication::whereMonth('created_at', $month)->count();
            $approved = ScholarshipApplication::whereMonth('created_at', $month)
                ->where('status', 'approved')
                ->count();

            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'rate' => $total > 0 ? round($approved / $total * 100, 2) : 0,
            ];
        })->toArray();
    }

    private function getStudentSatisfactionScore(): float
    {
        // Placeholder for student satisfaction calculation
        // This would typically come from surveys or feedback data
        return 4.2; // Out of 5
    }

    private function getFundUtilizationRate(): float
    {
        $totalBudget = Scholarship::sum('amount') ?? 0;
        $totalDisbursed = ScholarshipStipend::where('status', 'released')->sum('amount');

        return $totalBudget > 0 ? round($totalDisbursed / $totalBudget * 100, 2) : 0;
    }

    /**
     * Export data to array format for CSV/Excel export
     */
    public function exportApplicationsData(array $filters = []): array
    {
        $query = ScholarshipApplication::with(['scholarship', 'user.studentProfile', 'stipends']);

        if (isset($filters['year'])) {
            $query->whereYear('scholarship_applications.created_at', $filters['year']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['scholarship_type'])) {
            $query->whereHas('scholarship', function ($q) use ($filters) {
                $q->where('type', $filters['scholarship_type']);
            });
        }

        return $query->get()->map(function ($application) {
            return [
                'Application ID' => $application->id,
                'Student ID' => $application->user->email, // Use email as student ID
                'Student Name' => $application->user->studentProfile->first_name . ' ' . $application->user->studentProfile->last_name,
                'Course' => $application->user->studentProfile->course,
                'Year Level' => $application->user->studentProfile->year_level,
                'Scholarship' => $application->scholarship->name,
                'Scholarship Type' => $application->scholarship->type,
                'Status' => ucfirst($application->status),
                'Application Date' => $application->created_at->format('Y-m-d'),
                'Total Stipend' => $application->stipends->sum('amount'),
                'Disbursed Amount' => $application->stipends->where('status', 'released')->sum('amount'),
            ];
        })->toArray();
    }
}
