<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InterviewController extends Controller
{
    public function index()
    {
        $student = auth()->user()->studentProfile;

        $interviews = Interview::whereHas('application', function ($query) use ($student) {
            $query->where('student_id', $student->id);
        })
            ->with('application.scholarship')
            ->get();

        return Inertia::render('student/interviews/index', [
            'interviews' => $interviews,
        ]);
    }

    public function requestReschedule(Request $request, Interview $interview)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $interview->update([
            'status' => 'rescheduled',
            'remarks' => $request->reason,
        ]);

        // Send notification to OSAS staff
        $interview->application->notifications()->create([
            'type' => 'interview_reschedule_request',
            'message' => "Student requested interview reschedule: {$request->reason}",
        ]);

        return back()->with('success', 'Reschedule request submitted successfully');
    }

    public function show(Interview $interview)
    {
        return Inertia::render('student/interviews/show', [
            'interview' => $interview->load('application.student'),
        ]);
    }
}
