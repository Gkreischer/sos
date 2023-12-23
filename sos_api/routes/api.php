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
    Route::get('/equipments/{id}', 'show');
    Route::post('/equipments', 'store');
    Route::put('/equipments/{id}', 'update');
    Route::delete('/equipments/{id}', 'destroy');
});

Route::fallback(function (){
    abort(404, 'API resource not found');
});

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    //return $request->user();
//});
