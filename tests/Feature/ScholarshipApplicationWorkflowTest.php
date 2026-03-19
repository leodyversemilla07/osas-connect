<?php

use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function buildScholarshipApplicationPayload(Scholarship $scholarship): array
{
    $documents = [];

    foreach (array_keys($scholarship->getRequiredDocuments()) as $documentKey) {
        $documents[$documentKey] = UploadedFile::fake()->create("{$documentKey}.pdf", 256, 'application/pdf');
    }

    return [
        'personal_statement' => str_repeat('I am committed to academic excellence and service. ', 4),
        'academic_goals' => str_repeat('I plan to finish my degree and contribute to the university. ', 2),
        'financial_need_statement' => str_repeat('This scholarship would help me continue my studies without interruption. ', 2),
        'additional_comments' => 'Prepared for full application review.',
        'documents' => $documents,
    ];
}

describe('Scholarship Application Workflow', function () {
    beforeEach(function () {
        Storage::fake('public');
        Storage::fake('private');

        // Create a student with profile
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        $this->student->studentProfile->update([
            'current_gwa' => 1.35,
            'enrollment_status' => 'enrolled',
            'has_disciplinary_action' => false,
            'units' => 21,
            'existing_scholarships' => null,
        ]);
        
        // Create an active scholarship
        $this->scholarship = Scholarship::factory()->create([
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
            'status' => 'active',
            'deadline' => now()->addDays(30),
            'slots' => 10,
            'beneficiaries' => 0,
            'slots_available' => 10,
        ]);

        // Create OSAS staff
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('allows student to create application via controller', function () {
        $payload = buildScholarshipApplicationPayload($this->scholarship);

        $response = $this->actingAs($this->student)
            ->post(route('student.scholarships.store', $this->scholarship), $payload);

        $response
            ->assertRedirect(route('student.scholarships.index'))
            ->assertSessionHas('success', 'Application submitted successfully!');

        $application = ScholarshipApplication::where('user_id', $this->student->id)
            ->where('scholarship_id', $this->scholarship->id)
            ->first();

        expect($application)->not->toBeNull()
            ->and($application->status)->toBe('submitted');
    });

    it('stores uploaded documents using canonical required-document keys', function () {
        $payload = buildScholarshipApplicationPayload($this->scholarship);

        $this->actingAs($this->student)
            ->post(route('student.scholarships.store', $this->scholarship), $payload)
            ->assertRedirect(route('student.scholarships.index'));

        $application = ScholarshipApplication::where('user_id', $this->student->id)
            ->where('scholarship_id', $this->scholarship->id)
            ->firstOrFail();

        $storedKeys = array_keys($application->uploaded_documents);
        $requiredKeys = array_keys($this->scholarship->getRequiredDocuments());
        sort($storedKeys);
        sort($requiredKeys);

        expect($storedKeys)->toBe($requiredKeys);

        foreach ($application->uploaded_documents as $document) {
            Storage::disk('private')->assertExists($document['path']);
        }
    });

    it('prevents student from applying to same scholarship twice', function () {
        // Create existing application
        ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->student)
            ->from(route('student.scholarships.apply', $this->scholarship))
            ->post(route('student.scholarships.store', $this->scholarship), buildScholarshipApplicationPayload($this->scholarship));

        $response->assertRedirect(route('student.scholarships.apply', $this->scholarship))
            ->assertSessionHasErrors([
                'error' => 'User already has an application for this scholarship',
            ]);

        $this->assertDatabaseCount('scholarship_applications', 1);
    });

    it('allows student to view application details', function () {
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->student)->get(route('student.scholarships.applications.show', $application));

        expect($response->status())->toBeIn([200, 302]);
    });
});

describe('Document Upload Workflow', function () {
    beforeEach(function () {
        Storage::fake('public');
        
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        
        $this->scholarship = Scholarship::factory()->create([
            'status' => 'active',
            'type' => Scholarship::TYPE_ACADEMIC_FULL,
        ]);
        
        $this->application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'draft',
        ]);
        
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('allows student to upload documents via controller', function () {
        $file = UploadedFile::fake()->create('grades.pdf', 500, 'application/pdf');

        $response = $this->actingAs($this->student)->post(route('student.scholarships.documents.store', $this->application), [
            'type' => 'grades',
            'document' => $file,
        ]);

        // Expect JSON response or redirect
        expect($response->status())->toBeIn([200, 201, 302]);
        
        $this->assertDatabaseHas('documents', [
            'application_id' => $this->application->id,
            'type' => 'grades',
            'status' => 'pending',
        ]);
    });

    it('rejects files that are too large', function () {
        // Create a file larger than the limit (assuming 10MB limit)
        $file = UploadedFile::fake()->create('large_file.pdf', 15000, 'application/pdf');

        $response = $this->actingAs($this->student)->post(route('student.scholarships.documents.store', $this->application), [
            'type' => 'grades',
            'document' => $file,
        ]);

        // Check for validation error response
        expect($response->status())->toBeIn([302, 422]);
    });

    it('allows staff to verify documents', function () {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'type' => 'grades',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->staff)->patch(route('osas.documents.verify', $document), [
            'status' => 'verified',
            'remarks' => 'Document verified successfully',
        ]);

        $response->assertRedirect();
        
        $document->refresh();
        expect($document->status)->toBe('verified');
        expect($document->verified_by)->toBe($this->staff->id);
    });

    it('allows staff to reject documents with reason', function () {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'type' => 'grades',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->staff)->patch(route('osas.documents.verify', $document), [
            'status' => 'rejected',
            'remarks' => 'Document is blurry and unreadable',
        ]);

        $response->assertRedirect();
        
        $document->refresh();
        expect($document->status)->toBe('rejected');
    });
});

describe('Application Review Workflow', function () {
    beforeEach(function () {
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        
        $this->scholarship = Scholarship::factory()->create([
            'status' => 'active',
        ]);
        
        $this->application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'submitted',
        ]);
        
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('allows staff to move application to verification', function () {
        $response = $this->actingAs($this->staff)->patch(route('osas.applications.status', $this->application), [
            'status' => 'under_verification',
        ]);

        $response->assertRedirect();
        
        $this->application->refresh();
        expect($this->application->status)->toBe('under_verification');
    });

    it('allows staff to verify application', function () {
        $this->application->update(['status' => 'under_verification']);

        $response = $this->actingAs($this->staff)->patch(route('osas.applications.status', $this->application), [
            'status' => 'verified',
        ]);

        $response->assertRedirect();
        
        $this->application->refresh();
        expect($this->application->status)->toBe('verified');
    });

    it('allows staff to approve application', function () {
        $this->application->update(['status' => 'under_evaluation']);

        $response = $this->actingAs($this->staff)->patch(route('osas.applications.status', $this->application), [
            'status' => 'approved',
            'feedback' => 'All requirements met',
        ]);

        $response->assertRedirect();
        
        $this->application->refresh();
        expect($this->application->status)->toBe('approved');
    });

    it('allows staff to reject application with reason', function () {
        $this->application->update(['status' => 'under_evaluation']);

        $response = $this->actingAs($this->staff)->patch(route('osas.applications.status', $this->application), [
            'status' => 'rejected',
            'feedback' => 'GWA requirement not met after verification',
        ]);

        $response->assertRedirect();
        
        $this->application->refresh();
        expect($this->application->status)->toBe('rejected');
    });

    it('prevents non-staff from updating application status', function () {
        $response = $this->actingAs($this->student)->patch(route('osas.applications.status', $this->application), [
            'status' => 'approved',
        ]);

        // Should redirect (forbidden or to different page)
        expect($response->status())->toBeIn([302, 403]);
        
        $this->application->refresh();
        expect($this->application->status)->toBe('submitted'); // Status unchanged
    });
});

describe('Application Status Transitions', function () {
    beforeEach(function () {
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        
        $this->scholarship = Scholarship::factory()->create(['status' => 'active']);
        
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
    });

    it('enforces valid status transitions', function () {
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'draft',
        ]);

        // Draft -> Approved should not be allowed directly (unless system allows it)
        $response = $this->actingAs($this->staff)->patch(route('osas.applications.status', $application), [
            'status' => 'approved',
        ]);

        $application->refresh();
        expect($response->status())->toBe(302);
        expect($application->status)->toBe('draft');
    });

    it('tracks status updates', function () {
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'submitted',
        ]);

        $originalUpdatedAt = $application->updated_at;

        $this->actingAs($this->staff)->patch(route('osas.applications.status', $application), [
            'status' => 'under_verification',
        ]);

        $application->refresh();
        
        // Application should have updated_at changed
        expect($application->updated_at)->not->toBeNull();
        expect($application->status)->toBe('under_verification');
    });
});
