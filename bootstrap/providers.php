<?php

use Laravel\Fortify\FortifyServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    TelescopeServiceProvider::class,
    FortifyServiceProvider::class,
];
