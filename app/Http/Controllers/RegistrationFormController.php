<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\RegistrationForm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationFormController extends Controller
{
    /**
     * Show form creation page for an event.
     */
    public function create(Event $event)
    {
        return Inertia::render('admin/RegistrationForms/Create', [
            'event' => $event,
        ]);
    }

    /**
     * Store registration form.
     */
public function store(Request $request, Event $event)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'is_active' => 'boolean',
    ]);

    $registrationForm = RegistrationForm::create([
        'event_id' => $event->id,
        'title' => $validated['title'],
        'description' => $validated['description'] ?? null,
        'is_active' => $validated['is_active'] ?? true,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Default / System fields
    |--------------------------------------------------------------------------
    */

    $systemFields = [
        [
            'label' => 'Nom',
            'name' => 'last_name',
            'type' => 'text',
            'options' => null,
            'is_required' => true,
            'is_system' => true,
            'sort_order' => 1,
        ],
        [
            'label' => 'Prénom',
            'name' => 'first_name',
            'type' => 'text',
            'options' => null,
            'is_required' => true,
            'is_system' => true,
            'sort_order' => 2,
        ],
        [
            'label' => 'Numéro de téléphone',
            'name' => 'phone',
            'type' => 'phone',
            'options' => null,
            'is_required' => true,
            'is_system' => true,
            'sort_order' => 3,
        ],
        [
            'label' => 'Email',
            'name' => 'email',
            'type' => 'email',
            'options' => null,
            'is_required' => true,
            'is_system' => true,
            'sort_order' => 4,
        ],
    ];

    foreach ($systemFields as $field) {
        $registrationForm->fields()->create($field);
    }

    /*
    |--------------------------------------------------------------------------
    | Redirect directly to Form Builder
    |--------------------------------------------------------------------------
    */

    return redirect()
        ->route('registration-forms.fields.create', [
            'registrationForm' => $registrationForm->id,
        ])
        ->with('success', 'Registration form created successfully.');
}
}