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
            // Add new document types to the enum
            $table->dropColumn('type');
        });
        
        Schema::table('documents', function (Blueprint $table) {
            $table->enum('type', [
                'grades',
                'indigency', 
                'good_moral',
                'parent_consent',
                'recommendation',
                'transcripts',
                'recommendation_letter',
                'financial_statement'
            ])->after('application_id');
            
            // Add additional file metadata fields
            $table->string('original_name')->nullable()->after('file_path');
            $table->bigInteger('file_size')->nullable()->after('original_name');
            $table->string('mime_type')->nullable()->after('file_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['original_name', 'file_size', 'mime_type']);
            $table->dropColumn('type');
        });
        
        Schema::table('documents', function (Blueprint $table) {
            $table->enum('type', [
                'grades',
                'indigency',
                'good_moral', 
                'parent_consent',
                'recommendation',
            ])->after('application_id');
        });
    }
};
