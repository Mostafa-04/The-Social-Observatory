<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CompanyInformationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Company $company;

    public string $subjectText;

    public string $messageContent;

    public array $emailAttachments;

    public function __construct(
        Company $company,
        string $subject,
        string $message,
        array $attachments = []
    ) {
        $this->company = $company;
        $this->subjectText = $subject;
        $this->messageContent = $message;
        $this->emailAttachments = $attachments;
    }

    public function build()
    {
        $mail = $this
            ->subject($this->subjectText)
            ->view('emails.companies.information');

        foreach ($this->emailAttachments as $attachment) {
            if (
                empty($attachment['path']) ||
                !Storage::disk('local')->exists($attachment['path'])
            ) {
                continue;
            }

            $mail->attach(
                Storage::disk('local')->path($attachment['path']),
                [
                    'as' => $attachment['name'],
                    'mime' => $attachment['mime'],
                ]
            );
        }

        return $mail;
    }
}
