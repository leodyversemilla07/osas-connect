<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use mikehaertl\pdftk\Pdf as PdftkPdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PdfController extends Controller
{
    private const TEMPLATE_PATH = 'templates/scholarship_form_fillable.pdf';

    public function generatePdf(Request $request, User $user)
    {
        try {
            // Check if the user is a student
            if ($user->role !== 'student') {
                return response('Only students can generate scholarship forms.', 403);
            }            // Load and check student profile with all necessary fields
            $user->load([
                'studentProfile' => function ($query) {
                    $query->select(
                        'id', 'user_id', 'student_id', 'course', 'major', 'year_level',
                        'guardian_name', 'existing_scholarships', 'civil_status', 'sex',
                        'date_of_birth', 'place_of_birth', 'street', 'barangay', 'city',
                        'province', 'mobile_number', 'telephone_number', 'is_pwd',
                        'disability_type', 'religion', 'residence_type', 'status_of_parents',
                        'father_name', 'father_occupation', 'father_monthly_income',
                        'mother_name', 'mother_occupation', 'mother_monthly_income',
                        'total_siblings', 'total_annual_income', 'total_monthly_expenses',
                        'total_annual_expenses'
                    );
                }
            ]);

            if (!$user->studentProfile) {
                return response('Student profile not found.', 404);
            }

            // Get template with detailed error logging
            $templatePath = public_path(self::TEMPLATE_PATH);
            if (!file_exists($templatePath)) {
                logger()->error("PDF template not found at: " . $templatePath);
                return response('PDF template not found at: ' . $templatePath, 404);
            }

            $pdfTemplate = file_get_contents($templatePath);
            if ($pdfTemplate === false) {
                logger()->error("Failed to read PDF template from: " . $templatePath);
                return response('Failed to read PDF template', 500);
            }

            // Prepare files
            ['tempTemplate' => $tempTemplate, 'tempOutput' => $tempOutput] = $this->prepareTempFiles();

            // Generate PDF
            $response = $this->generatePdfFile($tempTemplate, $tempOutput, $pdfTemplate, $user);

            return $response;
        } catch (Exception $e) {
            logger()->error("PDF generation failed: " . $e->getMessage());
            return response('Error generating PDF: ' . $e->getMessage(), 500);
        }
    }

    private function prepareTempFiles(): array
    {
        // Create generated_pdfs directory if it doesn't exist
        $pdfDir = storage_path('app/generated_pdfs');
        if (!file_exists($pdfDir)) {
            mkdir($pdfDir, 0777, true);
        }

        $tempId = time() . '_' . Str::random(8);
        return [
            'tempTemplate' => $pdfDir . DIRECTORY_SEPARATOR . 'template_' . $tempId . '.pdf',
            'tempOutput' => $pdfDir . DIRECTORY_SEPARATOR . 'output_' . $tempId . '.pdf'
        ];
    }

    private function generatePdfFile(string $tempTemplate, string $tempOutput, string $pdfTemplate, User $user): BinaryFileResponse
    {
        try {
            // Write template to temp file
            if (file_put_contents($tempTemplate, $pdfTemplate) === false) {
                throw new Exception('Failed to write template to temporary file');
            }

            if (!file_exists($tempTemplate) || !is_readable($tempTemplate)) {
                throw new Exception('Cannot read template file after writing');
            }

            // Fill the form
            $pdf = new PdftkPdf($tempTemplate);
            $result = $pdf->fillForm($this->prepareFormData($user))
                ->needAppearances()
                ->compress()
                ->saveAs($tempOutput);

            if (!$result) {
                throw new Exception($pdf->getError() ?: 'Unknown error while generating PDF');
            }

            if (!file_exists($tempOutput) || !is_readable($tempOutput)) {
                throw new Exception('Failed to generate or read PDF output file');
            }

            // Generate filename
            $safeName = preg_replace("/[^a-zA-Z0-9_\-\.]/", '_', $user->last_name . '_' . $user->first_name);
            $fileName = 'scholarship_application_' . $safeName . '_' . date('Y-m-d_His') . '.pdf';

            // Return the PDF as a download response with automatic cleanup
            return response()->file(
                $tempOutput,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $fileName . '"'
                ]
            )->deleteFileAfterSend(true);

        } catch (Exception $e) {
            $this->cleanup($tempTemplate);
            $this->cleanup($tempOutput);
            throw $e;
        }
    }    private function prepareFormData(User $user): array
    {
        $profile = $user->studentProfile;

        // Filter out empty values from address components
        $addressParts = array_filter([
            $profile->street,
            $profile->barangay,
            $profile->city,
            $profile->province
        ], fn($part) => !empty($part));

        // Prepare course year string with major if available
        $courseYearStr = $profile->course ?? '';
        if (!empty($profile->major)) {
            $courseYearStr .= ' Major in ' . $profile->major;
        }
        if (!empty($profile->year_level)) {
            $courseYearStr .= ' - ' . $profile->year_level;
        }

        return [
            // Basic Information
            'student_id' => $profile->student_id ?? 'N/A',
            'course_year' => !empty($courseYearStr) ? $courseYearStr : 'N/A',
            'existing_scholarships' => $profile->existing_scholarships ?? 'N/A',

            // Personal Information
            'last_name' => $user->last_name ?? 'N/A',
            'first_name' => $user->first_name ?? 'N/A',
            'middle_name' => $user->middle_name ?? 'N/A',
            'email' => $user->email ?? 'N/A',
            'civil_status' => $profile->civil_status ?? 'N/A',
            'sex' => $profile->sex ?? 'N/A',
            'date_of_birth' => $profile->date_of_birth ? $profile->date_of_birth->format('m/d/Y') : 'N/A',
            'place_of_birth' => $profile->place_of_birth ?? 'N/A',
            'address' => !empty($addressParts) ? implode(', ', $addressParts) : 'N/A',
            'mobile_number' => $profile->mobile_number ?? 'N/A',
            'telephone_number' => $profile->telephone_number ?? 'N/A',
            'is_pwd' => $profile->is_pwd ? 'yes' : 'no',
            'disability_type' => $profile->disability_type ?? 'N/A',
            'religion' => $profile->religion ?? 'N/A',
            'residence_type' => $profile->residence_type ? strtolower(str_replace(' ', '_', $profile->residence_type)) : 'parent\'s_house',
            'guardian_name' => $profile->guardian_name ?? 'N/A',

            // Family Background
            'status_of_parents' => $profile->status_of_parents ?? 'N/A',
            'father_name' => $profile->father_name ?? 'N/A',
            'father_occupation' => $profile->father_occupation ?? 'N/A',
            'father_monthly_income' => number_format($profile->father_monthly_income ?? 0, 2) ?? 'N/A',
            'mother_name' => $profile->mother_name ?? 'N/A',
            'mother_occupation' => $profile->mother_occupation ?? 'N/A',
            'mother_monthly_income' => number_format($profile->mother_monthly_income ?? 0, 2) ?? 'N/A',
            'total_siblings' => $profile->total_siblings ?? '0',

            // Financial Information
            'total_annual_income' => number_format($profile->total_annual_income ?? 0, 2) ?? 'N/A',
            'total_monthly_expenses' => number_format($profile->total_monthly_expenses ?? 0, 2) ?? 'N/A',
            'total_annual_expenses' => number_format($profile->total_annual_expenses ?? 0, 2) ?? 'N/A'
        ];
    }

    private function cleanup(?string $path): void
    {
        try {
            if ($path && file_exists($path)) {
                @unlink($path);
            }
        } catch (Exception $e) {
            // Log but don't throw - cleanup shouldn't break the response
            logger()->warning("Failed to cleanup file {$path}: " . $e->getMessage());
        }
    }
}
