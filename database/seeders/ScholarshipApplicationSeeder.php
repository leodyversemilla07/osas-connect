<?php

namespace Database\Seeders;

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ScholarshipApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding scholarship applications...');

        // Ensure we have scholarships and students to work with
        $scholarships = Scholarship::where('status', 'active')->get();
        $students = User::whereHas('studentProfile')->with('studentProfile')->get();

        if ($scholarships->isEmpty()) {
            $this->command->warn('No active scholarships found. Please run MinSUScholarshipsSeeder first.');

            return;
        }

        if ($students->isEmpty()) {
            $this->command->warn('No students found. Creating sample students...');
            // Create sample students
            $students = User::factory()
                ->count(10)
                ->create(['role' => 'student'])
                ->each(function ($user) {
                    StudentProfile::factory()->create(['user_id' => $user->id]);
                });
        }

        $this->command->info("Found {$scholarships->count()} scholarships and {$students->count()} students.");

        // Create applications for different scenarios
        $applicationData = [
            // Recent applications (submitted in last 7 days)
            [
                'count' => 15,
                'status' => 'submitted',
                'description' => 'Recently submitted applications',
                'days_ago' => rand(1, 7),
            ],
            // Applications under verification
            [
                'count' => 12,
                'status' => 'under_verification',
                'description' => 'Applications being verified',
                'days_ago' => rand(3, 14),
            ],
            // Verified applications
            [
                'count' => 8,
                'status' => 'verified',
                'description' => 'Verified applications awaiting evaluation',
                'days_ago' => rand(7, 21),
            ],
            // Applications under evaluation
            [
                'count' => 6,
                'status' => 'under_evaluation',
                'description' => 'Applications being evaluated',
                'days_ago' => rand(10, 30),
            ],
            // Approved applications
            [
                'count' => 10,
                'status' => 'approved',
                'description' => 'Approved scholarship applications',
                'days_ago' => rand(14, 60),
            ],
            // Rejected applications
            [
                'count' => 5,
                'status' => 'rejected',
                'description' => 'Rejected applications',
                'days_ago' => rand(7, 45),
            ],
            // Incomplete applications
            [
                'count' => 4,
                'status' => 'incomplete',
                'description' => 'Incomplete applications needing revision',
                'days_ago' => rand(5, 20),
            ],
        ];

        $totalApplications = 0;

        foreach ($applicationData as $batch) {
            $this->command->info("Creating {$batch['count']} {$batch['description']}...");

            for ($i = 0; $i < $batch['count']; $i++) {
                $student = $students->random();
                $scholarship = $scholarships->random();

                // Skip if student already has application for this scholarship
                $existingApplication = ScholarshipApplication::where('user_id', $student->id)
                    ->where('scholarship_id', $scholarship->id)
                    ->first();

                if ($existingApplication) {
                    continue;
                }

                $this->createApplication($student, $scholarship, $batch['status'], $batch['days_ago']);
                $totalApplications++;
            }
        }

        // Create some draft applications
        $this->command->info('Creating draft applications...');
        for ($i = 0; $i < 8; $i++) {
            $student = $students->random();
            $scholarship = $scholarships->random();

            $existingApplication = ScholarshipApplication::where('user_id', $student->id)
                ->where('scholarship_id', $scholarship->id)
                ->first();

            if (! $existingApplication) {
                $this->createApplication($student, $scholarship, 'draft', rand(1, 5));
                $totalApplications++;
            }
        }

        $this->command->info("Successfully created {$totalApplications} scholarship applications!");

        // Display summary
        $statusCounts = DB::table('scholarship_applications')
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $this->command->info('Application Status Summary:');
        foreach ($statusCounts as $status => $count) {
            $this->command->info("  {$status}: {$count}");
        }
    }

    /**
     * Create a single scholarship application
     */
    private function createApplication($student, $scholarship, $status, $daysAgo)
    {
        $appliedAt = null;
        $verifiedAt = null;
        $approvedAt = null;
        $rejectedAt = null;
        $reviewerId = null;

        // Set timestamps based on status
        if ($status !== 'draft') {
            $appliedAt = now()->subDays($daysAgo);

            if (in_array($status, ['under_verification', 'verified', 'under_evaluation', 'approved', 'rejected', 'incomplete'])) {
                $reviewerId = User::where('role', 'osas_staff')->inRandomOrder()->first()?->id;

                if (in_array($status, ['verified', 'under_evaluation', 'approved', 'rejected'])) {
                    $verifiedAt = $appliedAt->copy()->addDays(rand(1, 3));
                }

                if ($status === 'approved') {
                    $approvedAt = $verifiedAt ? $verifiedAt->copy()->addDays(rand(1, 5)) : $appliedAt->copy()->addDays(rand(3, 8));
                } elseif ($status === 'rejected') {
                    $rejectedAt = $verifiedAt ? $verifiedAt->copy()->addDays(rand(1, 5)) : $appliedAt->copy()->addDays(rand(3, 8));
                }
            }
        }

        // Create application data based on scholarship type
        $applicationData = $this->generateApplicationData($scholarship->type);

        // Generate sample documents
        $uploadedDocuments = $this->generateDocuments($scholarship->type, $status !== 'draft');

        $application = ScholarshipApplication::create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => $status,
            'priority' => collect(['low', 'medium', 'high'])->random(),
            'reviewer_id' => $reviewerId,
            'applied_at' => $appliedAt,
            'verified_at' => $verifiedAt,
            'approved_at' => $approvedAt,
            'rejected_at' => $rejectedAt,            'current_step' => $this->getCurrentStep($status),
            'purpose_letter' => $this->generatePurposeLetter($scholarship->name),
            'application_data' => $applicationData,
            'uploaded_documents' => $uploadedDocuments,
            'evaluation_score' => in_array($status, ['under_evaluation', 'approved', 'rejected']) ? rand(70, 100) : null,
            'verifier_comments' => $verifiedAt ? $this->generateVerifierComments($status) : null,
            'committee_recommendation' => in_array($status, ['approved', 'rejected']) ? $this->generateCommitteeRecommendation($status) : null,
            'admin_remarks' => in_array($status, ['approved', 'rejected']) ? $this->generateAdminRemarks($status) : null,
            'interview_schedule' => $status === 'under_evaluation' && rand(1, 3) === 1 ? now()->addDays(rand(3, 14)) : null,
            'interview_notes' => $status === 'approved' && rand(1, 2) === 1 ? $this->generateInterviewNotes() : null,
            'stipend_status' => $status === 'approved' ? collect(['pending', 'processing', 'released'])->random() : null,
            'last_stipend_date' => $status === 'approved' && rand(1, 3) === 1 ? now()->subDays(rand(1, 30)) : null,
            'amount_received' => $status === 'approved' ? rand(1000, 10000) : 0,
            'renewal_status' => $status === 'approved' ? collect(['eligible', 'ineligible', 'pending'])->random() : null,
            'academic_year' => date('Y'),
            'semester' => collect(['1st', '2nd'])->random(),
        ]);

        return $application;
    }

    /**
     * Generate application data based on scholarship type
     */
    private function generateApplicationData($scholarshipType)
    {
        $baseData = [
            'family_income' => rand(100000, 500000),
            'parent_consent_provided' => true,
        ];

        switch ($scholarshipType) {
            case 'student_assistantship':
                return array_merge($baseData, [
                    'pre_hiring_completed' => collect([true, false])->random(),
                    'work_preference' => collect(['library', 'registrar', 'admin', 'laboratory'])->random(),
                ]);

            case 'performing_arts_full':
            case 'performing_arts_partial':
                return array_merge($baseData, [
                    'membership_duration' => rand(6, 36), // months
                    'major_performances' => collect([true, false])->random(),
                    'major_activities_count' => rand(1, 8),
                    'coach_recommendation_provided' => true,
                    'group_name' => collect(['MinSU Dance Troupe', 'MinSU Chorale', 'MinSU Theater Guild', 'MinSU Band'])->random(),
                ]);

            case 'economic_assistance':
                return array_merge($baseData, [
                    'indigency_certificate_issue_date' => now()->subDays(rand(30, 180))->format('Y-m-d'),
                    'barangay_certificate_provided' => true,
                    'family_income' => rand(50000, 200000), // Lower income range
                ]);

            default:
                return $baseData;
        }
    }

    /**
     * Generate sample uploaded documents
     */
    private function generateDocuments($scholarshipType, $hasUploaded = true)
    {
        if (! $hasUploaded) {
            return [];
        }

        $baseDocuments = [
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

        // Add type-specific documents
        switch ($scholarshipType) {
            case 'student_assistantship':
                $baseDocuments['parent_consent'] = [
                    'path' => 'scholarship-documents/consent_'.uniqid().'.pdf',
                    'original_name' => 'parent_consent.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
                $baseDocuments['medical_certificate'] = [
                    'path' => 'scholarship-documents/medical_'.uniqid().'.pdf',
                    'original_name' => 'medical_certificate.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
                break;

            case 'performing_arts_full':
            case 'performing_arts_partial':
                $baseDocuments['coach_recommendation'] = [
                    'path' => 'scholarship-documents/coach_rec_'.uniqid().'.pdf',
                    'original_name' => 'coach_recommendation.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
                $baseDocuments['performance_portfolio'] = [
                    'path' => 'scholarship-documents/portfolio_'.uniqid().'.pdf',
                    'original_name' => 'performance_portfolio.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
                break;

            case 'economic_assistance':
                $baseDocuments['indigency_certificate'] = [
                    'path' => 'scholarship-documents/indigency_'.uniqid().'.pdf',
                    'original_name' => 'indigency_certificate.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
                $baseDocuments['income_certificate'] = [
                    'path' => 'scholarship-documents/income_'.uniqid().'.pdf',
                    'original_name' => 'family_income.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ];
                break;
        }

        return $baseDocuments;
    }

    /**
     * Get current step based on status
     */
    private function getCurrentStep($status)
    {
        $steps = [
            'draft' => 'application_form',
            'submitted' => 'document_verification',
            'under_verification' => 'document_verification',
            'incomplete' => 'document_revision',
            'verified' => 'evaluation',
            'under_evaluation' => 'evaluation',
            'approved' => 'completed',
            'rejected' => 'completed',
        ];

        return $steps[$status] ?? 'unknown';
    }

    /**
     * Generate purpose letter
     */
    private function generatePurposeLetter($scholarshipName)
    {
        $templates = [
            "I am writing to express my sincere interest in applying for the {$scholarshipName}. As a dedicated student committed to academic excellence, I believe this scholarship will greatly support my educational journey. My academic achievements, combined with my active participation in university activities, demonstrate my commitment to personal and academic growth. I am confident that with this scholarship, I can continue to excel in my studies while contributing positively to the university community.",

            "I am honored to submit my application for the {$scholarshipName}. Throughout my academic career, I have maintained high standards of excellence while actively participating in extracurricular activities. This scholarship would provide crucial financial support that would allow me to focus entirely on my studies and contribute more meaningfully to campus life. I am committed to upholding the values and standards expected of scholarship recipients.",

            "With great enthusiasm, I am applying for the {$scholarshipName}. Coming from a family with limited financial resources, this scholarship represents not just financial assistance, but an opportunity to pursue my dreams of academic achievement. I have consistently demonstrated dedication to my studies and community service, and I am eager to continue this commitment with the support of this scholarship program.",
        ];

        return collect($templates)->random();
    }

    /**
     * Generate verifier comments
     */
    private function generateVerifierComments($status)
    {
        $positiveComments = [
            'All required documents have been submitted and verified. Student meets all eligibility criteria.',
            'Documents are complete and authentic. Strong academic record demonstrated.',
            'All documentation provided is satisfactory. Application ready for committee review.',
            'Complete submission with excellent supporting documents. Highly recommended for evaluation.',
        ];

        $incompleteComments = [
            'Missing updated transcript of records. Please submit current grades.',
            'Birth certificate needs to be PSA-authenticated. Please resubmit.',
            'Recommendation letter format does not meet requirements. Please request new letter.',
            'ID photo does not meet specifications. Please provide 2x2 recent photo with white background.',
        ];

        if ($status === 'incomplete') {
            return collect($incompleteComments)->random();
        }

        return collect($positiveComments)->random();
    }

    /**
     * Generate committee recommendation
     */
    private function generateCommitteeRecommendation($status)
    {
        $approvedRecommendations = [
            'Committee unanimously recommends approval based on excellent academic performance and demonstrated financial need.',
            'Strong candidate with outstanding credentials. Recommended for scholarship award.',
            'Exemplary academic record and community involvement. Highly recommended for approval.',
            'Committee finds applicant meets all criteria with distinction. Recommended for immediate approval.',
        ];

        $rejectedRecommendations = [
            'While applicant shows promise, limited slots require selection of candidates with higher academic standing.',
            'Committee recommends encouraging applicant to reapply next term after addressing academic performance.',
            'Application does not meet minimum requirements for this scholarship category.',
            'Committee suggests applicant consider alternative scholarship programs better suited to their profile.',
        ];

        if ($status === 'approved') {
            return collect($approvedRecommendations)->random();
        }

        return collect($rejectedRecommendations)->random();
    }

    /**
     * Generate admin remarks
     */
    private function generateAdminRemarks($status)
    {
        $approvedRemarks = [
            'Approved for full scholarship benefits effective immediately.',
            'Award confirmed. Student to be notified of orientation schedule.',
            'Scholarship granted with stipend disbursement to begin next month.',
            'Approved with commendation for academic excellence.',
        ];

        $rejectedRemarks = [
            'Application declined due to limited available slots.',
            'Advised to maintain current GPA and reapply next semester.',
            'Not selected in this round. Eligible for future applications.',
            'Encourage participation in academic improvement programs.',
        ];

        if ($status === 'approved') {
            return collect($approvedRemarks)->random();
        }

        return collect($rejectedRemarks)->random();
    }

    /**
     * Generate interview notes
     */
    private function generateInterviewNotes()
    {
        $notes = [
            'Candidate demonstrated clear understanding of scholarship responsibilities. Excellent communication skills and genuine commitment to academic success.',
            'Impressive interview performance. Student articulated goals clearly and showed strong motivation for academic achievement.',
            'Well-prepared candidate with realistic academic and career goals. Shows good understanding of scholarship requirements.',
            'Confident and articulate responses. Demonstrated strong commitment to university values and community service.',
        ];

        return collect($notes)->random();
    }
}
