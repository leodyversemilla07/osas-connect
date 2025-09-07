<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FundTracking extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'fund_tracking';

    protected $fillable = [
        'fund_source',
        'fund_name',
        'description',
        'academic_year',
        'semester',
        'total_budget',
        'allocated_amount',
        'disbursed_amount',
        'remaining_budget',
        'status',
        'budget_start_date',
        'budget_end_date',
        'last_disbursement_at',
        'managed_by',
        'remarks',
    ];

    protected $casts = [
        'total_budget' => 'decimal:2',
        'allocated_amount' => 'decimal:2',
        'disbursed_amount' => 'decimal:2',
        'remaining_budget' => 'decimal:2',
        'budget_start_date' => 'date',
        'budget_end_date' => 'date',
        'last_disbursement_at' => 'datetime',
    ];

    // Fund source constants
    const FUND_SPECIAL_TRUST = 'special_trust_fund';

    const FUND_STUDENT_DEVELOPMENT = 'student_development_fund';

    const FUND_OTHER = 'other';

    // Status constants
    const STATUS_ACTIVE = 'active';

    const STATUS_INACTIVE = 'inactive';

    const STATUS_DEPLETED = 'depleted';

    const STATUS_SUSPENDED = 'suspended';

    /**
     * Get the manager of this fund.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'managed_by');
    }

    /**
     * Get the stipends from this fund.
     */
    public function stipends(): HasMany
    {
        return $this->hasMany(ScholarshipStipend::class, 'fund_source', 'fund_source');
    }

    /**
     * Calculate and update the remaining budget.
     */
    public function updateRemainingBudget(): void
    {
        $this->remaining_budget = $this->total_budget - $this->disbursed_amount;
        $this->save();

        // Update status if depleted
        if ($this->remaining_budget <= 0) {
            $this->status = self::STATUS_DEPLETED;
            $this->save();
        }
    }

    /**
     * Check if fund has sufficient balance.
     */
    public function hasSufficientBalance(float $amount): bool
    {
        return $this->remaining_budget >= $amount && $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Allocate amount from this fund.
     */
    public function allocateAmount(float $amount): bool
    {
        if (! $this->hasSufficientBalance($amount)) {
            return false;
        }

        $this->allocated_amount += $amount;
        $this->updateRemainingBudget();

        return true;
    }

    /**
     * Disburse amount from this fund.
     */
    public function disburseAmount(float $amount): bool
    {
        if ($this->allocated_amount < $amount) {
            return false;
        }

        $this->disbursed_amount += $amount;
        $this->last_disbursement_at = now();
        $this->updateRemainingBudget();

        return true;
    }

    /**
     * Get available funds by source and period.
     */
    public static function getAvailableFunds(string $fundSource, string $academicYear, string $semester): ?self
    {
        return self::where('fund_source', $fundSource)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('status', self::STATUS_ACTIVE)
            ->where('remaining_budget', '>', 0)
            ->first();
    }
}
