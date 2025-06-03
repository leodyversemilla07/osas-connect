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
            // Remove redundant stipend_amount column, keep only amount
            $table->dropColumn('stipend_amount');
            
            // Remove redundant slots column if it exists, keep only slots_available
            if (Schema::hasColumn('scholarships', 'slots')) {
                $table->dropColumn('slots');
            }
            
            // Remove redundant criteria column if it exists, keep only eligibility_criteria
            if (Schema::hasColumn('scholarships', 'criteria')) {
                $table->dropColumn('criteria');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            // Add back the columns in case we need to rollback
            $table->decimal('stipend_amount', 8, 2)->nullable();
            $table->integer('slots')->nullable();
            $table->json('criteria')->nullable();
        });
    }
};
