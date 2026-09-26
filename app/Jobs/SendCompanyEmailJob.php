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

class SendCompanyEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $companyId;

    public string $subject;

    public string $message;

    public array $attachments;

    public int $tries = 3;

    public int $backoff = 10;

    public function __construct(
        int $companyId,
        string $subject,
        string $message,
        array $attachments = []
    ) {
        $this->companyId = $companyId;
        $this->subject = $subject;
        $this->message = $message;
        $this->attachments = $attachments;
    }

    public function handle(): void
    {
        $company = Company::find($this->companyId);

        // Le modèle Company n'a plus de colonne "email" :
        // on envoie désormais à l'email de la personne de contact.
        if (!$company || !$company->contact_email) {
            return;
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

        Mail::to($company->contact_email)->send(
            new CompanyInformationMail(
                company: $company,
                subject: $this->subject,
                message: $this->message,
                attachments: $validAttachments
            )
        );
    }
}