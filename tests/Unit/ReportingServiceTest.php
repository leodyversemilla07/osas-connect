<?php

use App\Models\Interview;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipStipend;
use App\Models\User;
use App\Services\ReportingService;
use Carbon\Carbon;

beforeEach(function () {
    $this->reportingService = new ReportingService();
    
    // Create test data
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->student = User::factory()->create(['role' => 'student']);
    
    $this->scholarship = Scholarship::factory()->create([
        'type' => 'academic_full',
        'status' => 'active',
        'amount' => 100000,
    ]);
    
    $this->application = ScholarshipApplication::factory()->create([
        'user_id' => $this->student->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'approved',
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    $this->interview = Interview::factory()->create([
        'application_id' => $this->application->id,
        'status' => 'completed',
        'interview_scores' => [85, 90, 88],
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    $this->stipend = ScholarshipStipend::factory()->create([
        'application_id' => $this->application->id,
        'amount' => 5000,
        'status' => 'released',
        'created_at' => Carbon::now()->startOfYear(),
    ]);
});

it('can get dashboard statistics', function () {
    $statistics = $this->reportingService->getDashboardStatistics();
    
    expect($statistics)->toHaveKeys([
        'overview',
        'applications',
        'scholarships',
        'interviews',
        'stipends',
        'trends',
        'monthly_breakdown',
        'performance_metrics',
    ]);
    
    expect($statistics['overview'])->toHaveKeys([
        'total_students',
        'active_scholarships',
        'total_applications',
        'pending_applications',
        'approved_applications',
        'total_disbursed',
        'students_with_scholarships',
    ]);
});

it('can get application statistics', function () {
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getApplicationStatistics($year);
    
    expect($statistics)->toHaveKeys([
        'total',
        'by_status',
        'by_scholarship_type',
        'monthly_trend',
        'approval_rate',
        'completion_rate',
        'average_processing_time',
    ]);
    
    expect($statistics['total'])->toBeGreaterThanOrEqual(1);
    expect($statistics['by_status'])->toHaveKey('approved');
    expect($statistics['by_scholarship_type'])->toHaveKey('academic_full');
});

it('can get scholarship statistics', function () {
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getScholarshipStatistics($year);
    
    expect($statistics)->toHaveKeys([
        'total_scholarships',
        'active_scholarships',
        'scholarship_breakdown',
        'most_popular',
        'highest_approval_rate',
    ]);
    
    expect($statistics['total_scholarships'])->toBeGreaterThanOrEqual(1);
    expect($statistics['active_scholarships'])->toBeGreaterThanOrEqual(1);
    expect($statistics['scholarship_breakdown'])->toBeArray();
});

it('can get interview statistics', function () {
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getInterviewStatistics($year);
    
    expect($statistics)->toHaveKeys([
        'total',
        'by_status',
        'monthly_trend',
        'completion_rate',
        'no_show_rate',
        'average_score',
        'by_type',
    ]);
    
    expect($statistics['total'])->toBeGreaterThanOrEqual(1);
    expect($statistics['by_status'])->toHaveKey('completed');
    expect($statistics['average_score'])->toBeGreaterThan(0);
});

it('can get stipend statistics', function () {
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getStipendStatistics($year);
    
    expect($statistics)->toHaveKeys([
        'total_amount',
        'disbursed_amount',
        'pending_amount',
        'disbursement_rate',
        'by_scholarship_type',
        'monthly_disbursements',
        'average_stipend_amount',
        'recipients_count',
    ]);
    
    expect($statistics['total_amount'])->toBeGreaterThan(0);
    expect($statistics['disbursed_amount'])->toBeGreaterThan(0);
    expect($statistics['disbursement_rate'])->toBeGreaterThan(0);
});

it('can generate scholarship distribution report', function () {
    $filters = ['year' => Carbon::now()->year];
    $report = $this->reportingService->getScholarshipDistributionReport($filters);
    
    expect($report)->toHaveKeys([
        'total_recipients',
        'by_scholarship_type',
        'by_course',
        'by_year_level',
        'gender_distribution',
        'total_amount_distributed',
    ]);
    
    expect($report['total_recipients'])->toBeGreaterThanOrEqual(1);
});

it('can generate fund utilization report', function () {
    $year = Carbon::now()->year;
    $report = $this->reportingService->getFundUtilizationReport($year);
    
    expect($report)->toBeArray();
    expect($report[0])->toHaveKeys([
        'scholarship_name',
        'scholarship_type',
        'total_budget',
        'total_disbursed',
        'utilization_rate',
        'recipients_count',
        'average_per_recipient',
    ]);
});

it('can export applications data', function () {
    $filters = ['year' => Carbon::now()->year];
    $data = $this->reportingService->exportApplicationsData($filters);
    
    expect($data)->toBeArray();
    expect($data[0])->toHaveKeys([
        'Application ID',
        'Student ID',
        'Student Name',
        'Course',
        'Year Level',
        'Scholarship',
        'Scholarship Type',
        'Status',
        'Application Date',
        'Total Stipend',
        'Disbursed Amount',
    ]);
});

it('calculates approval rate correctly', function () {
    // Create additional applications with different statuses
    ScholarshipApplication::factory()->create([
        'user_id' => User::factory()->create(['role' => 'student'])->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'rejected',
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    ScholarshipApplication::factory()->create([
        'user_id' => User::factory()->create(['role' => 'student'])->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'submitted',
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getApplicationStatistics($year);
    
    // Should have 1 approved out of 3 total = 33.33%
    expect($statistics['approval_rate'])->toBe(33.33);
});

it('calculates average interview score correctly', function () {
    // Create another interview with different scores
    $anotherApplication = ScholarshipApplication::factory()->create([
        'user_id' => User::factory()->create(['role' => 'student'])->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'approved',
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    Interview::factory()->create([
        'application_id' => $anotherApplication->id,
        'status' => 'completed',
        'interview_scores' => [75, 80, 85], // Average: 80
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getInterviewStatistics($year);
    
    // First interview average: (85+90+88)/3 = 87.67
    // Second interview average: (75+80+85)/3 = 80
    // Overall average: (87.67+80)/2 = 83.83
    expect($statistics['average_score'])->toBe(83.83);
});

it('handles empty data gracefully', function () {
    // Clear all data
    ScholarshipStipend::truncate();
    Interview::truncate();
    ScholarshipApplication::truncate();
    Scholarship::truncate();
    
    $statistics = $this->reportingService->getDashboardStatistics();
    
    expect($statistics['overview']['total_applications'])->toBe(0);
    expect($statistics['applications']['approval_rate'])->toBe(0);
    expect($statistics['interviews']['average_score'])->toBe(0.0);
    expect($statistics['stipends']['disbursement_rate'])->toBe(0);
});

it('can filter statistics by year', function () {
    $currentYear = Carbon::now()->year;
    $lastYear = $currentYear - 1;
    
    // Create data for last year
    $lastYearApplication = ScholarshipApplication::factory()->create([
        'user_id' => User::factory()->create(['role' => 'student'])->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'approved',
        'created_at' => Carbon::create($lastYear, 6, 15),
    ]);
    
    $currentYearStats = $this->reportingService->getApplicationStatistics($currentYear);
    $lastYearStats = $this->reportingService->getApplicationStatistics($lastYear);
    
    expect($currentYearStats['total'])->toBe(1);
    expect($lastYearStats['total'])->toBe(1);
});

it('calculates disbursement rate correctly', function () {
    // Create additional stipends
    ScholarshipStipend::factory()->create([
        'application_id' => $this->application->id,
        'amount' => 3000,
        'status' => 'pending',
        'created_at' => Carbon::now()->startOfYear(),
    ]);
    
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getStipendStatistics($year);
    
    // Total: 5000 + 3000 = 8000
    // Disbursed: 5000
    // Rate: 5000/8000 * 100 = 62.5%
    expect($statistics['disbursement_rate'])->toBe(62.5);
});

it('generates monthly trends correctly', function () {
    // Create applications in different months
    ScholarshipApplication::factory()->create([
        'user_id' => User::factory()->create(['role' => 'student'])->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'approved',
        'created_at' => Carbon::now()->month(3)->startOfMonth(),
    ]);
    
    ScholarshipApplication::factory()->create([
        'user_id' => User::factory()->create(['role' => 'student'])->id,
        'scholarship_id' => $this->scholarship->id,
        'status' => 'submitted',
        'created_at' => Carbon::now()->month(6)->startOfMonth(),
    ]);
    
    $year = Carbon::now()->year;
    $statistics = $this->reportingService->getApplicationStatistics($year);
    
    expect($statistics['monthly_trend'])->toBeArray();
    expect(count($statistics['monthly_trend']))->toBe(12); // All 12 months
    
    // Should have data for January (from beforeEach), March, and June
    expect($statistics['monthly_trend']['Jan'])->toBeGreaterThan(0);
    expect($statistics['monthly_trend']['Mar'])->toBeGreaterThan(0);
    expect($statistics['monthly_trend']['Jun'])->toBeGreaterThan(0);
});
