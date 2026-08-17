<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

final class HealthService
{
    public static function checkDatabaseConnection(): array
    {
        try {
            DB::connection()->getPdo();

            return ['status' => 'connected'];
        } catch (\Exception $e) {
            return ['status' => 'disconnected', 'error' => $e->getMessage()];
        }
    }

    public static function checkRedisConnection(): array
    {
        try {
            Redis::connection()->ping();

            return ['status' => 'connected'];
        } catch (\Exception $e) {
            return ['status' => 'disconnected', 'error' => $e->getMessage()];
        }
    }
}
