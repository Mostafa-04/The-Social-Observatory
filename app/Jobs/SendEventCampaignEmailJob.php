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
use RuntimeException;

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
        public string $senderKey = 'contact',
    ) {}

    public function middleware(): array
    {
        return [
            new RateLimited('email-campaign'),
        ];
    }

    public function handle(): void
    {
        // Check if the batch was cancelled.
        if ($this->batch()?->cancelled()) {
            return;
        }

        $log = EventEmailLog::find($this->logId);

        if (!$log) {
            return;
        }

        try {

            /*
            |--------------------------------------------------------------------------
            | Get selected sender configuration
            |--------------------------------------------------------------------------
            */

            $sender = config(
                "mail.campaign_senders.{$this->senderKey}"
            );

            if (!$sender) {
                throw new RuntimeException(
                    'Invalid email sender configuration.'
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Send email using selected mailer
            |--------------------------------------------------------------------------
            */

            Mail::mailer($sender['mailer'])->html(
                $this->content,
                function ($message) use ($log, $sender) {

                    $message
                        ->from(
                            $sender['address'],
                            $sender['name']
                        )
                        ->to($log->email)
                        ->subject($this->subject);

                    /*
                    |--------------------------------------------------------------------------
                    | Attachments
                    |--------------------------------------------------------------------------
                    */

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

            /*
            |--------------------------------------------------------------------------
            | Update log as sent
            |--------------------------------------------------------------------------
            */

            $log->update([
                'status' => 'sent',
                'sent_at' => now(),
                'error' => null,
            ]);

        } catch (\Throwable $e) {

            /*
            |--------------------------------------------------------------------------
            | Update log as failed
            |--------------------------------------------------------------------------
            */

            $log->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
