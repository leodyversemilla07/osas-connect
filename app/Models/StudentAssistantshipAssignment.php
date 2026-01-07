<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentAssistantshipAssignment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'application_id',
        'user_id',
        'office_id',
        'supervisor_id',
        'status',
        'work_schedule',
        'hours_per_week',
        'hourly_rate',
        'screening_date',
        'screening_notes',
        'screening_score',
        'screened_by',
        'start_date',
        'end_date',
        'academic_year',
        'semester',
        'duties_responsibilities',
        'remarks',
    ];

    protected $casts = [
        'work_schedule' => 'array',
        'hours_per_week' => 'integer',
        'hourly_rate' => 'decimal:2',
        'screening_date' => 'datetime',
        'screening_score' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'academic_year' => 'integer',
    ];

    // Status constants
    const STATUS_PENDING_SCREENING = 'pending_screening';
    const STATUS_SCREENING_SCHEDULED = 'screening_scheduled';
    const STATUS_SCREENING_COMPLETED = 'screening_completed';
    const STATUS_APPROVED = 'approved';
    const STATUS_ACTIVE = 'active';
    const STATUS_ON_LEAVE = 'on_leave';
    const STATUS_COMPLETED = 'completed';
    const STATUS_TERMINATED = 'terminated';
    const STATUS_REJECTED = 'rejected';

    const STATUSES = [
        self::STATUS_PENDING_SCREENING => 'Pending Screening',
        self::STATUS_SCREENING_SCHEDULED => 'Screening Scheduled',
        self::STATUS_SCREENING_COMPLETED => 'Screening Completed',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_ON_LEAVE => 'On Leave',
        self::STATUS_COMPLETED => 'Completed',
        self::STATUS_TERMINATED => 'Terminated',
        self::STATUS_REJECTED => 'Rejected',
    ];

    /**
     * Get the scholarship application.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class, 'application_id');
    }

    /**
     * Get the student user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the assigned office.
     */
    public function office(): BelongsTo
    {
        return $this->belongsTo(UniversityOffice::class, 'office_id');
    }

    /**
     * Get the supervisor.
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    /**
     * Get the screener.
     */
    public function screener(): BelongsTo
    {
        return $this->belongsTo(User::class, 'screened_by');
    }

    /**
     * Get work hour logs for this assignment.
     */
    public function workHourLogs(): HasMany
    {
        return $this->hasMany(WorkHourLog::class, 'assignment_id');
    }

    /**
     * Get payments for this assignment.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(AssistantshipPayment::class, 'assignment_id');
    }

    /**
     * Get total hours worked (approved).
     */
    public function getTotalHoursWorked(): float
    {
        return $this->workHourLogs()
            ->where('status', 'approved')
            ->sum('hours_approved');
    }

    /**
     * Get total hours pending approval.
     */
    public function getPendingHours(): float
    {
        return $this->workHourLogs()
            ->where('status', 'pending')
            ->sum('hours_worked');
    }

    /**
     * Get total earnings (paid).
     */
    public function getTotalEarnings(): float
    {
        return $this->payments()
            ->where('status', 'released')
            ->sum('net_amount');
    }

    /**
     * Get pending earnings.
     */
    public function getPendingEarnings(): float
    {
        return $this->payments()
            ->whereIn('status', ['pending', 'processing'])
            ->sum('net_amount');
    }

    /**
     * Calculate earnings for given hours.
     */
    public function calculateEarnings(float $hours): float
    {
        return $hours * $this->hourly_rate;
    }

    /**
     * Check if assignment is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if screening is pending or scheduled.
     */
    public function isPendingScreening(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING_SCREENING,
            self::STATUS_SCREENING_SCHEDULED,
        ]);
    }

    /**
     * Check if assignment can log hours.
     */
    public function canLogHours(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Get formatted work schedule.
     */
    public function getFormattedSchedule(): string
    {
        if (empty($this->work_schedule)) {
            return 'No schedule set';
        }

        $days = [];
        foreach ($this->work_schedule as $day => $time) {
            $days[] = ucfirst($day) . ': ' . $time;
        }

        return implode(', ', $days);
    }

    /**
     * Scope for active assignments.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope for pending screening.
     */
    public function scopePendingScreening($query)
    {
        return $query->whereIn('status', [
            self::STATUS_PENDING_SCREENING,
            self::STATUS_SCREENING_SCHEDULED,
            self::STATUS_SCREENING_COMPLETED,
        ]);
    }

    /**
     * Scope for current semester.
     */
    public function scopeCurrentSemester($query, int $academicYear, string $semester)
    {
        return $query->where('academic_year', $academicYear)
            ->where('semester', $semester);
    }
}
