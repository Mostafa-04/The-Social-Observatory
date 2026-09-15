<?php

namespace App\Jobs;

use App\Mail\IapsSubmissionConfirmationMail;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\Middleware\RateLimited;

class SendIapsSubmissionConfirmationEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = 30;

    public function __construct(
        public string $email,
        public string $fullName,
        public string $publicationTitle,
    ) {}

    public function middleware(): array
    {
        return [
            new RateLimited('email-campaign'),
        ];
    }

    public function handle(): void
    {
        $setting = Setting::firstOrFail();

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $setting->mail_host,
            'mail.mailers.smtp.port' => (int) $setting->mail_port,
            'mail.mailers.smtp.username' => $setting->mail_username,
            'mail.mailers.smtp.password' => Crypt::decryptString(
                $setting->mail_password
            ),
            'mail.mailers.smtp.encryption' => 'tls',
            'mail.from.address' => $setting->mail_from_address,
            'mail.from.name' => $setting->mail_from_name,
        ]);

        app()->forgetInstance('mail.manager');
        app()->forgetInstance('mailer');

        Mail::to($this->email)->send(
            new IapsSubmissionConfirmationMail(
                $this->fullName,
                $this->publicationTitle,
            )
        );
    }
}