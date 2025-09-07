<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScholarshipStipend extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'application_id',
        'processed_by',
        'amount',
        'month',
        'academic_year',
        'semester',
        'status',
        'remarks',
        'processed_at',
        'released_at',
        'fund_source',
        'fund_reference',
        'payment_method',
        'payment_reference',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';

    const STATUS_PROCESSING = 'processing';

    const STATUS_RELEASED = 'released';

    const STATUS_FAILED = 'failed';

    const STATUS_CANCELLED = 'cancelled';

    // Fund source constants
    const FUND_SPECIAL_TRUST = 'special_trust_fund';

    const FUND_STUDENT_DEVELOPMENT = 'student_development_fund';

    const FUND_OTHER = 'other';

    /**
     * Get the application this stipend belongs to.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class, 'application_id');
    }

    /**
     * Get the user who processed the stipend.
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Get the fund tracking record for this stipend.
     */
    public function fundTracking(): BelongsTo
    {
        return $this->belongsTo(FundTracking::class, 'fund_source', 'fund_source');
    }

    /**
     * Check if stipend is ready for disbursement.
     */
    public function isReadyForDisbursement(): bool
    {
        return $this->status === self::STATUS_PROCESSING
            && $this->application->status === 'approved';
    }

    /**
     * Mark stipend as released.
     */
    public function markAsReleased(User $processor, ?string $paymentReference = null): void
    {
        $this->status = self::STATUS_RELEASED;
        $this->processed_by = $processor->id;
        $this->released_at = now();
        $this->processed_at = now();
        $this->payment_reference = $paymentReference;
        $this->save();
    }
}
