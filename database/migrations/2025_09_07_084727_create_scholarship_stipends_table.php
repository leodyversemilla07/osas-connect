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
        Schema::create('scholarship_stipends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('scholarship_applications')->onDelete('cascade');
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');

            // Stipend Details
            $table->decimal('amount', 10, 2);
            $table->string('month'); // e.g., '2025-09', 'September 2025'
            $table->string('academic_year'); // e.g., '2025-2026'
            $table->enum('semester', ['1st', '2nd', 'Summer']);

            // Status and Processing
            $table->enum('status', ['pending', 'processing', 'released', 'failed', 'cancelled'])->default('pending');
            $table->text('remarks')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('released_at')->nullable();

            // Fund Tracking
            $table->enum('fund_source', ['special_trust_fund', 'student_development_fund', 'other'])->default('special_trust_fund');
            $table->string('fund_reference')->nullable(); // Reference number for accounting
            $table->string('payment_method')->nullable(); // Bank transfer, cash, etc.
            $table->string('payment_reference')->nullable(); // Bank transaction reference

            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['application_id', 'academic_year', 'semester']);
            $table->index(['status', 'month']);
            $table->index('fund_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarship_stipends');
    }
};
