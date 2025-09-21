<?php

describe('Architectural Testing', function () {
    it('ensures all controllers have proper naming')
        ->expect('App\Http\Controllers')
        ->toHaveSuffix('Controller');

    it('ensures all requests extend FormRequest')
        ->expect('App\Http\Requests')
        ->toExtend('Illuminate\Foundation\Http\FormRequest');

    it('ensures all models extend the base Model')
        ->expect('App\Models')
        ->toExtend('Illuminate\Database\Eloquent\Model');

    it('ensures all policies have proper naming')
        ->expect('App\Policies')
        ->toHaveSuffix('Policy');

    it('ensures all services are in the App\Services namespace')
        ->expect('App\Services')
        ->toBeClasses();

    it('ensures all observers have proper naming')
        ->expect('App\Observers')
        ->toHaveSuffix('Observer');

    it('ensures all events are in the App\Events namespace')
        ->expect('App\Events')
        ->toBeClasses();

    it('ensures all listeners are in the App\Listeners namespace')
        ->expect('App\Listeners')
        ->toBeClasses();

    it('ensures all mail classes are in the App\Mail namespace')
        ->expect('App\Mail')
        ->toBeClasses();

    it('ensures all models use consistent fillable patterns')
        ->expect('App\Models')
        ->toBeClasses();
});
