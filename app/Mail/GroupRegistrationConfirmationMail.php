<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GroupRegistrationConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $fullName,
        public string $groupType,
    ) {}

    public function build()
    {
        return $this
            ->subject('Confirmation de votre inscription — The Social Observatory')
            ->view('emails.group-registration-confirmation');
    }
}
