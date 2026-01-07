<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UniversityOffice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'location',
        'supervisor_id',
        'max_assistants',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'max_assistants' => 'integer',
    ];

    /**
     * Get the supervisor for this office.
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    /**
     * Get all assistantship assignments for this office.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(StudentAssistantshipAssignment::class, 'office_id');
    }

    /**
     * Get active assignments for this office.
     */
    public function activeAssignments(): HasMany
    {
        return $this->assignments()->where('status', 'active');
    }

    /**
     * Check if office has available slots.
     */
    public function hasAvailableSlots(): bool
    {
        return $this->activeAssignments()->count() < $this->max_assistants;
    }

    /**
     * Get remaining slots count.
     */
    public function getRemainingSlots(): int
    {
        return max(0, $this->max_assistants - $this->activeAssignments()->count());
    }

    /**
     * Scope for active offices.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for offices with available slots.
     */
    public function scopeWithAvailableSlots($query)
    {
        return $query->active()->whereRaw(
            '(SELECT COUNT(*) FROM student_assistantship_assignments WHERE office_id = university_offices.id AND status = ?) < max_assistants',
            ['active']
        );
    }
}
