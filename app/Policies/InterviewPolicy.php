<?php

namespace App\Policies;

use App\Models\Interview;
use App\Models\User;

class InterviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isStudent() || $user->isAdmin() || $user->isOsasStaff();
    }

    public function view(User $user, Interview $interview): bool
    {
        if ($user->isStudent()) {
            return $interview->application?->user_id === $user->id;
        }

        return $user->isAdmin() || $user->isOsasStaff();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isOsasStaff();
    }

    public function update(User $user, Interview $interview): bool
    {
        return $user->isAdmin() || $user->isOsasStaff();
    }

    public function requestReschedule(User $user, Interview $interview): bool
    {
        return $user->isStudent() && $interview->application?->user_id === $user->id;
    }
}
