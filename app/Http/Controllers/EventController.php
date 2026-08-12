<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display all events.
     */
    public function index()
    {
        $events = Event::with('country')
            ->latest()
            ->get();

        return Inertia::render('admin/Events/Index', [
            'events' => $events,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Events/Create', [
            'countries' => Country::orderBy('name')->get(),
        ]);
    }

    /**
     * Store event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',

            'event_type' => 'required|in:conference,workshop,seminar,webinar,forum,roundtable,training,meeting',

            'country_id' => 'required|exists:countries,id',

            'city' => 'required|string|max:255',
            'location' => 'required|string|max:255',

            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',

            'registration_link' => 'nullable|url|max:255',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request
                ->file('image')
                ->store('events/images', 'public');
        }

        Event::create($validated);

        return redirect()
            ->route('events.index')
            ->with('success', 'Event created successfully.');
    }

    /**
     * Show event.
     */
    public function show($id)
    {
        $event = Event::with('country')
            ->findOrFail($id);

        return Inertia::render('admin/Events/Show', [
            'event' => $event,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $event = Event::findOrFail($id);

        return Inertia::render('admin/Events/Edit', [
            'event' => $event,
            'countries' => Country::orderBy('name')->get(),
        ]);
    }

    /**
     * Update event.
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',

            'event_type' => 'required|in:conference,workshop,seminar,webinar,forum,roundtable,training,meeting',

            'country_id' => 'required|exists:countries,id',

            'city' => 'required|string|max:255',
            'location' => 'required|string|max:255',

            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',

            'registration_link' => 'nullable|url|max:255',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
        ]);

        if ($request->hasFile('image')) {

            if (
                $event->image &&
                Storage::disk('public')->exists($event->image)
            ) {
                Storage::disk('public')->delete($event->image);
            }

            $validated['image'] = $request
                ->file('image')
                ->store('events/images', 'public');
        } else {
            $validated['image'] = $event->image;
        }

        $event->update($validated);

        return redirect()
            ->route('events.index')
            ->with('success', 'Event updated successfully.');
    }

    /**
     * Soft delete event.
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        $event->delete();

        return redirect()
            ->route('events.index')
            ->with('success', 'Event deleted successfully.');
    }
}