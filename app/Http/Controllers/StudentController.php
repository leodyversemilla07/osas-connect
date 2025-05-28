<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display the student dashboard.
     */
    public function index(): Response
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get count of active/approved scholarships and add it to student data
        $studentData = $student->toArray();

        // Count both existing scholarships and approved applications
        $existingScholarships = ! empty($student->existing_scholarships) ? 1 : 0;
        $approvedApplications = $student->scholarshipApplications()
            ->where('status', 'approved')
            ->count();

        $studentData['scholarships'] = $existingScholarships + $approvedApplications;

        // Get available scholarships
        $availableScholarships = Scholarship::where('status', Scholarship::STATUS_OPEN)
            ->where('deadline', '>=', now())
            ->get()
            ->map(function ($scholarship) {
                return [
                    'id' => $scholarship->id,
                    'name' => $scholarship->name,
                    'type' => $scholarship->type,
                    'amount' => '₱' . number_format($scholarship->amount, 0) . '/month',
                    'deadline' => $scholarship->deadline->format('Y-m-d'),
                    'status' => $scholarship->status,
                    'description' => $scholarship->description,
                ];
            });

        // Get recent applications
        $recentApplications = $student->scholarshipApplications()
            ->with('scholarship')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($application) {
                $progress = $this->getApplicationProgress($application->status);
                return [
                    'id' => $application->id,
                    'scholarship_name' => $application->scholarship->name,
                    'status' => $application->status,
                    'submitted_at' => $application->applied_at->format('Y-m-d'),
                    'progress' => $progress,
                ];
            });

        // Get statistics
        $totalApplications = $student->scholarshipApplications()->count();
        $approvedScholarships = $student->scholarshipApplications()
            ->where('status', 'approved')
            ->count();

        return Inertia::render('student/dashboard', [
            'student' => $studentData,
            'availableScholarships' => $availableScholarships,
            'recentApplications' => $recentApplications,
            'totalApplications' => $totalApplications,
            'approvedScholarships' => $approvedScholarships,
        ]);
    }

    /**
     * Get application progress percentage based on status
     */
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

    public function showScholarships(): Response
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get count of active/approved scholarships and add it to student data
        $studentData = $student->toArray();

        // Count both existing scholarships and approved applications
        $existingScholarships = ! empty($student->existing_scholarships) ? 1 : 0;
        $approvedApplications = $student->scholarshipApplications()
            ->where('status', 'approved')
            ->count();

        $studentData['scholarships'] = $existingScholarships + $approvedApplications;

        return Inertia::render('student/view-scholarships', [
            'student' => $studentData,
        ]);
    }

    public function applications(): Response
    {
        $student = Auth::user()->studentProfile;

        if (!$student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get all applications with scholarship details
        $applications = $student->scholarshipApplications()
            ->with('scholarship')
            ->latest()
            ->get()
            ->map(function ($application) {
                $progress = $this->getApplicationProgress($application->status);
                return [
                    'id' => $application->id,
                    'scholarship_name' => $application->scholarship->name,
                    'scholarship_type' => $application->scholarship->type,
                    'status' => $application->status,
                    'submitted_at' => $application->applied_at ? $application->applied_at->format('Y-m-d') : null,
                    'created_at' => $application->created_at->format('Y-m-d'),
                    'progress' => $progress,
                    'amount' => '₱' . number_format($application->scholarship->amount, 0) . '/month',
                    'can_edit' => in_array($application->status, ['draft', 'incomplete']),
                ];
            });

        // Get statistics
        $stats = [
            'total' => $applications->count(),
            'pending' => $applications->where('status', 'submitted')->count(),
            'approved' => $applications->where('status', 'approved')->count(),
            'draft' => $applications->where('status', 'draft')->count(),
        ];

        return Inertia::render('student/applications', [
            'applications' => $applications,
            'stats' => $stats,
        ]);
    }

    public function applicationStatus($applicationId): Response
    {
        $student = Auth::user()->studentProfile;

        if (!$student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get the specific application and authorize access
        $application = $student->scholarshipApplications()
            ->with(['scholarship', 'documents'])
            ->findOrFail($applicationId);

        // Additional authorization check using policy
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
            'purpose_statement' => $application->purpose_statement,
            'feedback' => $application->feedback,
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
