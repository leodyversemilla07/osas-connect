<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $table = 'cms_pages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['slug', 'title', 'content'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'content' => 'array',
    ];

    /**
     * Find a page by its slug.
     */
    public static function findBySlug(string $slug): ?Page
    {
        return static::where('slug', $slug)->first();
    }

    /**
     * Get the theme setting from the page content.
     */
    public function getTheme(): ?string
    {
        return $this->content['theme'] ?? null;
    }

    /**
     * Set the theme setting in the page content.
     */
    public function setTheme(?string $theme): void
    {
        $content = $this->content ?? [];

        if ($theme) {
            $content['theme'] = $theme;
        } else {
            unset($content['theme']);
        }

        $this->content = $content;
    }

    /**
     * Check if the page has a custom theme set.
     */
    public function hasCustomTheme(): bool
    {
        return ! empty($this->content['theme']);
    }

    /**
     * Get the color scheme setting from the page content.
     */
    public function getColorScheme(): ?array
    {
        return $this->content['color_scheme'] ?? null;
    }

    /**
     * Set the color scheme setting in the page content.
     */
    public function setColorScheme(?array $colorScheme): void
    {
        $content = $this->content ?? [];

        if ($colorScheme && ! empty($colorScheme['enabled'])) {
            $content['color_scheme'] = $colorScheme;
        } else {
            unset($content['color_scheme']);
        }

        $this->content = $content;
    }

    /**
     * Check if the page has a custom color scheme set.
     */
    public function hasCustomColorScheme(): bool
    {
        $colorScheme = $this->getColorScheme();

        return ! empty($colorScheme['enabled']);
    }

    /**
     * Get the effective color scheme for the page.
     * Returns the custom color scheme if enabled, null otherwise.
     */
    public function getEffectiveColorScheme(): ?array
    {
        $colorScheme = $this->getColorScheme();

        if (! empty($colorScheme['enabled'])) {
            return $colorScheme;
        }

        return null;
    }

    /**
     * Get the content type of the page.
     */
    public function getContentType(): string
    {
        return $this->content['type'] ?? 'page';
    }

    /**
     * Set the content type of the page.
     */
    public function setContentType(string $type): void
    {
        $content = $this->content ?? [];
        $content['type'] = $type;
        $this->content = $content;
    }

    /**
     * Check if this page is an announcement.
     */
    public function isAnnouncement(): bool
    {
        return $this->getContentType() === 'announcement';
    }

    /**
     * Check if this page is a scholarship.
     */
    public function isScholarship(): bool
    {
        return $this->getContentType() === 'scholarship';
    }

    /**
     * Get announcements from CMS pages.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAnnouncements()
    {
        return static::whereJsonContains('content->type', 'announcement')->orderBy('updated_at', 'desc')->get();
    }

    /**
     * Get scholarships from CMS pages.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getScholarships()
    {
        return static::whereJsonContains('content->type', 'scholarship')->orderBy('updated_at', 'desc')->get();
    }

    /**
     * Get announcement data from content.
     */
    public function getAnnouncementData(): ?array
    {
        if (! $this->isAnnouncement()) {
            return null;
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->content['description'] ?? '',
            'date' => $this->content['date'] ?? $this->updated_at->format('Y-m-d'),
            'category' => $this->content['category'] ?? 'General',
            'priority' => $this->content['priority'] ?? 'medium',
        ];
    }

    /**
     * Get scholarship data from content.
     */
    public function getScholarshipData(): ?array
    {
        if (! $this->isScholarship()) {
            return null;
        }

        return [
            'id' => $this->id,
            'name' => $this->title,
            'amount' => $this->content['amount'] ?? '',
            'deadline' => $this->content['deadline'] ?? '',
            'daysRemaining' => $this->content['daysRemaining'] ?? 0,
            'type' => $this->content['scholarshipType'] ?? 'Academic Scholarship',
            'description' => $this->content['description'] ?? '',
            'requirements' => $this->content['requirements'] ?? [],
        ];
    }
}
