<?php

use App\Models\ApplicationComment;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use App\Services\ScholarshipApplicationPresenter;

describe('ScholarshipApplicationPresenter', function () {
    it('builds canonical student detail payloads', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);

        $requiredDocuments = collect($scholarship->getRequiredDocuments());
        $uploadedDocuments = $requiredDocuments->mapWithKeys(function (string $label, string $key) {
            return [$key => [
                'path' => "documents/{$key}.pdf",
                'original_name' => "{$key}.pdf",
                'uploaded_at' => now()->toIso8601String(),
                'verified' => $key !== 'good_moral',
            ]];
        })->all();

        $application = ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'status' => ScholarshipApplication::STATUS_UNDER_EVALUATION,
            'applied_at' => now()->subDays(5),
            'verified_at' => now()->subDays(2),
            'interview_schedule' => now()->addDay(),
            'uploaded_documents' => $uploadedDocuments,
            'purpose_letter' => 'I want to continue my studies and serve the university.',
        ]);

        $payload = app(ScholarshipApplicationPresenter::class)->presentStudentDetail($application);

        expect($payload['status'])->toBe(ScholarshipApplication::STATUS_UNDER_EVALUATION)
            ->and($payload['status_label'])->toBe('Under Evaluation')
            ->and($payload['document_summary']['required_count'])->toBe($requiredDocuments->count())
            ->and($payload['document_summary']['verified_count'])->toBe($requiredDocuments->count() - 1)
            ->and($payload['interview_summary']['scheduled'])->toBeTrue()
            ->and($payload['next_steps'])->not->toBeEmpty()
            ->and(collect($payload['timeline'])->pluck('title'))->toContain('Under Evaluation');
    });

    it('includes comments and progress flags for staff review payloads', function () {
        $student = User::factory()->withProfile()->create(['role' => 'student']);
        $reviewer = User::factory()->create(['role' => 'osas_staff']);
        $scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ECONOMIC_ASSISTANCE,
            'status' => 'active',
            'deadline' => now()->addDays(30),
        ]);

        $requiredDocuments = collect($scholarship->getRequiredDocuments());
        $uploadedDocuments = $requiredDocuments->mapWithKeys(fn (string $label, string $key) => [
            $key => [
                'path' => "documents/{$key}.pdf",
                'original_name' => "{$key}.pdf",
                'uploaded_at' => now()->toIso8601String(),
                'verified' => true,
            ],
        ])->all();

        $application = ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
            'reviewer_id' => $reviewer->id,
            'status' => ScholarshipApplication::STATUS_APPROVED,
            'approved_at' => now(),
            'uploaded_documents' => $uploadedDocuments,
            'verifier_comments' => 'Applicant met the requirements.',
        ]);

        ApplicationComment::create([
            'application_id' => $application->id,
            'user_id' => $reviewer->id,
            'comment' => 'Ready for release approval.',
            'type' => 'internal',
        ]);

        $payload = app(ScholarshipApplicationPresenter::class)->presentStaffReview($application->fresh(), $reviewer);

        expect($payload['review_summary']['completed'])->toBeTrue()
            ->and($payload['progress_flags']['documents_verified'])->toBeTrue()
            ->and($payload['comments'])->toHaveCount(1)
            ->and($payload['reviewer']['id'])->toBe($reviewer->id);
    });
});
