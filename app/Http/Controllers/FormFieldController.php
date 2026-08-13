<?php

namespace App\Http\Controllers;

use App\Models\FormField;
use App\Models\RegistrationForm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormFieldController extends Controller
{
    public function create(RegistrationForm $registrationForm)
    {
        $registrationForm->load([
            'event',
            'fields',
        ]);

        return Inertia::render('admin/RegistrationForms/Fields/Create', [
            'registrationForm' => $registrationForm,
        ]);
    }

    public function store(
        Request $request,
        RegistrationForm $registrationForm
    ) {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'type' => 'required|in:text,email,phone,number,date,textarea,select,radio,checkbox,country,file',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Prevent duplicate field name
        |--------------------------------------------------------------------------
        */

        $exists = $registrationForm
            ->fields()
            ->where('name', $validated['name'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'name' => 'Ce nom de champ existe déjà dans ce formulaire.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Get next sort order
        |--------------------------------------------------------------------------
        */

        $sortOrder = $registrationForm
            ->fields()
            ->max('sort_order') + 1;

        $field = $registrationForm->fields()->create([
            'label' => $validated['label'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'options' => $validated['options'] ?? null,
            'is_required' => $validated['is_required'] ?? false,
            'is_system' => false,
            'sort_order' => $sortOrder,
        ]);

        return back()->with(
            'success',
            'Champ ajouté avec succès.'
        );
    }

    public function destroy(
        RegistrationForm $registrationForm,
        FormField $field
    ) {
        /*
        |--------------------------------------------------------------------------
        | System fields cannot be deleted
        |--------------------------------------------------------------------------
        */

        if ($field->registration_form_id !== $registrationForm->id) {
            abort(404);
        }

        if ($field->is_system) {
            return back()->withErrors([
                'field' => 'Les champs système ne peuvent pas être supprimés.',
            ]);
        }

        $field->delete();

        return back()->with(
            'success',
            'Champ supprimé avec succès.'
        );
    }
}