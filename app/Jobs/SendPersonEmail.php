<?php

namespace App\Jobs;

use App\Mail\PersonMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPersonEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public string $email,
        public string $subject,
        public string $html,
        public array $attachments = [],
    ) {}

    public function handle(): void
    {
        Mail::to($this->email)->send(
            new PersonMessage($this->subject, $this->html, $this->attachments)
        );
    }
}