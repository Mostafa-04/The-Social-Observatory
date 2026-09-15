<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class IapsSubmissionConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $fullName,
        public string $publicationTitle,
    ) {}

    public function build()
    {
        return $this
            ->subject('Confirmation de votre contribution — IAPS')
            ->view('emails.iaps-submission-confirmation');
    }
}