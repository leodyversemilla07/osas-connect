<?php

use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('DocumentController Store', function () {
    beforeEach(function () {
        Storage::fake('public');
        
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        $this->scholarship = Scholarship::factory()->create(['status' => 'active']);
        $this->application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'draft',
        ]);
    });

    it('allows student to upload document to their application', function () {
        $file = UploadedFile::fake()->create('transcript.pdf', 500, 'application/pdf');

        $response = $this->actingAs($this->student)->post(
            route('student.scholarships.documents.store', $this->application),
            [
                'document' => $file,
                'type' => 'transcripts',
            ]
        );

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('documents', [
            'application_id' => $this->application->id,
            'type' => 'transcripts',
            'status' => 'pending',
        ]);
    });

    it('validates document type', function () {
        $file = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this->actingAs($this->student)->post(
            route('student.scholarships.documents.store', $this->application),
            [
                'document' => $file,
                'type' => 'invalid_type',
            ]
        );

        $response->assertSessionHasErrors('type');
    });

    it('validates file size limit', function () {
        // Create file larger than 10MB limit
        $file = UploadedFile::fake()->create('large.pdf', 15000, 'application/pdf');

        $response = $this->actingAs($this->student)->post(
            route('student.scholarships.documents.store', $this->application),
            [
                'document' => $file,
                'type' => 'transcripts',
            ]
        );

        $response->assertSessionHasErrors('document');
    });

    it('rejects files with disallowed mime type', function () {
        $file = UploadedFile::fake()->create('document.pdf', 500, 'application/x-msdownload');

        $response = $this->actingAs($this->student)->post(
            route('student.scholarships.documents.store', $this->application),
            [
                'document' => $file,
                'type' => 'transcripts',
            ]
        );

        $response->assertSessionHasErrors('document');
    });

    it('prevents other students from uploading to application', function () {
        $otherStudent = User::factory()->withProfile()->create(['role' => 'student']);
        $file = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this->actingAs($otherStudent)->post(
            route('student.scholarships.documents.store', $this->application),
            [
                'document' => $file,
                'type' => 'transcripts',
            ]
        );

        $response->assertStatus(403);
    });

    it('accepts all valid document types', function () {
        $validTypes = ['transcripts', 'recommendation_letter', 'financial_statement', 'grades', 'indigency', 'good_moral', 'parent_consent', 'recommendation'];
        
        foreach ($validTypes as $type) {
            $file = UploadedFile::fake()->create("doc_{$type}.pdf", 500, 'application/pdf');

            $response = $this->actingAs($this->student)->post(
                route('student.scholarships.documents.store', $this->application),
                [
                    'document' => $file,
                    'type' => $type,
                ]
            );

            expect($response->status())->toBe(200);
        }
    });

    it('rate limits repeated document uploads', function () {
        $lastResponse = null;

        for ($i = 0; $i < 11; $i++) {
            $file = UploadedFile::fake()->create("doc_{$i}.pdf", 500, 'application/pdf');

            $lastResponse = $this->actingAs($this->student)->post(
                route('student.scholarships.documents.store', $this->application),
                [
                    'document' => $file,
                    'type' => 'transcripts',
                ]
            );
        }

        expect($lastResponse)->not->toBeNull();
        $lastResponse->assertStatus(429);
    });
});

describe('Document Verification by Staff', function () {
    beforeEach(function () {
        Storage::fake('public');
        
        $this->staff = User::factory()->create(['role' => 'osas_staff']);
        $this->student = User::factory()->withProfile()->create(['role' => 'student']);
        $this->scholarship = Scholarship::factory()->create(['status' => 'active']);
        $this->application = ScholarshipApplication::factory()->create([
            'user_id' => $this->student->id,
            'scholarship_id' => $this->scholarship->id,
            'status' => 'submitted',
        ]);
        $this->document = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
    });

    it('allows staff to verify document', function () {
        $response = $this->actingAs($this->staff)->patch(
            route('osas.documents.verify', $this->document),
            [
                'status' => 'verified',
                'remarks' => 'Document looks good',
            ]
        );

        $response->assertRedirect();

        $this->document->refresh();
        expect($this->document->status)->toBe('verified');
        expect($this->document->verified_by)->toBe($this->staff->id);
    });

    it('allows staff to reject document with remarks', function () {
        $response = $this->actingAs($this->staff)->patch(
            route('osas.documents.verify', $this->document),
            [
                'status' => 'rejected',
                'remarks' => 'Document is blurry',
            ]
        );

        $response->assertRedirect();

        $this->document->refresh();
        expect($this->document->status)->toBe('rejected');
        expect($this->document->verification_remarks)->toBe('Document is blurry');
    });

    it('prevents students from verifying documents', function () {
        $response = $this->actingAs($this->student)->patch(
            route('osas.documents.verify', $this->document),
            [
                'status' => 'verified',
            ]
        );

        // Should be forbidden or redirected
        expect($response->status())->toBeIn([302, 403]);
    });
});
