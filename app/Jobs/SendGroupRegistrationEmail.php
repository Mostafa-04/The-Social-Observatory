<?php

namespace App\Jobs;

use App\Mail\GroupRegistrationMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendGroupRegistrationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = 30;

    /**
     * @param  array<int, string>  $attachmentPaths  Chemins (disk "local") des pièces jointes partagées par l'envoi groupé.
     */
    public function __construct(
        public string $recipientEmail,
        public string $recipientName,
        public string $subjectLine,
        public string $htmlMessage,
        public array $attachmentPaths = []
    ) {}

    public function handle(): void
    {
        Mail::to($this->recipientEmail)->send(
            new GroupRegistrationMessage(
                recipientName: $this->recipientName,
                subjectLine: $this->subjectLine,
                htmlMessage: $this->htmlMessage,
                attachmentPaths: $this->attachmentPaths,
            )
        );
    }
}