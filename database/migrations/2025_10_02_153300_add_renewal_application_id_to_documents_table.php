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
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('renewal_application_id')
                ->nullable()
                ->after('application_id')
                ->constrained('renewal_applications')
                ->cascadeOnDelete();
            
            $table->index('renewal_application_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['renewal_application_id']);
            $table->dropColumn('renewal_application_id');
        });
    }
};
