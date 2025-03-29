<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::inertia('scholarships', 'scholarships')->name('scholarships');
Route::inertia('resources', 'resources')->name('resources');
Route::inertia('faqs', 'faqs')->name('faqs');
Route::inertia('contact', 'contact')->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
