<?php

namespace App\Mail;

use App\Models\EventRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventRegistrationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public EventRegistration $registration
    ) {}

    public function build()
    {
        return $this
            ->subject(
                'Confirmation de votre inscription - '
                . $this->registration->event->title
            )
            ->view('emails.event-registration-confirmation');
    }
}