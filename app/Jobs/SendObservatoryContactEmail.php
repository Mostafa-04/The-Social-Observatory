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
use RuntimeException;

class SendObservatoryContactEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(
        public int $contactId,
        public string $subjectText,
        public string $messageHtml,
        public array $attachments,
        public string $senderKey = 'contact'
    ) {}

    public function handle(): void
    {
        $contact = ObservatoryContact::find($this->contactId);

        if (!$contact || !$contact->email) {
            $this->cleanup();
            return;
        }

        $sender = config("mail.campaign_senders.{$this->senderKey}");

        if (
            !$sender ||
            empty($sender['mailer']) ||
            empty($sender['address'])
        ) {
            throw new RuntimeException(
                "La configuration de l'expéditeur est invalide."
            );
        }

        try {
            $mail = new ObservatoryContactMail(
                contact: $contact,
                subjectText: $this->subjectText,
                messageHtml: $this->messageHtml,
                attachmentFiles: $this->attachments
            );

            $mail->from($sender['address'], $sender['name']);

            Mail::mailer($sender['mailer'])
                ->to($contact->email)
                ->send($mail);

            Log::info('Observatory email sent', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'sender' => $this->senderKey,
            ]);

            $this->cleanup();

        } catch (\Throwable $exception) {

            Log::error('Observatory email failed', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'sender' => $this->senderKey,
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
            'sender' => $this->senderKey,
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