<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssistantshipPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'user_id',
        'period_start',
        'period_end',
        'total_hours',
        'hourly_rate',
        'gross_amount',
        'deductions',
        'net_amount',
        'status',
        'processed_by',
        'processed_at',
        'released_at',
        'payment_reference',
        'remarks',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'total_hours' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
        'gross_amount' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_RELEASED = 'released';
    const STATUS_ON_HOLD = 'on_hold';
    const STATUS_CANCELLED = 'cancelled';

    const STATUSES = [
        self::STATUS_PENDING => 'Pending',
        self::STATUS_PROCESSING => 'Processing',
        self::STATUS_RELEASED => 'Released',
        self::STATUS_ON_HOLD => 'On Hold',
        self::STATUS_CANCELLED => 'Cancelled',
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
     * Get the processor.
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Calculate amounts based on hours and rate.
     */
    public function calculateAmounts(): void
    {
        $this->gross_amount = $this->total_hours * $this->hourly_rate;
        $this->net_amount = $this->gross_amount - ($this->deductions ?? 0);
    }

    /**
     * Process payment.
     */
    public function process(User $processor): bool
    {
        $this->status = self::STATUS_PROCESSING;
        $this->processed_by = $processor->id;
        $this->processed_at = now();

        return $this->save();
    }

    /**
     * Release payment.
     */
    public function release(?string $reference = null): bool
    {
        $this->status = self::STATUS_RELEASED;
        $this->released_at = now();
        
        if ($reference) {
            $this->payment_reference = $reference;
        }

        // Mark associated work hour logs as paid
        $this->assignment->workHourLogs()
            ->where('status', WorkHourLog::STATUS_APPROVED)
            ->whereBetween('work_date', [$this->period_start, $this->period_end])
            ->update(['status' => WorkHourLog::STATUS_PAID]);

        return $this->save();
    }

    /**
     * Put payment on hold.
     */
    public function hold(?string $reason = null): bool
    {
        $this->status = self::STATUS_ON_HOLD;
        
        if ($reason) {
            $this->remarks = $reason;
        }

        return $this->save();
    }

    /**
     * Cancel payment.
     */
    public function cancel(?string $reason = null): bool
    {
        $this->status = self::STATUS_CANCELLED;
        
        if ($reason) {
            $this->remarks = $reason;
        }

        return $this->save();
    }

    /**
     * Get formatted period.
     */
    public function getFormattedPeriod(): string
    {
        return $this->period_start->format('M d') . ' - ' . $this->period_end->format('M d, Y');
    }

    /**
     * Check if payment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if payment is released.
     */
    public function isReleased(): bool
    {
        return $this->status === self::STATUS_RELEASED;
    }

    /**
     * Scope for pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for released payments.
     */
    public function scopeReleased($query)
    {
        return $query->where('status', self::STATUS_RELEASED);
    }

    /**
     * Scope for a specific period.
     */
    public function scopeForPeriod($query, $startDate, $endDate)
    {
        return $query->where('period_start', '>=', $startDate)
            ->where('period_end', '<=', $endDate);
    }
}
