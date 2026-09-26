<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObservatoryContact extends Model
{
    protected $fillable = [
        'name',
        'organisation',
        'role',
        'gender',
        'email',
        'phone',
        'status',
        'registered_at',
        'approved_at',
        'rejected_at',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];
}