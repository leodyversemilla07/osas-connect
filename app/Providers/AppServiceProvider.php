<?php

namespace App\Providers;

use App\Models\ScholarshipApplication;
use App\Observers\ScholarshipApplicationObserver;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // Only create storage link in local environment
        if (config('app.env') === 'local') {
            if (! is_dir(public_path('storage'))) {
                try {
                    app('files')->link(storage_path('app/public'), public_path('storage'));
                } catch (\Exception $e) {
                    // Silently fail if symlink creation fails
                }
            }
        }

        // Register model observers
        ScholarshipApplication::observe(ScholarshipApplicationObserver::class);
    }
}
