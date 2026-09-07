<?php
// app/Models/PublicationDownload.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicationDownload extends Model
{
    protected $fillable = [
        'publication_id',
        'name',
        'email',
        'ip_address',
    ];

        protected $casts = [
        'email' => 'encrypted',
    ];

    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }
}