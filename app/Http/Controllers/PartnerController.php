<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/Partners/Index', [
            'partners' => Partner::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/Partners/Create');
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'website' => 'nullable|url|max:255',
            'type' => 'required|in:government,ngo,university,international_organization,private_company,foundation,research_center,other',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        }

        Partner::create($validated);

        return redirect()
            ->route('partners.index')
            ->with('success', 'Partner created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $partner = Partner::findOrFail($id);

        return Inertia::render('admin/Partners/Show', [
            'partner' => $partner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $partner = Partner::findOrFail($id);

        return Inertia::render('admin/Partners/Edit', [
            'partner' => $partner,
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'type' => 'required|in:government,ngo,university,international_organization,private_company,foundation,research_center,other',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        // إذا اختار المستخدم صورة جديدة
        if ($request->hasFile('logo')) {

            // حذف الصورة القديمة
            if ($partner->logo && Storage::disk('public')->exists($partner->logo)) {
                Storage::disk('public')->delete($partner->logo);
            }

            // رفع الصورة الجديدة
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        } else {
            // الاحتفاظ بالصورة القديمة
            $validated['logo'] = $partner->logo;
        }

        $partner->update($validated);

        return redirect()
            ->route('partners.index')
            ->with('success', 'Partner updated successfully.');
    }

    /**
     * Soft Delete.
     */
    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);

        if ($partner->logo) {
            Storage::disk('public')->delete($partner->logo);
        }

        $partner->delete();

        return redirect()
            ->route('partners.index')
            ->with('success', 'Partner deleted successfully.');
    }
}