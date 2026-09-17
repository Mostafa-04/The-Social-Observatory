<?php

namespace App\Jobs;

use App\Mail\ObservatoryContactMail;
use App\Models\ObservatoryContact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SendObservatoryContactEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(
        public int $contactId,
        public string $subjectText,
        public string $messageHtml,
        public array $attachments
    ) {}

    public function handle(): void
    {
        $contact = ObservatoryContact::find($this->contactId);

        if (!$contact || !$contact->email) {
            $this->cleanup();

            return;
        }

        try {

            Mail::to($contact->email)->send(
                new ObservatoryContactMail(
                    contact: $contact,
                    subjectText: $this->subjectText,
                    messageHtml: $this->messageHtml,
                    attachmentFiles: $this->attachments
                )
            );

            Log::info('Observatory email sent', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
            ]);

            $this->cleanup();

        } catch (\Throwable $exception) {

            Log::error('Observatory email failed', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->cleanup();

        Log::error('Observatory email permanently failed', [
            'contact_id' => $this->contactId,
            'error' => $exception->getMessage(),
        ]);
    }

    private function cleanup(): void
    {
        foreach ($this->attachments as $attachment) {

            if (
                isset($attachment['stored_path']) &&
                Storage::exists($attachment['stored_path'])
            ) {
                Storage::delete($attachment['stored_path']);
            }
        }
    }
}