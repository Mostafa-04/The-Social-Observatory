
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    */

    'default' => env('MAIL_MAILER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    */

    'mailers' => [

        // Main email: contact@the-social-observatory.com
        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME', 'smtps'),
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', '127.0.0.1'),
            'port' => env('MAIL_PORT', 465),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env(
                'MAIL_EHLO_DOMAIN',
                parse_url(
                    (string) env('APP_URL', 'http://localhost'),
                    PHP_URL_HOST
                )
            ),
        ],

        // Second email: oumaima.mhijir@the-social-observatory.com
        'oumaima' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SECOND_SCHEME', 'smtps'),
            'url' => env('MAIL_SECOND_URL'),
            'host' => env('MAIL_SECOND_HOST', 'smtp.mail.ovh.net'),
            'port' => env('MAIL_SECOND_PORT', 465),
            'username' => env('MAIL_SECOND_USERNAME'),
            'password' => env('MAIL_SECOND_PASSWORD'),
            'timeout' => null,
            'local_domain' => env(
                'MAIL_EHLO_DOMAIN',
                parse_url(
                    (string) env('APP_URL', 'http://localhost'),
                    PHP_URL_HOST
                )
            ),
        ],

        'ses' => [
            'transport' => 'ses',
        ],

        'postmark' => [
            'transport' => 'postmark',
        ],

        'resend' => [
            'transport' => 'resend',
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env(
                'MAIL_SENDMAIL_PATH',
                '/usr/sbin/sendmail -bs -i'
            ),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
            'retry_after' => 60,
        ],

        'roundrobin' => [
            'transport' => 'roundrobin',
            'mailers' => [
                'ses',
                'postmark',
            ],
            'retry_after' => 60,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Campaign Senders
    |--------------------------------------------------------------------------
    |
    | Available email accounts for event email campaigns.
    |
    */

    'campaign_senders' => [

        'contact' => [
            'mailer' => 'smtp',
            'address' => env('MAIL_FROM_ADDRESS'),
            'name' => env('MAIL_FROM_NAME'),
        ],

        'oumaima' => [
            'mailer' => 'oumaima',
            'address' => env('MAIL_SECOND_FROM_ADDRESS'),
            'name' => env('MAIL_SECOND_FROM_NAME'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env(
            'MAIL_FROM_NAME',
            env('APP_NAME', 'Laravel')
        ),
    ],

];
