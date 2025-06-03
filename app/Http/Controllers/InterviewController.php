<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterviewController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $interviews = Interview::whereHas('application', function ($query) use ($user) {
            $query->where('user_id', $user->id);
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
