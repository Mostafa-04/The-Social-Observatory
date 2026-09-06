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
use Carbon\Carbon;
use App\Http\Controllers\AssociationClientController;

class ClientController extends Controller
{

private function getLatestContent(): ?array
{
    $contents = collect();

    /*
    |--------------------------------------------------------------------------
    | Latest Research
    |--------------------------------------------------------------------------
    */
    $research = Research::query()
        ->latest('created_at')
        ->first();

    if ($research) {
        $contents->push([
            'type' => 'research',
            'title' => $research->title,
            'message' => 'Nous avons publié une nouvelle recherche.',
            'url' => route('research.show.client', $research->id),
            'created_at' => $research->created_at,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Latest Insight
    |--------------------------------------------------------------------------
    */
    $insight = Insight::query()
        ->latest('created_at')
        ->first();

    if ($insight) {
        $contents->push([
            'type' => 'insight',
            'title' => $insight->title,
            'message' => 'Nous avons publié un nouvel insight.',
            'url' => route('insight.show.client', $insight->id),
            'created_at' => $insight->created_at,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Latest Publication
    |--------------------------------------------------------------------------
    */
    $publication = Publication::query()
        ->latest('created_at')
        ->first();

    if ($publication) {
        $contents->push([
            'type' => 'publication',
            'title' => $publication->title,
            'message' => 'Nous avons publié une nouvelle publication.',
            'url' => route('publication.show.client', $publication->id),
            'created_at' => $publication->created_at,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Latest Event
    |--------------------------------------------------------------------------
    */
    $event = Event::query()
        ->latest('created_at')
        ->first();

    if ($event) {
        $contents->push([
            'type' => 'event',
            'title' => $event->title,
            'message' => 'Un nouvel événement vient d’être annoncé.',
            'url' => route('events.register', $event->slug),
            'created_at' => $event->created_at,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Return only the latest content
    |--------------------------------------------------------------------------
    */
    return $contents
        ->sortByDesc('created_at')
        ->first();
}
    public function home()
    {
        $researches = Research::latest()->take(3)->get();
        

        $insights = Insight::latest()->take(3)->get();

        $today = Carbon::today();

        $events = Event::query()
            ->where(function ($query) use ($today) {

                
                $query->whereDate('date', '>=', $today);

            })
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get();

        $publications = Publication::latest('published_at')
            ->take(3)
            ->get();

        $partners = Partner::query()
            ->select(['id', 'name', 'logo'])
            ->get();

        $settings = Setting::first();

        $projectCountries = Country::pluck('iso_code')
            ->map(fn ($code) => strtoupper($code))
            ->values();

            $latestContent = $this->getLatestContent();

        return inertia('client/index', [
            'researches' => $researches,
            'insights' => $insights,
            'events' => $events,
            'partners' => $partners,
            'settings' => $settings,
            'publications' => $publications,
             'africaProjectCountries' => $projectCountries,
              'stats' => (new AssociationClientController)->stats()->getData(true),
              'latestContent' => $latestContent,
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
