<?php

namespace App\Services;

use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

/**
 * Cache Service for managing application-wide caching
 *
 * Provides caching for frequently accessed data like scholarships and user profiles
 * to reduce database queries and improve performance.
 */
class CacheService
{
    /**
     * Cache duration in seconds
     */
    private const SCHOLARSHIP_CACHE_TTL = 3600; // 1 hour
    private const USER_CACHE_TTL = 1800; // 30 minutes
    private const SCHOLARSHIP_LIST_CACHE_TTL = 600; // 10 minutes

    /**
     * Get all active scholarships from cache or database
     */
    public function getActiveScholarships(): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember('scholarships.active', self::SCHOLARSHIP_CACHE_TTL, function () {
            return Scholarship::where('status', 'active')
                ->where('deadline', '>=', now())
                ->orderBy('deadline')
                ->get();
        });
    }

    /**
     * Get scholarship by ID from cache or database
     */
    public function getScholarshipById(int $id): ?Scholarship
    {
        return Cache::remember("scholarship.{$id}", self::SCHOLARSHIP_CACHE_TTL, function () use ($id) {
            return Scholarship::find($id);
        });
    }

    /**
     * Get scholarship eligibility criteria from cache
     */
    public function getScholarshipEligibility(int $scholarshipId): array
    {
        $scholarship = $this->getScholarshipById($scholarshipId);

        if (! $scholarship) {
            return [];
        }

        return Cache::remember("scholarship.{$scholarshipId}.eligibility", self::SCHOLARSHIP_CACHE_TTL, function () use ($scholarship) {
            return $scholarship->eligibility_criteria ?? [];
        });
    }

    /**
     * Get user profile from cache or database
     */
    public function getUserProfile(int $userId): ?object
    {
        return Cache::remember("user.{$userId}.profile", self::USER_CACHE_TTL, function () use ($userId) {
            $user = User::find($userId);

            if (! $user) {
                return null;
            }

            // Get profile based on user role
            return match ($user->role) {
                'student' => $user->studentProfile()->first(),
                'osas_staff' => $user->osasStaffProfile()->first(),
                'admin' => $user->adminProfile()->first(),
                default => null,
            };
        });
    }

    /**
     * Get user with profile from cache or database
     */
    public function getUserWithProfile(int $userId): ?User
    {
        return Cache::remember("user.{$userId}.with_profile", self::USER_CACHE_TTL, function () use ($userId) {
            return User::with('profile')->find($userId);
        });
    }

    /**
     * Get scholarship statistics from cache
     */
    public function getScholarshipStatistics(): array
    {
        return Cache::remember('scholarships.statistics', self::SCHOLARSHIP_LIST_CACHE_TTL, function () {
            return [
                'total_scholarships' => Scholarship::count(),
                'active_scholarships' => Scholarship::where('status', 'active')->count(),
                'upcoming_deadlines' => Scholarship::where('status', 'active')
                    ->where('deadline', '>=', now())
                    ->where('deadline', '<=', now()->addDays(30))
                    ->count(),
                'scholarships_by_type' => Scholarship::selectRaw('type, COUNT(*) as count')
                    ->where('status', 'active')
                    ->groupBy('type')
                    ->pluck('count', 'type')
                    ->toArray(),
            ];
        });
    }

    /**
     * Clear scholarship cache
     */
    public function clearScholarshipCache(int|null $scholarshipId = null): void
    {
        if ($scholarshipId) {
            Cache::forget("scholarship.{$scholarshipId}");
            Cache::forget("scholarship.{$scholarshipId}.eligibility");
        } else {
            Cache::forget('scholarships.active');
            Cache::forget('scholarships.statistics');
        }
    }

    /**
     * Clear user cache
     */
    public function clearUserCache(int $userId): void
    {
        Cache::forget("user.{$userId}.profile");
        Cache::forget("user.{$userId}.with_profile");
    }

    /**
     * Clear all application caches
     */
    public function clearAllCaches(): void
    {
        Cache::flush();
    }

    /**
     * Clear application-specific caches after updates
     */
    public function clearApplicationCaches(?int $scholarshipId = null, ?int $userId = null): void
    {
        if ($scholarshipId) {
            $this->clearScholarshipCache($scholarshipId);
        }

        if ($userId) {
            $this->clearUserCache($userId);
        }
    }
}
