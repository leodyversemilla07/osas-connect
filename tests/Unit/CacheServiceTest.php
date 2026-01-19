<?php

use App\Models\Scholarship;
use App\Models\User;
use App\Services\CacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

test('caches active scholarships', function () {
    Cache::flush();

    // Create scholarships
    Scholarship::factory()->create(['status' => 'active', 'deadline' => now()->addDays(30)]);
    Scholarship::factory()->create(['status' => 'draft', 'deadline' => now()->addDays(30)]);
    Scholarship::factory()->create(['status' => 'inactive', 'deadline' => now()->subDays(10)]);

    $cacheService = new CacheService();

    // First call should query database
    $result1 = $cacheService->getActiveScholarships();
    expect($result1)->toHaveCount(1)
        ->and($result1->first()->status)->toBe('active');

    // Second call should use cache
    $result2 = $cacheService->getActiveScholarships();
    expect($result2)->toHaveCount(1)
        ->and($result2->first()->id)->toBe($result1->first()->id);
});

test('caches scholarship by id', function () {
    Cache::flush();

    $scholarship = Scholarship::factory()->create(['status' => 'active']);

    $cacheService = new CacheService();

    // First call
    $result1 = $cacheService->getScholarshipById($scholarship->id);
    expect($result1)->not->toBeNull()
        ->and($result1->id)->toBe($scholarship->id);

    // Second call should use cache
    $result2 = $cacheService->getScholarshipById($scholarship->id);
    expect($result2)->not->toBeNull()
        ->and($result2->id)->toBe($scholarship->id);

    // Non-existent scholarship should return null
    $nonExistent = $cacheService->getScholarshipById(999999);
    expect($nonExistent)->toBeNull();
});

test('caches user profile', function () {
    Cache::flush();

    $user = User::factory()->student()->withProfile()->create();

    $cacheService = new CacheService();

    // First call
    $result1 = $cacheService->getUserProfile($user->id);
    expect($result1)->not->toBeNull();

    // Second call should use cache
    $result2 = $cacheService->getUserProfile($user->id);
    expect($result2)->not->toBeNull();

    // Non-existent user should return null
    $nonExistent = $cacheService->getUserProfile(999999);
    expect($nonExistent)->toBeNull();
});

test('caches scholarship statistics', function () {
    Cache::flush();

    Scholarship::factory()->count(3)->create(['status' => 'active']);
    Scholarship::factory()->count(2)->create(['status' => 'draft']);

    $cacheService = new CacheService();

    // First call
    $result1 = $cacheService->getScholarshipStatistics();
    expect($result1)->toHaveKey('total_scholarships')
        ->and($result1['total_scholarships'])->toBe(5)
        ->and($result1['active_scholarships'])->toBe(3);

    // Second call should use cache
    $result2 = $cacheService->getScholarshipStatistics();
    expect($result2)->toEqual($result1);
});

test('clears scholarship cache', function () {
    Cache::flush();

    $scholarship = Scholarship::factory()->create(['status' => 'active']);

    $cacheService = new CacheService();
    $cacheService->getScholarshipById($scholarship->id);

    // Clear specific scholarship cache
    $cacheService->clearScholarshipCache($scholarship->id);

    // Should query database again after clear
    $result = $cacheService->getScholarshipById($scholarship->id);
    expect($result)->not->toBeNull();
});

test('clears user cache', function () {
    Cache::flush();

    $user = User::factory()->student()->withProfile()->create();

    $cacheService = new CacheService();
    $cacheService->getUserProfile($user->id);

    // Clear user cache
    $cacheService->clearUserCache($user->id);

    // Should query database again after clear
    $result = $cacheService->getUserProfile($user->id);
    expect($result)->not->toBeNull();
});

test('clears all caches', function () {
    Cache::flush();

    $scholarship = Scholarship::factory()->create(['status' => 'active']);
    $user = User::factory()->student()->withProfile()->create();

    $cacheService = new CacheService();
    $cacheService->getScholarshipById($scholarship->id);
    $cacheService->getUserProfile($user->id);

    // Clear all caches
    $cacheService->clearAllCaches();

    // Everything should be cleared
    expect(Cache::get('scholarships.active'))->toBeNull();
    expect(Cache::get("user.{$user->id}.profile"))->toBeNull();
});

test('clears application related caches', function () {
    Cache::flush();

    $scholarship = Scholarship::factory()->create(['status' => 'active']);
    $user = User::factory()->student()->withProfile()->create();

    $cacheService = new CacheService();
    $cacheService->getScholarshipById($scholarship->id);
    $cacheService->getUserProfile($user->id);
    $cacheService->getScholarshipStatistics();

    // Clear application caches
    $cacheService->clearApplicationCaches($scholarship->id, $user->id);

    // Scholarship and user caches should be cleared
    expect(Cache::get("scholarship.{$scholarship->id}"))->toBeNull();
    expect(Cache::get("user.{$user->id}.profile"))->toBeNull();
    // Statistics cache should be cleared
    $stats = $cacheService->getScholarshipStatistics();
    expect($stats['total_scholarships'])->toBe(1);
});
