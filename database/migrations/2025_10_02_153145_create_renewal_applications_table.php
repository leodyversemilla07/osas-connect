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
        Schema::create('renewal_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('original_application_id')
                ->constrained('scholarship_applications')
                ->cascadeOnDelete();
            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('renewal_semester'); // 'First Semester', 'Second Semester'
            $table->year('renewal_year');
            $table->enum('status', [
                'pending',
                'under_review',
                'approved',
                'rejected',
                'withdrawn',
            ])->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewer_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->text('renewal_notes')->nullable();
            $table->decimal('cgpa', 3, 2)->nullable(); // Current CGPA for renewal
            $table->boolean('has_required_documents')->default(false);
            $table->json('required_document_ids')->nullable(); // Store document IDs
            $table->timestamps();

            // Indexes for performance (with custom names to avoid length limits)
            $table->index(['student_id', 'renewal_year', 'renewal_semester'], 'renewal_student_period_idx');
            $table->index('status', 'renewal_status_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('renewal_applications');
    }
};
