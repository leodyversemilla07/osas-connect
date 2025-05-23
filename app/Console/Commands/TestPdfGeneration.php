<?php

namespace App\Console\Commands;

use App\Http\Controllers\PdfController;
use App\Models\User;
use Illuminate\Console\Command;

class TestPdfGeneration extends Command
{
    protected $signature = 'app:test-pdf-generation';

    protected $description = 'Test PDF generation with existing user data';

    public function handle()
    {
        try {
            // Get the test user (Leodyver Semilla)
            $user = User::where('email', 'semilla.leodyver@minsu.edu.ph')->first();

            if (! $user) {
                $this->error('Test user not found!');

                return 1;
            }

            $pdfController = new PdfController;
            $response = $pdfController->generatePdf(request(), $user);

            if ($response->getStatusCode() === 200) {
                $this->info('PDF generated successfully!');
                $this->info('PDF saved as: '.$response->getFile()->getPathname());

                return 0;
            } else {
                $this->error('Failed to generate PDF: '.$response->getContent());

                return 1;
            }
        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());

            return 1;
        }
    }
}
