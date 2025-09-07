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
        Schema::table('interviews', function (Blueprint $table) {
            // Update status enum to include new statuses
            $table->enum('status', ['scheduled', 'completed', 'missed', 'rescheduled', 'cancelled', 'no_show'])->default('scheduled')->change();

            // Interview management fields
            $table->foreignId('interviewer_id')->nullable()->constrained('users')->onDelete('set null')->after('application_id');
            $table->string('location')->nullable()->after('schedule');
            $table->string('interview_type')->default('in_person')->after('location'); // in_person, online, phone
            $table->json('interview_scores')->nullable()->after('status'); // JSON for scoring criteria
            $table->decimal('total_score', 5, 2)->nullable()->after('interview_scores');
            $table->enum('recommendation', ['approved', 'rejected', 'pending'])->nullable()->after('total_score');
            $table->text('interviewer_notes')->nullable()->after('recommendation');
            $table->dateTime('completed_at')->nullable()->after('interviewer_notes');
            $table->json('reschedule_history')->nullable()->after('completed_at'); // Track reschedule requests
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            // Revert status enum to original values
            $table->enum('status', ['scheduled', 'completed', 'missed', 'rescheduled'])->default('scheduled')->change();

            $table->dropForeign(['interviewer_id']);
            $table->dropColumn([
                'interviewer_id',
                'location',
                'interview_type',
                'interview_scores',
                'total_score',
                'recommendation',
                'interviewer_notes',
                'completed_at',
                'reschedule_history',
            ]);
        });
    }
};
