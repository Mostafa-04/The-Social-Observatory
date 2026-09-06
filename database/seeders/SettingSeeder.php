<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::create([
            'email' => 'contact@the-social-observatory.com',
            'phone' => '+212 5 22 00 00 00',
            'address' => 'Casablanca, Morocco',

            'facebook' => "https://www.instagram.com/thesocialobservatory/",
            'linkedin' => "https://www.linkedin.com/company/thesocialobservatory/",
            'twitter' => null,
            'youtube' => null,

            /*
            |--------------------------------------------------------------------------
            | SMTP Configuration
            |--------------------------------------------------------------------------
            */

            'mail_host' => 'smtp.mail.ovh.net',
            'mail_port' => 465,
            'mail_username' => 'contact@the-social-observatory.com',
            'mail_password' => 'Aymane123456@',

            'mail_from_address' => 'contact@the-social-observatory.com',
            'mail_from_name' => 'The Social Observatory',
        ]);
    }
}