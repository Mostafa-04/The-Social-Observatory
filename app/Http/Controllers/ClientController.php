<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
    use App\Models\Event;
use App\Models\Insight;
use App\Models\Partner;
use App\Models\Research;
use App\Models\Setting;
use App\Models\Statistic;
use App\Models\Publication;
use App\Models\Project;
use App\Models\Country;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{

    public function home()
    {
        $researches = Research::latest()->take(3)->get();
        Log::info('Researches:', $researches->toArray());

        $insights = Insight::latest()->take(3)->get();

        $events = Event::latest()->take(3)->get();

        $publications = Publication::latest('published_at')
            ->take(3)
            ->get();

        $partners = Partner::all();

        $settings = Setting::first();

            $projectCountries = Country::whereHas('projects')
        ->pluck('iso_code')
        ->map(fn ($code) => strtoupper($code))
        ->values();

        return inertia('client/index', [
            'researches' => $researches,
            'insights' => $insights,
            'events' => $events,
            'partners' => $partners,
            'settings' => $settings,
            'publications' => $publications,
             'africaProjectCountries' => $projectCountries,
        ]);
    }

    public function researches()
    {
        $researches = Research::latest()->paginate(9);

        return inertia('client/researches/index', [
            'researches' => $researches
        ]);
    }

    public function research($id)
    {
        
        $research = Research::where('id', $id)
            ->with(['author','category'])
            ->firstOrFail();
      
        return inertia('client/researches/show', [
            'research' => $research
        ]);
    }

    public function publications()
    {
        $publications = Publication::latest()->paginate(9);

        return inertia('client/publication/index', [
            'publications' => $publications
        ]);
    }

    public function publication($id)
    {
        $publication = Publication::findOrFail($id);

        return inertia('client/publication/show', [
            'publication' => $publication
        ]);
    }

    public function projects()
    {
        $projects = Project::with([
            'country',
            'partner'
        ])->latest()->paginate(9);

        return inertia('client/project/index', [
            'projects' => $projects
        ]);
    }

    public function project($id)
    {
        $project = Project::with([
            'country',
            'partner'
        ])->findOrFail($id);

        return inertia('client/project/show', [
            'project' => $project
        ]);
    }

    public function insights()
    {
        $insights = Insight::with([
            'author',
            'category'
        ])->latest()->paginate(9);

        return inertia('client/insight/index', [
            'insights' => $insights
        ]);
    }

    public function insight($id)
    {
        $insight = Insight::where('id', $id)
            ->with([
                'author',
                'category'
            ])
            ->firstOrFail();

        return inertia('client/insight/show', [
            'insight' => $insight
        ]);
    }

    public function events()
    {
        $events = Event::with('country')
            ->latest()
            ->paginate(9);

        return inertia('client/event/index', [
            'events' => $events
        ]);
    }

    public function event($id)
    {
        $event = Event::with('country')
            ->findOrFail($id);

        return inertia('client/event/show', [
            'event' => $event
        ]);
    }

    public function partners()
    {
        return inertia('client/partner/index', [
            'partners' => Partner::all()
        ]);
    }

    public function about()
    {
        return inertia('client/about/index', [
            'settings' => Setting::first()
        ]);
    }

}
