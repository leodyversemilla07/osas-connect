<?php

namespace App\Providers;

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
        if(!is_dir(public_path('storage'))) {
            app('files')->link(storage_path('app/public'), public_path('storage'));
        }

        //
    }
}
