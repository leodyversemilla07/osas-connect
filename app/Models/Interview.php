<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = ['application_id', 'schedule', 'status', 'remarks'];

    protected $casts = [
        'schedule' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class);
    }
}
