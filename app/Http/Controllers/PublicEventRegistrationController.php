<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Mail\EventRegistrationConfirmation;

class PublicEventRegistrationController extends Controller
{
    /**
     * Display public registration form.
     */
    public function create(Event $event)
    {
        $registrationForm = $event->registrationForms()
            ->where('is_active', true)
            ->with([
                'fields' => function ($query) {
                    $query->orderBy('sort_order');
                },
            ])
            ->first();

        abort_unless($registrationForm, 404);

        return Inertia::render(
            'admin/Events/PublicRegistration',
            [
                'event' => $event,
                'registrationForm' => $registrationForm,
            ]
        );
    }

    /**
     * Store visitor registration.
     */
    public function store(
        Request $request,
        Event $event
    ) {
        $registrationForm = $event->registrationForms()
            ->where('is_active', true)
            ->with('fields')
            ->first();

        abort_unless($registrationForm, 404);

        /*
        |--------------------------------------------------------------------------
        | Basic validation
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'last_name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:50',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Validate dynamic fields
        |--------------------------------------------------------------------------
        */

        $dynamicRules = [];

        foreach ($registrationForm->fields as $field) {

            // System fields are already validated above.
            if ($field->is_system) {
                continue;
            }

            $rule = $field->is_required
                ? ['required']
                : ['nullable'];

            switch ($field->type) {

                case 'email':
                    $rule[] = 'email';
                    break;

                case 'number':
                    $rule[] = 'numeric';
                    break;

                case 'date':
                    $rule[] = 'date';
                    break;

                case 'file':
                    $rule[] = 'file';
                    $rule[] = 'max:5120';
                    break;

                case 'select':
                case 'radio':

                    if (!empty($field->options)) {
                        $rule[] = 'in:' . implode(
                            ',',
                            $field->options
                        );
                    }

                    break;

                case 'checkbox':
                    $rule[] = 'array';
                    break;

                default:
                    $rule[] = 'string';
                    $rule[] = 'max:5000';
                    break;
            }

            $dynamicRules[
                'fields.' . $field->id
            ] = $rule;
        }

        $validatedDynamic = $request->validate(
            $dynamicRules
        );

        /*
        |--------------------------------------------------------------------------
        | Prevent duplicate registration
        |--------------------------------------------------------------------------
        */

        $alreadyRegistered = EventRegistration::where(
            'event_id',
            $event->id
        )
            ->where(
                'registration_form_id',
                $registrationForm->id
            )
            ->where(
                'email',
                $validated['email']
            )
            ->exists();

        if ($alreadyRegistered) {
            return back()->withErrors([
                'email' =>
                    'Vous êtes déjà inscrit à cet événement.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Create registration + answers
        |--------------------------------------------------------------------------
        */

        $registration = DB::transaction(function () use (
            $event,
            $registrationForm,
            $validated,
            $request
        ) {

            $registration = EventRegistration::create([
                'event_id' => $event->id,
                'registration_form_id' => $registrationForm->id,

                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],

                'status' => 'registered',
                'registered_at' => now(),
            ]);

            foreach ($registrationForm->fields as $field) {

                /*
                |--------------------------------------------------------------------------
                | System fields
                |--------------------------------------------------------------------------
                */

                if ($field->is_system) {
                    continue;
                }

                $value = $request->input(
                    'fields.' . $field->id
                );

                /*
                |--------------------------------------------------------------------------
                | File
                |--------------------------------------------------------------------------
                */

                if ($field->type === 'file') {

                    $file = $request->file(
                        'fields.' . $field->id
                    );

                    if ($file) {
                        $value = $file->store(
                            'event-registrations',
                            'public'
                        );
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Checkbox
                |--------------------------------------------------------------------------
                */

                if (
                    $field->type === 'checkbox'
                    && is_array($value)
                ) {
                    $value = json_encode(
                        $value,
                        JSON_UNESCAPED_UNICODE
                    );
                }

                $registration->answers()->create([
                    'form_field_id' => $field->id,
                    'value' => $value,
                ]);
            }

            return $registration;
        });

        /*
        |--------------------------------------------------------------------------
        | Send confirmation email
        |--------------------------------------------------------------------------
        */

        Mail::to($registration->email)
            ->send(
                new EventRegistrationConfirmation(
                    $registration->load([
                        'event',
                        'answers.formField',
                    ])
                )
            );

        return redirect()
            ->route(
                'events.register.success',
                $event->slug
            )
            ->with(
                'success',
                'Votre inscription a été enregistrée avec succès.'
            );
    }
}