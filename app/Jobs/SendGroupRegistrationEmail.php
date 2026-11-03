<?php

namespace App\Jobs;

use App\Mail\GroupRegistrationMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class SendGroupRegistrationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = 30;

    /**
     * @param array<int, string> $attachmentPaths
     */
    public function __construct(
        public string $recipientEmail,
        public string $recipientName,
        public string $subjectLine,
        public string $htmlMessage,
        public array $attachmentPaths = [],
        public string $senderKey = 'contact',
    ) {}

    public function handle(): void
    {
        $sender = config(
            "mail.campaign_senders.{$this->senderKey}"
        );

        if (
            !$sender ||
            empty($sender['mailer']) ||
            empty($sender['address'])
        ) {
            throw new RuntimeException(
                "La configuration de l'expéditeur est invalide."
            );
        }

        $mail = new GroupRegistrationMessage(
            recipientName: $this->recipientName,
            subjectLine: $this->subjectLine,
            htmlMessage: $this->htmlMessage,
            attachmentPaths: $this->attachmentPaths,
        );

        // Définir l'adresse et le nom de l'expéditeur sélectionné.
        $mail->from(
            $sender['address'],
            $sender['name']
        );

        // Utiliser le compte SMTP correspondant.
        Mail::mailer($sender['mailer'])
            ->to($this->recipientEmail)
            ->send($mail);
    }
}