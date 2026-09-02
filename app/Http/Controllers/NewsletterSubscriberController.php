<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterMail;
use App\Models\NewsletterSubscriber;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Jobs\SendNewsletterEmailJob;
use App\Jobs\FinalizeNewsletterCampaignJob;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

class NewsletterSubscriberController extends Controller
{
    /**
     * Admin - List subscribers
     */
    public function index()
    {
        $subscribers = NewsletterSubscriber::latest()->get();

        return Inertia::render('admin/NewsletterSubscribers/Index', [
            'subscribers' => $subscribers,
        ]);
    }

    /**
     * Frontend - Subscribe
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = NewsletterSubscriber::withTrashed()
            ->where('email', $validated['email'])
            ->first();

        if ($subscriber) {

            $subscriber->update([
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            if ($subscriber->trashed()) {
                $subscriber->restore();
            }

            return back()->with(
                'success',
                'Your subscription has been updated.'
            );
        }

        NewsletterSubscriber::create([
            'email' => $validated['email'],
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        return back()->with(
            'success',
            'Subscribed successfully.'
        );
    }

    /**
     * Admin - Show subscriber
     */
    public function show(NewsletterSubscriber $newsletterSubscriber)
    {
        return Inertia::render('admin/NewsletterSubscribers/Show', [
            'subscriber' => $newsletterSubscriber,
        ]);
    }

    /**
     * Admin - Delete subscriber
     */
    public function destroy(NewsletterSubscriber $newsletterSubscriber)
    {
        $newsletterSubscriber->delete();

        return redirect()
            ->route('newsletter-subscribers.index')
            ->with('success', 'Subscriber deleted successfully.');
    }

    /**
     * Activate subscriber
     */
    public function activate(NewsletterSubscriber $newsletterSubscriber)
    {
        $newsletterSubscriber->update([
            'is_active' => true,
            'subscribed_at' => now(),
            'unsubscribed_at' => null,
        ]);

        return back()->with('success', 'Subscriber activated.');
    }

    /**
     * Deactivate subscriber
     */
    public function deactivate(NewsletterSubscriber $newsletterSubscriber)
    {
        $newsletterSubscriber->update([
            'is_active' => false,
            'unsubscribed_at' => now(),
        ]);

        return back()->with('success', 'Subscriber deactivated.');
    }

    /**
     * Admin - Newsletter form
     */
    public function newsletterForm()
    {
        return Inertia::render('admin/NewsletterSubscribers/Send');
    }

    /**
     * Admin - Send newsletter
     */
    public function sendNewsletter(Request $request)
{
    /*
    |--------------------------------------------------------------------------
    | Validate
    |--------------------------------------------------------------------------
    */

    $validated = $request->validate([
        'subject' => 'required|string|max:255',
        'message' => 'required|string',
        'attachments' => 'nullable|array',
        'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,zip',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Store attachments on disk
    |--------------------------------------------------------------------------
    */

    $attachmentPaths = [];
    $storedRelativePaths = [];

    if ($request->hasFile('attachments')) {

        foreach ($request->file('attachments') as $file) {

            $path = $file->store('newsletter/attachments', 'local');

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
    | Get active subscribers
    |--------------------------------------------------------------------------
    */

    $subscribers = NewsletterSubscriber::where('is_active', true)->get();

    if ($subscribers->isEmpty()) {

        foreach ($storedRelativePaths as $relativePath) {
            Storage::disk('local')->delete($relativePath);
        }

        return redirect()
            ->route('newsletter-subscribers.index')
            ->with('success', 'Aucun abonné actif.');
    }


    /*
    |--------------------------------------------------------------------------
    | Build jobs
    |--------------------------------------------------------------------------
    */

    $jobs = $subscribers->map(function ($subscriber) use ($validated, $attachmentPaths) {

        return new SendNewsletterEmailJob(
            email: $subscriber->email,
            subject: $validated['subject'],
            message: $validated['message'],
            attachmentPaths: $attachmentPaths,
        );

    })->all();


    /*
    |--------------------------------------------------------------------------
    | Dispatch batch
    |--------------------------------------------------------------------------
    */

    Bus::batch($jobs)
        ->finally(function () use ($storedRelativePaths) {
            FinalizeNewsletterCampaignJob::dispatch($storedRelativePaths);
        })
        ->name("Newsletter - {$validated['subject']}")
        ->dispatch();


    /*
    |--------------------------------------------------------------------------
    | Redirect فورًا
    |--------------------------------------------------------------------------
    */

    return redirect()
        ->route('newsletter-subscribers.index')
        ->with(
            'success',
            "L'envoi à {$subscribers->count()} abonné(s) a démarré en arrière-plan."
        );
}
}