<?php

namespace App\Mail;

use App\Models\ScholarshipStipend;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StipendReleasedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public ScholarshipStipend $stipend
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Stipend Released - Scholarship Payment Notification',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.stipend-released',
            with: [
                'stipend' => $this->stipend,
                'studentName' => $this->stipend->application->student->name ?? 'Student',
                'scholarshipName' => $this->stipend->application->scholarship->name,
                'amount' => number_format($this->stipend->amount, 2),
                'semester' => ucfirst(str_replace('_', ' ', $this->stipend->semester)),
                'academicYear' => $this->stipend->academic_year,
                'releaseDate' => $this->stipend->updated_at->format('F j, Y'),
                'fundSource' => $this->stipend->fund_source ?? 'Special Trust Fund',
                'dashboardUrl' => url('/dashboard'),
                'applicationUrl' => url('/applications/'.$this->stipend->application_id),
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
