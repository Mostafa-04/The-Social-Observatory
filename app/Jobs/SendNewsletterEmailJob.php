<?php

namespace App\Jobs;

use App\Mail\NewsletterMail;
use App\Models\Setting;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;

class SendNewsletterEmailJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = 30;

    public function __construct(
        public string $email,
        public string $subject,
        public string $message,
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
        // Ne pas envoyer si le batch a été annulé
        if ($this->batch()?->cancelled()) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Configuration SMTP dynamique
        |--------------------------------------------------------------------------
        | Le Job peut être exécuté dans un worker séparé.
        | On recharge donc la configuration SMTP depuis la base de données.
        */

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

        /*
        |--------------------------------------------------------------------------
        | Reset Mail Manager
        |--------------------------------------------------------------------------
        | Important lorsque la configuration SMTP change dynamiquement.
        */

        app()->forgetInstance('mail.manager');
        app()->forgetInstance('mailer');

        /*
        |--------------------------------------------------------------------------
        | Send email
        |--------------------------------------------------------------------------
        */

        Mail::to($this->email)->send(
            new NewsletterMail(
                $this->subject,
                $this->message,
                $this->attachmentPaths,
            )
        );
    }
}