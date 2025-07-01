<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\SiteComponent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class CMSController extends Controller
{
    /**
     * Display a listing of CMS pages.
     */
    public function index(): Response
    {
        $pages = Page::orderBy('title')->get();

        return Inertia::render('admin/cms/index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create(): Response
    {
        return Inertia::render('admin/cms/create');
    }

    /**
     * Show preview of page content
     */
    public function preview(): Response
    {
        return Inertia::render('admin/cms/preview');
    }

    /**
     * Store a newly created page in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:cms_pages,slug',
            'content' => 'required|array',
        ]);

        $page = Page::create($validated);

        return redirect()->route('admin.cms.index')->with('success', 'Page created successfully.');
    }

    /**
     * Display the specified page.
     */
    public function show(Page $page): Response
    {
        return Inertia::render('admin/cms/show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
                'created_at' => $page->created_at,
                'updated_at' => $page->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified page.
     */
    public function edit(Page $page): Response
    {
        return Inertia::render('admin/cms/edit', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content ?: [],
                'created_at' => $page->created_at,
                'updated_at' => $page->updated_at,
            ],
        ]);
    }

    /**
     * Update the specified page in storage.
     */
    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:cms_pages,slug,'.$page->id,
            'content' => 'required|array',
        ]);

        try {
            $page->update($validated);

            return redirect()->route('admin.cms.edit', $page)->with('success', 'Page updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to update page: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified page from storage.
     */
    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.cms.index')->with('success', 'Page deleted successfully.');
    }

    /**
     * Get page content for public pages
     */
    public function getPageContent(string $slug)
    {
        $page = Page::findBySlug($slug);

        if (! $page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        return response()->json([
            'title' => $page->title,
            'content' => $page->content ?: [],
        ]);
    }

    /**
     * Display a page on the public frontend.
     */
    public function showPublic(string $slug)
    {
        $page = Page::findBySlug($slug);

        if (! $page) {
            abort(404, 'Page not found');
        }

        return Inertia::render('cms/public-page', [
            'page' => [
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content ?: [],
            ],
        ]);
    }

    /**
     * Show the header editing page
     */
    public function editHeader(): Response
    {
        $header = SiteComponent::getHeader();

        return Inertia::render('admin/cms/header', [
            'header' => $header
                ? [
                    'id' => $header->id,
                    'content' => $header->content,
                    'updated_at' => $header->updated_at,
                ]
                : null,
        ]);
    }

    /**
     * Update header content
     */
    public function updateHeader(Request $request)
    {
        // If content is sent as JSON string, decode it
        $content = $request->input('content');
        if (is_string($content)) {
            $content = json_decode($content, true);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        // Decode the JSON content
        $decodedContent = json_decode($validated['content'], true);

        // Validate the decoded content structure
        $validator = Validator::make($decodedContent, [
            'logo_text' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'navigation' => 'required|array',
            'navigation.*.label' => 'required|string|max:50',
            'navigation.*.url' => 'required|string|max:255',
            'navigation.*.active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        SiteComponent::updateHeader($decodedContent);

        return redirect()->route('admin.cms.header')->with('success', 'Header updated successfully.');
    }

    /**
     * Show the footer editing page
     */
    public function editFooter(): Response
    {
        $footer = SiteComponent::getFooter();

        return Inertia::render('admin/cms/footer', [
            'footer' => $footer
                ? [
                    'id' => $footer->id,
                    'content' => $footer->content,
                    'updated_at' => $footer->updated_at,
                ]
                : null,
        ]);
    }

    /**
     * Update footer content
     */
    public function updateFooter(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        // Decode the JSON content
        $decodedContent = json_decode($validated['content'], true);

        // Validate the decoded content structure
        $validator = Validator::make($decodedContent, [
            'cta_title' => 'required|string|max:255',
            'cta_description' => 'required|string|max:500',
            'cta_button_text' => 'required|string|max:50',
            'cta_button_url' => 'required|string|max:255',
            'about_title' => 'required|string|max:255',
            'about_text' => 'required|string|max:1000',
            'social_links' => 'array',
            'social_links.*.platform' => 'required|string|max:50',
            'social_links.*.url' => 'required|string|max:255',
            'social_links.*.active' => 'boolean',
            'quick_links' => 'array',
            'quick_links.*.label' => 'required|string|max:50',
            'quick_links.*.url' => 'required|string|max:255',
            'quick_links.*.active' => 'boolean',
            'support_links' => 'array',
            'support_links.*.label' => 'required|string|max:50',
            'support_links.*.url' => 'required|string|max:255',
            'support_links.*.active' => 'boolean',
            'contact_info' => 'required|array',
            'contact_info.address' => 'required|string|max:500',
            'contact_info.email' => 'required|email',
            'contact_info.viber' => 'nullable|string|max:50',
            'contact_info.hours' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        SiteComponent::updateFooter($decodedContent);

        return redirect()->route('admin.cms.footer')->with('success', 'Footer updated successfully.');
    }
}
