<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OsasStaffProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'staff_id',
    ];

    /**
     * Get the user that owns the OSAS staff profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
