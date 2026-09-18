<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Imports\ObservatoryContactsImport;
use App\Models\ObservatoryContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use App\Mail\ObservatoryContactMail;
use Illuminate\Support\Facades\Storage;
use App\Jobs\SendObservatoryContactEmail;

class ObservatoryContactController extends Controller
{
public function index(Request $request)
{
    $search = trim((string) $request->query('search', ''));
    $status = $request->query('status', 'all');

    $contacts = ObservatoryContact::query()
        ->when($search !== '', function ($query) use ($search) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('organisation', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        })
        ->when($status !== 'all', function ($query) use ($status) {
            $query->where('status', $status);
        })
        ->latest()
        ->paginate(20)
        ->withQueryString(); // garde ?search=...&status=... dans les liens de pagination

    return Inertia::render('admin/ObservatoryContacts/Index', [
        'contacts' => $contacts,
        'filters'  => [
            'search' => $search,
            'status' => $status,
        ],
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'in:pending,approved,rejected'],
        ]);

        ObservatoryContact::create([
            ...$validated,
            'registered_at' => now(),
        ]);

        return back()->with('success', 'Contact ajouté avec succès.');
    }

public function import(Request $request)
{
    $request->validate([
        'file' => [
            'required',
            'file',
            'mimes:xlsx,xls,csv',
            'max:10240',
        ],
    ]);

    try {
        Excel::import(
            new ObservatoryContactsImport(),
            $request->file('file')
        );

        return back()->with(
            'success',
            'Les contacts ont été importés avec succès.'
        );

    } catch (ValidationException $e) {

        $failures = $e->failures();

        $errors = [];

        foreach ($failures as $failure) {
            $errors[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'value' => $failure->values(),
            ];
        }

        Log::error('Excel Import Validation Error', [
            'errors' => $errors,
        ]);

        return back()->with(
            'import_errors',
            $errors
        );

    } catch (\Throwable $e) {

        Log::error('Excel Import Error', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);

        return back()->with(
            'error',
            'Erreur lors de l’import Excel : ' . $e->getMessage()
        );
    }
}
private const QUEUE_THRESHOLD = 50;

public function sendEmail(Request $request)
{
    $validated = $request->validate([
        'contact_ids' => [
            'required',
            'array',
            'min:1',
        ],

        'contact_ids.*' => [
            'integer',
            'exists:observatory_contacts,id',
        ],

        'subject' => [
            'required',
            'string',
            'max:255',
        ],

        'message' => [
            'required',
            'string',
        ],

        'attachments' => [
            'nullable',
            'array',
            'max:5',
        ],

        'attachments.*' => [
            'file',
            'max:10240',
            'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,zip',
        ],
    ]);

    /**
     * Récupérer les contacts sélectionnés
     * qui possèdent un email.
     */
    $contacts = ObservatoryContact::whereIn(
        'id',
        $validated['contact_ids']
    )
        ->whereNotNull('email')
        ->where('email', '!=', '')
        ->get();

    if ($contacts->isEmpty()) {
        return back()->with(
            'error',
            'Aucun des contacts sélectionnés ne possède une adresse email.'
        );
    }

    /**
     * Stocker les fichiers une seule fois.
     */
    $attachments = [];

    foreach ($request->file('attachments', []) as $file) {

        $storedPath = $file->store(
            'tmp/email-attachments'
        );

        $attachments[] = [
            'stored_path' => $storedPath,
            'name' => $file->getClientOriginalName(),
            'mime' => $file->getClientMimeType(),
        ];
    }

    /**
     * Petit nombre de contacts :
     * envoi immédiat.
     */
    if ($contacts->count() <= self::QUEUE_THRESHOLD) {

        return $this->dispatchSynchronous(
            $contacts,
            $validated,
            $attachments
        );
    }

    /**
     * Beaucoup de contacts :
     * utilisation de la queue.
     */
    return $this->dispatchQueued(
        $contacts,
        $validated,
        $attachments
    );
}

private function dispatchSynchronous(
    $contacts,
    array $validated,
    array $attachments
) {
    $sent = 0;

    $failed = [];

    foreach ($contacts as $contact) {

        try {

            Mail::to($contact->email)->send(
                new ObservatoryContactMail(
                    contact: $contact,
                    subjectText: $validated['subject'],
                    messageHtml: $validated['message'],
                    attachmentFiles: $attachments
                )
            );

            $sent++;

        } catch (\Throwable $exception) {

            Log::error('Observatory email failed', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'error' => $exception->getMessage(),
            ]);

            $failed[] = $contact->email;
        }
    }

    /**
     * En mode synchrone, tous les emails
     * ont déjà été traités.
     *
     * On peut donc supprimer les fichiers.
     */
    foreach ($attachments as $attachment) {

        if (!empty($attachment['stored_path'])) {
            Storage::delete($attachment['stored_path']);
        }
    }

    /**
     * Certains emails ont échoué.
     */
    if (!empty($failed)) {

        return back()->with(
            'error',
            $sent .
            ' email(s) envoyé(s), échec pour : ' .
            implode(', ', $failed)
        );
    }

    return back()->with(
        'success',
        $sent . ' email(s) envoyé(s) avec succès.'
    );
}
private function dispatchQueued(
    $contacts,
    array $validated,
    array $attachments
) {
    foreach ($contacts as $contact) {

        $contactAttachments = [];

        foreach ($attachments as $attachment) {

            $sourcePath = Storage::path(
                $attachment['stored_path']
            );

            $newPath = 'tmp/email-attachments/' .
                uniqid() . '_' . $attachment['name'];

            Storage::put(
                $newPath,
                file_get_contents($sourcePath)
            );

            $contactAttachments[] = [
                'stored_path' => $newPath,
                'name' => $attachment['name'],
                'mime' => $attachment['mime'],
            ];
        }

        SendObservatoryContactEmail::dispatch(
            contactId: $contact->id,
            subjectText: $validated['subject'],
            messageHtml: $validated['message'],
            attachments: $contactAttachments
        );
    }

    // supprimer les fichiers originaux
    foreach ($attachments as $attachment) {
        Storage::delete($attachment['stored_path']);
    }

    return back()->with(
        'success',
        $contacts->count() .
        ' email(s) mis en file d\'attente.'
    );
}
public function destroy(ObservatoryContact $observatoryContact)
{
    $observatoryContact->delete();

    return back()->with('success', 'Contact supprimé avec succès.');
}

public function destroyMany(Request $request)
{
    $validated = $request->validate([
        'contact_ids'   => ['required', 'array', 'min:1'],
        'contact_ids.*' => ['integer', 'exists:observatory_contacts,id'],
    ]);

    $deleted = ObservatoryContact::whereIn('id', $validated['contact_ids'])->delete();

    return back()->with('success', $deleted . ' contact(s) supprimé(s).');
}

public function ids(Request $request)
{
    $query = ObservatoryContact::query();

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('organisation', 'like', "%{$search}%");
        });
    }

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    return response()->json(['ids' => $query->pluck('id')]);
}
}