<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;

// Create additional students
echo "Creating additional students...\n";
$students = [];
for ($i = 0; $i < 15; $i++) {
    $user = User::factory()->create(['role' => 'student']);
    StudentProfile::factory()->create(['user_id' => $user->id]);
    $students[] = $user;
}
echo 'Created '.count($students)." additional students\n";

// Get all students and scholarships
$allStudents = User::whereHas('studentProfile')->with('studentProfile')->get();
$scholarships = Scholarship::where('status', 'active')->get();

echo 'Found '.$allStudents->count().' total students and '.$scholarships->count()." scholarships\n";

// Create various application statuses
$applicationData = [
    ['status' => 'submitted', 'count' => 12, 'days_ago' => [1, 7]],
    ['status' => 'under_verification', 'count' => 8, 'days_ago' => [3, 14]],
    ['status' => 'verified', 'count' => 6, 'days_ago' => [7, 21]],
    ['status' => 'under_evaluation', 'count' => 5, 'days_ago' => [10, 30]],
    ['status' => 'approved', 'count' => 8, 'days_ago' => [14, 60]],
    ['status' => 'rejected', 'count' => 4, 'days_ago' => [7, 45]],
    ['status' => 'incomplete', 'count' => 3, 'days_ago' => [5, 20]],
    ['status' => 'draft', 'count' => 5, 'days_ago' => [1, 5]],
];

$totalCreated = 0;

foreach ($applicationData as $batch) {
    echo "Creating {$batch['count']} {$batch['status']} applications...\n";

    for ($i = 0; $i < $batch['count']; $i++) {
        $student = $allStudents->random();
        $scholarship = $scholarships->random();

        // Skip if student already has application for this scholarship
        $exists = ScholarshipApplication::where('user_id', $student->id)
            ->where('scholarship_id', $scholarship->id)
            ->exists();

        if ($exists) {
            continue;
        }

        $daysAgo = rand($batch['days_ago'][0], $batch['days_ago'][1]);
        $appliedAt = null;
        $verifiedAt = null;
        $approvedAt = null;
        $rejectedAt = null;
        $reviewerId = null;

        // Set timestamps based on status
        if ($batch['status'] !== 'draft') {
            $appliedAt = now()->subDays($daysAgo);

            if (in_array($batch['status'], ['under_verification', 'verified', 'under_evaluation', 'approved', 'rejected', 'incomplete'])) {
                $staffUser = User::where('role', 'osas_staff')->first();
                $reviewerId = $staffUser ? $staffUser->id : null;

                if (in_array($batch['status'], ['verified', 'under_evaluation', 'approved', 'rejected'])) {
                    $verifiedAt = $appliedAt->copy()->addDays(rand(1, 3));
                }

                if ($batch['status'] === 'approved') {
                    $approvedAt = $verifiedAt ? $verifiedAt->copy()->addDays(rand(1, 5)) : $appliedAt->copy()->addDays(rand(3, 8));
                } elseif ($batch['status'] === 'rejected') {
                    $rejectedAt = $verifiedAt ? $verifiedAt->copy()->addDays(rand(1, 5)) : $appliedAt->copy()->addDays(rand(3, 8));
                }
            }
        }

        // Generate sample documents based on scholarship type
        $uploadedDocuments = [];
        if ($batch['status'] !== 'draft') {
            $uploadedDocuments = [
                'transcript_of_records' => [
                    'path' => 'scholarship-documents/transcript_'.uniqid().'.pdf',
                    'original_name' => 'transcript.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ],
                'birth_certificate' => [
                    'path' => 'scholarship-documents/birth_cert_'.uniqid().'.pdf',
                    'original_name' => 'birth_certificate.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ],
                'id_photo' => [
                    'path' => 'scholarship-documents/id_photo_'.uniqid().'.jpg',
                    'original_name' => '2x2_photo.jpg',
                    'uploaded_at' => now()->toDateTimeString(),
                ],
            ];

            // Add scholarship-specific documents
            if ($scholarship->type === 'student_assistantship') {
                $uploadedDocuments['parent_consent'] = [
                    'path' => 'scholarship-documents/consent_'.uniqid().'.pdf',
                    'original_name' => 'parent_consent.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
            } elseif (in_array($scholarship->type, ['performing_arts_full', 'performing_arts_partial'])) {
                $uploadedDocuments['coach_recommendation'] = [
                    'path' => 'scholarship-documents/coach_rec_'.uniqid().'.pdf',
                    'original_name' => 'coach_recommendation.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
            } elseif ($scholarship->type === 'economic_assistance') {
                $uploadedDocuments['indigency_certificate'] = [
                    'path' => 'scholarship-documents/indigency_'.uniqid().'.pdf',
                    'original_name' => 'indigency_certificate.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
            }
        }

        // Generate application data
        $applicationData = [
            'family_income' => rand(100000, 500000),
            'parent_consent_provided' => true,
        ];

        if ($scholarship->type === 'student_assistantship') {
            $applicationData['pre_hiring_completed'] = rand(0, 1) === 1;
            $applicationData['work_preference'] = ['library', 'registrar', 'admin', 'laboratory'][array_rand(['library', 'registrar', 'admin', 'laboratory'])];
        } elseif (in_array($scholarship->type, ['performing_arts_full', 'performing_arts_partial'])) {
            $applicationData['membership_duration'] = rand(6, 36);
            $applicationData['major_performances'] = rand(0, 1) === 1;
            $applicationData['major_activities_count'] = rand(1, 8);
            $applicationData['coach_recommendation_provided'] = true;
            $applicationData['group_name'] = ['MinSU Dance Troupe', 'MinSU Chorale', 'MinSU Theater Guild', 'MinSU Band'][array_rand(['MinSU Dance Troupe', 'MinSU Chorale', 'MinSU Theater Guild', 'MinSU Band'])];
        } elseif ($scholarship->type === 'economic_assistance') {
            $applicationData['indigency_certificate_issue_date'] = now()->subDays(rand(30, 180))->format('Y-m-d');
            $applicationData['barangay_certificate_provided'] = true;
            $applicationData['family_income'] = rand(50000, 200000);
        }

        // Generate purpose letter
        $purposeLetters = [
            "I am writing to express my sincere interest in applying for the {$scholarship->name}. As a dedicated student committed to academic excellence, I believe this scholarship will greatly support my educational journey. My academic achievements, combined with my active participation in university activities, demonstrate my commitment to personal and academic growth.",
            "I am honored to submit my application for the {$scholarship->name}. Throughout my academic career, I have maintained high standards of excellence while actively participating in extracurricular activities. This scholarship would provide crucial financial support that would allow me to focus entirely on my studies.",
            "With great enthusiasm, I am applying for the {$scholarship->name}. Coming from a family with limited financial resources, this scholarship represents not just financial assistance, but an opportunity to pursue my dreams of academic achievement.",
        ];

        // Generate comments based on status
        $verifierComments = null;
        $committeeRecommendation = null;
        $adminRemarks = null;

        if ($batch['status'] === 'incomplete') {
            $verifierComments = [
                'Missing updated transcript of records. Please submit current grades.',
                'Birth certificate needs to be PSA-authenticated. Please resubmit.',
                'Recommendation letter format does not meet requirements.',
            ][array_rand([0, 1, 2])];
        } elseif (in_array($batch['status'], ['verified', 'under_evaluation', 'approved', 'rejected'])) {
            $verifierComments = 'All required documents have been submitted and verified. Student meets all eligibility criteria.';
        }

        if ($batch['status'] === 'approved') {
            $committeeRecommendation = 'Committee unanimously recommends approval based on excellent academic performance and demonstrated financial need.';
            $adminRemarks = 'Approved for full scholarship benefits effective immediately.';
        } elseif ($batch['status'] === 'rejected') {
            $committeeRecommendation = 'While applicant shows promise, limited slots require selection of candidates with higher academic standing.';
            $adminRemarks = 'Application declined due to limited available slots.';
        }

        $application = ScholarshipApplication::create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => $batch['status'],
            'priority' => ['low', 'medium', 'high'][array_rand(['low', 'medium', 'high'])],
            'reviewer_id' => $reviewerId,
            'applied_at' => $appliedAt,
            'verified_at' => $verifiedAt,
            'approved_at' => $approvedAt,
            'rejected_at' => $rejectedAt,
            'current_step' => [
                'draft' => 'application_form',
                'submitted' => 'document_verification',
                'under_verification' => 'document_verification',
                'incomplete' => 'document_revision',
                'verified' => 'evaluation',
                'under_evaluation' => 'evaluation',
                'approved' => 'completed',
                'rejected' => 'completed',
            ][$batch['status']] ?? 'unknown',
            'purpose_letter' => $purposeLetters[array_rand($purposeLetters)],
            'application_data' => $applicationData,
            'uploaded_documents' => $uploadedDocuments,
            'evaluation_score' => in_array($batch['status'], ['under_evaluation', 'approved', 'rejected']) ? rand(70, 100) : null,
            'verifier_comments' => $verifierComments,
            'committee_recommendation' => $committeeRecommendation,
            'admin_remarks' => $adminRemarks,
            'interview_schedule' => $batch['status'] === 'under_evaluation' && rand(1, 3) === 1 ? now()->addDays(rand(3, 14)) : null,
            'interview_notes' => $batch['status'] === 'approved' && rand(1, 2) === 1 ? 'Candidate demonstrated clear understanding of scholarship responsibilities. Excellent communication skills.' : null,
            'stipend_status' => $batch['status'] === 'approved' ? ['pending', 'processing', 'released'][array_rand(['pending', 'processing', 'released'])] : null,
            'last_stipend_date' => $batch['status'] === 'approved' && rand(1, 3) === 1 ? now()->subDays(rand(1, 30)) : null,
            'amount_received' => $batch['status'] === 'approved' ? rand(1000, 10000) : 0,
            'renewal_status' => $batch['status'] === 'approved' ? ['eligible', 'ineligible', 'pending'][array_rand(['eligible', 'ineligible', 'pending'])] : null,
            'academic_year' => date('Y'),
            'semester' => ['1st', '2nd'][array_rand(['1st', '2nd'])],
        ]);

        $totalCreated++;
    }
}

echo "Successfully created {$totalCreated} scholarship applications!\n";

// Display summary
$statusCounts = ScholarshipApplication::selectRaw('status, count(*) as count')
    ->groupBy('status')
    ->pluck('count', 'status')
    ->toArray();

echo "Application Status Summary:\n";
foreach ($statusCounts as $status => $count) {
    echo "  {$status}: {$count}\n";
}

echo 'Total applications: '.ScholarshipApplication::count()."\n";
