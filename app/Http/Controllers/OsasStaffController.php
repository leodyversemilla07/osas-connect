<?php

namespace App\Http\Controllers;

use App\Models\OsasStaffProfile;
use App\Models\StaffInvitation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class OsasStaffController extends Controller
{
    /**
     * Show the staff dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('osas_staff/dashboard');
    }
    
    /**
     * Show the invitation acceptance form.
     */
    public function showAcceptInvitationForm(Request $request, $token)
    {
        if (!$request->hasValidSignature()) {
            abort(401, 'Invalid or expired invitation link.');
        }
        
        $invitation = StaffInvitation::where('token', $token)
            ->where('accepted_at', null)
            ->where('expires_at', '>', Carbon::now())
            ->firstOrFail();
              return Inertia::render('auth/accept-invitation', [
            'invitation' => [
                'email' => $invitation->email,
                'token' => $invitation->token,
            ],
        ]);
    }
    
    /**
     * Process the invitation acceptance.
     */
    public function acceptInvitation(Request $request)
    {
        $invitation = StaffInvitation::where('token', $request->token)
            ->where('accepted_at', null)
            ->where('expires_at', '>', Carbon::now())
            ->firstOrFail();
            
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'staff_id' => ['required', 'string', 'max:255', 'unique:osas_staff_profiles'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        
        DB::beginTransaction();
        
        try {
            // Create the user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_name' => $request->middle_name,
                'email' => $invitation->email,
                'password' => Hash::make($request->password),
                'role' => 'osas_staff',
            ]);
            
            // Create the staff profile            
            OsasStaffProfile::create([
                'user_id' => $user->id,
                'staff_id' => $request->staff_id,
            ]);
              // Mark invitation as accepted
            $invitation->update([
                'accepted_at' => Carbon::now(),
                'status' => 'accepted',
            ]);
            
            DB::commit();
            
            // Log the user in
            \Illuminate\Support\Facades\Auth::login($user);
            
            return redirect()->route('osas.dashboard')->with('success', 'Welcome to OSAS Connect! Your account has been created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to process invitation: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the student records page.
     */
    public function studentRecords(Request $request): Response
    {
        $query = User::with('studentProfile')
            ->where('role', 'student');

        // Apply filters if provided
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhereHas('studentProfile', function($q) use ($search) {
                        $q->where('student_id', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->course) {
            $query->whereHas('studentProfile', function($q) use ($request) {
                $q->where('course', $request->course);
            });
        }

        if ($request->year_level) {
            $query->whereHas('studentProfile', function($q) use ($request) {
                $q->where('year_level', $request->year_level);
            });
        }

        $students = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $courses = [
            'Bachelor of Arts in Political Science',
            'Bachelor of Science in Tourism Management',
            'Bachelor of Science in Hospitality Management',
            'Bachelor of Science in Information Technology',
            'Bachelor of Science in Computer Engineering',
            'Bachelor of Science in Criminology',
            'Bachelor of Secondary Education',
            'Bachelor of Elementary Education',
            'Bachelor of Science in Fisheries'
        ];

        $yearLevels = [
            '1st Year',
            '2nd Year',
            '3rd Year',
            '4th Year'
        ];

        return Inertia::render('osas_staff/student-records', [
            'students' => $students,
            'filters' => [
                'search' => $request->search,
                'course' => $request->course,
                'year_level' => $request->year_level,
            ],
            'courses' => $courses,
            'yearLevels' => $yearLevels,
        ]);
    }

    /**
     * Get detailed student information
     */
    public function getStudentDetails($id): Response
    {
        $student = User::with('studentProfile')
            ->where('role', 'student')
            ->findOrFail($id);

        $studentData = array_merge($student->toArray(), [
            'student_id' => $student->studentProfile->student_id,
            'course' => $student->studentProfile->course,
            'major' => $student->studentProfile->major,
            'year_level' => $student->studentProfile->year_level,
            'scholarships' => $student->studentProfile->scholarships,
        ]);

        return Inertia::render('osas_staff/student-details', [
            'student' => $studentData
        ]);
    }

    /**
     * Show the scholarship records page.
     */
    public function scholarshipRecords(): Response
    {
        return Inertia::render('osas_staff/manage-scholarships');
    }

    /**
     * Show the events page for OSAS staff.
     */
    public function events(): Response
    {
        // You can load events data here as needed
        $events = [];
        
        return Inertia::render('osas_staff/events', [
            'events' => $events
        ]);
    }

    /**
     * Show the reports page for OSAS staff.
     */
    public function reports(): Response
    {
        // You can load reports data here as needed
        $reports = [];
        
        return Inertia::render('osas_staff/reports', [
            'reports' => $reports
        ]);
    }
}