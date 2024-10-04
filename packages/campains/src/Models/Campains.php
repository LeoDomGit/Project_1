<?php

namespace Leo\Campains\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Campains extends Model
{
    use HasFactory;
    protected $table='campains';
    protected $fillable = [
        'title',
        'summary',
        'link',
        'start',
        'end',
        'image',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
    ];
}
