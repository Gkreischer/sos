<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\OrderStatusEnum;
use App\Models\UserType;
use App\Models\Equipment;
use App\UserTypeEnum;

class MetricController extends Controller
{
    public function getCountOrderByPeriod(Request $request)
    {
        try {

            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)->startOfDay()->toDateTimeString();
            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)->endOfDay()->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {

                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período'
                ], 400);
            }

            $cacheKey = 'metrics:order:count_by_month:' . $request->startDate . ':' . $request->endDate;

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    return Order::without([
                        'user',
                        'equipment',
                        'orderParts',
                        'images',
                        'status',
                        'technician'
                    ])
                        ->selectRaw("
                                DATE_FORMAT(created_at, '%Y-%m') as month,
                                COUNT(*) as count
                            ")
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->groupBy('month')
                        ->orderBy('month')
                        ->get()
                        ->toArray();
                }
            );

            return response($metrics);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function getTypeOrderByPeriodMetric(Request $request)
    {
        try {

            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)->startOfDay()->toDateTimeString();
            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)->endOfDay()->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {

                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período'
                ], 400);
            }

            $statuses = OrderStatus::all();

            $cacheKey = 'metrics:order:status_type:' . $request->startDate . ':' . $request->endDate;

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate, $statuses) {

                    $metrics = [];

                    foreach ($statuses as $status) {
                        $metrics[$status->name] = $status->orders()
                            ->where(function ($query) use ($startDate, $endDate) {

                                if (!empty($startDate)) {
                                    $query->where('created_at', '>=', $startDate);
                                }

                                if (!empty($endDate)) {
                                    $query->where('created_at', '<=', $endDate);
                                }
                            })
                            ->count();
                    }

                    return $metrics;
                }
            );


            return response($metrics);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTotalPriceOrderByPeriod(Request $request)
    {
        try {

            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)->startOfDay()->toDateTimeString();
            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)->endOfDay()->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {

                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período'
                ], 400);
            }

            $metrics = [];

            $cacheKey = 'metrics:order:total_price:' . $request->startDate . ':' . $request->endDate;

            $metrics = Order::without([
                'user',
                'equipment',
                'orderParts',
                'images',
                'status',
                'technician'
            ])
                ->selectRaw("
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(total_price) as total_price
            ")
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            return response($metrics);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRevenueByStatus(Request $request)
    {

        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)->startOfDay()->toDateTimeString();
            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)->endOfDay()->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {

                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período'
                ], 400);
            }

            $cacheKey = 'metrics:order:revenue:' . $request->startDate . ':' . $request->endDate;

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    $orderStatuses = OrderStatus::with('orders')->get();

                    $revenue = [];

                    foreach ($orderStatuses as $status) {
                        $revenue[$status->name] = $status->orders()
                            ->where(function ($query) use ($startDate, $endDate) {
                                if (!empty($startDate)) {
                                    $query->where('created_at', '>=', $startDate);
                                }

                                if (!empty($endDate)) {
                                    $query->where('created_at', '<=', $endDate);
                                }
                            })
                            ->sum('total_price');
                    }

                    return $revenue;
                }
            );

            // Transform $metrics to array
            $metrics = array_map(function ($key, $value) {
                return [
                    'name' => $key,
                    'revenue' => $value
                ];
            }, array_keys($metrics), $metrics);

            return response($metrics, 200);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTechnicianData(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)->startOfDay()->toDateTimeString();
            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)->endOfDay()->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período'
                ], 400);
            }

            // Substituí as barras por hífen na chave do cache para evitar problemas de string
            $cacheKey = 'metrics:order:technician:' . str_replace('/', '-', $request->startDate) . ':' . str_replace('/', '-', $request->endDate);

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    $technicianType = UserType::where('name', 'Técnico')->first();

                    if (!$technicianType) {
                        return [];
                    }

                    $technicians = $technicianType->users()
                        ->select('users.id', 'users.name')
                        ->withCount(['orders' => function ($query) use ($startDate, $endDate) {
                            $query->where('status_id', 3)->whereBetween('created_at', [$startDate, $endDate]);
                        }])
                        ->withSum(['orders as total_revenue' => function ($query) use ($startDate, $endDate) {
                            $query->whereBetween('created_at', [$startDate, $endDate]);
                        }], 'total_price')
                        ->orderByDesc('orders_count')
                        ->limit(5)
                        ->get();

                    $technicians->transform(function ($technician) {
                        $technician->total_orders = $technician->orders_count;
                        $technician->total_revenue = $technician->total_revenue ?? 0;

                        unset($technician->orders_count);
                        return $technician;
                    });

                    return $technicians;
                }
            );

            if (empty($metrics) && !is_array($metrics)) {
                return response(['message' => 'Tipo técnico não encontrado'], 404);
            }

            return response($metrics, 200);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getEquipmentWithMostOrders(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)->startOfDay()->toDateTimeString();
            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)->endOfDay()->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período'
                ], 400);
            }

            $cacheKey = 'metrics:order:equipment:' . $request->startDate . ':' . $request->endDate;

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(5),
                function () use ($startDate, $endDate) {

                    $equipments = Equipment::without(['category', 'user'])->with(['orders' => function ($query) use ($startDate, $endDate) {
                        $query->select('orders.id', 'orders.user_id', 'orders.equipment_id', 'orders.title', 'orders.status_id', 'orders.created_at', 'orders.updated_at')
                            ->whereBetween('created_at', [$startDate, $endDate]);
                    }])
                        ->limit(5)
                        ->get();

                    return $equipments ? $equipments->toArray() : null;
                }
            );

            return response($metrics);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPendingOrdersCount()
    {
        try {



            $cacheKey = 'metrics:orders:pending:count';

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addHours(1),
                function () {
                    $orders = Order::where('status_id', OrderStatusEnum::PENDING)->count();

                    return $orders;
                }
            );

            return response(['result' => $metrics]);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getInProgressOrdersCount()
    {
        try {



            $cacheKey = 'metrics:orders:inprogress:count';

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addHours(1),
                function () {
                    $orders = Order::where('status_id', OrderStatusEnum::IN_PROGRESS)->count();

                    return $orders;
                }
            );

            return response(['result' => $metrics]);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTotalClientsCount()
    {
        try {
            $cacheKey = 'metrics:orders:clients:count';

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addHours(1),
                function () {
                    $users = User::where('type_id', UserTypeEnum::CLIENT)->count();

                    return $users;
                }

            );
            return response(['result' => $metrics]);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
