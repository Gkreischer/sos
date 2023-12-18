<?php

use App\Http\Controllers\EquipmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::controller(EquipmentController::class)->group(function () {
    Route::get('/equipments', 'index');
    Route::get('/equipment/{id}', 'show');
    Route::post('/equipment', 'store');
    Route::put('/equipment/{id}', 'update');
    Route::delete('/equipment/{id}', 'destroy');
});

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    //return $request->user();
//});
