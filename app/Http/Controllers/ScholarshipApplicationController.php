<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Services\ScholarshipApplicationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class ScholarshipApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ScholarshipApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Display scholarship application form
     */
    public function create(Scholarship $scholarship): Response
    {
        if (! $scholarship->isAcceptingApplications()) {
            return Inertia::render('errors/403', [
                'message' => 'This scholarship is not accepting applications at this time.',
            ]);
        }

        // Check if user already has a pending application
        $existingApplication = ScholarshipApplication::where('student_id', Auth::user()->studentProfile->id)
            ->where('scholarship_id', $scholarship->id)
            ->whereIn('status', [
                ScholarshipApplication::STATUS_SUBMITTED,
                ScholarshipApplication::STATUS_UNDER_VERIFICATION,
                ScholarshipApplication::STATUS_VERIFIED,
                ScholarshipApplication::STATUS_UNDER_EVALUATION,
                ScholarshipApplication::STATUS_APPROVED,
            ])
            ->first();

        if ($existingApplication) {
            return redirect()->route('scholarships.applications.show', $existingApplication)
                ->with('info', 'You already have an application for this scholarship.');
        }

        return Inertia::render('scholarships/apply', [
            'scholarship' => [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'description' => $scholarship->description,
                'type' => $scholarship->type,
                'amount' => $scholarship->amount,
                'deadline' => $scholarship->deadline->format('Y-m-d'),
                'eligibility' => $scholarship->getFormattedEligibilityCriteria(),
                'requirements' => $scholarship->required_documents,
            ],
        ]);
    }

    /**
     * Submit scholarship application
     */
    public function store(Request $request, Scholarship $scholarship)
    {
        $request->validate([
            'purpose_letter' => ['required', 'string', 'min:100'],
            'parent_consent' => ['required', 'accepted'],
            'agreement' => ['required', 'accepted'],
            'uploaded_documents' => ['required', 'array'],
            'uploaded_documents.*' => ['required', 'file', 'max:5120'], // 5MB max
            'academic_year' => ['required', 'integer', 'min:2023'],
            'semester' => ['required', 'in:1st,2nd,Summer'],
        ]);

        try {
            $student = Auth::user()->studentProfile;

            $application = $this->applicationService->submit(
                $student,
                $scholarship,
                $request->only(['purpose_letter', 'academic_year', 'semester']),
                $request->file('uploaded_documents')
            );

            return redirect()
                ->route('scholarships.applications.show', $application)
                ->with('success', 'Your application has been submitted successfully. You will receive updates on the status of your application.');

        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show application details
     */
    public function show(ScholarshipApplication $application): Response
    {
        $application->load(['scholarship', 'student.user']);

        if (Auth::user()->isStudent() && $application->student_id !== Auth::user()->studentProfile->id) {
            abort(403);
        }

        return Inertia::render('scholarships/applications/show', [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'submitted_at' => $application->applied_at?->format('F j, Y'),
                'purpose_letter' => $application->purpose_letter,
                'documents' => $application->uploaded_documents,
                'verifier_comments' => $application->verifier_comments,
                'interview_schedule' => $application->interview_schedule?->format('F j, Y g:i A'),
                'interview_notes' => $application->interview_notes,
                'amount_received' => $application->amount_received,
                'last_stipend_date' => $application->last_stipend_date?->format('F j, Y'),
            ],
            'scholarship' => [
                'id' => $application->scholarship->id,
                'name' => $application->scholarship->name,
                'type' => $application->scholarship->type,
                'amount' => $application->scholarship->amount,
            ],
            'student' => [
                'id' => $application->student->id,
                'name' => $application->student->user->full_name,
                'course' => $application->student->course,
                'year_level' => $application->student->year_level,
            ],
            'can' => [
                'update_documents' => in_array($application->status, [
                    ScholarshipApplication::STATUS_INCOMPLETE,
                    ScholarshipApplication::STATUS_UNDER_VERIFICATION,
                ]),
                'schedule_interview' => Auth::user()->isOsasStaff() && in_array($application->status, [
                    ScholarshipApplication::STATUS_VERIFIED,
                    ScholarshipApplication::STATUS_UNDER_EVALUATION,
                ]),
                'record_stipend' => Auth::user()->isOsasStaff() && $application->status === ScholarshipApplication::STATUS_APPROVED,
            ],
        ]);
    }

    /**
     * Update application document
     */
    public function updateDocument(
        Request $request,
        ScholarshipApplication $application,
        string $documentType
    ) {
        if (Auth::user()->isStudent() && $application->student_id !== Auth::user()->studentProfile->id) {
            abort(403);
        }

        $request->validate([
            'document' => ['required', 'file', 'max:5120'], // 5MB max
        ]);

        try {
            $this->applicationService->updateDocument(
                $application,
                $documentType,
                $request->file('document')
            );

            return back()->with('success', 'Document updated successfully.');

        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Schedule interview
     */
    public function scheduleInterview(Request $request, ScholarshipApplication $application)
    {
        if (! Auth::user()->isOsasStaff()) {
            abort(403);
        }

        $request->validate([
            'schedule_date' => ['required', 'date', 'after:today'],
        ]);

        try {
            $this->applicationService->scheduleInterview(
                $application,
                new \DateTime($request->schedule_date)
            );

            return back()->with('success', 'Interview scheduled successfully.');

        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Record stipend disbursement
     */
    public function recordStipend(Request $request, ScholarshipApplication $application)
    {
        if (! Auth::user()->isOsasStaff()) {
            abort(403);
        }

        $request->validate([
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        try {
            $this->applicationService->recordStipendDisbursement(
                $application,
                $request->amount
            );

            return back()->with('success', 'Stipend disbursement recorded successfully.');

        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show application status tracking page
     */
    public function showStatus(ScholarshipApplication $application): Response
    {
        $application->load(['scholarship', 'documents']);

        // Authorize access using policy
        $this->authorize('view', $application);

        // Build timeline based on application status
        $timeline = $this->buildApplicationTimeline($application);

        // Get required documents status
        $requiredDocuments = [
            'transcripts' => [
                'name' => 'Official Transcripts',
                'required' => true,
                'uploaded' => $application->documents->where('type', 'transcripts')->isNotEmpty(),
                'status' => $application->documents->where('type', 'transcripts')->first()?->status ?? 'pending',
            ],
            'recommendation_letter' => [
                'name' => 'Letter of Recommendation',
                'required' => true,
                'uploaded' => $application->documents->where('type', 'recommendation_letter')->isNotEmpty(),
                'status' => $application->documents->where('type', 'recommendation_letter')->first()?->status ?? 'pending',
            ],
            'financial_statement' => [
                'name' => 'Financial Statement',
                'required' => in_array($application->scholarship->type, ['need_based', 'both']),
                'uploaded' => $application->documents->where('type', 'financial_statement')->isNotEmpty(),
                'status' => $application->documents->where('type', 'financial_statement')->first()?->status ?? 'pending',
            ],
        ];

        $applicationData = [
            'id' => $application->id,
            'scholarship_name' => $application->scholarship->name,
            'scholarship_type' => $application->scholarship->type,
            'status' => $application->status,
            'submitted_at' => $application->applied_at?->format('F j, Y'),
            'created_at' => $application->created_at->format('F j, Y'),
            'progress' => $this->getApplicationProgress($application->status),
            'purpose_statement' => $application->purpose_letter,
            'feedback' => $application->verifier_comments,
            'next_steps' => $this->getNextSteps($application->status),
        ];

        return Inertia::render('scholarships/application-status', [
            'application' => $applicationData,
            'timeline' => $timeline,
            'documents' => $requiredDocuments,
        ]);
    }

    private function buildApplicationTimeline($application): array
    {
        $timeline = [
            [
                'title' => 'Application Started',
                'description' => 'You began your scholarship application.',
                'date' => $application->created_at->format('F j, Y'),
                'status' => 'completed',
                'icon' => 'document-plus',
            ],
        ];

        if ($application->applied_at) {
            $timeline[] = [
                'title' => 'Application Submitted',
                'description' => 'Your application has been submitted for review.',
                'date' => $application->applied_at->format('F j, Y'),
                'status' => 'completed',
                'icon' => 'check-circle',
            ];
        }

        if (in_array($application->status, ['under_verification', 'verified', 'under_evaluation', 'approved', 'rejected'])) {
            $timeline[] = [
                'title' => 'Under Review',
                'description' => 'OSAS staff is reviewing your application and documents.',
                'date' => null,
                'status' => $application->status === 'under_verification' ? 'current' : 'completed',
                'icon' => 'eye',
            ];
        }

        if (in_array($application->status, ['verified', 'under_evaluation', 'approved', 'rejected'])) {
            $timeline[] = [
                'title' => 'Documents Verified',
                'description' => 'All required documents have been verified.',
                'date' => null,
                'status' => $application->status === 'verified' ? 'current' : 'completed',
                'icon' => 'document-check',
            ];
        }

        if (in_array($application->status, ['under_evaluation', 'approved', 'rejected'])) {
            $timeline[] = [
                'title' => 'Under Evaluation',
                'description' => 'Your application is being evaluated by the scholarship committee.',
                'date' => null,
                'status' => $application->status === 'under_evaluation' ? 'current' : 'completed',
                'icon' => 'academic-cap',
            ];
        }

        if ($application->status === 'approved') {
            $timeline[] = [
                'title' => 'Application Approved',
                'description' => 'Congratulations! Your scholarship application has been approved.',
                'date' => null,
                'status' => 'completed',
                'icon' => 'check-badge',
            ];
        } elseif ($application->status === 'rejected') {
            $timeline[] = [
                'title' => 'Application Not Approved',
                'description' => 'Your application was not approved at this time.',
                'date' => null,
                'status' => 'completed',
                'icon' => 'x-circle',
            ];
        }

        return $timeline;
    }

    private function getApplicationProgress(string $status): int
    {
        $progressMap = [
            'draft' => 10,
            'submitted' => 25,
            'under_verification' => 40,
            'verified' => 60,
            'under_evaluation' => 80,
            'approved' => 100,
            'rejected' => 100,
            'incomplete' => 30,
        ];

        return $progressMap[$status] ?? 0;
    }

    private function getNextSteps(string $status): array
    {
        $nextSteps = [
            'draft' => [
                'Complete your application by filling out all required sections.',
                'Upload all required documents.',
                'Submit your application before the deadline.',
            ],
            'incomplete' => [
                'Review the feedback provided by OSAS staff.',
                'Upload any missing or corrected documents.',
                'Resubmit your application.',
            ],
            'submitted' => [
                'Wait for OSAS staff to review your application.',
                'Check back regularly for updates.',
                'Respond promptly to any requests for additional information.',
            ],
            'under_verification' => [
                'OSAS staff is verifying your documents.',
                'You may be contacted if any documents need clarification.',
                'No action required at this time.',
            ],
            'verified' => [
                'Your application is moving to the evaluation stage.',
                'The scholarship committee will review your application.',
                'No action required at this time.',
            ],
            'under_evaluation' => [
                'The scholarship committee is reviewing your application.',
                'You may be contacted for an interview if required.',
                'No action required at this time.',
            ],
            'approved' => [
                'Congratulations! You will be contacted with next steps.',
                'Complete any required scholarship agreements.',
                'Attend orientation sessions if applicable.',
            ],
            'rejected' => [
                'Review feedback if provided.',
                'Consider applying for other available scholarships.',
                'Contact OSAS if you have questions about the decision.',
            ],
        ];

        return $nextSteps[$status] ?? [];
    }
}
