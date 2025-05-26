<?php

namespace App\Console\Commands;

use App\Http\Controllers\PdfController;
use App\Models\User;
use Illuminate\Console\Command;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TestPdfGeneration extends Command
{
    protected $signature = 'app:test-pdf-generation';

    protected $description = 'Test PDF generation with existing student user data and validate output';

    public function handle()
    {
        try {
            // Get the test user (Leodyver Semilla)
            $user = User::where('email', 'semilla.leodyver@minsu.edu.ph')->first();

            if (! $user) {
                $this->error('Test user not found!');
                return 1;
            }

            // Check if user is a student
            if ($user->role !== 'student') {
                $this->error('Test user must be a student!');
                return 1;
            }

            // Load student profile to check if it exists
            $user->load('studentProfile');
            if (! $user->studentProfile) {
                $this->error('Test user does not have a student profile!');
                return 1;
            }

            $this->info('Found test user: ' . $user->first_name . ' ' . $user->last_name);
            $this->info('Student ID: ' . ($user->studentProfile->student_id ?? 'Not set'));

            $pdfController = new PdfController;
            $response = $pdfController->generatePdf(request(), $user);

            // Check if response is a BinaryFileResponse (success case)
            if ($response instanceof \Symfony\Component\HttpFoundation\BinaryFileResponse) {
                $this->info('PDF generated successfully!');
                $this->info('PDF file path: ' . $response->getFile()->getPathname());
                
                // Check if file actually exists and has content
                $filePath = $response->getFile()->getPathname();
                if (file_exists($filePath)) {
                    $fileSize = filesize($filePath);
                    $this->info('PDF file size: ' . number_format($fileSize) . ' bytes');
                    
                    if ($fileSize > 0) {
                        $this->info('✅ PDF generation test PASSED!');
                        return 0;
                    } else {
                        $this->error('❌ PDF file is empty!');
                        return 1;
                    }
                } else {
                    $this->error('❌ PDF file was not created!');
                    return 1;
                }
            } else {
                // Handle error responses
                $statusCode = $response->getStatusCode();
                $content = $response->getContent();
                
                $this->error('❌ PDF generation failed!');
                $this->error('Status Code: ' . $statusCode);
                $this->error('Error: ' . $content);
                
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('❌ Exception occurred: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            
            return 1;
        }
    }
}
