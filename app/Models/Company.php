<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'sector',
        'country',
        'contact_gender',
        'contact_last_name',
        'contact_first_name',
        'contact_position',
        'contact_email',
        'contact_phone',
        'address',
        'city',
        'linkedin',
        'website',
    ];
}