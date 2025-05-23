<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScholarshipVerification extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'application_id',
        'verifier_id',
        'verification_type',
        'status',
        'comments',
        'verification_data',
    ];

    protected $casts = [
        'verification_data' => 'array',
    ];

    const TYPE_REGISTRAR = 'registrar';

    const TYPE_GUIDANCE = 'guidance';

    const TYPE_OSAS = 'osas';

    const TYPE_COACH = 'coach';

    const TYPE_ADVISER = 'adviser';

    const STATUS_PENDING = 'pending';

    const STATUS_VERIFIED = 'verified';

    const STATUS_INCOMPLETE = 'incomplete';

    const STATUS_REJECTED = 'rejected';

    /**
     * Get the application this verification belongs to.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class, 'application_id');
    }

    /**
     * Get the user who performed the verification.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }
}
