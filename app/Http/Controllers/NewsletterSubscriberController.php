<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterMail;
use App\Models\NewsletterSubscriber;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;


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
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $setting = Setting::firstOrFail();

        config([
            'mail.default' => 'smtp',

            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $setting->mail_host,
            'mail.mailers.smtp.port' => (int) $setting->mail_port,
            'mail.mailers.smtp.username' => $setting->mail_username,
            'mail.mailers.smtp.password' => Crypt::decryptString($setting->mail_password),
            'mail.mailers.smtp.encryption' => 'tls',

            'mail.from.address' => $setting->mail_from_address,
            'mail.from.name' => $setting->mail_from_name,
        ]);

        app()->forgetInstance('mail.manager');
        app()->forgetInstance('mailer');

        $subscribers = NewsletterSubscriber::where('is_active', true)->get();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)
                ->send(new NewsletterMail(
                    $validated['subject'],
                    $validated['message']
                ));
        }

        return redirect()
            ->route('newsletter-subscribers.index')
            ->with('success', 'Newsletter sent successfully.');
    }
}