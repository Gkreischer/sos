<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\UserTypeEnum;
use App\Models\Equipment;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MetricController extends Controller
{
    public function getCountOrderByPeriod(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)
                ->startOfDay()
                ->toDateTimeString();

            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)
                ->endOfDay()
                ->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $cacheKey = 'metrics:order:count_by_month:'
                .$request->startDate.':'
                .$request->endDate;

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
                        'technician',
                    ])
                        ->selectRaw("
                        TO_CHAR(created_at, 'YYYY-MM') as month,
                        COUNT(*) as count
                    ")
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->groupByRaw("TO_CHAR(created_at, 'YYYY-MM')")
                        ->orderByRaw("TO_CHAR(created_at, 'YYYY-MM')")
                        ->get()
                        ->toArray();
                }
            );

            return response($metrics);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
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
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $statuses = OrderStatus::all();

            $cacheKey = 'metrics:order:status_type:'.$request->startDate.':'.$request->endDate;

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate, $statuses) {

                    $metrics = [];

                    foreach ($statuses as $status) {
                        $metrics[$status->name] = $status->orders()
                            ->where(function ($query) use ($startDate, $endDate) {

                                if (! empty($startDate)) {
                                    $query->where('created_at', '>=', $startDate);
                                }

                                if (! empty($endDate)) {
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
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTotalPriceOrderByPeriod(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)
                ->startOfDay()
                ->toDateTimeString();

            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)
                ->endOfDay()
                ->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $cacheKey = 'metrics:order:total_price:'
                .$request->startDate.':'
                .$request->endDate;

            $cache = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    return Order::without([
                        'user',
                        'equipment',
                        'orderParts',
                        'images',
                        'status',
                        'technician',
                    ])
                        ->selectRaw("
                        TO_CHAR(created_at, 'YYYY-MM') as month,
                        SUM(total_price) as total_price
                    ")
                        ->where('status_id', OrderStatusEnum::DELIVERED->value)
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->groupByRaw("TO_CHAR(created_at, 'YYYY-MM')")
                        ->orderByRaw("TO_CHAR(created_at, 'YYYY-MM')")
                        ->get();
                }
            );

            return response($cache);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
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
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $cacheKey = 'metrics:order:revenue:'.$request->startDate.':'.$request->endDate;

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    $orderStatuses = OrderStatus::with('orders')->get();

                    $revenue = [];

                    foreach ($orderStatuses as $status) {
                        $revenue[$status->name] = $status->orders()
                            ->where(function ($query) use ($startDate, $endDate) {
                                if (! empty($startDate)) {
                                    $query->where('created_at', '>=', $startDate);
                                }

                                if (! empty($endDate)) {
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
                    'revenue' => $value,
                ];
            }, array_keys($metrics), $metrics);

            return response($metrics, 200);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTechnicianData(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)
                ->startOfDay()
                ->toDateTimeString();

            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)
                ->endOfDay()
                ->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $cacheKey = 'metrics:order:technician:'
                .str_replace('/', '-', $request->startDate)
                .':'
                .str_replace('/', '-', $request->endDate);

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    return User::query()
                        ->where('type_id', UserTypeEnum::TECHNICIAN->value)

                        ->whereHas('technician_orders', function ($query) use ($startDate, $endDate) {
                            $query->where('status_id', OrderStatusEnum::FINISHED->value)
                                ->whereBetween('created_at', [
                                    $startDate,
                                    $endDate,
                                ]);
                        })

                        ->withCount([
                            'technician_orders as total_orders' => function ($query) use ($startDate, $endDate) {
                                $query->where('status_id', OrderStatusEnum::FINISHED->value)
                                    ->whereBetween('created_at', [
                                        $startDate,
                                        $endDate,
                                    ]);
                            },
                        ])

                        ->withSum([
                            'technician_orders as total_revenue' => function ($query) use ($startDate, $endDate) {
                                $query->where('status_id', OrderStatusEnum::FINISHED->value)
                                    ->whereBetween('created_at', [
                                        $startDate,
                                        $endDate,
                                    ]);
                            },
                        ], 'total_price')

                        ->get()
                        ->sortByDesc('total_revenue')
                        ->take(5)
                        ->values();
                }
            );

            return response($metrics, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas',
                'error' => $e->getMessage(),
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
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $cacheKey = 'metrics:order:equipment:'.$request->startDate.':'.$request->endDate;

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
                'error' => $e->getMessage(),
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
                    $orders = Order::where('status_id', OrderStatusEnum::PENDING->value)->count();

                    return $orders;
                }
            );

            return response(['result' => $metrics]);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
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
                    $orders = Order::where('status_id', OrderStatusEnum::IN_PROGRESS->value)->count();

                    return $orders;
                }
            );

            return response(['result' => $metrics]);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
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
                    $users = User::where('type_id', UserTypeEnum::CLIENT->value)->count();

                    return $users;
                }

            );

            return response(['result' => $metrics]);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getCustomerRevenueByPeriod(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->startDate)
                ->startOfDay()
                ->toDateTimeString();

            $endDate = Carbon::createFromFormat('d/m/Y', $request->endDate)
                ->endOfDay()
                ->toDateTimeString();

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de clientes',
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $cacheKey = 'metrics:order:customers:'
                .str_replace('/', '-', $request->startDate)
                .':'
                .str_replace('/', '-', $request->endDate);

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate) {

                    return User::query()
                        ->where('type_id', UserTypeEnum::CLIENT->value)
                        ->whereHas('orders', function ($query) use ($startDate, $endDate) {
                            $query->where('status_id', OrderStatusEnum::FINISHED->value)
                                ->whereBetween('created_at', [
                                    $startDate,
                                    $endDate,
                                ]);
                        })
                        ->withCount([
                            'orders as total_orders' => function ($query) use ($startDate, $endDate) {
                                $query->where('status_id', OrderStatusEnum::FINISHED->value)
                                    ->whereBetween('created_at', [
                                        $startDate,
                                        $endDate,
                                    ]);
                            },
                        ])
                        ->withSum([
                            'orders as total_revenue' => function ($query) use ($startDate, $endDate) {
                                $query->where('status_id', OrderStatusEnum::FINISHED->value)
                                    ->whereBetween('created_at', [
                                        $startDate,
                                        $endDate,
                                    ]);
                            },
                        ], 'total_price')
                        ->get()
                        ->map(function ($customer) {
                            $customer->total_revenue = $customer->total_revenue ?? 0;

                            return $customer;
                        })
                        ->sortByDesc('total_revenue')
                        ->take(5)
                        ->values();
                }
            );

            return response($metrics, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de clientes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getOrdersByPeriod(Request $request)
    {
        try {
            $startDate = Carbon::createFromFormat(
                'd/m/Y',
                $request->startDate
            )->startOfDay()->toDateTimeString();

            $endDate = Carbon::createFromFormat(
                'd/m/Y',
                $request->endDate
            )->endOfDay()->toDateTimeString();

            $description = trim($request->input('description', ''));

            if (empty($startDate) || empty($endDate)) {
                return response([
                    'message' => 'Não foi possível obter as métricas de ordem de serviço',
                    'error' => 'Necessário informar um período',
                ], 400);
            }

            $page = $request->integer('page', 1);

            $cacheKey = sprintf(
                'metrics:order:by_period:%s:%s:%s:page:%d',
                $request->startDate,
                $request->endDate,
                md5($description),
                $page
            );

            $metrics = Cache::tags('metrics')->remember(
                $cacheKey,
                now()->addMinutes(30),
                function () use ($startDate, $endDate, $description) {

                    return Order::with([
                        'user',
                        'equipment',
                        'status',
                        'parts',
                    ])
                        ->whereBetween('created_at', [
                            $startDate,
                            $endDate,
                        ])
                        ->when(
                            ! empty($description),
                            function ($query) use ($description) {
                                $query->where(function ($q) use ($description) {

                                    // Busca pelo título
                                    $q->whereRaw(
                                        'unaccent(title) ILIKE unaccent(?)',
                                        ["%{$description}%"]
                                    )

                                        // Busca pelo usuário
                                        ->orWhereHas('user', function ($user) use ($description) {
                                            $user->whereRaw(
                                                'unaccent(name) ILIKE unaccent(?)',
                                                ["%{$description}%"]
                                            );
                                        });
                                });
                            }
                        )
                        ->orderByDesc('created_at')
                        ->paginate(20);
                }
            );

            return response($metrics);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as métricas de ordem de serviço',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
