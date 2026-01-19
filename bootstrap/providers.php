<?php

use Laravel\Fortify\FortifyServiceProvider;
use Laravel\Telescope\TelescopeServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    TelescopeServiceProvider::class,
    FortifyServiceProvider::class,
];
