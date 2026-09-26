<?php

namespace App\Jobs;

use App\Mail\IapsBulkMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

/** Envoie l'email à UN destinataire (3 tentatives avec délai croissant). */
class SendIapsEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 3;

    public array $backoff = [60, 300];

    public int $timeout = 120;

    public function __construct(
        public string $email,
        public ?string $name,
        public string $dir,
    ) {
        $this->onQueue('emails');
    }

    public function handle(): void
    {
        $campaign = json_decode(
            Storage::disk('local')->get("{$this->dir}/campaign.json"),
            true
        );

        Mail::to($this->email)->send(new IapsBulkMail(
            $campaign['subject'],
            $campaign['message'],
            $this->name,
            $campaign['attachments'] ?? []
        ));
    }

    public function failed(Throwable $e): void
    {
        Log::warning("Échec de l'envoi à {$this->email} : {$e->getMessage()}");
    }
}