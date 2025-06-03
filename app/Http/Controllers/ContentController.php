<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\SiteComponent;
use App\Models\Scholarship;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    /**
     * Get header and footer content for all public pages
     */
    private function getSiteComponents(): array
    {
        $header = SiteComponent::getHeader();
        $footer = SiteComponent::getFooter();

        return [
            'headerContent' => $header ? $header->content : null,
            'footerContent' => $footer ? $footer->content : null,
        ];
    }

    /**
     * Display announcements page with dynamic content.
     */
    public function announcements(): Response
    {
        $announcements = Page::getAnnouncements()->map(function ($page) {
            $data = $page->getAnnouncementData();

            // Calculate days remaining if there's a deadline
            if (isset($data['deadline'])) {
                $deadline = Carbon::parse($data['deadline']);
                $data['daysRemaining'] = max(0, Carbon::now()->diffInDays($deadline, false));
            }

            return $data;
        });

        return Inertia::render('announcements', [
            'announcements' => $announcements,
            ...$this->getSiteComponents(),
        ]);
    }

    /**
     * Display scholarships page with dynamic content.
     */
    public function scholarships(): Response
    {
        $scholarships = Scholarship::active()->get()->map(function ($scholarship) {
            // Calculate days remaining for deadline
            $daysRemaining = 0;
            if ($scholarship->deadline) {
                $daysRemaining = max(0, Carbon::now()->diffInDays($scholarship->deadline, false));
            }

            // Map scholarship type to expected format
            $typeMapping = [
                'academic_full' => 'Academic Scholarship',
                'academic_partial' => 'Academic Scholarship',
                'student_assistantship' => 'Student Assistantship Program',
                'performing_arts_full' => 'Performing Arts Scholarship',
                'performing_arts_partial' => 'Performing Arts Scholarship',
                'economic_assistance' => 'Economic Assistance',
                'others' => 'Academic Scholarship', // Default fallback
            ];

            return [
                'id' => $scholarship->id,
                'name' => $scholarship->name,
                'amount' => $scholarship->amount ? '₱' . number_format($scholarship->amount, 2) : 'TBD',
                'deadline' => $scholarship->deadline ? $scholarship->deadline->format('M d, Y') : 'No deadline',
                'daysRemaining' => $daysRemaining,
                'type' => $typeMapping[$scholarship->type] ?? 'Academic Scholarship',
                'description' => $scholarship->description ?? 'No description available',
                'requirements' => $scholarship->getEligibilityCriteria(),
            ];
        });

        return Inertia::render('scholarships', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'scholarships' => $scholarships,
            ...$this->getSiteComponents(),
        ]);
    }

    /**
     * Get announcement by ID for detailed view.
     */
    public function getAnnouncement($id)
    {
        $page = Page::findOrFail($id);

        if (! $page->isAnnouncement()) {
            abort(404);
        }

        return response()->json($page->getAnnouncementData());
    }

    /**
     * Get scholarship by ID for detailed view.
     */
    public function getScholarship($id)
    {
        $scholarship = Scholarship::findOrFail($id);

        // Calculate days remaining for deadline
        $daysRemaining = 0;
        if ($scholarship->deadline) {
            $daysRemaining = max(0, Carbon::now()->diffInDays($scholarship->deadline, false));
        }

        // Map scholarship type to expected format
        $typeMapping = [
            'academic_full' => 'Academic Scholarship',
            'academic_partial' => 'Academic Scholarship',
            'student_assistantship' => 'Student Assistantship Program',
            'performing_arts_full' => 'Performing Arts Scholarship',
            'performing_arts_partial' => 'Performing Arts Scholarship',
            'economic_assistance' => 'Economic Assistance',
            'others' => 'Academic Scholarship', // Default fallback
        ];

        return response()->json([
            'id' => $scholarship->id,
            'name' => $scholarship->name,
            'amount' => $scholarship->amount ? '₱' . number_format($scholarship->amount, 2) : 'TBD',
            'deadline' => $scholarship->deadline ? $scholarship->deadline->format('M d, Y') : 'No deadline',
            'daysRemaining' => $daysRemaining,
            'type' => $typeMapping[$scholarship->type] ?? 'Academic Scholarship',
            'description' => $scholarship->description ?? 'No description available',
            'requirements' => $scholarship->getEligibilityCriteria(),
            'slots_available' => $scholarship->slots_available,
            'remaining_slots' => $scholarship->getRemainingSlots(),
            'eligibility_criteria' => $scholarship->getFormattedEligibilityCriteria(),
            'required_documents' => $scholarship->getRequiredDocuments(),
            'is_accepting_applications' => $scholarship->isAcceptingApplications(),
        ]);
    }
}
