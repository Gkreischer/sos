<?php

use App\Services\HealthService;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response([
        'name' => 'SOS API',
        'status' => 'healthy',
        'version' => config('app.version', '1.0.0'),
    ]);
});

Route::get('/health', function () {
    return response([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'database' => HealthService::checkDatabaseConnection(),
        'redis' => HealthService::checkRedisConnection(),
        'version' => config('app.version', '1.0.0'),
    ]);
});

Route::get('/api/health', function () {
    return response([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'database' => HealthService::checkDatabaseConnection(),
        'redis' => HealthService::checkRedisConnection(),
        'version' => config('app.version', '1.0.0'),
    ]);
});
