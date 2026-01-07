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
        // University offices/departments where students can be assigned
        Schema::create('university_offices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique(); // e.g., 'OSAS', 'REGISTRAR', 'LIBRARY'
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('max_assistants')->default(5);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Student assistantship assignments
        Schema::create('student_assistantship_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('scholarship_applications')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('office_id')->constrained('university_offices')->onDelete('cascade');
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');

            // Assignment details
            $table->enum('status', [
                'pending_screening',    // Initial application
                'screening_scheduled',  // Pre-hiring screening scheduled
                'screening_completed',  // Screening done, awaiting decision
                'approved',             // Approved for assignment
                'active',               // Currently working
                'on_leave',             // Temporary leave
                'completed',            // Completed the term
                'terminated',           // Early termination
                'rejected',             // Did not pass screening
            ])->default('pending_screening');

            // Schedule
            $table->json('work_schedule')->nullable(); // e.g., {"monday": "8:00-12:00", "wednesday": "13:00-17:00"}
            $table->integer('hours_per_week')->default(10);
            $table->decimal('hourly_rate', 8, 2)->default(50.00); // Student rate wage

            // Screening
            $table->timestamp('screening_date')->nullable();
            $table->text('screening_notes')->nullable();
            $table->decimal('screening_score', 5, 2)->nullable();
            $table->foreignId('screened_by')->nullable()->constrained('users')->onDelete('set null');

            // Term dates
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('academic_year')->nullable();
            $table->enum('semester', ['1st', '2nd', 'Summer'])->nullable();

            // Notes
            $table->text('duties_responsibilities')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Ensure one active assignment per student per semester
            $table->unique(['user_id', 'academic_year', 'semester', 'deleted_at'], 'unique_student_semester_assignment');
        });

        // Work hour logs
        Schema::create('work_hour_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('student_assistantship_assignments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Time tracking
            $table->date('work_date');
            $table->time('time_in');
            $table->time('time_out')->nullable();
            $table->decimal('hours_worked', 4, 2)->nullable();
            $table->decimal('hours_approved', 4, 2)->nullable();

            // Approval workflow
            $table->enum('status', [
                'pending',      // Awaiting supervisor approval
                'approved',     // Approved by supervisor
                'rejected',     // Rejected (with reason)
                'paid',         // Payment processed
            ])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();

            // Details
            $table->text('tasks_performed')->nullable();
            $table->text('supervisor_remarks')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamps();

            // Prevent duplicate entries for same date
            $table->unique(['assignment_id', 'work_date'], 'unique_assignment_date');
        });

        // Payment records for assistantship wages
        Schema::create('assistantship_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('student_assistantship_assignments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Payment period
            $table->date('period_start');
            $table->date('period_end');

            // Hours and amount
            $table->decimal('total_hours', 6, 2);
            $table->decimal('hourly_rate', 8, 2);
            $table->decimal('gross_amount', 10, 2);
            $table->decimal('deductions', 10, 2)->default(0);
            $table->decimal('net_amount', 10, 2);

            // Payment status
            $table->enum('status', [
                'pending',      // Awaiting processing
                'processing',   // Being processed
                'released',     // Payment released
                'on_hold',      // Temporarily held
                'cancelled',    // Cancelled
            ])->default('pending');

            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assistantship_payments');
        Schema::dropIfExists('work_hour_logs');
        Schema::dropIfExists('student_assistantship_assignments');
        Schema::dropIfExists('university_offices');
    }
};
