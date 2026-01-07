<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OsasStaffController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\RenewalController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentManagementController;
use App\Http\Controllers\UnifiedScholarshipController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/scholarships', function () {
    return Inertia::render('scholarships');
})->name('scholarships');

Route::get('/announcements', function () {
    return Inertia::render('announcements');
})->name('announcements');

Route::inertia('privacy', 'privacy')->name('privacy');
Route::inertia('terms', 'terms')->name('terms');
Route::inertia('accessibility', 'accessibility')->name('accessibility');
Route::inertia('sitemap', 'sitemap')->name('sitemap');
Route::inertia('cookies', 'cookies')->name('cookies');

// Staff invitation acceptance (public route)
Route::get('/accept-invitation/{token}', [OsasStaffController::class, 'showAcceptInvitationForm'])->name('staff.accept-invitation');

Route::post('/accept-invitation', [OsasStaffController::class, 'acceptInvitation'])->name('staff.accept-invitation.store');

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

        // Students management (resourceful)
        Route::resource('/admin/students', StudentManagementController::class, [
            'as' => 'admin',
        ]);

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
        Route::get('/admin/scholarship-applications/{application}', [AdminController::class, 'showScholarshipApplication'])->name(
            'admin.scholarship.applications.show',
        );

        // Additional admin routes
        Route::get('/admin/recent-logins', [AdminController::class, 'recentLogins'])->name('admin.recent-logins');

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
        Route::get('/osas-staff/events', [OsasStaffController::class, 'events'])->name('osas.events');

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
        Route::delete('/osas-staff/scholarships/{scholarship}', [OsasStaffController::class, 'destroyScholarship'])->name(
            'osas.scholarships.destroy',
        );

        // Application management routes
        Route::get('/osas-staff/applications', [OsasStaffController::class, 'scholarshipApplications'])->name('osas.applications');
        Route::get('/osas-staff/applications/export', [OsasStaffController::class, 'exportApplications'])->name('osas.applications.export');
        Route::get('/osas-staff/applications/{application}/review', [OsasStaffController::class, 'reviewApplication'])->name(
            'osas.applications.review',
        );
        Route::patch('/osas-staff/applications/{application}/status', [OsasStaffController::class, 'updateApplicationStatus'])->name(
            'osas.applications.status',
        );
        Route::post('/osas-staff/applications/{application}/comment', [OsasStaffController::class, 'addApplicationComment'])->name(
            'osas.applications.comment',
        );
        Route::patch('/osas-staff/documents/{document}/verify', [OsasStaffController::class, 'verifyDocument'])->name('osas.documents.verify');

        // Interview scheduling and management
        Route::get('/osas-staff/applications/{application}/interview', [OsasStaffController::class, 'scheduleInterviewForm'])->name(
            'osas.applications.interview',
        );
        Route::post('/osas-staff/applications/{application}/interview', [UnifiedScholarshipController::class, 'scheduleInterview'])->name(
            'osas.scholarships.interview.store',
        );

        // Comprehensive Interview Management Routes
        Route::prefix('osas-staff/interviews')->name('osas.interviews.')->group(function () {
            Route::get('/', [InterviewController::class, 'staffIndex'])->name('index');
            Route::get('/dashboard', [InterviewController::class, 'dashboard'])->name('dashboard');
            Route::get('/create', [InterviewController::class, 'create'])->name('create');
            Route::post('/', [InterviewController::class, 'store'])->name('store');
            Route::get('/{interview}', [InterviewController::class, 'show'])->name('show');
            Route::get('/{interview}/edit', [InterviewController::class, 'edit'])->name('edit');
            Route::patch('/{interview}', [InterviewController::class, 'update'])->name('update');
            Route::post('/{interview}/reschedule', [InterviewController::class, 'reschedule'])->name('reschedule');
            Route::post('/{interview}/complete', [InterviewController::class, 'complete'])->name('complete');
            Route::post('/{interview}/cancel', [InterviewController::class, 'cancel'])->name('cancel');
            Route::post('/{interview}/no-show', [InterviewController::class, 'markAsNoShow'])->name('no-show');
            Route::get('/statistics/overview', [InterviewController::class, 'statisticsOverview'])->name('statistics');
        });

        // Analytics and Reporting Routes
        Route::prefix('osas-staff/analytics')->name('osas.analytics.')->group(function () {
            Route::get('/', [\App\Http\Controllers\ReportingController::class, 'index'])->name('index');
            Route::get('/reports', [\App\Http\Controllers\ReportingController::class, 'reports'])->name('reports');

            // Export endpoints
            Route::get('/export/applications', [\App\Http\Controllers\ReportingController::class, 'exportApplications'])->name('export.applications');
        });

        // Stipend recording
        Route::post('/osas-staff/scholarships/applications/{application}/stipend', [UnifiedScholarshipController::class, 'recordStipend'])->name(
            'osas.scholarships.stipend.record',
        );

        // Renewal routes (staff)
        Route::prefix('osas-staff/renewals')->name('renewal.staff.')->group(function () {
            Route::get('/', [RenewalController::class, 'index'])->name('index');
            Route::get('/statistics', [RenewalController::class, 'statistics'])->name('statistics');
            Route::get('/{renewal}/review', [RenewalController::class, 'review'])->name('review');
            Route::post('/{renewal}/approve', [RenewalController::class, 'approve'])->name('approve');
            Route::post('/{renewal}/reject', [RenewalController::class, 'reject'])->name('reject');
        });

        // Student Assistantship Management Routes
        Route::prefix('osas-staff/assistantship')->name('osas.assistantship.')->group(function () {
            Route::get('/', [\App\Http\Controllers\StudentAssistantshipController::class, 'staffDashboard'])->name('dashboard');
            Route::get('/assignments', [\App\Http\Controllers\StudentAssistantshipController::class, 'assignments'])->name('assignments');
            Route::get('/assignments/{assignment}', [\App\Http\Controllers\StudentAssistantshipController::class, 'showAssignment'])->name('assignments.show');
            Route::post('/assignments/{assignment}/schedule-screening', [\App\Http\Controllers\StudentAssistantshipController::class, 'scheduleScreening'])->name('assignments.schedule-screening');
            Route::post('/assignments/{assignment}/complete-screening', [\App\Http\Controllers\StudentAssistantshipController::class, 'completeScreening'])->name('assignments.complete-screening');
            Route::post('/assignments/{assignment}/approve', [\App\Http\Controllers\StudentAssistantshipController::class, 'approveAssignment'])->name('assignments.approve');
            Route::post('/assignments/{assignment}/activate', [\App\Http\Controllers\StudentAssistantshipController::class, 'activateAssignment'])->name('assignments.activate');

            // Work hour approvals
            Route::get('/pending-approvals', [\App\Http\Controllers\StudentAssistantshipController::class, 'pendingApprovals'])->name('pending-approvals');
            Route::post('/work-hours/{log}/approve', [\App\Http\Controllers\StudentAssistantshipController::class, 'approveHours'])->name('hours.approve');
            Route::post('/work-hours/{log}/reject', [\App\Http\Controllers\StudentAssistantshipController::class, 'rejectHours'])->name('hours.reject');

            // Payments
            Route::get('/payments', [\App\Http\Controllers\StudentAssistantshipController::class, 'payments'])->name('payments');
            Route::post('/payments/generate', [\App\Http\Controllers\StudentAssistantshipController::class, 'generatePayments'])->name('payments.generate');
            Route::post('/payments/{payment}/release', [\App\Http\Controllers\StudentAssistantshipController::class, 'releasePayment'])->name('payments.release');

            // Office management
            Route::get('/offices', [\App\Http\Controllers\StudentAssistantshipController::class, 'offices'])->name('offices');
            Route::post('/offices', [\App\Http\Controllers\StudentAssistantshipController::class, 'createOffice'])->name('offices.store');
            Route::put('/offices/{office}', [\App\Http\Controllers\StudentAssistantshipController::class, 'updateOffice'])->name('offices.update');
        });
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
        Route::get('student/scholarships/{scholarship}/details', [StudentController::class, 'getScholarshipDetails'])->name(
            'student.scholarships.details',
        );

        // Scholarship application routes (student-specific)
        Route::get('student/scholarships', [UnifiedScholarshipController::class, 'index'])->name('student.scholarships.index');

        // Application submission
        Route::get('student/scholarships/{scholarship}/apply', [UnifiedScholarshipController::class, 'create'])->name('student.scholarships.apply');
        Route::post('student/scholarships/{scholarship}/apply', [UnifiedScholarshipController::class, 'store'])->name('student.scholarships.store');

        // Application status tracking
        Route::get('student/scholarships/applications/{application}/status', [UnifiedScholarshipController::class, 'showStatus'])->name(
            'student.scholarships.applications.status',
        );
        Route::get('student/scholarships/applications/{application}', [UnifiedScholarshipController::class, 'showApplication'])->name(
            'student.scholarships.applications.show',
        );
        Route::get('student/scholarships/applications/{application}/complete', [UnifiedScholarshipController::class, 'edit'])->name(
            'student.scholarships.applications.edit',
        );

        // Document management for students
        Route::post('student/scholarships/applications/{application}/documents', [DocumentController::class, 'store'])->name(
            'student.scholarships.documents.store',
        );
        Route::patch('student/scholarships/applications/{application}/documents/{document}', [DocumentController::class, 'update'])->name(
            'student.scholarships.documents.update',
        );
        Route::delete('student/scholarships/applications/{application}/documents/{document}', [DocumentController::class, 'destroy'])->name(
            'student.scholarships.documents.destroy',
        );
        Route::patch('student/scholarships/applications/{application}/documents/{documentType}', [
            UnifiedScholarshipController::class,
            'updateDocument',
        ])->name('student.scholarships.applications.documents.update');

        // Interview routes (student-specific)
        Route::get('student/interviews', [InterviewController::class, 'index'])->name('student.interviews.index');
        Route::get('student/interviews/{interview}', [InterviewController::class, 'show'])->name('student.interviews.show');
        Route::post('student/interviews/{interview}/reschedule', [InterviewController::class, 'requestReschedule'])->name(
            'student.interviews.reschedule',
        );

        // Notification management routes
        Route::get('student/notifications', [NotificationController::class, 'index'])->name('student.notifications.index');
        Route::post('student/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('student.notifications.read');
        Route::post('student/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('student.notifications.read-all');
        Route::delete('student/notifications/{notification}', [NotificationController::class, 'destroy'])->name('student.notifications.destroy');
        Route::post('student/notifications/bulk-delete', [NotificationController::class, 'bulkDelete'])->name('student.notifications.bulk-delete');
        Route::get('student/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name(
            'student.notifications.unread-count',
        );

        // Renewal routes (student)
        Route::get('student/renewals/check/{application}', [RenewalController::class, 'checkEligibility'])->name('renewal.check-eligibility');
        Route::get('student/renewals/create/{application}', [RenewalController::class, 'create'])->name('renewal.create');
        Route::post('student/renewals/store/{application}', [RenewalController::class, 'store'])->name('renewal.store');
        Route::get('student/renewals/{renewal}', [RenewalController::class, 'show'])->name('renewal.show');
        Route::post('student/renewals/{renewal}/documents', [RenewalController::class, 'uploadDocuments'])->name('renewal.documents.upload');

        // Student Assistantship Routes (for students)
        Route::prefix('student/assistantship')->name('student.assistantship.')->group(function () {
            Route::get('/', [\App\Http\Controllers\StudentAssistantshipController::class, 'studentDashboard'])->name('dashboard');
            Route::get('/log-hours', [\App\Http\Controllers\StudentAssistantshipController::class, 'logHoursForm'])->name('log-hours');
            Route::post('/log-hours', [\App\Http\Controllers\StudentAssistantshipController::class, 'storeHours'])->name('log-hours.store');
            Route::get('/hours-history', [\App\Http\Controllers\StudentAssistantshipController::class, 'hoursHistory'])->name('hours-history');
            Route::get('/payment-history', [\App\Http\Controllers\StudentAssistantshipController::class, 'paymentHistory'])->name('payment-history');
        });
    });

    // Only allow users to generate their own PDFs, or staff/admin to generate any user's PDF
    Route::get('/generate-scholarship-pdf/{user}', [PdfController::class, 'generatePdf'])->name('generate.scholarship.pdf');

    // CHED PDF generation route - expects a user ID
    Route::get('/generate-ched-scholarship-pdf/{user}', [PdfController::class, 'generateChedPdf'])->name('generate.ched.scholarship.pdf');

    // Annex 1 TPDF PDF generation route - expects a user ID
    Route::get('/generate-annex1-tpdf-pdf/{user}', [PdfController::class, 'generateAnnex1Pdf'])->name('generate.annex1.tpdf.pdf');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
