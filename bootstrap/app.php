<?php

use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__.'/../routes/web.php', commands: __DIR__.'/../routes/console.php', health: '/up')
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance']);

        $middleware->web(append: [HandleAppearance::class, HandleInertiaRequests::class, AddLinkHeadersForPreloadedAssets::class]);

        $middleware->alias([
            'role' => CheckUserRole::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        // Send interview reminders daily at 9:00 AM
        $schedule->command('interviews:send-reminders')
            ->dailyAt('09:00')
            ->timezone('Asia/Manila');

        // Send renewal reminders daily at 8:00 AM
        $schedule->command('scholarships:send-renewal-reminders')
            ->dailyAt('08:00')
            ->timezone('Asia/Manila');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
