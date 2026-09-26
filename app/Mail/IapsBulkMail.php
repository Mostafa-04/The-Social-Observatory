<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Facades\Storage;

/**
 * N'implémente PAS ShouldQueue : c'est déjà SendIapsEmailJob qui est en file.
 */
class IapsBulkMail extends Mailable
{
    public function __construct(
        public string $subjectLine,
        public string $htmlMessage,
        public ?string $recipientName = null,
        public array $files = [],
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->subjectLine);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bulk-message',
            with: [
                'subjectLine'   => $this->subjectLine,
                'htmlMessage'   => $this->htmlMessage,
                'recipientName' => $this->recipientName,
            ],
        );
    }

    public function attachments(): array
    {
        $attachments = [];

        foreach ($this->files as $file) {
            if (! Storage::disk('local')->exists($file['path'])) {
                continue;
            }

            $attachments[] = Attachment::fromStorageDisk('local', $file['path'])
                ->as($file['name'])
                ->withMime($file['mime'] ?? 'application/octet-stream');
        }

        return $attachments;
    }
}