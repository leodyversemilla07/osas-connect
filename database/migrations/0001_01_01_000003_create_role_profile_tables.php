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
        // Student-specific information
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_id')->unique();
            $table->string('course');
            $table->string('major')->default('None');
            $table->string('year_level');
            $table->decimal('current_gwa', 4, 3)->nullable();
            $table->string('guardian_name')->default('Not Applicable');
            $table->string('existing_scholarships')->nullable();

            // Personal Information
            $table->string('civil_status');
            $table->enum('sex', ['Male', 'Female']);
            $table->date('date_of_birth');
            $table->string('place_of_birth');
            $table->string('street');
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('mobile_number');
            $table->string('telephone_number')->nullable();
            $table->boolean('is_pwd')->default(false);
            $table->string('disability_type')->nullable();
            $table->string('religion')->default('Prefer not to say');
            $table->string('residence_type');

            // Family Background
            $table->enum('status_of_parents', [
                'Living Together',
                'Separated',
                'Single Parent',
                'Mother Deceased',
                'Father Deceased',
            ])->nullable();

            // Father's Information
            $table->string('father_name')->nullable();
            $table->integer('father_age')->nullable();
            $table->string('father_address')->nullable();
            $table->string('father_telephone')->nullable();
            $table->string('father_mobile')->nullable();
            $table->string('father_email')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('father_company')->nullable();
            $table->decimal('father_monthly_income', 12, 2)->nullable();
            $table->integer('father_years_service')->nullable();
            $table->string('father_education')->nullable();
            $table->string('father_school')->nullable();
            $table->string('father_unemployment_reason')->nullable();

            // Mother's Information
            $table->string('mother_name')->nullable();
            $table->integer('mother_age')->nullable();
            $table->string('mother_address')->nullable();
            $table->string('mother_telephone')->nullable();
            $table->string('mother_mobile')->nullable();
            $table->string('mother_email')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->string('mother_company')->nullable();
            $table->decimal('mother_monthly_income', 12, 2)->nullable();
            $table->integer('mother_years_service')->nullable();
            $table->string('mother_education')->nullable();
            $table->string('mother_school')->nullable();
            $table->string('mother_unemployment_reason')->nullable();

            // Siblings Information
            $table->integer('total_siblings')->default(0);
            $table->json('siblings')->nullable();

            // Income
            $table->decimal('combined_annual_pay_parents', 12, 2)->default(0);
            $table->decimal('combined_annual_pay_siblings', 12, 2)->default(0);
            $table->decimal('income_from_business', 12, 2)->default(0);
            $table->decimal('income_from_land_rentals', 12, 2)->default(0);
            $table->decimal('income_from_building_rentals', 12, 2)->default(0);
            $table->decimal('retirement_benefits_pension', 12, 2)->default(0);
            $table->decimal('commissions', 12, 2)->default(0);
            $table->decimal('support_from_relatives', 12, 2)->default(0);
            $table->decimal('bank_deposits', 12, 2)->default(0);
            $table->string('other_income_description')->nullable();
            $table->decimal('other_income_amount', 12, 2)->default(0);
            $table->decimal('total_annual_income', 12, 2)->default(0);

            // Appliances
            $table->boolean('has_tv')->default(false);
            $table->boolean('has_radio_speakers_karaoke')->default(false);
            $table->boolean('has_musical_instruments')->default(false);
            $table->boolean('has_computer')->default(false);
            $table->boolean('has_stove')->default(false);
            $table->boolean('has_laptop')->default(false);
            $table->boolean('has_refrigerator')->default(false);
            $table->boolean('has_microwave')->default(false);
            $table->boolean('has_air_conditioner')->default(false);
            $table->boolean('has_electric_fan')->default(false);
            $table->boolean('has_washing_machine')->default(false);
            $table->boolean('has_cellphone')->default(false);
            $table->boolean('has_gaming_box')->default(false);
            $table->boolean('has_dslr_camera')->default(false);

            // Monthly Expenses
            $table->decimal('house_rental', 12, 2)->default(0);
            $table->decimal('food_grocery', 12, 2)->default(0);
            $table->string('car_loan_details')->nullable();
            $table->string('other_loan_details')->nullable();
            $table->decimal('school_bus_payment', 12, 2)->default(0);
            $table->decimal('transportation_expense', 12, 2)->default(0);
            $table->decimal('education_plan_premiums', 12, 2)->default(0);
            $table->decimal('insurance_policy_premiums', 12, 2)->default(0);
            $table->decimal('health_insurance_premium', 12, 2)->default(0);
            $table->decimal('sss_gsis_pagibig_loans', 12, 2)->default(0);
            $table->decimal('clothing_expense', 12, 2)->default(0);
            $table->decimal('utilities_expense', 12, 2)->default(0);
            $table->decimal('communication_expense', 12, 2)->default(0);
            $table->string('helper_details')->nullable();
            $table->string('driver_details')->nullable();
            $table->decimal('medicine_expense', 12, 2)->default(0);
            $table->decimal('doctor_expense', 12, 2)->default(0);
            $table->decimal('hospital_expense', 12, 2)->default(0);
            $table->decimal('recreation_expense', 12, 2)->default(0);
            $table->string('other_monthly_expense_details')->nullable();
            $table->decimal('total_monthly_expenses', 12, 2)->default(0);
            $table->decimal('annualized_monthly_expenses', 12, 2)->default(0);

            // Annual Expenses
            $table->decimal('school_tuition_fee', 12, 2)->default(0);
            $table->decimal('withholding_tax', 12, 2)->default(0);
            $table->decimal('sss_gsis_pagibig_contribution', 12, 2)->default(0);
            $table->string('other_annual_expense_details')->nullable();
            $table->decimal('subtotal_annual_expenses', 12, 2)->default(0);
            $table->decimal('total_annual_expenses', 12, 2)->default(0);

            $table->timestamps();
        });

        // OSAS staff-specific information
        Schema::create('osas_staff_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('staff_id')->unique();
            $table->timestamps();
        });

        // Admin-specific information
        Schema::create('admin_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('admin_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
        Schema::dropIfExists('osas_staff_profiles');
        Schema::dropIfExists('admin_profiles');
    }
};
