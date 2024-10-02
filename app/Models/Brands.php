<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brands extends Model
{
    use HasFactory;
    protected $table='brands';
    protected $fillable = [
        'id','name','slug','status','created_at','updated_at'
    ];
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
