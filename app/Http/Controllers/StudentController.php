<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display the student dashboard.
     */
    public function index(): Response
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get count of active/approved scholarships and add it to student data
        $studentData = $student->toArray();

        // Count both existing scholarships and approved applications
        $existingScholarships = ! empty($student->existing_scholarships) ? 1 : 0;
        $approvedApplications = $student->scholarshipApplications()
            ->where('status', 'approved')
            ->count();

        $studentData['scholarships'] = $existingScholarships + $approvedApplications;

        return Inertia::render('student/dashboard', [
            'student' => $studentData,
        ]);
    }

    public function showScholarships(): Response
    {
        $student = Auth::user()->studentProfile;

        if (! $student) {
            return Inertia::render('errors/404', [
                'message' => 'Student profile not found',
            ]);
        }

        // Get count of active/approved scholarships and add it to student data
        $studentData = $student->toArray();

        // Count both existing scholarships and approved applications
        $existingScholarships = ! empty($student->existing_scholarships) ? 1 : 0;
        $approvedApplications = $student->scholarshipApplications()
            ->where('status', 'approved')
            ->count();

        $studentData['scholarships'] = $existingScholarships + $approvedApplications;

        return Inertia::render('student/view-scholarships', [
            'student' => $studentData,
        ]);
    }
}
