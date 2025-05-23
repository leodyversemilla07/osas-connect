<?php

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

// Define minimal PDF template as a constant
const MINIMAL_PDF_TEMPLATE = '%PDF-1.4
%âăĎÓ
1 0 obj<</Type/Catalog/Pages 2 0 R/AcroForm<</Fields[]>>>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
171
%%EOF';

beforeEach(function () {
    // Clear any existing state
    Cache::flush();

    Storage::fake('local'); // For other parts of the app if they use Storage::disk('local')

    // Setup public template for PdfController as it uses public_path()
    $publicTemplatesDir = public_path('templates');
    if (! is_dir($publicTemplatesDir)) {
        mkdir($publicTemplatesDir, 0777, true);
    }
    file_put_contents(public_path('templates/scholarship_form_fillable.pdf'), MINIMAL_PDF_TEMPLATE);

    // Ensure generated_pdfs directory (used by PdfController for temporary files) is clean
    $generatedPdfsDir = storage_path('app/generated_pdfs');
    if (is_dir($generatedPdfsDir)) {
        array_map('unlink', glob("$generatedPdfsDir/*"));
    } else {
        mkdir($generatedPdfsDir, 0777, true);
    }
});

afterEach(function () {
    // Clean up the public template
    $publicTemplatePath = public_path('templates/scholarship_form_fillable.pdf');
    if (file_exists($publicTemplatePath)) {
        // unlink($publicTemplatePath);
        // Attempt to remove the directory if it's empty and was created by the test
        // This is optional and should be done cautiously.
        // if (is_dir(public_path('templates')) && count(scandir(public_path('templates'))) === 2) {
        //    @rmdir(public_path('templates'));
        // }
    }

    // Clean up generated_pdfs directory
    $generatedPdfsDir = storage_path('app/generated_pdfs');
    if (is_dir($generatedPdfsDir)) {
        array_map('unlink', glob("$generatedPdfsDir/*"));
        // Optionally remove the directory if it's always created by tests/controller
        // and it's safe to do so.
        // @rmdir($generatedPdfsDir);
    }
});

test('student can generate pdf', function () {
    // Create a student user with complete required fields
    /** @var User $user */
    $user = User::factory()->create([
        'role' => 'student',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@minsu.edu.ph',
    ]);

    // Create associated student profile
    StudentProfile::factory()->create([
        'user_id' => $user->id,
        'student_id' => 'MBC2023-1234',
        'course' => 'Bachelor of Science in Information Technology',
        'major' => 'None',
        'year_level' => '3rd Year',
        'guardian_name' => 'Not Applicable',
        'civil_status' => 'Single',
        'sex' => 'Male',
        'date_of_birth' => '2000-01-01',
        'place_of_birth' => 'Manila',
        'street' => '123 Main St',
        'barangay' => 'Brgy 1',
        'city' => 'Mindoro City',
        'province' => 'Occidental Mindoro',
        'mobile_number' => '9123456789',
        'is_pwd' => false, // Assuming 'No' maps to false
        'religion' => 'Catholic',
        'residence_type' => "Parent's House",
        // Add default values for financial fields
        'income_from_business' => 0,
        'combined_annual_pay_parents' => 0,
        'combined_annual_pay_siblings' => 0,
        'income_from_land_rentals' => 0,
        'income_from_building_rentals' => 0,
        'retirement_benefits_pension' => 0,
        'commissions' => 0,
        'support_from_relatives' => 0,
        'bank_deposits' => 0,
        'other_income_amount' => 0,
        'total_annual_income' => 0,
        'house_rental' => 0,
        'food_grocery' => 0,
        'school_bus_payment' => 0,
        'transportation_expense' => 0,
        'education_plan_premiums' => 0,
        'insurance_policy_premiums' => 0,
        'health_insurance_premium' => 0,
        'sss_gsis_pagibig_loans' => 0,
        'clothing_expense' => 0,
        'utilities_expense' => 0,
        'communication_expense' => 0,
        'medicine_expense' => 0,
        'doctor_expense' => 0,
        'hospital_expense' => 0,
        'recreation_expense' => 0,
        'total_monthly_expenses' => 0,
        'annualized_monthly_expenses' => 0,
        'school_tuition_fee' => 0,
        'withholding_tax' => 0,
        'sss_gsis_pagibig_contribution' => 0,
        'subtotal_annual_expenses' => 0,
        'total_annual_expenses' => 0,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('generate.scholarship.pdf', $user->id));

    $response->assertSuccessful()
        ->assertHeader('Content-Type', 'application/pdf');

    // Check filename format in Content-Disposition header
    $disposition = $response->headers->get('Content-Disposition');
    expect($disposition)->toBeString();
    expect($disposition)->toMatch('/^attachment; filename="scholarship_application_Doe_John_\\d{4}-\\d{2}-\\d{2}_\\d{6}\\.pdf"$/');

    // Verify the temporary template PDF was created in the generated_pdfs directory.
    // The actual output PDF is deleted by deleteFileAfterSend(true) in the controller.
    $generatedFiles = glob(storage_path('app/generated_pdfs/template_*.pdf'));
    expect($generatedFiles)->toHaveCount(1);

    // Files are automatically cleaned up by deleteFileAfterSend in the response
});

test('non-student cannot generate pdf', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'role' => 'osas_staff',
        'email' => 'staff@minsu.edu.ph',
        'first_name' => 'Staff',
        'last_name' => 'Member',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('generate.scholarship.pdf', $user->id));

    $response->assertStatus(403);
});

test('student without profile cannot generate pdf', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'role' => 'student',
        'email' => 'student@minsu.edu.ph',
        'first_name' => 'Student',
        'last_name' => 'Test',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('generate.scholarship.pdf', $user->id));

    $response->assertStatus(404)
        ->assertSee('Student profile not found');
});
