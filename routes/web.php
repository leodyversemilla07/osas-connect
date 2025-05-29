<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\OsasStaffController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ScholarshipsController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');
Route::inertia('scholarships/available', 'scholarships', [
    'auth' => fn () => [
        'user' => Auth::user()
    ]
])->name('scholarships.available');
Route::inertia('announcements', 'announcements')->name('announcements');
Route::inertia('contact', 'contact')->name('contact');
Route::inertia('about', 'about')->name('about');

Route::inertia('privacy', 'privacy')->name('privacy');
Route::inertia('terms', 'terms')->name('terms');
Route::inertia('accessibility', 'accessibility')->name('accessibility');
Route::inertia('sitemap', 'sitemap')->name('sitemap');
Route::inertia('cookies', 'cookies')->name('cookies');

Route::middleware(['auth', 'verified'])->group(function () {
    // Common dashboard route that redirects to role-specific dashboard
    Route::get('dashboard', function () {
        if (Auth::user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif (Auth::user()->isOsasStaff()) {
            return redirect()->route('osas.dashboard');
        } else {
            return redirect()->route('student.dashboard');
        }
    })->name('dashboard');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

        // Students management
        Route::get('/students', [AdminController::class, 'students'])->name('admin.students');
        Route::get('/students/{user}', [AdminController::class, 'showUser'])->name('admin.students.show');
        Route::get('/students/{user}/edit', [AdminController::class, 'editUser'])->name('admin.students.edit');
        Route::put('/students/{user}', [AdminController::class, 'updateUser'])->name('admin.students.update');
        Route::delete('/students/{user}', [AdminController::class, 'destroyUser'])->name('admin.students.destroy');

        // Staff management
        Route::get('/staff', [AdminController::class, 'staff'])->name('admin.staff');
        Route::get('/staff/{user}', [AdminController::class, 'showUser'])->name('admin.staff.show');
        Route::get('/staff/{user}/edit', [AdminController::class, 'editUser'])->name('admin.staff.edit');
        Route::put('/staff/{user}', [AdminController::class, 'updateUser'])->name('admin.staff.update');
        Route::delete('/staff/{user}', [AdminController::class, 'destroyUser'])->name('admin.staff.destroy');

        // Staff invitation routes
        Route::post('/invitations', [AdminController::class, 'sendInvitation'])->name('admin.invitations.store');
        Route::delete('/invitations/{invitation}', [AdminController::class, 'revokeInvitation'])->name('admin.invitations.revoke');
        Route::delete('/invitations/{invitation}/delete', [AdminController::class, 'destroyInvitation'])->name('admin.invitations.destroy');
        Route::post('/invitations/{invitation}/resend', [AdminController::class, 'resendInvitation'])->name('admin.invitations.resend');
        
        // Additional admin routes
        Route::get('/recent-logins', [AdminController::class, 'recentLogins'])->name('admin.recent-logins');
        Route::get('/invitations/pending', [AdminController::class, 'pendingInvitations'])->name('admin.invitations.pending');
    });

    // OSAS Staff routes
    Route::middleware(['role:osas_staff'])->prefix('osas-staff')->group(function () {
        Route::get('/dashboard', [OsasStaffController::class, 'index'])->name('osas.dashboard');
        Route::get('/students', [OsasStaffController::class, 'studentRecords'])->name('osas.students');

        Route::get('/students/{user}', [OsasStaffController::class, 'getStudentDetails'])->name('osas.students.details');
        Route::get('/students/{user}/edit', [OsasStaffController::class, 'editStudent'])->name('osas.students.edit');
        Route::put('/students/{user}', [OsasStaffController::class, 'updateStudent'])->name('osas.students.update');
        Route::delete('/students/{user}', [OsasStaffController::class, 'destroyStudent'])->name('osas.students.destroy');


        Route::get('/manage-scholarships', [OsasStaffController::class, 'scholarshipRecords'])->name('osas.manage.scholarships');
        Route::post('/scholarships', [OsasStaffController::class, 'storeScholarship'])->name('osas.scholarships.store');
        Route::put('/scholarships/{scholarship}', [OsasStaffController::class, 'updateScholarship'])->name('osas.scholarships.update');
        
        // Application management routes
        Route::get('/applications', [OsasStaffController::class, 'scholarshipApplications'])->name('osas.applications');
        Route::get('/applications/export', [OsasStaffController::class, 'exportApplications'])->name('osas.applications.export');
        Route::get('/applications/{application}/review', [OsasStaffController::class, 'reviewApplication'])->name('osas.applications.review');
        Route::patch('/applications/{application}/status', [OsasStaffController::class, 'updateApplicationStatus'])->name('osas.applications.status');
        Route::post('/applications/{application}/comment', [OsasStaffController::class, 'addApplicationComment'])->name('osas.applications.comment');
        Route::patch('/documents/{document}/verify', [OsasStaffController::class, 'verifyDocument'])->name('osas.documents.verify');
    });

    // Student routes
    Route::middleware(['role:student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentController::class, 'index'])->name('dashboard');
        Route::get('/scholarships/view', [StudentController::class, 'showScholarships'])->name('scholarships');
        Route::get('/scholarships/{scholarship}', [StudentController::class, 'showScholarshipDetails'])->name('scholarships.details');
        Route::get('/applications', [StudentController::class, 'applications'])->name('applications');
        Route::get('/applications/{application}/status', [StudentController::class, 'applicationStatus'])->name('applications.status');
    });

    // Scholarship Routes - Restricted to students only
    Route::middleware(['role:student'])->group(function () {
        Route::get('/scholarships', [ScholarshipsController::class, 'index'])->name('scholarships.index');
        Route::get('/scholarships/{scholarship}/apply', [ScholarshipsController::class, 'showApplicationForm'])
            ->name('scholarships.apply');
        Route::post('/scholarships/{scholarship}/submit', [ScholarshipsController::class, 'apply'])
            ->name('scholarships.submit');
        Route::get('/scholarships/track/{application}', [ScholarshipsController::class, 'track'])
            ->name('scholarships.track');
    });

    Route::get('index', function () {
        return Inertia::render('index');
    })->name('index');
});

// Staff invitation acceptance (public route)
Route::get('/accept-invitation/{token}', [OsasStaffController::class, 'showAcceptInvitationForm'])
    ->name('staff.accept-invitation');

Route::post('/accept-invitation', [OsasStaffController::class, 'acceptInvitation'])
    ->name('staff.accept-invitation.store');

// PDF generation routes - with proper authorization
Route::middleware(['auth'])->group(function () {
    // Only allow users to generate their own PDFs, or staff/admin to generate any user's PDF
    Route::get('/generate-scholarship-pdf/{user}', [PdfController::class, 'generatePdf'])
        ->name('generate.scholarship.pdf');

    // CHED PDF generation route - expects a user ID
    Route::get('/generate-ched-scholarship-pdf/{user}', [PdfController::class, 'generateChedPdf'])
        ->name('generate.ched.scholarship.pdf');

    // Annex 1 TPDF PDF generation route - expects a user ID
    Route::get('/generate-annex1-tpdf-pdf/{user}', [PdfController::class, 'generateAnnex1Pdf'])
        ->name('generate.annex1.tpdf.pdf');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/scholarships.php';
