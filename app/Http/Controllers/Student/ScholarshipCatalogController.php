<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use App\Models\StudentProfile;
use App\Services\ScholarshipService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipCatalogController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly ScholarshipService $scholarshipService) {}

    public function index(): Response
    {
        $scholarships = $this->scholarshipService->getAvailableScholarships(Auth::id());

        return Inertia::render('student/scholarships/index', [
            'scholarships' => $scholarships,
        ]);
    }

    public function show(Scholarship $scholarship): Response
    {
        return Inertia::render('student/scholarships/show', $this->buildScholarshipPageProps($scholarship));
    }

    public function create(Scholarship $scholarship): Response|RedirectResponse
    {
        $user = Auth::user()->load('studentProfile');

        if (! $this->scholarshipService->isUserEligible($scholarship, $user)) {
            return redirect()
                ->route('student.scholarships.show', $scholarship)
                ->withErrors(['You are not eligible for this scholarship.']);
        }

        return Inertia::render('student/scholarships/apply', [
            'scholarship' => $this->scholarshipService->formatScholarshipData($scholarship),
            'userProfile' => $user,
        ]);
    }

    public function store(Request $request, Scholarship $scholarship)
    {
        if (! $this->scholarshipService->isUserEligible($scholarship, Auth::user())) {
            return redirect()
                ->back()
                ->withErrors(['You are not eligible for this scholarship.']);
        }

        $rules = [
            'personal_statement' => 'required|string|min:100|max:2000',
            'academic_goals' => 'required|string|min:50|max:1000',
            'financial_need_statement' => 'required|string|min:50|max:1000',
            'additional_comments' => 'nullable|string|max:1000',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'application_data.membership_duration' => 'nullable|string',
            'application_data.major_activities_count' => 'nullable|integer',
            'application_data.major_performances' => 'nullable|boolean',
            'application_data.pre_hiring_completed' => 'nullable|boolean',
            'application_data.parent_consent_provided' => 'nullable|boolean',
            'application_data.coach_recommendation_provided' => 'nullable|boolean',
            'application_data.family_income' => 'nullable|string',
            'application_data.indigency_certificate_issue_date' => 'nullable|date',
        ];

        $validated = $request->validate(array_merge($rules, $this->getScholarshipSpecificRules($scholarship->type)));

        try {
            $this->scholarshipService->createApplication($scholarship->id, Auth::id(), $validated);

            return redirect()
                ->route('student.scholarships.index')
                ->with('success', 'Application submitted successfully!');
        } catch (\Exception $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
        }
    }

    private function buildScholarshipPageProps(Scholarship $scholarship): array
    {
        $user = Auth::user();
        $student = $user->studentProfile;

        if (! $student) {
            abort(404, 'Student profile not found');
        }

        $eligibility = $this->checkEligibility($scholarship, $student);
        $canApply = $this->canStudentApply($scholarship, $student) && $eligibility['met'];
        $existingApplication = $student->scholarshipApplications()->where('scholarship_id', $scholarship->id)->first();

        return [
            'scholarship' => [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'description' => $scholarship->description,
                'type' => $scholarship->type,
                'requirements' => $scholarship->required_documents ?? [],
                'amount' => $scholarship->getStipendAmount(),
                'application_start_date' => $scholarship->application_start_date?->format('Y-m-d'),
                'deadline' => $scholarship->deadline?->format('Y-m-d'),
                'status' => $scholarship->status,
                'eligibility_criteria' => $scholarship->getEligibilityCriteria(),
                'required_documents' => array_values($scholarship->getRequiredDocuments()),
                'slots_available' => $scholarship->slots_available,
                'funding_source' => $scholarship->funding_source,
            ],
            'eligibility' => [
                'can_apply' => $canApply,
                'is_eligible' => $eligibility['met'],
                'requirements' => $eligibility['requirements'],
                'reasons' => $eligibility['requirements'],
            ],
            'existing_application' => $existingApplication
                ? [
                    'id' => $existingApplication->id,
                    'status' => $existingApplication->status,
                    'submitted_at' => ($existingApplication->applied_at ?? $existingApplication->created_at)?->format('Y-m-d'),
                ]
                : null,
        ];
    }

    private function canStudentApply(Scholarship $scholarship, StudentProfile $student): bool
    {
        if ($scholarship->deadline < now() || $scholarship->status !== 'active') {
            return false;
        }

        return ! $student->scholarshipApplications()->where('scholarship_id', $scholarship->id)->exists();
    }

    private function checkEligibility(Scholarship $scholarship, StudentProfile $student): array
    {
        $eligibility = ['met' => true, 'requirements' => []];
        $criteria = $scholarship->eligibility_criteria;

        if (is_string($criteria)) {
            $criteria = json_decode($criteria, true) ?? [];
        } elseif (! is_array($criteria)) {
            $criteria = [];
        }

        $requiredGwa = $scholarship->min_gwa ?? ($criteria['minimum_gwa'] ?? null);

        if ($requiredGwa !== null && $student->current_gwa !== null && (float) $student->current_gwa > (float) $requiredGwa) {
            $eligibility['met'] = false;
            $eligibility['requirements'][] = 'GWA requirement not met';
        }

        return $eligibility;
    }

    private function getScholarshipSpecificRules(string $scholarshipType): array
    {
        return match ($scholarshipType) {
            'performing_arts_full', 'performing_arts_partial' => [
                'application_data.membership_duration' => 'required|string|min:1',
                'application_data.major_activities_count' => 'required|integer|min:' . ($scholarshipType === 'performing_arts_full' ? '1' : '2'),
                'application_data.major_performances' => $scholarshipType === 'performing_arts_full' ? 'required|boolean' : 'nullable|boolean',
                'application_data.coach_recommendation_provided' => 'required|boolean',
            ],
            'student_assistantship' => [
                'application_data.pre_hiring_completed' => 'required|boolean',
                'application_data.parent_consent_provided' => 'required|boolean',
            ],
            'economic_assistance' => [
                'application_data.family_income' => 'required|string',
                'application_data.indigency_certificate_issue_date' => 'required|date|before_or_equal:today|after:' . now()->subMonths(6)->toDateString(),
            ],
            default => [],
        };
    }
}
