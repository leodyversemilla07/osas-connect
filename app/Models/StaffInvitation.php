<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class StaffInvitation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [        
        'email',
        'token',
        'invited_by',
        'role',
        'expires_at',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    /**
     * Get the admin who created the invitation.
     */
    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Check if the invitation has expired.
     *
     * @return bool
     */
    public function hasExpired()
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the invitation has been accepted.
     *
     * @return bool
     */
    public function isAccepted()
    {
        return $this->accepted_at !== null;
    }

    /**
     * Generate a new invitation token.
     *
     * @return string
     */
    public static function generateToken()
    {
        return Str::random(64);
    }

    /**
     * Generate the invitation acceptance URL.
     *
     * @return string
     */
    public function getAcceptanceUrl()
    {
        return URL::signedRoute('staff.accept-invitation', ['token' => $this->token]);
    }
}