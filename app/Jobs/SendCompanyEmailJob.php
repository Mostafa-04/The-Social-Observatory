<?php

namespace App\Jobs;

use App\Mail\CompanyInformationMail;
use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class SendCompanyEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $companyId;
    public string $subject;
    public string $message;
    public array $attachments;
    public string $senderKey;

    public int $tries = 3;
    public int $backoff = 10;

    public function __construct(
        int $companyId,
        string $subject,
        string $message,
        array $attachments = [],
        string $senderKey = 'contact'
    ) {
        $this->companyId = $companyId;
        $this->subject = $subject;
        $this->message = $message;
        $this->attachments = $attachments;
        $this->senderKey = $senderKey;
    }

    public function handle(): void
    {
        $company = Company::find($this->companyId);

        if (!$company || !$company->contact_email) {
            return;
        }

        $sender = config("mail.campaign_senders.{$this->senderKey}");

        if (
            !$sender ||
            empty($sender['mailer']) ||
            empty($sender['address'])
        ) {
            throw new RuntimeException(
                "Configuration de l'expéditeur invalide : {$this->senderKey}"
            );
        }

        $validAttachments = [];

        foreach ($this->attachments as $attachment) {
            if (
                !empty($attachment['path']) &&
                Storage::disk('local')->exists($attachment['path'])
            ) {
                $validAttachments[] = $attachment;
            }
        }

        $mail = new CompanyInformationMail(
            company: $company,
            subject: $this->subject,
            message: $this->message,
            attachments: $validAttachments
        );

        $mail->from(
            $sender['address'],
            $sender['name'] ?? $sender['address']
        );

        Mail::mailer($sender['mailer'])
            ->to($company->contact_email)
            ->send($mail);
    }
}
