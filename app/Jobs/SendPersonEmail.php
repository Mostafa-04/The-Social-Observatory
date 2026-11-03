<?php

namespace App\Jobs;

use App\Mail\PersonMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class SendPersonEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public string $email,
        public string $subject,
        public string $html,
        public array $attachments = [],
        public string $senderKey = 'contact',
    ) {}

    public function handle(): void
    {
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

        $mail = new PersonMessage(
            $this->subject,
            $this->html,
            $this->attachments
        );

        $mail->from(
            $sender['address'],
            $sender['name'] ?? $sender['address']
        );

        Mail::mailer($sender['mailer'])
            ->to($this->email)
            ->send($mail);
    }
}
