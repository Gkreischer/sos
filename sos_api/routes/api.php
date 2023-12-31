<?php

use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\CategoryController;
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

Route::middleware(['json.response'])->group( function () {
    
    Route::controller(EquipmentController::class)->group(function () {
        Route::get('/equipments', 'index');
        Route::get('/equipments/{id}', 'show');
        Route::post('/equipments', 'store');
        Route::put('/equipments/{id}', 'update');
        Route::delete('/equipments/{id}', 'destroy');
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
        Route::get('/users/{id}', 'show');
        Route::post('/users/name/{name}', 'getUserByName');
    });

    Route::fallback(function (){
        abort(404, 'API resource not found');
    });
});




//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    //return $request->user();
//});
