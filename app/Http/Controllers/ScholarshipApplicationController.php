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

        return Inertia::render('scholarships/[id]/apply', [
            'scholarship' => [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'description' => $scholarship->description,
                'type' => $scholarship->type,
                'amount' => $scholarship->amount,
                'deadline' => $scholarship->deadline->format('Y-m-d'),
                'eligibility' => $scholarship->eligibility_criteria,
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
                ->route('student.applications.show', $application)
                ->with('success', 'Your application has been submitted successfully.');

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
}
