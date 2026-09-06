<?php

namespace App\Console\Commands;

use App\Models\Research;
use App\Models\Publication;
use App\Models\Insight;
use App\Models\Event;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'app:generate-sitemap';
    protected $description = 'Generate the sitemap.xml file';

    public function handle(): void
    {
        $sitemap = Sitemap::create()
            ->add(Url::create('/')->setPriority(1.0))
            ->add(Url::create('/researches')->setPriority(0.8))
            ->add(Url::create('/publications')->setPriority(0.8))
            ->add(Url::create('/insights')->setPriority(0.8))
            ->add(Url::create('/events')->setPriority(0.8));

        Research::all()->each(function ($item) use ($sitemap) {
            $sitemap->add(
                Url::create("/research/{$item->id}")
                    ->setLastModificationDate($item->updated_at)
                    ->setPriority(0.7)
            );
        });

        Publication::all()->each(function ($item) use ($sitemap) {
            $sitemap->add(
                Url::create("/publication/{$item->id}")
                    ->setLastModificationDate($item->updated_at)
                    ->setPriority(0.7)
            );
        });

        Insight::all()->each(function ($item) use ($sitemap) {
            $sitemap->add(
                Url::create("/insight/{$item->id}")
                    ->setLastModificationDate($item->updated_at)
                    ->setPriority(0.7)
            );
        });

        Event::all()->each(function ($item) use ($sitemap) {
            $sitemap->add(
                Url::create("/events/{$item->slug}/register")
                    ->setLastModificationDate($item->updated_at)
                    ->setPriority(0.6)
            );
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully.');
    }
}