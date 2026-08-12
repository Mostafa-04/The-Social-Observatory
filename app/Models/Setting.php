<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Setting extends Model
{
    use SoftDeletes;
    protected $fillable = [

        'email',
        'phone',
        'address',

        'facebook',
        'linkedin',
        'twitter',
        'youtube',

        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_from_address',
        'mail_from_name',
    ];

    protected $hidden = [
        'mail_password',
    ];
}