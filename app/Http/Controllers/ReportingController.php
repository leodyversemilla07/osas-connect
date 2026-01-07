<?php

namespace App\Http\Controllers;

use App\Services\ReportingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportingController extends Controller
{
    public function __construct(
        private readonly ReportingService $reportingService
    ) {}

    /**
     * Display the main analytics dashboard
     */
    public function index(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $statistics = $this->reportingService->getDashboardStatistics();

        return Inertia::render('osas-staff/analytics-dashboard', [
            'statistics' => $statistics,
            'current_year' => $year,
            'available_years' => $this->getAvailableYears(),
            'scholarship_types' => $this->getScholarshipTypes(),
        ]);
    }

    /**
     * Display reports page
     */
    public function reports(Request $request)
    {
        $filters = $request->only(['year', 'scholarship_type']);
        $year = $filters['year'] ?? date('Y');
        
        return Inertia::render('osas-staff/reports', [
            'scholarship_distribution' => $this->reportingService->getScholarshipDistributionReport($filters),
            'fund_utilization' => $this->reportingService->getFundUtilizationReport($year),
            'available_years' => $this->getAvailableYears(),
            'scholarship_types' => $this->getScholarshipTypes(),
            'current_filters' => $filters,
        ]);
    }

    /**
     * Export applications data
     */
    public function exportApplications(Request $request)
    {
        $filters = $request->only(['year', 'status', 'scholarship_type']);
        $data = $this->reportingService->exportApplicationsData($filters);

        // Convert to CSV format
        $filename = 'scholarship_applications_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            
            // Add CSV headers
            if (!empty($data)) {
                fputcsv($file, array_keys($data[0]));
                
                // Add data rows
                foreach ($data as $row) {
                    fputcsv($file, $row);
                }
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get available years for filtering
     */
    private function getAvailableYears(): array
    {
        return range(date('Y'), date('Y') - 5);
    }

    /**
     * Get scholarship types for filtering
     */
    private function getScholarshipTypes(): array
    {
        return \App\Models\Scholarship::distinct()
            ->pluck('type')
            ->filter()
            ->values()
            ->toArray();
    }
}
