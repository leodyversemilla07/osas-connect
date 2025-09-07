<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'interviewer_id',
        'schedule',
        'location',
        'interview_type',
        'status',
        'remarks',
        'interview_scores',
        'total_score',
        'recommendation',
        'interviewer_notes',
        'completed_at',
        'reschedule_history',
    ];

    protected $casts = [
        'schedule' => 'datetime',
        'completed_at' => 'datetime',
        'interview_scores' => 'array',
        'reschedule_history' => 'array',
        'total_score' => 'decimal:2',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class);
    }

    public function interviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }

    // Accessor for formatted status
    public function getFormattedStatusAttribute(): string
    {
        return match ($this->status) {
            'scheduled' => 'Scheduled',
            'completed' => 'Completed',
            'rescheduled' => 'Rescheduled',
            'cancelled' => 'Cancelled',
            'no_show' => 'No Show',
            default => ucfirst($this->status),
        };
    }

    // Check if interview is completed
    public function isCompleted(): bool
    {
        return $this->status === 'completed' && ! is_null($this->completed_at);
    }

    // Check if interview can be rescheduled
    public function canBeRescheduled(): bool
    {
        return in_array($this->status, ['scheduled', 'rescheduled']) &&
               $this->schedule > now();
    }

    // Get the average score from interview_scores
    public function getAverageScore(): ?float
    {
        if (! is_array($this->interview_scores) || empty($this->interview_scores)) {
            return null;
        }

        $scores = array_filter($this->interview_scores, 'is_numeric');

        return empty($scores) ? null : round(array_sum($scores) / count($scores), 2);
    }
}
