<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $messageText;
    public $attachmentPaths;

    public function __construct($subject, $message, array $attachmentPaths = [])
    {
        $this->subjectText = $subject;
        $this->messageText = $message;
        $this->attachmentPaths = $attachmentPaths;
    }

    public function build()
    {
        $mail = $this
            ->subject($this->subjectText)
            ->view('emails.newsletter');

        foreach ($this->attachmentPaths as $attachment) {

            $mail->attach(
                $attachment['path'],
                [
                    'as' => $attachment['name'],
                    'mime' => $attachment['mime'],
                ]
            );
        }

        return $mail;
    }
}