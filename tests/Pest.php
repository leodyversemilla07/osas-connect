<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(Tests\TestCase::class)->use(Illuminate\Foundation\Testing\RefreshDatabase::class)->in('Feature');

pest()->extend(Tests\TestCase::class)->use(Illuminate\Foundation\Testing\RefreshDatabase::class)->in('Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Create a user for testing purposes
 */
function createUser(array $attributes = []): \App\Models\User
{
    return \App\Models\User::factory()->create($attributes);
}

/**
 * Create an authenticated user and return the user instance
 */
function actingAsUser(array $attributes = []): \App\Models\User
{
    $user = createUser($attributes);
    test()->actingAs($user);

    return $user;
}

/**
 * Create a student user with profile
 */
function createStudent(array $userAttributes = [], array $profileAttributes = []): \App\Models\User
{
    $user = \App\Models\User::factory()->create(array_merge(['role' => 'student'], $userAttributes));
    \App\Models\StudentProfile::factory()->create(array_merge(['user_id' => $user->id], $profileAttributes));

    return $user;
}

/**
 * Create an admin user with profile
 */
function createAdmin(array $userAttributes = [], array $profileAttributes = []): \App\Models\User
{
    $user = \App\Models\User::factory()->create(array_merge(['role' => 'admin'], $userAttributes));
    \App\Models\AdminProfile::factory()->create(array_merge(['user_id' => $user->id], $profileAttributes));

    return $user;
}

/**
 * Create an OSAS staff user with profile
 */
function createOsasStaff(array $userAttributes = [], array $profileAttributes = []): \App\Models\User
{
    $user = \App\Models\User::factory()->create(array_merge(['role' => 'osas_staff'], $userAttributes));
    \App\Models\OsasStaffProfile::factory()->create(array_merge(['user_id' => $user->id], $profileAttributes));

    return $user;
}

/**
 * Create a scholarship for testing
 */
function createScholarship(array $attributes = []): \App\Models\Scholarship
{
    return \App\Models\Scholarship::factory()->create($attributes);
}

/**
 * Create a scholarship application for testing
 */
function createScholarshipApplication(array $attributes = []): \App\Models\ScholarshipApplication
{
    return \App\Models\ScholarshipApplication::factory()->create($attributes);
}

/**
 * Assert that a response redirects to login
 */
function assertRedirectsToLogin($response): void
{
    $response->assertRedirect(route('login'));
}
