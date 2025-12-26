<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RenewalApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'original_application_id',
        'student_id',
        'renewal_semester',
        'renewal_year',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewer_id',
        'renewal_notes',
        'cgpa',
        'has_required_documents',
        'required_document_ids',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'cgpa' => 'decimal:2',
        'has_required_documents' => 'boolean',
        'required_document_ids' => 'array',
    ];

    /**
     * Get the original scholarship application.
     */
    public function originalApplication(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class, 'original_application_id');
    }

    /**
     * Get the student who submitted the renewal.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the staff member who reviewed the renewal.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Get the documents associated with this renewal.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'renewal_application_id');
    }

    /**
     * Check if the renewal is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the renewal is under review.
     */
    public function isUnderReview(): bool
    {
        return $this->status === 'under_review';
    }

    /**
     * Check if the renewal is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the renewal is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the renewal has been submitted.
     */
    public function isSubmitted(): bool
    {
        return $this->submitted_at !== null;
    }

    /**
     * Get the renewal period display name.
     */
    public function getRenewalPeriod(): string
    {
        return "{$this->renewal_semester} {$this->renewal_year}";
    }

    /**
     * Scope to filter by status.
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by semester and year.
     */
    public function scopeForPeriod($query, string $semester, int $year)
    {
        return $query->where('renewal_semester', $semester)
            ->where('renewal_year', $year);
    }

    /**
     * Scope to get renewals for a specific student.
     */
    public function scopeForStudent($query, int $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}
