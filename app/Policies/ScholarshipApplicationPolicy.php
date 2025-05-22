<?php

namespace App\Policies;

use App\Models\ScholarshipApplication;
use App\Models\User;

class ScholarshipApplicationPolicy
{
    /**
     * Determine if the user can view the scholarship application.
     */
    public function view(User $user, ScholarshipApplication $application): bool
    {
        // Students can only view their own applications
        if ($user->isStudent()) {
            return $application->student_id === $user->id;
        }

        // Admin and OSAS staff can view all applications
        return $user->isAdmin() || $user->isOsasStaff();
    }

    /**
     * Determine if the user can verify documents.
     */
    public function verifyDocuments(User $user, ScholarshipApplication $application): bool
    {
        // Only admin, OSAS staff, or specific verifiers (Registrar, Guidance) can verify
        return $user->isAdmin() || 
               $user->isOsasStaff() || 
               $user->hasRole(['registrar', 'guidance_counselor']);
    }

    /**
     * Determine if the user can approve or reject applications.
     */
    public function approveOrReject(User $user, ScholarshipApplication $application): bool
    {
        // Only admin and OSAS staff can approve/reject applications
        return $user->isAdmin() || $user->isOsasStaff();
    }

    /**
     * Determine if the user can update the application.
     */
    public function update(User $user, ScholarshipApplication $application): bool
    {
        // Students can only update their own applications if they're in draft or incomplete status
        if ($user->isStudent()) {
            return $application->student_id === $user->id && 
                   in_array($application->status, [
                       ScholarshipApplication::STATUS_DRAFT,
                       ScholarshipApplication::STATUS_INCOMPLETE
                   ]);
        }

        // Admin and OSAS staff can update any application
        return $user->isAdmin() || $user->isOsasStaff();
    }
}
