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
use App\Http\Controllers\RegistrationFormController;
use App\Http\Controllers\FormFieldController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\EventEmailCampaignController;
use App\Http\Controllers\AssociationController;
use App\Http\Controllers\IapsSubmissionController;
use App\Http\Controllers\GroupRegistrationController;
use App\Http\Controllers\ObservatoryContactController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\CompanyController;



/*
|--------------------------------------------------------------------------
| Frontend (Client)
|--------------------------------------------------------------------------
*/

// Subscribe to newsletter
Route::post('/newsletter/subscribe', [NewsletterSubscriberController::class, 'store'])
    ->name('newsletter.subscribe');

Route::get('/people/create', [PersonController::class, 'create'])
    ->name('people.create');



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
Route::get('/publications/{publication}/downloads', [PublicationController::class, 'Indexdownloads'])
    ->name('publications.downloads');

Route::get('/publications/{publication}/downloads/export', [PublicationController::class, 'downloadsExport'])
    ->name('publications.downloads.export');

Route::get(
    '/events/{event}/registration-form/create',
    [RegistrationFormController::class, 'create']
)->name('registration-forms.create');

Route::post(
    '/events/{event}/registration-form',
    [RegistrationFormController::class, 'store']
)->name('registration-forms.store');

Route::get(
    '/registration-forms/{registrationForm}/fields/create',
    [FormFieldController::class, 'create']
)->name('registration-forms.fields.create');

Route::post(
    '/registration-forms/{registrationForm}/fields',
    [FormFieldController::class, 'store']
)->name('registration-forms.fields.store');

Route::get(
    '/events/{event}/registrations',
    [EventRegistrationController::class, 'index']
)->name('events.registrations.index');

Route::get(
    '/events/{event}/emails/create',
    [EventEmailCampaignController::class, 'create']
)->name('events.emails.create');

Route::post(
    '/events/{event}/emails',
    [EventEmailCampaignController::class, 'store']
)->name('events.emails.store');



Route::get(
    '/events/{event}/emails',
    [EventEmailCampaignController::class, 'index']
)->name('events.emails.index');

Route::get('/admin/countries/{country}/cities', [CountryController::class, 'cities'])
    ->name('countries.cities');

Route::get('/admin/people/countries/{country}/cities', [CountryController::class, 'peopleCities'])
    ->name('people.countries.cities');


Route::get(
    '/events/{event}/emails/{campaign}',
    [EventEmailCampaignController::class, 'show']
)->name('events.emails.show');

Route::resource('associations', AssociationController::class);

Route::post(
    '/associations/import',
    [AssociationController::class, 'import']
)->name('associations.import');


    Route::get('iaps-submissions', [IapsSubmissionController::class, 'index'])
        ->name('iaps-submissions.index');

    Route::get('iaps-submissions/{iapsSubmission}', [IapsSubmissionController::class, 'show'])
        ->name('iaps-submissions.show');

        Route::post('iaps-submissions/send-email', [IapsSubmissionController::class, 'sendEmail'])
        ->name('iaps-submissions.send-email');

        Route::get('group-registrations', [GroupRegistrationController::class, 'index'])
        ->name('group-registrations.index');

    Route::get('group-registrations/{groupRegistration}', [GroupRegistrationController::class, 'show'])
        ->name('group-registrations.show');

    Route::post('group-registrations/send-email', [GroupRegistrationController::class, 'sendEmail'])
    ->name('group-registrations.send-email');

        Route::post(
            '/group-registrations/import',
            [GroupRegistrationController::class, 'import']
        )->name('group-registrations.import');

        Route::get(
        '/observatory-contacts',
        [ObservatoryContactController::class, 'index']
    )->name('admin.observatory-contacts.index');

    Route::get('observatory-contacts/ids', [ObservatoryContactController::class, 'ids'])
    ->name('admin.observatory-contacts.ids');

    Route::post(
        '/observatory-contacts',
        [ObservatoryContactController::class, 'store']
    )->name('admin.observatory-contacts.store');

    Route::post(
        '/observatory-contacts/import',
        [ObservatoryContactController::class, 'import']
    )->name('admin.observatory-contacts.import');

    Route::post(
    '/observatory-contacts/send-email',
    [ObservatoryContactController::class, 'sendEmail']
)->name('admin.observatory-contacts.send-email');

    // Le nom du paramètre {observatoryContact} doit correspondre
    // au nom de la variable dans destroy() pour le route model binding.
    Route::delete('observatory-contacts/{observatoryContact}', [ObservatoryContactController::class, 'destroy'])
        ->name('admin.observatory-contacts.destroy');

    Route::delete('observatory-contacts', [ObservatoryContactController::class, 'destroyMany'])
        ->name('admin.observatory-contacts.destroy-many');
        

Route::get('/people', [PersonController::class, 'index'])
    ->name('people.index');



Route::post('/people', [PersonController::class, 'store'])
    ->name('people.store');

Route::get('/people/{person}/history', [PersonController::class, 'history'])
    ->name('people.history');

Route::post('/people/send-email', [PersonController::class, 'sendEmail'])
    ->name('people.send-email');

        Route::get('/companies', [CompanyController::class, 'index'])
        ->name('admin.companies.index');

    Route::get('/companies/create', [CompanyController::class, 'create'])
        ->name('admin.companies.create');

    Route::post('/companies', [CompanyController::class, 'store'])
        ->name('admin.companies.store');

    Route::get('/companies/{company}', [CompanyController::class, 'show'])
        ->name('admin.companies.show');

            Route::get('/companies', [CompanyController::class, 'index'])
            ->name('admin.companies.index');

        Route::get('/companies/create', [CompanyController::class, 'create'])
            ->name('admin.companies.create');

        Route::post('/companies', [CompanyController::class, 'store'])
            ->name('admin.companies.store');

        Route::get('/companies/{company}', [CompanyController::class, 'show'])
            ->name('admin.companies.show');

        Route::post('/companies/send-email', [CompanyController::class, 'sendEmail'])
            ->name('admin.companies.send-email');
});


