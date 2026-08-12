<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;

class SettingController extends Controller
{
    /**
     * Display settings.
     */
    public function index()
    {
        $settings = Setting::latest()->get();

        return Inertia::render('admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Settings/Create');
    }

    /**
     * Store setting.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'site_description' => 'nullable|string',

            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:4096',
            'favicon' => 'nullable|image|mimes:jpg,jpeg,png,ico,svg|max:2048',

            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',

            'facebook' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'youtube' => 'nullable|url|max:255',

            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string|max:255',

            'mail_host' => 'nullable|string|max:255',
            'mail_port' => 'nullable|string|max:50',
            'mail_username' => 'nullable|string|max:255',
            'mail_password' => 'nullable|string|max:255',
            'mail_from_address' => 'nullable|email|max:255',
            'mail_from_name' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')
                ->store('settings/logo', 'public');
        }

        if ($request->hasFile('favicon')) {
            $validated['favicon'] = $request->file('favicon')
                ->store('settings/favicon', 'public');
        }

        if ($request->filled('mail_password')) {
            $validated['mail_password'] = Crypt::encryptString($request->mail_password);
        }

        Setting::create($validated);

        return redirect()
            ->route('settings.index')
            ->with('success', 'Setting created successfully.');
    }

    /**
     * Show setting.
     */
    public function show($id)
    {
        $setting = Setting::findOrFail($id);

        return Inertia::render('admin/Settings/Show', [
            'setting' => $setting,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $setting = Setting::findOrFail($id);

        if ($setting->mail_password) {
            $setting->mail_password = Crypt::decryptString($setting->mail_password);
        }

        return Inertia::render('admin/Settings/Edit', [
            'setting' => $setting,
        ]);
    }

    /**
     * Update setting.
     */
    public function update(Request $request, $id)
    {
        $setting = Setting::findOrFail($id);

        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'site_description' => 'nullable|string',

            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:4096',
            'favicon' => 'nullable|image|mimes:jpg,jpeg,png,ico,svg|max:2048',

            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',

            'facebook' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'youtube' => 'nullable|url|max:255',

            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string|max:255',

            'mail_host' => 'nullable|string|max:255',
            'mail_port' => 'nullable|string|max:50',
            'mail_username' => 'nullable|string|max:255',
            'mail_password' => 'nullable|string|max:255',
            'mail_from_address' => 'nullable|email|max:255',
            'mail_from_name' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('logo')) {

            if (
                $setting->logo &&
                Storage::disk('public')->exists($setting->logo)
            ) {
                Storage::disk('public')->delete($setting->logo);
            }

            $validated['logo'] = $request->file('logo')
                ->store('settings/logo', 'public');
        } else {
            $validated['logo'] = $setting->logo;
        }

        if ($request->hasFile('favicon')) {

            if (
                $setting->favicon &&
                Storage::disk('public')->exists($setting->favicon)
            ) {
                Storage::disk('public')->delete($setting->favicon);
            }

            $validated['favicon'] = $request->file('favicon')
                ->store('settings/favicon', 'public');
        } else {
            $validated['favicon'] = $setting->favicon;
        }

        if ($request->filled('mail_password')) {
            $validated['mail_password'] = Crypt::encryptString($request->mail_password);
        } else {
            unset($validated['mail_password']);
        }

        $setting->update($validated);

        return redirect()
            ->route('settings.index')
            ->with('success', 'Setting updated successfully.');
    }

    /**
     * Soft delete.
     */
    public function destroy($id)
    {
        $setting = Setting::findOrFail($id);

        $setting->delete();

        return redirect()
            ->route('settings.index')
            ->with('success', 'Setting deleted successfully.');
    }
}