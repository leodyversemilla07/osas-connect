<?php

namespace App\Mail;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DocumentVerificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Document $document
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->document->verification_status === 'verified'
            ? 'Document Verified - Scholarship Application'
            : 'Document Verification Update - Scholarship Application';

        return new Envelope(subject: $subject);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.document-verification',
            with: [
                'document' => $this->document,
                'studentName' => $this->document->application->student->name ?? 'Student',
                'scholarshipName' => $this->document->application->scholarship->name,
                'documentType' => ucfirst(str_replace('_', ' ', $this->document->type)),
                'verificationStatus' => ucfirst($this->document->verification_status),
                'verificationNotes' => $this->document->verification_notes,
                'verifiedBy' => $this->document->verifiedBy?->name ?? 'OSAS Staff',
                'verifiedAt' => $this->document->verified_at?->format('F j, Y g:i A'),
                'statusMessage' => $this->getStatusMessage(),
                'nextSteps' => $this->getNextSteps(),
                'dashboardUrl' => url('/dashboard'),
                'applicationUrl' => url('/applications/'.$this->document->application_id),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Get status message based on verification status
     */
    private function getStatusMessage(): string
    {
        return match ($this->document->verification_status) {
            'verified' => 'Your document has been successfully verified by our staff.',
            'rejected' => 'Your document did not meet the requirements and needs to be resubmitted.',
            'pending' => 'Your document is currently under review by our staff.',
            default => 'Your document status has been updated.',
        };
    }

    /**
     * Get next steps for the student
     */
    private function getNextSteps(): string
    {
        return match ($this->document->verification_status) {
            'verified' => 'No action needed. Your application will proceed to the next stage.',
            'rejected' => 'Please resubmit the document with the correct information. Check the verification notes for details.',
            'pending' => 'Please wait while we review your document. You will be notified once verification is complete.',
            default => 'Check your application dashboard for more information.',
        };
    }
}
