<?php

namespace App\Jobs;

use App\Models\IapsSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Parcourt les destinataires par paquets de 500 et crée un job d'envoi par adresse.
 * Exécuté en arrière-plan : la requête HTTP n'attend jamais la fin.
 */
class DispatchIapsBulkEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 1;

    public int $timeout = 900;

    public function __construct(
        public string $dir,
        public bool $selectAll,
        public array $ids = [],
        public array $excludedIds = [],
        public ?string $search = null,
        public ?string $type = null,
    ) {
        $this->onQueue('emails');
    }

    public function handle(): void
    {
        $seen = []; // évite d'envoyer deux fois à la même adresse

        IapsSubmission::query()
            ->filterBy($this->search, $this->type)
            ->withEmail()
            ->selection($this->selectAll, $this->ids, $this->excludedIds)
            ->select(['id', 'email', 'full_name', 'entity_name'])
            ->chunkById(500, function ($rows) use (&$seen) {
                foreach ($rows as $row) {
                    $email = mb_strtolower(trim($row->email));

                    if (! filter_var($email, FILTER_VALIDATE_EMAIL) || isset($seen[$email])) {
                        continue;
                    }

                    $seen[$email] = true;

                    SendIapsEmailJob::dispatch(
                        $email,
                        $row->entity_name ?: $row->full_name,
                        $this->dir
                    );
                }
            });
    }
}