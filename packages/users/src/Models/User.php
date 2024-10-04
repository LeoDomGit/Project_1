<?php

namespace Leo\Users\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use khanhduy\Comment\Models\Comment;
use Leo\Bookings\Models\Bookings;
use Leo\Roles\Models\Roles;
use Spatie\Permission\Traits\HasRoles;
use Leo\Products\Models\Products;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'idRole',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles()
    {
        return $this->belongsTo(Roles::class, 'idRole');
    }

    public function bookings()
    {
        return $this->hasMany(Bookings::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'id_user', 'id');
    }
}