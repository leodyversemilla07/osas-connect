<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Scholarship extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'type_specification',
        'description',
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
        'status',
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

    // MinSU Institutional Scholarship Type Constants
    const TYPE_ACADEMIC_FULL = 'academic_full';

    const TYPE_ACADEMIC_PARTIAL = 'academic_partial';

    const TYPE_STUDENT_ASSISTANTSHIP = 'student_assistantship';

    const TYPE_PERFORMING_ARTS_FULL = 'performing_arts_full';

    const TYPE_PERFORMING_ARTS_PARTIAL = 'performing_arts_partial';

    const TYPE_ECONOMIC_ASSISTANCE = 'economic_assistance';

    const TYPE_OTHERS = 'others';

    // MinSU Institutional Scholarship Types
    const TYPES = [
        self::TYPE_ACADEMIC_FULL => 'Academic Scholarship (Full) - President\'s Lister',
        self::TYPE_ACADEMIC_PARTIAL => 'Academic Scholarship (Partial) - Dean\'s Lister',
        self::TYPE_STUDENT_ASSISTANTSHIP => 'Student Assistantship Program',
        self::TYPE_PERFORMING_ARTS_FULL => 'MinSU Accredited Performing Arts Group (Full Scholar)',
        self::TYPE_PERFORMING_ARTS_PARTIAL => 'MinSU Accredited Performing Arts Group (Partial Scholar)',
        self::TYPE_ECONOMIC_ASSISTANCE => 'Economically Deprived/Marginalized Student',
        self::TYPE_OTHERS => 'Others (Custom Type)',
    ];

    const STATUSES = [
        'draft' => 'Draft',
        'active' => 'Active',
        'inactive' => 'Inactive',
        'upcoming' => 'Upcoming',
    ];

    // MinSU-specific GWA requirements
    protected $gwa_requirements = [
        'academic_full' => [
            'min' => 1.0,
            'max' => 1.45,
        ],
        'academic_partial' => [
            'min' => 1.46,
            'max' => 1.75,
        ],
        'student_assistantship' => [
            'max' => 2.25, // No failing grades requirement
        ],
        'performing_arts_full' => [
            'max' => 2.25, // No specific GWA but reasonable academic standing
        ],
        'performing_arts_partial' => [
            'max' => 2.25, // No specific GWA but reasonable academic standing
        ],
        'economic_assistance' => [
            'max' => 2.25,
        ],
    ];

    // MinSU-specific stipend amounts
    protected $stipend_amounts = [
        'academic_full' => 500,
        'academic_partial' => 300,
        'student_assistantship' => null, // Based on work hours
        'performing_arts_full' => 500,
        'performing_arts_partial' => 300,
        'economic_assistance' => 400,
    ];

    /**
     * Get the applications for this scholarship.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(ScholarshipApplication::class);
    }

    /**
     * Scope a query to only include active scholarships.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the minimum GWA requirement for this scholarship.
     */
    public function getMinimumGwa()
    {
        $requirement = $this->getGwaRequirement();

        return $requirement['min'] ?? null;
    }

    /**
     * Get the maximum GWA requirement for this scholarship.
     */
    public function getMaximumGwa()
    {
        $requirement = $this->getGwaRequirement();

        return $requirement['max'] ?? null;
    }

    /**
     * Get MinSU-specific required documents for scholarship type.
     */
    public function getRequiredDocuments(): array
    {
        $common_docs = [
            'transcript_of_records' => 'Official Transcript of Records',
            'registration_form' => 'Certificate of Registration',
            'birth_certificate' => 'Birth Certificate',
            'id_photo' => '2x2 ID Photo',
        ];

        $specific_docs = [];

        switch ($this->type) {
            case 'academic_full':
            case 'academic_partial':
                $specific_docs = [
                    'grade_reports' => 'Previous Semester Grade Reports',
                    'good_moral' => 'Certificate of Good Moral Character',
                ];
                break;

            case 'student_assistantship':
                $specific_docs = [
                    'parent_consent' => 'Parent/Guardian Consent Form',
                    'medical_certificate' => 'Medical Certificate',
                    'application_letter' => 'Application Letter',
                ];
                break;

            case 'performing_arts_full':
            case 'performing_arts_partial':
                $specific_docs = [
                    'coach_recommendation' => 'Coach/Adviser Recommendation Letter',
                    'performance_portfolio' => 'Portfolio of Performances/Activities',
                    'membership_certificate' => 'Group Membership Certificate',
                ];
                break;

            case 'economic_assistance':
                $specific_docs = [
                    'indigency_certificate' => 'Certificate of Indigency from MSWDO',
                    'income_certificate' => 'Family Income Certificate',
                    'barangay_certificate' => 'Barangay Certificate',
                ];
                break;
        }

        return array_merge($common_docs, $specific_docs);
    }

    /**
     * Get MinSU-specific eligibility criteria for scholarship type.
     */
    public function getEligibilityCriteria(): array
    {
        $common_criteria = [
            'Must be a currently enrolled MinSU student',
            'Must maintain good moral character',
            'No disciplinary cases or pending charges',
        ];

        $specific_criteria = [];

        switch ($this->type) {
            case 'academic_full':
                $specific_criteria = [
                    'GWA of 1.000 - 1.450 (President\'s Lister)',
                    'No grade below 1.75',
                    'No dropped, deferred, or failed subjects',
                    'Must be enrolled in at least 18 units',
                    'Must not be receiving any other scholarship',
                ];
                break;

            case 'academic_partial':
                $specific_criteria = [
                    'GWA of 1.460 - 1.750 (Dean\'s Lister)',
                    'No grade below 1.75',
                    'No dropped, deferred, or failed subjects',
                    'Must be enrolled in at least 18 units',
                    'Must not be receiving any other scholarship',
                ];
                break;

            case 'student_assistantship':
                $specific_criteria = [
                    'Maximum of 21 units enrollment per semester',
                    'No failing grades in previous semester',
                    'Must undergo pre-hiring screening',
                    'Parental consent required',
                    'Must be available for assigned work schedule',
                ];
                break;

            case 'performing_arts_full':
                $specific_criteria = [
                    'Active member of MinSU accredited performing arts group for 1+ year',
                    'Participated in major performances/competitions',
                    'Coach/adviser recommendation required',
                    'Demonstrated excellence in artistic field',
                ];
                break;

            case 'performing_arts_partial':
                $specific_criteria = [
                    'Member of MinSU accredited performing arts group for 1+ semester',
                    'Performed in at least 2 major activities',
                    'Coach/adviser recommendation required',
                    'Showed commitment to group activities',
                ];
                break;

            case 'economic_assistance':
                $specific_criteria = [
                    'Maximum GWA of 2.25',
                    'Valid Certificate of Indigency from MSWDO',
                    'Demonstrated financial need',
                    'Family income below poverty threshold',
                ];
                break;
        }

        return array_merge($common_criteria, $specific_criteria);
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
     * Get stipend amount for a scholarship.
     * Now uses the database amount field instead of hardcoded values.
     */
    public function getStipendAmount(?string $subtype = null): ?float
    {
        // Return the amount from database if set
        if ($this->amount !== null) {
            return (float) $this->amount;
        }

        // Fallback to predefined amounts if database amount is not set
        $key = strtolower($this->type);
        if ($subtype) {
            $key .= '_'.strtolower($subtype);
        }

        return $this->stipend_amounts[$key] ?? null;
    }

    public function isAcceptingApplications(): bool
    {
        return $this->status === 'active' &&
            $this->deadline &&
            now()->lte($this->deadline) &&
            $this->applications()->where('status', 'approved')->count() < $this->slots_available;
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
        $criteria = $this->getEligibilityCriteria();

        // Add stipend amount if applicable
        if ($amount = $this->getStipendAmount()) {
            $criteria[] = 'Monthly stipend: ₱'.number_format($amount, 2);
        }

        return '• '.implode("\n• ", $criteria);
    }
}
