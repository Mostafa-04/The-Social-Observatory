<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;

class EventRegistrationController extends Controller
{
    /**
     * Display registrations for an event.
     */
    public function index(Event $event)
    {
        $registrations = $event->registrations()
            ->with([
                'answers.formField',
            ])
            ->latest()
            ->get();

        return Inertia::render('admin/Events/Registrations/Index', [
            'event' => $event,
            'registrations' => $registrations,
            'total' => $registrations->count(),
        ]);
    }
}