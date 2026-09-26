<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GroupRegistrationMessage extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<int, string>  $attachmentPaths  Chemins (disk "local") des pièces jointes.
     */
    public function __construct(
        public string $recipientName,
        public string $subjectLine,
        public string $htmlMessage,
        public array $attachmentPaths = []
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.group-registration-message',
            with: [
                'recipientName' => $this->recipientName,
                'subjectLine' => $this->subjectLine,
                'body' => $this->htmlMessage,
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return collect($this->attachmentPaths)
            ->map(fn (string $path) => Attachment::fromStorageDisk('local', $path))
            ->all();
    }
}