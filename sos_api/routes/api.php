<?php

use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\ForceJsonResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['json.response'])->group(function () {

    Route::controller(EquipmentController::class)->group(function () {
        Route::get('/equipments', 'index');
        Route::get('/equipments/{id}', 'show');
        Route::post('/equipments', 'store');
        Route::put('/equipments/{id}', 'update');
        Route::delete('/equipments/{id}', 'destroy');
        Route::get('/users/{id}/equipments', 'getUserEquipments');
    });

    Route::controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'index');
        Route::get('/categories/{id}', 'show');
        Route::post('/categories', 'store');
        Route::put('/categories/{id}', 'update');
        Route::delete('/categories/{id}', 'destroy');
    });

    Route::controller(UserController::class)->group(function () {

        Route::get('/users', 'index');
        Route::get('/users/staff', 'getStaffUsers');
        Route::get('/users/{id}', 'show');
        Route::post('/users/name/{name}', 'getUserByName');
        Route::put('/users/{id}', 'update');
        Route::delete('/users/{id}', 'destroy');
        Route::post('/users/add', 'store');
    });
    
    Route::controller(OrderController::class)->group(function () {
        Route::get('/orders', 'getAll');
        Route::get('/orders/opened', 'getOpenedOrders');
        Route::get('/orders/in-progress', 'getInProgressOrders');
        Route::get('/orders/finished', 'getFinishedOrders');
        Route::get('/orders/develired', 'getDeveliredOrders');
        Route::get('/orders/{id}', 'getById');
    });

    Route::controller(PartController::class)->group(function() {
        Route::get('/parts', 'getAll');
        Route::post('/parts/search', 'search');
        Route::get('/parts/{id}', 'getById');
        Route::put('/parts/{id}', 'update');
    });
    
    Route::controller(PhotoController::class)->group(function() {
        Route::post('/photos', 'store');
    });

    Route::fallback(function () {
        abort(404, 'API resource not found');
    });
});




//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    //return $request->user();
//});
