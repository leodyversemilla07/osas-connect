<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Audit Log Model
 *
 * Tracks sensitive operations performed in the system such as
 * scholarship approvals, stipend releases, and other critical actions.
 */
class AuditLog extends Model
{
    /** @use HasFactory<\Database\Factories\AuditLogFactory> */
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
        ];
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'user_agent',
    ];

    /**
     * Get the user who performed the action.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for scholarship approval audits
     */
    public function scopeForScholarshipApproval($query)
    {
        return $query->where('action', 'scholarship_approval')
            ->where('entity_type', Scholarship::class);
    }

    /**
     * Scope for stipend release audits
     */
    public function scopeForStipendRelease($query)
    {
        return $query->where('action', 'stipend_release')
            ->where('entity_type', ScholarshipStipend::class);
    }

    /**
     * Scope for user management audits
     */
    public function scopeForUserManagement($query)
    {
        return $query->where('action', 'user_management');
    }

    /**
     * Scope for document verification audits
     */
    public function scopeForDocumentVerification($query)
    {
        return $query->where('action', 'document_verification')
            ->where('entity_type', Document::class);
    }
}
