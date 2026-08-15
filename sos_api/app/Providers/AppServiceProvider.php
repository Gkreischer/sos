<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Observers\UserObserver;
use Spatie\Activitylog\Facades\Activity;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        User::observe(UserObserver::class);

        if ($this->app->runningInConsole()) {
            return;
        }

        Activity::beforeLogging(function (\Spatie\Activitylog\Contracts\Activity $activity) {
            $activity->properties = $activity->properties->put(
                'ip',
                request()->ip()
            );

            $activity->properties = $activity->properties->put(
                'hostname',
                request()->host()
            );

            $activity->properties = $activity->properties->put(
                'user_agent',
                request()->userAgent()
            );
        });
    }
}
