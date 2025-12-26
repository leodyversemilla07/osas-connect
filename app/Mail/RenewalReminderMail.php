<?php

namespace App\Mail;

use App\Models\ScholarshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RenewalReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public ScholarshipApplication $application,
        public int $daysUntilDeadline
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Scholarship Renewal Reminder - Action Required',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.renewal-reminder',
            with: [
                'application' => $this->application,
                'studentName' => $this->application->student->name ?? 'Student',
                'scholarshipName' => $this->application->scholarship->name,
                'daysUntilDeadline' => $this->daysUntilDeadline,
                'currentSemester' => ucfirst(str_replace('_', ' ', $this->application->semester)),
                'academicYear' => $this->application->academic_year,
                'urgencyLevel' => $this->getUrgencyLevel(),
                'renewalUrl' => url('/scholarships/'.$this->application->scholarship_id.'/renew'),
                'dashboardUrl' => url('/dashboard'),
                'applicationUrl' => url('/applications/'.$this->application->id),
                'requiredDocuments' => $this->getRequiredDocuments(),
                'eligibilityRequirements' => $this->getEligibilityRequirements(),
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
     * Get urgency level based on days until deadline
     */
    private function getUrgencyLevel(): string
    {
        return match (true) {
            $this->daysUntilDeadline <= 3 => 'urgent',
            $this->daysUntilDeadline <= 7 => 'high',
            $this->daysUntilDeadline <= 14 => 'medium',
            default => 'low',
        };
    }

    /**
     * Get required documents for renewal
     */
    private function getRequiredDocuments(): array
    {
        $scholarshipType = $this->application->scholarship->type;

        $baseDocuments = [
            'Updated Certificate of Grades (COG)',
            'Proof of Enrollment for Current Semester',
        ];

        $typeSpecificDocuments = match ($scholarshipType) {
            'academic_full', 'academic_partial' => [
                'Certificate of Good Moral Character',
                'No Failing/Dropped/Deferred Grades Certification',
            ],
            'economic_assistance' => [
                'Updated MSWDO Certificate of Indigency',
                'Certificate of Good Moral Character',
            ],
            'student_assistantship' => [
                'Supervisor Performance Evaluation',
                'Work Completion Certificate',
            ],
            'performing_arts_full', 'performing_arts_partial' => [
                'Group Membership Certificate',
                'Performance Participation Record',
                'Coach/Adviser Recommendation Letter',
            ],
            default => [],
        };

        return array_merge($baseDocuments, $typeSpecificDocuments);
    }

    /**
     * Get eligibility requirements for renewal
     */
    private function getEligibilityRequirements(): array
    {
        $scholarshipType = $this->application->scholarship->type;

        return match ($scholarshipType) {
            'academic_full' => [
                'Maintain GWA of 1.000-1.450 (President\'s Lister)',
                'No grades below 1.75',
                'Enrolled in at least 18 units',
                'No failing, dropped, or deferred marks',
            ],
            'academic_partial' => [
                'Maintain GWA of 1.460-1.750 (Dean\'s Lister)',
                'No grades below 1.75',
                'Enrolled in at least 18 units',
                'No failing, dropped, or deferred marks',
            ],
            'economic_assistance' => [
                'Maintain GWA of 2.25 or better',
                'Valid MSWDO Certificate of Indigency',
                'Good moral character',
            ],
            'student_assistantship' => [
                'Satisfactory work performance',
                'Maximum of 21 units enrollment',
                'Good moral character',
            ],
            'performing_arts_full', 'performing_arts_partial' => [
                'Active group membership (1 year for full, 1 semester for partial)',
                'Regular performance participation',
                'Coach/Adviser recommendation',
            ],
            default => [
                'Maintain scholarship requirements',
                'Submit all required documents',
                'Good academic standing',
            ],
        };
    }
}
