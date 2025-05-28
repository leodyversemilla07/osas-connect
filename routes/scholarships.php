<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\ScholarshipApplicationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Interview routes
    Route::prefix('interviews')->name('interviews.')->group(function () {
        Route::get('/', [InterviewController::class, 'index'])->name('index');
        Route::get('/{interview}', [InterviewController::class, 'show'])->name('show');
        Route::post('/{interview}/reschedule', [InterviewController::class, 'requestReschedule'])->name('reschedule');
    });

    // Scholarship application routes
    Route::prefix('scholarships')->name('scholarships.')->group(function () {
        // Application
        Route::get('{scholarship}/apply', [ScholarshipApplicationController::class, 'create'])->name('apply');
        Route::post('{scholarship}/apply', [ScholarshipApplicationController::class, 'store'])->name('store');

        // Application status tracking
        Route::get('applications/{application}/status', [ScholarshipApplicationController::class, 'showStatus'])->name('applications.status');

        // Document management
        Route::post('applications/{application}/documents', [DocumentController::class, 'store'])->name('documents.store');
        Route::patch('applications/{application}/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
        Route::delete('applications/{application}/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

        // Application management
        Route::get('applications/{application}', [ScholarshipApplicationController::class, 'show'])->name('applications.show');
        Route::patch('applications/{application}/documents/{documentType}', [ScholarshipApplicationController::class, 'updateDocument'])
            ->name('applications.documents.update');

        // OSAS staff only routes
        Route::middleware('role:osas_staff')->group(function () {
            Route::post('applications/{application}/interview', [ScholarshipApplicationController::class, 'scheduleInterview'])
                ->name('applications.interview.schedule');
            Route::post('applications/{application}/stipend', [ScholarshipApplicationController::class, 'recordStipend'])
                ->name('stipend.record');
        });
    });
});
