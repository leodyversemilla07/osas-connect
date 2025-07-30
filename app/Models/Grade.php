<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_profile_id',
        'subject_code',
        'subject_name',
        'grade',
        'status',
        'semester',
        'school_year',
    ];

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class);
    }
}
