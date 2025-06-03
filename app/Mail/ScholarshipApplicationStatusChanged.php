<?php

namespace App\Mail;

use App\Models\ScholarshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ScholarshipApplicationStatusChanged extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public ScholarshipApplication $application;

    public string $previousStatus;

    /**
     * Create a new message instance.
     */
    public function __construct(ScholarshipApplication $application, string $previousStatus)
    {
        $this->application = $application;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $statusMessages = [
            'submitted' => 'Application Submitted - Scholarship Application Update',
            'under_verification' => 'Under Review - Scholarship Application Update',
            'verified' => 'Documents Verified - Scholarship Application Update',
            'under_evaluation' => 'Under Evaluation - Scholarship Application Update',
            'approved' => 'Application Approved - Congratulations!',
            'rejected' => 'Application Status Update',
            'incomplete' => 'Action Required - Scholarship Application',
        ];

        $subject = $statusMessages[$this->application->status] ?? 'Scholarship Application Status Changed';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.scholarship-application-status-changed',
            with: [
                'application' => $this->application,
                'previousStatus' => $this->previousStatus,
                'studentName' => $this->application->student->user->name,
                'scholarshipName' => $this->application->scholarship->name,
                'currentStatus' => $this->application->status,
                'statusMessage' => $this->getStatusMessage(),
                'nextSteps' => $this->getNextSteps(),
                'dashboardUrl' => route('student.dashboard'),
                'applicationUrl' => route('scholarships.applications.status', $this->application),
            ]
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
     * Get status message for the email
     */
    private function getStatusMessage(): string
    {
        $messages = [
            'submitted' => 'Your scholarship application has been successfully submitted and is now under review.',
            'under_verification' => 'OSAS staff is currently reviewing your application and verifying your documents.',
            'verified' => 'Your documents have been verified and your application is moving to the evaluation stage.',
            'under_evaluation' => 'Your application is being evaluated by the scholarship committee.',
            'approved' => 'Congratulations! Your scholarship application has been approved.',
            'rejected' => 'Your scholarship application was not approved at this time.',
            'incomplete' => 'Your application requires additional information or documents.',
        ];

        return $messages[$this->application->status] ?? 'Your application status has been updated.';
    }

    /**
     * Get next steps for the student
     */
    private function getNextSteps(): array
    {
        $nextSteps = [
            'submitted' => [
                'Check your application status regularly',
                'Respond promptly to any requests for additional information',
                'Wait for OSAS staff to review your application',
            ],
            'under_verification' => [
                'No action required at this time',
                'You may be contacted if any documents need clarification',
                'Continue to check your application status',
            ],
            'verified' => [
                'Your application is moving to the evaluation stage',
                'No action required at this time',
                'You may be contacted for an interview if required',
            ],
            'under_evaluation' => [
                'The scholarship committee is reviewing your application',
                'You may be contacted for an interview',
                'Check back regularly for updates',
            ],
            'approved' => [
                'You will be contacted with next steps',
                'Complete any required scholarship agreements',
                'Attend orientation sessions if applicable',
            ],
            'rejected' => [
                'Review feedback if provided',
                'Consider applying for other available scholarships',
                'Contact OSAS if you have questions',
            ],
            'incomplete' => [
                'Review the feedback provided',
                'Upload any missing or corrected documents',
                'Resubmit your application',
            ],
        ];

        return $nextSteps[$this->application->status] ?? [];
    }
}
