<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'email',
        'password',
        'role',
        'last_login_at',
        'photo_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
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
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the student profile associated with the user.
     */
    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class);
    }

    /**
     * Get the OSAS staff profile associated with the user.
     */
    public function osasStaffProfile()
    {
        return $this->hasOne(OsasStaffProfile::class);
    }

    /**
     * Get the admin profile associated with the user.
     */
    public function adminProfile()
    {
        return $this->hasOne(AdminProfile::class);
    }

    /**
     * Get the appropriate profile based on user role.
     */
    public function profile()
    {
        return match ($this->role) {
            'student' => $this->studentProfile,
            'osas_staff' => $this->osasStaffProfile,
            'admin' => $this->adminProfile,
            default => null,
        };
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is an OSAS staff.
     */
    public function isOsasStaff(): bool
    {
        return $this->role === 'osas_staff';
    }

    /**
     * Check if user is a student.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Get the full name of the user.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} ".($this->middle_name ? $this->middle_name.' ' : '')."{$this->last_name}";
    }

    /**
     * Get the URL to the user's avatar.
     */
    public function getAvatarAttribute(): ?string
    {
        if ($this->photo_id) {
            // $this->photo_id is expected to store the path like 'profile-photos/image.jpg'
            return asset('storage/'.$this->photo_id);
        }

        return null;
    }
}
