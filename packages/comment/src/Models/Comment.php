<?php

namespace khanhduy\Comment\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Leo\Products\Models\Products;
use Leo\Customers\Models\Customers;
use Leo\Services\Models\Services;
use Leo\Users\Models\User;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comment';

    protected $fillable = [
        'id_product',
        'id_customer',
        'id_user',
        'id_service',
        'comment',
        'status',
        'likes',
        'dislikes',
        'heart',
        'id_parent',
        'created_at',
        'updated_at',
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'id_product', 'id');
    }

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'id_customer', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function service()
    {
        return $this->belongsTo(Services::class, 'id_service', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'id_parent', 'id');
    }

    public function children()
    {
        return $this->hasMany(Comment::class, 'id_parent', 'id');
    }
}