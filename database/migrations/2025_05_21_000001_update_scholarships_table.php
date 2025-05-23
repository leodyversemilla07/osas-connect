<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateScholarshipsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            // Add new columns only if they don't exist
            if (! Schema::hasColumn('scholarships', 'stipend_schedule')) {
                $table->enum('stipend_schedule', ['monthly', 'semestral'])->default('monthly');
            }

            if (! Schema::hasColumn('scholarships', 'slots_available')) {
                $table->integer('slots_available')->default(0);
            }

            if (! Schema::hasColumn('scholarships', 'criteria')) {
                $table->json('criteria')->nullable();
            }

            if (! Schema::hasColumn('scholarships', 'renewal_criteria')) {
                $table->json('renewal_criteria')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropColumn([
                'stipend_schedule',
                'slots_available',
                'criteria',
                'renewal_criteria',
            ]);
        });
    }
}
