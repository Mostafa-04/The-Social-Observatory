<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorizable extends Model
{
    protected $table = 'categorizables';

    public $timestamps = false;

    protected $fillable = [
        'category_id',
        'categorizable_id',
        'categorizable_type',
    ];

    /**
     * Category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Polymorphic relation
     */
    public function categorizable()
    {
        return $this->morphTo();
    }
}