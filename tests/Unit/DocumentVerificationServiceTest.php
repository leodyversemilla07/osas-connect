<?php

use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use App\Services\DocumentVerificationService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('DocumentVerificationService', function () {
    beforeEach(function () {
        Storage::fake('public');
        $this->documentService = new DocumentVerificationService;
    });

    test('uploads document successfully', function () {
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $file = UploadedFile::fake()->create('grades.pdf', 100, 'application/pdf');

        $document = $this->documentService->uploadDocument(
            $application,
            Document::TYPE_GRADES,
            $file
        );

        expect($document)->toBeInstanceOf(Document::class);
        expect($document->application_id)->toBe($application->id);
        expect($document->type)->toBe(Document::TYPE_GRADES);
        expect($document->status)->toBe(Document::STATUS_PENDING);
        expect($document->original_name)->toBe('grades.pdf');

        expect(Storage::disk('public')->exists($document->file_path))->toBeTrue();
    });

    test('validates document type for scholarship', function () {
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        expect(function () use ($application, $file) {
            $this->documentService->uploadDocument(
                $application,
                'invalid_document_type',
                $file
            );
        })->toThrow(InvalidArgumentException::class);
    });

    test('validates file size limit', function () {
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
        ]);

        // Create a file larger than 10MB
        $file = UploadedFile::fake()->create('large.pdf', 11000, 'application/pdf');

        expect(function () use ($application, $file) {
            $this->documentService->uploadDocument(
                $application,
                Document::TYPE_GRADES,
                $file
            );
        })->toThrow(InvalidArgumentException::class, 'File size must not exceed 10MB');
    });

    test('validates file type', function () {
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $file = UploadedFile::fake()->create('document.exe', 100, 'application/exe');

        expect(function () use ($application, $file) {
            $this->documentService->uploadDocument(
                $application,
                Document::TYPE_GRADES,
                $file
            );
        })->toThrow(InvalidArgumentException::class);
    });

    test('verifies document by authorized user', function () {
        $osas_staff = User::factory()->create(['role' => 'osas_staff']);
        $student = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $document = Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GRADES,
            'status' => Document::STATUS_PENDING,
        ]);

        $result = $this->documentService->verifyDocument(
            $document,
            $osas_staff,
            Document::STATUS_VERIFIED,
            'Grades verified'
        );

        expect($result)->toBeTrue();

        $document->refresh();
        expect($document->status)->toBe(Document::STATUS_VERIFIED);
        expect($document->verified_by)->toBe($osas_staff->id);
        expect($document->verification_remarks)->toBe('Grades verified');
        expect($document->verified_at)->not->toBeNull();
    });

    test('prevents unauthorized document verification', function () {
        $student = User::factory()->create(['role' => 'student']);
        $anotherStudent = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $student->id,
            'scholarship_id' => $scholarship->id,
        ]);

        $document = Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GRADES,
            'status' => Document::STATUS_PENDING,
        ]);

        expect(function () use ($document, $anotherStudent) {
            $this->documentService->verifyDocument(
                $document,
                $anotherStudent,
                Document::STATUS_VERIFIED
            );
        })->toThrow(InvalidArgumentException::class, 'You are not authorized to verify this document type');
    });

    test('gets required documents for scholarship type', function () {
        $requiredDocs = $this->documentService->getRequiredDocuments(Scholarship::TYPE_ACADEMIC_FULL);

        expect($requiredDocs)->toHaveKey(Document::TYPE_GRADES);
        expect($requiredDocs)->toHaveKey(Document::TYPE_GOOD_MORAL);
        expect($requiredDocs)->toHaveKey(Document::TYPE_PARENT_CONSENT);

        expect($requiredDocs[Document::TYPE_GRADES]['verifier_role'])->toBe('osas_staff');
    });

    test('checks document completeness correctly', function () {
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
        ]);

        // Create some documents
        Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GRADES,
            'status' => Document::STATUS_VERIFIED,
        ]);

        Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GOOD_MORAL,
            'status' => Document::STATUS_PENDING,
        ]);

        // Missing: parent consent

        $completeness = $this->documentService->checkDocumentCompleteness($application);

        expect($completeness['complete'])->toBeFalse();
        expect($completeness['uploaded_count'])->toBe(2);
        expect($completeness['verified_count'])->toBe(1);
        expect($completeness['missing_documents'])->toHaveCount(1);
        expect($completeness['missing_documents'][0]['type'])->toBe(Document::TYPE_PARENT_CONSENT);
        expect($completeness['pending_verification'])->toHaveCount(1);
    });

    test('gets verifiable documents for osas_staff', function () {
        $osas_staff = User::factory()->create(['role' => 'osas_staff']);
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
        ]);

        // Create documents that osas_staff can verify
        Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GRADES,
            'status' => Document::STATUS_PENDING,
        ]);

        Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_PARENT_CONSENT,
            'status' => Document::STATUS_PENDING,
        ]);

        // Create document that osas_staff can verify
        Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GOOD_MORAL,
            'status' => Document::STATUS_PENDING,
        ]);

        $verifiableDocuments = $this->documentService->getVerifiableDocuments($osas_staff);

        expect($verifiableDocuments->count())->toBe(3);
        expect($verifiableDocuments->pluck('type')->toArray())
            ->toContain(Document::TYPE_GRADES)
            ->toContain(Document::TYPE_PARENT_CONSENT)
            ->toContain(Document::TYPE_GOOD_MORAL);
    });

    test('updates application status when all documents verified', function () {
        $osas_staff = User::factory()->create(['role' => 'osas_staff']);
        $user = User::factory()->create(['role' => 'student']);
        $scholarship = Scholarship::factory()->create(['type' => Scholarship::TYPE_ACADEMIC_FULL]);
        $application = ScholarshipApplication::factory()->create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarship->id,
            'status' => ScholarshipApplication::STATUS_UNDER_VERIFICATION,
        ]);

        // Create all required documents
        $gradesDoc = Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GRADES,
            'status' => Document::STATUS_VERIFIED,
        ]);

        $moralDoc = Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_GOOD_MORAL,
            'status' => Document::STATUS_VERIFIED,
        ]);

        $consentDoc = Document::factory()->create([
            'application_id' => $application->id,
            'type' => Document::TYPE_PARENT_CONSENT,
            'status' => Document::STATUS_PENDING,
        ]);

        // Verify the last document
        $this->documentService->verifyDocument(
            $consentDoc,
            $osas_staff,
            Document::STATUS_VERIFIED
        );

        $application->refresh();
        expect($application->status)->toBe(ScholarshipApplication::STATUS_VERIFIED);
        expect($application->verified_at)->not->toBeNull();
        expect($application->current_step)->toBe('evaluation');
    });
});
