<?php

use App\Models\User;
use App\Models\StudentProfile;

test('it can create a student user and profile', function () {
    $user = User::factory()->withProfile()->create(['role' => 'student']);
    expect($user)->toBeInstanceOf(User::class);
    expect($user->studentProfile)->toBeInstanceOf(StudentProfile::class);

    $renewal = \App\Models\RenewalApplication::factory()->create(['student_id' => $user->id]);
    expect($renewal)->toBeInstanceOf(\App\Models\RenewalApplication::class);
});
