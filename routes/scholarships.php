<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScholarshipApplicationController;

Route::middleware(['auth', 'verified'])->group(function () {
    // Scholarship application routes
    Route::prefix('scholarships')->name('scholarships.')->group(function () {
        // Application
        Route::get('{scholarship}/apply', [ScholarshipApplicationController::class, 'create'])->name('apply');
        Route::post('{scholarship}/apply', [ScholarshipApplicationController::class, 'store'])->name('store');
        
        // Application management
        Route::get('applications/{application}', [ScholarshipApplicationController::class, 'show'])->name('applications.show');
        Route::patch('applications/{application}/documents/{documentType}', [ScholarshipApplicationController::class, 'updateDocument'])
            ->name('applications.documents.update');
            
        // OSAS staff only routes
        Route::middleware('role:osas_staff')->group(function () {
            Route::post('applications/{application}/interview', [ScholarshipApplicationController::class, 'scheduleInterview'])
                ->name('applications.interview.schedule');
            Route::post('applications/{application}/stipend', [ScholarshipApplicationController::class, 'recordStipend'])
                ->name('applications.stipend.record');
        });
    });
});
