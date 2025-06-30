<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CMSController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OsasStaffController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UnifiedScholarshipController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublicPageController::class, 'home'])->name('home');

// Content routes using CMS
Route::get('announcements', [\App\Http\Controllers\ContentController::class, 'announcements'])->name('announcements');
Route::get('scholarships', [\App\Http\Controllers\ContentController::class, 'scholarships'])->name('scholarships');

// API routes for content
Route::get('api/announcements/{id}', [\App\Http\Controllers\ContentController::class, 'getAnnouncement'])->name('api.announcements.show');
Route::get('api/scholarships/{id}', [\App\Http\Controllers\ContentController::class, 'getScholarship'])->name('api.scholarships.show');

// Dynamic page routes
Route::get('contact', [PublicPageController::class, 'contact'])->name('contact');
Route::get('about', [PublicPageController::class, 'about'])->name('about');

// CMS public page routes
Route::get('pages/{slug}', [CMSController::class, 'showPublic'])->name('pages.show');

Route::inertia('privacy', 'privacy')->name('privacy');
Route::inertia('terms', 'terms')->name('terms');
Route::inertia('accessibility', 'accessibility')->name('accessibility');
Route::inertia('sitemap', 'sitemap')->name('sitemap');
Route::inertia('cookies', 'cookies')->name('cookies');

// Staff invitation acceptance (public route)
Route::get('/accept-invitation/{token}', [OsasStaffController::class, 'showAcceptInvitationForm'])
    ->name('staff.accept-invitation');

Route::post('/accept-invitation', [OsasStaffController::class, 'acceptInvitation'])
    ->name('staff.accept-invitation.store');

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
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

        // Students management
        Route::get('/admin/students', [AdminController::class, 'students'])->name('admin.students');
        Route::get('/admin/students/{user}', [AdminController::class, 'showUser'])->name('admin.students.show');
        Route::get('/admin/students/{user}/edit', [AdminController::class, 'editUser'])->name('admin.students.edit');
        Route::put('/admin/students/{user}', [AdminController::class, 'updateUser'])->name('admin.students.update');
        Route::delete('/admin/students/{user}', [AdminController::class, 'destroyUser'])->name('admin.students.destroy');

        // Staff management
        Route::get('/admin/staff', [AdminController::class, 'staff'])->name('admin.staff');
        Route::get('/admin/staff/{user}', [AdminController::class, 'showUser'])->name('admin.staff.show');
        Route::get('/admin/staff/{user}/edit', [AdminController::class, 'editUser'])->name('admin.staff.edit');
        Route::put('/admin/staff/{user}', [AdminController::class, 'updateUser'])->name('admin.staff.update');
        Route::delete('/admin/staff/{user}', [AdminController::class, 'destroyUser'])->name('admin.staff.destroy');

        // Staff invitation routes
        Route::post('/admin/invitations', [AdminController::class, 'sendInvitation'])->name('admin.invitations.store');
        Route::delete('/admin/invitations/{invitation}', [AdminController::class, 'revokeInvitation'])->name('admin.invitations.revoke');
        Route::delete('/admin/invitations/{invitation}/delete', [AdminController::class, 'destroyInvitation'])->name('admin.invitations.destroy');
        Route::post('/admin/invitations/{invitation}/resend', [AdminController::class, 'resendInvitation'])->name('admin.invitations.resend');

        // Scholarship oversight (admin can view all scholarship data)
        Route::get('/admin/scholarships', [AdminController::class, 'scholarships'])->name('admin.scholarships');
        Route::get('/admin/scholarships/{scholarship}', [AdminController::class, 'showScholarship'])->name('admin.scholarships.show');
        Route::get('/admin/scholarship-applications', [AdminController::class, 'scholarshipApplications'])->name('admin.scholarship.applications');
        Route::get('/admin/scholarship-applications/{application}', [AdminController::class, 'showScholarshipApplication'])->name('admin.scholarship.applications.show');

        // Additional admin routes
        Route::get('/admin/recent-logins', [AdminController::class, 'recentLogins'])->name('admin.recent-logins');

        // Page management routes (CMS)
        Route::get('/admin/cms', [CMSController::class, 'index'])->name('admin.cms.index');
        Route::get('/admin/cms/create', [CMSController::class, 'create'])->name('admin.cms.create');
        Route::get('/admin/cms/preview', [CMSController::class, 'preview'])->name('admin.cms.preview');
        Route::post('/admin/cms', [CMSController::class, 'store'])->name('admin.cms.store');
        Route::get('/admin/cms/{page}', [CMSController::class, 'show'])->name('admin.cms.show');
        Route::get('/admin/cms/{page}/edit', [CMSController::class, 'edit'])->name('admin.cms.edit');
        Route::put('/admin/cms/{page}', [CMSController::class, 'update'])->name('admin.cms.update');
        Route::delete('/admin/cms/{page}', [CMSController::class, 'destroy'])->name('admin.cms.destroy');

        // Site component management routes (Header & Footer)
        Route::get('/admin/cms/components/header', [CMSController::class, 'editHeader'])->name('admin.cms.header');
        Route::put('/admin/cms/components/header', [CMSController::class, 'updateHeader'])->name('admin.cms.header.update');
        Route::get('/admin/cms/components/footer', [CMSController::class, 'editFooter'])->name('admin.cms.footer');
        Route::put('/admin/cms/components/footer', [CMSController::class, 'updateFooter'])->name('admin.cms.footer.update');

        // Announcements management routes
        Route::get('/admin/announcements', [AdminController::class, 'announcements'])->name('admin.announcements');
        Route::get('/admin/announcements/create', [AdminController::class, 'createAnnouncement'])->name('admin.announcements.create');
        Route::post('/admin/announcements', [AdminController::class, 'storeAnnouncement'])->name('admin.announcements.store');
        Route::get('/admin/announcements/{page}/edit', [AdminController::class, 'editAnnouncement'])->name('admin.announcements.edit');
        Route::put('/admin/announcements/{page}', [AdminController::class, 'updateAnnouncement'])->name('admin.announcements.update');
        Route::delete('/admin/announcements/{page}', [AdminController::class, 'destroyAnnouncement'])->name('admin.announcements.destroy');

        // CMS Scholarships management routes
        Route::get('/admin/cms-scholarships', [AdminController::class, 'cmsScholarships'])->name('admin.cms-scholarships');
        Route::get('/admin/cms-scholarships/create', [AdminController::class, 'createCmsScholarship'])->name('admin.cms-scholarships.create');
        Route::post('/admin/cms-scholarships', [AdminController::class, 'storeCmsScholarship'])->name('admin.cms-scholarships.store');
        Route::get('/admin/cms-scholarships/{page}/edit', [AdminController::class, 'editCmsScholarship'])->name('admin.cms-scholarships.edit');
        Route::put('/admin/cms-scholarships/{page}', [AdminController::class, 'updateCmsScholarship'])->name('admin.cms-scholarships.update');
        Route::delete('/admin/cms-scholarships/{page}', [AdminController::class, 'destroyCmsScholarship'])->name('admin.cms-scholarships.destroy');
    });

    // OSAS Staff routes - All consolidated under one middleware group
    Route::middleware(['role:osas_staff'])->group(function () {
        Route::get('/osas-staff/dashboard', [OsasStaffController::class, 'index'])->name('osas.dashboard');

        // Student management
        Route::get('/osas-staff/students', [OsasStaffController::class, 'studentRecords'])->name('osas.students');
        Route::get('/osas-staff/students/{user}', [OsasStaffController::class, 'getStudentDetails'])->name('osas.students.details');
        Route::get('/osas-staff/students/{user}/edit', [OsasStaffController::class, 'editStudent'])->name('osas.students.edit');
        Route::put('/osas-staff/students/{user}', [OsasStaffController::class, 'updateStudent'])->name('osas.students.update');
        Route::delete('/osas-staff/students/{user}', [OsasStaffController::class, 'destroyStudent'])->name('osas.students.destroy');

        // Scholarship management
        Route::get('/osas-staff/manage-scholarships', [OsasStaffController::class, 'scholarshipRecords'])->name('osas.manage.scholarships');
        Route::post('/osas-staff/scholarships', [OsasStaffController::class, 'storeScholarship'])->name('osas.scholarships.store');
        Route::put('/osas-staff/scholarships/{scholarship}', [OsasStaffController::class, 'updateScholarship'])->name('osas.scholarships.update');
        Route::delete('/osas-staff/scholarships/{scholarship}', [OsasStaffController::class, 'destroyScholarship'])->name('osas.scholarships.destroy');

        // Application management routes
        Route::get('/osas-staff/applications', [OsasStaffController::class, 'scholarshipApplications'])->name('osas.applications');
        Route::get('/osas-staff/applications/export', [OsasStaffController::class, 'exportApplications'])->name('osas.applications.export');
        Route::get('/osas-staff/applications/{application}/review', [OsasStaffController::class, 'reviewApplication'])->name('osas.applications.review');
        Route::patch('/osas-staff/applications/{application}/status', [OsasStaffController::class, 'updateApplicationStatus'])->name('osas.applications.status');
        Route::post('/osas-staff/applications/{application}/comment', [OsasStaffController::class, 'addApplicationComment'])->name('osas.applications.comment');
        Route::patch('/osas-staff/documents/{document}/verify', [OsasStaffController::class, 'verifyDocument'])->name('osas.documents.verify');

        // Interview scheduling and management
        Route::get('/osas-staff/applications/{application}/interview', [OsasStaffController::class, 'scheduleInterviewForm'])->name('osas.applications.interview');
        Route::post('/osas-staff/applications/{application}/interview', [UnifiedScholarshipController::class, 'scheduleInterview'])
            ->name('osas.scholarships.interview.store');

        // Stipend recording
        Route::post('/osas-staff/scholarships/applications/{application}/stipend', [UnifiedScholarshipController::class, 'recordStipend'])
            ->name('osas.scholarships.stipend.record');
    });

    // Student routes
    Route::middleware(['role:student'])->group(function () {
        Route::get('student/dashboard', [StudentController::class, 'index'])->name('student.dashboard');

        // Enhanced dashboard API routes
        Route::get('student/dashboard/stats', [StudentController::class, 'getDashboardStats'])->name('student.dashboard.stats');
        Route::get('student/dashboard/activity', [StudentController::class, 'getRecentActivity'])->name('student.dashboard.activity');

        Route::get('student/applications', [StudentController::class, 'applications'])->name('student.applications');
        Route::get('student/applications/{application}/status', [StudentController::class, 'applicationStatus'])->name('student.applications.status');

        // Scholarship browsing and search
        Route::get('student/scholarships/search', [StudentController::class, 'searchScholarships'])->name('student.scholarships.search');
        Route::get('student/scholarships/{scholarship}/details', [StudentController::class, 'getScholarshipDetails'])->name('student.scholarships.details');

        // Scholarship application routes (student-specific)
        Route::get('student/scholarships', [UnifiedScholarshipController::class, 'index'])->name('student.scholarships.index');

        // Application submission
        Route::get('student/scholarships/{scholarship}/apply', [UnifiedScholarshipController::class, 'create'])->name('student.scholarships.apply');
        Route::post('student/scholarships/{scholarship}/apply', [UnifiedScholarshipController::class, 'store'])->name('student.scholarships.store');

        // Application status tracking
        Route::get('student/scholarships/applications/{application}/status', [UnifiedScholarshipController::class, 'showStatus'])->name('student.scholarships.applications.status');
        Route::get('student/scholarships/applications/{application}', [UnifiedScholarshipController::class, 'showApplication'])->name('student.scholarships.applications.show');
        Route::get('student/scholarships/applications/{application}/complete', [UnifiedScholarshipController::class, 'edit'])->name('student.scholarships.applications.edit');

        // Document management for students
        Route::post('student/scholarships/applications/{application}/documents', [DocumentController::class, 'store'])->name('student.scholarships.documents.store');
        Route::patch('student/scholarships/applications/{application}/documents/{document}', [DocumentController::class, 'update'])->name('student.scholarships.documents.update');
        Route::delete('student/scholarships/applications/{application}/documents/{document}', [DocumentController::class, 'destroy'])->name('student.scholarships.documents.destroy');
        Route::patch('student/scholarships/applications/{application}/documents/{documentType}', [UnifiedScholarshipController::class, 'updateDocument'])
            ->name('student.scholarships.applications.documents.update');

        // Interview routes (student-specific)
        Route::get('student/interviews', [InterviewController::class, 'index'])->name('student.interviews.index');
        Route::get('student/interviews/{interview}', [InterviewController::class, 'show'])->name('student.interviews.show');
        Route::post('student/interviews/{interview}/reschedule', [InterviewController::class, 'requestReschedule'])->name('student.interviews.reschedule');

        // Notification management routes
        Route::get('student/notifications', [NotificationController::class, 'index'])->name('student.notifications.index');
        Route::post('student/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('student.notifications.read');
        Route::post('student/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('student.notifications.read-all');
        Route::delete('student/notifications/{notification}', [NotificationController::class, 'destroy'])->name('student.notifications.destroy');
        Route::post('student/notifications/bulk-delete', [NotificationController::class, 'bulkDelete'])->name('student.notifications.bulk-delete');
        Route::get('student/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('student.notifications.unread-count');
    });

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

// Dynamic page route (catch-all for pages managed through CMS)
// This must be the last route to avoid conflicts with other routes
Route::get('{slug}', [PublicPageController::class, 'show'])->where('slug', '[a-zA-Z0-9\-_/]+')->name('page.show');
