<?php

namespace App\Mail;

use App\Models\Interview;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InterviewScheduledMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Interview $interview
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Interview Scheduled - Scholarship Application',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.interview-scheduled',
            with: [
                'interview' => $this->interview,
                'studentName' => $this->interview->application->student->name ?? 'Student',
                'scholarshipName' => $this->interview->application->scholarship->name,
                'scheduledDate' => $this->interview->scheduled_at->format('F j, Y'),
                'scheduledTime' => $this->interview->scheduled_at->format('g:i A'),
                'location' => $this->interview->location ?? 'TBA',
                'interviewerName' => $this->interview->interviewer->name ?? 'OSAS Staff',
                'dashboardUrl' => url('/dashboard'),
                'applicationUrl' => url('/applications/'.$this->interview->application_id),
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
}
