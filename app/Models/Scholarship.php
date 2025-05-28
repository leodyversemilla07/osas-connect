<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Scholarship extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'description',
        'status',
        'amount',
        'deadline',
        'slots',
        'beneficiaries',
        'funding_source',
        'eligibility_criteria',
        'required_documents',
        'stipend_schedule',
        'slots_available',
        'criteria',
        'renewal_criteria',
        'admin_remarks',
    ];

    protected $casts = [
        'deadline' => 'date',
        'eligibility_criteria' => 'array',
        'required_documents' => 'array',
        'criteria' => 'array',
        'renewal_criteria' => 'array',
        'amount' => 'decimal:2',
    ];

    // Scholarship Types
    const TYPE_ACADEMIC_FULL = 'Academic';

    const TYPE_ACADEMIC_PARTIAL = 'Academic';

    const TYPE_STUDENT_ASSISTANTSHIP = 'Student Assistantship';

    const TYPE_PERFORMING_ARTS = 'Performing Arts';

    const TYPE_ECONOMIC_ASSISTANCE = 'Economic Assistance';

    // Payment Schedules
    const SCHEDULE_MONTHLY = 'monthly';

    const SCHEDULE_SEMESTRAL = 'semestral';

    // Status Types
    const STATUS_OPEN = 'open';

    const STATUS_CLOSED = 'closed';

    const STATUS_UPCOMING = 'upcoming';

    protected $gwa_requirements = [
        'academic_full' => [
            'min' => 1.000,
            'max' => 1.450,
        ],
        'academic_partial' => [
            'min' => 1.460,
            'max' => 1.750,
        ],
        'economic_assistance' => [
            'max' => 2.250,
        ],
    ];

    protected $stipend_amounts = [
        'academic_full' => 500,
        'academic_partial' => 300,
        'performing_arts_full' => 500,
        'performing_arts_partial' => 300,
        'economic_assistance' => 400,
        // Student Assistantship rate is based on work hours
    ];

    /**
     * Get the applications for this scholarship.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(ScholarshipApplication::class);
    }

    /**
     * Get GWA requirement for a scholarship type.
     *
     * @param  string  $subtype  Optional subtype for scholarships with variations
     */
    public function getGwaRequirement(?string $subtype = null): ?array
    {
        $key = strtolower($this->type);
        if ($subtype) {
            $key .= '_'.strtolower($subtype);
        }

        return $this->gwa_requirements[$key] ?? null;
    }

    /**
     * Get stipend amount for a scholarship type.
     *
     * @param  string  $subtype  Optional subtype for scholarships with variations
     */
    public function getStipendAmount(?string $subtype = null): ?float
    {
        $key = strtolower($this->type);
        if ($subtype) {
            $key .= '_'.strtolower($subtype);
        }

        return $this->stipend_amounts[$key] ?? null;
    }

    /**
     * Check if the scholarship is currently accepting applications.
     */
    public function isAcceptingApplications(): bool
    {
        return $this->status === self::STATUS_OPEN
            && $this->deadline >= now()
            && $this->slots_available > 0;
    }

    /**
     * Get the remaining slots for this scholarship.
     */
    public function getRemainingSlots(): int
    {
        return max(0, $this->slots_available - $this->applications()->where('status', 'approved')->count());
    }

    /**
     * Get the eligibility criteria as a formatted string.
     */
    public function getFormattedEligibilityCriteria(): string
    {
        $criteria = [];

        // Add GWA requirement if applicable
        if ($gwa = $this->getGwaRequirement()) {
            $gwa_text = isset($gwa['min'])
                ? "GWA between {$gwa['min']} - {$gwa['max']}"
                : "GWA not lower than {$gwa['max']}";
            $criteria[] = $gwa_text;
        }

        // Add stipend amount if applicable
        if ($amount = $this->getStipendAmount()) {
            $criteria[] = 'Monthly stipend: ₱'.number_format($amount, 2);
        }

        // Add other criteria from the database
        if (! empty($this->criteria)) {
            $criteria = array_merge($criteria, $this->criteria);
        }

        return implode("\n• ", $criteria);
    }
}
