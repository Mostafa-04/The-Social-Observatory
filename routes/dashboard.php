<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NewsletterSubscriberController;

/*
|--------------------------------------------------------------------------
| Frontend (Client)
|--------------------------------------------------------------------------
*/

// Subscribe to newsletter
Route::post('/newsletter/subscribe', [NewsletterSubscriberController::class, 'store'])
    ->name('newsletter.subscribe');


/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {


        // Newsletter
        Route::get('/newsletter-subscribers/send', [NewsletterSubscriberController::class, 'newsletterForm'])
            ->name('newsletter-subscribers.newsletter-form');
        // Subscribers CRUD
        Route::get('/newsletter-subscribers', [NewsletterSubscriberController::class, 'index'])
            ->name('newsletter-subscribers.index');

        Route::get('/newsletter-subscribers/{newsletterSubscriber}', [NewsletterSubscriberController::class, 'show'])
            ->name('newsletter-subscribers.show');

        Route::delete('/newsletter-subscribers/{newsletterSubscriber}', [NewsletterSubscriberController::class, 'destroy'])
            ->name('newsletter-subscribers.destroy');

        // Activate / Deactivate
        Route::patch('/newsletter-subscribers/{newsletterSubscriber}/activate', [NewsletterSubscriberController::class, 'activate'])
            ->name('newsletter-subscribers.activate');

        Route::patch('/newsletter-subscribers/{newsletterSubscriber}/deactivate', [NewsletterSubscriberController::class, 'deactivate'])
            ->name('newsletter-subscribers.deactivate');

        // Newsletter
        Route::get('/newsletter-subscribers/send', [NewsletterSubscriberController::class, 'newsletterForm'])
            ->name('newsletter-subscribers.newsletter-form');

        Route::post('/newsletter-subscribers/send', [NewsletterSubscriberController::class, 'sendNewsletter'])
            ->name('newsletter-subscribers.send');

Route::resource('contacts', ContactController::class)
    ->only(['index', 'show', 'destroy']);

Route::post('/contact', [ContactController::class, 'store'])
    ->name('contact.store');
Route::get(
    'contacts/{contact}/reply',
    [ContactController::class, 'reply']
)->name('contacts.reply');

Route::post(
    'contacts/{contact}/send-reply',
    [ContactController::class, 'sendReply']
)->name('contacts.sendReply');
Route::resource('settings', SettingController::class)->names('settings');;
Route::resource('insights/dashboard', InsightController::class)->names('insights');;
Route::resource('events/dashboard', EventController::class)->names('events');;
Route::resource('projects', ProjectController::class)->names('projects');;
Route::resource('publications/dashboard', PublicationController::class)->names('publications');;
Route::resource('researches/dashboard', ResearchController::class)->names('researches');;
Route::resource('authors', AuthorController::class)->names('authors');;
Route::resource('partners', PartnerController::class)->names('partners');;
Route::resource('countries', CountryController::class)
    ->parameters([
        'countries' => 'country',
    ])->names('countries');
Route::resource('categories', CategoryController::class)->names('categories');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


});

