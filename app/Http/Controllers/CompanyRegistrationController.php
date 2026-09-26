<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyRegistrationController extends Controller
{
    /**
     * Afficher le formulaire d'inscription entreprise
     */
    public function create(): Response
    {
        return Inertia::render('client/Companies/Register');
    }

    /**
     * Enregistrer les informations de l'entreprise
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],

            'contact_gender' => ['nullable', 'string', 'max:20'],
            'contact_last_name' => ['nullable', 'string', 'max:255'],
            'contact_first_name' => ['nullable', 'string', 'max:255'],
            'contact_position' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],

            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);

        Company::create($validated);

        return redirect()
            ->route('company.register')
            ->with('success', 'Vos informations ont été enregistrées avec succès.');
    }
}