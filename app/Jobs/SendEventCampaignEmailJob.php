<?php

namespace App\Jobs;

use App\Models\EventEmailLog;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEventCampaignEmailJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = 30;

    public function __construct(
        public int $logId,
        public string $subject,
        public string $content,
        public array $attachmentPaths = [],
    ) {}

    public function middleware(): array
    {
        return [
            new RateLimited('email-campaign'),
        ];
    }

    public function handle(): void
    {
        // Vérifier si le batch a été annulé
        if ($this->batch()?->cancelled()) {
            return;
        }

        $log = EventEmailLog::find($this->logId);

        if (!$log) {
            return;
        }

        try {
            Mail::html(
                $this->content,
                function ($message) use ($log) {
                    $message
                        ->to($log->email)
                        ->subject($this->subject);

                    foreach ($this->attachmentPaths as $attachment) {
                        $message->attach(
                            $attachment['path'],
                            [
                                'as' => $attachment['name'],
                                'mime' => $attachment['mime'],
                            ]
                        );
                    }
                }
            );

            $log->update([
                'status' => 'sent',
                'sent_at' => now(),
                'error' => null,
            ]);

        } catch (\Throwable $e) {
            $log->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}