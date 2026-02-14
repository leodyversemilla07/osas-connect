<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory;

    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    // Document status constants
    const STATUS_PENDING = 'pending';

    const STATUS_VERIFIED = 'verified';

    const STATUS_REJECTED = 'rejected';

    const STATUS_EXPIRED = 'expired';

    // Document type constants (matching database enum)
    const TYPE_GRADES = 'grades';

    const TYPE_INDIGENCY = 'indigency';

    const TYPE_GOOD_MORAL = 'good_moral';

    const TYPE_PARENT_CONSENT = 'parent_consent';

    const TYPE_RECOMMENDATION = 'recommendation';

    const TYPE_TRANSCRIPTS = 'transcripts';

    const TYPE_RECOMMENDATION_LETTER = 'recommendation_letter';

    const TYPE_FINANCIAL_STATEMENT = 'financial_statement';

    const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

    const ALLOWED_MIME_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
    ];

    protected $fillable = [
        'application_id',
        'renewal_application_id',
        'type',
        'file_path',
        'original_name',
        'file_size',
        'mime_type',
        'status',
        'verification_remarks',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(ScholarshipApplication::class);
    }

    public function renewalApplication(): BelongsTo
    {
        return $this->belongsTo(RenewalApplication::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
