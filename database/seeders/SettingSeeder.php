<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::create([
            'email' => 'contact@example.com',
            'phone' => '+212 5 22 00 00 00',
            'address' => 'Casablanca, Morocco',

            'facebook' => null,
            'linkedin' => null,
            'twitter' => null,
            'youtube' => null,

            /*
            |--------------------------------------------------------------------------
            | SMTP Configuration
            |--------------------------------------------------------------------------
            */

            'mail_host' => 'smtp.gmail.com',
            'mail_port' => 587,
            'mail_username' => 'mostafaalmannani@gmail.com',
            'mail_password' => 'lukudfdyziqwawaf',

            'mail_from_address' => 'mostafaalmannani@gmail.com',
            'mail_from_name' => 'The Social Observatory',
        ]);
    }
}