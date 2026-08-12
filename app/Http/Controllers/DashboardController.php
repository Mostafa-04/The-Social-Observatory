<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Research;
use App\Models\Insight;
use App\Models\Event;
use App\Models\Publication;
use App\Models\Partner;
use App\Models\NewsletterSubscriber;
use App\Models\Contact; // ⚠️ عدّل اسم الموديل هنا إذا كنت تسمي رسائل التواصل بشكل مختلف (مثلاً ContactMessage)
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'research' => [
                    'total'     => Research::count(),
                    'published' => Research::where('status', 'published')->count(),
                ],
                'insights' => [
                    'total'     => Insight::count(),
                    'published' => Insight::where('status', 'published')->count(),
                ],
                'events' => [
                    'total'    => Event::count(),
                    'upcoming' => Event::where('status', 'upcoming')->count(),
                ],
                'publications' => [
                    'total' => Publication::count(),
                ],
                'partners' => [
                    'total' => Partner::count(),
                ],
                'newsletter' => [
                    'total' => NewsletterSubscriber::count(),
                    // اشتراكات آخر 30 يوم، لعرض مؤشر نمو بسيط
                    'this_month' => NewsletterSubscriber::where('created_at', '>=', now()->subDays(30))->count(),
                ],
                'contacts' => [
                    'total'  => Contact::count(),
                    'unread' => Contact::whereNull('read_at')->count(), // ⚠️ يفترض وجود عمود read_at، عدّل حسب مخططك
                ],
            ],

            // آخر 5 رسائل تواصل، لعرضها في قائمة "النشاط الأخير"
            'recentContacts' => Contact::latest()->take(5)->get(['id', 'name', 'email', 'subject', 'created_at']),

            // آخر 5 مشتركين في النشرة البريدية
            'recentSubscribers' => NewsletterSubscriber::latest()->take(5)->get(['id', 'email', 'created_at']),
        ]);
    }
}