<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class ScholarshipsController extends Controller
{
    /**
     * Display a listing of available scholarships.
     */
    public function index(): Response
    {
        $scholarships = Scholarship::where('status', 'active')
            ->where('application_deadline', '>=', now())
            ->with(['applications' => function ($query) {
                $query->where('student_id', Auth::id());
            }])
            ->get()
            ->map(function ($scholarship) {
                return [
                    'id' => $scholarship->id,
                    'name' => $scholarship->name,
                    'type' => $scholarship->type,
                    'description' => $scholarship->description,
                    'stipend_amount' => $scholarship->stipend_amount,
                    'requirements' => $scholarship->requirements,
                    'eligibility_criteria' => $scholarship->eligibility_criteria,
                    'deadline' => $scholarship->application_deadline,
                    'has_applied' => $scholarship->applications->count() > 0,
                    'required_documents' => $scholarship->required_documents,
                ];
            });

        return Inertia::render('Scholarships/Index', [
            'scholarships' => $scholarships
        ]);
    }

    /**
     * Show the application form for a specific scholarship.
     */
    public function showApplicationForm(Scholarship $scholarship): Response
    {
        // Check if student already has an application for this scholarship
        $existingApplication = ScholarshipApplication::where('student_id', Auth::id())
            ->where('scholarship_id', $scholarship->id)
            ->whereNotIn('status', [
                ScholarshipApplication::STATUS_REJECTED,
                ScholarshipApplication::STATUS_END
            ])
            ->first();

        if ($existingApplication) {
            return Inertia::render('Scholarships/AlreadyApplied', [
                'application' => $existingApplication
            ]);
        }

        // Get student profile for pre-filling the form
        $student = Auth::user()->studentProfile;

        return Inertia::render('Scholarships/Apply', [
            'scholarship' => $scholarship,
            'student' => $student,
            'requiredDocuments' => $scholarship->required_documents
        ]);
    }

    /**
     * Submit a new scholarship application.
     */
    public function apply(Request $request, Scholarship $scholarship)
    {
        $request->validate([
            'uploaded_documents' => ['required', 'array'],
            'uploaded_documents.*' => ['required', 'file', 'max:2048']
        ]);

        // Store uploaded documents
        $documents = [];
        foreach ($request->file('uploaded_documents') as $type => $file) {
            $path = $file->store('scholarship-documents');
            $documents[$type] = [
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'uploaded_at' => now()
            ];
        }

        // Create application
        $application = ScholarshipApplication::create([
            'student_id' => Auth::id(),
            'scholarship_id' => $scholarship->id,
            'status' => ScholarshipApplication::STATUS_SUBMITTED,
            'uploaded_documents' => $documents,
            'semester' => $scholarship->semester,
            'academic_year' => $scholarship->academic_year,
            'applied_at' => now()
        ]);

        // Transition to under verification status
        $application->updateStatus(ScholarshipApplication::STATUS_UNDER_VERIFICATION);

        return redirect()->route('scholarships.track', $application)
            ->with('success', 'Your application has been submitted successfully.');
    }

    /**
     * Track a scholarship application.
     */
    public function track(ScholarshipApplication $application): Response
    {
        // Authorization check
        $this->authorize('view', $application);

        $application->load(['scholarship', 'student']);

        return Inertia::render('Scholarships/Track', [
            'application' => $application
        ]);
    }
}
