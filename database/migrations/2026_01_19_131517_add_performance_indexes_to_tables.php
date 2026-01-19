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
        // Indexes for scholarship_applications table
        Schema::table('scholarship_applications', function (Blueprint $table) {
            // Index for filtering by status
            $table->index('status', 'idx_scholarship_applications_status');

            // Composite index for status filtering with academic period
            $table->index(['status', 'academic_year', 'semester'], 'idx_scholarship_applications_status_period');

            // Index for application date sorting
            $table->index('applied_at', 'idx_scholarship_applications_applied_at');

            // Composite index for user applications lookup
            $table->index(['user_id', 'status'], 'idx_scholarship_applications_user_status');

            // Index for scholarship-specific applications
            $table->index(['scholarship_id', 'status'], 'idx_scholarship_applications_scholarship_status');

            // Index for priority filtering
            $table->index('priority', 'idx_scholarship_applications_priority');
        });

        // Indexes for documents table
        Schema::table('documents', function (Blueprint $table) {
            // Index for document status filtering
            $table->index('status', 'idx_documents_status');

            // Composite index for application documents lookup
            $table->index(['application_id', 'status'], 'idx_documents_application_status');

            // Index for document type filtering
            $table->index('type', 'idx_documents_type');

            // Index for verification tracking
            $table->index('verified_at', 'idx_documents_verified_at');
        });

        // Indexes for scholarships table
        Schema::table('scholarships', function (Blueprint $table) {
            // Index for filtering active scholarships
            $table->index('status', 'idx_scholarships_status');

            // Composite index for active open scholarships
            $table->index(['status', 'deadline'], 'idx_scholarships_status_deadline');

            // Index for scholarship type filtering
            $table->index('type', 'idx_scholarships_type');

            // Composite index for type and status
            $table->index(['type', 'status'], 'idx_scholarships_type_status');

            // Index for deadline-based queries
            $table->index('deadline', 'idx_scholarships_deadline');
        });

        // Indexes for interviews table
        Schema::table('interviews', function (Blueprint $table) {
            // Index for interview status filtering
            $table->index('status', 'idx_interviews_status');

            // Composite index for scheduled interviews
            $table->index(['status', 'schedule'], 'idx_interviews_status_schedule');

            // Index for interview schedule sorting
            $table->index('schedule', 'idx_interviews_schedule');

            // Composite index for application interviews lookup
            $table->index(['application_id', 'status'], 'idx_interviews_application_status');
        });

        // Indexes for users table
        Schema::table('users', function (Blueprint $table) {
            // Index for role-based filtering
            $table->index('role', 'idx_users_role');

            // Index for active user filtering
            $table->index(['is_active', 'role'], 'idx_users_active_role');

            // Index for login tracking
            $table->index('last_login_at', 'idx_users_last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes from scholarship_applications table
        Schema::table('scholarship_applications', function (Blueprint $table) {
            $table->dropIndex('idx_scholarship_applications_status');
            $table->dropIndex('idx_scholarship_applications_status_period');
            $table->dropIndex('idx_scholarship_applications_applied_at');
            $table->dropIndex('idx_scholarship_applications_user_status');
            $table->dropIndex('idx_scholarship_applications_scholarship_status');
            $table->dropIndex('idx_scholarship_applications_priority');
        });

        // Drop indexes from documents table
        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex('idx_documents_status');
            $table->dropIndex('idx_documents_application_status');
            $table->dropIndex('idx_documents_type');
            $table->dropIndex('idx_documents_verified_at');
        });

        // Drop indexes from scholarships table
        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropIndex('idx_scholarships_status');
            $table->dropIndex('idx_scholarships_status_deadline');
            $table->dropIndex('idx_scholarships_type');
            $table->dropIndex('idx_scholarships_type_status');
            $table->dropIndex('idx_scholarships_deadline');
        });

        // Drop indexes from interviews table
        Schema::table('interviews', function (Blueprint $table) {
            $table->dropIndex('idx_interviews_status');
            $table->dropIndex('idx_interviews_status_schedule');
            $table->dropIndex('idx_interviews_schedule');
            $table->dropIndex('idx_interviews_application_status');
        });

        // Drop indexes from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_role');
            $table->dropIndex('idx_users_active_role');
            $table->dropIndex('idx_users_last_login_at');
        });
    }
};
