<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <-- add this

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens; // <-- include here

    protected $fillable = [
        'username',
        'email',
        'password',
        'phone',
        'description',
        'is_admin',
        'is_worker',
        'profile_photo',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function works()
{
    return $this->hasMany(Work::class, 'worker_id');
}

// Works requested by the user
public function requestedWorks()
{
    return $this->hasMany(Work::class, 'user_id');
}


}
