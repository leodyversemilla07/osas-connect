<?php

use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\ScholarshipNotification;
use App\Models\User;
use App\Services\ScholarshipWorkflowService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('private');
    $this->workflowService = app(ScholarshipWorkflowService::class);
});

it('submits scholarship applications through the workflow service', function () {
    $student = User::factory()->withProfile()->create(['role' => 'student']);
    $student->studentProfile->update([
        'current_gwa' => 1.25,
        'enrollment_status' => 'enrolled',
        'units' => 21,
        'existing_scholarships' => null,
    ]);

    $scholarship = Scholarship::factory()->create([
        'type' => Scholarship::TYPE_ACADEMIC_FULL,
        'status' => 'active',
        'deadline' => now()->addDays(30),
        'slots' => 10,
        'beneficiaries' => 0,
        'slots_available' => 10,
    ]);

    $documents = [];
    foreach (array_keys($scholarship->getRequiredDocuments()) as $documentKey) {
        $documents[$documentKey] = UploadedFile::fake()->create("{$documentKey}.pdf", 128, 'application/pdf');
    }

    $application = $this->workflowService->submitApplication($scholarship, $student, [
        'personal_statement' => str_repeat('I am prepared to meet the scholarship requirements. ', 3),
        'academic_goals' => str_repeat('I plan to finish my degree with honors. ', 2),
        'financial_need_statement' => str_repeat('This support will help me stay enrolled this year. ', 2),
        'documents' => $documents,
    ]);

    $requiredKeys = array_keys($scholarship->getRequiredDocuments());
    $storedKeys = array_keys($application->uploaded_documents);
    sort($requiredKeys);
    sort($storedKeys);

    expect($application->status)->toBe(ScholarshipApplication::STATUS_SUBMITTED)
        ->and($storedKeys)->toBe($requiredKeys);

    $notification = ScholarshipNotification::query()
        ->where('user_id', $student->id)
        ->latest()
        ->first();

    expect($notification)->not->toBeNull()
        ->and($notification->data['application_id'])->toBe($application->id);
});

it('enforces canonical application status transitions', function () {
    $application = ScholarshipApplication::factory()->create([
        'status' => ScholarshipApplication::STATUS_SUBMITTED,
    ]);
    $staff = User::factory()->create(['role' => 'osas_staff']);

    $updatedApplication = $this->workflowService->transitionApplicationStatus(
        $application,
        ScholarshipApplication::STATUS_UNDER_VERIFICATION,
        $staff,
        'Initial review started.'
    );

    expect($updatedApplication->status)->toBe(ScholarshipApplication::STATUS_UNDER_VERIFICATION)
        ->and($updatedApplication->reviewer_id)->toBe($staff->id)
        ->and($updatedApplication->verifier_comments)->toBe('Initial review started.');

    expect(fn () => $this->workflowService->transitionApplicationStatus(
        $updatedApplication,
        ScholarshipApplication::STATUS_APPROVED,
        $staff
    ))->toThrow(InvalidArgumentException::class);
});

it('moves applications to verified when all required review documents are verified', function () {
    $scholarship = Scholarship::factory()->create([
        'type' => Scholarship::TYPE_ACADEMIC_FULL,
    ]);
    $application = ScholarshipApplication::factory()->create([
        'scholarship_id' => $scholarship->id,
        'status' => ScholarshipApplication::STATUS_UNDER_VERIFICATION,
    ]);

    Document::factory()->create([
        'application_id' => $application->id,
        'type' => Document::TYPE_GRADES,
        'status' => Document::STATUS_VERIFIED,
    ]);
    Document::factory()->create([
        'application_id' => $application->id,
        'type' => Document::TYPE_GOOD_MORAL,
        'status' => Document::STATUS_VERIFIED,
    ]);
    Document::factory()->create([
        'application_id' => $application->id,
        'type' => Document::TYPE_PARENT_CONSENT,
        'status' => Document::STATUS_VERIFIED,
    ]);

    $updatedApplication = $this->workflowService->synchronizeAfterDocumentReview($application);

    expect($updatedApplication->status)->toBe(ScholarshipApplication::STATUS_VERIFIED)
        ->and($updatedApplication->verified_at)->not->toBeNull();
});

it('returns interview-cancelled applications to verified', function () {
    $application = ScholarshipApplication::factory()->create([
        'status' => ScholarshipApplication::STATUS_UNDER_EVALUATION,
    ]);

    $updatedApplication = $this->workflowService->resetAfterInterviewCancellation($application);

    expect($updatedApplication->status)->toBe(ScholarshipApplication::STATUS_VERIFIED);
});
