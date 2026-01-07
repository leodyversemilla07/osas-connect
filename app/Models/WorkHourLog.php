<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkHourLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'user_id',
        'work_date',
        'time_in',
        'time_out',
        'hours_worked',
        'hours_approved',
        'status',
        'approved_by',
        'approved_at',
        'tasks_performed',
        'supervisor_remarks',
        'rejection_reason',
    ];

    protected $casts = [
        'work_date' => 'date',
        'time_in' => 'datetime:H:i',
        'time_out' => 'datetime:H:i',
        'hours_worked' => 'decimal:2',
        'hours_approved' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_PAID = 'paid';

    const STATUSES = [
        self::STATUS_PENDING => 'Pending Approval',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_REJECTED => 'Rejected',
        self::STATUS_PAID => 'Paid',
    ];

    /**
     * Get the assignment.
     */
    public function assignment(): BelongsTo
    {
        return $this->belongsTo(StudentAssistantshipAssignment::class, 'assignment_id');
    }

    /**
     * Get the student user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the approver.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Calculate hours worked from time in/out.
     */
    public function calculateHoursWorked(): float
    {
        if (!$this->time_in || !$this->time_out) {
            return 0;
        }

        // Parse times - handle both string and Carbon instances
        $timeInStr = $this->time_in instanceof \Carbon\Carbon 
            ? $this->time_in->format('H:i') 
            : $this->time_in;
        $timeOutStr = $this->time_out instanceof \Carbon\Carbon 
            ? $this->time_out->format('H:i') 
            : $this->time_out;

        $timeIn = \Carbon\Carbon::createFromFormat('H:i', $timeInStr);
        $timeOut = \Carbon\Carbon::createFromFormat('H:i', $timeOutStr);

        // Handle overnight shifts
        if ($timeOut->lessThanOrEqualTo($timeIn)) {
            $timeOut->addDay();
        }

        // Use absolute value to ensure positive result
        return round(abs($timeIn->diffInMinutes($timeOut)) / 60, 2);
    }

    /**
     * Calculate earnings for this log entry.
     */
    public function calculateEarnings(): float
    {
        $hours = $this->hours_approved ?? $this->hours_worked ?? 0;
        return $hours * ($this->assignment->hourly_rate ?? 0);
    }

    /**
     * Approve this work hour log.
     */
    public function approve(User $approver, ?float $hoursApproved = null, ?string $remarks = null): bool
    {
        $this->status = self::STATUS_APPROVED;
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        $this->hours_approved = $hoursApproved ?? $this->hours_worked;
        
        if ($remarks) {
            $this->supervisor_remarks = $remarks;
        }

        return $this->save();
    }

    /**
     * Reject this work hour log.
     */
    public function reject(User $approver, string $reason): bool
    {
        $this->status = self::STATUS_REJECTED;
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        $this->rejection_reason = $reason;
        $this->hours_approved = 0;

        return $this->save();
    }

    /**
     * Mark as paid.
     */
    public function markAsPaid(): bool
    {
        if ($this->status !== self::STATUS_APPROVED) {
            return false;
        }

        $this->status = self::STATUS_PAID;
        return $this->save();
    }

    /**
     * Check if log is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if log is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Scope for pending logs.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for approved logs.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope for unpaid approved logs.
     */
    public function scopeUnpaid($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope for date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('work_date', [$startDate, $endDate]);
    }

    /**
     * Boot method to auto-calculate hours.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if ($model->time_in && $model->time_out && !$model->hours_worked) {
                $model->hours_worked = $model->calculateHoursWorked();
            }
        });
    }
}
