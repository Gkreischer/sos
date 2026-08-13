<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class OrderController extends Controller
{
    public function getAll()
    {
        try {

            $orders = Order::orderBy('created_at', 'desc')->paginate(20);
            return response($orders);
        } catch (Exception $e) {
            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function getById(int $id)
    {
        try {
            // Buscar a ordem de serviço com as partes relacionadas
            $order = Order::findOrFail($id);

            return response($order);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(int $id, Request $request)
    {
        try {

            $order = DB::transaction(function () use ($id, $request) {

                $order = Order::lockForUpdate()->findOrFail($id);

                if ($request->has('parts')) {

                    // IDs das peças enviadas pelo frontend
                    $ids = collect($request->parts)
                        ->pluck('id')
                        ->filter()
                        ->toArray();

                    // Remove peças que não existem mais
                    $order->parts()
                        ->when(!empty($ids), function ($query) use ($ids) {
                            $query->whereNotIn('id', $ids);
                        })
                        ->when(empty($ids), function ($query) {
                            // Remove todas se frontend enviar []
                            $query->whereNotNull('id');
                        })
                        ->delete();

                    // Atualiza ou cria peças
                    foreach ($request->parts as $part) {

                        $order->parts()->updateOrCreate(
                            [
                                'id' => $part['id'] ?? null,
                            ],
                            [
                                'name' => $part['name'],
                                'quantity' => $part['quantity'],
                                'price' => $part['price'],
                            ]
                        );
                    }
                }

                // Atualiza ordem
                $order->update(
                    $request->except('parts')
                );

                // Recarrega relacionamentos
                $order->load(
                    'user',
                    'equipment',
                    'parts',
                    'pictures',
                    'status',
                    'attendant',
                    'technician'
                );

                return $order;
            });

            Cache::tags('metrics')->flush();

            return response($order);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível atualizar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function searchByFilter(Request $request)
    {
        try {
            $status_id = $request->status_id;
            $search_term = trim($request->search ?? '');

            $start_date = !empty($request->start_date)
                ? Carbon::createFromFormat(
                    'd/m/Y',
                    trim($request->start_date)
                )->startOfDay()
                : null;

            $end_date = !empty($request->end_date)
                ? Carbon::createFromFormat(
                    'd/m/Y',
                    trim($request->end_date)
                )->endOfDay()
                : null;

            $orders = Order::query()
                ->select(
                    'orders.id',
                    'orders.title',
                    'orders.created_at',
                    'orders.status_id',
                    'orders.user_id',
                    'orders.equipment_id'
                )
                ->with([
                    'user:id,name',
                    'equipment:id,name',
                    'status:id,name'
                ])

                // Filtro por status
                ->when(
                    isset($status_id) && $status_id != 0,
                    function ($query) use ($status_id) {
                        $query->where(
                            'orders.status_id',
                            $status_id
                        );
                    }
                )

                // Filtro por texto
                ->when(
                    !empty($search_term),
                    function ($query) use ($search_term) {
                        $query->where(function ($q) use ($search_term) {

                            // Busca por ID
                            if (is_numeric($search_term)) {
                                $q->orWhere(
                                    'orders.id',
                                    (int) $search_term
                                );
                            }

                            // Busca por título
                            $q->orWhereRaw(
                                'unaccent(orders.title) ILIKE unaccent(?)',
                                ["%{$search_term}%"]
                            )

                                // Busca por usuário
                                ->orWhereHas('user', function ($q2) use ($search_term) {
                                    $q2->whereRaw(
                                        'unaccent(name) ILIKE unaccent(?)',
                                        ["%{$search_term}%"]
                                    );
                                });
                        });
                    }
                )

                // Entre duas datas
                ->when(
                    $start_date && $end_date,
                    function ($query) use ($start_date, $end_date) {
                        $query->whereBetween(
                            'orders.created_at',
                            [$start_date, $end_date]
                        );
                    }
                )

                // Maior ou igual à data inicial
                ->when(
                    $start_date && !$end_date,
                    function ($query) use ($start_date) {
                        $query->where(
                            'orders.created_at',
                            '>=',
                            $start_date
                        );
                    }
                )

                // Menor ou igual à data final
                ->when(
                    !$start_date && $end_date,
                    function ($query) use ($end_date) {
                        $query->where(
                            'orders.created_at',
                            '<=',
                            $end_date
                        );
                    }
                )

                ->latest('orders.id')
                ->paginate(20);

            return response()->json($orders);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Não foi possível carregar as ordens de serviço',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'required|integer',
            'equipment_id' => 'required|integer',
            'status_id' => 'required|integer',
            'attendant_id' => 'required|integer|exists:users,id',
            'ticket_id' => 'nullable|integer|exists:tickets,id',

            'description' => 'nullable|string',
            'obs' => 'nullable|string',
            'service_description' => 'nullable|string',
            'diagnostic' => 'nullable|string',

            'parts_price' => 'required|numeric|min:0',
            'service_price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',

            'signature' => 'nullable|string',
            'parts' => 'nullable|array',
            'parts.*.part_id' => 'required|integer',
            'parts.*.quantity' => 'required|integer|min:1',
            'parts.*.price' => 'required|numeric|min:0',
            'pictures' => 'nullable|array',
            'pictures.*' => 'image',
        ]);

        $storedPictures = [];

        try {

            $order = DB::transaction(function () use ($request, $data) {
                $data['user_id'] = auth('sanctum')->user()->id;
                $order = Order::create($data);

                if (!empty($data['ticket_id'])) {
                    $ticket = Ticket::findOrFail($data['ticket_id']);

                    $order->ticket()->save($ticket);
                }

                if ($request->hasFile('pictures')) {

                    foreach ($request->file('pictures') as $picture) {

                        $path = $picture->store("orders/{$order->id}", 'public');

                        $publicPath = Storage::url($path);

                        $order->pictures()->create([
                            'path' => $publicPath,
                        ]);
                    }
                }

                return $order->fresh();
            });

            Cache::tags('metrics')->flush();

            return response($order, 201);
        } catch (\Throwable $e) {

            // Remove arquivos que ficaram no disco
            foreach ($storedPictures as $path) {
                Storage::disk('public')->delete($path);
            }

            return response([
                'message' => 'Não foi possível criar a ordem de serviço.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getOrderHistory(int $id)
    {
        try {
            $order = User::findOrFail($id)->orders()->with('status')->orderByDesc('created_at')->get();

            $order->load(['status', 'technician', 'user', 'equipment', 'attendant']);

            return response($order);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
