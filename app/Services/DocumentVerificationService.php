<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use InvalidArgumentException;

class DocumentVerificationService
{
    /**
     * Required documents for each scholarship type based on MinSU requirements
     */
    const REQUIRED_DOCUMENTS = [
        Scholarship::TYPE_ACADEMIC_FULL => [
            Document::TYPE_GRADES => ['verifier_role' => 'osas_staff'],
            Document::TYPE_GOOD_MORAL => ['verifier_role' => 'osas_staff'],
            Document::TYPE_PARENT_CONSENT => ['verifier_role' => 'osas_staff'],
        ],
        Scholarship::TYPE_ACADEMIC_PARTIAL => [
            Document::TYPE_GRADES => ['verifier_role' => 'osas_staff'],
            Document::TYPE_GOOD_MORAL => ['verifier_role' => 'osas_staff'],
            Document::TYPE_PARENT_CONSENT => ['verifier_role' => 'osas_staff'],
        ],
        Scholarship::TYPE_STUDENT_ASSISTANTSHIP => [
            Document::TYPE_GOOD_MORAL => ['verifier_role' => 'osas_staff'],
            Document::TYPE_PARENT_CONSENT => ['verifier_role' => 'osas_staff'],
        ],
        Scholarship::TYPE_PERFORMING_ARTS_FULL => [
            Document::TYPE_GRADES => ['verifier_role' => 'osas_staff'],
            Document::TYPE_RECOMMENDATION => ['verifier_role' => 'osas_staff'],
            Document::TYPE_PARENT_CONSENT => ['verifier_role' => 'osas_staff'],
        ],
        Scholarship::TYPE_PERFORMING_ARTS_PARTIAL => [
            Document::TYPE_GRADES => ['verifier_role' => 'osas_staff'],
            Document::TYPE_RECOMMENDATION => ['verifier_role' => 'osas_staff'],
            Document::TYPE_PARENT_CONSENT => ['verifier_role' => 'osas_staff'],
        ],
        Scholarship::TYPE_ECONOMIC_ASSISTANCE => [
            Document::TYPE_INDIGENCY => ['verifier_role' => 'osas_staff'],
            Document::TYPE_PARENT_CONSENT => ['verifier_role' => 'osas_staff'],
        ],
    ];

    /**
     * Upload and create document record
     */
    public function uploadDocument(
        ScholarshipApplication $application,
        string $documentType,
        UploadedFile $file,
        ?User $uploadedBy = null
    ): Document {
        // Validate document type for scholarship
        $this->validateDocumentType($application->scholarship, $documentType);

        // Validate file
        $this->validateFile($file, $documentType);

        // Store file
        $path = $this->storeFile($file, $application, $documentType);

        // Create document record
        $document = Document::create([
            'application_id' => $application->id,
            'type' => $documentType,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'status' => Document::STATUS_PENDING,
        ]);

        return $document;
    }

    /**
     * Verify a document by authorized verifier
     */
    public function verifyDocument(
        Document $document,
        User $verifier,
        string $status,
        ?string $remarks = null
    ): bool {
        // Check if verifier has authority for this document type
        if (! $this->canVerifyDocument($document, $verifier)) {
            throw new InvalidArgumentException('You are not authorized to verify this document type.');
        }

        // Update document verification
        $document->update([
            'status' => $status,
            'verification_remarks' => $remarks,
            'verified_at' => now(),
            'verified_by' => $verifier->id,
        ]);

        // Check if all required documents are verified
        $this->checkApplicationDocumentCompleteness($document->application);

        return true;
    }

    /**
     * Get required documents for a scholarship type
     */
    public function getRequiredDocuments(string $scholarshipType): array
    {
        return self::REQUIRED_DOCUMENTS[$scholarshipType] ?? [];
    }

    /**
     * Check document completeness for application
     */
    public function checkDocumentCompleteness(ScholarshipApplication $application): array
    {
        $requiredDocs = $this->getRequiredDocuments($application->scholarship->type);
        $uploadedDocs = $application->documents()->get()->keyBy('type');

        $completeness = [
            'complete' => true,
            'required_count' => count($requiredDocs),
            'uploaded_count' => 0,
            'verified_count' => 0,
            'missing_documents' => [],
            'pending_verification' => [],
        ];

        foreach ($requiredDocs as $type => $info) {
            if (! $uploadedDocs->has($type)) {
                $completeness['complete'] = false;
                $completeness['missing_documents'][] = [
                    'type' => $type,
                    'verifier_role' => $info['verifier_role'],
                ];
            } else {
                $completeness['uploaded_count']++;
                $document = $uploadedDocs[$type];

                if ($document->status === Document::STATUS_VERIFIED) {
                    $completeness['verified_count']++;
                } elseif ($document->status === Document::STATUS_PENDING) {
                    $completeness['pending_verification'][] = [
                        'type' => $type,
                        'verifier_role' => $info['verifier_role'],
                    ];
                }
            }
        }

        return $completeness;
    }

    /**
     * Get documents that can be verified by a specific user
     */
    public function getVerifiableDocuments(User $verifier): \Illuminate\Database\Eloquent\Collection
    {
        $verifierRole = $this->getUserVerifierRole($verifier);

        if (! $verifierRole) {
            return collect();
        }

        // Get document types this user can verify
        $verifiableTypes = [];
        foreach (self::REQUIRED_DOCUMENTS as $scholarshipType => $documents) {
            foreach ($documents as $type => $info) {
                if ($info['verifier_role'] === $verifierRole) {
                    $verifiableTypes[] = $type;
                }
            }
        }

        return Document::whereIn('type', $verifiableTypes)
            ->where('status', Document::STATUS_PENDING)
            ->with(['application.scholarship', 'application.user.studentProfile'])
            ->get();
    }

    /**
     * Validate document type for scholarship
     */
    private function validateDocumentType(Scholarship $scholarship, string $documentType): void
    {
        $requiredDocs = $this->getRequiredDocuments($scholarship->type);

        if (! array_key_exists($documentType, $requiredDocs)) {
            throw new InvalidArgumentException("Document type '{$documentType}' is not required for this scholarship.");
        }
    }

    /**
     * Validate uploaded file
     */
    private function validateFile(UploadedFile $file, string $documentType): void
    {
        // Check file size (max 10MB)
        if ($file->getSize() > 10 * 1024 * 1024) {
            throw new InvalidArgumentException('File size must not exceed 10MB.');
        }

        // Check file type
        $allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, $allowedTypes)) {
            throw new InvalidArgumentException('File type not allowed. Allowed types: '.implode(', ', $allowedTypes));
        }

        // Additional validation based on document type
        if (in_array($documentType, ['certification_of_grades', 'good_moral_certificate', 'enrollment_certificate'])) {
            // Official documents should preferably be PDF
            if (! in_array($extension, ['pdf'])) {
                // This is a warning, not an error
                // Could add to a warnings array if needed
            }
        }
    }

    /**
     * Store file in appropriate directory
     */
    private function storeFile(UploadedFile $file, ScholarshipApplication $application, string $documentType): string
    {
        $directory = sprintf(
            'scholarship-documents/%d/%s',
            $application->user_id,
            $application->id
        );

        return $file->store($directory, 'public');
    }

    /**
     * Check if user can verify specific document
     */
    private function canVerifyDocument(Document $document, User $verifier): bool
    {
        $requiredDocs = $this->getRequiredDocuments($document->application->scholarship->type);
        $documentInfo = $requiredDocs[$document->type] ?? null;

        if (! $documentInfo) {
            return false;
        }

        $verifierRole = $this->getUserVerifierRole($verifier);

        return $verifierRole === $documentInfo['verifier_role'];
    }

    /**
     * Get user's verifier role
     */
    private function getUserVerifierRole(User $verifier): ?string
    {
        switch ($verifier->role) {
            case 'admin':
                return 'osas_staff'; // Admins can verify OSAS documents
            case 'osas_staff':
                return 'osas_staff';
            case 'osas_staff':
                return 'osas_staff';
            case 'guidance_counselor':
                return 'guidance_counselor';
            case 'coach_adviser':
                return 'coach_adviser';
            default:
                return null;
        }
    }

    /**
     * Check and update application status based on document completeness
     */
    private function checkApplicationDocumentCompleteness(ScholarshipApplication $application): void
    {
        $completeness = $this->checkDocumentCompleteness($application);

        if ($completeness['complete'] && $completeness['verified_count'] === $completeness['required_count']) {
            // All documents uploaded and verified
            if ($application->status === ScholarshipApplication::STATUS_UNDER_VERIFICATION) {
                $application->update([
                    'status' => ScholarshipApplication::STATUS_VERIFIED,
                    'verified_at' => now(),
                    'current_step' => 'evaluation',
                ]);
            }
        } elseif ($completeness['uploaded_count'] === $completeness['required_count'] &&
                  $completeness['verified_count'] < $completeness['required_count']) {
            // All documents uploaded but not all verified
            if ($application->status === ScholarshipApplication::STATUS_SUBMITTED) {
                $application->update([
                    'status' => ScholarshipApplication::STATUS_UNDER_VERIFICATION,
                    'current_step' => 'document_verification',
                ]);
            }
        } elseif ($completeness['uploaded_count'] < $completeness['required_count']) {
            // Missing documents
            if ($application->status !== ScholarshipApplication::STATUS_INCOMPLETE) {
                $application->update([
                    'status' => ScholarshipApplication::STATUS_INCOMPLETE,
                    'current_step' => 'document_submission',
                ]);
            }
        }
    }
}
