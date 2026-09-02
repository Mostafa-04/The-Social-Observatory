<?php

namespace App\Jobs;

use App\Models\EventEmailCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class FinalizeEventCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $campaignId,
        public array $storedRelativePaths = [],
    ) {}

    public function handle(): void
    {
        $campaign = EventEmailCampaign::find($this->campaignId);

        if (!$campaign) {
            return;
        }

        $sentCount = $campaign->logs()->where('status', 'sent')->count();
        $failedCount = $campaign->logs()->where('status', 'failed')->count();

        $status = match (true) {
            $sentCount === 0 && $failedCount > 0 => 'failed',
            default => 'sent',
        };

        $campaign->update([
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
            'status' => $status,
            'sent_at' => now(),
        ]);

        foreach ($this->storedRelativePaths as $relativePath) {
            Storage::disk('local')->delete($relativePath);
        }
    }
}