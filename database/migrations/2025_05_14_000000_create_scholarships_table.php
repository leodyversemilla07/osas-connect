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
                'Merit-Based',
                'Need-Based',
                'Research',
                'Athletic',
                'Cultural',
                'Student Assistantship'
            ]);
            $table->decimal('amount', 10, 2);
            $table->date('deadline');
            $table->integer('slots')->default(0);
            $table->integer('beneficiaries')->default(0);
            $table->string('funding_source');
            $table->json('eligibility_criteria');
            $table->json('required_documents');
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
