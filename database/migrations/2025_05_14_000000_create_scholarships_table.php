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
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->enum('type', [
                'academic_full',
                'academic_partial',
                'student_assistantship',
                'performing_arts_full',
                'performing_arts_partial',
                'economic_assistance',
                'others',
            ]);
            $table->string('type_specification')->nullable();
            $table->decimal('amount', 10, 2);
            $table->date('deadline');
            $table->integer('beneficiaries')->default(0);
            $table->string('funding_source');
            $table->json('eligibility_criteria');
            $table->json('required_documents');
            $table->enum('stipend_schedule', ['monthly', 'semestral'])->default('monthly');
            $table->integer('slots_available')->default(0);
            $table->json('renewal_criteria')->nullable();
            $table->enum('status', ['draft', 'active', 'inactive', 'upcoming'])->default('draft');
            $table->text('admin_remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarships');
    }
};
