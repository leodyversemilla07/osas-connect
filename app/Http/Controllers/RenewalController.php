<?php

namespace App\Http\Controllers;

use App\Models\RenewalApplication;
use App\Models\ScholarshipApplication;
use App\Services\ScholarshipRenewalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RenewalController extends Controller
{
    public function __construct(
        protected ScholarshipRenewalService $renewalService
    ) {}

    /**
     * Display the renewal eligibility check page for a student.
     */
    public function checkEligibility(ScholarshipApplication $application): Response
    {
        // Get upcoming renewal deadlines
        $deadlines = $this->renewalService->getUpcomingRenewalDeadlines();

        // Check eligibility for current semester
        $eligibility = $this->renewalService->checkRenewalEligibility(
            $application,
            $deadlines['current_semester']['semester'],
            $deadlines['current_semester']['year']
        );

        return Inertia::render('student/renewals/check-eligibility', [
            'application' => $application->load('scholarship', 'student.studentProfile'),
            'eligibility' => $eligibility,
            'deadlines' => $deadlines,
        ]);
    }

    /**
     * Display the renewal application form.
     */
    public function create(ScholarshipApplication $application): Response
    {
        // Get upcoming renewal deadlines
        $deadlines = $this->renewalService->getUpcomingRenewalDeadlines();

        // Check eligibility
        $eligibility = $this->renewalService->checkRenewalEligibility(
            $application,
            $deadlines['current_semester']['semester'],
            $deadlines['current_semester']['year']
        );

        // If not eligible, redirect to check eligibility page
        if (! $eligibility['eligible']) {
            return redirect()->route('renewal.check-eligibility', $application)
                ->with('error', 'You are not eligible for renewal at this time.');
        }

        return Inertia::render('student/renewals/create', [
            'application' => $application->load('scholarship', 'student.studentProfile'),
            'eligibility' => $eligibility,
            'deadlines' => $deadlines,
        ]);
    }

    /**
     * Store a new renewal application.
     */
    public function store(Request $request, ScholarshipApplication $application)
    {
        $validated = $request->validate([
            'semester' => 'required|string',
            'year' => 'required|integer',
            'current_gwa' => 'required|numeric|min:0|max:4',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $renewal = $this->renewalService->createRenewalApplication(
                $application,
                $validated['semester'],
                $validated['year'],
                [
                    'current_gwa' => $validated['current_gwa'],
                    'notes' => $validated['notes'] ?? null,
                ]
            );

            return redirect()->route('renewal.show', $renewal)
                ->with('success', 'Renewal application submitted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display a specific renewal application.
     */
    public function show(RenewalApplication $renewal): Response
    {
        return Inertia::render('student/renewals/show', [
            'renewal' => $renewal->load([
                'originalApplication.scholarship',
                'student.studentProfile',
                'documents',
                'reviewer',
            ]),
        ]);
    }

    /**
     * Display the list of renewals for staff review.
     */
    public function index(Request $request): Response
    {
        $query = RenewalApplication::with([
            'originalApplication.scholarship',
            'student.studentProfile',
            'reviewer',
        ]);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by semester/year
        if ($request->has('semester') && $request->has('year')) {
            $query->forPeriod($request->semester, $request->year);
        }

        $renewals = $query->latest('submitted_at')->paginate(20);

        // Get statistics for current period
        $deadlines = $this->renewalService->getUpcomingRenewalDeadlines();
        $statistics = $this->renewalService->getRenewalStatistics(
            $deadlines['current_semester']['semester'],
            $deadlines['current_semester']['year']
        );

        return Inertia::render('osas-staff/renewals/index', [
            'renewals' => $renewals,
            'statistics' => $statistics,
            'deadlines' => $deadlines,
            'filters' => $request->only(['status', 'semester', 'year']),
        ]);
    }

    /**
     * Display the renewal review page for staff.
     */
    public function review(RenewalApplication $renewal): Response
    {
        return Inertia::render('osas-staff/renewals/review', [
            'renewal' => $renewal->load([
                'originalApplication.scholarship',
                'student.studentProfile',
                'documents',
                'reviewer',
            ]),
        ]);
    }

    /**
     * Approve a renewal application.
     */
    public function approve(Request $request, RenewalApplication $renewal)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $this->renewalService->approveRenewal(
                $renewal,
                $request->user(),
                $validated['notes'] ?? null
            );

            return redirect()->route('renewal.staff.index')
                ->with('success', 'Renewal application approved successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Reject a renewal application.
     */
    public function reject(Request $request, RenewalApplication $renewal)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            $this->renewalService->rejectRenewal(
                $renewal,
                $request->user(),
                $validated['reason']
            );

            return redirect()->route('renewal.staff.index')
                ->with('success', 'Renewal application rejected.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Upload documents for a renewal application.
     */
    public function uploadDocuments(Request $request, RenewalApplication $renewal)
    {
        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*.type' => 'required|string',
            'documents.*.file' => 'required|file|max:10240', // 10MB max
        ]);

        try {
            $documentData = [];

            foreach ($validated['documents'] as $doc) {
                $file = $doc['file'];
                $path = $file->store('renewal-documents', 'public');

                $documentData[] = [
                    'type' => $doc['type'],
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ];
            }

            $this->renewalService->processRenewalDocuments($renewal, $documentData);

            return back()->with('success', 'Documents uploaded successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Get renewal statistics dashboard.
     */
    public function statistics(Request $request): Response
    {
        $deadlines = $this->renewalService->getUpcomingRenewalDeadlines();

        $semester = $request->get('semester', $deadlines['current_semester']['semester']);
        $year = $request->get('year', $deadlines['current_semester']['year']);

        $statistics = $this->renewalService->getRenewalStatistics($semester, $year);
        $statisticsByType = $this->renewalService->getRenewalStatisticsByType($semester, $year);

        return Inertia::render('osas-staff/renewals/statistics', [
            'statistics' => $statistics,
            'statisticsByType' => $statisticsByType,
            'deadlines' => $deadlines,
            'selectedPeriod' => [
                'semester' => $semester,
                'year' => $year,
            ],
        ]);
    }
}
