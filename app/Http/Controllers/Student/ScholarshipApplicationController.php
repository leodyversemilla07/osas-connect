<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ScholarshipApplication;
use App\Services\ScholarshipService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipApplicationController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly ScholarshipService $scholarshipService) {}

    public function legacyIndex(): RedirectResponse
    {
        return redirect()->route('student.scholarships.applications.index');
    }

    public function legacyShow(ScholarshipApplication $application): RedirectResponse
    {
        $this->authorize('view', $application);

        return redirect()->route('student.scholarships.applications.show', $application);
    }

    public function index(): Response
    {
        return Inertia::render('student/scholarships/my-applications', [
            'applications' => $this->scholarshipService->getApplicationsForUser(Auth::id()),
        ]);
    }

    public function status(ScholarshipApplication $application): RedirectResponse
    {
        $this->authorize('view', $application);

        return redirect()->route('student.scholarships.applications.show', $application);
    }

    public function show(ScholarshipApplication $application): Response|RedirectResponse
    {
        try {
            $this->authorize('view', $application);
            $application->load(['scholarship', 'interview', 'comments.user']);

            return Inertia::render('student/scholarships/application-status', [
                'application' => $this->scholarshipService->formatApplicationData($application),
            ]);
        } catch (\Exception $exception) {
            Log::error('Error in scholarship application show', [
                'application_id' => $application->id ?? null,
                'user_id' => Auth::id(),
                'error' => $exception->getMessage(),
            ]);

            return redirect()
                ->route('student.scholarships.applications.index')
                ->withErrors(['error' => 'Unable to load application details. Please try again.']);
        }
    }

    public function edit(ScholarshipApplication $application): Response|RedirectResponse
    {
        $this->authorize('update', $application);

        if (! in_array($application->status, ['draft', 'incomplete'], true)) {
            return redirect()
                ->back()
                ->withErrors(['This application cannot be edited in its current status.']);
        }

        return Inertia::render('student/scholarships/apply', [
            'scholarship' => $this->scholarshipService->formatScholarshipData($application->scholarship),
            'application' => $this->scholarshipService->formatApplicationData($application),
            'editing' => true,
        ]);
    }

    public function updateDocument(Request $request, ScholarshipApplication $application, string $documentType): RedirectResponse
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        try {
            $this->scholarshipService->updateDocument($application, $documentType, $validated['document']);

            return back()->with('success', 'Document updated successfully!');
        } catch (\Exception $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
        }
    }
}
