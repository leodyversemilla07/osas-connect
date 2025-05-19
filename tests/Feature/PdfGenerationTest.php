<?php

use App\Models\User;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

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
    
    // Fake the storage
    Storage::fake('local');
    
    // Create a minimal fillable PDF template for testing
    Storage::disk('local')->put('templates/scholarship_form_fillable.pdf', MINIMAL_PDF_TEMPLATE);
});

afterEach(function () {
    // Clean up any temporary files
    $tempDir = storage_path('app/temp');
    if (is_dir($tempDir)) {
        array_map('unlink', glob("$tempDir/*"));
        rmdir($tempDir);
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
        'civil_status' => 'Single',
        'sex' => 'Male',
        'date_of_birth' => '2000-01-01',
        'place_of_birth' => 'Manila',
        'street' => '123 Main St',
        'barangay' => 'Brgy 1',
        'city' => 'Mindoro City',
        'province' => 'Occidental Mindoro',
        'mobile_number' => '9123456789',
        'is_pwd' => 'No',
        'religion' => 'Catholic',
        'residence_type' => "Parent's House"
    ]);

    // Create associated student profile
    StudentProfile::factory()->create([
        'user_id' => $user->id,
        'student_id' => 'MBC2023-1234',
        'course' => 'Bachelor of Science in Information Technology',
        'major' => 'None',
        'year_level' => '3rd Year',
        'guardian_name' => 'Not Applicable'
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('generate.scholarship.pdf', $user->id));
    
    $response->assertSuccessful()
        ->assertHeader('Content-Type', 'application/pdf');

    // Check filename format in Content-Disposition header
    $disposition = $response->headers->get('Content-Disposition');    expect($disposition)->toBeString();
    expect($disposition)->toMatch('/^attachment; filename="scholarship_application_Doe_John_\d{4}-\d{2}-\d{2}_\d{6}\.pdf"$/');

    // Verify the PDF was created in the temp directory
    $tempFiles = glob(storage_path('app/temp/*.pdf'));
    expect($tempFiles)->toHaveCount(2); // One for template, one for output
    
    // Files are automatically cleaned up by deleteFileAfterSend in the response
});

test('non-student cannot generate pdf', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'role' => 'osas_staff',
        'email' => 'staff@minsu.edu.ph',
        'first_name' => 'Staff',
        'last_name' => 'Member'
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
        'last_name' => 'Test'
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('generate.scholarship.pdf', $user->id));

    $response->assertStatus(404)
        ->assertSee('Student profile not found');
});

test('missing template returns 404', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'role' => 'student',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe2@minsu.edu.ph'
    ]);

    StudentProfile::factory()->create([
        'user_id' => $user->id,
        'student_id' => 'MBC2023-5678',
        'course' => 'Bachelor of Science in Information Technology',
        'major' => 'None',
        'year_level' => '3rd Year'
    ]);

    // Delete the PDF template
    Storage::disk('local')->delete('templates/scholarship_form_fillable.pdf');

    $response = $this
        ->actingAs($user)
        ->get(route('generate.scholarship.pdf', $user->id));

    $response->assertStatus(404)
        ->assertSee('PDF template not found');
});
