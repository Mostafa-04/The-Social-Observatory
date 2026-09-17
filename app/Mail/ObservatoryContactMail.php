<?php

namespace App\Mail;

use App\Models\ObservatoryContact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ObservatoryContactMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private const ALLOWED_TAGS =
        '<p><br><strong><b><em><i><u><s><ul><ol><li><a><h2><h3><blockquote><span>';

    public string $safeMessage;

    public function __construct(
        public ObservatoryContact $contact,
        public string $subjectText,
        string $messageHtml,
        public array $attachmentFiles = []
    ) {
        $this->safeMessage = strip_tags(
            $messageHtml,
            self::ALLOWED_TAGS
        );
    }

    public function build()
    {
        $mail = $this
            ->subject($this->subjectText)
            ->view('emails.observatory-contact');

        foreach ($this->attachmentFiles as $file) {

            $path = $file['stored_path'];

            if (!Storage::exists($path)) {
                continue;
            }

            $mail->attach(
                Storage::path($path),
                [
                    'as' => $file['name'],
                    'mime' => $file['mime'],
                ]
            );
        }

        return $mail;
    }
}