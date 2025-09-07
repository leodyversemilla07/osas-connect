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
        Schema::create('fund_tracking', function (Blueprint $table) {
            $table->id();

            // Fund Source Information
            $table->enum('fund_source', ['special_trust_fund', 'student_development_fund', 'other']);
            $table->string('fund_name'); // Display name for the fund
            $table->text('description')->nullable();

            // Budget Allocation
            $table->string('academic_year'); // e.g., '2025-2026'
            $table->enum('semester', ['1st', '2nd', 'Summer']);
            $table->decimal('total_budget', 15, 2); // Total allocated budget
            $table->decimal('allocated_amount', 15, 2)->default(0); // Amount allocated to scholarships
            $table->decimal('disbursed_amount', 15, 2)->default(0); // Amount actually disbursed
            $table->decimal('remaining_budget', 15, 2)->default(0); // Calculated remaining budget

            // Status and Tracking
            $table->enum('status', ['active', 'inactive', 'depleted', 'suspended'])->default('active');
            $table->date('budget_start_date');
            $table->date('budget_end_date');
            $table->timestamp('last_disbursement_at')->nullable();

            // Administrative
            $table->foreignId('managed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['fund_source', 'academic_year', 'semester']);
            $table->index(['status', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fund_tracking');
    }
};
