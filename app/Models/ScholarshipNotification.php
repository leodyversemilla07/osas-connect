<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ScholarshipNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'data',
        'read_at',
        'notifiable_type',
        'notifiable_id',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    protected $appends = [
        'is_read',
    ];

    const TYPE_APPLICATION_STATUS = 'application_status';

    const TYPE_DOCUMENT_REQUEST = 'document_request';

    const TYPE_INTERVIEW_SCHEDULE = 'interview_schedule';

    const TYPE_STIPEND_RELEASE = 'stipend_release';

    const TYPE_RENEWAL_REMINDER = 'renewal_reminder';

    /**
     * Get the user that owns the notification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent notifiable model.
     */
    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the is_read attribute (for backward compatibility).
     */
    public function getIsReadAttribute(): bool
    {
        return ! is_null($this->read_at);
    }

    /**
     * Mark the notification as read.
     */
    public function markAsRead()
    {
        if (! $this->read_at) {
            $this->update(['read_at' => now()]);
        }
    }

    /**
     * Scope a query to only include unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }
}
