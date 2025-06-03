<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\SiteComponent;
use Carbon\Carbon;
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
        $scholarships = Page::getScholarships()->map(function ($page) {
            $data = $page->getScholarshipData();

            // Calculate days remaining for deadline
            if (isset($data['deadline'])) {
                $deadline = Carbon::parse($data['deadline']);
                $data['daysRemaining'] = max(0, Carbon::now()->diffInDays($deadline, false));
            }

            return $data;
        });

        return Inertia::render('scholarships', [
            'auth' => [
                'user' => auth()->user(),
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
        $page = Page::findOrFail($id);

        if (! $page->isScholarship()) {
            abort(404);
        }

        return response()->json($page->getScholarshipData());
    }
}
