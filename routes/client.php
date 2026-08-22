<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\PublicEventRegistrationController;
use App\Models\Event;
use App\Http\Controllers\AssociationClientController;

Route::get('/', [ClientController::class, 'home'])->name('client.home');
Route::get('/researches', [ClientController::class, 'researches'])->name('research.index');
Route::get('/research/{id}', [ClientController::class, 'research'])->name('research.show.client');

Route::get('/insights', [ClientController::class, 'insights'])->name('insight.index');
Route::get('/insight/{id}', [ClientController::class, 'insight'])->name('insight.show.client');

Route::get('/events', [ClientController::class, 'events'])->name('event.index.client');
Route::get('/events/{id}', [ClientController::class, 'event'])->name('event.show.client');

Route::get('/search', [SearchController::class, 'index'])->name('search.index');
Route::get('/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// Route::get('/partners', [ClientController::class, 'partners'])->name('partner.index.client');
// Route::get('/statistics', [ClientController::class, 'statistics'])->name('statistic.index.client');

Route::get('/publications', [ClientController::class, 'publications'])->name('publication.index.client');
Route::get('/publication/{id}', [ClientController::class, 'publication'])->name('publication.show.client');

// Route::get('/projects', [ClientController::class, 'projects'])->name('project.index.client');
// Route::get('/projects/{id}', [ClientController::class, 'project'])->name('project.show.client');



Route::get(
    '/events/{event:slug}/register',
    [PublicEventRegistrationController::class, 'create']
)->name('events.register');

Route::post(
    '/events/{event:slug}/register',
    [PublicEventRegistrationController::class, 'store']
)->name('events.register.store');

Route::get(
    '/events/{event:slug}/register/success',
    function (Event $event) {
        return Inertia::render(
            'admin/Events/RegistrationSuccess',
            [
                'event' => $event,
            ]
        );
    }
)->name('events.register.success');


Route::get('/ecosystem', [AssociationClientController::class, 'index'])
    ->name('ecosystem.index');
 
Route::get('/api/ecosystem/stats', [AssociationClientController::class, 'stats'])
    ->name('ecosystem.stats');

Route::get('/ecosystem/{slug}', [AssociationClientController::class, 'show'])
    ->name('ecosystem.show.client');
