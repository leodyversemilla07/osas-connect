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
        Schema::table('scholarships', function (Blueprint $table) {
            // Add type_specification column
            $table->string('type_specification')->nullable()->after('type');

            // Update the type enum to include 'others'
            $table->enum('type', [
                'academic_full',
                'academic_partial',
                'student_assistantship',
                'performing_arts_full',
                'performing_arts_partial',
                'economic_assistance',
                'others',
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            // Drop the type_specification column
            $table->dropColumn('type_specification');

            // Revert the type enum to original values
            $table->enum('type', [
                'academic_full',
                'academic_partial',
                'student_assistantship',
                'performing_arts_full',
                'performing_arts_partial',
                'economic_assistance',
            ])->change();
        });
    }
};
