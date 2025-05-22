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
        Schema::create('scholarship_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('scholarship_id')->constrained('scholarships')->onDelete('cascade');
            
            // Application Status
            $table->enum('status', [
                'draft',
                'submitted',
                'under_verification',
                'incomplete',
                'verified',
                'under_evaluation',
                'approved',
                'rejected',
                'end'
            ])->default('draft');

            // Tracking Data
            $table->timestamp('applied_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->string('current_step')->nullable();

            // Application Content
            $table->text('purpose_letter')->nullable();
            $table->json('uploaded_documents')->nullable();
            $table->decimal('evaluation_score', 5, 2)->nullable();
            $table->text('verifier_comments')->nullable();
            $table->text('committee_recommendation')->nullable();
            $table->text('admin_remarks')->nullable();

            // Interview
            $table->timestamp('interview_schedule')->nullable();
            $table->text('interview_notes')->nullable();

            // Stipend Tracking
            $table->enum('stipend_status', ['pending', 'processing', 'released'])->nullable();
            $table->timestamp('last_stipend_date')->nullable();
            $table->decimal('amount_received', 10, 2)->default(0);

            // Renewal
            $table->enum('renewal_status', ['eligible', 'ineligible', 'pending', 'approved', 'rejected'])->nullable();
            $table->integer('academic_year')->nullable();
            $table->enum('semester', ['1st', '2nd', 'Summer'])->nullable();

            // Metadata
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarship_applications');
    }
};
