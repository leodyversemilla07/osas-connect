<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('scholarship_applications', function (Blueprint $table) {
            // Drop the current enum constraint and recreate with new values
            $table->enum('status', [
                'draft',
                'submitted',
                'under_verification',
                'incomplete',
                'verified',
                'under_evaluation',
                'interview_scheduled',
                'approved',
                'rejected',
                'end',
            ])->default('draft')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function reverse(): void
    {
        Schema::table('scholarship_applications', function (Blueprint $table) {
            // Revert to original enum values
            $table->enum('status', [
                'draft',
                'submitted',
                'under_verification',
                'incomplete',
                'verified',
                'under_evaluation',
                'approved',
                'rejected',
                'end',
            ])->default('draft')->change();
        });
    }
};
