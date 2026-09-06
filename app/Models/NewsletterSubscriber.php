<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NewsletterSubscriber extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'email',
        'is_active',
        'subscribed_at',
        'unsubscribed_at',
    ];

protected function casts(): array
{
    return [
        'email' => 'encrypted',
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];
}
}