<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('scholarship_applications')->onDelete('cascade');
            $table->foreignId('interviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('schedule');
            $table->string('location')->nullable();
            $table->string('interview_type')->default('in_person'); // in_person, online, phone
            $table->enum('status', ['scheduled', 'completed', 'missed', 'rescheduled', 'cancelled', 'no_show'])->default('scheduled');
            $table->json('interview_scores')->nullable(); // JSON for scoring criteria
            $table->decimal('total_score', 5, 2)->nullable();
            $table->enum('recommendation', ['approved', 'rejected', 'pending'])->nullable();
            $table->text('interviewer_notes')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->json('reschedule_history')->nullable(); // Track reschedule requests
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
