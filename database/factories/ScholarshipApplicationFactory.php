<?php

namespace Database\Factories;

use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ScholarshipApplication>
 */
class ScholarshipApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Valid statuses from migration
        $statuses = ['draft', 'submitted', 'under_verification', 'incomplete', 'verified', 'under_evaluation', 'approved', 'rejected', 'end'];

        $status = $this->faker->randomElement($statuses);

        // Set timestamp fields based on status
        $appliedAt = null;
        $verifiedAt = null;
        $approvedAt = null;
        $rejectedAt = null;

        if ($status !== 'draft') {
            $appliedAt = now()->subDays($this->faker->numberBetween(1, 30));

            if (in_array($status, ['verified', 'under_evaluation', 'approved', 'rejected', 'end'])) {
                $verifiedAt = $appliedAt->copy()->addDays($this->faker->numberBetween(1, 5));
            }

            if ($status === 'approved') {
                $approvedAt = $verifiedAt ? $verifiedAt->copy()->addDays($this->faker->numberBetween(1, 3)) : now();
            } elseif ($status === 'rejected') {
                $rejectedAt = $verifiedAt ? $verifiedAt->copy()->addDays($this->faker->numberBetween(1, 3)) : now();
            }
        }

        return [
            'scholarship_id' => function () {
                return Scholarship::factory()->create()->id;
            },
            'user_id' => function () {
                // Create a student user
                return User::factory()->create(['role' => 'student'])->id;
            },
            'status' => $status,
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'reviewer_id' => in_array($status, ['verified', 'under_evaluation', 'approved', 'rejected'])
                ? User::factory()->create(['role' => 'osas_staff'])->id
                : null,

            // Tracking Data
            'applied_at' => $appliedAt,
            'verified_at' => $verifiedAt,
            'approved_at' => $approvedAt,
            'rejected_at' => $rejectedAt,
            'current_step' => $this->faker->randomElement(['document_verification', 'evaluation', 'interview', 'final_review']),

            // Application Content
            'purpose_letter' => $this->faker->paragraphs(3, true),
            'uploaded_documents' => json_encode([
                'transcript_of_records' => [
                    'path' => 'documents/transcript.pdf',
                    'original_name' => 'transcript.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ],
                'certificate_of_enrollment' => [
                    'path' => 'documents/certificate.pdf',
                    'original_name' => 'certificate.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ],
                'recommendation_letter' => [
                    'path' => 'documents/recommendation.pdf',
                    'original_name' => 'recommendation.pdf',
                    'uploaded_at' => now()->toDateTimeString(),
                ],
            ]),
            'evaluation_score' => in_array($status, ['under_evaluation', 'approved', 'rejected']) ? $this->faker->randomFloat(2, 70, 100) : null,
            'verifier_comments' => $verifiedAt ? $this->faker->paragraph() : null,
            'committee_recommendation' => in_array($status, ['approved', 'rejected']) ? $this->faker->paragraph() : null,
            'admin_remarks' => in_array($status, ['approved', 'rejected']) ? $this->faker->sentence() : null,

            // Interview
            'interview_schedule' => $this->faker->boolean(30) ? now()->addDays($this->faker->numberBetween(1, 14)) : null,
            'interview_notes' => $this->faker->boolean(30) ? $this->faker->paragraph() : null,

            // Stipend Tracking
            'stipend_status' => $status === 'approved' ? $this->faker->randomElement(['pending', 'processing', 'released']) : null,
            'last_stipend_date' => $status === 'approved' && $this->faker->boolean(60) ? now()->subDays($this->faker->numberBetween(1, 30)) : null,
            'amount_received' => $status === 'approved' ? $this->faker->randomFloat(2, 1000, 10000) : 0,

            // Renewal
            'renewal_status' => $status === 'approved' ? $this->faker->randomElement(['eligible', 'ineligible', 'pending']) : null,
            'academic_year' => $this->faker->numberBetween(2023, 2025),
            'semester' => $this->faker->randomElement(['1st', '2nd', 'Summer']),
            'application_data' => json_encode([
                'family_income' => $this->faker->randomFloat(2, 100000, 500000),
                'membership_duration' => $this->faker->randomNumber(2),
                'major_performances' => $this->faker->boolean(),
                'major_activities_count' => $this->faker->numberBetween(1, 5),
                'pre_hiring_completed' => $this->faker->boolean(),
            ]),
        ];
    }
}
