<?php

namespace Leo\Chat\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;
    protected $table='messages';
    protected $fillable=[
        'id',
        'conversation_id',
        'sender_id',
        'response',
        'content',
        'image',
        'created_at',
        'updated_at',
    ];
}
