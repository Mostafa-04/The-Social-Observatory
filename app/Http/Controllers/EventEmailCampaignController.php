<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventEmailCampaign;
use App\Models\EventEmailLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

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
        ]);


        /*
        |--------------------------------------------------------------------------
        | Get registrations
        |--------------------------------------------------------------------------
        */

        $registrations = $event->registrations()->get();


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
        | Send emails
        |--------------------------------------------------------------------------
        */

        foreach ($registrations as $registration) {

            /*
            |--------------------------------------------------------------------------
            | Get email directly from event_registrations
            |--------------------------------------------------------------------------
            */

            $email = trim((string) $registration->email);


            /*
            |--------------------------------------------------------------------------
            | Clean Markdown mailto format if exists
            |--------------------------------------------------------------------------
            |
            | Example:
            | [test@gmail.com](mailto:test@gmail.com)
            |
            | becomes:
            | test@gmail.com
            |
            */

            if (
                preg_match(
                    '/^\[([^\]]+)\]\(mailto:[^)]+\)$/',
                    $email,
                    $matches
                )
            ) {
                $email = trim($matches[1]);
            }


            /*
            |--------------------------------------------------------------------------
            | Create failed log if email is missing
            |--------------------------------------------------------------------------
            */

            if (!$email) {

                $campaign->logs()->create([
                    'event_registration_id' => $registration->id,
                    'email' => '',
                    'status' => 'failed',
                    'error' => 'Participant has no email address.',
                ]);

                continue;
            }


            /*
            |--------------------------------------------------------------------------
            | Create email log
            |--------------------------------------------------------------------------
            */

            $log = $campaign->logs()->create([
                'event_registration_id' => $registration->id,
                'email' => $email,
                'status' => 'pending',
            ]);


            /*
            |--------------------------------------------------------------------------
            | Send email
            |--------------------------------------------------------------------------
            */

            try {

                Mail::raw(
                    $validated['content'],
                    function ($message) use ($email, $validated) {

                        $message
                            ->to($email)
                            ->subject($validated['subject']);
                    }
                );


                /*
                |--------------------------------------------------------------------------
                | Mark as sent
                |--------------------------------------------------------------------------
                */

                $log->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                    'error' => null,
                ]);

            } catch (\Throwable $e) {

                /*
                |--------------------------------------------------------------------------
                | Mark as failed
                |--------------------------------------------------------------------------
                */

                $log->update([
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ]);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Calculate statistics
        |--------------------------------------------------------------------------
        */

        $sentCount = $campaign->logs()
            ->where('status', 'sent')
            ->count();

        $failedCount = $campaign->logs()
            ->where('status', 'failed')
            ->count();

        $pendingCount = $campaign->logs()
            ->where('status', 'pending')
            ->count();


        /*
        |--------------------------------------------------------------------------
        | Determine campaign status
        |--------------------------------------------------------------------------
        */

        if ($sentCount === 0 && $failedCount > 0) {

            $status = 'failed';

        } elseif ($pendingCount > 0) {

            $status = 'sending';

        } else {

            $status = 'sent';
        }


        /*
        |--------------------------------------------------------------------------
        | Update campaign
        |--------------------------------------------------------------------------
        */

        $campaign->update([
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
            'status' => $status,
            'sent_at' => now(),
        ]);


        /*
        |--------------------------------------------------------------------------
        | Redirect
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('events.emails.index', $event)
            ->with(
                'success',
                "Campagne terminée : {$sentCount} email(s) envoyé(s), {$failedCount} échec(s)."
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