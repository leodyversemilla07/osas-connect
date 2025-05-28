<?php

namespace App\Observers;

use App\Events\ScholarshipApplicationStatusChanged;
use App\Models\ScholarshipApplication;

class ScholarshipApplicationObserver
{
    /**
     * Handle the ScholarshipApplication "created" event.
     */
    public function created(ScholarshipApplication $scholarshipApplication): void
    {
        //
    }

    /**
     * Handle the ScholarshipApplication "updating" event.
     */
    public function updating(ScholarshipApplication $scholarshipApplication): void
    {
        // Store the original status before updating
        if ($scholarshipApplication->isDirty('status')) {
            $scholarshipApplication->original_status = $scholarshipApplication->getOriginal('status');
        }
    }

    /**
     * Handle the ScholarshipApplication "updated" event.
     */
    public function updated(ScholarshipApplication $scholarshipApplication): void
    {
        // Check if status was changed
        if ($scholarshipApplication->wasChanged('status')) {
            $previousStatus = $scholarshipApplication->original_status ?? $scholarshipApplication->getOriginal('status');
            
            // Fire the event
            event(new ScholarshipApplicationStatusChanged($scholarshipApplication, $previousStatus));
        }
    }

    /**
     * Handle the ScholarshipApplication "deleted" event.
     */
    public function deleted(ScholarshipApplication $scholarshipApplication): void
    {
        //
    }

    /**
     * Handle the ScholarshipApplication "restored" event.
     */
    public function restored(ScholarshipApplication $scholarshipApplication): void
    {
        //
    }

    /**
     * Handle the ScholarshipApplication "force deleted" event.
     */
    public function forceDeleted(ScholarshipApplication $scholarshipApplication): void
    {
        //
    }
}
