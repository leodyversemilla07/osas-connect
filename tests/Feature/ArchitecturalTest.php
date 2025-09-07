<?php

describe('Architectural Testing', function () {
    test('controllers should have correct naming')
        ->expect('App\Http\Controllers')
        ->toHaveSuffix('Controller');

    test('requests should extend FormRequest')
        ->expect('App\Http\Requests')
        ->toExtend('Illuminate\Foundation\Http\FormRequest');

    test('models should extend Model')
        ->expect('App\Models')
        ->toExtend('Illuminate\Database\Eloquent\Model');

    test('policies should have correct naming')
        ->expect('App\Policies')
        ->toHaveSuffix('Policy');

    test('services should be in the correct namespace')
        ->expect('App\Services')
        ->toBeClasses();

    test('observers should have correct naming')
        ->expect('App\Observers')
        ->toHaveSuffix('Observer');

    test('events should be in the correct namespace')
        ->expect('App\Events')
        ->toBeClasses();

    test('listeners should be in the correct namespace')
        ->expect('App\Listeners')
        ->toBeClasses();

    test('mail classes should be in the correct namespace')
        ->expect('App\Mail')
        ->toBeClasses();

    test('models should use consistent fillable patterns')
        ->expect('App\Models')
        ->toBeClasses();
});
