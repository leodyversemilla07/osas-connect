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
            // Create sample students with real data
            $students = collect($this->createSampleStudents());
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
            'rejected_at' => $rejectedAt,
            'current_step' => $this->getCurrentStep($status),
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
                    'path' => 'scholarship-documents/performance_portfolio_'.uniqid().'.pdf',
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
                break;
        }

        return $baseDocuments;
    }

    /**
     * Generate a sample purpose letter
     */
    private function generatePurposeLetter($scholarshipName)
    {
        $templates = [
            "I am applying for the {$scholarshipName} to support my educational expenses and contribute to my personal and professional development.",
            "The {$scholarshipName} will greatly assist me in pursuing my academic goals and alleviating my financial burdens.",
            "With the {$scholarshipName}, I aim to enhance my skills and knowledge, and to actively participate in academic and extracurricular activities.",
            "Receiving the {$scholarshipName} will enable me to focus more on my studies and less on my financial constraints.",
        ];

        return collect($templates)->random();
    }

    /**
     * Generate sample verifier comments
     */
    private function generateVerifierComments($status)
    {
        $comments = [
            'under_verification' => 'Application is under verification. Please check back later.',
            'verified' => 'Application has been verified. Proceeding to evaluation.',
            'incomplete' => 'Application is incomplete. Please provide the missing documents.',
            'rejected' => 'Application has been rejected due to عدم استيفاء المتطلبات.',
            'approved' => 'Application approved. Congratulations!',
        ];

        return $comments[$status] ?? 'No comments available.';
    }

    /**
     * Generate committee recommendation
     */
    private function generateCommitteeRecommendation($status)
    {
        $recommendations = [
            'approved' => 'The committee recommends approval of this application.',
            'rejected' => 'The committee recommends rejection of this application.',
        ];

        return $recommendations[$status] ?? 'No recommendation available.';
    }

    /**
     * Generate admin remarks
     */
    private function generateAdminRemarks($status)
    {
        $remarks = [
            'approved' => 'Application approved by admin.',
            'rejected' => 'Application rejected by admin.',
        ];

        return $remarks[$status] ?? 'No remarks available.';
    }

    /**
     * Generate sample interview notes
     */
    private function generateInterviewNotes()
    {
        $notes = [
            'Candidate demonstrated excellent communication skills and a strong understanding of the scholarship program.',
            'Applicant has a clear academic and career plan, and shows great potential for success.',
            'Interview revealed a need for improvement in time management and organizational skills.',
            'Candidate is highly motivated and has overcome significant challenges to pursue their education.',
        ];

        return collect($notes)->random();
    }

    /**
     * Get the current step based on status
     */
    private function getCurrentStep($status)
    {
        $steps = [
            'draft' => 1,
            'submitted' => 2,
            'under_verification' => 3,
            'verified' => 4,
            'under_evaluation' => 5,
            'approved' => 6,
            'rejected' => 7,
            'incomplete' => 8,
        ];

        return $steps[$status] ?? 1;
    }

    /**
     * Create sample students with real data (no Faker)
     */
    private function createSampleStudents()
    {
        $sampleStudents = [
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'maria.santos@minsu.edu.ph',
                'student_id' => '2023-00001',
                'course' => 'Bachelor of Science in Computer Science',
                'year_level' => '3rd Year',
                'current_gwa' => 1.25,
            ],
            [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'juan.delacruz@minsu.edu.ph',
                'student_id' => '2023-00002',
                'course' => 'Bachelor of Science in Information Technology',
                'year_level' => '2nd Year',
                'current_gwa' => 1.75,
            ],
            [
                'first_name' => 'Ana',
                'last_name' => 'Garcia',
                'email' => 'ana.garcia@minsu.edu.ph',
                'student_id' => '2023-00003',
                'course' => 'Bachelor of Elementary Education',
                'year_level' => '4th Year',
                'current_gwa' => 1.35,
            ],
            [
                'first_name' => 'Miguel',
                'last_name' => 'Rodriguez',
                'email' => 'miguel.rodriguez@minsu.edu.ph',
                'student_id' => '2023-00004',
                'course' => 'Bachelor of Business Administration',
                'year_level' => '1st Year',
                'current_gwa' => 2.00,
            ],
            [
                'first_name' => 'Sofia',
                'last_name' => 'Lopez',
                'email' => 'sofia.lopez@minsu.edu.ph',
                'student_id' => '2023-00005',
                'course' => 'Bachelor of Science in Nursing',
                'year_level' => '3rd Year',
                'current_gwa' => 1.50,
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Reyes',
                'email' => 'carlos.reyes@minsu.edu.ph',
                'student_id' => '2023-00006',
                'course' => 'Bachelor of Science in Engineering',
                'year_level' => '2nd Year',
                'current_gwa' => 1.80,
            ],
            [
                'first_name' => 'Isabella',
                'last_name' => 'Mendoza',
                'email' => 'isabella.mendoza@minsu.edu.ph',
                'student_id' => '2023-00007',
                'course' => 'Bachelor of Arts in English',
                'year_level' => '4th Year',
                'current_gwa' => 1.40,
            ],
            [
                'first_name' => 'Rafael',
                'last_name' => 'Torres',
                'email' => 'rafael.torres@minsu.edu.ph',
                'student_id' => '2023-00008',
                'course' => 'Bachelor of Science in Mathematics',
                'year_level' => '1st Year',
                'current_gwa' => 2.10,
            ],
            [
                'first_name' => 'Lucia',
                'last_name' => 'Fernandez',
                'email' => 'lucia.fernandez@minsu.edu.ph',
                'student_id' => '2023-00009',
                'course' => 'Bachelor of Science in Psychology',
                'year_level' => '3rd Year',
                'current_gwa' => 1.60,
            ],
            [
                'first_name' => 'Diego',
                'last_name' => 'Morales',
                'email' => 'diego.morales@minsu.edu.ph',
                'student_id' => '2023-00010',
                'course' => 'Bachelor of Science in Agriculture',
                'year_level' => '2nd Year',
                'current_gwa' => 1.90,
            ],
        ];

        $createdStudents = collect();

        foreach ($sampleStudents as $studentData) {
            // Create user
            $user = User::create([
                'first_name' => $studentData['first_name'],
                'last_name' => $studentData['last_name'],
                'email' => $studentData['email'],
                'email_verified_at' => now(),
                'password' => bcrypt('password123'),
                'role' => 'student',
            ]);

            // Create student profile
            StudentProfile::create([
                'user_id' => $user->id,
                'student_id' => $studentData['student_id'],
                'course' => $studentData['course'],
                'major' => 'None',
                'year_level' => $studentData['year_level'],
                'current_gwa' => $studentData['current_gwa'],
                'enrollment_status' => 'enrolled',
                'units' => 18,
                'existing_scholarships' => null,

                // Personal Information
                'civil_status' => 'Single',
                'sex' => collect(['Male', 'Female'])->random(),
                'date_of_birth' => now()->subYears(rand(18, 24))->format('Y-m-d'),
                'place_of_birth' => 'Butig, Lanao del Sur',
                'street' => 'MinSU Campus',
                'barangay' => 'Butig',
                'city' => 'Butig',
                'province' => 'Lanao del Sur',
                'zip_code' => '9307',
                'mobile_number' => '+63912345'.str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'telephone_number' => null,
                'is_pwd' => false,
                'disability_type' => null,
                'religion' => 'Islam',
                'residence_type' => 'Boarding House',

                // Family Background
                'status_of_parents' => 'Living Together',
                'guardian_name' => 'Not Applicable',
            ]);

            $createdStudents->push($user->load('studentProfile'));
        }

        return $createdStudents;
    }
}
