<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OsasStaffController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ScholarshipsController;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

// Public routes
Route::inertia('scholarships/available', 'scholarships')->name('scholarships.available');
Route::inertia('announcements', 'announcements')->name('announcements');
Route::inertia('contact', 'contact')->name('contact');

// Additional public routes
Route::inertia('about', 'about')->name('about');
Route::inertia('privacy', 'privacy')->name('privacy');
Route::inertia('terms', 'terms')->name('terms');
Route::inertia('accessibility', 'accessibility')->name('accessibility');
Route::inertia('sitemap', 'sitemap')->name('sitemap');
Route::inertia('cookies', 'cookies')->name('cookies');

// Scholarship related routes
Route::prefix('scholarships')->group(function () {
    Route::inertia('application', 'scholarships/application')->name('scholarships.application');
    Route::inertia('requirements', 'scholarships/requirements')->name('scholarships.requirements');
    Route::inertia('deadlines', 'scholarships/deadlines')->name('scholarships.deadlines');
    Route::inertia('tips', 'scholarships/tips')->name('scholarships.tips');
});

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
        Route::get('/students', [AdminController::class, 'users'])->name('admin.students');
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
        Route::get('/invitations/create', [AdminController::class, 'showInvitationForm'])->name('admin.invitations.create');
        Route::post('/invitations', [AdminController::class, 'sendInvitation'])->name('admin.invitations.store');
        Route::delete('/invitations/{invitation}', [AdminController::class, 'revokeInvitation'])->name('admin.invitations.revoke');
        Route::delete('/invitations/{invitation}/delete', [AdminController::class, 'destroyInvitation'])->name('admin.invitations.destroy');
        Route::post('/invitations/{invitation}/resend', [AdminController::class, 'resendInvitation'])->name('admin.invitations.resend');
    });

    // OSAS Staff routes
    Route::middleware(['role:osas_staff'])->prefix('osas-staff')->group(function () {
        Route::get('/dashboard', [OsasStaffController::class, 'index'])->name('osas.dashboard');
        Route::get('/students', [OsasStaffController::class, 'studentRecords'])->name('osas.students');
        Route::get('/students/{id}', [OsasStaffController::class, 'getStudentDetails'])->name('osas.students.details');

        Route::get('/manage-scholarships', [OsasStaffController::class, 'scholarshipRecords'])->name('osas.manage.scholarships');
    });

    // Student routes
    Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentController::class, 'index'])->name('dashboard');
        Route::get('/scholarships/view', [StudentController::class, 'showScholarships'])->name('scholarships');
        Route::get('/scholarships/{id}', [StudentController::class, 'showScholarshipDetails'])->name('scholarships.details');
    });

    // Scholarship Routes
    Route::get('/scholarships', [ScholarshipsController::class, 'index'])->name('scholarships.index');
    Route::get('/scholarships/{scholarship}/apply', [ScholarshipsController::class, 'showApplicationForm'])
        ->name('scholarships.apply');
    Route::post('/scholarships/{scholarship}/submit', [ScholarshipsController::class, 'apply'])
        ->name('scholarships.submit');
    Route::get('/scholarships/track/{application}', [ScholarshipsController::class, 'track'])
        ->name('scholarships.track');

    Route::get('index', function () {
        return Inertia::render('index');
    })->name('index');
});

Route::middleware(['auth'])->group(function () {
    // Admin routes
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('/recent-logins', [AdminDashboardController::class, 'recentLogins'])->name('admin.recent-logins');
        Route::get('/invitations/pending', [AdminDashboardController::class, 'pendingInvitations'])->name('admin.invitations.pending');
        Route::post('/invitations/{invitation}/resend', [AdminDashboardController::class, 'resendInvitation'])->name('admin.invitations.resend');
    });
});

// Staff invitation acceptance (public route with signature verification)
Route::get('/accept-invitation/{token}', [OsasStaffController::class, 'showAcceptInvitationForm'])
    ->name('staff.accept-invitation')
    ->middleware('signed');

Route::post('/accept-invitation', [OsasStaffController::class, 'acceptInvitation'])
    ->name('staff.accept-invitation.store');

// PDF generation route - expects a user ID
Route::get('/generate-scholarship-pdf/{user}', [PdfController::class, 'generatePdf'])
    ->name('generate.scholarship.pdf') // Added a route name for convenience
    ->middleware('auth'); // Assuming only authenticated users can generate this

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/scholarships.php';
