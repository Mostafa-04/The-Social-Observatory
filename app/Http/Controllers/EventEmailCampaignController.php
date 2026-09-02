<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventEmailCampaign;
use App\Models\EventEmailLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Jobs\SendEventCampaignEmailJob;
use App\Jobs\FinalizeEventCampaignJob;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

class EventEmailCampaignController extends Controller
{
    /**
     * Liste des campagnes email.
     */
    public function index(Event $event)
    {
        $campaigns = $event->emailCampaigns()
            ->withCount([
                'logs',
                'logs as sent_count_real' => function ($query) {
                    $query->where('status', 'sent');
                },
                'logs as failed_count_real' => function ($query) {
                    $query->where('status', 'failed');
                },
            ])
            ->latest()
            ->get();

        return Inertia::render(
            'admin/Events/Emails/Index',
            [
                'event' => $event,
                'campaigns' => $campaigns,
            ]
        );
    }


    /**
     * Create campaign page.
     */
    public function create(Event $event)
    {
        $totalRecipients = $event->registrations()
            ->count();

        return Inertia::render(
            'admin/Events/Emails/Create',
            [
                'event' => $event,
                'totalRecipients' => $totalRecipients,
            ]
        );
    }


    /**
     * Store and send campaign.
     */
public function store(Request $request, Event $event)
{
    /*
    |--------------------------------------------------------------------------
    | Validate
    |--------------------------------------------------------------------------
    */

    $validated = $request->validate([
        'subject' => 'required|string|max:255',
        'content' => 'required|string',
        'attachments' => 'nullable|array',
        'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,zip',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Get registrations
    |--------------------------------------------------------------------------
    */

    $registrations = $event->registrations()->get();


    /*
    |--------------------------------------------------------------------------
    | Store attachments on disk
    |--------------------------------------------------------------------------
    */

    $attachmentPaths = [];
    $storedRelativePaths = [];

    if ($request->hasFile('attachments')) {

        foreach ($request->file('attachments') as $file) {

            $path = $file->store('email-campaigns/attachments', 'local');

            $storedRelativePaths[] = $path;

            $attachmentPaths[] = [
                'path' => Storage::disk('local')->path($path),
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getClientMimeType(),
            ];
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Create campaign
    |--------------------------------------------------------------------------
    */

    $campaign = $event->emailCampaigns()->create([
        'subject' => $validated['subject'],
        'content' => $validated['content'],
        'status' => 'sending',

        'total_recipients' => $registrations->count(),
        'sent_count' => 0,
        'failed_count' => 0,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Create logs + build jobs list
    |--------------------------------------------------------------------------
    */

    $jobs = [];

    foreach ($registrations as $registration) {

        $email = trim((string) $registration->email);

        if (
            preg_match(
                '/^\[([^\]]+)\]\(mailto:[^)]+\)$/',
                $email,
                $matches
            )
        ) {
            $email = trim($matches[1]);
        }

        if (!$email) {

            $campaign->logs()->create([
                'event_registration_id' => $registration->id,
                'email' => '',
                'status' => 'failed',
                'error' => 'Participant has no email address.',
            ]);

            continue;
        }

        $log = $campaign->logs()->create([
            'event_registration_id' => $registration->id,
            'email' => $email,
            'status' => 'pending',
        ]);

        $jobs[] = new SendEventCampaignEmailJob(
            logId: $log->id,
            subject: $validated['subject'],
            content: $validated['content'],
            attachmentPaths: $attachmentPaths,
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Dispatch batch
    |--------------------------------------------------------------------------
    */

    if (empty($jobs)) {

        $campaign->update([
            'status' => 'failed',
            'sent_at' => now(),
        ]);

        foreach ($storedRelativePaths as $relativePath) {
            Storage::disk('local')->delete($relativePath);
        }

        return redirect()
            ->route('events.emails.index', $event)
            ->with('success', "Aucun participant avec une adresse email valide.");
    }

    $batch = Bus::batch($jobs)
        ->then(function () {
            //
        })
        ->catch(function () {
            //
        })
        ->finally(function () use ($campaign, $storedRelativePaths) {
            FinalizeEventCampaignJob::dispatch(
                $campaign->id,
                $storedRelativePaths,
            );
        })
        ->name("Campaign #{$campaign->id} - {$event->title}")
        ->dispatch();

    $campaign->update([
        'batch_id' => $batch->id,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Redirect فورًا
    |--------------------------------------------------------------------------
    */

    return redirect()
        ->route('events.emails.index', $event)
        ->with(
            'success',
            "L'envoi de {$campaign->total_recipients} email(s) a démarré en arrière-plan."
        );
}


    /**
     * Show campaign details.
     */
    public function show(
        Event $event,
        EventEmailCampaign $campaign
    ) {
        abort_unless(
            $campaign->event_id === $event->id,
            404
        );


        $campaign->load([
            'logs.registration',
        ]);


        return Inertia::render(
            'admin/Events/Emails/Show',
            [
                'event' => $event,
                'campaign' => $campaign,
            ]
        );
    }
}