<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PersonMessage extends Mailable
{
    // Noms volontairement uniques : la classe Mailable de Laravel
    // possède déjà des propriétés $html, $subject, $attachments, etc.
    public function __construct(
        public string $mailSubject,
        public string $bodyHtml,
        public array $attachedFiles = [],
        public ?string $contactName = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->mailSubject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.person-message',
            with: [
                'emailSubject' => $this->mailSubject,
                'emailMessage' => $this->bodyHtml,
                'contactName' => $this->contactName,
            ],
        );
    }

    public function attachments(): array
    {
        return collect($this->attachedFiles)
            ->map(fn ($f) => Attachment::fromStorage($f['path'])->as($f['name']))
            ->all();
    }
}