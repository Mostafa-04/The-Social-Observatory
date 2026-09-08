<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title',
        'type',
        'description',
        'cover_image',
        'pdf',
        'pages',
        'language',
        'published_at',
    ];

    public function downloads()
    {
        return $this->hasMany(PublicationDownload::class);
    }

    public function iapsSubmissions()
    {
        return $this->hasMany(IapsSubmission::class);
    }

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}