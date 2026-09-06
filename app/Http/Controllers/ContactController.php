<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReplyMail;
use Illuminate\Support\Facades\Crypt;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->get();

        return Inertia::render('admin/Contacts/Index', [
            'contacts' => $contacts
        ]);
    }
    public function show(Contact $contact)
    {
        if (!$contact->is_read) {

            $contact->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

            $contact->refresh();
        }

        return Inertia::render('admin/Contacts/Show', [
            'contact' => $contact,
        ]);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()
            ->route('contacts.index')
            ->with('success', 'Message deleted successfully.');
    }

    public function reply(Contact $contact)
    {
        return Inertia::render('admin/Contacts/Reply', [
            'contact' => $contact,
        ]);
    }

    public function sendReply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $setting = Setting::first();

        if (!$setting) {
            return back()->withErrors([
                'smtp' => 'SMTP settings not found.'
            ]);
        }

        config([
            'mail.default' => 'smtp',

            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $setting->mail_host,
            'mail.mailers.smtp.port' => $setting->mail_port,
            'mail.mailers.smtp.username' => $setting->mail_username,
            'mail.mailers.smtp.password' => Crypt::decryptString($setting->mail_password),

            'mail.from.address' => $setting->mail_from_address,
            'mail.from.name' => $setting->mail_from_name,
        ]);
        app()->forgetInstance('mail.manager');
        app()->forgetInstance('mailer');

        Mail::to($contact->email)
            ->send(new ContactReplyMail(
                $validated['subject'],
                $validated['message']
            ));

        return redirect()
            ->route('contacts.show', $contact->id)
            ->with('success', 'Reply sent successfully.');
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:30',
        'country' => 'nullable|string|max:5',
        'organization' => 'nullable|string|max:255',
        'subject' => 'required|string|max:255',
        'message' => 'required|string|max:5000',
        'consent' => 'accepted', // يتحقق أن القيمة true/1/on
    ]);

    Contact::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null, // يصل مدموجاً مع الإندكاتيف مثل: +212612345678
        'organization' => $validated['organization'] ?? null,
        'subject' => $validated['subject'],
        'message' => $validated['message'],
        'is_read' => false,
        'read_at' => null,
    ]);

    return back()->with('success', 'Your message has been sent successfully.');
}
}
