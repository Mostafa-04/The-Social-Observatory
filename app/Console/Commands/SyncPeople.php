<?php

namespace App\Console\Commands;

use App\Models\EventRegistration;
use App\Models\GroupRegistration;
use App\Models\IapsSubmission;
use App\Models\ObservatoryContact;
use App\Services\PersonService;
use Illuminate\Console\Command;

class SyncPeople extends Command
{
    protected $signature = 'people:sync';

    protected $description = 'Synchroniser les personnes depuis les anciennes inscriptions';

    public function handle(PersonService $people)
    {
        $this->info('Synchronisation des personnes...');

        /*
        |--------------------------------------------------------------------------
        | IAPS Submissions
        |--------------------------------------------------------------------------
        */
        IapsSubmission::query()->chunkById(500, function ($rows) use ($people) {
            foreach ($rows as $row) {
                $names = preg_split('/\s+/', trim($row->full_name), 2);

                $people->findOrCreate([
                    'first_name' => $names[0] ?? '',
                    'last_name' => $names[1] ?? '',
                    'email' => $row->email,
                    'phone' => $row->phone,
                    'organisation' => $row->organization_affiliation,
                    'gender' => null, // سيتم استبداله بالقيمة الافتراضية
                ]);
            }
        });

        $this->info('✓ IAPS Submissions synchronisées');

        /*
        |--------------------------------------------------------------------------
        | Group Registrations
        |--------------------------------------------------------------------------
        */
        GroupRegistration::query()->chunkById(500, function ($rows) use ($people) {
            foreach ($rows as $row) {
                $names = preg_split('/\s+/', trim($row->full_name), 2);

                $people->findOrCreate([
                    'first_name' => $names[0] ?? '',
                    'last_name' => $names[1] ?? '',
                    'email' => $row->email,
                    'gender' => null,
                ]);
            }
        });

        $this->info('✓ Group Registrations synchronisées');

        /*
        |--------------------------------------------------------------------------
        | Observatory Contacts
        |--------------------------------------------------------------------------
        */
        ObservatoryContact::query()->chunkById(500, function ($rows) use ($people) {
            foreach ($rows as $row) {
                $names = preg_split('/\s+/', trim($row->name), 2);

                $people->findOrCreate([
                    'first_name' => $names[0] ?? '',
                    'last_name' => $names[1] ?? '',
                    'email' => $row->email,
                    'phone' => $row->phone,
                    'organisation' => $row->organisation,
                    'role' => $row->role,
                    'gender' => null,
                ]);
            }
        });

        $this->info('✓ Observatory Contacts synchronisées');

        /*
        |--------------------------------------------------------------------------
        | Event Registrations
        |--------------------------------------------------------------------------
        */
        EventRegistration::query()->chunkById(500, function ($rows) use ($people) {
            foreach ($rows as $row) {
                $people->findOrCreate([
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                    'email' => $row->email,
                    'phone' => $row->phone,
                    'gender' => null,
                ]);
            }
        });

        $this->info('✓ Event Registrations synchronisées');

        $this->info('✅ Synchronisation terminée avec succès.');

        return self::SUCCESS;
    }
}