<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Services\ScholarshipService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UnifiedScholarshipController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private ScholarshipService $scholarshipService) {}

    /**
     * API endpoint: Preview eligibility for a scholarship (returns reasons for ineligibility).
     * Usage: POST with application data, returns array of issues (empty if eligible).
     */
    public function previewEligibility(Request $request, Scholarship $scholarship)
    {
        $user = Auth::user()->load('studentProfile');
        $application = new ScholarshipApplication([
            'scholarship_id' => $scholarship->id,
            'user_id' => $user->id,
            'application_data' => $request->input('application_data', []),
            'uploaded_documents' => $request->input('uploaded_documents', []),
            'status' => 'submitted',
        ]);
        $application->setRelation('studentProfile', $user->studentProfile);
        $application->setRelation('scholarship', $scholarship);
        $application->setRelation('interview', null); // Optionally set interview if available
        $issues = $application->getEligibilityIssues();
        return response()->json(['eligible' => count($issues) === 0, 'issues' => $issues]);
    }

    public function index()
    {
        $scholarships = $this->scholarshipService->getAvailableScholarships(Auth::id());

        return Inertia::render('student/scholarships/index', [
            'scholarships' => $scholarships,
        ]);
    }

    public function show(Scholarship $scholarship)
    {
        $scholarshipData = $this->scholarshipService->formatScholarshipData($scholarship);

        return Inertia::render('student/scholarships/show', [
            'scholarship' => $scholarshipData,
        ]);
    }

    public function create(Scholarship $scholarship)
    {
        $user = Auth::user()->load('studentProfile');

        // Check if user can apply
        if (! $this->scholarshipService->isUserEligible($scholarship, $user)) {
            return redirect()
                ->back()
                ->withErrors(['You are not eligible for this scholarship.']);
        }

        $scholarshipData = $this->scholarshipService->formatScholarshipData($scholarship);

        return Inertia::render('student/scholarships/apply', [
            'scholarship' => $scholarshipData,
            'userProfile' => $user,
        ]);
    }

    public function store(Request $request, Scholarship $scholarship)
    {
        // Check if user can apply
        if (! $this->scholarshipService->isUserEligible($scholarship, Auth::user())) {
            return redirect()
                ->back()
                ->withErrors(['You are not eligible for this scholarship.']);
        }

        // Updated validation rules to match your form fields
        $rules = [
            'personal_statement' => 'required|string|min:100|max:2000',
            'academic_goals' => 'required|string|min:50|max:1000',
            'financial_need_statement' => 'required|string|min:50|max:1000',
            'additional_comments' => 'nullable|string|max:1000',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            // Add scholarship-specific fields with correct nested structure
            'application_data.membership_duration' => 'nullable|string',
            'application_data.major_activities_count' => 'nullable|integer',
            'application_data.major_performances' => 'nullable|boolean',
            'application_data.pre_hiring_completed' => 'nullable|boolean',
            'application_data.parent_consent_provided' => 'nullable|boolean',
            'application_data.coach_recommendation_provided' => 'nullable|boolean',
            'application_data.family_income' => 'nullable|string',
            'application_data.indigency_certificate_issue_date' => 'nullable|date',
        ];

        // Add scholarship-specific validation rules if needed
        $rules = array_merge($rules, $this->getScholarshipSpecificRules($scholarship->type));

        $validated = $request->validate($rules);

        try {
            $application = $this->scholarshipService->createApplication($scholarship->id, Auth::id(), $validated);

            return redirect()->route('student.scholarships.index')->with('success', 'Application submitted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get scholarship-specific validation rules
     */
    private function getScholarshipSpecificRules(string $scholarshipType): array
    {
        switch ($scholarshipType) {
            case 'performing_arts_full':
            case 'performing_arts_partial':
                return [
                    'application_data.membership_duration' => 'required|string|min:1',
                    'application_data.major_activities_count' => 'required|integer|min:'.($scholarshipType === 'performing_arts_full' ? '1' : '2'),
                    'application_data.major_performances' => $scholarshipType === 'performing_arts_full' ? 'required|boolean' : 'nullable|boolean',
                    'application_data.coach_recommendation_provided' => 'required|boolean',
                ];

            case 'student_assistantship':
                return [
                    'application_data.pre_hiring_completed' => 'required|boolean',
                    'application_data.parent_consent_provided' => 'required|boolean',
                ];

            case 'economic_assistance':
                return [
                    'application_data.family_income' => 'required|string',
                    'application_data.indigency_certificate_issue_date' => 'required|date|before_or_equal:today|after:'.now()->subMonths(6)->toDateString(),
                ];

            default:
                return [];
        }
    }

    public function myApplications()
    {
        $applications = $this->scholarshipService->getApplicationsForUser(Auth::id());

        return Inertia::render('student/scholarships/my-applications', [
            'applications' => $applications,
        ]);
    }

    public function showApplication(ScholarshipApplication $application)
    {
        try {
            $this->authorize('view', $application);

            // Load necessary relationships
            $application->load(['scholarship', 'interview', 'comments.user']);

            $applicationData = $this->scholarshipService->formatApplicationData($application);

            return Inertia::render('student/scholarships/application-status', [
                'application' => $applicationData,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in showApplication: '.$e->getMessage(), [
                'application_id' => $application->id ?? 'unknown',
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->route('student.applications')
                ->withErrors(['error' => 'Unable to load application details. Please try again.']);
        }
    }

    public function edit(ScholarshipApplication $application)
    {
        $this->authorize('update', $application);

        // Only allow editing of incomplete or draft applications
        if (! in_array($application->status, ['draft', 'incomplete'])) {
            return redirect()
                ->back()
                ->withErrors(['This application cannot be edited in its current status.']);
        }

        $applicationData = $this->scholarshipService->formatApplicationData($application);
        $scholarshipData = $this->scholarshipService->formatScholarshipData($application->scholarship);

        return Inertia::render('student/scholarships/apply', [
            'scholarship' => $scholarshipData,
            'application' => $applicationData,
            'editing' => true,
        ]);
    }

    public function updateApplicationStatus(Request $request, ScholarshipApplication $application)
    {
        $this->authorize('update', $application);


        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $this->scholarshipService->recordStipend($application, $validated);

            return back()->with('success', 'Stipend recorded successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateDocument(Request $request, ScholarshipApplication $application, string $documentType)
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        try {
            $this->scholarshipService->updateDocument($application, $documentType, $validated['document']);

            return back()->with('success', 'Document updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
