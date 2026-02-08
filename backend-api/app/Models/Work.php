<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'worker_id',
    'complaint',
    'brand',
    'model',
    'expected_delivery',
    'price',
    'bill_file',
    'status',
    'user_questions',
    'worker_answers',
];

protected $casts = [
    'user_questions' => 'array',
    'worker_answers' => 'array',
];
protected $appends = ['bill_url'];

public function getBillUrlAttribute()
{
    return $this->bill_file 
        ? asset('storage/' . $this->bill_file) 
        : null;
}

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function worker()
    {
        return $this->belongsTo(User::class, 'worker_id');
    }
}
