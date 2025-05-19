<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    use HasFactory;    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */    
    protected $fillable = [
        // Basic Information
        'user_id',
        'student_id',
        'course',
        'major',
        'year_level',
        'existing_scholarships',
        
        // Personal Information
        'photo_id',
        'civil_status',
        'sex',
        'date_of_birth',
        'place_of_birth',
        'street',
        'barangay',
        'city',
        'province',
        'mobile_number',
        'telephone_number',
        'is_pwd',
        'disability_type',
        'religion',
        'residence_type',
        
        // Family Background
        'status_of_parents',
        
        // Father's Information
        'father_name',
        'father_age',
        'father_address',
        'father_telephone',
        'father_mobile',
        'father_email',
        'father_occupation',
        'father_company',
        'father_monthly_income',
        'father_years_service',
        'father_education',
        'father_school',
        'father_unemployment_reason',
        
        // Mother's Information
        'mother_name',
        'mother_age',
        'mother_address',
        'mother_telephone',
        'mother_mobile',
        'mother_email',
        'mother_occupation',
        'mother_company',
        'mother_monthly_income',
        'mother_years_service',
        'mother_education',
        'mother_school',
        'mother_unemployment_reason',
        
        // Siblings Information
        'total_siblings',
        'siblings',
        
        // Income Information
        'combined_annual_pay_parents',
        'combined_annual_pay_siblings',
        'income_from_business',
        'income_from_land_rentals',
        'income_from_building_rentals',
        'retirement_benefits_pension',
        'commissions',
        'support_from_relatives',
        'bank_deposits',
        'other_income_description',
        'other_income_amount',
        'total_annual_income',
        
        // Appliances
        'has_tv',
        'has_radio_speakers_karaoke',
        'has_musical_instruments',
        'has_computer',
        'has_stove',
        'has_laptop',
        'has_refrigerator',
        'has_microwave',
        'has_air_conditioner',
        'has_electric_fan',
        'has_washing_machine',
        'has_cellphone',
        'has_gaming_box',
        'has_dslr_camera',
        
        // Monthly Expenses
        'house_rental',
        'food_grocery',
        'car_loan_details',
        'other_loan_details',
        'school_bus_payment',
        'transportation_expense',
        'education_plan_premiums',
        'insurance_policy_premiums',
        'health_insurance_premium',
        'sss_gsis_pagibig_loans',
        'clothing_expense',
        'utilities_expense',
        'communication_expense',
        'helper_details',
        'driver_details',
        'medicine_expense',
        'doctor_expense',
        'hospital_expense',
        'recreation_expense',
        'other_monthly_expense_details',
        'total_monthly_expenses',
        'annualized_monthly_expenses',
        
        // Annual Expenses
        'school_tuition_fee',
        'withholding_tax',
        'sss_gsis_pagibig_contribution',
        'other_annual_expense_details',
        'subtotal_annual_expenses',
        'total_annual_expenses',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */    
    protected $casts = [
        'date_of_birth' => 'datetime',
        'is_pwd' => 'boolean',
        
        // Siblings Information
        'siblings' => 'array',
        'total_siblings' => 'integer',
        
        // Income Information
        'combined_annual_pay_parents' => 'decimal:2',
        'combined_annual_pay_siblings' => 'decimal:2',
        'income_from_business' => 'decimal:2',
        'income_from_land_rentals' => 'decimal:2',
        'income_from_building_rentals' => 'decimal:2',
        'retirement_benefits_pension' => 'decimal:2',
        'commissions' => 'decimal:2',
        'support_from_relatives' => 'decimal:2',
        'bank_deposits' => 'decimal:2',
        'other_income_amount' => 'decimal:2',
        'total_annual_income' => 'decimal:2',
        
        // Appliances
        'has_tv' => 'boolean',
        'has_radio_speakers_karaoke' => 'boolean',
        'has_musical_instruments' => 'boolean',
        'has_computer' => 'boolean',
        'has_stove' => 'boolean',
        'has_laptop' => 'boolean',
        'has_refrigerator' => 'boolean',
        'has_microwave' => 'boolean',
        'has_air_conditioner' => 'boolean',
        'has_electric_fan' => 'boolean',
        'has_washing_machine' => 'boolean',
        'has_cellphone' => 'boolean',
        'has_gaming_box' => 'boolean',
        'has_dslr_camera' => 'boolean',
        
        // Monthly & Annual Expenses
        'house_rental' => 'decimal:2',
        'food_grocery' => 'decimal:2',
        'school_bus_payment' => 'decimal:2',
        'transportation_expense' => 'decimal:2',
        'education_plan_premiums' => 'decimal:2',
        'insurance_policy_premiums' => 'decimal:2',
        'health_insurance_premium' => 'decimal:2',
        'sss_gsis_pagibig_loans' => 'decimal:2',
        'clothing_expense' => 'decimal:2',
        'utilities_expense' => 'decimal:2',
        'communication_expense' => 'decimal:2',
        'medicine_expense' => 'decimal:2',
        'doctor_expense' => 'decimal:2',
        'hospital_expense' => 'decimal:2',
        'recreation_expense' => 'decimal:2',
        'total_monthly_expenses' => 'decimal:2',
        'annualized_monthly_expenses' => 'decimal:2',
        'school_tuition_fee' => 'decimal:2',
        'withholding_tax' => 'decimal:2',
        'sss_gsis_pagibig_contribution' => 'decimal:2',
        'subtotal_annual_expenses' => 'decimal:2',
        'total_annual_expenses' => 'decimal:2',
        'commissions' => 'decimal:2',
        'support_from_relatives' => 'decimal:2',
        'bank_deposits' => 'decimal:2',
        'other_income_amount' => 'decimal:2',
        'total_annual_income' => 'decimal:2',
        
        // Appliances
        'has_tv' => 'boolean',
        'has_radio_speakers_karaoke' => 'boolean',
        'has_musical_instruments' => 'boolean',
        'has_computer' => 'boolean',
        'has_stove' => 'boolean',
        'has_laptop' => 'boolean',
        'has_refrigerator' => 'boolean',
        'has_microwave' => 'boolean',
        'has_air_conditioner' => 'boolean',
        'has_electric_fan' => 'boolean',
        'has_washing_machine' => 'boolean',
        'has_cellphone' => 'boolean',
        'has_gaming_box' => 'boolean',
        'has_dslr_camera' => 'boolean',
        
        // Monthly Expenses
        'house_rental' => 'decimal:2',
        'food_grocery' => 'decimal:2',
        'school_bus_payment' => 'decimal:2',
        'transportation_expense' => 'decimal:2',
        'education_plan_premiums' => 'decimal:2',
        'insurance_policy_premiums' => 'decimal:2',
        'health_insurance_premium' => 'decimal:2',
        'sss_gsis_pagibig_loans' => 'decimal:2',
        'clothing_expense' => 'decimal:2',
        'utilities_expense' => 'decimal:2',
        'communication_expense' => 'decimal:2',
        'medicine_expense' => 'decimal:2',
        'doctor_expense' => 'decimal:2',
        'hospital_expense' => 'decimal:2',
        'recreation_expense' => 'decimal:2',
        'total_monthly_expenses' => 'decimal:2',
        'annualized_monthly_expenses' => 'decimal:2',
        
        // Annual Expenses
        'school_tuition_fee' => 'decimal:2',
        'withholding_tax' => 'decimal:2',
        'sss_gsis_pagibig_contribution' => 'decimal:2',
        'subtotal_annual_expenses' => 'decimal:2',
        'total_annual_expenses' => 'decimal:2',
        
        // Parent Monthly Income
        'father_monthly_income' => 'decimal:2',
        'mother_monthly_income' => 'decimal:2',
        
        // Parent Years Service
        'father_years_service' => 'integer',
        'mother_years_service' => 'integer',
    ];

    /**
     * Get the user that owns the student profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the scholarship applications for the student.
     */
    public function scholarshipApplications()
    {
        return $this->hasMany(ScholarshipApplication::class, 'student_id');
    }
    
    /**
     * Get the number of active scholarships for the student.
     */
    public function getActiveScholarshipsAttribute()
    {
        return $this->scholarshipApplications()
            ->where('status', 'approved')
            ->count();
    }
}