<?php

use App\Http\Controllers\BusinessInfoController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderStatusController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\MetricController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserTypeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\TicketController;
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


Route::middleware(['json.response'])->group(function () {


    Route::prefix('v1')->group(function () {
        Route::controller(LoginController::class)->group(function () {
            Route::post('/login', 'login');
        });

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::controller(LoginController::class)->group(function () {
                Route::post('/verify', 'verifyToken');
                Route::get('/logout', 'logout');
            });

            Route::controller(EquipmentController::class)->group(function () {
                Route::get('/equipments', 'index');
                Route::get('/equipments/{id}', 'show');
                Route::post('/equipments', 'store');
                Route::put('/equipments/{id}', 'update');
                Route::middleware(['role:admin|attendant'])->delete('/equipments/{id}', 'destroy');
                Route::get('/users/{id}/equipments', 'getUserEquipments');
                Route::post('/equipments/filter', 'getEquipmentByFilter');
            });

            Route::controller(CategoryController::class)->group(function () {
                Route::get('/categories', 'index');
                Route::get('/categories/{id}', 'show');
                Route::post('/categories', 'store');
                Route::put('/categories/{id}', 'update');
                Route::middleware(['role:admin|attendant'])->delete('/categories/{id}', 'destroy');
            });

            Route::controller(UserController::class)->group(function () {

                Route::post('/users', 'getUsersWithFilter');
                Route::get('/users/{id}', 'show');
                Route::put('/users/{id}', 'update');
                Route::middleware(['role:admin|attendant'])->delete('/users/{id}', 'destroy');
                Route::post('/users/add', 'store');
                Route::post('/user/image/change', 'updateUserAvatarImage');
                Route::put('/user/password', 'changePassword');
            });

            Route::controller(OrderController::class)->group(function () {
                Route::get('/orders', 'getAll');
                Route::post('/orders', 'store');
                Route::get('/orders/{id}', 'getById');
                Route::put('/orders/{id}', 'update');
                Route::get('/orders/status/{status_id}', 'getOrderByStatus');
                Route::post('/orders/search', 'searchByFilter');
                Route::get('/users/{id}/orders', 'getOrderHistory');
            });

            Route::controller(PartController::class)->group(function () {
                Route::get('/parts', 'getAll');
                Route::post('/parts', 'create');
                Route::post('/parts/search', 'search');
                Route::get('/parts/{id}', 'getById');
                Route::put('/parts/{id}', 'update');
                Route::post('/parts/filter', 'getPartByDescFilter');
                Route::delete('/parts/{id}', 'destroy');
            });

            Route::controller(PhotoController::class)->group(function () {
                Route::post('/photos', 'store');
            });

            Route::controller(OrderStatusController::class)->group(function () {
                Route::get('/order-status', 'index');
            });

            Route::controller(BusinessInfoController::class)->group(function () {
                Route::get('/settings/business-info', 'getBusinessInfo');
                Route::middleware(['role:admin'])->put('/settings/business-info', 'storeBusinessInfo');
            });

            Route::middleware('role:admin')->controller(MetricController::class)->group(function () {
                Route::post('/metrics/orders/year', 'getCountOrderByPeriod');
                Route::post('/metrics/orders/status', 'getTypeOrderByPeriodMetric');
                Route::post('/metrics/orders/total-price', 'getTotalPriceOrderByPeriod');
                Route::post('/metrics/orders/revenue', 'getRevenueByStatus');
                Route::post('/metrics/technicians', 'getTechnicianData');
                Route::post('/metrics/equipment', 'getEquipmentWithMostOrders');
            });

            Route::middleware('role:admin|technician|attendant')->controller(MetricController::class)->group(function () {
                Route::get('/metrics/pending-orders/count', 'getPendingOrdersCount');
                Route::get('/metrics/in-progress/count', 'getInProgressOrdersCount');
                Route::get('/metrics/clients/count', 'getTotalClientsCount');
            });

            Route::controller(UserTypeController::class)->group(function () {
                Route::get('/user-types', 'index');
            });

            Route::controller(PostController::class)->group(function () {
                Route::post('/posts/filter', 'index');
                Route::get('/posts/last', 'getLastPosts');
                Route::get('/posts/{id}', 'show');
                Route::post('/posts', 'store');
                Route::put('/posts/{id}', 'update');
                Route::delete('/posts/{id}', 'destroy');
            });

            Route::controller(NotificationController::class)->group(function () {
                Route::post('/notifications', 'sendMessage');
            });

            Route::controller(RoomController::class)->group(function () {
                Route::get('/rooms', 'index');
                Route::post('/rooms/room/messages', 'getRoomMessages');
                Route::get('/room/{id}/users', 'getRoomUsers');
                Route::post('/rooms', 'store');
                Route::put('/rooms/{id}', 'update');
                Route::get('/rooms/{id}', 'show');
                Route::delete('/rooms/{id}', 'destroy');
                Route::post('/rooms/block/users', 'blockRoomUsers');
                Route::post('/rooms/unblock/users', 'unblockRoomUsers');
            });

            Route::controller(ChatController::class)->group(function () {
                Route::post('/messages', 'store');
                Route::put('/messages/{id}', 'update');
                Route::delete('/messages/{id}', 'destroy');
            });

            Route::controller(TicketController::class)->group(function () {
                Route::post('/tickets/search', 'getByFilters');
                Route::post('/tickets', 'store');
                Route::get('/tickets/{id}', 'show');
                Route::put('/tickets/{id}', 'update');
                Route::delete('/tickets/{id}', 'destroy');
            });
        });

        Route::fallback(function () {
            abort(404, 'Erro.');
        });
    });
});
