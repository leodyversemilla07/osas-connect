<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\StorageService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use mikehaertl\pdftk\Pdf as PdftkPdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PdfController extends Controller
{
    private const TEMPLATE_PATH = 'templates/scholarship_form_fillable.pdf';

    private const CHED_TEMPLATE_PATH = 'templates/fillable_ched_scholarship_program_application_form.pdf';

    private const ANNEX1_TEMPLATE_PATH = 'templates/fillable_annex_1_tdp_application_form.pdf';

    // PDF Form Field Names - Updated to match scholarship_form_variable_names.json
    private const FORM_FIELDS = [
        // Personal Data Fields
        'LAST_NAME' => 'last_name',
        'FIRST_NAME' => 'first_name',
        'MIDDLE_NAME' => 'middle_name',
        'COURSE_YEAR' => 'course_year',
        'CIVIL_STATUS' => 'civil_status',
        'SEX' => 'sex',
        'DATE_OF_BIRTH' => 'date_of_birth',
        'PLACE_OF_BIRTH' => 'place_of_birth',
        'STUDENT_ID' => 'student_id',
        'ADDRESS' => 'address',
        'RESIDENCE_TYPE' => 'residence_type',
        'TELEPHONE_NUMBER' => 'telephone_number',
        'MOBILE_NUMBER' => 'mobile_number',
        'EMAIL' => 'email',
        'RELIGION' => 'religion',
        'IS_PWD' => 'is_pwd',
        'TYPE_OF_DISABILITY' => 'type_of_disability',
        'GUARDIAN_NAME' => 'guardian_name',
        'SCHOLARSHIPS' => 'scholarships',
        'ID_PICTURE' => 'id_picture',

        // Scholarship Type
        'SCHOLARSHIP_TYPE' => 'scholarship_type',

        // Family Background - Parental Status
        'STATUS_OF_PARENTS' => 'status_of_parents',

        // Father Information
        'FATHER_NAME' => 'father_name',
        'FATHER_AGE' => 'father_age',
        'FATHER_PERMANENT_HOME_ADDRESS' => 'father_permanent_home_address',
        'FATHER_TEL_NO' => 'father_tel_no',
        'FATHER_MOBILE_NO' => 'father_mobile_no',
        'FATHER_EMAIL_ADDRESS' => 'father_email_address',
        'FATHER_OCCUPATION_POSITION' => 'father_occupation_position',
        'FATHER_COMPANY' => 'father_company',
        'FATHER_AVERAGE_INCOME' => 'father_average_income',
        'FATHER_NUMBER_OF_YEARS_IN_SERVICE' => 'father_number_of_years_in_service',
        'FATHER_EDUCATIONAL_ATTAINTMENT' => 'father_educational_attaintment',
        'FATHER_SCHOOL_COLLEGE' => 'father_school_college',
        'FATHER_REASONS_FOR_BEING_UNEMPLOYED' => 'father_reasons_for_being_unemployed',

        // Mother Information
        'MOTHER_NAME' => 'mother_name',
        'MOTHER_AGE' => 'mother_age',
        'MOTHER_PERMANENT_HOME_ADDRESS' => 'mother_permanent_home_address',
        'MOTHER_TEL_NO' => 'mother_tel_no',
        'MOTHER_MOBILE_NO' => 'mother_mobile_no',
        'MOTHER_EMAIL_ADDRESS' => 'mother_email_address',
        'MOTHER_OCCUPATION_POSITION' => 'mother_occupation_position',
        'MOTHER_COMPANY' => 'mother_company',
        'MOTHER_AVERAGE_INCOME' => 'mother_average_income',
        'MOTHER_NUMBER_OF_YEARS_IN_SERVICE' => 'mother_number_of_years_in_service',
        'MOTHER_EDUCATIONAL_ATTAINTMENT' => 'mother_educational_attaintment',
        'MOTHER_SCHOOL_COLLEGE' => 'mother_school_college',
        'MOTHER_REASONS_FOR_BEING_UNEMPLOYED' => 'mother_reasons_for_being_unemployed',

        // Siblings Summary
        'TOTAL_NUMBER_OF_SIBLINGS' => 'total_number_of_siblings',
        'NUMBER_WORKING_SIBLINGS' => 'number_working_siblings',
        'NUMBER_STUDYING_SIBLINGS' => 'number_studying_siblings',

        // Sibling 1 Information
        'SIBLING_1_NAME' => 'sibling_1_name',
        'SIBLING_1_AGE_CIVIL_STATUS' => 'sibling_1_age_civil_status',
        'SIBLING_1_PERMANENT_HOME_ADDRESS' => 'sibling_1_permanent_home_address',
        'SIBLING_1_OCCUPATION' => 'sibling_1_occupation',
        'SIBLING_1_AVERAGE_MONTHLY_INCOME' => 'sibling_1_average_monthly_income',
        'SIBLING_1_EDUCATIONAL_ATTAINMENT' => 'sibling_1_educational_attainment',
        'SIBLING_1_SCHOOL_OR_COLLEGE' => 'sibling_1_school_or_college',
        'SIBLING_1_STILL_WITH_YOU' => 'sibling_1_still_with_you',
        'SIBLING_1_SCHOOL_FEES' => 'sibling_1_school_fees',

        // Sibling 2 Information
        'SIBLING_2_NAME' => 'sibling_2_name',
        'SIBLING_2_AGE_CIVIL_STATUS' => 'sibling_2_age_civil_status',
        'SIBLING_2_PERMANENT_HOME_ADDRESS' => 'sibling_2_permanent_home_address',
        'SIBLING_2_OCCUPATION' => 'sibling_2_occupation',
        'SIBLING_2_AVERAGE_MONTHLY_INCOME' => 'sibling_2_average_monthly_income',
        'SIBLING_2_EDUCATIONAL_ATTAINMENT' => 'sibling_2_educational_attainment',
        'SIBLING_2_SCHOOL_OR_COLLEGE' => 'sibling_2_school_or_college',
        'SIBLING_2_STILL_WITH_YOU' => 'sibling_2_still_with_you',
        'SIBLING_2_SCHOOL_FEES' => 'sibling_2_school_fees',

        // Sibling 3 Information
        'SIBLING_3_NAME' => 'sibling_3_name',
        'SIBLING_3_AGE_CIVIL_STATUS' => 'sibling_3_age_civil_status',
        'SIBLING_3_PERMANENT_HOME_ADDRESS' => 'sibling_3_permanent_home_address',
        'SIBLING_3_OCCUPATION' => 'sibling_3_occupation',
        'SIBLING_3_AVERAGE_MONTHLY_INCOME' => 'sibling_3_average_monthly_income',
        'SIBLING_3_EDUCATIONAL_ATTAINMENT' => 'sibling_3_educational_attainment',
        'SIBLING_3_SCHOOL_COLLEGE' => 'sibling_3_school_college',
        'SIBLING_3_STILL_WITH_YOU' => 'sibling_3_still_with_you',
        'SIBLING_3_SCHOOL_FEES' => 'sibling_3_school_fees',

        // Family Income
        'COMBINED_ANNUAL_PAY' => 'combined_annual_pay',
        'COMBINED_ANNUAL_PAY_PHP' => 'combined_annual_pay_PhP',
        'INCOME_FROM_BUSINESS' => 'income_from_business',
        'INCOME_FROM_BUSINESS_PHP' => 'income_from_business_PhP',
        'INCOME_FROM_LAND_RENTALS' => 'income_from_land_rentals',
        'INCOME_FROM_LAND_RENTALS_PHP' => 'income_from_land_rentals_PhP',
        'INCOME_FROM_RES' => 'income_from_res',
        'INCOME_FROM_RES_PHP' => 'income_from_res_PhP',
        'RETIREMENT_BENEFITS_PENSION' => 'retirement_benefits_pension',
        'RETIREMENT_BENEFITS_PENSION_PHP' => 'retirement_benefits_pension_PhP',
        'COMMISIONS' => 'commisions',
        'COMMISIONS_PHP' => 'commisions_PhP',
        'SUPPORT_FROM_RELATIVES' => 'support_from_relatives',
        'SUPPORT_FROM_RELATIVES_PHP' => 'support_from_relatives_PhP',
        'BANK_DEPOSITS' => 'bank_deposits',
        'BANK_DEPOSITS_PHP' => 'bank_deposits_PhP',
        'OTHERS_SPECIFY' => 'others_specify',
        'OTHERS_SPECIFY_PHP' => 'others_specify_PhP',
        'TOTAL_ANNUAL_INCOME' => 'total_annual_income',
        'TOTAL_ANNUAL_INCOME_PHP' => 'total_annual_income_PhP',

        // Family Expenses - Monthly
        'FOOD_GROCERY' => 'food_grocery',
        'CAR_LOAN_AMORTIZATION' => 'car_loan_amortization',
        'OTHER_LOAN_AMORTIZATION' => 'other_loan_amortization',
        'SCHOOL_BUS_PAYMENT' => 'school_bus_payment',
        'TRANSPO_GAS_SCHOOLBUS' => 'transpo_gas_schoolbus',
        'EDUC_PLAN_PREMIUMS' => 'educ_plan_premiums',
        'INSURANCE_POLICY_PREMIUMS' => 'insurance_policy_premiums',
        'HEALTH_INSURANCE_PREMIUM' => 'health_insurance_premium',
        'SSS_GSIS_PAGIBIG_LOANS' => 'sss_gsis_pagibig_loans',
        'SCHOOL_OFFICE_UNIF_CLOTHING' => 'school_office_unif_clothing',
        'ELECTRICITY_WATER_CABLE_COOKING_GAS' => 'electricity_water_cable_cooking_gas',
        'TELEPHONE_CELLPHONE' => 'telephone_cellphone',
        'HELPER_YAYA' => 'helper_yaya',
        'DRIVER' => 'driver',
        'MEDICINES' => 'medicines',
        'DOCTORS_FEE_CONSULTATION' => 'doctor\'s_fee_consultation',
        'HOSPITALIZATION' => 'hospitalization',
        'RECREATION' => 'recreation',
        'TOTAL' => 'total',
        'SUB_TOTAL' => 'sub_total',
        'SUB_TOTAL_X_12_MOTHS' => 'sub_total_x_12_moths',

        // Family Expenses - Annual
        'WITHHOLDING_TAX' => 'withholding_tax',
        'SSS_GSIS_PAGIBIG_CONTRIBUTION' => 'sss_gsis_pagibig_contribution',
        'OTHERS' => 'others',
        'TOTAL_ANNUAL_EXPENSE' => 'total_annual_expense',

        // Other Financial Support
        'HELP_OUT_IN_YOUR_FINANCES' => 'help_out_in_your_finances',
        'IF_YES_NAME' => 'if_yes_name',
        'RELATION_TO_YOU' => 'relation_to_you',
        'MONEY_THEY_SEND' => 'money_they_send',

        // Secondary Education
        'SCHOOL_LOCATION' => 'school_location',
        'YEAR_GRADUATED' => 'year_graduated',
        'HONORS_AWARDS_RECEIVED' => 'honors_awards_received',
        'GENERAL_AVERAGE' => 'general_average',

        // References
        'REFERENCES_NAME_1' => 'references_name_1',
        'RELATIONSHIP_TO_THE_APPLICANT_1' => 'relationship_to_the_applicant_1',
        'CONTACT_NUMBER_1' => 'contact_number_1',
        'REFERENCES_NAME_2' => 'references_name_2',
        'CONTACT_NUMBER_2' => 'contact_number_2',

        // Declaration
        'SIGNATURE_OVER_PRINTED_NAME' => 'signature_over_printed_name',
    ];

    // CHED PDF Form Field Names
    private const CHED_FORM_FIELDS = [
        // Personal Information
        'FIRST_NAME' => 'first_name',
        'MIDDLE_NAME' => 'middle_name',
        'LAST_NAME' => 'last_name',
        'MAIDEN_NAME' => 'maiden_name',
        'SEX' => 'sex',
        'DATE_OF_BIRTH' => 'date_of_birth',
        'PLACE_OF_BIRTH' => 'place_of_birth',
        'CIVIL_STATUS' => 'civil_status',
        'CITIZENSHIP' => 'citizenship',
        'MOBILE_NUMBER' => 'mobile_number',
        'EMAIL_ADDRESS' => 'email_address',
        'PRESENT_ADDRESS' => 'present_address',
        'ZIP_CODE' => 'zip_code',
        'ID_PICTURE' => 'id_picture',
        'ID_PICTURE_AF_IMAGE' => 'id_picture_af_image',

        // Educational Information
        'SCHOOL_SECTOR' => 'school_sector',
        'TYPE_OF_SCHOOL' => 'type_of_school',
        'NAME_OF_LAST_SCHOOL_ATTENDED' => 'name_of_last_school_attended',
        'SCHOOL_INTENDED_TO_ENROLL_IN' => 'school_intended_to_enroll_in',
        'SCHOOL_ADDRESS' => 'school_address',
        'DEGREE_PROGRAM' => 'degree_program',

        // Family Status
        'FATHER_LIVING_DECEASED' => 'father_living_deceased',
        'MOTHER_LIVING_DECEASED' => 'mother_living_deceased',

        // Father Information
        'FATHER_NAME' => 'father_name',
        'FATHER_ADDRESS' => 'father_address',
        'FATHER_CONTACT_NUMBER' => 'father_contact_number',
        'FATHER_OCCUPATION' => 'father_occupation',
        'FATHER_NAME_OF_EMPLOYER' => 'father_name_of_employer',
        'FATHER_EMPLOYER_ADDRESS' => 'father_employer_address',
        'FATHER_HIGHEST_EDUCATIONAL_ATTAINTMENT' => 'father_highest_educational_attaintment',
        'FATHER_TOTAL_PARENTS_TAXABLE_INCOME' => 'father_total_parents_taxable_income',

        // Mother Information
        'MOTHER_NAME' => 'mother_name',
        'MOTHER_ADDRESS' => 'mother_address',
        'MOTHER_CONTACT_NUMBER' => 'mother_contact_number',
        'MOTHER_OCCUPATION' => 'mother_occupation',
        'MOTHER_NAME_OF_EMPLOYER' => 'mother_name_of_employer',
        'MOTHER_EMPLOYER_ADDRESS' => 'mother_employer_address',
        'MOTHER_HIGHEST_EDUCATIONAL_ATTAINTMENT' => 'mother_highest_educational_attaintment',
        'MOTHER_TOTAL_PARENTS_TAXABLE_INCOME' => 'mother_total_parents_taxable_income',

        // Guardian Information
        'GUARDIAN_NAME' => 'guardian_name',
        'GUARDIAN_ADDRESS' => 'guardian_address',
        'GUARDIAN_CONTACT_NUMBER' => 'guardian_contact_number',
        'GUARDIAN_OCCUPATION' => 'guardian_occupation',
        'GUARDIAN_NAME_OF_EMPLOYER' => 'guardian_name_of_employer',
        'GUARDIAN_EMPLOYER_ADDRESS' => 'guardian_employer_address',
        'GUARDIAN_HIGHEST_EDUCATIONAL_ATTAINTMENT' => 'guardian_highest_educational_attaintment',

        // Additional Information
        'NO_OF_SIBLINGS' => 'no_of_siblings',
        'IP_AFFILIATION' => 'ip_affiliation',
        '4PS' => '4ps',
        'OTHER_ASSISTANCE' => 'other_assistance',
        'TYPE_1' => 'type_1',
        'TYPE_2' => 'type_2',
        'GRANTEE_INSTITUTION_AGENCY_1' => 'grantee_institution_agency_1',
        'DATE_ACCOMPLISHED' => 'date_accomplished',
        'TYPE_OF_DISABILITY' => 'type_of_disability',
        'SIGNATURE_OVER_PRINTED_NAME_OF_APPLICANT' => 'signature_over_printed_name_of_applicant',
    ];

    // Annex 1 TPDF Form Field Names
    private const ANNEX1_FORM_FIELDS = [
        // Personal Information
        'LAST_NAME' => 'last_name',
        'FIRST_NAME' => 'first_name',
        'MIDDLE_NAME' => 'middle_name',
        'MAIDEN_NAME' => 'maiden_name',
        'DATE_OF_BIRTH' => 'date_of_birth',
        'PLACE_OF_BIRTH' => 'place_of_birth',
        'CITIZENSHIP' => 'citizenship',
        'MOBILE_NUMBER' => 'mobile_number',
        'EMAIL_ADDRESS' => 'email_address',

        // Address Information
        'STREET_BARANGAY' => 'street_barangay',
        'TOWN_CITY_MUNICIPALITY' => 'town_city_municipality',
        'PROVINCE' => 'province',
        'ZIP_CODE' => 'zip_code',

        // Educational Information
        'NAME_OF_SCHOOL_ATTENDED' => 'name_of_school_attended',
        'SCHOOL_ID_NUMBER' => 'school_id_number',
        'SCHOOL_ADDRESS' => 'school_address',
        'YEAR_LEVEL' => 'year_level',
        'COURSE' => 'course',

        // Additional Information
        'TYPE_OF_DISABILITY' => 'type_of_disability',
        'TRIBAL_MEMBERSHIP' => 'tribal_membership',

        // Family Information
        'FATHER_LIVING_DECEASED_NAME' => 'father_living_deceased_name',
        'MOTHER_LIVING_DECEASED_NAME' => 'mother_living_deceased_name',
        'FATHER_LIVING_DECEASED_ADDRESS' => 'father_living_deceased_address',
        'FATHER_LIVING_DECEASED_OCCUPATION' => 'father_living_deceased_occupation',
        'MOTHER_LIVING_DECEASED_ADDRESS' => 'mother_living_deceased_address',
        'MOTHER_LIVING_DECEASED_OCCUPATION' => 'mother_living_deceased_occupation',

        // Specifications
        'PLEASE_SPECIFY_1' => 'please_specify_1',
        'PLEASE_SPECIFY_2' => 'please_specify_2',

        // Form Completion
        'DATE_ACCOMPLISHED' => 'date_accomplished',

        // Images and Signatures
        'ID_PICTURE_AF_IMAGE' => 'id_picture_af_image',
        'SIGNATURE_OVER_PRINTED_NAME_OF_APPLICANT' => 'signature_over_printed_name_of_applicant',

        // Checkboxes/Radio buttons (these are the special field names)
        'SEX_MALE' => 'sex: male',
        'SCHOOL_SECTOR_PUBLIC' => 'school_sector: public',
        'FATHER_LIVING_DECEASED_LIVING' => 'father_living_deceased: living',
        'MOTHER_LIVING_DECEASED_LIVING' => 'mother_living_deceased: living',
        'OTHER_EDUCATIONAL_ASSISTANCE_YES' => 'other_educational_assistance: yes',
        'CHED_REGIONAL_OFFICE_IV_B' => 'ched_regional_office: IV-B',
    ];

    // Default values for form fields
    private const DEFAULT_VALUES = [
        'DEFAULT_TEXT' => 'N/A',
        'DEFAULT_NUMBER' => '0',
        'DEFAULT_MONEY' => '0.00',
        'DEFAULT_PWD_STATUS' => 'no',
        'DEFAULT_RESIDENCE_TYPE' => 'parent\'s_house',
        'DEFAULT_EMAIL' => 'no-email@example.com',
        'DEFAULT_PARENT_EMAIL' => 'parent-not-provided@example.com',
        'DEFAULT_PHONE' => 'Not provided',
        'DEFAULT_ADDRESS' => 'Address not provided',
        'DEFAULT_DATE' => 'Not provided',
        'DEFAULT_CIVIL_STATUS' => 'Single',
        'DEFAULT_SEX' => 'Not specified',
        'DEFAULT_RELIGION' => 'Not specified',
    ];

    // Course abbreviation mapping for PDF forms
    private const COURSE_ABBREVIATIONS = [
        'Bachelor of Science in Information Technology' => 'BSIT',
        'Bachelor of Science in Computer Engineering' => 'BSCpE',
        'Bachelor of Science in Tourism Management' => 'BSTM',
        'Bachelor of Science in Hospitality Management' => 'BSHM',
        'Bachelor of Science in Criminology' => 'BSCrim',
        'Bachelor of Arts in Political Science' => 'AB PolSci',
        'Bachelor of Secondary Education' => 'BSEd',
        'Bachelor of Elementary Education' => 'BEEd',
        'Bachelor of Science in Fisheries' => 'BSF',
    ];

    /**
     * Get the local file path for an image stored in storage
     * Downloads CloudCube images temporarily for PDF processing
     */
    private function getImagePathForPdf(string $photoId): string
    {
        if (empty($photoId)) {
            return '';
        }

        $disk = StorageService::getDisk();

        if ($disk === 'cloudcube') {
            // For CloudCube, download the image temporarily
            try {
                $imageContents = Storage::disk('cloudcube')->get($photoId);
                if ($imageContents) {
                    $tempPath = storage_path('app/temp/'.basename($photoId));

                    // Ensure temp directory exists
                    if (! file_exists(dirname($tempPath))) {
                        mkdir(dirname($tempPath), 0755, true);
                    }

                    file_put_contents($tempPath, $imageContents);

                    return $tempPath;
                }
            } catch (Exception $e) {
                logger()->error('Failed to download CloudCube image: '.$e->getMessage());

                return '';
            }
        } else {
            // For local storage, get the full path
            $photoPath = storage_path('app/public/'.$photoId);

            if (file_exists($photoPath) && is_readable($photoPath)) {
                return $photoPath;
            }

            // Try alternate path format
            $alternativePath = public_path('storage/'.$photoId);
            if (file_exists($alternativePath) && is_readable($alternativePath)) {
                return $alternativePath;
            }
        }

        return '';
    }

    public function generatePdf(Request $request, User $user)
    {
        try {
            // Allow all user roles to generate PDF files
            // No role restriction needed

            // Load and check student profile with all necessary fields
            $user->load([
                'studentProfile' => function ($query) {
                    $query->select(
                        'id', 'user_id', 'student_id', 'course', 'major', 'year_level',
                        'guardian_name', 'existing_scholarships', 'civil_status', 'sex',
                        'date_of_birth', 'place_of_birth', 'street', 'barangay', 'city',
                        'province', 'mobile_number', 'telephone_number', 'is_pwd',
                        'disability_type', 'religion', 'residence_type', 'status_of_parents',
                        'father_name', 'father_age', 'father_occupation', 'father_monthly_income',
                        'father_mobile', 'father_telephone', 'father_email', 'father_company',
                        'father_years_service', 'father_education', 'father_school', 'father_unemployment_reason',
                        'mother_name', 'mother_age', 'mother_occupation', 'mother_monthly_income',
                        'mother_mobile', 'mother_telephone', 'mother_email', 'mother_company',
                        'mother_years_service', 'mother_education', 'mother_school', 'mother_unemployment_reason',
                        'total_siblings', 'siblings', 'combined_annual_pay_parents', 'combined_annual_pay_siblings',
                        'income_from_business', 'income_from_land_rentals', 'income_from_building_rentals',
                        'retirement_benefits_pension', 'commissions', 'support_from_relatives', 'bank_deposits',
                        'other_income_description', 'other_income_amount', 'total_annual_income',
                        'total_monthly_expenses', 'total_annual_expenses'
                    );
                },
            ]);

            if (! $user->studentProfile) {
                return response('Student profile not found.', 404);
            }

            // Get template with detailed error logging
            $templatePath = public_path(self::TEMPLATE_PATH);
            if (! file_exists($templatePath)) {
                logger()->error('PDF template not found at: '.$templatePath);

                return response('PDF template not found at: '.$templatePath, 404);
            }

            $pdfTemplate = file_get_contents($templatePath);
            if ($pdfTemplate === false) {
                logger()->error('Failed to read PDF template from: '.$templatePath);

                return response('Failed to read PDF template', 500);
            }

            // Prepare files
            ['tempOutput' => $tempOutput] = $this->prepareTempFiles();

            // Generate PDF
            $response = $this->generatePdfFile($templatePath, $tempOutput, $user);

            return $response;
        } catch (Exception $e) {
            logger()->error('PDF generation failed: '.$e->getMessage());

            return response('Error generating PDF: '.$e->getMessage(), 500);
        }
    }

    public function generateChedPdf(Request $request, User $user)
    {
        try {
            // Allow all user roles to generate CHED PDF files
            // No role restriction needed

            // Load and check student profile with all necessary fields
            $user->load([
                'studentProfile' => function ($query) {
                    $query->select(
                        'id', 'user_id', 'student_id', 'course', 'major', 'year_level',
                        'guardian_name', 'existing_scholarships', 'civil_status', 'sex',
                        'date_of_birth', 'place_of_birth', 'street', 'barangay', 'city',
                        'province', 'mobile_number', 'telephone_number', 'is_pwd',
                        'disability_type', 'religion', 'residence_type', 'status_of_parents',
                        'father_name', 'father_age', 'father_occupation', 'father_monthly_income',
                        'father_mobile', 'father_telephone', 'father_email', 'father_company',
                        'father_years_service', 'father_education', 'father_school', 'father_unemployment_reason',
                        'mother_name', 'mother_age', 'mother_occupation', 'mother_monthly_income',
                        'mother_mobile', 'mother_telephone', 'mother_email', 'mother_company',
                        'mother_years_service', 'mother_education', 'mother_school', 'mother_unemployment_reason',
                        'total_siblings', 'siblings', 'combined_annual_pay_parents', 'combined_annual_pay_siblings',
                        'income_from_business', 'income_from_land_rentals', 'income_from_building_rentals',
                        'retirement_benefits_pension', 'commissions', 'support_from_relatives', 'bank_deposits',
                        'other_income_description', 'other_income_amount', 'total_annual_income',
                        'total_monthly_expenses', 'total_annual_expenses'
                    );
                },
            ]);

            if (! $user->studentProfile) {
                return response('Student profile not found.', 404);
            }

            // Get CHED template with detailed error logging
            $templatePath = public_path(self::CHED_TEMPLATE_PATH);
            if (! file_exists($templatePath)) {
                logger()->error('CHED PDF template not found at: '.$templatePath);

                return response('CHED PDF template not found at: '.$templatePath, 404);
            }

            $pdfTemplate = file_get_contents($templatePath);
            if ($pdfTemplate === false) {
                logger()->error('Failed to read CHED PDF template from: '.$templatePath);

                return response('Failed to read CHED PDF template', 500);
            }

            // Prepare files
            ['tempOutput' => $tempOutput] = $this->prepareTempFiles();

            // Generate CHED PDF
            $response = $this->generateChedPdfFile($templatePath, $tempOutput, $user);

            return $response;
        } catch (Exception $e) {
            logger()->error('CHED PDF generation failed: '.$e->getMessage());

            return response('Error generating CHED PDF: '.$e->getMessage(), 500);
        }
    }

    public function generateAnnex1Pdf(Request $request, User $user)
    {
        try {
            // Allow all user roles to generate Annex 1 PDF files
            // No role restriction needed

            // Load and check student profile with all necessary fields
            $user->load([
                'studentProfile' => function ($query) {
                    $query->select(
                        'id', 'user_id', 'student_id', 'course', 'major', 'year_level',
                        'guardian_name', 'existing_scholarships', 'civil_status', 'sex',
                        'date_of_birth', 'place_of_birth', 'street', 'barangay', 'city',
                        'province', 'mobile_number', 'telephone_number', 'is_pwd',
                        'disability_type', 'religion', 'residence_type', 'status_of_parents',
                        'father_name', 'father_age', 'father_occupation', 'father_monthly_income',
                        'father_mobile', 'father_telephone', 'father_email', 'father_company',
                        'father_years_service', 'father_education', 'father_school', 'father_unemployment_reason',
                        'mother_name', 'mother_age', 'mother_occupation', 'mother_monthly_income',
                        'mother_mobile', 'mother_telephone', 'mother_email', 'mother_company',
                        'mother_years_service', 'mother_education', 'mother_school', 'mother_unemployment_reason',
                        'total_siblings', 'siblings', 'combined_annual_pay_parents', 'combined_annual_pay_siblings',
                        'income_from_business', 'income_from_land_rentals', 'income_from_building_rentals',
                        'retirement_benefits_pension', 'commissions', 'support_from_relatives', 'bank_deposits',
                        'other_income_description', 'other_income_amount', 'total_annual_income',
                        'total_monthly_expenses', 'total_annual_expenses'
                    );
                },
            ]);

            if (! $user->studentProfile) {
                return response('Student profile not found.', 404);
            }

            // Get Annex 1 template with detailed error logging
            $templatePath = public_path(self::ANNEX1_TEMPLATE_PATH);
            if (! file_exists($templatePath)) {
                logger()->error('Annex 1 PDF template not found at: '.$templatePath);

                return response('Annex 1 PDF template not found at: '.$templatePath, 404);
            }

            $pdfTemplate = file_get_contents($templatePath);
            if ($pdfTemplate === false) {
                logger()->error('Failed to read Annex 1 PDF template from: '.$templatePath);

                return response('Failed to read Annex 1 PDF template', 500);
            }

            // Prepare files
            ['tempOutput' => $tempOutput] = $this->prepareTempFiles();

            // Generate Annex 1 PDF
            $response = $this->generateAnnex1PdfFile($templatePath, $tempOutput, $user);

            return $response;
        } catch (Exception $e) {
            logger()->error('Annex 1 PDF generation failed: '.$e->getMessage());

            return response('Error generating Annex 1 PDF: '.$e->getMessage(), 500);
        }
    }

    private function prepareTempFiles(): array
    {
        // Create generated_pdfs directory if it doesn't exist
        $pdfDir = storage_path('app/generated_pdfs');
        if (! file_exists($pdfDir)) {
            mkdir($pdfDir, 0777, true);
        }

        $tempId = time().'_'.Str::random(8);

        return [
            'tempOutput' => $pdfDir.DIRECTORY_SEPARATOR.'output_'.$tempId.'.pdf',
        ];
    }

    private function generatePdfFile(string $templatePath, string $tempOutput, User $user): BinaryFileResponse
    {
        try {
            // Check if pdftk is available
            if (! $this->isPdftkAvailable()) {
                throw new Exception('PDFTK is not available on this system. Please install PDFTK or configure the appropriate buildpack on Heroku.');
            }

            $pdftkCommand = $this->getPdftkCommand();
            if (! $pdftkCommand) {
                throw new Exception('PDFTK is not available on this system. Please install PDFTK or configure the appropriate buildpack on Heroku.');
            }

            // Fill the form directly from the original template
            $pdf = new PdftkPdf($templatePath, ['command' => $pdftkCommand]);
            $result = $pdf->fillForm($this->prepareFormData($user))
                ->flatten()
                ->compress()
                ->saveAs($tempOutput);

            if (! $result) {
                throw new Exception($pdf->getError() ?: 'Unknown error while generating PDF');
            }

            if (! file_exists($tempOutput) || ! is_readable($tempOutput)) {
                throw new Exception('Failed to generate or read PDF output file');
            }

            // Generate filename
            $safeName = preg_replace("/[^a-zA-Z0-9_\-\.]/", '_', $user->last_name.'_'.$user->first_name);
            $fileName = 'scholarship_application_'.$safeName.'_'.date('Y-m-d_His').'.pdf';

            // Return the PDF as a download response with automatic cleanup
            return response()->file(
                $tempOutput,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
                ]
            )->deleteFileAfterSend(true);

        } catch (Exception $e) {
            $this->cleanup($tempOutput);
            throw $e;
        }
    }

    private function generateChedPdfFile(string $templatePath, string $tempOutput, User $user): BinaryFileResponse
    {
        try {
            // Check if pdftk is available
            $pdftkCommand = $this->getPdftkCommand();
            if (! $pdftkCommand) {
                throw new Exception('PDFTK is not available on this system. Please install PDFTK or configure the appropriate buildpack on Heroku.');
            }

            // Fill the CHED form directly from the original template
            $pdf = new PdftkPdf($templatePath, ['command' => $pdftkCommand]);
            $result = $pdf->fillForm($this->prepareChedFormData($user))
                ->flatten()
                ->compress()
                ->saveAs($tempOutput);

            if (! $result) {
                throw new Exception($pdf->getError() ?: 'Unknown error while generating CHED PDF');
            }

            if (! file_exists($tempOutput) || ! is_readable($tempOutput)) {
                throw new Exception('Failed to generate or read CHED PDF output file');
            }

            // Generate filename
            $safeName = preg_replace("/[^a-zA-Z0-9_\-\.]/", '_', $user->last_name.'_'.$user->first_name);
            $fileName = 'ched_scholarship_application_'.$safeName.'_'.date('Y-m-d_His').'.pdf';

            // Return the PDF as a download response with automatic cleanup
            return response()->file(
                $tempOutput,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
                ]
            )->deleteFileAfterSend(true);

        } catch (Exception $e) {
            $this->cleanup($tempOutput);
            throw $e;
        }
    }

    private function generateAnnex1PdfFile(string $templatePath, string $tempOutput, User $user): BinaryFileResponse
    {
        try {
            // Check if pdftk is available
            $pdftkCommand = $this->getPdftkCommand();
            if (! $pdftkCommand) {
                throw new Exception('PDFTK is not available on this system. Please install PDFTK or configure the appropriate buildpack on Heroku.');
            }

            // Fill the Annex 1 form directly from the original template
            $pdf = new PdftkPdf($templatePath, ['command' => $pdftkCommand]);
            $result = $pdf->fillForm($this->prepareAnnex1FormData($user))
                ->flatten()
                ->compress()
                ->saveAs($tempOutput);

            if (! $result) {
                throw new Exception($pdf->getError() ?: 'Unknown error while generating Annex 1 PDF');
            }

            if (! file_exists($tempOutput) || ! is_readable($tempOutput)) {
                throw new Exception('Failed to generate or read Annex 1 PDF output file');
            }

            // Generate filename
            $safeName = preg_replace("/[^a-zA-Z0-9_\-\.]/", '_', $user->last_name.'_'.$user->first_name);
            $fileName = 'annex1_tpdf_application_'.$safeName.'_'.date('Y-m-d_His').'.pdf';

            // Return the PDF as a download response with automatic cleanup
            return response()->file(
                $tempOutput,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
                ]
            )->deleteFileAfterSend(true);

        } catch (Exception $e) {
            $this->cleanup($tempOutput);
            throw $e;
        }
    }

    private function prepareFormData(User $user): array
    {
        $profile = $user->studentProfile;

        // Ensure all form data is properly filled with guaranteed non-empty values
        $formData = [];

        // Helper function to ensure non-empty string values
        $ensureValue = function ($value, $default = null) {
            $default = $default ?? self::DEFAULT_VALUES['DEFAULT_TEXT'];

            return ! empty(trim($value ?? '')) ? trim($value) : $default;
        };

        // Helper function to format monetary values safely
        $formatMoney = function ($value) {
            $numericValue = is_numeric($value) ? (float) $value : 0;

            return number_format($numericValue, 2);
        };

        // Helper function to format date safely
        $formatDate = function ($date) {
            try {
                if ($date && method_exists($date, 'format')) {
                    return $date->format('m/d/Y');
                }

                return self::DEFAULT_VALUES['DEFAULT_DATE'];
            } catch (Exception $e) {
                return self::DEFAULT_VALUES['DEFAULT_DATE'];
            }
        };

        // Build address string with proper validation
        $addressParts = array_filter([
            $profile->street ?? '',
            $profile->barangay ?? '',
            $profile->city ?? '',
            $profile->province ?? '',
        ], fn ($part) => ! empty(trim($part)));

        // Prepare course year string with validation
        $courseYearStr = '';
        if (! empty($profile->course)) {
            $courseYearStr = trim($profile->course);
            if (! empty($profile->major)) {
                $courseYearStr .= ' Major in '.trim($profile->major);
            }
            if (! empty($profile->year_level)) {
                $courseYearStr .= ' - '.trim($profile->year_level);
            }
        }

        // Personal Data Fields - Based on available StudentProfile fields
        $formData[self::FORM_FIELDS['LAST_NAME']] = $ensureValue($user->last_name);
        $formData[self::FORM_FIELDS['FIRST_NAME']] = $ensureValue($user->first_name);
        $formData[self::FORM_FIELDS['MIDDLE_NAME']] = $ensureValue($user->middle_name);
        $formData[self::FORM_FIELDS['COURSE_YEAR']] = $ensureValue($courseYearStr);
        $formData[self::FORM_FIELDS['CIVIL_STATUS']] = $ensureValue($profile->civil_status, self::DEFAULT_VALUES['DEFAULT_CIVIL_STATUS']);
        $formData[self::FORM_FIELDS['SEX']] = $ensureValue($profile->sex, self::DEFAULT_VALUES['DEFAULT_SEX']);
        $formData[self::FORM_FIELDS['DATE_OF_BIRTH']] = $formatDate($profile->date_of_birth);
        $formData[self::FORM_FIELDS['PLACE_OF_BIRTH']] = $ensureValue($profile->place_of_birth);
        $formData[self::FORM_FIELDS['STUDENT_ID']] = $ensureValue($profile->student_id);
        $formData[self::FORM_FIELDS['ADDRESS']] = ! empty($addressParts) ? implode(', ', $addressParts) : self::DEFAULT_VALUES['DEFAULT_ADDRESS'];

        // Handle residence type with proper formatting
        $residenceType = self::DEFAULT_VALUES['DEFAULT_RESIDENCE_TYPE'];
        if (! empty($profile->residence_type)) {
            $residenceType = strtolower(str_replace(' ', '_', trim($profile->residence_type)));
        }
        $formData[self::FORM_FIELDS['RESIDENCE_TYPE']] = $residenceType;

        $formData[self::FORM_FIELDS['TELEPHONE_NUMBER']] = $ensureValue($profile->telephone_number, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::FORM_FIELDS['MOBILE_NUMBER']] = $ensureValue($profile->mobile_number, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::FORM_FIELDS['EMAIL']] = $ensureValue($user->email, self::DEFAULT_VALUES['DEFAULT_EMAIL']);
        $formData[self::FORM_FIELDS['RELIGION']] = $ensureValue($profile->religion, self::DEFAULT_VALUES['DEFAULT_RELIGION']);
        $formData[self::FORM_FIELDS['IS_PWD']] = $profile->is_pwd ? 'yes' : self::DEFAULT_VALUES['DEFAULT_PWD_STATUS'];
        $formData[self::FORM_FIELDS['TYPE_OF_DISABILITY']] = $ensureValue($profile->disability_type);
        $formData[self::FORM_FIELDS['GUARDIAN_NAME']] = $ensureValue($profile->guardian_name);
        $formData[self::FORM_FIELDS['SCHOLARSHIPS']] = $ensureValue($profile->existing_scholarships);

        // Student Photo - Handle photo from user record
        $photoPath = $this->getImagePathForPdf($user->photo_id ?? '');

        // ID Picture - Same photo as student photo for PDF form field
        $formData[self::FORM_FIELDS['ID_PICTURE']] = $photoPath;

        // Scholarship Type - Default to scholarship application
        $formData[self::FORM_FIELDS['SCHOLARSHIP_TYPE']] = $ensureValue(null, 'Academic Scholarship');

        // Family Background - Parental Status
        $formData[self::FORM_FIELDS['STATUS_OF_PARENTS']] = $ensureValue($profile->status_of_parents);

        // Father Information - Map available fields
        $formData[self::FORM_FIELDS['FATHER_NAME']] = $ensureValue($profile->father_name);
        $formData[self::FORM_FIELDS['FATHER_AGE']] = $ensureValue($profile->father_age, '0');
        $formData[self::FORM_FIELDS['FATHER_PERMANENT_HOME_ADDRESS']] = $formData[self::FORM_FIELDS['ADDRESS']]; // Use same as student address
        $formData[self::FORM_FIELDS['FATHER_TEL_NO']] = $ensureValue($profile->father_telephone ?? null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::FORM_FIELDS['FATHER_MOBILE_NO']] = $ensureValue($profile->father_mobile ?? null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::FORM_FIELDS['FATHER_EMAIL_ADDRESS']] = $ensureValue($profile->father_email ?? null, self::DEFAULT_VALUES['DEFAULT_PARENT_EMAIL']);
        $formData[self::FORM_FIELDS['FATHER_OCCUPATION_POSITION']] = $ensureValue($profile->father_occupation);
        $formData[self::FORM_FIELDS['FATHER_COMPANY']] = $ensureValue($profile->father_company ?? null);
        $formData[self::FORM_FIELDS['FATHER_AVERAGE_INCOME']] = $formatMoney($profile->father_monthly_income);
        $formData[self::FORM_FIELDS['FATHER_NUMBER_OF_YEARS_IN_SERVICE']] = $ensureValue($profile->father_years_service ?? null, '0');
        $formData[self::FORM_FIELDS['FATHER_EDUCATIONAL_ATTAINTMENT']] = $ensureValue($profile->father_education ?? null);
        $formData[self::FORM_FIELDS['FATHER_SCHOOL_COLLEGE']] = $ensureValue($profile->father_school ?? null);
        $formData[self::FORM_FIELDS['FATHER_REASONS_FOR_BEING_UNEMPLOYED']] = $ensureValue($profile->father_unemployment_reason ?? null);

        // Mother Information - Map available fields
        $formData[self::FORM_FIELDS['MOTHER_NAME']] = $ensureValue($profile->mother_name);
        $formData[self::FORM_FIELDS['MOTHER_AGE']] = $ensureValue($profile->mother_age, '0');
        $formData[self::FORM_FIELDS['MOTHER_PERMANENT_HOME_ADDRESS']] = $formData[self::FORM_FIELDS['ADDRESS']]; // Use same as student address
        $formData[self::FORM_FIELDS['MOTHER_TEL_NO']] = $ensureValue($profile->mother_telephone ?? null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::FORM_FIELDS['MOTHER_MOBILE_NO']] = $ensureValue($profile->mother_mobile ?? null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::FORM_FIELDS['MOTHER_EMAIL_ADDRESS']] = $ensureValue($profile->mother_email ?? null, self::DEFAULT_VALUES['DEFAULT_PARENT_EMAIL']);
        $formData[self::FORM_FIELDS['MOTHER_OCCUPATION_POSITION']] = $ensureValue($profile->mother_occupation);
        $formData[self::FORM_FIELDS['MOTHER_COMPANY']] = $ensureValue($profile->mother_company ?? null);
        $formData[self::FORM_FIELDS['MOTHER_AVERAGE_INCOME']] = $formatMoney($profile->mother_monthly_income);
        $formData[self::FORM_FIELDS['MOTHER_NUMBER_OF_YEARS_IN_SERVICE']] = $ensureValue($profile->mother_years_service ?? null, '0');
        $formData[self::FORM_FIELDS['MOTHER_EDUCATIONAL_ATTAINTMENT']] = $ensureValue($profile->mother_education ?? null);
        $formData[self::FORM_FIELDS['MOTHER_SCHOOL_COLLEGE']] = $ensureValue($profile->mother_school ?? null);
        $formData[self::FORM_FIELDS['MOTHER_REASONS_FOR_BEING_UNEMPLOYED']] = $ensureValue($profile->mother_unemployment_reason ?? null);

        // Siblings Summary - using defaults since working_siblings and studying_siblings don't exist in schema
        $formData[self::FORM_FIELDS['TOTAL_NUMBER_OF_SIBLINGS']] = $ensureValue($profile->total_siblings, self::DEFAULT_VALUES['DEFAULT_NUMBER']);
        $formData[self::FORM_FIELDS['NUMBER_WORKING_SIBLINGS']] = $ensureValue(null, '0');
        $formData[self::FORM_FIELDS['NUMBER_STUDYING_SIBLINGS']] = $ensureValue(null, '0');

        // Sibling Information - Use defaults for now as these fields might not exist in current schema
        for ($i = 1; $i <= 3; $i++) {
            $formData[self::FORM_FIELDS["SIBLING_{$i}_NAME"]] = $ensureValue(null);
            $formData[self::FORM_FIELDS["SIBLING_{$i}_AGE_CIVIL_STATUS"]] = $ensureValue(null);
            $formData[self::FORM_FIELDS["SIBLING_{$i}_PERMANENT_HOME_ADDRESS"]] = $ensureValue(null);
            $formData[self::FORM_FIELDS["SIBLING_{$i}_OCCUPATION"]] = $ensureValue(null);
            $formData[self::FORM_FIELDS["SIBLING_{$i}_AVERAGE_MONTHLY_INCOME"]] = $formatMoney(0);
            $formData[self::FORM_FIELDS["SIBLING_{$i}_EDUCATIONAL_ATTAINMENT"]] = $ensureValue(null);
            $siblingSchoolField = $i == 3 ? "SIBLING_{$i}_SCHOOL_COLLEGE" : "SIBLING_{$i}_SCHOOL_OR_COLLEGE";
            $formData[self::FORM_FIELDS[$siblingSchoolField]] = $ensureValue(null);
            $formData[self::FORM_FIELDS["SIBLING_{$i}_STILL_WITH_YOU"]] = $ensureValue(null, 'No');
            $formData[self::FORM_FIELDS["SIBLING_{$i}_SCHOOL_FEES"]] = $formatMoney(0);
        }

        // Family Income - Map available fields and use defaults for missing ones
        $formData[self::FORM_FIELDS['COMBINED_ANNUAL_PAY']] = $ensureValue(null, 'Yes');
        $formData[self::FORM_FIELDS['COMBINED_ANNUAL_PAY_PHP']] = $formatMoney($profile->combined_annual_pay_parents + $profile->combined_annual_pay_siblings);
        $formData[self::FORM_FIELDS['INCOME_FROM_BUSINESS']] = $profile->income_from_business > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['INCOME_FROM_BUSINESS_PHP']] = $formatMoney($profile->income_from_business ?? 0);
        $formData[self::FORM_FIELDS['INCOME_FROM_LAND_RENTALS']] = $profile->income_from_land_rentals > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['INCOME_FROM_LAND_RENTALS_PHP']] = $formatMoney($profile->income_from_land_rentals ?? 0);
        $formData[self::FORM_FIELDS['INCOME_FROM_RES']] = $profile->income_from_building_rentals > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['INCOME_FROM_RES_PHP']] = $formatMoney($profile->income_from_building_rentals ?? 0);
        $formData[self::FORM_FIELDS['RETIREMENT_BENEFITS_PENSION']] = $profile->retirement_benefits_pension > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['RETIREMENT_BENEFITS_PENSION_PHP']] = $formatMoney($profile->retirement_benefits_pension ?? 0);
        $formData[self::FORM_FIELDS['COMMISIONS']] = $profile->commissions > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['COMMISIONS_PHP']] = $formatMoney($profile->commissions ?? 0);
        $formData[self::FORM_FIELDS['SUPPORT_FROM_RELATIVES']] = $profile->support_from_relatives > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['SUPPORT_FROM_RELATIVES_PHP']] = $formatMoney($profile->support_from_relatives ?? 0);
        $formData[self::FORM_FIELDS['BANK_DEPOSITS']] = $profile->bank_deposits > 0 ? 'Yes' : 'No';
        $formData[self::FORM_FIELDS['BANK_DEPOSITS_PHP']] = $formatMoney($profile->bank_deposits ?? 0);
        $formData[self::FORM_FIELDS['OTHERS_SPECIFY']] = $ensureValue($profile->other_income_description);
        $formData[self::FORM_FIELDS['OTHERS_SPECIFY_PHP']] = $formatMoney($profile->other_income_amount ?? 0);
        $formData[self::FORM_FIELDS['TOTAL_ANNUAL_INCOME']] = $ensureValue(null, 'Yes');
        $formData[self::FORM_FIELDS['TOTAL_ANNUAL_INCOME_PHP']] = $formatMoney($profile->total_annual_income);

        // Family Expenses - Monthly (use defaults for now)
        $monthlyExpenseFields = [
            'FOOD_GROCERY', 'CAR_LOAN_AMORTIZATION', 'OTHER_LOAN_AMORTIZATION', 'SCHOOL_BUS_PAYMENT',
            'TRANSPO_GAS_SCHOOLBUS', 'EDUC_PLAN_PREMIUMS', 'INSURANCE_POLICY_PREMIUMS',
            'HEALTH_INSURANCE_PREMIUM', 'SSS_GSIS_PAGIBIG_LOANS', 'SCHOOL_OFFICE_UNIF_CLOTHING',
            'ELECTRICITY_WATER_CABLE_COOKING_GAS', 'TELEPHONE_CELLPHONE', 'HELPER_YAYA',
            'DRIVER', 'MEDICINES', 'DOCTORS_FEE_CONSULTATION', 'HOSPITALIZATION', 'RECREATION',
            'TOTAL', 'SUB_TOTAL', 'SUB_TOTAL_X_12_MOTHS',
        ];

        foreach ($monthlyExpenseFields as $field) {
            $formData[self::FORM_FIELDS[$field]] = $formatMoney(0);
        }

        // Family Expenses - Annual (use defaults for now)
        $annualExpenseFields = [
            'WITHHOLDING_TAX', 'SSS_GSIS_PAGIBIG_CONTRIBUTION', 'OTHERS', 'TOTAL_ANNUAL_EXPENSE',
        ];

        foreach ($annualExpenseFields as $field) {
            $formData[self::FORM_FIELDS[$field]] = $formatMoney(0);
        }

        // Other Financial Support
        $formData[self::FORM_FIELDS['HELP_OUT_IN_YOUR_FINANCES']] = $ensureValue(null, 'No');
        $formData[self::FORM_FIELDS['IF_YES_NAME']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['RELATION_TO_YOU']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['MONEY_THEY_SEND']] = $formatMoney(0);

        // Secondary Education
        $formData[self::FORM_FIELDS['SCHOOL_LOCATION']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['YEAR_GRADUATED']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['HONORS_AWARDS_RECEIVED']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['GENERAL_AVERAGE']] = $formatMoney(0);

        // References
        $formData[self::FORM_FIELDS['REFERENCES_NAME_1']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['RELATIONSHIP_TO_THE_APPLICANT_1']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['CONTACT_NUMBER_1']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['REFERENCES_NAME_2']] = $ensureValue(null);
        $formData[self::FORM_FIELDS['CONTACT_NUMBER_2']] = $ensureValue(null);

        // Declaration
        $formData[self::FORM_FIELDS['SIGNATURE_OVER_PRINTED_NAME']] = $ensureValue($user->full_name);

        return $formData;
    }

    private function prepareChedFormData(User $user): array
    {
        $profile = $user->studentProfile;

        // Ensure all form data is properly filled with guaranteed non-empty values
        $formData = [];

        // Helper function to ensure non-empty string values
        $ensureValue = function ($value, $default = null) {
            $default = $default ?? self::DEFAULT_VALUES['DEFAULT_TEXT'];

            return ! empty(trim($value ?? '')) ? trim($value) : $default;
        };

        // Helper function to format monetary values safely
        $formatMoney = function ($value) {
            $numericValue = is_numeric($value) ? (float) $value : 0;

            return number_format($numericValue, 2);
        };

        // Helper function to format date safely
        $formatDate = function ($date) {
            try {
                if ($date && method_exists($date, 'format')) {
                    return $date->format('m/d/Y');
                }

                return self::DEFAULT_VALUES['DEFAULT_DATE'];
            } catch (Exception $e) {
                return self::DEFAULT_VALUES['DEFAULT_DATE'];
            }
        };

        // Build address string with proper validation
        $addressParts = array_filter([
            $profile->street ?? '',
            $profile->barangay ?? '',
            $profile->city ?? '',
            $profile->province ?? '',
        ], fn ($part) => ! empty(trim($part)));

        // Personal Information
        $formData[self::CHED_FORM_FIELDS['FIRST_NAME']] = $ensureValue($user->first_name);
        $formData[self::CHED_FORM_FIELDS['MIDDLE_NAME']] = $ensureValue($user->middle_name);
        $formData[self::CHED_FORM_FIELDS['LAST_NAME']] = $ensureValue($user->last_name);
        $formData[self::CHED_FORM_FIELDS['MAIDEN_NAME']] = $ensureValue(null); // Not available in current schema
        $formData[self::CHED_FORM_FIELDS['SEX']] = $ensureValue($profile->sex, self::DEFAULT_VALUES['DEFAULT_SEX']);
        $formData[self::CHED_FORM_FIELDS['DATE_OF_BIRTH']] = $formatDate($profile->date_of_birth);
        $formData[self::CHED_FORM_FIELDS['PLACE_OF_BIRTH']] = $ensureValue($profile->place_of_birth);
        $formData[self::CHED_FORM_FIELDS['CIVIL_STATUS']] = $ensureValue($profile->civil_status, self::DEFAULT_VALUES['DEFAULT_CIVIL_STATUS']);
        $formData[self::CHED_FORM_FIELDS['CITIZENSHIP']] = $ensureValue(null, 'Filipino'); // Default to Filipino
        $formData[self::CHED_FORM_FIELDS['MOBILE_NUMBER']] = $ensureValue($profile->mobile_number, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::CHED_FORM_FIELDS['EMAIL_ADDRESS']] = $ensureValue($user->email, self::DEFAULT_VALUES['DEFAULT_EMAIL']);
        $formData[self::CHED_FORM_FIELDS['PRESENT_ADDRESS']] = ! empty($addressParts) ? implode(', ', $addressParts) : self::DEFAULT_VALUES['DEFAULT_ADDRESS'];
        $formData[self::CHED_FORM_FIELDS['ZIP_CODE']] = $ensureValue(null, '0000'); // Default zip code

        // Student Photo - Handle photo from user record
        $photoPath = $this->getImagePathForPdf($user->photo_id ?? '');
        $formData[self::CHED_FORM_FIELDS['ID_PICTURE']] = $photoPath;
        $formData[self::CHED_FORM_FIELDS['ID_PICTURE_AF_IMAGE']] = $photoPath;

        // Educational Information
        $formData[self::CHED_FORM_FIELDS['SCHOOL_SECTOR']] = $ensureValue(null, 'Private'); // Default
        $formData[self::CHED_FORM_FIELDS['TYPE_OF_SCHOOL']] = $ensureValue(null, 'College/University'); // Default
        $formData[self::CHED_FORM_FIELDS['NAME_OF_LAST_SCHOOL_ATTENDED']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['SCHOOL_INTENDED_TO_ENROLL_IN']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['SCHOOL_ADDRESS']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['DEGREE_PROGRAM']] = $ensureValue($profile->course);

        // Family Status - assume both parents are living if not specified
        $formData[self::CHED_FORM_FIELDS['FATHER_LIVING_DECEASED']] = $ensureValue(null, 'Living');
        $formData[self::CHED_FORM_FIELDS['MOTHER_LIVING_DECEASED']] = $ensureValue(null, 'Living');

        // Father Information
        $formData[self::CHED_FORM_FIELDS['FATHER_NAME']] = $ensureValue($profile->father_name);
        $formData[self::CHED_FORM_FIELDS['FATHER_ADDRESS']] = $formData[self::CHED_FORM_FIELDS['PRESENT_ADDRESS']]; // Use same as student
        $formData[self::CHED_FORM_FIELDS['FATHER_CONTACT_NUMBER']] = $ensureValue($profile->father_mobile ?? $profile->father_telephone ?? null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::CHED_FORM_FIELDS['FATHER_OCCUPATION']] = $ensureValue($profile->father_occupation);
        $formData[self::CHED_FORM_FIELDS['FATHER_NAME_OF_EMPLOYER']] = $ensureValue($profile->father_company ?? null);
        $formData[self::CHED_FORM_FIELDS['FATHER_EMPLOYER_ADDRESS']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['FATHER_HIGHEST_EDUCATIONAL_ATTAINTMENT']] = $ensureValue($profile->father_education ?? null);
        $formData[self::CHED_FORM_FIELDS['FATHER_TOTAL_PARENTS_TAXABLE_INCOME']] = $formatMoney($profile->father_monthly_income * 12);

        // Mother Information
        $formData[self::CHED_FORM_FIELDS['MOTHER_NAME']] = $ensureValue($profile->mother_name);
        $formData[self::CHED_FORM_FIELDS['MOTHER_ADDRESS']] = $formData[self::CHED_FORM_FIELDS['PRESENT_ADDRESS']]; // Use same as student
        $formData[self::CHED_FORM_FIELDS['MOTHER_CONTACT_NUMBER']] = $ensureValue($profile->mother_mobile ?? $profile->mother_telephone ?? null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::CHED_FORM_FIELDS['MOTHER_OCCUPATION']] = $ensureValue($profile->mother_occupation);
        $formData[self::CHED_FORM_FIELDS['MOTHER_NAME_OF_EMPLOYER']] = $ensureValue($profile->mother_company ?? null);
        $formData[self::CHED_FORM_FIELDS['MOTHER_EMPLOYER_ADDRESS']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['MOTHER_HIGHEST_EDUCATIONAL_ATTAINTMENT']] = $ensureValue($profile->mother_education ?? null);
        $formData[self::CHED_FORM_FIELDS['MOTHER_TOTAL_PARENTS_TAXABLE_INCOME']] = $formatMoney($profile->mother_monthly_income * 12);

        // Guardian Information
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_NAME']] = $ensureValue($profile->guardian_name);
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_ADDRESS']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_CONTACT_NUMBER']] = $ensureValue(null, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_OCCUPATION']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_NAME_OF_EMPLOYER']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_EMPLOYER_ADDRESS']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['GUARDIAN_HIGHEST_EDUCATIONAL_ATTAINTMENT']] = $ensureValue(null);

        // Additional Information
        $formData[self::CHED_FORM_FIELDS['NO_OF_SIBLINGS']] = $ensureValue($profile->total_siblings, self::DEFAULT_VALUES['DEFAULT_NUMBER']);
        $formData[self::CHED_FORM_FIELDS['IP_AFFILIATION']] = $ensureValue(null, 'No'); // Default to No

        // Handle 4PS field - use array notation to access property that starts with number
        $profileArray = $profile->toArray();
        $formData[self::CHED_FORM_FIELDS['4PS']] = isset($profileArray['4ps']) ? $ensureValue($profileArray['4ps'], 'No') : 'No';

        $formData[self::CHED_FORM_FIELDS['OTHER_ASSISTANCE']] = $ensureValue($profile->existing_scholarships);
        $formData[self::CHED_FORM_FIELDS['TYPE_1']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['TYPE_2']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['GRANTEE_INSTITUTION_AGENCY_1']] = $ensureValue(null);
        $formData[self::CHED_FORM_FIELDS['DATE_ACCOMPLISHED']] = date('m/d/Y'); // Current date
        $formData[self::CHED_FORM_FIELDS['TYPE_OF_DISABILITY']] = $ensureValue($profile->disability_type);
        $formData[self::CHED_FORM_FIELDS['SIGNATURE_OVER_PRINTED_NAME_OF_APPLICANT']] = $ensureValue($user->first_name.' '.$user->last_name);

        // Validate that all expected fields are present and non-empty
        $this->validateChedFieldsFilled($formData);

        return $formData;
    }

    private function prepareAnnex1FormData(User $user): array
    {
        $profile = $user->studentProfile;

        // Ensure all form data is properly filled with guaranteed non-empty values
        $formData = [];

        // Helper function to ensure non-empty string values
        $ensureValue = function ($value, $default = null) {
            $default = $default ?? self::DEFAULT_VALUES['DEFAULT_TEXT'];

            return ! empty(trim($value ?? '')) ? trim($value) : $default;
        };

        // Helper function to format date safely
        $formatDate = function ($date) {
            try {
                if ($date && method_exists($date, 'format')) {
                    return $date->format('m/d/Y');
                }

                return self::DEFAULT_VALUES['DEFAULT_DATE'];
            } catch (Exception $e) {
                return self::DEFAULT_VALUES['DEFAULT_DATE'];
            }
        };

        // Personal Information
        $formData[self::ANNEX1_FORM_FIELDS['LAST_NAME']] = $ensureValue($user->last_name);
        $formData[self::ANNEX1_FORM_FIELDS['FIRST_NAME']] = $ensureValue($user->first_name);
        $formData[self::ANNEX1_FORM_FIELDS['MIDDLE_NAME']] = $ensureValue($user->middle_name);
        $formData[self::ANNEX1_FORM_FIELDS['MAIDEN_NAME']] = $ensureValue(null); // Not available in current schema
        $formData[self::ANNEX1_FORM_FIELDS['DATE_OF_BIRTH']] = $formatDate($profile->date_of_birth);
        $formData[self::ANNEX1_FORM_FIELDS['PLACE_OF_BIRTH']] = $ensureValue($profile->place_of_birth);
        $formData[self::ANNEX1_FORM_FIELDS['CITIZENSHIP']] = $ensureValue(null, 'Filipino'); // Default to Filipino
        $formData[self::ANNEX1_FORM_FIELDS['MOBILE_NUMBER']] = $ensureValue($profile->mobile_number, self::DEFAULT_VALUES['DEFAULT_PHONE']);
        $formData[self::ANNEX1_FORM_FIELDS['EMAIL_ADDRESS']] = $ensureValue($user->email, self::DEFAULT_VALUES['DEFAULT_EMAIL']);

        // Address Information
        $formData[self::ANNEX1_FORM_FIELDS['STREET_BARANGAY']] = $ensureValue($profile->street ? $profile->street.', '.$profile->barangay : $profile->barangay);
        $formData[self::ANNEX1_FORM_FIELDS['TOWN_CITY_MUNICIPALITY']] = $ensureValue($profile->city);
        $formData[self::ANNEX1_FORM_FIELDS['PROVINCE']] = $ensureValue($profile->province);
        $formData[self::ANNEX1_FORM_FIELDS['ZIP_CODE']] = $ensureValue(null, '0000'); // Default zip code

        // Educational Information
        $formData[self::ANNEX1_FORM_FIELDS['NAME_OF_SCHOOL_ATTENDED']] = $ensureValue(null); // Not available in current schema
        $formData[self::ANNEX1_FORM_FIELDS['SCHOOL_ID_NUMBER']] = $ensureValue($profile->student_id);
        $formData[self::ANNEX1_FORM_FIELDS['SCHOOL_ADDRESS']] = $ensureValue(null); // Not available in current schema
        $formData[self::ANNEX1_FORM_FIELDS['YEAR_LEVEL']] = $ensureValue($profile->year_level);
        $formData[self::ANNEX1_FORM_FIELDS['COURSE']] = $ensureValue($this->getAbbreviatedCourseName($profile->course));

        // Additional Information
        $formData[self::ANNEX1_FORM_FIELDS['TYPE_OF_DISABILITY']] = $ensureValue($profile->disability_type);
        $formData[self::ANNEX1_FORM_FIELDS['TRIBAL_MEMBERSHIP']] = $ensureValue(null); // Not available in current schema

        // Family Information
        $formData[self::ANNEX1_FORM_FIELDS['FATHER_LIVING_DECEASED_NAME']] = $ensureValue($profile->father_name);
        $formData[self::ANNEX1_FORM_FIELDS['MOTHER_LIVING_DECEASED_NAME']] = $ensureValue($profile->mother_name);

        // Build full address for parents (same as student address if not specified separately)
        $parentAddress = '';
        if ($profile->father_address ?? null) {
            $parentAddress = $profile->father_address;
        } else {
            $addressParts = array_filter([
                $profile->street ?? '',
                $profile->barangay ?? '',
                $profile->city ?? '',
                $profile->province ?? '',
            ], fn ($part) => ! empty(trim($part)));
            $parentAddress = ! empty($addressParts) ? implode(', ', $addressParts) : self::DEFAULT_VALUES['DEFAULT_ADDRESS'];
        }

        $formData[self::ANNEX1_FORM_FIELDS['FATHER_LIVING_DECEASED_ADDRESS']] = $ensureValue($parentAddress);
        $formData[self::ANNEX1_FORM_FIELDS['FATHER_LIVING_DECEASED_OCCUPATION']] = $ensureValue($profile->father_occupation);
        $formData[self::ANNEX1_FORM_FIELDS['MOTHER_LIVING_DECEASED_ADDRESS']] = $ensureValue($profile->mother_address ?? $parentAddress);
        $formData[self::ANNEX1_FORM_FIELDS['MOTHER_LIVING_DECEASED_OCCUPATION']] = $ensureValue($profile->mother_occupation);

        // Specifications
        $formData[self::ANNEX1_FORM_FIELDS['PLEASE_SPECIFY_1']] = $ensureValue(null); // Not specified what this is for
        $formData[self::ANNEX1_FORM_FIELDS['PLEASE_SPECIFY_2']] = $ensureValue(null); // Not specified what this is for

        // Form Completion
        $formData[self::ANNEX1_FORM_FIELDS['DATE_ACCOMPLISHED']] = date('m/d/Y'); // Current date

        // Student Photo - Handle photo from user record
        $photoPath = $this->getImagePathForPdf($user->photo_id ?? '');
        $formData[self::ANNEX1_FORM_FIELDS['ID_PICTURE_AF_IMAGE']] = $photoPath;

        // Signature
        $formData[self::ANNEX1_FORM_FIELDS['SIGNATURE_OVER_PRINTED_NAME_OF_APPLICANT']] = $ensureValue($user->first_name.' '.$user->last_name);

        // Handle checkboxes/radio buttons - these have special field names
        // Set checkboxes to 'Yes' or 'On' based on the data

        // Sex: male checkbox - check if sex is male
        $formData[self::ANNEX1_FORM_FIELDS['SEX_MALE']] = (strtolower($profile->sex ?? '') === 'male') ? 'Yes' : 'Off';

        // School sector: public - default to checked since most users likely from public schools
        $formData[self::ANNEX1_FORM_FIELDS['SCHOOL_SECTOR_PUBLIC']] = 'Yes'; // Default to public

        // Father living/deceased: living - assume living unless specified otherwise
        $formData[self::ANNEX1_FORM_FIELDS['FATHER_LIVING_DECEASED_LIVING']] = 'Yes'; // Default to living

        // Mother living/deceased: living - assume living unless specified otherwise
        $formData[self::ANNEX1_FORM_FIELDS['MOTHER_LIVING_DECEASED_LIVING']] = 'Yes'; // Default to living

        // Other educational assistance: yes - check if user has existing scholarships
        $formData[self::ANNEX1_FORM_FIELDS['OTHER_EDUCATIONAL_ASSISTANCE_YES']] = ! empty($profile->existing_scholarships) ? 'Yes' : 'Off';

        // CHED Regional Office: IV-B - default to region IV-B
        $formData[self::ANNEX1_FORM_FIELDS['CHED_REGIONAL_OFFICE_IV_B']] = 'Yes'; // Default to region IV-B

        // Validate that all expected fields are present and non-empty
        $this->validateAnnex1FieldsFilled($formData);

        return $formData;
    }

    /**
     * Validate that all expected CHED form fields are present and filled
     */
    private function validateChedFieldsFilled(array $formData): void
    {
        $missingFields = [];
        $emptyFields = [];

        // Check that all expected fields from CHED_FORM_FIELDS are present
        foreach (self::CHED_FORM_FIELDS as $key => $fieldName) {
            if (! array_key_exists($fieldName, $formData)) {
                $missingFields[] = $fieldName;
            } elseif (empty(trim($formData[$fieldName] ?? ''))) {
                $emptyFields[] = $fieldName;
            }
        }

        if (! empty($missingFields)) {
            throw new Exception('Missing CHED form fields: '.implode(', ', $missingFields));
        }

        if (! empty($emptyFields)) {
            // Log warning but don't throw exception since we have default values
            logger()->warning('Empty CHED form fields detected (will use defaults): '.implode(', ', $emptyFields));
        }

        // Log successful validation
        logger()->info('All '.count(self::CHED_FORM_FIELDS).' CHED form fields are present and filled');
    }

    /**
     * Validate that all expected Annex 1 form fields are present and filled
     */
    private function validateAnnex1FieldsFilled(array $formData): void
    {
        $missingFields = [];
        $emptyFields = [];

        // Check that all expected fields from ANNEX1_FORM_FIELDS are present
        foreach (self::ANNEX1_FORM_FIELDS as $key => $fieldName) {
            if (! array_key_exists($fieldName, $formData)) {
                $missingFields[] = $fieldName;
            } elseif (empty(trim($formData[$fieldName] ?? ''))) {
                $emptyFields[] = $fieldName;
            }
        }

        if (! empty($missingFields)) {
            throw new Exception('Missing Annex 1 form fields: '.implode(', ', $missingFields));
        }

        if (! empty($emptyFields)) {
            // Log warning but don't throw exception since we have default values
            logger()->warning('Empty Annex 1 form fields detected (will use defaults): '.implode(', ', $emptyFields));
        }

        // Log successful validation
        logger()->info('All '.count(self::ANNEX1_FORM_FIELDS).' Annex 1 form fields are present and filled');
    }

    /**
     * Get abbreviated course name from full course name
     */
    private function getAbbreviatedCourseName(?string $fullCourseName): string
    {
        if (empty($fullCourseName)) {
            return self::DEFAULT_VALUES['DEFAULT_TEXT'];
        }

        return self::COURSE_ABBREVIATIONS[$fullCourseName] ?? $fullCourseName;
    }

    private function cleanup(?string $path): void
    {
        try {
            if ($path && file_exists($path)) {
                @unlink($path);
            }
        } catch (Exception $e) {
            // Log but don't throw - cleanup shouldn't break the response
            logger()->warning("Failed to cleanup file {$path}: ".$e->getMessage());
        }
    }

    /**
     * Get CHED form field name by key
     */
    public static function getChedFormField(string $key): ?string
    {
        return self::CHED_FORM_FIELDS[$key] ?? null;
    }

    /**
     * Get Annex 1 form field name by key
     */
    public static function getAnnex1FormField(string $key): ?string
    {
        return self::ANNEX1_FORM_FIELDS[$key] ?? null;
    }

    /**
     * Get a preview of what values will be filled in the CHED form
     */
    public function getChedFormDataPreview(User $user): array
    {
        try {
            $formData = $this->prepareChedFormData($user);

            $preview = [
                'total_fields' => count($formData),
                'filled_with_data' => 0,
                'filled_with_defaults' => 0,
                'field_details' => [],
            ];

            foreach ($formData as $fieldName => $value) {
                $isDefault = in_array($value, [
                    self::DEFAULT_VALUES['DEFAULT_TEXT'],
                    self::DEFAULT_VALUES['DEFAULT_NUMBER'],
                    self::DEFAULT_VALUES['DEFAULT_PWD_STATUS'],
                    self::DEFAULT_VALUES['DEFAULT_RESIDENCE_TYPE'],
                    self::DEFAULT_VALUES['DEFAULT_EMAIL'],
                    self::DEFAULT_VALUES['DEFAULT_PARENT_EMAIL'],
                    self::DEFAULT_VALUES['DEFAULT_PHONE'],
                    self::DEFAULT_VALUES['DEFAULT_ADDRESS'],
                    self::DEFAULT_VALUES['DEFAULT_DATE'],
                    'Filipino', 'Public', 'College/University', 'Living', 'No', 'None', '0000',
                ]);

                if ($isDefault) {
                    $preview['filled_with_defaults']++;
                } else {
                    $preview['filled_with_data']++;
                }

                $preview['field_details'][$fieldName] = [
                    'value' => $value,
                    'is_default' => $isDefault,
                    'is_empty' => empty(trim($value)),
                ];
            }

            return $preview;
        } catch (Exception $e) {
            return [
                'error' => 'Failed to generate CHED form data preview: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Get a preview of what values will be filled in the Annex 1 form
     */
    public function getAnnex1FormDataPreview(User $user): array
    {
        try {
            $formData = $this->prepareAnnex1FormData($user);

            $preview = [
                'total_fields' => count($formData),
                'filled_with_data' => 0,
                'filled_with_defaults' => 0,
                'field_details' => [],
            ];

            foreach ($formData as $fieldName => $value) {
                $isDefault = in_array($value, [
                    self::DEFAULT_VALUES['DEFAULT_TEXT'],
                    self::DEFAULT_VALUES['DEFAULT_NUMBER'],
                    self::DEFAULT_VALUES['DEFAULT_PWD_STATUS'],
                    self::DEFAULT_VALUES['DEFAULT_RESIDENCE_TYPE'],
                    self::DEFAULT_VALUES['DEFAULT_EMAIL'],
                    self::DEFAULT_VALUES['DEFAULT_PARENT_EMAIL'],
                    self::DEFAULT_VALUES['DEFAULT_PHONE'],
                    self::DEFAULT_VALUES['DEFAULT_ADDRESS'],
                    self::DEFAULT_VALUES['DEFAULT_DATE'],
                    'Filipino', 'Public', 'College/University', 'Living', 'No', 'None', '0000', 'Yes', 'Off',
                ]);

                if ($isDefault) {
                    $preview['filled_with_defaults']++;
                } else {
                    $preview['filled_with_data']++;
                }

                $preview['field_details'][$fieldName] = [
                    'value' => $value,
                    'is_default' => $isDefault,
                    'is_empty' => empty(trim($value)),
                ];
            }

            return $preview;
        } catch (Exception $e) {
            return [
                'error' => 'Failed to generate Annex 1 form data preview: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Test method to verify all CHED fields will be filled (for debugging/testing)
     */
    public function testAllChedFieldsFilled(User $user): array
    {
        $formData = $this->prepareChedFormData($user);

        $report = [
            'success' => true,
            'total_fields' => count(self::CHED_FORM_FIELDS),
            'filled_fields' => count($formData),
            'all_fields_present' => count(self::CHED_FORM_FIELDS) === count($formData),
            'empty_fields' => [],
            'null_fields' => [],
            'field_analysis' => [],
        ];

        // Analyze each field
        foreach (self::CHED_FORM_FIELDS as $key => $fieldName) {
            $value = $formData[$fieldName] ?? null;

            $analysis = [
                'key' => $key,
                'field_name' => $fieldName,
                'value' => $value,
                'is_filled' => ! empty(trim($value ?? '')),
                'is_null' => $value === null,
                'is_empty_string' => $value === '',
                'length' => strlen($value ?? ''),
            ];

            if ($value === null) {
                $report['null_fields'][] = $fieldName;
                $report['success'] = false;
            }

            if (empty(trim($value ?? ''))) {
                $report['empty_fields'][] = $fieldName;
                $report['success'] = false;
            }

            $report['field_analysis'][$fieldName] = $analysis;
        }

        // Check for missing fields
        $expectedFields = array_values(self::CHED_FORM_FIELDS);
        $actualFields = array_keys($formData);
        $missingFields = array_diff($expectedFields, $actualFields);

        if (! empty($missingFields)) {
            $report['missing_fields'] = $missingFields;
            $report['success'] = false;
        }

        return $report;
    }

    /**
     * Test method to verify all Annex 1 fields will be filled (for debugging/testing)
     */
    public function testAllAnnex1FieldsFilled(User $user): array
    {
        $formData = $this->prepareAnnex1FormData($user);

        $report = [
            'success' => true,
            'total_fields' => count(self::ANNEX1_FORM_FIELDS),
            'filled_fields' => count($formData),
            'all_fields_present' => count(self::ANNEX1_FORM_FIELDS) === count($formData),
            'empty_fields' => [],
            'null_fields' => [],
            'field_analysis' => [],
        ];

        // Analyze each field
        foreach (self::ANNEX1_FORM_FIELDS as $key => $fieldName) {
            $value = $formData[$fieldName] ?? null;

            $analysis = [
                'key' => $key,
                'field_name' => $fieldName,
                'value' => $value,
                'is_filled' => ! empty(trim($value ?? '')),
                'is_null' => $value === null,
                'is_empty_string' => $value === '',
                'length' => strlen($value ?? ''),
            ];

            if ($value === null) {
                $report['null_fields'][] = $fieldName;
                $report['success'] = false;
            }

            if (empty(trim($value ?? ''))) {
                $report['empty_fields'][] = $fieldName;
                $report['success'] = false;
            }

            $report['field_analysis'][$fieldName] = $analysis;
        }

        // Check for missing fields
        $expectedFields = array_values(self::ANNEX1_FORM_FIELDS);
        $actualFields = array_keys($formData);
        $missingFields = array_diff($expectedFields, $actualFields);

        if (! empty($missingFields)) {
            $report['missing_fields'] = $missingFields;
            $report['success'] = false;
        }

        return $report;
    }

    /**
     * Check if pdftk is available on the system
     */
    private function isPdftkAvailable(): bool
    {
        return $this->getPdftkCommand() !== null;
    }

    /**
     * Get the available pdftk command
     */
    private function getPdftkCommand(): ?string
    {
        // First check if PDFTK_COMMAND environment variable is set (for Heroku)
        $envCmd = env('PDFTK_COMMAND');
        if ($envCmd && $this->testPdftkCommand($envCmd)) {
            logger()->info("Found working pdftk from PDFTK_COMMAND environment: $envCmd");

            return $envCmd;
        }

        // Fallback: check if PDFTK_CMD environment variable is set
        $envCmd = env('PDFTK_CMD');
        if ($envCmd && $this->testPdftkCommand($envCmd)) {
            logger()->info("Found working pdftk from PDFTK_CMD environment: $envCmd");

            return $envCmd;
        }

        // Determine environment and prioritize commands accordingly
        $isLocal = app()->environment('local', 'development', 'testing');
        $isProduction = app()->environment('production', 'staging');

        $commands = [];

        if ($isLocal) {
            // For local/dev environment: prioritize native pdftk first
            $commands = [
                'pdftk',                                          // pdftk in PATH
                'pdftk.exe',                                     // Windows pdftk binary in PATH
                'C:\\Program Files (x86)\\PDFtk Server\\bin\\pdftk.exe',  // Windows pdftk installation path (unquoted)
                '/usr/bin/pdftk',                                // Common Linux installation path
                'pdftk-java',                                    // Java version as fallback
                '/usr/bin/pdftk-java',
            ];
        } else {
            // For production/staging environment: prioritize pdftk-java for Heroku
            $commands = [
                'pdftk-java',                                      // Java version for Heroku
                '/app/.apt/usr/bin/pdftk-java',                   // Heroku apt buildpack path
                '/app/.apt/usr/bin/pdftk.pdftk-java',             // Heroku apt buildpack installs it with this name
                // Direct Java command with comprehensive security bypass (most reliable option for Heroku)
                'java -Djava.awt.headless=true -Djava.security.manager= -Djava.security.properties= -Djava.security.policy= -Djava.security.auth.login.config= -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Djava.net.useSystemProxies=false -Djava.util.prefs.systemRoot=/tmp -Djava.util.prefs.userRoot=/tmp -jar /app/.apt/usr/share/pdftk/pdftk.jar',
                // Alternative with minimal security bypass
                'java -Djava.awt.headless=true -Djava.security.manager= -Djava.security.properties= -Dfile.encoding=UTF-8 -jar /app/.apt/usr/share/pdftk/pdftk.jar',
                // Fallback with just headless mode
                'java -Djava.awt.headless=true -Dfile.encoding=UTF-8 -jar /app/.apt/usr/share/pdftk/pdftk.jar',
                // Last resort: completely simplified command
                'java -jar /app/.apt/usr/share/pdftk/pdftk.jar',
                // Native pdftk as final fallback
                'pdftk',
                '/usr/bin/pdftk',
                '/app/.apt/usr/bin/pdftk',
            ];
        }

        logger()->info('Environment: '.app()->environment().' (isLocal: '.($isLocal ? 'true' : 'false').', isProduction: '.($isProduction ? 'true' : 'false').')');
        logger()->info('Trying PDFTK commands in order: '.implode(', ', array_slice($commands, 0, 5)).'...');

        foreach ($commands as $cmd) {
            if ($this->testPdftkCommand($cmd)) {
                logger()->info("Found working pdftk command: $cmd");

                return $cmd;
            }
        }

        // Log which commands we tried
        logger()->warning('PDFTK not available. Tried commands: '.implode(', ', $commands));

        // Try to see what's actually installed
        exec('which pdftk* 2>&1', $output, $returnCode);
        logger()->info('Available pdftk variants: '.implode("\n", $output));

        // Also check what's in the apt directory on Heroku
        if (is_dir('/app/.apt/usr/bin/')) {
            $files = glob('/app/.apt/usr/bin/*pdftk*');
            logger()->info('Found pdftk files in /app/.apt/usr/bin/: '.implode(', ', $files));
        }

        return null;
    }

    /**
     * Test if a pdftk command works
     */
    private function testPdftkCommand(string $cmd): bool
    {
        $output = [];
        $returnCode = 0;

        // Windows: quote paths containing spaces
        $cmdToTest = $cmd;
        if (PHP_OS_FAMILY === 'Windows' && preg_match('/\s/', $cmdToTest)) {
            $cmdToTest = '"'.$cmdToTest.'"';
        }

        // Set up environment with Java path for Heroku
        $env = $_ENV;
        if (is_dir('/app/.apt/usr/lib/jvm/java-21-openjdk-amd64')) {
            $env['JAVA_HOME'] = '/app/.apt/usr/lib/jvm/java-21-openjdk-amd64';
            $env['PATH'] = '/app/.apt/usr/lib/jvm/java-21-openjdk-amd64/bin:/app/.apt/usr/bin:'.($_ENV['PATH'] ?? '');
            // Create empty security properties file to bypass security initialization
            $securityFile = sys_get_temp_dir().'/java.security.empty';
            file_put_contents($securityFile, '# Empty security properties');
            $env['JAVA_OPTS'] = '-Djava.awt.headless=true '.
                               '-Djava.security.manager= '.
                               '-Djava.security.properties='.$securityFile.' '.
                               '-Djava.security.policy= '.
                               '-Djava.security.auth.login.config= '.
                               '-Djava.security.egd=file:/dev/./urandom '.
                               '-Dfile.encoding=UTF-8 '.
                               '-Djava.net.useSystemProxies=false '.
                               '-Djava.util.prefs.systemRoot=/tmp '.
                               '-Djava.util.prefs.userRoot=/tmp';
        }

        // Test the command with proper environment
        $descriptorspec = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];

        $process = proc_open($cmdToTest.' --version', $descriptorspec, $pipes, null, $env);

        if (is_resource($process)) {
            fclose($pipes[0]);
            $output = stream_get_contents($pipes[1]);
            $error = stream_get_contents($pipes[2]);
            fclose($pipes[1]);
            fclose($pipes[2]);
            $returnCode = proc_close($process);

            if ($returnCode === 0) {
                return true;
            } else {
                logger()->debug("Command '$cmd' failed with code $returnCode. Error: $error");
            }
        }

        // Check what's in the apt directory on Heroku for additional debugging
        if (is_dir('/app/.apt/usr/bin/')) {
            $aptBinFiles = scandir('/app/.apt/usr/bin/');
            $pdftkFiles = array_filter($aptBinFiles, function ($file) {
                return strpos($file, 'pdftk') !== false;
            });
            logger()->info('PDFTK files in /app/.apt/usr/bin/: '.implode(', ', $pdftkFiles));
        }

        return false;
    }
}
