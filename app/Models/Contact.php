<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'organization',
        'subject',
        'message',
        'is_read',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'email' => 'encrypted',
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }
}